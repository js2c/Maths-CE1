#!/usr/bin/env python3
"""Prépare les images de la maquette de la boutique (art/boutique/img/), à partir des fichiers de l'application,
qui ne sont jamais modifiés : le fond du lagon et quelques pictogrammes (planches de l'atelier, app/assets/art/),
les 60 créatures détourées du récif vivant (app/assets/recif/), trois courtes animations de la mascotte
(app/assets/mascotte/, fond vert retiré comme le fait l'application : app/js/engine/mascotte.js, fonction key).

    python3 art/boutique/outils/preparer.py      (depuis la racine du dépôt ; demande ffmpeg et Pillow)

Les images produites ne sont pas versionnées (.gitignore) : `fabriquer.mjs` les embarque dans index.html.
"""
import json, os, subprocess, tempfile, glob
from PIL import Image

RACINE = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
APP = os.path.join(RACINE, "app")
IMG = os.path.join(RACINE, "art", "boutique", "img")
os.makedirs(IMG, exist_ok=True)

atlas = json.load(open(os.path.join(APP, "assets/art/atlas.json")))
planches = {}
def sprite(nom, echelle=1.0):
    s = atlas["sprites"][nom]; _, x, y, w, h, _, _ = s["rects"]["2"][0]
    f = s["sheet"] + "@2x.webp"
    if f not in planches: planches[f] = Image.open(os.path.join(APP, "assets/art", f)).convert("RGBA")
    im = planches[f].crop((x, y, x + w, y + h))
    if echelle != 1.0: im = im.resize((round(w * echelle), round(h * echelle)), Image.LANCZOS)
    return im

# le fond du lagon (2560 × 1600, la scène en densité 2) : ramené à 1,5 (1920 × 1200), assez net sur la tablette (2,25 × 0,89)
fond = Image.open(os.path.join(APP, "assets/art/lagon@2x.webp")).convert("RGB").resize((1920, 1200), Image.LANCZOS)
fond.save(os.path.join(IMG, "lagon.webp"), quality=80, method=6)

# les pictogrammes de l'application (planches en densité 2, ramenés à 1,5)
for nom in ["etoile", "maison", "recif", "album", "reecouter", "etoile.doree", "etoile.arc",
            "album.zone.lagon", "album.zone.corail", "album.zone.large", "album.zone.abysses"]:
    sprite(nom, 0.75).save(os.path.join(IMG, nom.replace(".", "-") + ".webp"), quality=90, method=6)
# le coquillage doré (première et dernière image de l'ouverture)
for nom in ["coquillage", "coquillage.or"]:
    s = atlas["sprites"][nom]
    for i in (0, len(s["rects"]["2"]) - 1):
        _, x, y, w, h, _, _ = s["rects"]["2"][i]
        im = Image.open(os.path.join(APP, "assets/art", s["sheet"] + "@2x.webp")).convert("RGBA").crop((x, y, x + w, y + h))
        im.resize((round(w * .6), round(h * .6)), Image.LANCZOS).save(os.path.join(IMG, f"{nom.replace('.', '-')}-{i}.webp"), quality=90, method=6)

# les créatures : 260 px de grand côté (une vignette fait 150 px de la scène, soit 300 pixels de la tablette au plus)
CORR = {"benitier": "benitier-geant", "meduse": "meduse-criniere", "ver-tubicole": "ver-tubicole-geant", "requin-du-groenland": "requin-groenland"}
os.makedirs(os.path.join(IMG, "creatures"), exist_ok=True)
for f in sorted(glob.glob(os.path.join(APP, "assets/recif/creature-*.webp"))):
    nom = os.path.basename(f)[9:-5]; nom = CORR.get(nom, nom)
    im = Image.open(f).convert("RGBA"); im = im.crop(im.getbbox())
    k = 260 / max(im.size)
    if k < 1: im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    im.save(os.path.join(IMG, "creatures", nom + ".webp"), quality=82, method=6)

# la mascotte : trois clips, à 12 images/s, 315 × 420 (1,5 fois sa place de 210 × 280), fond vert retiré
def cle(px):
    r, g, b = px[0] / 255, px[1] / 255, px[2] / 255
    m = max(r, b); d = g - m
    t = min(1, max(0, (d - .098) / (.275 - .098))); al = 1 - t * t * (3 - 2 * t)
    return (round(r * 255), round(min(g, m) * 255), round(b * 255), round(al * 255))
def clip(nom, sortie, debut=0, duree=None):
    with tempfile.TemporaryDirectory() as tmp:
        cmd = ["ffmpeg", "-v", "error", "-ss", str(debut), "-i", os.path.join(APP, "assets/mascotte", nom + ".webm")]
        if duree: cmd += ["-t", str(duree)]
        subprocess.run(cmd + ["-vf", "fps=12,scale=315:420:flags=lanczos", os.path.join(tmp, "%03d.png")], check=True)
        images = []
        for p in sorted(glob.glob(os.path.join(tmp, "*.png"))):
            im = Image.open(p).convert("RGB"); out = Image.new("RGBA", im.size)
            out.putdata([cle(px) for px in im.getdata()]); images.append(out)
        images[0].save(os.path.join(IMG, sortie + ".webp"), save_all=True, append_images=images[1:], duration=83, loop=0, quality=70, method=4)
        print(sortie, len(images), "images", os.path.getsize(os.path.join(IMG, sortie + ".webp")) // 1024, "Ko")
clip("idle-respiration", "mascotte-attente")
clip("talk-a", "mascotte-parle", 0, 4)
clip("success", "mascotte-joie", 0, 3.5)
print("images prêtes :", IMG)
