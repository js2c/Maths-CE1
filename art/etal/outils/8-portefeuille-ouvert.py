# 8. Le portefeuille ouvert, d'après l'illustration du parent (meilleure que l'image de la vidéo) :
#    - « fond » : le portefeuille vidé de son argent. Les billets peints sont retirés ; la bande de cuir qu'ils
#      cachaient (le dos de la grande poche) est refaite en recopiant la bande visible à gauche, étirée entre le bord
#      haut du dos et le bord avant de la poche ; l'intérieur de la poche à pièces est repeint.
#    - « avant » : le cuir qui passe devant l'argent rangé (sous le bord avant de la grande poche, hors de la fenêtre
#      de la poche à pièces). L'application glisse billets et pièces entre les deux.
#    Les contours (en pixels de l'illustration) sont recopiés dans index.html (PF_NEUF).
import cv2, numpy as np, json
from commun import src, img

im = cv2.imread(src('monnaie/portefeuille-ouvert.jpg')); H, W = im.shape[:2]
f = im.astype(np.float32); vert = f[..., 1] - np.maximum(f[..., 0], f[..., 2])
alpha = 1 - np.clip((vert - 25) / 50, 0, 1)
m = np.maximum(f[..., 0], f[..., 2]); f[..., 1] = np.where(alpha < 1, np.minimum(f[..., 1], m + 10), f[..., 1])

def ligne(pts):
    P = np.array(pts, float); return lambda x: np.interp(x, P[:, 0], P[:, 1])
BORD_AVANT = [[110, 290], [160, 290], [200, 294], [220, 297], [260, 303], [300, 308], [340, 313], [400, 317], [440, 323],
              [480, 327], [520, 329], [560, 325], [620, 318], [680, 321], [720, 317], [760, 312], [800, 308], [840, 306],
              [880, 304], [920, 301], [960, 297], [1000, 293], [1040, 290], [1090, 285]]
avant = ligne(BORD_AVANT)
FEN = [[684, 472], [760, 468], [850, 463], [950, 458], [1030, 456], [1012, 495], [1003, 522], [1042, 552], [1000, 559], [960, 566],
       [920, 573], [880, 577], [840, 578], [800, 574], [760, 567], [720, 560], [680, 553], [722, 522], [705, 497]]
FEN_HAUT = [[680, 472], [850, 463], [1042, 456]]
FEN_BAS = [[676, 548], [720, 557], [770, 566], [820, 573], [870, 578], [920, 574], [970, 563], [1022, 550], [1042, 548]]
fh, fb = ligne(FEN_HAUT), ligne(FEN_BAS)

fond = np.dstack([f, alpha * 255])
L = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32)
# 1. le profil vertical de la bande de dos, pris à gauche (x 165 à 300), aligné sur son bord haut, sans les points de couture
topa = lambda x: int(np.argmax(alpha[:, x] > 0.5))
PROF = 75
pile = np.stack([f[topa(x):topa(x) + PROF, x] for x in range(165, 301)], 1)          # (PROF, n, 3)
lum = pile.mean(-1)
prof = np.zeros((PROF, 3), np.float32)
for r in range(PROF):
    sombre = lum[r] < 75
    ok = ~sombre & (lum[r] < 185)
    prof[r] = np.median(pile[r][sombre], 0) if sombre.mean() > 0.55 or ok.sum() < 5 else np.median(pile[r][ok], 0)
# fin de la bande de dos (le trait sombre sous les coutures) : premier rang sombre après 25 px
fin_dos = 25 + int(np.argmax(prof[25:].mean(-1) < 90)); fin_dos += 4
# 2. retirer les billets et refaire le dos entre X0 et X1 ; son bord haut raccorde les deux bouts visibles, en léger creux
X0, X1 = 305, 966
hA, hB = topa(X0 - 3), topa(X1 + 3)
haut = lambda x: hA + (hB - hA) * np.clip((x - X0) / (X1 - X0), 0, 1) - 6 * np.sin(np.pi * np.clip((x - X0) / (X1 - X0), 0, 1))
for x in range(X0, X1):
    t0 = int(round(haut(x))); fe = int(round(avant(x))) + 3
    fond[:t0 - 1, x, 3] = 0
    col = np.zeros((fe - t0, 3), np.float32)
    col[:fin_dos] = prof[:fin_dos]
    reste = fe - t0 - fin_dos                                                       # la doublure intérieure, étirée
    src_r = prof[fin_dos:min(PROF, 70)]
    idx = np.linspace(0, len(src_r) - 1, max(1, reste)); col[fin_dos:] = np.stack([np.interp(idx, np.arange(len(src_r)), src_r[:, c]) for c in range(3)], -1)[:reste]
    col[fin_dos:] *= np.linspace(0.78, 0.92, reste)[:, None]                     # plus sombre : le fond de la poche
    t = min(1, (x - X0 + 1) / 6, (X1 - x) / 6)
    fond[t0:fe, x, :3] = fond[t0:fe, x, :3] * (1 - t) + col * t
    fond[t0:fe, x, 3] = 255
    fond[t0 - 1:t0 + 4, x, :3] = (18, 22, 30); fond[t0 - 1, x, 3] = 150           # le trait d'encre du bord
# coutures sur la bande refaite : tirets clairs cernés d'encre, le long du bord, tous les 42 px
encre = (12, 18, 26); clair = tuple(float(v) for v in pile.reshape(-1, 3)[np.argsort(lum.ravel())[int(lum.size * 0.97)]])   # le clair des coutures
calque = fond[..., :3].copy()
for xc in np.arange(X0 + 14, X1 - 14, 42):
    yc = haut(xc) + 19; pente = np.degrees(np.arctan2(haut(xc + 5) - haut(xc - 5), 10)) - 8
    cv2.ellipse(calque, (int(xc), int(yc)), (13, 4), pente, 0, 360, encre, -1, cv2.LINE_AA)
    cv2.ellipse(calque, (int(xc), int(yc)), (10, 2), pente, 0, 360, clair, -1, cv2.LINE_AA)
zone = np.zeros(alpha.shape, bool); zone[:, X0 + 4:X1 - 4] = True
fond[..., :3] = np.where(zone[..., None], calque, fond[..., :3])
# 3. la poche à pièces : les quatre pièces peintes (cercles relevés à l'œil) sont retirées, et ce qu'elles cachaient
#    est redessiné : rabat, fond de la poche, soufflets, traits d'encre.
yy, xx = np.mgrid[0:H, 0:W]
PIECES = [(798, 540, 67), (907, 505, 55), (867, 566, 55), (968, 545, 49)]
masque = np.zeros((H, W), np.uint8)
for (cx, cy, r) in PIECES: cv2.circle(masque, (cx, cy), r + 6, 255, -1)
mq = masque > 0
# la poche vide, redessinée en aplats cernés d'encre (couleurs relevées dans l'illustration), posée seulement sous les pièces retirées
P = fond[..., :3].clip(0, 255).astype(np.uint8).copy()
ENCRE, RABAT, FOND_P, SOUFFLET = (16, 20, 28), (46, 86, 138), (40, 63, 106), (54, 92, 160)
rabat_pts = [(676, 471), (720, 469), (780, 466), (850, 463), (920, 460), (980, 456), (1022, 453)]
rim_pts = [(676, 549), (720, 558), (770, 567), (820, 574), (870, 579), (920, 575), (970, 564), (1022, 551)]
cv2.rectangle(P, (676, 400), (1022, 475), RABAT, -1)                                   # le rabat (derrière)
cv2.fillPoly(P, [np.array(rabat_pts + rim_pts[::-1], np.int32)], FOND_P)               # le fond de la poche
g = np.array([(676, 471), (738, 507), (676, 546)], np.int32)                           # soufflet gauche
d = np.array([(1022, 453), (968, 500), (1022, 547)], np.int32)                         # soufflet droit
cv2.fillPoly(P, [g, d], SOUFFLET)
cv2.polylines(P, [g, d], True, ENCRE, 5, cv2.LINE_AA)
cv2.polylines(P, [np.array(rabat_pts, np.int32)], False, ENCRE, 6, cv2.LINE_AA)
cv2.polylines(P, [np.array(rim_pts, np.int32)], False, ENCRE, 6, cv2.LINE_AA)
lisse = cv2.GaussianBlur(mq.astype(np.float32), (7, 7), 0)[..., None]
fond[..., :3] = fond[..., :3] * (1 - lisse) + P.astype(np.float32) * lisse
# l'ouverture de la poche : au-dessus de son bord avant, l'argent passe devant le cuir
fen = (xx >= 680) & (xx <= 1042) & (yy < fb(xx)) & (yy > 445)
# 4. le cuir de devant
devant = (yy >= avant(xx) - 1) & ~fen
av = fond.copy(); av[..., 3] = np.where(devant, fond[..., 3], 0)
av[..., 3] = cv2.GaussianBlur(av[..., 3], (3, 3), 0) * devant + av[..., 3] * 0   # bord net du masque, sans halo
av[..., 3] = np.where(devant, fond[..., 3], 0)

x0, y0, x1, y1 = 108, 212, 1092, 704          # cadre fixe (PF_IMG dans index.html)
cv2.imwrite(img('pf-ouvert-fond.webp'), fond[y0:y1, x0:x1].clip(0, 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 90])
cv2.imwrite(img('pf-ouvert-avant.webp'), av[y0:y1, x0:x1].clip(0, 255).astype(np.uint8), [cv2.IMWRITE_WEBP_QUALITY, 90])
print(json.dumps({'cadre': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)]}))
