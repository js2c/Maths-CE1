"""Échantillons de voix Piper pour le choix du parent (lot 1 bis, étape 1).

Usage : python3 fabriquer.py <dossier des modèles>
Le dossier contient, pour chaque voix, <nom>.onnx et <nom>.onnx.json
(https://huggingface.co/rhasspy/piper-voices, dossier fr/fr_FR).
Requiert piper-tts et un ffmpeg avec libmp3lame (variable FFMPEG, ou imageio-ffmpeg).
"""
import os, subprocess, sys, tempfile, wave
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

PHRASES = {
    "consigne": "Place le poisson sur le nombre trente-sept.",
    "correction": "Six plus trois, ça fait neuf.",
    "anecdote": "Chez l'hippocampe, c'est le papa qui porte les bébés, dans une poche sur son ventre.",
}
# (fichier, nom du modèle, locuteur)
VOIX = [
    ("siwis", "fr_FR-siwis-medium", None),
    ("upmc-jessica", "fr_FR-upmc-medium", 0),
    ("upmc-pierre", "fr_FR-upmc-medium", 1),
    ("tom", "fr_FR-tom-medium", None),
]
# length_scale : 1 = vitesse du modèle, plus grand = plus lent
VITESSES = [("normale", 1.0), ("lente", 1.15)]


def ffmpeg():
    if os.environ.get("FFMPEG"):
        return os.environ["FFMPEG"]
    import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()


def main(modeles):
    out = Path(__file__).parent
    for fichier, modele, locuteur in VOIX:
        voix = PiperVoice.load(Path(modeles) / f"{modele}.onnx")
        for vitesse, echelle in VITESSES:
            cfg = SynthesisConfig(speaker_id=locuteur, length_scale=echelle)
            for sorte, texte in PHRASES.items():
                with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
                    with wave.open(tmp.name, "wb") as w:
                        voix.synthesize_wav(texte, w, syn_config=cfg)
                    mp3 = out / f"{fichier}-{vitesse}-{sorte}.mp3"
                    subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-i", tmp.name,
                                    "-ac", "1", "-codec:a", "libmp3lame", "-b:a", "64k", str(mp3)], check=True)
                    print(mp3.name)


if __name__ == "__main__":
    main(sys.argv[1])
