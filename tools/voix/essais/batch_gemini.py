# ESSAI DU MODE BATCH (gemini-3.8-flash-tts) : un mini-lot de quelques phrases, pour vérifier avant de s'engager
# que le Batch accepte la voix de la bibliothèque, dans quel format l'audio revient, et en combien de temps.
# Le Batch passe par l'ancienne interface (generateContent), pas par celle des essais précédents (interactions) :
# c'est justement ce qu'il faut vérifier.
#
#   .\.venv-gemini\Scripts\python.exe tools\voix\essais\batch_gemini.py
#
# Ce que fait la commande :
#   1. un appel normal (une requête, hors Batch) avec la même forme de demande : s'il échoue, inutile d'attendre le
#      Batch ; il sert aussi de témoin (00-temoin-standard.wav) pour comparer la voix rendue par le Batch ;
#   2. prépare le lot (lot.jsonl : une ligne par phrase, avec sa clé), le dépose chez Google et crée le travail ;
#   3. vérifie l'état toutes les 30 secondes (objectif de Google : 24 h au plus, souvent bien moins) ;
#   4. au retour, écrit un .wav par phrase et une page ecoute.html.
# On peut fermer PowerShell pendant l'attente : relancer la même commande reprend le suivi du même lot
# (son nom est gardé dans lot.json). --nouveau : abandonne le suivi et envoie un nouveau lot.
import argparse, base64, html, json, os, sys, time, wave

STYLE = "friendly"  # le même style pour toutes les phrases

# (clé, texte) ; la phrase 2 et la phrase 6 sont identiques : deux tirages du même lot, pour entendre la dérive
PHRASES = [
    ("01-bienvenue", "Bonsoir, et bienvenue !"),
    ("02-question", "trois plus quatre ?"),
    ("03-erreur", "Ce n'est pas grave, <short pause> regardons ensemble."),
    ("04-surprise", "<gasp> Oh ! Elle est brillante !"),
    ("05-consigne", "Place le poisson sur le nombre sept."),
    ("06-question-bis", "trois plus quatre ?"),
]

MODELE = "gemini-3.8-flash-tts"
ICI = os.path.dirname(os.path.abspath(__file__))

a = argparse.ArgumentParser()
a.add_argument("--voix", default="Digital Assistant 2")
a.add_argument("--nouveau", action="store_true")
args = a.parse_args()
SORTIE = os.path.join(ICI, "out", "gemini-batch", "".join(c if c.isalnum() else "-" for c in args.voix.lower()))
os.makedirs(SORTIE, exist_ok=True)
ETAT = os.path.join(SORTIE, "lot.json")

if not os.environ.get("GEMINI_API_KEY"):
    sys.exit("La clé manque : setx GEMINI_API_KEY \"...\", puis rouvrir PowerShell.")

from google import genai
from google.genai import types
client = genai.Client()

def trouver_voix(nom):
    try:
        r = client.voices.list(search=nom, language_code=["fr-FR"], page_size=100)
    except Exception as e:
        sys.exit(f"Impossible de lire la bibliothèque de voix : {e}")
    exactes = [v for v in (r.voices or []) if (v.display_name or "").lower() == nom.lower()]
    if not exactes:
        sys.exit(f"Voix « {nom} » introuvable parmi les voix fr-FR.")
    v = exactes[0]
    print(f"Voix : {v.display_name} (id {v.id}, {v.language_code})")
    return v.id

def ecrire_wav(chemin, donnees, mime):
    """L'audio revient soit en WAV complet, soit en PCM brut (16 bits, mono) sans en-tête : on ajoute l'en-tête."""
    if donnees[:4] == b"RIFF":
        open(chemin, "wb").write(donnees)
        return
    taux = 24000
    for morceau in (mime or "").split(";"):
        if morceau.strip().startswith("rate="):
            taux = int(morceau.strip()[5:])
    with wave.open(chemin, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(taux); w.writeframes(donnees)

def demande_json(texte, voix):
    """Une ligne du lot : la demande au format de l'API (generateContent)."""
    return {
        "contents": [{"role": "user", "parts": [{"text": texte, "speechMetadata": {"style": STYLE}}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {"voiceConfig": {"voice": voix}, "languageCode": "fr-FR"},
        },
    }

etat = json.load(open(ETAT, encoding="utf-8")) if os.path.exists(ETAT) and not args.nouveau else None

if not etat:
    voix = trouver_voix(args.voix)

    # 1. le témoin : la même demande, en appel normal
    print("Témoin (appel normal, une requête)…")
    try:
        r = client.models.generate_content(
            model=MODELE,
            contents=[types.Content(role="user", parts=[types.Part(text=PHRASES[0][1], speech_metadata=types.SpeechMetadata(style=STYLE))])],
            config=types.GenerateContentConfig(
                response_modalities=["AUDIO"],
                speech_config=types.SpeechConfig(voice_config=types.VoiceConfig(voice=voix), language_code="fr-FR"),
            ),
        )
        part = r.candidates[0].content.parts[0].inline_data
        ecrire_wav(os.path.join(SORTIE, "00-temoin-standard.wav"), part.data, part.mime_type)
        print(f"   ok ({part.mime_type})")
    except Exception as e:
        sys.exit(f"   ÉCHEC du témoin : {e}\n   Cette forme de demande n'est pas acceptée : le Batch échouerait aussi. Envoie ce message à Claude.")

    # 2. le lot
    chemin_lot = os.path.join(SORTIE, "lot.jsonl")
    with open(chemin_lot, "w", encoding="utf-8") as f:
        for cle, texte in PHRASES:
            f.write(json.dumps({"key": cle, "request": demande_json(texte, voix)}, ensure_ascii=False) + "\n")
    fichier = client.files.upload(file=chemin_lot, config=types.UploadFileConfig(display_name="essai-voix-ce1", mime_type="jsonl"))
    travail = client.batches.create(model=MODELE, src=fichier.name, config={"display_name": "essai-voix-ce1"})
    etat = {"travail": travail.name, "envoye": time.strftime("%Y-%m-%d %H:%M:%S"), "voix": voix}
    json.dump(etat, open(ETAT, "w", encoding="utf-8"), indent=1)
    print(f"Lot envoyé : {travail.name} ({len(PHRASES)} phrases)")
else:
    print(f"Reprise du suivi du lot {etat['travail']}, envoyé le {etat['envoye']}")

# 3. l'attente
FINS = {"JOB_STATE_SUCCEEDED", "JOB_STATE_FAILED", "JOB_STATE_CANCELLED", "JOB_STATE_EXPIRED"}
debut = time.time()
while True:
    travail = client.batches.get(name=etat["travail"])
    nom_etat = travail.state.name if travail.state else "?"
    if nom_etat in FINS:
        break
    print(f"   {time.strftime('%H:%M:%S')}  {nom_etat}  (attente {int(time.time() - debut) // 60} min ; Ctrl+C pour arrêter, relancer pour reprendre)")
    time.sleep(30)

print(f"État final : {nom_etat}")
if nom_etat != "JOB_STATE_SUCCEEDED":
    sys.exit(f"Le lot n'a pas abouti : {travail.error}")

# 4. les résultats : un fichier JSONL, une ligne par phrase, avec la même clé
resultats = client.files.download(file=travail.dest.file_name)
open(os.path.join(SORTIE, "resultats.jsonl"), "wb").write(resultats)
ecrits, erreurs = [], []
for ligne in resultats.decode("utf-8").splitlines():
    if not ligne.strip():
        continue
    r = json.loads(ligne)
    cle = r.get("key", "?")
    try:
        part = r["response"]["candidates"][0]["content"]["parts"][0]
        donnees = part.get("inlineData") or part.get("inline_data")
        ecrire_wav(os.path.join(SORTIE, f"{cle}.wav"), base64.b64decode(donnees["data"]), donnees.get("mimeType") or donnees.get("mime_type"))
        ecrits.append(cle)
    except Exception:
        erreurs.append((cle, json.dumps(r.get("error") or r.get("status") or r, ensure_ascii=False)[:300]))
print(f"{len(ecrits)} son(s) écrit(s). Durée totale du lot : envoyé le {etat['envoye']}, fini le {time.strftime('%Y-%m-%d %H:%M:%S')}")
for cle, err in erreurs:
    print(f"   {cle} : ÉCHEC {err}")

textes = dict(PHRASES)
lignes = [f'<tr><td>témoin (appel normal)</td><td>{html.escape(PHRASES[0][1])}</td><td><audio controls src="00-temoin-standard.wav"></audio></td></tr>']
lignes += [f'<tr><td>{c}</td><td>{html.escape(textes[c])}</td><td>' + (f'<audio controls src="{c}.wav"></audio>' if c in ecrits else "<em>échec</em>") + "</td></tr>" for c, _ in PHRASES]
open(os.path.join(SORTIE, "ecoute.html"), "w", encoding="utf-8").write(
    f"""<!doctype html><meta charset="utf-8"><title>Essai Batch Gemini</title>
<style>body{{font-family:system-ui;margin:24px}}td,th{{padding:6px 12px;text-align:left}}</style>
<h1>Batch Gemini ({MODELE}, voix {html.escape(args.voix)}, style « {STYLE} »)</h1>
<p>Comparer le témoin (appel normal) et 01 (même phrase, Batch) ; 02 et 06 : deux tirages de la même phrase.</p>
<table><tr><th>clé</th><th>texte</th><th></th></tr>{''.join(lignes)}</table>""")
print(f"Page d'écoute : {os.path.join(SORTIE, 'ecoute.html')}")
