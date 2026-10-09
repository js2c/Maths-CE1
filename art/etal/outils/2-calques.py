# 2. Les calques du décor : premier plan (cabane, étal), jetée et phare, tuiles du ciel et de la mer, pour les deux temps.
import cv2, numpy as np, os
from commun import src, tmp, img
OUT=os.path.dirname(img('x'))
F=0.8345  # px image -> px scene x1,5 (scène 1280x800 dessinée en 1920x1200)
bg=np.load(tmp('bg.npy')); H,W=bg.shape
beau=cv2.imread(src('etal-beau-temps.jpg')); orage=cv2.imread(src('etal-mauvais-temps.jpg'))
nb=(~bg).astype(np.uint8)
yy,xx=np.mgrid[0:H,0:W]
fg=((nb>0)&((xx<600)|(yy>=500)))|((yy>=549)&(xx>=440))   # sous le bord de l'étal, tout est premier plan
mid=(nb>0)&(xx>=440)&(xx<1010)&(yy>=200)&(yy<380)
print('mid bbox',cv2.boundingRect(mid.astype(np.uint8)))

def destreak(img,mask=None):
    # retire les traits de pluie peints (fins et plus clairs que le voisinage)
    k=cv2.getStructuringElement(cv2.MORPH_RECT,(13,1))
    op=cv2.morphologyEx(img,cv2.MORPH_OPEN,k)
    return cv2.GaussianBlur(op,(3,3),0)
def rowcopy(img,x0,x1,y0,y1,dx,feather=25):
    m=np.zeros(img.shape[:2],np.float32); m[y0:y1,x0:x1]=1
    m=cv2.GaussianBlur(m,(0,0),feather)[...,None]
    src=np.roll(img,-dx,axis=1).astype(np.float32)
    return (img*(1-m)+src*m).astype(np.uint8)
def save_rgba(name,bgr,alpha,scale=F):
    rgba=np.dstack([bgr,alpha])
    rgba=cv2.resize(rgba,None,fx=scale,fy=scale,interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{OUT}/{name}.webp',rgba,[cv2.IMWRITE_WEBP_QUALITY,88]); return rgba.shape
def save_rgb(name,bgr,scale=F,q=86):
    o=cv2.resize(bgr,None,fx=scale,fy=scale,interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{OUT}/{name}.webp',o,[cv2.IMWRITE_WEBP_QUALITY,q]); return o.shape
alpha=(fg*255).astype(np.uint8); alpha=cv2.GaussianBlur(alpha,(3,3),0)
xc=2301
for nm,img in (('beau',beau),('orage',orage)):
    print(nm,'avant',save_rgba(f'avant-{nm}',img[:,:xc],alpha[:,:xc]))
    x,y,w,h=cv2.boundingRect(mid.astype(np.uint8)); x-=4;y-=4;w+=8;h+=8
    a=(mid[y:y+h,x:x+w]*255).astype(np.uint8); a=cv2.dilate(a,np.ones((3,3),np.uint8))
    print(nm,'jetee',save_rgba(f'jetee-{nm}',img[y:y+h,x:x+w],a), (x*F,y*F))
    # ciel : x 560..2576, lignes 0..368 ; phare et jetée (et faisceau peint) recopiés depuis la droite
    sky=rowcopy(img,1850,2310,270,372,-480,12)
    sky=rowcopy(sky,430,1080,185,372,640,12)
    if nm=='orage': sky=destreak(sky)
    T=sky[0:368,600:2576]; S=np.hstack([T,T[:,::-1]])
    print(nm,'ciel',save_rgb(f'ciel-{nm}',S))
    # mer : lignes 360..556, x 980..2576 ; bateaux peints recopiés depuis la gauche
    sea=rowcopy(img,1850,2310,330,455,-480,12)
    if nm=='orage': sea=destreak(sea)
    sea[540:556]=sea[524:540]
    M=sea[360:556,1100:2576]; M=np.hstack([M,M[:,::-1]])
    print(nm,'mer',save_rgb(f'mer-{nm}',M))
