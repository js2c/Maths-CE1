# L'ICÔNE DE L'APPLICATION (décision du parent du 10 octobre 2026) : le logo de démarrage (« Maths CE1 » et l'étoile,
# découpés par decoupe.py) sur l'eau, avec deux faisceaux de lumière et quelques bulles, comme l'écran de démarrage.
# Écrit dans icone/ : icone-512.png et icone-192.png (« any » : le logo occupe presque tout le carré),
# icone-maskable-512.png (« maskable » : Android découpe l'icône en rond ou en carré arrondi ; le logo tient dans le
# cercle central de 80 % du côté) et icone-180.png (iPhone, iPad).   python art/logo/icone.py   (numpy, scipy, Pillow)
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ICI = Path(__file__).resolve().parent
TEXTE = Image.open(ICI / "images" / "texte@2x.webp").convert("RGBA")
ETOILE = Image.open(ICI / "images" / "etoile@2x.webp").convert("RGBA")
OMBRE = Image.open(ICI / "images" / "ombre.webp").convert("RGBA")
# place de l'étoile et de l'ombre par rapport au texte, en px de @2x (position.json : px de scène × 2)
import json
P = json.loads((ICI / "images" / "position.json").read_text())
def rel(n): return ((P[n]["x"] - P["texte"]["x"]) * 2, (P[n]["y"] - P["texte"]["y"]) * 2)

def eau(S):
    y, x = np.mgrid[0:S, 0:S] / S
    # l'eau : plus claire en haut au centre (la lumière), plus sombre au fond
    d = np.sqrt((x - 0.5) ** 2 * 0.8 + (y + 0.05) ** 2)
    t = np.clip(d / 1.15, 0, 1)[..., None]
    haut, bas = np.array([44, 146, 152]), np.array([9, 72, 84])
    img = (haut * (1 - t) + bas * t)
    a = Image.fromarray(img.astype(np.uint8), "RGB").convert("RGBA")
    # deux faisceaux doux, inclinés comme ceux du lagon
    f = Image.new("L", (S, S), 0); g = ImageDraw.Draw(f)
    for x0, w, al in [(0.30, 0.10, 70), (0.55, 0.16, 55), (0.78, 0.07, 45)]:
        g.polygon([(S * x0, -10), (S * (x0 + w), -10), (S * (x0 + w - 0.28), S * 1.05), (S * (x0 - 0.30), S * 1.05)], fill=al)
    f = f.filter(ImageFilter.GaussianBlur(S * 0.03))
    grad = Image.fromarray((np.clip(1.1 - np.mgrid[0:S, 0:S][0] / S, 0, 1) * 255).astype(np.uint8))
    f = Image.fromarray((np.asarray(f, np.float32) * np.asarray(grad, np.float32) / 255).astype(np.uint8))
    lum = Image.new("RGBA", (S, S), (255, 250, 226, 0)); lum.putalpha(f)
    a.alpha_composite(lum)
    return a

def bulle(img, cx, cy, r):
    S = img.width; k = 4; c = Image.new("RGBA", (int(r * 2 * k + 8), int(r * 2 * k + 8)), (0, 0, 0, 0)); g = ImageDraw.Draw(c); m = c.width / 2; R = r * k
    g.ellipse([m - R, m - R, m + R, m + R], fill=(210, 245, 245, 30), outline=(240, 255, 255, 170), width=max(2, int(R * 0.12)))
    g.arc([m - R * 0.62, m - R * 0.62, m + R * 0.62, m + R * 0.62], 200, 255, fill=(255, 255, 255, 230), width=max(2, int(R * 0.16)))
    c = c.resize((c.width // k, c.height // k), Image.LANCZOS)
    img.alpha_composite(c, (int(cx - c.width / 2), int(cy - c.height / 2)))

def icone(S, largeur, cy=0.5):
    img = eau(S)
    k = largeur * S / TEXTE.width
    t = TEXTE.resize((round(TEXTE.width * k), round(TEXTE.height * k)), Image.LANCZOS)
    x0, y0 = round((S - t.width) / 2), round(S * cy - t.height / 2)
    ox, oy = rel("ombre"); o = OMBRE.resize((round(P["ombre"]["w"] * 2 * k), round(P["ombre"]["h"] * 2 * k)), Image.LANCZOS)
    img.alpha_composite(o, (round(x0 + ox * k + 6 * k * 2), round(y0 + oy * k + 16 * k * 2)))
    img.alpha_composite(t, (x0, y0))
    ex, ey = rel("etoile"); e = ETOILE.resize((round(ETOILE.width * k), round(ETOILE.height * k)), Image.LANCZOS)
    img.alpha_composite(e, (round(x0 + ex * k), round(y0 + ey * k)))
    # quelques bulles à droite, comme sur l'écran de démarrage (hors de la zone découpée par Android pour la maskable)
    for bx, by, br in [(0.86, 0.20, 0.022), (0.90, 0.30, 0.016), (0.84, 0.80, 0.026), (0.12, 0.78, 0.018)]:
        bulle(img, bx * S, by * S, br * S * (0.75 if largeur < 0.7 else 1))
    return img.convert("RGB")

out = ICI / "icone"; out.mkdir(exist_ok=True)
grande = icone(1024, 0.86)
grande.resize((512, 512), Image.LANCZOS).save(out / "icone-512.png", optimize=True)
grande.resize((192, 192), Image.LANCZOS).save(out / "icone-192.png", optimize=True)
grande.resize((180, 180), Image.LANCZOS).save(out / "icone-180.png", optimize=True)
icone(1024, 0.64).resize((512, 512), Image.LANCZOS).save(out / "icone-maskable-512.png", optimize=True)
print("ok")
