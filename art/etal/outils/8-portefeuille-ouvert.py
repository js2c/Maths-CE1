# 8. Le portefeuille ouvert et vide (illustration du parent, sans billet ni pièce), en deux calques :
#    - « fond » : le portefeuille entier, fond vert retiré ;
#    - « avant » : le cuir qui passe devant l'argent rangé : tout ce qui est sous le bord avant de la grande poche,
#      sauf l'ouverture de la poche à pièces (de son rabat jusqu'à son bord avant : les pièces passent devant le rabat,
#      derrière le bord avant de la poche).
#    Les contours (pixels de l'illustration, relevés sur les traits d'encre) sont recopiés dans index.html.
import cv2, numpy as np, json
from commun import src, img

im = cv2.imread(src('monnaie/portefeuille-vide.jpg')); H, W = im.shape[:2]
f = im.astype(np.float32); vert = f[..., 1] - np.maximum(f[..., 0], f[..., 2])
alpha = 1 - np.clip((vert - 25) / 50, 0, 1)
m = np.maximum(f[..., 0], f[..., 2]); f[..., 1] = np.where(alpha < 1, np.minimum(f[..., 1], m + 10), f[..., 1])
ligne = lambda P: (lambda x: np.interp(x, [p[0] for p in P], [p[1] for p in P]))
BORD_AVANT = [[110, 284], [140, 284], [180, 292], [220, 296], [260, 302], [300, 307], [340, 309], [380, 313], [420, 319], [460, 324],
              [500, 328], [540, 326], [580, 318], [620, 317], [660, 320], [700, 318], [740, 312], [780, 309], [820, 305], [860, 304],
              [900, 302], [940, 299], [980, 293], [1020, 287], [1095, 284]]
RABAT_HAUT = [[680, 412], [720, 404], [750, 404], [810, 395], [870, 389], [930, 383], [960, 381], [1042, 381]]
BORD_POCHE = [[676, 538], [690, 538], [720, 556], [750, 562], [780, 568], [810, 575], [840, 578], [870, 577], [900, 573],
              [930, 567], [960, 561], [990, 555], [1020, 545], [1042, 542]]
avant, rh, bp = ligne(BORD_AVANT), ligne(RABAT_HAUT), ligne(BORD_POCHE)
yy, xx = np.mgrid[0:H, 0:W]
ouverture = (xx >= 678) & (xx <= 1040) & (yy > rh(xx) - 4) & (yy < bp(xx))
devant = (yy >= avant(xx) - 1) & ~ouverture
fond = np.dstack([f, alpha * 255]).clip(0, 255).astype(np.uint8)
av = fond.copy(); av[..., 3] = np.where(devant, fond[..., 3], 0)
x0, y0, x1, y1 = 110, 184, 1092, 702                     # cadre fixe (PF_IMG dans index.html)
cv2.imwrite(img('pf-ouvert-fond.webp'), fond[y0:y1, x0:x1], [cv2.IMWRITE_WEBP_QUALITY, 90])
cv2.imwrite(img('pf-ouvert-avant.webp'), av[y0:y1, x0:x1], [cv2.IMWRITE_WEBP_QUALITY, 90])
print(json.dumps({'cadre': [x0, y0, x1 - x0, y1 - y0]}))
