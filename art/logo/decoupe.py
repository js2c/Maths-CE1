# LE DÉCOUPAGE DU LOGO DE DÉMARRAGE (décision du parent du 10 octobre 2026 ; README.md de ce dossier).
# Lit reference.jpg (l'image donnée par le parent) et écrit dans images/ deux calques détourés, sans le fond d'eau :
#   texte@1x.webp, texte@2x.webp   « Maths CE1 » avec son contour, son relief et ses reflets ;
#   etoile@1x.webp, etoile@2x.webp l'étoile de mer, à part (elle tourne sur elle-même) ;
#   ombre.webp                     l'ombre du texte, floue et en basse résolution (elle bouge avec lui) ;
#   position.json                  la taille et la place de chaque calque dans la scène de 1280 × 800.
# Les bulles et étincelles fixes de la référence sont retirées : la maquette (index.html) les anime.
# Déterministe : une même référence donne les mêmes images.   python art/logo/decoupe.py
# Il faut numpy, scipy et Pillow.
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd

ICI = Path(__file__).resolve().parent
ECHELLE = 0.38              # px de la référence -> px de la scène (le texte fait 684 px de large)
CENTRE_TEXTE = (640, 300)   # le centre du texte dans la scène

C = np.asarray(Image.open(ICI / "reference.jpg").convert("RGB")).astype(np.float32) / 255
r, g, b = C[..., 0], C[..., 1], C[..., 2]
mx, mn = C.max(-1), C.min(-1); d = mx - mn + 1e-6
h = np.where(mx == r, (g - b) / d % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
s, v = d / (mx + 1e-6), mx

def disque(n):
    y, x = np.ogrid[-n:n + 1, -n:n + 1]; return x * x + y * y <= n * n

# 1. l'eau (bleu-vert) et le reste ; le grain du relief est lissé par un vote 7 × 7
eau = (h > 168) & (h < 206) & (s > 0.3) & (v < 0.78)
fg = nd.uniform_filter((~eau).astype(np.float32), 7) > 0.5
fg = nd.binary_opening(fg, disque(6))        # retire les rayons des étincelles et les petits points
fg = nd.binary_closing(fg, disque(5))
plein = nd.binary_fill_holes(fg)
trous, nt = nd.label(plein & ~fg)
for i in range(1, nt + 1):                   # on ne bouche que les trous qui ne sont pas de l'eau (le C de CE1 reste ouvert)
    t = trous == i
    if eau[t].mean() < 0.5 or t.sum() < 400: fg |= t
lab, n = nd.label(fg)
tailles = nd.sum(fg, lab, range(1, n + 1)); ordre = np.argsort(tailles)[::-1]
garder = [int(ordre[0]) + 1, int(ordre[1]) + 1]   # le texte (le plus grand), l'étoile
tout = np.isin(lab, garder)

# 2. le détourage : alpha et couleur démélangés de l'eau dans la bordure
calques = {}
for nom, k in zip(["texte", "etoile"], garder):
    M = lab == k
    poches, npk = nd.label(eau & M); bord = M & ~nd.binary_erosion(M, disque(10))
    for i in range(1, npk + 1):              # de l'eau restée dans le masque, ouverte sur le bord : retirée
        p = poches == i
        if p.sum() > 150 and (p & bord).any(): M &= ~nd.binary_dilation(p, disque(2))
    sur_f = nd.binary_erosion(M, disque(4))
    sur_b = ~nd.binary_dilation(tout, disque(9)) & eau
    ys, xs = np.where(nd.binary_dilation(M, disque(14)))
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    sl = (slice(y0, y1), slice(x0, x1)); Cc = C[sl]
    def moyenne(masque, sig):
        m = masque[sl].astype(np.float32); w = nd.gaussian_filter(m, sig) + 1e-6
        return np.stack([nd.gaussian_filter(Cc[..., i] * m, sig) for i in range(3)], -1) / w[..., None]
    F, B = moyenne(sur_f, 3), moyenne(sur_b, 14)
    dd = F - B
    a = np.clip(((Cc - B) * dd).sum(-1) / ((dd * dd).sum(-1) + 1e-4), 0, 1)
    a = np.where(sur_f[sl], 1, np.where(nd.binary_dilation(M, disque(9))[sl], a, 0))
    a = nd.gaussian_filter(a, 0.6); a = np.where(sur_f[sl], 1, a)
    A = a[..., None]
    col = np.where(A > 0.02, np.clip((Cc - (1 - A) * B) / np.maximum(A, 1e-3), 0, 1), F)
    col = np.where(sur_f[sl][..., None], Cc, np.where(A > 0.6, col, F * (1 - A) + col * A))
    cmx, cmn = col.max(-1), col.min(-1); cd = cmx - cmn + 1e-6
    ch = np.where(cmx == col[..., 0], (col[..., 1] - col[..., 2]) / cd % 6, np.where(cmx == col[..., 1], (col[..., 2] - col[..., 0]) / cd + 2, (col[..., 0] - col[..., 1]) / cd + 4)) * 60
    reste = (ch > 165) & (ch < 210) & (cd / (cmx + 1e-6) > 0.35) & (cmx > 0.25) & ~sur_f[sl]
    a = np.where(nd.binary_dilation(reste, iterations=1), 0, a)
    rgba = np.concatenate([col, a[..., None]], -1)
    calques[nom] = (Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), "RGBA"), int(x0), int(y0))

# 3. les images, à l'échelle de la scène (@1x) et du double (@2x : la tablette affiche 2 px par px de scène)
out = ICI / "images"; out.mkdir(exist_ok=True)
pos = {}
tx, ty = calques["texte"][1], calques["texte"][2]
tw, th = calques["texte"][0].size
gauche, haut = CENTRE_TEXTE[0] - tw * ECHELLE / 2, CENTRE_TEXTE[1] - th * ECHELLE / 2
for nom, (im, x0, y0) in calques.items():
    for suffixe, f in [("1x", ECHELLE), ("2x", 2 * ECHELLE)]:
        im.resize((round(im.width * f), round(im.height * f)), Image.LANCZOS).save(out / f"{nom}@{suffixe}.webp", quality=88 if nom == "texte" else 90, method=6)
    pos[nom] = {"x": round(gauche + (x0 - tx) * ECHELLE, 1), "y": round(haut + (y0 - ty) * ECHELLE, 1), "w": round(im.width * ECHELLE, 1), "h": round(im.height * ECHELLE, 1)}

# 4. l'ombre du texte : sa silhouette floutée, au quart de @2x (le flou cache l'agrandissement), bleu nuit
texte = calques["texte"][0]; q = 0.5 * ECHELLE; marge = 24
sil = Image.fromarray(np.asarray(texte.split()[-1])).resize((round(tw * q), round(th * q)), Image.LANCZOS)
toile = Image.new("L", (sil.width + 2 * marge, sil.height + 2 * marge), 0); toile.paste(sil, (marge, marge))
flou = toile.filter(ImageFilter.GaussianBlur(7))
Image.merge("RGBA", [Image.new("L", flou.size, c) for c in (6, 26, 40)] + [flou]).save(out / "ombre.webp", quality=80)
e = ECHELLE / q
pos["ombre"] = {"x": round(pos["texte"]["x"] - marge * e, 1), "y": round(pos["texte"]["y"] - marge * e, 1), "w": round(toile.width * e, 1), "h": round(toile.height * e, 1)}
(out / "position.json").write_text(json.dumps(pos, indent=2) + "\n")
print(json.dumps(pos))
