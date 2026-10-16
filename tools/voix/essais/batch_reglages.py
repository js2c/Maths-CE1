# ESSAI DES RÉGLAGES EN BATCH (gemini-3.8-flash-tts) : le tirage (seed) et la température rendent-ils le timbre
# plus régulier d'une phrase à l'autre ? Mêmes 6 phrases que batch_gemini.py, même voix, même style, en plusieurs
# versions, dans un seul lot. Et une vérification utile pour la suite : un autre seed donne-t-il un autre son ?
# (sans cela, impossible de refaire une phrase refusée par le contrôle : le Batch rend le même son à demande égale)
#
#   .\.venv-gemini\Scripts\python.exe tools\voix\essais\batch_reglages.py
# Comme batch_gemini.py : on peut fermer PowerShell pendant l'attente, relancer reprend le suivi ; --nouveau renvoie un lot.
import argparse, base64, html, json, os, sys, time, wave

STYLE = "friendly"

PHRASES = [
    ("01", "Bonsoir, et bienvenue !"),
    ("02", "trois plus quatre ?"),
    ("03", "Ce n'est pas grave, <short pause> regardons ensemble."),
    ("04", "<gasp> Oh ! Elle est brillante !"),
    ("05", "Place le poisson sur le nombre sept."),
    ("06", "Bravo, tu as trouvé !"),
]

# (code, description, réglages ajoutés à generationConfig, phrases concernées ; None = toutes)
VERSIONS = [
    ("A", "sans réglage (comme le lot précédent)", {}, None),
    ("B", "seed 42 pour toutes les phrases", {"seed": 42}, None),
    ("C", "seed 42 + température 0,5", {"seed": 42, "temperature": 0.5}, None),
    ("D", "seed 7 : un autre tirage donne-t-il un autre son ? (à comparer à B)", {"seed": 7}, ["01", "02"]),
]

MODELE = "gemini-3.8-flash-tts"
ICI = os.path.dirname(os.path.abspath(__file__))

a = argparse.ArgumentParser()
a.add_argument("--voix", default="Digital Assistant 2")
a.add_argument("--nouveau", action="store_true")
args = a.parse_args()
SORTIE = os.path.join(ICI, "out", "gemini-reglages", "".join(c if c.isalnum() else "-" for c in args.voix.lower()))
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
    print(f"Voix : {exactes[0].display_name} (id {exactes[0].id}, {exactes[0].language_code})")
    return exactes[0].id

def ecrire_wav(chemin, donnees, mime):
    if donnees[:4] == b"RIFF":
        open(chemin, "wb").write(donnees)
        return
    taux = 24000
    for morceau in (mime or "").split(";"):
        if morceau.strip().startswith("rate="):
            taux = int(morceau.strip()[5:])
    with wave.open(chemin, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(taux); w.writeframes(donnees)

def demande(texte, voix, reglages):
    config = {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"voice": voix}, "languageCode": "fr-FR"}}
    config.update(reglages)
    return {"contents": [{"role": "user", "parts": [{"text": texte, "speechMetadata": {"style": STYLE}}]}], "generationConfig": config}

lignes_lot = [(f"{v}-{c}", t, r) for v, _, r, quelles in VERSIONS for c, t in PHRASES if quelles is None or c in quelles]

etat = json.load(open(ETAT, encoding="utf-8")) if os.path.exists(ETAT) and not args.nouveau else None
if not etat:
    voix = trouver_voix(args.voix)
    chemin_lot = os.path.join(SORTIE, "lot.jsonl")
    with open(chemin_lot, "w", encoding="utf-8") as f:
        for cle, texte, reglages in lignes_lot:
            f.write(json.dumps({"key": cle, "request": demande(texte, voix, reglages)}, ensure_ascii=False) + "\n")
    fichier = client.files.upload(file=chemin_lot, config=types.UploadFileConfig(display_name="reglages-voix-ce1", mime_type="jsonl"))
    travail = client.batches.create(model=MODELE, src=fichier.name, config={"display_name": "reglages-voix-ce1"})
    etat = {"travail": travail.name, "envoye": time.strftime("%Y-%m-%d %H:%M:%S")}
    json.dump(etat, open(ETAT, "w", encoding="utf-8"), indent=1)
    print(f"Lot envoyé : {travail.name} ({len(lignes_lot)} sons)")
else:
    print(f"Reprise du suivi du lot {etat['travail']}, envoyé le {etat['envoye']}")

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

resultats = client.files.download(file=travail.dest.file_name)
open(os.path.join(SORTIE, "resultats.jsonl"), "wb").write(resultats)
ecrits = set()
for ligne in resultats.decode("utf-8").splitlines():
    if not ligne.strip():
        continue
    r = json.loads(ligne)
    cle = r.get("key", "?")
    try:
        part = r["response"]["candidates"][0]["content"]["parts"][0]
        d = part.get("inlineData") or part.get("inline_data")
        ecrire_wav(os.path.join(SORTIE, f"{cle}.wav"), base64.b64decode(d["data"]), d.get("mimeType") or d.get("mime_type"))
        ecrits.add(cle)
    except Exception:
        print(f"   {cle} : ÉCHEC {json.dumps(r.get('error') or r.get('status') or r, ensure_ascii=False)[:300]}")
print(f"{len(ecrits)} son(s) sur {len(lignes_lot)}. Lot envoyé le {etat['envoye']}, fini le {time.strftime('%Y-%m-%d %H:%M:%S')}")

# la page : une colonne par version ; le bouton enchaîne les phrases de la colonne (01 puis 02 d'abord : l'écart à juger)
def cellule(cle):
    return f'<audio controls preload="none" src="{cle}.wav"></audio>' if cle in ecrits else "<em>—</em>"
entete = "".join(f'<th>{v}. {html.escape(d)}<br><button onclick="suite(\'{v}\')">▶ enchaîner</button></th>' for v, d, _, _ in VERSIONS)
corps = "".join(f"<tr><td><b>{c}</b> {html.escape(t)}</td>" + "".join(f'<td data-v="{v}">{cellule(f"{v}-{c}")}</td>' for v, _, _, _ in VERSIONS) + "</tr>" for c, t in PHRASES)
open(os.path.join(SORTIE, "ecoute.html"), "w", encoding="utf-8").write(f"""<!doctype html><meta charset="utf-8"><title>Réglages Gemini</title>
<style>body{{font-family:system-ui;margin:24px}}td,th{{padding:6px 10px;text-align:left;vertical-align:top;border-bottom:1px solid #ddd}}th{{font-weight:600;font-size:14px}}audio{{width:190px}}</style>
<h1>Batch Gemini : seed et température (voix {html.escape(args.voix)}, style « {STYLE} »)</h1>
<p>Dans chaque colonne, le timbre doit rester le même d'une phrase à l'autre. D contre B : si D01 et D02 sonnent exactement comme B01 et B02, le seed n'agit pas.</p>
<table><tr><th>phrase</th>{entete}</tr>{corps}</table>
<script>
function suite(v) {{
  const sons = [...document.querySelectorAll('td[data-v="' + v + '"] audio')]; let i = 0;
  document.querySelectorAll('audio').forEach(s => s.pause());
  const jouer = () => {{ if (i >= sons.length) return; const s = sons[i++]; s.currentTime = 0; s.onended = () => setTimeout(jouer, 400); s.play(); }};
  jouer();
}}
</script>""")
print(f"Page d'écoute : {os.path.join(SORTIE, 'ecoute.html')}")
