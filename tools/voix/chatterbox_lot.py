"""Synthèse d'un lot de phrases avec Chatterbox Multilingual, contrôlée par retranscription
(appelé par tools/voix/fabriquer.mjs, pas à la main).

Lit sur l'entrée standard un JSON { "ref", "reglages", "essais", "whisper", "dossier", "refaire",
"phrases": [{ "id", "cle", "texte" }] } et écrit, dans <dossier>, <id>.wav et <id>.json pour chaque phrase.

Chaque phrase n'est fabriquée qu'une fois. Elle est ensuite retranscrite (Whisper) et comparée au texte :
si un mot manque, est en trop ou est faux, ou si le son est anormalement long, elle est refaite avec un
autre tirage, jusqu'à `essais` fois. Celles qui échouent encore gardent leur meilleur essai et sont listées
dans <dossier>/a-reecouter.html. Le dossier sert de mémoire : relancer reprend là où le lot s'est arrêté.
"""
import difflib
import html
import json
import re
import sys
import time
import unicodedata
from pathlib import Path

# --- comparaison du texte attendu et de la retranscription -------------------------------------------
# Les deux sont ramenés à une même forme : minuscules sans accents, nombres en chiffres (« soixante-seize »
# et « 76 » deviennent 76), pluriels muets retirés. La ponctuation sépare les nombres (« vingt, trois »
# reste 20 puis 3) puis disparaît.

UNITES = {m: i for i, m in enumerate("zero un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize".split())}
UNITES["une"] = 1
DIZAINES = {"vingt": 20, "vingts": 20, "trente": 30, "quarante": 40, "cinquante": 50, "soixante": 60}


def _de_1_a_19(t, i):
    if i < len(t) and t[i] == "dix" and i + 1 < len(t) and t[i + 1] in ("sept", "huit", "neuf"):
        return 10 + UNITES[t[i + 1]], i + 2
    if i < len(t) and UNITES.get(t[i], 0) >= 1:
        return UNITES[t[i]], i + 1
    return None


def _moins_de_cent(t, i):
    if i >= len(t):
        return None
    m = t[i]
    if m == "quatre" and i + 1 < len(t) and t[i + 1] in ("vingt", "vingts"):
        suite = _de_1_a_19(t, i + 2)
        return (80 + suite[0], suite[1]) if suite else (80, i + 2)
    if m == "soixante":
        if i + 2 < len(t) and t[i + 1] == "et" and t[i + 2] in ("un", "une", "onze"):
            return 60 + UNITES[t[i + 2]], i + 3
        suite = _de_1_a_19(t, i + 1)
        return (60 + suite[0], suite[1]) if suite else (60, i + 1)
    if m in DIZAINES:
        if i + 2 < len(t) and t[i + 1] == "et" and t[i + 2] in ("un", "une"):
            return DIZAINES[m] + 1, i + 3
        if i + 1 < len(t) and 1 <= UNITES.get(t[i + 1], 0) <= 9:
            return DIZAINES[m] + UNITES[t[i + 1]], i + 2
        return DIZAINES[m], i + 1
    return _de_1_a_19(t, i)


def _moins_de_mille(t, i):
    if i >= len(t):
        return None
    cent = None
    if t[i] in ("cent", "cents"):
        cent = (100, i + 1)
    elif 2 <= UNITES.get(t[i], 0) <= 9 and i + 1 < len(t) and t[i + 1] in ("cent", "cents"):
        cent = (100 * UNITES[t[i]], i + 2)
    if cent:
        suite = _moins_de_cent(t, cent[1])
        return (cent[0] + suite[0], suite[1]) if suite else cent
    return _moins_de_cent(t, i)


def _nombre(t, i):
    if i < len(t) and t[i] == "zero":
        return 0, i + 1
    debut = (1, i) if i < len(t) and t[i] == "mille" else _moins_de_mille(t, i)
    if not debut:
        return None
    n, j = debut
    if j < len(t) and t[j] == "mille":
        suite = _moins_de_mille(t, j + 1)
        return (n * 1000 + suite[0], suite[1]) if suite else (n * 1000, j + 1)
    return debut


def forme(texte):
    """La liste des mots et des nombres d'un texte, sous la forme commune décrite plus haut."""
    s = unicodedata.normalize("NFKC", texte).lower().replace("’", "'").replace("œ", "oe")
    # les mots écrits comme ils se disent, pour la voix (lettres.mjs), reviennent à leur orthographe
    s = re.sub(r"\b(plusse|sisse|huite|disse|cinque)\b", lambda m: {"plusse": "plus", "sisse": "six", "huite": "huit", "disse": "dix", "cinque": "cinq"}[m.group(1)], s)
    s = re.sub(r"(\d)\s*[-−–]\s*(\d)", r"\1 moins \2", s).replace("+", " plus ").replace("=", " egale ")
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    s = re.sub(r"(?<!\d)(\d{1,3})[ \u00a0\u202f](\d{3})(?!\d)", r"\1\2", s)  # « 1 000 » -> 1000
    t = re.findall(r"\d+|[a-z']+|[.,;:!?…]", s)
    sortie, i = [], 0
    while i < len(t):
        n = _nombre(t, i)
        if n:
            sortie.append(str(n[0]))
            i = n[1]
            continue
        m = t[i].strip("'")
        i += 1
        if not m or m in ".,;:!?…":
            continue
        if m.isdigit():
            sortie.append(str(int(m)))
        else:
            sortie.append(m[:-1] if len(m) > 3 and m[-1] in "sx" else m)
    return sortie


def comparer(attendu, entendu):
    """(juste, score entre 0 et 1) : même nombre de mots, nombres identiques, mots identiques ou presque."""
    a, b = forme(attendu), forme(entendu)
    score = difflib.SequenceMatcher(None, a, b).ratio()
    if len(a) != len(b):
        return False, score
    for x, y in zip(a, b):
        if x == y:
            continue
        if x.isdigit() or y.isdigit() or difflib.SequenceMatcher(None, x, y).ratio() < 0.65:
            return False, score
    return True, score


# --- le son : silences coupés au début et à la fin, même volume pour toutes les phrases ------------------

def soigner(wav, sr, np):
    pas = sr // 100  # tranches de 10 ms
    n = len(wav) // pas
    if n < 5:
        return wav
    force = np.sqrt((wav[: n * pas].reshape(n, pas) ** 2).mean(axis=1))
    actives = np.nonzero(force > force.max() * 0.02)[0]  # au-dessus de -34 dB sous la tranche la plus forte
    debut, fin = max(0, actives[0] - 3), min(n, actives[-1] + 6)
    wav, force = wav[debut * pas: fin * pas], force[debut:fin]
    parole = force[force > force.max() * 0.1]
    gain = 0.08 / max(1e-6, float(np.sqrt((parole ** 2).mean())))  # environ -22 dB en moyenne sur la parole
    gain = min(gain, 0.95 / max(1e-6, float(np.abs(wav).max())))
    return (wav * gain).astype("float32")


def main():
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    job = json.loads(sys.stdin.buffer.read().decode("utf-8"))
    dossier = Path(job["dossier"])
    dossier.mkdir(parents=True, exist_ok=True)
    essais_max, reglages = int(job.get("essais", 4)), job["reglages"]
    dire = lambda *a: print(*a, file=sys.stderr, flush=True)

    # ce qui reste à faire : une phrase déjà fabriquée avec le même texte est gardée (sauf échec, si `refaire`)
    def fiche(p):
        try:
            f = json.loads((dossier / f"{p['id']}.json").read_text(encoding="utf-8"))
            return f if f.get("texte") == p["texte"] and (dossier / f"{p['id']}.wav").is_file() else None
        except (OSError, ValueError):
            return None

    fiches = {p["id"]: fiche(p) for p in job["phrases"]}
    afaire, vus = [], set()
    for p in job["phrases"]:
        f = fiches[p["id"]]
        if p["id"] not in vus and (f is None or p.get("forcer") or (job.get("refaire") and not f["juste"])):
            afaire.append(p)
        vus.add(p["id"])
    dire(f"  {len(vus) - len(afaire)} phrases déjà fabriquées, {len(afaire)} à fabriquer")

    if afaire:
        import librosa
        import numpy as np
        import soundfile as sf
        import torch

        if not torch.cuda.is_available() and not job.get("cpu"):
            sys.exit("PyTorch ne voit pas la carte graphique (voir le tutoriel de l'essai, « Si ça coince »).")
        appareil = "cuda" if torch.cuda.is_available() else "cpu"
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        from transformers import WhisperForConditionalGeneration, WhisperProcessor

        voix = ChatterboxMultilingualTTS.from_pretrained(device=appareil, t3_model="v3")
        voix.prepare_conditionals(job["ref"], exaggeration=reglages["exaggeration"])
        lecteur = WhisperProcessor.from_pretrained(job["whisper"])
        oreille = WhisperForConditionalGeneration.from_pretrained(job["whisper"]).to(appareil)
        if appareil == "cuda":
            oreille = oreille.half()
        oreille.eval()

        def transcrire(wav, sr):
            son = librosa.resample(wav, orig_sr=sr, target_sr=16000)
            x = lecteur(son, sampling_rate=16000, return_tensors="pt").input_features.to(appareil, dtype=oreille.dtype)
            with torch.inference_mode():
                ids = oreille.generate(x, language="fr", task="transcribe", max_new_tokens=96)
            return lecteur.batch_decode(ids, skip_special_tokens=True)[0].strip()

        t0 = time.time()
        for k, p in enumerate(afaire, 1):
            ancienne = fiches[p["id"]]
            depart = ancienne["essais"] if ancienne else 0  # « refaire » continue avec de nouveaux tirages
            meilleur = None
            for e in range(depart, depart + essais_max):
                torch.manual_seed(1000 + e)
                if appareil == "cuda":
                    torch.cuda.manual_seed_all(1000 + e)
                wav = voix.generate(p["texte"], language_id="fr", **reglages).squeeze(0).cpu().numpy()
                wav = soigner(wav, voix.sr, np)
                duree = len(wav) / voix.sr
                entendu = transcrire(wav, voix.sr)
                juste, score = comparer(p.get("attendu", p["texte"]), entendu)  # « attendu » : le texte normal, si l'écriture est particulière
                if duree > 1.5 + 0.13 * len(p["texte"]) or duree < 0.25:  # son anormalement long (mots inventés) ou vide
                    juste = False
                if meilleur is None or juste or score > meilleur[1]["score"]:
                    meilleur = (wav, dict(texte=p["texte"], juste=juste, score=round(score, 3), entendu=entendu,
                                          essais=e + 1, duree=round(duree, 2)))
                if juste:
                    break
            meilleur[1]["essais"] = e + 1
            sf.write(str(dossier / f"{p['id']}.wav"), meilleur[0], voix.sr, subtype="PCM_16")
            (dossier / f"{p['id']}.json").write_text(json.dumps(meilleur[1], ensure_ascii=False), encoding="utf-8")
            fiches[p["id"]] = meilleur[1]
            if not meilleur[1]["juste"]:
                dire(f"  à réécouter : « {p['texte']} », entendu « {meilleur[1]['entendu']} »")
            if k % 25 == 0 or k == len(afaire):
                reste = (time.time() - t0) / k * (len(afaire) - k)
                dire(f"  {k}/{len(afaire)}  encore environ {reste / 60:.0f} min")

    # le bilan et la page des phrases à réécouter
    toutes = [(p, fiches[p["id"]]) for p in job["phrases"]]
    ratees = [(p, f) for p, f in toutes if not f["juste"]]
    bilan = dict(phrases=len(toutes), justes_au_premier_essai=sum(f["juste"] and f["essais"] == 1 for _, f in toutes),
                 justes_apres_reprise=sum(f["juste"] and f["essais"] > 1 for _, f in toutes), a_reecouter=len(ratees),
                 duree_totale_min=round(sum(f["duree"] for _, f in toutes) / 60, 1))
    (dossier / "rapport.json").write_text(json.dumps(bilan, ensure_ascii=False, indent=1), encoding="utf-8")
    e = html.escape
    rangs = "".join(f"<tr><td>{e(p['cle'])}<br><small>{e(p['texte'])}</small></td><td>{e(f['entendu'])}</td>"
                    f"<td><audio controls preload='none' src='{e(p['id'])}.wav'></audio></td></tr>" for p, f in ratees)
    (dossier / "a-reecouter.html").write_text(f"""<!doctype html><html lang="fr"><meta charset="utf-8"><title>Phrases à réécouter</title>
<style>body{{font:15px system-ui,sans-serif;margin:24px}}td,th{{border:1px solid #c9d6dc;padding:6px 10px;text-align:left}}
table{{border-collapse:collapse}}small{{color:#5b7079}}</style>
<h1>{len(ratees)} phrase(s) à réécouter sur {len(toutes)}</h1>
<p>Le contrôle automatique n'a pas reconnu le texte attendu. Si le son est bon à l'oreille, il n'y a rien à faire
(le contrôle se trompe parfois sur les mots très courts et les noms propres). S'il est mauvais : relancer avec
<code>--refaire</code> pour de nouveaux tirages, ou allonger le texte dans <code>app/content/</code>.</p>
<table><tr><th>Phrase</th><th>Ce que le contrôle a entendu</th><th>Son gardé</th></tr>{rangs}</table></html>""", encoding="utf-8")
    dire(f"  bilan : {json.dumps(bilan, ensure_ascii=False)}")


if __name__ == "__main__":
    main()
