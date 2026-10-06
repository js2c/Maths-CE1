#!/usr/bin/env python3
"""Préparation des vidéos de la mascotte (application Maths CE1).

Deux commandes :

  python3 outils-mascotte.py preparer SOURCE.mp4 NOM --reference AUTRE_SOURCE.mp4 [--dossier v]
      Repère les images figées au début et à la fin de la vidéo générée, coupe en gardant aux deux bouts
      une image identique à la pose de référence, recadre sur la tête (450 x 600) et encode en MP4 (H.264)
      et WebM (VP9). Affiche les images gardées pour contrôle.

  python3 outils-mascotte.py mesurer [--dossier v] [--json clips.json]
      Mesure, pour chaque clip du dossier, les moments où il repasse par la pose de référence :
        n : visage entier dans la pose de référence (raccord invisible, fondu 0,1 s) ;
        s : tête dans la pose de référence, seule la bouche diffère (fondu 0,2 s, lu comme une bouche qui se ferme).
      Produit la table CLIPS utilisée par le lecteur de la mascotte.

Règles de coupe (vérifiées sur les 17 premiers clips) :
  - les mesures se font sur l'image recadrée, réduite à 42 x 56 et en niveaux de gris : le bruit de compression
    (qui revient toutes les 4 images dans les vidéos générées) disparaît, le mouvement reste ;
  - la pose de référence est la 1re image d'une AUTRE vidéo générée depuis la même image de départ (la vidéo
    « idle » d'origine a servi pour les 17 premiers clips) : encodée séparément, elle est à égale distance (bruit
    de fond) des images figées du début et de la fin, alors que la 1re image du clip lui-même avantage le début ;
  - une image est « active » si elle s'écarte de la pose de départ de plus de 0,25 au-dessus du bruit de fond,
    ou si elle diffère de la précédente de plus de 0,62 ;
  - début : l'image juste avant la première image active ;
  - fin : la première image, après le dernier mouvement, revenue à moins de 0,12 du bruit de fond, en laissant au
    plus 8 images (0,33 s) à la pose pour se poser ;
  - un petit mouvement isolé dans les 6 dernières images, après au moins 12 images calmes, est écarté
    (cas de « clin d'oeil » et « coup d'oeil », où la vidéo générée repart juste avant la fin).
Dépendances : ffmpeg, numpy.
"""
import argparse, glob, json, os, subprocess, sys
import numpy as np

CROP = "crop=672:896:24:192"          # cadrage tête, sur une source 720 x 1280
SCALE = "scale=450:600:flags=lanczos"


def lire(path, recadrer=True):
    vf = (CROP + "," if recadrer else "") + "scale=168:224"
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", vf, "-f", "rawvideo", "-pix_fmt", "gray", "-"],
                         capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, 224, 168).astype(float)
    return a.reshape(len(a), 56, 4, 42, 4).mean(axis=(2, 4))      # 42 x 56, bruit de compression lissé


def points_de_coupe(a, ref):
    N = len(a)
    d = np.abs(a - ref).mean(axis=(1, 2))
    pas = np.r_[0, np.abs(np.diff(a, axis=0)).mean(axis=(1, 2))]
    fond = float(np.median(np.r_[d[:6], d[-6:]]))
    actif = (d > fond + 0.25) | (pas > 0.62)
    idx = np.where(actif)[0]
    if not len(idx):
        return 0, N - 1, fond, None
    blocs = []
    for i in idx:
        if blocs and i - blocs[-1][1] <= 12:
            blocs[-1][1] = int(i)
        else:
            blocs.append([int(i), int(i)])
    ecarte = None
    if len(blocs) > 1 and blocs[-1][0] - blocs[-2][1] > 12 and N - 1 - blocs[-1][1] < 6:
        ecarte = blocs.pop()
    debut = max(0, blocs[0][0] - 1)
    fin = min(blocs[-1][1] + 1, N - 1)
    borne = min(fin + 8, N - 1)                                # au plus 8 images (0,33 s) pour laisser la pose se poser
    while fin < borne and d[fin] > fond + 0.12:
        fin += 1
    return debut, fin, fond, ecarte


def preparer(src, nom, dossier, reference):
    os.makedirs(dossier, exist_ok=True)
    a = lire(src)
    ref = lire(reference)[0]                                   # 1re image d'une AUTRE vidéo faite depuis la même image de départ
    s, e, fond, ecarte = points_de_coupe(a, ref)
    print(f"{nom} : {len(a)} images, garder {s} à {e} ({s / 24:.2f} s → {(e + 1) / 24:.2f} s, {(e - s + 1) / 24:.2f} s)"
          + (f", mouvement final écarté images {ecarte[0]}-{ecarte[1]}" if ecarte else ""))
    vf = f"select='between(n\\,{s}\\,{e})',setpts=N/24/TB,{CROP},{SCALE},format=yuv420p"
    mp4 = os.path.join(dossier, nom + ".mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-an", "-vf", vf, "-r", "24", "-c:v", "libx264", "-profile:v", "main",
                    "-crf", "28", "-preset", "slow", "-g", "24", "-movflags", "+faststart", mp4], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "38", "-row-mt", "1",
                    "-deadline", "good", "-cpu-used", "2", "-g", "24", "-an", os.path.join(dossier, nom + ".webm")], check=True)
    print(f"  → {mp4} et .webm")


def fenetres(ok, mini):
    r, i = [], 0
    while i < len(ok):
        if ok[i]:
            j = i
            while j + 1 < len(ok) and ok[j + 1]:
                j += 1
            if j - i + 1 >= mini:
                r.append([round(i / 24, 3), round((j + 1) / 24, 3)])
            i = j + 1
        else:
            i += 1
    return r


def mesurer(dossier, sortie):
    noms = sorted(os.path.basename(f)[:-4] for f in glob.glob(os.path.join(dossier, "*.mp4")))
    C = {n: lire(os.path.join(dossier, n + ".mp4"), recadrer=False) for n in noms}
    R = np.median(np.array([C[n][0] for n in noms] + [C[n][-1] for n in noms]), axis=0)   # pose de référence
    masque = np.ones((56, 42), bool)
    masque[35:48, 10:32] = False                                                          # bouche et menton exclus
    table, pire = {}, 0
    for n in noms:
        a = C[n]
        visage = np.abs(a - R).mean(axis=(1, 2))
        tete = np.abs(a - R)[:, masque].mean(axis=1)
        pire = max(pire, visage[0], visage[-1])
        table[n] = {"d": round(len(a) / 24, 3),
                    "n": fenetres(visage <= max(visage[0], visage[-1]) + 0.35, 2),
                    "s": fenetres(tete <= max(tete[0], tete[-1]) + 0.8, 4)}
    raccords = [np.abs(C[x][-1] - C[y][0]).mean() for x in noms for y in noms]
    print(f"{len(noms)} clips ; écart fin(A) → début(B) : médiane {np.median(raccords):.2f}, pire {max(raccords):.2f} "
          f"(un mouvement normal fait 1,4 entre deux images : au-delà de 3, vérifier le clip)")
    for n, v in table.items():
        print(f"    '{n}': {{ d: {v['d']}, n: {json.dumps(v['n'])}, s: {json.dumps(v['s'])} }},")
    if sortie:
        json.dump(table, open(sortie, "w"), indent=1)
        print(f"→ {sortie}")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest="cmd", required=True)
    a = sp.add_parser("preparer"); a.add_argument("source"); a.add_argument("nom"); a.add_argument("--dossier", default="v")
    a.add_argument("--reference", required=True, help="une autre vidéo générée depuis la même image de départ (sa 1re image sert de pose de référence)")
    b = sp.add_parser("mesurer"); b.add_argument("--dossier", default="v"); b.add_argument("--json")
    x = p.parse_args()
    if x.cmd == "preparer":
        preparer(x.source, x.nom, x.dossier, x.reference)
    else:
        mesurer(x.dossier, x.json)
