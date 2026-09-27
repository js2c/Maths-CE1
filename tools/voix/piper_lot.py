"""Synthèse d'un lot de phrases avec Piper (appelé par tools/voix/fabriquer.mjs, pas à la main).

Lit sur l'entrée standard un JSON { "modele", "locuteur", "vitesse", "dossier", "phrases": [{ "id", "texte" }] }
et écrit <dossier>/<id>.wav pour chaque phrase. `vitesse` est le length_scale de Piper (1 = vitesse du modèle).
"""
import json, sys, wave
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

job = json.load(sys.stdin)
voix = PiperVoice.load(job["modele"])
cfg = SynthesisConfig(speaker_id=job.get("locuteur"), length_scale=job.get("vitesse", 1.0))
dossier = Path(job["dossier"])
for i, p in enumerate(job["phrases"], 1):
    with wave.open(str(dossier / f"{p['id']}.wav"), "wb") as w:
        voix.synthesize_wav(p["texte"], w, syn_config=cfg)
    if i % 100 == 0:
        print(f"  {i}/{len(job['phrases'])}", file=sys.stderr, flush=True)
