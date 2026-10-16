# ESSAI DES STYLES ET DE LA LANGUE (gemini-3.8-flash-tts, voix Digital Assistant 2, fr-FR).
# Même phrase, plusieurs styles d'un mot (en anglais) : le timbre doit rester le même, seule l'intonation change.
# Et le paramètre language: fr-FR, avec et sans, sur les phrases ambiguës (« 3 plus 4 ? » lu en anglais).
# Les sons vont dans tools/voix/essais/out/gemini-styles/, avec une page ecoute.html qui regroupe les versions
# d'une même phrase et peut les jouer à la suite (le plus parlant pour entendre un changement de timbre).
#
#   .\.venv-gemini\Scripts\python.exe tools\voix\essais\essai_styles.py            fabrique ce qui manque (21 sons)
#   .\.venv-gemini\Scripts\python.exe tools\voix\essais\essai_styles.py --refaire  refait tout (nouveaux tirages)
import argparse, base64, html, os, sys, time

STYLES = ["", "friendly", "curious", "joyful", "gentle", "calm"]  # "" = sans style

# (groupe, texte, versions) ; une version = (style, langue), langue "fr-FR" ou "" (paramètre absent)
ESSAIS = [
    # A. le timbre : une phrase neutre, assez longue pour bien entendre la voix, dans les six styles
    ("A", "Place le poisson sur le nombre sept.", [(s, "fr-FR") for s in STYLES]),
    # B. le timbre sur une question courte et ambiguë, nombres en lettres
    ("B", "trois plus quatre ?", [(s, "fr-FR") for s in STYLES]),
    # C. la langue : la phrase du test 12, avec et sans fr-FR, sans style puis avec un style
    ("C", "3 plus 4 ?", [("", "fr-FR"), ("", ""), ("curious", "fr-FR"), ("curious", "")]),
    # D. les nombres en lettres sans fr-FR : le texte suffit-il à imposer le français ?
    ("D", "trois plus quatre ?", [("", ""), ("curious", "")]),
    # E. une exclamation très courte, ambiguë aussi
    ("E", "Super !", [("", "fr-FR"), ("joyful", "fr-FR"), ("joyful", "")]),
]

MODELE = "gemini-3.8-flash-tts"
ICI = os.path.dirname(os.path.abspath(__file__))
SORTIE = os.path.join(ICI, "out", "gemini-styles")

a = argparse.ArgumentParser()
a.add_argument("--voix", default="Digital Assistant 2")
a.add_argument("--refaire", action="store_true")
a.add_argument("--pause", type=float, default=6.5)  # niveau 1 payant : 10 requêtes par minute
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

nom = lambda g, s, l: f"{g}_{s or 'sans-style'}_{l or 'sans-langue'}.wav"

def fabriquer(texte, style, langue):
    contenu = {"type": "text", "text": texte}
    if style:
        contenu["annotations"] = [{"type": "speech_metadata", "style": style}]
    config = {"voice": voix}
    if langue:
        config["language"] = langue
    for essai in range(3):
        try:
            r = client.interactions.create(
                model=MODELE,
                input=[{"type": "user_input", "content": [contenu]}],
                response_format={"type": "audio"},
                generation_config={"speech_config": [config]},
            )
            return base64.b64decode(r.output_audio.data)
        except Exception as e:
            if ("429" in str(e) or "RESOURCE_EXHAUSTED" in str(e) or "503" in str(e)) and essai < 2:
                print("   quota ou service chargé, nouvel essai dans 65 s")
                time.sleep(65)
                continue
            raise

os.makedirs(SORTIE, exist_ok=True)
total = sum(len(v) for _, _, v in ESSAIS)
fait = 0
for g, texte, versions in ESSAIS:
    for style, langue in versions:
        fait += 1
        chemin = os.path.join(SORTIE, nom(g, style, langue))
        if os.path.exists(chemin) and not args.refaire:
            continue
        print(f"[{fait}/{total}] {g} « {texte} »  style={style or '—'}  langue={langue or '—'}")
        try:
            son = fabriquer(texte, style, langue)
            open(chemin, "wb").write(son)
        except Exception as e:
            print(f"   ÉCHEC : {e}")
            if any(m in str(e) for m in ("API key", "PERMISSION_DENIED", "401", "403")):
                sys.exit(1)
        time.sleep(args.pause)

# la page d'écoute : un bloc par phrase, chaque version, et un bouton qui les joue toutes à la suite
blocs = []
for g, texte, versions in ESSAIS:
    lignes = "".join(
        f'<tr><td>{html.escape(s or "—")}</td><td>{html.escape(l or "—")}</td>'
        f'<td><audio controls preload="none" src="{nom(g, s, l)}"></audio></td></tr>'
        for s, l in versions)
    blocs.append(f'<section><h2>{g}. « {html.escape(texte)} » <button onclick="suite(this)">▶ tout à la suite</button></h2>'
                 f'<table><tr><th>style</th><th>language</th><th></th></tr>{lignes}</table></section>')
page = f"""<!doctype html><meta charset="utf-8"><title>Essai styles Gemini</title>
<style>body{{font-family:system-ui;margin:24px;max-width:760px}}td,th{{padding:6px 12px;text-align:left}}
section{{border-top:1px solid #ccc;padding-top:8px;margin-top:16px}}button{{font-size:14px;margin-left:12px}}</style>
<h1>Gemini ({MODELE}, voix {html.escape(args.voix)}) : styles et langue</h1>
<p>Le timbre doit être le même d'une ligne à l'autre ; seule l'intonation doit changer.</p>
{''.join(blocs)}
<script>
function suite(b) {{
  const sons = [...b.closest('section').querySelectorAll('audio')]; let i = 0;
  const jouer = () => {{ if (i >= sons.length) return; const s = sons[i++]; s.currentTime = 0; s.onended = () => setTimeout(jouer, 400); s.play(); }};
  document.querySelectorAll('audio').forEach(s => s.pause()); jouer();
}}
</script>"""
open(os.path.join(SORTIE, "ecoute.html"), "w", encoding="utf-8").write(page)
print(f"\nPage d'écoute : {os.path.join(SORTIE, 'ecoute.html')}")
