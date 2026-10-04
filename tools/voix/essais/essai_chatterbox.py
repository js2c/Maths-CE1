"""ESSAI D'UNE NOUVELLE VOIX : Chatterbox Multilingual (Resemble AI) à la place de Piper.

Tourne sur l'ordinateur du parent (carte graphique NVIDIA), jamais sur la tablette. Ne modifie rien dans
l'application : il fabrique une trentaine de phrases du jeu avec plusieurs réglages, et une page d'écoute
(tools/voix/essais/out/ecoute.html) où chaque phrase est à côté de la voix actuelle (Piper).

Installation, une fois (Python 3.11 conseillé ; l'ordre compte : sans la première ligne, pip installe un
PyTorch sans carte graphique) :

    python -m venv .venv-voix
    .venv-voix\\Scripts\\activate                      (Windows ; sous Linux : source .venv-voix/bin/activate)
    pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124
    pip install git+https://github.com/resemble-ai/chatterbox.git soundfile

Lancement, depuis la racine du dépôt :

    python tools/voix/essais/essai_chatterbox.py --ref ma-voix.wav
    python tools/voix/essais/essai_chatterbox.py --ref voix-a.wav --ref voix-b.wav --graines 3
    python tools/voix/essais/essai_chatterbox.py                  (sans --ref : la voix par défaut du modèle)

--ref : un enregistrement de référence de 10 à 15 secondes, en français, sans musique ni bruit de fond,
dit sur le ton voulu pour le jeu (chaleureux, posé, souriant). Le modèle imite le timbre ET le ton de cet
extrait : c'est le premier levier contre une voix monotone. Seules les 10 premières secondes servent.
Le premier lancement télécharge le modèle (quelques Go).
"""
import argparse
import html
import json
import shutil
import sys
import time
from pathlib import Path

ICI = Path(__file__).resolve().parent
RACINE = ICI.parents[2]
ETAT = RACINE / "tools" / "voix" / "fabrique.json"  # phrase -> texte lu (nombres en lettres)
VOIX = RACINE / "app" / "assets" / "voix"  # la voix actuelle et son index

# Les réglages comparés. exaggeration : expressivité ; cfg_weight : fidélité au texte et au rythme de la
# référence (plus bas = plus lent, plus libre) ; temperature : part de hasard (plus bas = plus régulier).
REGLAGES = [
    ("neutre", dict(exaggeration=0.5, cfg_weight=0.5, temperature=0.8)),  # les valeurs par défaut du modèle
    ("vivant", dict(exaggeration=0.7, cfg_weight=0.3, temperature=0.8)),  # conseil du modèle pour une voix expressive
    ("régulier", dict(exaggeration=0.5, cfg_weight=0.5, temperature=0.5)),  # moins de hasard d'une phrase à l'autre
]

# L'échantillon : des phrases de l'inventaire réel (les clés de fabrique.json), choisies pour ce qui peut
# mal tourner. Les nombres seuls et les mots isolés sont le point faible connu de ce type de modèle.
PHRASES = [
    ("Nombres seuls", ["6", "10", "16", "66", "76", "80", "91", "99", "100", "370", "1000"]),
    ("Mots isolés", ["Bravo !", "Presque !", "Oh !", "trente,", "Attention…", "Tu vois ?", "Bonsoir !"]),
    ("Calcul", ["24 plus 63 ?", "76 moins 3 ?", "79 plus combien ?", "C'était 466.", "Ça fait 56."]),
    ("Consignes", [
        "Où est le nombre 808 ?",
        "Place le poisson sur le nombre 399.",
        "On part de 17, et on compte les sauts.",
        "Si tu veux que je m'appelle Octavie, touche la coche verte.",
    ]),
    ("Explications", [
        "406 : 4 centaines, 0 dizaine, 6 unités.",
        "On ne peut pas retirer 8 de 2 : on casse une dizaine.",
        "On n'écrit pas 800 puis 7 : le 7 prend la place des unités.",
        "Deux, c'est l'ami de huit pour faire dix !",
    ]),
    ("Encouragements et anecdotes", [
        "Ce n'est pas grave, regardons ensemble.",
        "Regarde tout ce que tu as gagné ce soir : 25 étoiles de mer !",
        "Le bénitier géant est le plus grand coquillage du monde : il peut peser aussi lourd que trois grandes personnes.",
    ]),
]


def charger_modele(nom, cpu):
    import torch

    if not torch.cuda.is_available() and not cpu:
        sys.exit(
            "PyTorch ne voit pas la carte graphique : c'est en général la version « CPU » qui a été installée.\n"
            "Refaire, dans l'environnement : pip install --force-reinstall torch==2.6.0 torchaudio==2.6.0 "
            "--index-url https://download.pytorch.org/whl/cu124\n(ou relancer avec --cpu pour essayer quand même, très lentement)"
        )
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS

    appareil = "cuda" if torch.cuda.is_available() else "cpu"
    try:
        modele = ChatterboxMultilingualTTS.from_pretrained(device=appareil, t3_model=nom)
    except TypeError:
        sys.exit(
            "Cette version de chatterbox ne connaît pas le modèle multilingue V3. Installer la version du dépôt :\n"
            "pip install --upgrade git+https://github.com/resemble-ai/chatterbox.git"
        )
    return torch, modele, appareil


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    p = argparse.ArgumentParser(description="Essai de la voix Chatterbox sur un échantillon de phrases du jeu.")
    p.add_argument("--ref", action="append", default=[], help="enregistrement de référence (répétable)")
    p.add_argument("--graines", type=int, default=2, help="versions de chaque phrase par réglage (défaut : 2)")
    p.add_argument("--modele", default="v3", help="modèle multilingue : v3 (défaut) ou v2")
    p.add_argument("--sortie", default=str(ICI / "out"), help="dossier de sortie")
    p.add_argument("--cpu", action="store_true", help="accepter de tourner sans carte graphique")
    a = p.parse_args()

    lu = json.loads(ETAT.read_text(encoding="utf-8"))["lu"]
    index = json.loads((VOIX / "index.json").read_text(encoding="utf-8"))["phrases"]
    refs = [Path(r) for r in a.ref]
    for r in refs:
        if not r.is_file():
            sys.exit(f"Enregistrement de référence introuvable : {r}")
    sortie = Path(a.sortie)
    (sortie / "sons").mkdir(parents=True, exist_ok=True)

    import soundfile as sf

    torch, modele, appareil = charger_modele(a.modele, a.cpu)
    print(f"modèle {a.modele} chargé sur {appareil}")

    # les voix : la voix par défaut du modèle s'il n'y a pas de référence, sinon une voix par référence
    voix = []
    if not refs:
        voix.append(("défaut", modele.conds))
    for r in refs:
        modele.prepare_conditionals(str(r))
        voix.append((r.stem, modele.conds))
    colonnes = [(v, c, nom, reg) for v, c in voix for nom, reg in REGLAGES]

    lignes, mesures, n = [], [], 0
    total = sum(len(ks) for _, ks in PHRASES) * len(colonnes) * a.graines
    for categorie, cles in PHRASES:
        for cle in cles:
            if cle not in lu:
                print(f"  (phrase absente de l'inventaire, ignorée : {cle})")
                continue
            texte, i = lu[cle], len(lignes)
            actuelle = None
            if cle in index and (VOIX / index[cle][0]).is_file():
                actuelle = f"sons/{i:02d}-piper.ogg"
                shutil.copyfile(VOIX / index[cle][0], sortie / actuelle)
            cases = []
            for j, (nom_voix, conds, nom_reg, reg) in enumerate(colonnes):
                modele.conds = conds
                sons = []
                for g in range(a.graines):
                    torch.manual_seed(1000 + g)
                    if appareil == "cuda":
                        torch.cuda.manual_seed_all(1000 + g)
                    t0 = time.perf_counter()
                    wav = modele.generate(texte, language_id="fr", **reg)
                    dt = time.perf_counter() - t0
                    wav = wav.squeeze(0).cpu().numpy()
                    f = f"sons/{i:02d}-v{j:02d}-g{g}.wav"
                    sf.write(str(sortie / f), wav, modele.sr)
                    sons.append(f)
                    mesures.append(dict(phrase=cle, voix=nom_voix, reglage=nom_reg, graine=g, calcul_s=round(dt, 2),
                                        duree_s=round(len(wav) / modele.sr, 2), caracteres=len(texte)))
                    n += 1
                    print(f"  {n}/{total}  {nom_voix} / {nom_reg}  {dt:4.1f} s  {texte[:50]}")
                cases.append(sons)
            lignes.append((categorie, cle, texte, actuelle, cases))

    # durée du lot complet, estimée au temps de calcul par caractère (la toute première phrase, plus lente, est écartée)
    utiles = mesures[1:] or mesures
    par_car = sum(m["calcul_s"] for m in utiles) / max(1, sum(m["caracteres"] for m in utiles))
    heures = par_car * sum(len(t) for t in lu.values()) / 3600
    pic = round(torch.cuda.max_memory_allocated() / 2**30, 1) if appareil == "cuda" else None
    bilan = dict(modele=a.modele, appareil=appareil, memoire_carte_Go=pic, phrases_du_jeu=len(lu),
                 lot_complet_heures=round(heures, 1), mesures=mesures)
    (sortie / "mesures.json").write_text(json.dumps(bilan, ensure_ascii=False, indent=1), encoding="utf-8")

    # la page d'écoute
    e = html.escape
    audio = lambda f: f'<audio controls preload="none" src="{e(f)}"></audio>' if f else "—"
    tete = "".join(f"<th>{e(v)}<br>{e(nom)}<br><small>{e(', '.join(f'{k} {x}' for k, x in reg.items()))}</small></th>"
                   for v, _, nom, reg in colonnes)
    corps, courante = [], None
    for categorie, cle, texte, actuelle, cases in lignes:
        if categorie != courante:
            corps.append(f'<tr class="cat"><td colspan="{2 + len(colonnes)}">{e(categorie)}</td></tr>')
            courante = categorie
        dit = f"<br><small>{e(texte)}</small>" if texte != cle else ""
        corps.append(f"<tr><td>{e(cle)}{dit}</td><td>{audio(actuelle)}</td>"
                     + "".join(f"<td>{'<br>'.join(audio(f) for f in sons)}</td>" for sons in cases) + "</tr>")
    page = f"""<!doctype html><html lang="fr"><meta charset="utf-8"><title>Essai de voix : Chatterbox</title>
<style>body{{font:15px system-ui,sans-serif;margin:24px;color:#1c2b33}}table{{border-collapse:collapse}}
td,th{{border:1px solid #c9d6dc;padding:6px 10px;vertical-align:top;text-align:left}}th{{background:#eaf3f6;position:sticky;top:0}}
tr.cat td{{background:#16465a;color:#fff;font-weight:600}}small{{color:#5b7079}}audio{{height:32px;width:230px}}
td:first-child{{max-width:340px}}</style>
<h1>Essai de voix : Chatterbox ({e(a.modele)})</h1>
<p>Chaque case contient {a.graines} version(s) de la même phrase avec le même réglage : si elles diffèrent beaucoup
(rythme, hauteur, mot avalé, bruit en fin de phrase), la voix sera irrégulière d'une phrase à l'autre dans le jeu.
Écouter d'abord les nombres seuls et les mots isolés.</p>
<p>Lot complet ({len(lu)} phrases) : environ <b>{heures:.1f} h</b> de calcul sur cette machine avec un essai par phrase
{f"; mémoire de la carte utilisée : {pic} Go" if pic else ""}.</p>
<table><tr><th>Phrase</th><th>Voix actuelle<br>(Piper)</th>{tete}</tr>{''.join(corps)}</table></html>"""
    (sortie / "ecoute.html").write_text(page, encoding="utf-8")
    print(f"\n{n} sons fabriqués. Lot complet estimé : {heures:.1f} h" + (f", mémoire de la carte : {pic} Go" if pic else ""))
    print(f"Ouvrir dans le navigateur : {sortie / 'ecoute.html'}")


if __name__ == "__main__":
    main()
