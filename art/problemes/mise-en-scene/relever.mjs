// LE RELEVÉ DES OBJETS DE L'HISTOIRE (maquette « Mise en scène des problèmes », docs/maquettes/problemes-scene/PROPOSITION.md).
// Lit la banque (app/content/problemes.json, sans la modifier) et la bibliothèque (objets.json) ; pour chaque énoncé, trouve les
// objets que l'histoire nomme et leur rôle :
//  - GROUPE ×n : les contenants (ou personnes, animaux, dépôts) qui forment les groupes égaux ou les parts d'un partage, dessinés
//    en nombre exact (« 3 sachets ») ; « ? » quand c'est leur nombre qu'on cherche (on n'en montre alors qu'un, en exemple) ;
//  - OBJET : nommé une fois (« la gamelle du chien », « Papa ») : dessiné une fois ;
//  - UNITÉ : ce qu'on compte (« 6 gourmandises ») : jamais dessiné tant qu'il faut le trouver, une icône sur l'étiquette.
// Puis compte combien d'énoncés servent chaque objet (et combien aux niveaux 1 à 5, ceux des premiers mois), le nombre le plus
// grand à dessiner d'un coup, et signale les énoncés qui n'auraient rien dans la scène.
//   node art/problemes/mise-en-scene/relever.mjs          # le résumé
//   node art/problemes/mise-en-scene/relever.mjs --md     # écrit OBJETS.md et PROMPTS.md (docs/maquettes/problemes-scene/)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ICI = dirname(fileURLToPath(import.meta.url)), RACINE = join(ICI, "../../.."), DOCS = join(RACINE, "docs/maquettes/problemes-scene");
const lire = (p) => JSON.parse(readFileSync(p, "utf8"));
const BANQUE = lire(join(RACINE, "app/content/problemes.json")).enonces, LIB = lire(join(ICI, "objets.json")), LIEUX = lire(join(ICI, "lieux.json"));
const PAR_ID = new Map(LIB.objets.map((o) => [o.id, o]));
const L = "\\p{L}", ADJ = "(?:petites?|petits?|grandes?|grands?|bébés?|nouveaux|autres)\\s+";
const re = (o) => (o.mots ? new RegExp(`(?<!${L})(?:${o.mots})(?!${L})`, "giu") : null);
const RE = new Map(LIB.objets.map((o) => [o.id, re(o)]));
const CONTENANT_BANQUE = { sachet: "sachet", assiette: "assiette", boite: "boite", panier: "panier", vase: "vase" };

// les objets d'un énoncé : [{ id, role: "groupe"|"objet"|"unite", n }]
export function releve(e) {
  const texte = [...e.enonce, e.question].join(" "), G = e.groupes, groupe = G && (e.structure === "groupes-egaux" || e.structure === "partage");
  const trouves = new Map(), poser = (id, role, n) => {
    const o0 = PAR_ID.get(id); id = o0?.siUnite?.[e.objet] ?? id;
    const k = `${id}|${role}`, v = trouves.get(k);
    if (!v) trouves.set(k, { id, role, n }); else if (role === "groupe" && n !== "?" && (v.n === "?" || n > v.n)) v.n = n;
  };
  for (const o of LIB.objets) {
    const r = RE.get(o.id); if (!r) continue;
    for (const m of texte.matchAll(r)) {
      const avant = texte.slice(Math.max(0, m.index - 40), m.index), apres = texte.slice(m.index + m[0].length, m.index + m[0].length + 12);
      const nb = avant.match(new RegExp(`(\\d+)\\s+(?:${ADJ})?$`, "u")), combien = /combien\s+(?:de|d['’])\s*$/iu.test(avant), chaque = /(?:chaque|par)\s+$/iu.test(avant);
      const deN = /^\s+(?:de|d['’])\s*(?:\p{L}+\s+)?\d+/u.test(apres) || /^\s+de\s+\d+/u.test(apres);
      let role;
      if (groupe && nb && Number(nb[1]) === G.nombre) role = "groupe";
      else if (groupe && combien && G.inconnue === "nombre") role = "groupe?";
      else if (groupe && chaque && o.categorie !== "unite") role = "groupe-chaque";
      else if (nb && deN && o.categorie !== "unite") role = "groupe";
      else if (nb || combien || /(?:\bdes|d['’]autres|\bles|que\s+(?:de|d['’]))\s*$/iu.test(avant)) role = "compte";
      else role = "nomme";
      if (o.categorie === "unite") { if (role === "compte" || (role === "groupe" && !groupe)) { poser(o.id, "unite"); const t = trouves.get(`${o.id}|unite`); (t.mots ??= new Set()).add(m[0].toLowerCase()); } continue; }
      if (o.seulement === "groupe" && !role.startsWith("groupe")) continue;
      if (role === "groupe") poser(o.id, "groupe", Number(nb[1]));
      else if (role === "groupe?") poser(o.id, "groupe", "?");
      else if (role === "groupe-chaque") poser(o.id, "groupe", G.inconnue === "nombre" ? "?" : G.nombre);
      else if (role === "nomme") poser(o.id, "objet", 1);
      // (compté sans être un groupe : « 7 vaches et 9 moutons » : ce sont des unités, l'icône vient des unités)
    }
  }
  // le contenant que la banque donne aux groupes et au partage, s'il n'est pas déjà dans l'histoire (« entre toi et ton copain » :
  // 2 assiettes)
  if (groupe && e.contenant && ![...trouves.values()].some((t) => t.role === "groupe")) poser(CONTENANT_BANQUE[e.contenant] ?? e.contenant, "groupe", G.inconnue === "nombre" ? "?" : G.nombre);
  // un groupe et le même objet nommé (« 3 tables… autour de chaque table ») : le groupe seul
  for (const [k, v] of [...trouves]) if (v.role === "objet" && trouves.has(`${v.id}|groupe`)) trouves.delete(k);
  let out = [...trouves.values()];
  // sans dépôt ni contenant nommé : celui du lieu (la table de la cuisine, le pupitre de la classe…)
  const lieu = LIEUX.lieux.find((l) => l.id === e.contexte);
  if (lieu?.defaut && !out.some((t) => ["depot", "contenant"].includes(PAR_ID.get(t.id)?.categorie))) { const [id, v] = lieu.defaut.split(":"); out.push({ id, role: "objet", n: 1, variante: v, defaut: true }); }
  return out;
}

const ROLE = { groupe: (t) => `${t.n === "?" ? "?" : `×${t.n}`}`, objet: () => "", unite: () => "" };
const nomCourt = (id) => PAR_ID.get(id)?.nom.split(" (")[0] ?? id;
export const PRINCIPAL = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
export { LIB, LIEUX, PAR_ID, RE };
const RELEVES = BANQUE.map((e) => ({ e, objets: releve(e) }));

// les comptes par objet
const stats = new Map(LIB.objets.map((o) => [o.id, { o, enonces: new Set(), debut: new Set(), max: 0, roles: new Set(), ids: [] }]));
for (const { e, objets } of RELEVES) for (const t of objets) {
  const s = stats.get(t.id); if (!s) { console.error(`objet inconnu ${t.id} (${e.id})`); continue; }
  s.enonces.add(e.id); if (e.niveau <= 5) s.debut.add(e.id); s.roles.add(t.role === "groupe" ? (t.n === "?" ? "groupe ?" : "groupe") : t.role + (t.defaut ? " (par défaut)" : ""));
  if (t.role === "groupe" && t.n !== "?") s.max = Math.max(s.max, t.n); else if (t.role !== "unite") s.max = Math.max(s.max, 1);
  s.ids.push(e.id);
}
const rang = [...stats.values()].sort((a, b) => b.enonces.size - a.enonces.size || b.debut.size - a.debut.size || a.o.id.localeCompare(b.o.id));
const vides = RELEVES.filter(({ objets }) => !objets.some((t) => t.role !== "unite"));
const aFaire = (o) => !o.existe && !/^Dessiné par le code|^Les icônes d'unité/.test(o.sujet);

const CAT = ["personnage", "animal", "contenant", "depot", "unite"], NOM_CAT = { personnage: "Personnages", animal: "Animaux", contenant: "Contenants", depot: "Lieux de dépôt", unite: "Unités comptées (icônes)" };
if (PRINCIPAL) console.log(`${BANQUE.length} énoncés ; ${LIB.objets.length} objets dans la bibliothèque (${LIB.objets.filter((o) => o.categorie !== "unite").length} hors unités).`);
if (PRINCIPAL) for (const c of CAT) {
  const l = rang.filter((s) => s.o.categorie === c && s.enonces.size);
  console.log(`\n${NOM_CAT[c]} : ${l.map((s) => `${s.o.id} ${s.enonces.size}${s.max > 1 ? ` (×${s.max})` : ""}`).join(", ")}`);
}
const inutiles = rang.filter((s) => !s.enonces.size).map((s) => s.o.id);
if (PRINCIPAL && inutiles.length) console.log(`\nObjets sans énoncé : ${inutiles.join(", ")}`);
if (PRINCIPAL) console.log(`\nÉnoncés sans objet dessiné (seulement le lieu et les étiquettes) : ${vides.length}${vides.length ? ` : ${vides.map(({ e }) => e.id).join(", ")}` : ""}`);

if (PRINCIPAL && process.argv.includes("--md")) {
  mkdirSync(DOCS, { recursive: true });
  const cellObjets = (objets) => objets.filter((t) => t.role !== "unite").map((t) => `${nomCourt(t.id)}${t.variante ? ` (${t.variante})` : ""}${ROLE[t.role](t) ? ` ${ROLE[t.role](t)}` : ""}${t.defaut ? "*" : ""}`).join(", ") || "—";
  const cellUnites = (objets) => objets.filter((t) => t.role === "unite").map((t) => [...(t.mots ?? [nomCourt(t.id)])].join(", ")).join(", ") || "—";
  const parCat = CAT.map((c) => {
    const l = rang.filter((s) => s.o.categorie === c);
    return `### ${NOM_CAT[c]} (${l.length})\n\n| Objet | Énoncés | dont niveaux 1 à 5 | Au plus à la fois | Rôles | Variantes | À générer |\n| --- | --- | --- | --- | --- | --- | --- |\n` +
      l.map((s) => `| **${s.o.nom}** (\`${s.o.id}\`) | ${s.enonces.size} | ${s.debut.size} | ${s.max || "—"} | ${[...s.roles].join(", ") || "—"} | ${(s.o.variantes ?? []).join(", ") || "—"} | ${s.o.existe ? `non, existe : ${s.o.existe}` : aFaire(s.o) ? "oui" : "non (code)"} |`).join("\n");
  }).join("\n\n");
  const debut = rang.filter((s) => s.o.categorie !== "unite" && s.debut.size && aFaire(s.o)), debutU = rang.filter((s) => s.o.categorie === "unite" && s.debut.size && aFaire(s.o));
  const nGen = LIB.objets.filter(aFaire), images = nGen.reduce((n, o) => n + Math.max(1, o.variantes?.length ?? 1), 0);
  const top = rang.filter((s) => s.o.categorie !== "unite").slice(0, 15).map((s, i) => `${i + 1}. **${s.o.nom}** : ${s.enonces.size} énoncés (${s.debut.size} aux niveaux 1 à 5)${s.max > 1 ? `, jusqu'à ${s.max} à la fois` : ""}`).join("\n");
  const md = `# Les objets de l'histoire : le relevé

Écrit par \`node art/problemes/mise-en-scene/relever.mjs --md\` à partir de la banque (\`app/content/problemes.json\`, ${BANQUE.length} énoncés) et de la bibliothèque proposée (\`art/problemes/mise-en-scene/objets.json\`). Ne pas modifier à la main : modifier \`objets.json\` (les mots qui désignent chaque objet) et relancer.

**Lecture** : *groupe ×n*, dessiné n fois, en nombre exact (3 sachets) ; *groupe ?*, le nombre de groupes est la question (on n'en montre qu'un, en exemple) ; *objet*, nommé par l'histoire, dessiné une fois ; *unité*, ce qu'on compte, jamais dessiné tant qu'il faut le trouver (une icône sur l'étiquette) ; *par défaut* (\`*\`), le dépôt du lieu quand l'histoire n'en nomme pas (\`lieux.json\`, \`defaut\`).

## Ceux qui servent le plus (hors unités)

${top}

**Pour les niveaux 1 à 5** (ceux des premiers mois) : ${debut.length} objets hors unités (${debut.map((s) => `\`${s.o.id}\``).join(", ")}) et ${debutU.length} unités.

**${nGen.length} objets à générer en tout, ${images} images** avec leurs variantes (les autres existent déjà, à l'étal, ou restent dessinés par le code). Énoncés sans aucun objet dessiné : **${vides.length}**${vides.length ? ` (${vides.map(({ e }) => `\`${e.id}\``).join(", ")})` : ""}.

## Par catégorie

${parCat}

## Énoncé par énoncé

| Énoncé | Niv. | Structure | Lieu | Dans la scène (dessiné) | Unités (cachées) | L'histoire |
| --- | --- | --- | --- | --- | --- | --- |
${RELEVES.map(({ e, objets }) => `| \`${e.id}\` | ${e.niveau} | ${e.structure}${e.inconnue ? `, ${e.inconnue}` : ""} | ${e.contexte} | ${cellObjets(objets)} | ${cellUnites(objets)} | ${[...e.enonce, e.question].join(" ").replace(/\|/g, "/")} |`).join("\n")}
`;
  writeFileSync(join(DOCS, "OBJETS.md"), md);
  // les prompts, prêts à copier, avec la taille et le dépôt
  const prompt = (o, v) => {
    const etat = o.etatVariantes?.[v] ?? LIB.etats[o.etat ?? o.categorie] ?? LIB.etats.vide;
    return `${LIB.ouverture}\n\n${LIB.promptBase.replace("[SUJET]", o.sujet).replace("[ETAT]", etat).replace("[FOND]", LIB.fonds[o.fond ?? "vert"])}`;
  };
  const px = (o) => { const [a, b] = o.format.split(":").map(Number), h = o.h, w = Math.round((h * a) / b); return `${h} px de haut dans la scène (@1x ; @2x : ${2 * h} px), image générée ${LIB.formats[o.format]}`; };
  const fiche = (o) => {
    const vs = o.variantes ?? [null], s = stats.get(o.id);
    return `### ${o.nom} (\`${o.id}\`)\n\n- **Sert** : ${s.enonces.size} énoncés${s.max > 1 ? `, jusqu'à ${s.max} à la fois` : ""}. **Taille** : ${px(o)}. **Fond** : ${o.fond === "magenta" ? "magenta (l'objet a du vert)" : "vert"}.\n- **Où le déposer** : ${vs.map((v) => `\`art/problemes/mise-en-scene/sources/${o.id}${v ? `-${v}` : ""}.png\``).join(", ")}${o.note ? `\n- **Note** : ${o.note}` : ""}\n\n` +
      (o.etatVariantes ? vs.map((v) => `${v ? `*${v}* :\n\n` : ""}\`\`\`text\n${prompt(o, v)}\n\`\`\``).join("\n\n") : `\`\`\`text\n${prompt(o, null)}\n\`\`\`${vs[0] ? `\n\n(une image par variante : ${vs.join(", ")} ; le prompt les décrit toutes, en demander une à la fois en reprenant sa description)` : ""}`);
  };
  const ordre = [...rang.filter((s) => aFaire(s.o) && s.o.categorie !== "unite"), ...rang.filter((s) => aFaire(s.o) && s.o.categorie === "unite")].map((s) => s.o);
  const pm = `# Les prompts Nano Banana des objets de l'histoire

Écrit par \`node art/problemes/mise-en-scene/relever.mjs --md\` (\`art/problemes/mise-en-scene/objets.json\`). Dans l'ordre où les objets servent le plus : commencer par le haut de la liste suffit pour les premiers niveaux.

**Méthode** (la même que pour les produits de l'étal, \`art/etal/outils/5-produits.py\`) :

1. Joindre l'image de référence du style : \`art/etal/sources/etal-beau-temps.jpg\` ; dès qu'un objet de la même catégorie est réussi (un personnage, un contenant), le joindre aussi, en deuxième image, et ajouter « Same character design (proportions, line weight, eyes) as the second attached image. » : c'est ce qui garde une même main pour Papa, Maman, la maîtresse…
2. Copier le prompt. Une image par variante (« fermé », « ouvert »…) : demander l'une, puis « the same object, but … » pour l'autre, dans la même conversation.
3. Vérifier : un seul objet, entier, rien dedans qu'on puisse compter, aucun texte ni chiffre, le contour fermé tout autour, le fond d'une seule couleur.
4. Déposer l'image telle quelle dans \`art/problemes/mise-en-scene/sources/\`, sous le nom indiqué. Le détourage (fond vert ou magenta retiré, cadrage, réduction en @1x et @2x) sera fait par l'atelier, au lot.

**Fond** : vert franc (\`#00FF00\`), comme les produits de l'étal, les créatures du récif et la mascotte ; **magenta** (\`#FF00FF\`) pour un objet qui a du vert (le détourage retirerait sa couleur).

## Le prompt commun

\`\`\`text
${LIB.ouverture}

${LIB.promptBase}
\`\`\`

[SUJET] : la description de l'objet ; [ETAT] : selon sa catégorie (personnage : « Full body, standing… » ; contenant : « It is closed… » ; dépôt : « It is empty… ») ; [FOND] : la couleur du fond. Les prompts complets suivent.

## Les ${ordre.length} objets à générer

${ordre.map(fiche).join("\n\n")}

## Les lieux, revus pour la mise en scène

\`art/problemes/mise-en-scene/lieux.json\` (validés par le parent le 6 novembre 2026 ; le lot les reporte dans \`art/problemes/contextes.json\`, dont les prompts n'ont pas encore servi, sauf l'étal). Format : ${LIEUX.format} Déposer l'image dans \`art/problemes/sources/<lieu>.png\`, comme prévu aujourd'hui.

${LIEUX.lieux.filter((l) => l.scene).map((l) => `### ${l.id}\n\n\`\`\`text\n${LIEUX.ouverture}\n\n${LIEUX.promptBase.replace("[SCENE]", l.scene).replace("[SOL]", l.sol).replace("[ABSENT]", l.absent)}\n\`\`\``).join("\n\n")}
`;
  writeFileSync(join(DOCS, "PROMPTS.md"), pm);
  console.log(`\n${join("docs/maquettes/problemes-scene", "OBJETS.md")}, PROMPTS.md`);
}
