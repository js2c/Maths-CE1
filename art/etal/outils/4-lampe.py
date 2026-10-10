# 4. La lampe à huile : détourage (GrabCut, la corde forcée au premier plan), crochet en (56, 1), flamme en (68, 246).
import cv2, numpy as np
from scipy import ndimage as ndi
from commun import src, img
im = cv2.imread(src('lampe.jpg'))
mask = np.zeros(im.shape[:2], np.uint8)
x, y, w, h = 236, 118, 148, 375
mask[y:y+h, x:x+w] = 3
mask[128:215, 294:305] = 1
bgd = np.zeros((1, 65)); fgd = np.zeros((1, 65))
cv2.grabCut(im, mask, None, bgd, fgd, 8, cv2.GC_INIT_WITH_MASK)
f = np.isin(mask, [1, 3])
n, lab, st, _ = cv2.connectedComponentsWithStats(f.astype(np.uint8), 8)
f = lab == (np.argmax(st[1:, 4]) + 1)
f = ndi.binary_fill_holes(f)
a = cv2.GaussianBlur((f * 255).astype(np.uint8), (3, 3), 0)
bx, by, bw, bh = cv2.boundingRect((a > 8).astype(np.uint8))
cv2.imwrite(img('lampe.webp'), np.dstack([im, a])[by:by+bh, bx:bx+bw], [cv2.IMWRITE_WEBP_QUALITY, 90])
print('cadre', bx, by, bw, bh, '· crochet', 298 - bx, 128 - by, '· flamme', 310 - bx, 375 - by)
