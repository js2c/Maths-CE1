"""ESSAI D'ÉCRITURES : comment écrire six, huit, dix, cinq devant une opération pour que Chatterbox les dise en entier ?

Pour chaque phrase, plusieurs écritures du même texte sont fabriquées avec plusieurs tirages (réglage
« régulier » du lot), puis retranscrites et comparées au texte attendu, comme dans le lot. Le script affiche
le taux de réussite de chaque écriture et écrit une page d'écoute. Il ne modifie rien dans l'application.

    python tools\\voix\\essais\\essai_ecritures.py --ref ..\\ref-posee.wav
"""
import argparse
import html
import sys
from pathlib import Path

ICI = Path(__file__).resolve().parent
sys.path.insert(0, str(ICI.parent))
from chatterbox_lot import comparer, soigner  # la même comparaison et le même soin du son que le lot

REGLAGES = dict(exaggeration=0.5, cfg_weight=0.5, temperature=0.5)
ECRITURES = ["actuelle", "réécrite", "en chiffres"]
# (texte attendu, c'est-à-dire l'écriture actuelle ; puis les autres écritures, None s'il n'y en a pas)
# Le contrôle écrit « 26 » que la voix dise « vingt-si » ou « vingt-sisse » : seule l'oreille juge.
PHRASES = [
    ("vingt-six plusse dix ?", "vingt-sisse plusse dix ?", "26 plusse 10 ?"),
    ("Combien font huit plusse sept ?", "Combien font huite plusse sept ?", "Combien font 8 plusse 7 ?"),
    ("dix plusse trois ?", "disse plusse trois ?", "10 plusse 3 ?"),
    ("cinq plusse deux ?", "cinque plusse deux ?", "5 plusse 2 ?"),
    ("six moins deux ?", "sisse moins deux ?", "6 moins 2 ?"),
    ("soixante-dix moins vingt ?", "soixante-disse moins vingt ?", "70 moins 20 ?"),
    ("dix-huit plusse combien ?", "dix-huite plusse combien ?", "18 plusse combien ?"),
    ("trente-six plusse huit, ça fait quarante-quatre.", "trente-sisse plusse huit, ça fait quarante-quatre.", "36 plusse 8, ça fait 44."),
    # témoins, à ne pas changer : devant un nom la forme courte est la bonne ; en fin de phrase, la forme pleine
    ("Place six poissons et huit perles.", None, None),
    ("Ça fait six.", None, None),
    ("Ça fait huit.", None, None),
    ("Ça fait dix.", None, None),
]


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    p = argparse.ArgumentParser()
    p.add_argument("--ref", required=True)
    p.add_argument("--graines", type=int, default=5)
    p.add_argument("--sortie", default=str(ICI.parents[2].parent / "essai-six"))
    p.add_argument("--whisper", default="openai/whisper-large-v3-turbo")
    a = p.parse_args()
    sortie = Path(a.sortie)
    (sortie / "sons").mkdir(parents=True, exist_ok=True)

    import librosa
    import numpy as np
    import soundfile as sf
    import torch
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    from transformers import WhisperForConditionalGeneration, WhisperProcessor

    appareil = "cuda" if torch.cuda.is_available() else "cpu"
    voix = ChatterboxMultilingualTTS.from_pretrained(device=appareil, t3_model="v3")
    voix.prepare_conditionals(a.ref, exaggeration=REGLAGES["exaggeration"])
    lecteur = WhisperProcessor.from_pretrained(a.whisper)
    oreille = WhisperForConditionalGeneration.from_pretrained(a.whisper).to(appareil)
    if appareil == "cuda":
        oreille = oreille.half()

    def transcrire(wav):
        son = librosa.resample(wav, orig_sr=voix.sr, target_sr=16000)
        x = lecteur(son, sampling_rate=16000, return_tensors="pt").input_features.to(appareil, dtype=oreille.dtype)
        with torch.inference_mode():
            ids = oreille.generate(x, language="fr", task="transcribe", max_new_tokens=96)
        return lecteur.batch_decode(ids, skip_special_tokens=True)[0].strip()

    justes, total, lignes = [0] * len(ECRITURES), [0] * len(ECRITURES), []
    for i, phrase in enumerate(PHRASES):
        cases = []
        for j, texte in enumerate(phrase):
            if texte is None:
                cases.append(None)
                continue
            essais = []
            for g in range(a.graines):
                torch.manual_seed(2000 + g)
                if appareil == "cuda":
                    torch.cuda.manual_seed_all(2000 + g)
                wav = soigner(voix.generate(texte, language_id="fr", **REGLAGES).squeeze(0).cpu().numpy(), voix.sr, np)
                entendu = transcrire(wav)
                juste = comparer(phrase[0], entendu)[0]  # toujours comparé au texte attendu
                f = f"sons/{i}-{j}-{g}.wav"
                sf.write(str(sortie / f), wav, voix.sr, subtype="PCM_16")
                essais.append((f, juste, entendu))
                justes[j] += juste
                total[j] += 1
                print(f"  {'juste ' if juste else 'REFUS '} {ECRITURES[j]:15} {texte}  ->  {entendu}")
            cases.append((texte, essais))
        lignes.append(cases)

    print("\nTaux de réussite par écriture :")
    for j, nom in enumerate(ECRITURES):
        if total[j]:
            print(f"  {nom:15} {justes[j]}/{total[j]}")
    e = html.escape
    def case(c):
        if c is None:
            return "<td>—</td>"
        sons = "".join(f"<div class='{'ok' if j else 'ko'}'><audio controls preload='none' src='{e(f)}'></audio> {e(t)}</div>" for f, j, t in c[1])
        return f"<td><b>{e(c[0])}</b>{sons}</td>"
    tete = "".join(f"<th>{e(n)}<br>{justes[j]}/{total[j]} justes</th>" for j, n in enumerate(ECRITURES))
    corps = "".join("<tr>" + "".join(case(c) for c in cases) + "</tr>" for cases in lignes)
    (sortie / "ecoute.html").write_text(f"""<!doctype html><html lang="fr"><meta charset="utf-8"><title>Essai d'écritures</title>
<style>body{{font:14px system-ui,sans-serif;margin:24px}}td,th{{border:1px solid #c9d6dc;padding:6px 10px;vertical-align:top;text-align:left}}
table{{border-collapse:collapse}}audio{{height:30px;width:200px;vertical-align:middle}}.ko{{background:#fde8e6}}.ok{{background:#e8f6ea}}div{{margin:3px 0;padding:2px}}</style>
<h1>Essai d'écritures</h1><p>Vert : le contrôle a reconnu le texte attendu. Rouge : refusé (à côté, ce qu'il a entendu).</p>
<table><tr>{tete}</tr>{corps}</table></html>""", encoding="utf-8")
    print(f"Page d'écoute : {sortie / 'ecoute.html'}")


if __name__ == "__main__":
    main()
