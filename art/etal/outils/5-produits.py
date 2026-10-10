# 5. Les produits de la pêche du jour : fond vert retiré, poissons allongés remis à plat (axe principal horizontal),
#    cadrés au plus juste. Les dimensions sont à reporter dans PRODUITS (index.html).
import cv2, numpy as np, json, os
from commun import src, img

NOMS = ['sardines', 'maquereau', 'bar', 'dorade', 'sole', 'seiche', 'crevettes', 'moules',
        'huitres', 'saint-jacques', 'homard', 'tourteau']
# remis à plat seulement si l'objet est allongé et posé de biais ; tête à gauche pour tous les poissons
A_PLAT = {'maquereau', 'bar', 'dorade', 'seiche'}
COTE = 340          # plus grand côté de l'image produite (px, à 1,5 fois la taille d'affichage)

def detourer(bgr):
    f = bgr.astype(np.float32)
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    vert = g - np.maximum(r, b)
    a = 1 - np.clip((vert - 40) / 70, 0, 1)            # vert franc → transparent
    a = a * a * (3 - 2 * a)
    # débordement du vert sur les bords : le vert ramené au niveau du rouge ou du bleu
    m = np.maximum(r, b); g2 = np.where(g > m, m + (g - m) * (1 - (1 - a) ** 0.5), g)
    out = np.dstack([b, g2, r, a * 255]).clip(0, 255).astype(np.uint8)
    # petites taches isolées retirées
    n, lab, st, _ = cv2.connectedComponentsWithStats((out[..., 3] > 40).astype(np.uint8), 8)
    garde = np.zeros(n, bool); garde[1:] = st[1:, 4] > 400
    out[..., 3] = np.where(garde[lab], out[..., 3], 0)
    return out

def angle_principal(alpha):
    ys, xs = np.nonzero(alpha > 128)
    c = np.cov(np.vstack([xs - xs.mean(), ys - ys.mean()]))
    w, v = np.linalg.eigh(c); ax = v[:, np.argmax(w)]
    return np.degrees(np.arctan2(ax[1], ax[0])), w.max() / max(w.min(), 1)

def tourner(rgba, deg):
    h, w = rgba.shape[:2]; M = cv2.getRotationMatrix2D((w / 2, h / 2), deg, 1)
    cos, sin = abs(M[0, 0]), abs(M[0, 1]); W, H = int(h * sin + w * cos), int(h * cos + w * sin)
    M[0, 2] += W / 2 - w / 2; M[1, 2] += H / 2 - h / 2
    return cv2.warpAffine(rgba, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))

info = {}
for n in NOMS:
    rgba = detourer(cv2.imread(src(f'produits/{n}.jpg')))
    if n in A_PLAT:
        ang, _ = angle_principal(rgba[..., 3])
        if ang > 90: ang -= 180
        if ang < -90: ang += 180
        rgba = tourner(rgba, ang)                      # l'axe principal devient horizontal
    x, y, w, h = cv2.boundingRect((rgba[..., 3] > 10).astype(np.uint8))
    rgba = rgba[y:y + h, x:x + w]
    s = COTE / max(w, h)
    rgba = cv2.resize(rgba, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
    cv2.imwrite(img(f'produit-{n}.webp'), rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
    info[n] = {'w': rgba.shape[1], 'h': rgba.shape[0]}
print(json.dumps(info))
