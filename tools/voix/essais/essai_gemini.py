# ESSAI DE LA VOIX GEMINI (gemini-3.8-flash-tts), à côté de la voix actuelle (Chatterbox).
# Ne touche pas à l'application : les sons vont dans tools/voix/essais/out/gemini/ (non versionné),
# avec une page ecoute.html qui met chaque phrase Gemini à côté du son Chatterbox du jeu.
#
# Installation (une fois, dans PowerShell, depuis le dossier du jeu) :
#   python -m venv .venv-gemini
#   .venv-gemini\Scripts\python.exe -m pip install "google-genai>=2.25.0"
# La clé : variable d'environnement GEMINI_API_KEY (jamais dans le dépôt, qui est public).
#
# Utilisation :
#   .venv-gemini\Scripts\python.exe tools\voix\essais\essai_gemini.py --voix-dispo   liste les voix fr-FR de la bibliothèque
#   .venv-gemini\Scripts\python.exe tools\voix\essais\essai_gemini.py                fabrique ce qui manque (reprend où il s'était arrêté)
#   .venv-gemini\Scripts\python.exe tools\voix\essais\essai_gemini.py --refaire 9,17 refait les phrases 9 et 17 (après avoir changé texte ou style)
#   .venv-gemini\Scripts\python.exe tools\voix\essais\essai_gemini.py --refaire tout refait tout
#   .venv-gemini\Scripts\python.exe tools\voix\essais\essai_gemini.py --a-blanc      montre les requêtes sans rien envoyer
#   .venv-gemini\Scripts\python.exe tools\voix\essais\essai_gemini.py --seulement 9,12,13  ne fabrique que ces phrases (si elles manquent)
# Options : --voix <nom ou id> (Digital Assistant 2 par défaut, cherchée parmi les voix fr-FR), --pause <secondes> entre deux requêtes (6,5 par défaut : 10 par minute au niveau 1 payant).
# Palier gratuit : 10 requêtes par jour ; au quota du jour, le script s'arrête et reprend le lendemain là où il en était.
import argparse, base64, html, json, os, sys, time, wave

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.normpath(os.path.join(ICI, "..", "..", ".."))
SORTIE = os.path.join(ICI, "out", "gemini")
INDEX_JEU = os.path.join(RACINE, "app", "assets", "voix", "index.json")
MODELE = "gemini-3.8-flash-tts"

a = argparse.ArgumentParser()
a.add_argument("--voix", default="Digital Assistant 2")
a.add_argument("--phrases", default=os.path.join(ICI, "phrases_gemini.json"))
a.add_argument("--refaire", default="")
a.add_argument("--pause", type=float, default=6.5)
a.add_argument("--seulement", default="")
a.add_argument("--a-blanc", action="store_true")
a.add_argument("--voix-dispo", action="store_true")
args = a.parse_args()

PHRASES = json.load(open(args.phrases, encoding="utf-8"))["phrases"]

def requete(p, voix):
    return dict(
        model=MODELE,
        input=[{"type": "user_input", "content": [{
            "type": "text", "text": p["texte"],
            **({"annotations": [{"type": "speech_metadata", "style": p["style"]}]} if p.get("style") else {}),
        }]}],
        response_format={"type": "audio"},
        generation_config={"speech_config": [{"voice": voix, "language": "fr-FR"}]},
    )

if args.a_blanc:
    for p in PHRASES:
        print(json.dumps(requete(p, args.voix), ensure_ascii=False))
    sys.exit(0)

if not os.environ.get("GEMINI_API_KEY"):
    sys.exit("La clé manque : dans PowerShell, $env:GEMINI_API_KEY = \"...\" (voir la marche à suivre).")

from google import genai
client = genai.Client()

if args.voix_dispo:
    # les voix françaises de France (filtrées sur le nom si --voix est donné explicitement)
    filtre = {"search": args.voix} if "--voix" in sys.argv else {}
    jeton = None
    while True:
        r = client.voices.list(language_code=["fr-FR"], page_size=100, **filtre, **({"page_token": jeton} if jeton else {}))
        for v in r.voices or []:
            print(f"{v.display_name!r:28} id={v.id!r:32} accent={v.accent} genre={v.gender} : {v.description}")
        jeton = r.next_page_token
        if not jeton:
            break
    sys.exit(0)

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
refaire = set(range(1, len(PHRASES) + 1)) if args.refaire == "tout" else {int(x) for x in args.refaire.split(",") if x.strip()}
fichier = lambda p: os.path.join(SORTIE, f"{p['n']:02d}.wav")

class QuotaDuJour(Exception):
    pass

def fabriquer(p):
    # palier gratuit : 3 requêtes par minute, 10 par jour. Un refus pour quota : une seule nouvelle tentative
    # après une minute (quota par minute) ; un second refus, c'est le quota du jour : on s'arrête.
    for essai in range(2):
        try:
            r = client.interactions.create(**requete(p, voix))
            return base64.b64decode(r.output_audio.data)
        except Exception as e:
            texte = str(e)
            if "429" in texte or "RESOURCE_EXHAUSTED" in texte:
                if essai == 0:
                    print("   quota par minute atteint, nouvel essai dans 65 s")
                    time.sleep(65)
                    continue
                raise QuotaDuJour(texte)
            if "503" in texte and essai == 0:
                time.sleep(30)
                continue
            raise

seulement = {int(x) for x in args.seulement.split(",") if x.strip()}
a_faire = [p for p in PHRASES if (p["n"] in refaire or not os.path.exists(fichier(p))) and (not seulement or p["n"] in seulement or p["n"] in refaire)]
print(f"{len(a_faire)} phrase(s) à fabriquer sur {len(PHRASES)}.")
erreurs = []
for i, p in enumerate(a_faire):
    print(f"{p['n']:02d}. {p['texte']}   [{p.get('style', '')}]")
    try:
        son = fabriquer(p)
        with open(fichier(p), "wb") as f:
            f.write(son)
    except QuotaDuJour:
        print("   quota du jour atteint : relancer la même commande demain, le script reprendra là où il s'est arrêté.")
        erreurs.append(p["n"])
        break
    except Exception as e:
        print(f"   ÉCHEC : {e}")
        erreurs.append(p["n"])
        if any(m in str(e) for m in ("API key", "PERMISSION_DENIED", "403", "401")):
            break
    if i < len(a_faire) - 1:
        time.sleep(args.pause)

# la page d'écoute : Gemini à gauche, la voix actuelle du jeu à droite
index = json.load(open(INDEX_JEU, encoding="utf-8"))["phrases"] if os.path.exists(INDEX_JEU) else {}
def duree(chemin):
    try:
        with wave.open(chemin) as w:
            return f"{w.getnframes() / w.getframerate():.1f} s"
    except Exception:
        return ""
lignes = []
for p in PHRASES:
    g = fichier(p)
    gem = f'<audio controls preload="none" src="{os.path.basename(g)}"></audio> <small>{duree(g)}</small>' if os.path.exists(g) else "<em>pas encore fabriquée</em>"
    ch = index.get(p["phrase"])
    cha = f'<audio controls preload="none" src="{os.path.relpath(os.path.join(RACINE, "app", "assets", "voix", ch[0]), SORTIE).replace(os.sep, "/")}"></audio> <small>{ch[1] / 1000:.1f} s</small>' if ch else "<em>absente</em>"
    lignes.append(f"<tr><td>{p['n']}</td><td><b>{html.escape(p['texte'])}</b><br><small>style : {html.escape(p.get('style', ''))}</small></td><td>{gem}</td><td>{cha}</td></tr>")
page = f"""<!doctype html><meta charset="utf-8"><title>Essai voix Gemini</title>
<style>body{{font-family:system-ui;margin:24px}}table{{border-collapse:collapse}}td,th{{border-bottom:1px solid #ddd;padding:8px;vertical-align:middle;text-align:left}}small{{color:#666}}</style>
<h1>Essai Gemini ({MODELE}, voix {html.escape(args.voix)}) contre Chatterbox</h1>
<table><tr><th>n°</th><th>Texte envoyé</th><th>Gemini</th><th>Chatterbox (jeu actuel)</th></tr>{''.join(lignes)}</table>"""
open(os.path.join(SORTIE, "ecoute.html"), "w", encoding="utf-8").write(page)
print(f"\nPage d'écoute : {os.path.join(SORTIE, 'ecoute.html')}")
if erreurs:
    print(f"Échecs : {','.join(map(str, erreurs))} (relancer la même commande pour les refaire)")
