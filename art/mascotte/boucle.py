# LA BOUCLE D'ATTENTE DE LA MASCOTTE DANS LE RÉCIF (lot « Nouveaux boutons, mascotte du récif et étoiles », demande du parent du
# 7 novembre 2026). La petite tête fixe du récif (tete.py, retirée) avait l'air cassée. La vraie mascotte, réduite à sa place, coûtait
# trop au récif (mesure sur le banc : docs/JOURNAL-CONCEPTION.md) : dans le récif, elle est donc une courte BOUCLE D'IMAGES tirée de
# ses clips d'attente, jouée par le navigateur sans aucun calcul (une animation de transformation), et la vraie vidéo seulement le
# temps de sa phrase.
# La boucle : le clip « idle-immobile » (un clignement), puis « idle-respiration » (les yeux qui se ferment doucement), chacun suivi
# d'un temps immobile ; tous deux commencent et finissent sur la pose de référence : la boucle se raccorde sans saut. Chaque image
# est la vidéo entière (450 × 600, la place de la mascotte), détourée par la MÊME règle que la carte graphique dans l'application
# (app/js/engine/mascotte.js, `key`), réduite à 2 fois sa taille dans le récif (118 × 157 px de scène : 236 × 314) ; deux images
# presque identiques n'en font qu'une (la mémoire de la planche). Écrit app/assets/tete/mascotte-boucle.webp (une planche en grille)
# et mascotte-boucle.json (la taille d'une image, les colonnes, et la suite : l'image et sa durée). Déterministe.
#   python art/mascotte/boucle.py            (ffmpeg dans le PATH, ou la variable FFMPEG ; numpy, Pillow)
import json, os, subprocess
import numpy as np
from PIL import Image

ICI = os.path.dirname(os.path.abspath(__file__))
SORTIE = os.path.join(ICI, "..", "..", "app", "assets", "tete")
# (le clip, puis la pause immobile qui le suit, en ms)
SUITE = [("idle-immobile", 900), ("idle-respiration", 1400)]
IPS, W, H, COLS = 10, 236, 314, 8
SEUIL = 2.2  # écart moyen (sur 255) sous lequel une image reprend la précédente

def images(clip):
    ff = os.environ.get("FFMPEG", "ffmpeg")
    raw = subprocess.run([ff, "-v", "error", "-i", os.path.join(ICI, "v", f"{clip}.webm"), "-vf", f"fps={IPS}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], check=True, capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, 600, 450, 3).astype(np.float32) / 255
    return list(a)

def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)

def detourer(c):
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    m = np.maximum(r, b)
    al = 1 - smoothstep(0.098, 0.275, g - m)
    return np.concatenate([np.stack([r, np.minimum(g, m), b], -1), al[..., None]], -1)

def reduire(rgba):
    # (réduction sur l'image prémultipliée : pas de liseré vert ni sombre au bord)
    pm = rgba.copy(); pm[..., :3] *= pm[..., 3:4]
    im = Image.fromarray((pm * 255 + 0.5).astype(np.uint8), "RGBA").resize((W, H), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255
    al = a[..., 3:4]; rgb = np.where(al > 1e-3, a[..., :3] / np.maximum(al, 1e-3), 0)
    return np.concatenate([np.clip(rgb, 0, 1), al], -1)

def main():
    uniques, suite = [], []
    for clip, pause in SUITE:
        fr = [reduire(detourer(x)) for x in images(clip)]
        for k, f in enumerate(fr):
            if uniques and np.abs(f - uniques[-1]).mean() * 255 < SEUIL and suite:
                suite[-1][1] += 1000 // IPS
            else:
                uniques.append(f); suite.append([len(uniques) - 1, 1000 // IPS])
        suite[-1][1] += pause
    rows = (len(uniques) + COLS - 1) // COLS
    planche = np.zeros((rows * H, COLS * W, 4), np.float32)
    for i, f in enumerate(uniques): planche[(i // COLS) * H:(i // COLS + 1) * H, (i % COLS) * W:(i % COLS + 1) * W] = f
    os.makedirs(SORTIE, exist_ok=True)
    Image.fromarray((planche * 255 + 0.5).astype(np.uint8), "RGBA").save(os.path.join(SORTIE, "mascotte-boucle.webp"), quality=88, method=6)
    total = sum(d for _, d in suite)
    with open(os.path.join(SORTIE, "mascotte-boucle.json"), "w", encoding="utf-8") as f:
        json.dump({"_doc": "Généré par art/mascotte/boucle.py : la boucle d'attente de la mascotte dans le récif (une image : w × h px, à 2 fois sa taille de scène ; la planche en grille de `cols` colonnes ; `suite` : [image, durée en ms], dans l'ordre).", "w": W, "h": H, "cols": COLS, "images": len(uniques), "dureeMs": total, "suite": suite}, f, ensure_ascii=False)
        f.write("\n")
    print(f"mascotte-boucle : {len(uniques)} images ({COLS} × {rows}), {len(suite)} étapes, {total} ms ; planche {COLS * W} × {rows * H}")

if __name__ == "__main__":
    main()
