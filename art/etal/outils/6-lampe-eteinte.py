# 6. La lampe éteinte (beau temps) : même détourage que la lampe allumée ; même échelle à quelques pixels près.
#    Ses couleurs, peintes sous l'orage, sont éclaircies pour le plein jour.
import cv2, numpy as np
from scipy import ndimage as ndi
from commun import src, img
im = cv2.imread(src('lampe-eteinte.jpg'))
mask = np.zeros(im.shape[:2], np.uint8)
mask[78:448, 140:285] = 3
mask[84:168, 194:204] = 1
bgd = np.zeros((1, 65)); fgd = np.zeros((1, 65))
cv2.grabCut(im, mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
f = np.isin(mask, [1, 3])
n, lab, st, _ = cv2.connectedComponentsWithStats(f.astype(np.uint8), 8)
f = ndi.binary_fill_holes(lab == (np.argmax(st[1:, 4]) + 1))
a = cv2.GaussianBlur((f * 255).astype(np.uint8), (3, 3), 0)
bx, by, bw, bh = cv2.boundingRect((a > 8).astype(np.uint8))
# plein jour : plus clair, un peu plus chaud
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV).astype(np.float32)
v = hsv[..., 2] / 255; hsv[..., 2] = np.clip(255 * (v ** 0.72) * 1.18, 0, 255)
hsv[..., 1] = np.clip(hsv[..., 1] * 1.15, 0, 255)
jour = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
jour = np.clip(jour.astype(np.float32) * np.array([0.94, 1.0, 1.06]), 0, 255).astype(np.uint8)
cv2.imwrite(img('lampe-eteinte.webp'), np.dstack([jour, a])[by:by+bh, bx:bx+bw], [cv2.IMWRITE_WEBP_QUALITY, 90])
print('cadre', bx, by, bw, bh, '· crochet', 199 - bx, 82 - by)
