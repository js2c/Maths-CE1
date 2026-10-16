# DÉMOS GEMINI : trois passages longs, avec un style commun, voix Digital Assistant 2, fr-FR (gemini-3.8-flash-tts).
# Les sons vont dans tools/voix/essais/out/gemini-demos/ (non versionné). Trois requêtes en tout.
#
#   .\.venv-gemini\Scripts\python.exe tools\voix\essais\demo_gemini.py              fabrique les démos qui manquent
#   .\.venv-gemini\Scripts\python.exe tools\voix\essais\demo_gemini.py --refaire    les refait toutes
#   .\.venv-gemini\Scripts\python.exe tools\voix\essais\demo_gemini.py --voix Kore  une autre voix
import argparse, base64, os, sys, time

STYLE = (
    "Speak in natural metropolitan French with a consistent, warm, lively, friendly "
    "primary-school teacher's voice. Moderate, slightly brisk conversational pace, "
    "clear pronunciation of numbers and mathematics, subtle expressive intonation. "
    "Questions should sound curious; congratulations genuinely joyful. "
    "Speak the transcript exactly, without adding words. No theatrical exaggeration."
)

DEMOS = [
    ("demo_additions", "Allez, on commence avec quelques additions ! <short pause> "
     "Combien font huit plus cinq ? <long pause> Huit plus cinq... Réfléchis un instant ! "
     "On compte ensemble ! <breath> Neuf, dix, onze, douze... treize ! "
     "Bravo ! <chuckle> Tu as trouvé la bonne réponse !"),
    ("demo_monnaie", "Bonjour ! Le cahier coûte six euros et cinquante centimes. "
     "Tu me donnes dix euros. <short pause> Je complète jusqu'à sept euros "
     "avec cinquante centimes, puis jusqu'à dix euros avec trois euros. "
     "Je te rends donc trois euros et cinquante centimes. Bravo !"),
    ("demo_multiplications", "Écoute bien. Première multiplication ! "
     "Trois fois quatre ? <long pause> Trois fois quatre, ça fait douze ! "
     "À présent, cinq fois six ? <long pause> Cinq fois six, ça fait trente. Excellent !"),
]

MODELE = "gemini-3.8-flash-tts"
SORTIE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out", "gemini-demos")

a = argparse.ArgumentParser()
a.add_argument("--voix", default="Digital Assistant 2")
a.add_argument("--refaire", action="store_true")
a.add_argument("--pause", type=float, default=21.0)  # palier gratuit : 3 requêtes par minute
args = a.parse_args()

if not os.environ.get("GEMINI_API_KEY"):
    sys.exit("La clé manque : setx GEMINI_API_KEY \"...\", puis rouvrir PowerShell.")

from google import genai
client = genai.Client()

# la voix : cherchée dans la bibliothèque, parmi les voix françaises de France, par son nom exact ;
# introuvable : on s'arrête (envoyer un nom inconnu tel quel donne une voix imprévisible)
def trouver_voix(nom):
    try:
        r = client.voices.list(search=nom, language_code=["fr-FR"], page_size=100)
    except Exception as e:
        sys.exit(f"Impossible de lire la bibliothèque de voix : {e}")
    exactes = [v for v in (r.voices or []) if (v.display_name or "").lower() == nom.lower()]
    if not exactes:
        autres = ", ".join(f"{v.display_name} ({v.language_code})" for v in (r.voices or [])[:10]) or "aucune"
        sys.exit(f"Voix « {nom} » introuvable parmi les voix fr-FR. Proches : {autres}")
    v = exactes[0]
    print(f"Voix : {v.display_name} (id {v.id}, {v.language_code}, accent {v.accent}, {v.gender}) : {v.description}")
    return v.id
voix = trouver_voix(args.voix)
# un sous-dossier par voix : les essais de deux voix ne se mélangent pas
SORTIE = os.path.join(SORTIE, "".join(c if c.isalnum() else "-" for c in args.voix.lower()))

os.makedirs(SORTIE, exist_ok=True)
a_faire = [d for d in DEMOS if args.refaire or not os.path.exists(os.path.join(SORTIE, d[0] + ".wav"))]
print(f"{len(a_faire)} démo(s) à fabriquer.")
for i, (nom, texte) in enumerate(a_faire):
    print(f"- {nom}")
    for essai in range(2):
        try:
            r = client.interactions.create(
                model=MODELE,
                input=[{"type": "user_input", "content": [{
                    "type": "text", "text": texte,
                    "annotations": [{"type": "speech_metadata", "style": STYLE}],
                }]}],
                response_format={"type": "audio"},
                generation_config={"speech_config": [{"voice": voix, "language": "fr-FR"}]},
            )
            with open(os.path.join(SORTIE, nom + ".wav"), "wb") as f:
                f.write(base64.b64decode(r.output_audio.data))
            break
        except Exception as e:
            if ("429" in str(e) or "RESOURCE_EXHAUSTED" in str(e)) and essai == 0:
                print("   quota par minute atteint, nouvel essai dans 65 s")
                time.sleep(65)
                continue
            sys.exit(f"   ÉCHEC : {e}\n   (si c'est un quota : le quota du jour est sans doute atteint, relancer demain)")
    if i < len(a_faire) - 1:
        time.sleep(args.pause)

print(f"\nSons dans : {SORTIE}")
