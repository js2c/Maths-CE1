# LA PETITE TÊTE DE LA MASCOTTE (lot « Correctifs du 5 novembre », décision du parent du 5 novembre 2026) : le bouton « réécouter »
# du récif vivant, où la mascotte n'est pas affichée, n'est plus un haut-parleur mais une petite tête du capitaine, tirée de ses
# clips. Une image du clip « idle-sourire » (le sourire chaleureux, yeux ouverts, à 0,8 s), détourée par la MÊME règle que la carte
# graphique dans l'application (app/js/engine/mascotte.js, `key` : le vert qui dépasse le rouge et le bleu devient transparent,
# le vert débordant est ramené), recadrée sur la tête, réduite à 240 px de haut (le bouton fait environ 100 px logiques, densité
# jusqu'à 2,25), en WebP sans perte. Déterministe : la même vidéo donne la même image.
#   python art/mascotte/tete.py            (ffmpeg dans le PATH, ou la variable FFMPEG ; numpy, Pillow)
import os, subprocess, sys
import numpy as np
from PIL import Image

ICI = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.join(ICI, "v", "idle-sourire.webm")
SORTIE = os.path.join(ICI, "..", "..", "app", "assets", "tete", "tete-mascotte.webp")
INSTANT, HAUTEUR = "0.8", 240

def image():
    ff = os.environ.get("FFMPEG", "ffmpeg")
    raw = subprocess.run([ff, "-v", "error", "-ss", INSTANT, "-i", SOURCE, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(600, 450, 3).astype(np.float32) / 255

def smoothstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)

def detourer(c):
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    m = np.maximum(r, b)
    al = 1 - smoothstep(0.098, 0.275, g - m)
    rgb = np.stack([r, np.minimum(g, m), b], -1)
    return np.concatenate([rgb, al[..., None]], -1)  # (non prémultiplié : l'image est enregistrée telle quelle)

def main():
    rgba = detourer(image())
    a = rgba[..., 3]
    ys, xs = np.where(a > 0.05)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    im = Image.fromarray((rgba[y0:y1, x0:x1] * 255 + 0.5).astype(np.uint8), "RGBA")
    w = round(im.width * HAUTEUR / im.height)
    im = im.resize((w, HAUTEUR), Image.LANCZOS)
    im.save(SORTIE, "WEBP", lossless=True, quality=100, method=6)
    print(f"{os.path.relpath(SORTIE)} : {w} × {HAUTEUR}, {os.path.getsize(SORTIE)} octets")

if __name__ == "__main__":
    sys.exit(main())
