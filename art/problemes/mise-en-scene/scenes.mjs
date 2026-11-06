// LA SCÈNE DE CHAQUE ÉNONCÉ (lot « Mise en scène des problèmes », fiche 23 ; décisions du parent du 6 novembre 2026). Écrit, dans la
// banque (app/content/problemes.json), le champ `scene` de chaque énoncé qui n'en a pas, d'après le relevé (relever.mjs) : la
// PREMIÈRE VERSION. Ensuite, la banque est la seule source et se corrige à la main (art/problemes/verifier.mjs contrôle chaque
// scène). `--refaire` réécrit toutes les scènes (à éviter une fois des scènes corrigées à la main) ; `--voir id` montre une scène.
//
// `scene` : les objets posés par l'application, DE GAUCHE À DROITE, chacun :
//   o   l'objet de la bibliothèque (art/problemes/mise-en-scene/objets.json) ; v : sa variante (celle de la question : un contenant
//       FERMÉ ; l'application prend la variante ouverte à la correction et au partage) ;
//   p   la phrase de l'énoncé où il apparaît (il apparaît avec elle) ;
//   n   un GROUPE : l'indice de la donnée qui dit combien il y en a (l'objet est dessiné autant de fois), ou « ? » quand c'est ce
//       qu'on cherche (un seul, en exemple) ;
//   d   les données (indices des étiquettes, `etiquettes()` de modules/problemes/problemes.js) posées SUR l'objet (sur chaque objet
//       d'un groupe : ce que chacun contient) ;
//   rep la plaque de la réponse est posée sur lui.
// Une donnée posée sur aucun objet va sur le sol du lieu (l'enfant, « tu », n'est jamais dessiné : ce qui est à lui est devant) ;
// `entre` : les données posées entre les deux premiers objets (l'écart d'une comparaison), et « rep » si la plaque y va aussi.
//   node art/problemes/mise-en-scene/scenes.mjs [--refaire] [--voir grp-07]
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LIB, PAR_ID, RE, releve } from "./relever.mjs";
import { etiquettes, donneesDe } from "../../../app/js/modules/problemes/problemes.js";

const ICI = dirname(fileURLToPath(import.meta.url)), BANQUE_F = join(ICI, "../../../app/content/problemes.json");
const RANG = { animal: 0, depot: 1, contenant: 2, personnage: 3 };
// les lieux eux-mêmes, quand l'histoire y pose ce qu'on compte (« sur son étal », « dans le pré ») : la donnée va sur le sol du lieu
const LIEU_MOTS = /sur (?:son |l['’]|le )?[ée]tal|dans le pr[ée]|dans la cour|sur la pelouse|sur la plage|au parc|au stade|dans le jardin|sur le lac|sur la mare|dans le potager|à la cantine|à la kermesse|à la f[êe]te/iu;
const PRONOM = /^(?:il|elle|ils|elles)\b/iu;
// la variante d'un objet selon le mot de l'histoire et le lieu
const FEMININ = /boulang[eè]re|marchande/iu;
function variante(o, e, mot) {
  const V = PAR_ID.get(o)?.variantes ?? [];
  if (!V.length) return undefined;
  for (const v of ["ferme", "fermee", "couvert", "couverte"]) if (V.includes(v)) return v;
  if (o === "boulanger" || o === "marchand") return FEMININ.test(mot) ? "femme" : "homme";
  if (o === "table") return { cuisine: "cuisine", cantine: "cantine", kermesse: "cantine" }[e.contexte] ?? "salon";
  if (o === "seau") return e.contexte === "etal" ? "pecheur" : "plage";
  if (o === "sac") return e.contexte === "gymnase" ? "filet" : "toile";
  if (o === "rangee") return e.contexte === "bus" ? "sieges" : "sillon";
  if (o === "minibus") return /grand car|le car/iu.test(mot) ? "car" : "minibus";
  if (o === "carnet") return /livre/iu.test(mot) ? "livre" : "carnet";
  if (o === "nid-poule") return /clapier/iu.test(mot) ? "clapier" : "poulailler";
  if (o === "toboggan") return /balan/iu.test(mot) ? "balancoires" : /bac/iu.test(mot) ? "bac" : "toboggan";
  if (o === "panier") return "vide";
  if (o === "rangee") return "sillon";
  return V[0];
}
// la première phrase (énoncé) qui nomme l'objet, et le mot qui le nomme
function mention(e, o) {
  const r = RE.get(o); if (!r) return { p: 0, mot: "" };
  for (const [j, s] of e.enonce.entries()) { r.lastIndex = 0; const m = r.exec(s); if (m) return { p: j, mot: m[0], i: m.index }; }
  return { p: 0, mot: "" };
}
const nommeDans = (texte, o) => { const r = RE.get(o); if (!r) return -1; r.lastIndex = 0; const m = r.exec(texte); return m ? m.index : -1; };

export function sceneDe(e) {
  const R0 = releve(e).filter((t) => t.role !== "unite"), R = R0.some((t) => t.role === "groupe") ? R0.filter((t) => !t.defaut) : R0, E = etiquettes(e), D = donneesDe(e), G = e.groupes;
  const groupe = G && (e.structure === "groupes-egaux" || e.structure === "partage");
  // les objets, dans l'ordre de leur première mention, les grands personnages à droite
  let objets = R.map((t) => { const m = mention(e, t.id); return { o: t.id, v: t.variante ?? variante(t.id, e, m.mot), p: m.p, i: m.i ?? 0, groupe: t.role === "groupe" ? t.n : null }; });
  // une comparaison où le même contenant est nommé deux fois (ta trousse, la trousse de ta voisine) : deux objets
  if (e.structure === "comparaison") for (const t of [...objets]) {
    if (!["contenant", "depot"].includes(PAR_ID.get(t.o)?.categorie)) continue;
    const phrases = e.enonce.map((s, j) => (nommeDans(s, t.o) >= 0 ? j : -1)).filter((j) => j >= 0);
    if (phrases.length >= 2) { const V = PAR_ID.get(t.o).variantes ?? []; objets.push({ ...t, p: phrases[1], i: 0, v: V[1] ?? t.v, double: true }); }
  }
  // (de gauche à droite : les animaux, le dépôt de la réponse, le reste dans l'ordre de l'histoire, les personnages à droite)
  const cle = (x) => { const c = PAR_ID.get(x.o).categorie; return c === "animal" ? 0 : c === "personnage" ? 3 : ["depot", "contenant"].includes(c) && x.groupe == null && nommeDans(e.question, x.o) >= 0 && !x.double ? 1 : 2; };
  objets.sort((a, b) => cle(a) - cle(b) || a.p - b.p || a.i - b.i);
  const S = objets.map(({ o, v, p, groupe: g }) => ({ o, ...(v ? { v } : {}), p, ...(g != null ? { n: g === "?" ? "?" : D.indexOf(g) >= 0 ? D.indexOf(g) : 0 } : {}) }));
  const attacher = (k, i) => { (S[k].d ??= []).includes(i) || S[k].d.push(i); };
  const premierDans = (texte, filtre = () => true) => { let best = -1, pos = Infinity; S.forEach((s, k) => { const x = nommeDans(texte, s.o); if (x >= 0 && x < pos && filtre(s, k)) { best = k; pos = x; } }); return best; };
  const kGroupe = S.findIndex((s) => s.n != null), entre = [];
  let rep = -1, repEntre = false;
  if (groupe && kGroupe >= 0) {
    // les groupes : le nombre de groupes au-dessus de la rangée (n) ; ce que contient chacun, sur chacun
    const taille = G.inconnue === "taille" ? -1 : D.indexOf(G.taille, G.inconnue === "nombre" ? 0 : 0);
    if (e.structure === "groupes-egaux") { const it = D.findIndex((x, i) => x === G.taille && i !== S[kGroupe].n); if (it >= 0) attacher(kGroupe, it); }
    if (e.structure === "partage" && G.inconnue === "nombre") { const it = D.findIndex((x) => x === G.taille); if (it >= 0) attacher(kGroupe, it); }
    void taille;
    // le total d'un partage : sur le personnage qui partage, sinon au sol
    if (e.structure === "partage") { const s0 = e.enonce[E[0].phrase], kp = premierDans(s0); if (kp >= 0 && PAR_ID.get(S[kp].o).categorie === "personnage" && S[kp].n == null && !/^tu\b/iu.test(s0)) attacher(kp, 0); }
    // la plaque : sur le dépôt de la réponse (la gamelle), sinon sur la rangée des groupes
    const kd = S.findIndex((s, k) => k !== kGroupe && s.n == null && ["depot", "contenant"].includes(PAR_ID.get(s.o).categorie) && nommeDans(e.question, s.o) >= 0);
    rep = kd >= 0 ? kd : kGroupe;
  } else {
    // chaque donnée : sur le premier objet nommé dans sa phrase (un dépôt ou un contenant d'abord, sinon un personnage)
    let dernierActeur = -1;
    E.forEach((t, i) => {
      if (S.some((x) => x.n === i)) return; // (le nombre d'un groupe : au-dessus de sa rangée)
      if (e.structure === "comparaison" && e.comparaison && e.comparaison.inconnue !== "ecart" && t.n === e.comparaison.ecart && i === 1) { entre.push(i); return; }
      const s = e.enonce[t.phrase];
      let k = premierDans(s, (x) => ["depot", "contenant"].includes(PAR_ID.get(x.o).categorie) && (!x.p || x.p === t.phrase || !S.some((y, j) => j !== S.indexOf(x) && y.o === x.o)));
      if (S.filter((x) => x.o === S[k]?.o).length > 1) k = S.findIndex((x) => x.o === S[k].o && x.p === t.phrase);
      if (k < 0 && LIEU_MOTS.test(s)) k = -1; // (« sur son étal » : le sol du lieu)
      else if (k < 0) { k = premierDans(s); if (k < 0 && PRONOM.test(s.replace(/^.*?,\s*/u, "").trim()) && /^(?:il|elle|ils|elles)\b/iu.test(s)) k = dernierActeur; }
      if (k >= 0) attacher(k, i);
      const ka = premierDans(s, (x) => PAR_ID.get(x.o).categorie === "personnage" || PAR_ID.get(x.o).categorie === "animal"); if (ka >= 0) dernierActeur = ka;
    });
    // la plaque : l'écart d'une comparaison entre les deux ; sinon sur l'objet de la question (un dépôt ou un contenant d'abord)
    if (e.structure === "comparaison" && e.comparaison?.inconnue === "ecart") repEntre = true;
    else {
      const dbl = S.map((x, k) => k).filter((k) => S.filter((y) => y.o === S[k].o).length > 1);
      rep = dbl.length ? dbl.at(-1) : premierDans(e.question, (x) => ["depot", "contenant"].includes(PAR_ID.get(x.o).categorie));
      if (rep < 0) rep = premierDans(e.question);
      if (rep < 0 && e.structure !== "comparaison") rep = S.findIndex((x) => ["depot", "contenant"].includes(PAR_ID.get(x.o).categorie));
    }
  }
  if (rep >= 0) S[rep].rep = true;
  const out = { objets: S };
  if (entre.length || repEntre) out.entre = [...entre, ...(repEntre ? ["rep"] : [])];
  return out;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const texte = readFileSync(BANQUE_F, "utf8"), B = JSON.parse(texte);
  const voir = process.argv.includes("--voir") ? process.argv[process.argv.indexOf("--voir") + 1] : null;
  if (voir) { const e = B.enonces.find((x) => x.id === voir); console.log([...e.enonce, e.question].join(" ")); console.log(JSON.stringify(e.scene ?? sceneDe(e))); process.exit(0); }
  const refaire = process.argv.includes("--refaire"); let n = 0;
  // (la banque garde sa forme : un énoncé par ligne ; seul le champ `scene` est ajouté, à la fin de la ligne)
  const lignes = texte.split("\n").map((l) => {
    const m = l.match(/^(\s*)(\{"id":"([^"]+)".*\})(,?)$/); if (!m) return l;
    const e = JSON.parse(m[2]); if (e.scene && !refaire) return l;
    e.scene = sceneDe(e); n++; return `${m[1]}${JSON.stringify(e)}${m[4]}`;
  });
  writeFileSync(BANQUE_F, lignes.join("\n"));
  console.log(`${n} scènes écrites dans app/content/problemes.json`);
}
