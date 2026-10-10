# 1. Le ciel et la mer de l'illustration du beau temps (remplissage depuis quelques points).
import cv2, numpy as np
from commun import src, tmp
im=cv2.imread(src('etal-beau-temps.jpg')); H,W=im.shape[:2]
def fill(img, seeds, lo=10):
    m=np.zeros((H+2,W+2),np.uint8)
    for s in seeds:
        cv2.floodFill(img.copy(), m, s, (0,0,0), (lo,)*3, (lo,)*3, 4|cv2.FLOODFILL_MASK_ONLY|(255<<8))
    return m[1:-1,1:-1]>0
sm=cv2.GaussianBlur(im,(3,3),0)
seeds=[(1500,100),(2400,60),(900,150),(1200,500),(2000,560),(700,520),(2500,520),(600,350)]
bg=fill(sm,seeds,9)
np.save(tmp('bg.npy'),bg)
print('ciel et mer :', round(bg.mean()*100,1), '% de l\'image')
