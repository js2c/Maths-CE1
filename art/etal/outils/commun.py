# Chemins communs aux outils de la maquette de l'étal (à lancer depuis n'importe où).
import os
ICI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ICI, '..', 'sources')
IMG = os.path.join(ICI, '..', 'img')
TMP = os.path.join(ICI, '..', '.travail')   # masques intermédiaires (non versionnés)
os.makedirs(TMP, exist_ok=True); os.makedirs(IMG, exist_ok=True)
def src(n): return os.path.join(SRC, n)
def tmp(n): return os.path.join(TMP, n)
def img(n): return os.path.join(IMG, n)
