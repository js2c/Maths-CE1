# LE BOUTON DE L'ESPACE PARENT (décision du parent du 10 octobre 2026) : découpe de l'image donnée par le parent
# (parents-reference.jpg : le bouton posé sur le sable) en un bouton détouré, sans le sable autour.
# Écrit images/parents@1x.webp et images/parents@2x.webp (le bouton fait 108 px de scène de large) et
# images/parents-forme.json (sa taille en px de scène).
# Déterministe.   python art/boutons/decoupe.py   (numpy, scipy, Pillow)
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage as nd

ICI = Path(__file__).resolve().parent
LARGEUR = 108   # px de scène (le bouton d'avant : 92 px, en bas à gauche de l'accueil)
im = Image.open(ICI / "parents-reference.jpg").convert("RGB")
C = np.asarray(im).astype(np.float32) / 255
v = C.max(-1)
# le contour bleu nuit du bouton : le plus grand ensemble de pixels sombres ; le bouton : ce contour et tout ce qu'il entoure
sombre = v < 0.28
lab, n = nd.label(sombre)
k = 1 + int(np.argmax(nd.sum(sombre, lab, range(1, n + 1))))
forme = nd.binary_fill_holes(nd.binary_closing(lab == k, iterations=3))
yy, xx = np.ogrid[-9:10, -9:10]
forme = nd.binary_opening(forme, structure=xx * xx + yy * yy <= 81)   # retire les traits du sable collés au contour
ys, xs = np.where(forme)
y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
# bord adouci (anticrénelage) : le masque, légèrement flouté, à l'intérieur d'une marge d'un pixel
a = np.clip(nd.gaussian_filter(forme.astype(np.float32), 0.8) * 1.15 - 0.075, 0, 1)
rgba = np.concatenate([C, a[..., None]], -1)[y0 - 2:y1 + 2, x0 - 2:x1 + 2]
bouton = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), "RGBA")
out = ICI / "images"; out.mkdir(exist_ok=True)
h = LARGEUR * bouton.height / bouton.width
for s, f in [("1x", 1), ("2x", 2)]:
    bouton.resize((round(LARGEUR * f), round(h * f)), Image.LANCZOS).save(out / f"parents@{s}.webp", quality=90, method=6)
(out / "parents-forme.json").write_text(json.dumps({"w": LARGEUR, "h": round(h, 1)}, indent=2) + "\n")
print(bouton.size, round(h, 1))
