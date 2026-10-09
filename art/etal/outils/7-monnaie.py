# 7. La monnaie et le portefeuille.
#    Pièces et billets : fond vert retiré (seulement le vert relié au bord : le « 5 » vert d'un billet reste),
#    cadrés au plus juste. Portefeuille : les images de la vidéo, de « ouvert » à « fermé », une sur deux,
#    détourées et cadrées dans le même rectangle (l'ouverture est la même suite, à l'envers).
import cv2, numpy as np, json, subprocess, os, tempfile
from commun import src, img

def detourer(bgr, seuil=40, partout=False):
    f = bgr.astype(np.float32); b, g, r = f[..., 0], f[..., 1], f[..., 2]
    vert = g - np.maximum(r, b)
    fond = (vert > seuil).astype(np.uint8)
    n, lab = cv2.connectedComponents(fond, connectivity=4)
    bords = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    fond = np.isin(lab, list(bords)) if not partout else lab > 0   # le portefeuille n'a pas de vert : tout le vert part
    bord = cv2.dilate(fond.astype(np.uint8), np.ones((5, 5), np.uint8)) > 0     # bande de 2 px autour du fond
    a = np.where(fond, 0.0, 1.0)
    doux = 1 - np.clip((vert - 25) / 60, 0, 1)
    a = np.where(bord & ~fond, np.minimum(1, doux * 1.0), a)
    m = np.maximum(r, b); g2 = np.where(bord & (g > m), m + (g - m) * 0.3, g)   # vert débordant ramené
    return np.dstack([b, g2, r, a * 255]).clip(0, 255).astype(np.uint8)

def cadrer(rgba, cote):
    x, y, w, h = cv2.boundingRect((rgba[..., 3] > 20).astype(np.uint8))
    rgba = rgba[y:y + h, x:x + w]; s = cote / max(w, h)
    return cv2.resize(rgba, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)

info = {}
for n in ['piece-10c', 'piece-20c', 'piece-50c', 'piece-1e', 'piece-2e']:
    o = cadrer(detourer(cv2.imread(src(f'monnaie/{n}.jpg'))), 220)
    cv2.imwrite(img(f'{n}.webp'), o, [cv2.IMWRITE_WEBP_QUALITY, 90]); info[n] = [o.shape[1], o.shape[0]]
for n in ['billet-5', 'billet-10', 'billet-20', 'billet-50']:
    o = cadrer(detourer(cv2.imread(src(f'monnaie/{n}.jpg'))), 460)
    cv2.imwrite(img(f'{n}.webp'), o, [cv2.IMWRITE_WEBP_QUALITY, 88]); info[n] = [o.shape[1], o.shape[0]]

# portefeuille : images 24 à 92 de la vidéo (ouvert → fermé), une sur deux
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', src('portefeuille.mp4'), os.path.join(tmp, 'f%03d.png')], check=True)
idx = list(range(24, 93, 2))
images = [detourer(cv2.imread(os.path.join(tmp, f'f{i:03d}.png')), 35, partout=True) for i in idx]
union = np.zeros(images[0].shape[:2], bool)
for im in images: union |= im[..., 3] > 20
x, y, w, h = cv2.boundingRect(union.astype(np.uint8)); x -= 4; y -= 4; w += 8; h += 8
os.makedirs(img('portefeuille'), exist_ok=True)
for k, im in enumerate(images):
    cv2.imwrite(img(f'portefeuille/p{k:02d}.webp'), im[y:y + h, x:x + w], [cv2.IMWRITE_WEBP_QUALITY, 88])
info['portefeuille'] = {'images': len(images), 'w': w, 'h': h}
print(json.dumps(info))
