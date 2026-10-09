# 3. Les bateaux : détourage (GrabCut dans un cadre), coupe à la ligne de flottaison choisie à l'œil.
import cv2, numpy as np
from commun import src, tmp, img
R={'chalutier-bleu':(1,(160,55,610,450)),'canot-orange':(1,(912,312,245,158)),
   'chalutier-orange':(2,(145,145,720,380)),'canot-vert':(2,(898,335,300,140)),
   'barque-grise':(3,(222,240,382,265)),'canot-rose':(3,(878,318,280,150))}
for nm,(k,r) in R.items():
    im=cv2.imread(src(f'bateaux-{k}.jpg'))
    mask=np.zeros(im.shape[:2],np.uint8); bgd=np.zeros((1,65),np.float64); fgd=np.zeros((1,65),np.float64)
    cv2.grabCut(im,mask,r,bgd,fgd,8,cv2.GC_INIT_WITH_RECT)
    fg=np.isin(mask,[1,3])
    x,y,w,h=r; c=im[y:y+h,x:x+w].copy(); f=fg[y:y+h,x:x+w]
    np.save(tmp(f'gc-{nm}.npy'),fg)

import json
from scipy import ndimage as ndi
R={'chalutier-bleu':(1,(160,55,610,450),412,-1),'canot-orange':(1,(912,312,245,158),140,-1),
   'chalutier-orange':(2,(145,145,720,380),345,1),'canot-vert':(2,(898,335,300,140),124,-1),
   'barque-grise':(3,(222,240,382,265),242,-1),'canot-rose':(3,(878,318,280,150),132,-1)}
info={}
for nm,(k,r,wl,cap) in R.items():
    im=cv2.imread(src(f'bateaux-{k}.jpg')); fg=np.load(tmp(f'gc-{nm}.npy'))
    x,y,w,h=r; c=im[y:y+h,x:x+w]; f=fg[y:y+h,x:x+w].copy()
    f[wl+8:]=False
    n,lab,st,_=cv2.connectedComponentsWithStats(f.astype(np.uint8),8)
    keep=np.zeros_like(f)
    for i in range(1,n):
        if st[i,4]>40: keep|=lab==i
    # trous de la coque (sous le pont) bouchés ; trous du gréement laissés
    hull=keep.copy(); hull[:int(wl-0.35*(wl))]=False
    keep|=ndi.binary_fill_holes(hull)
    a=(keep*255).astype(np.uint8); a=cv2.GaussianBlur(a,(3,3),0)
    ramp=np.clip((wl+8-np.arange(h))/8,0,1)[:,None]   # fondu des 8 px sous la flottaison
    a=(a*ramp).astype(np.uint8)
    bx,by,bw,bh=cv2.boundingRect((a>8).astype(np.uint8))
    rgba=np.dstack([c,a])[by:by+bh,bx:bx+bw]
    cv2.imwrite(img(f'bateau-{nm}.webp'),rgba,[cv2.IMWRITE_WEBP_QUALITY,90])
    info[nm]={'w':int(bw),'h':int(bh),'flottaison':int(wl-by),'cap':cap}
print(json.dumps(info, indent=1))   # à reporter dans TYPES (index.html)
