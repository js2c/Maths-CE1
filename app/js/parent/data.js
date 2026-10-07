// ESPACE PARENT · LES CALCULS (docs/SPEC.md, « Espace parent »). Fonctions pures : les enregistrements de
// la base entrent (séances, réponses, niveaux, faits), les tableaux que le parent lit sortent. Aucun accès
// au DOM ni à la base ici (tests : tests/unit/parent.test.mjs).
import { catalog, median, ruleFacts, threshold } from "../modules/facts/facts.js";
import { cfgOf, currentFamily, initialFamilies } from "../modules/facts/families.js";
import { goodWeeks, quotaAt, weekStart, zoneDone } from "../session/rewards.js";

export const DAY = 86400000;
const two = (n) => String(n).padStart(2, "0");
// « 2026-09-26 », à l'heure de la tablette
export const dayKey = (t) => { const d = new Date(t); return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`; };

// ---------------------------------------------------------------- écriture en français
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
export const monthName = (m) => MOIS[m];
export const fmtDay = (t) => { const d = new Date(t); return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]} ${d.getFullYear()}`; };
export const fmtShortDay = (t) => { const d = new Date(t); return `${two(d.getDate())}/${two(d.getMonth() + 1)}`; };
export const fmtTime = (t) => { const d = new Date(t); return `${two(d.getHours())} h ${two(d.getMinutes())}`; };
// une durée en secondes -> « 8 min 12 s », « 1 h 05 min », « 45 s »
export const fmtDuration = (s) => {
  if (s === null || s === undefined || Number.isNaN(s)) return "—";
  s = Math.round(s);
  if (s < 60) return `${s} s`;
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h} h ${two(m)} min` : `${m} min${r ? ` ${two(r)} s` : ""}`;
};
export const fmtPct = (x) => (x === null || x === undefined ? "—" : `${Math.round(x * 100)} %`);
export const fmtSeconds = (ms) => (ms === null || ms === undefined ? "—" : `${(ms / 1000).toFixed(1).replace(".", ",")} s`);

// ---------------------------------------------------------------- calendrier
// la grille d'un mois : des semaines du lundi au dimanche ; null hors du mois
export function monthGrid(year, month) {
  const first = new Date(year, month, 1), n = new Date(year, month + 1, 0).getDate(), lead = (first.getDay() + 6) % 7;
  const cells = [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => new Date(year, month, i + 1).getTime())];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}
// les séances regroupées par jour : { jour -> { seances, dureeS, questions, justes, reussite, terminee } }
export function byDay(seances) {
  const out = new Map();
  for (const s of seances) {
    const k = dayKey(s.debut), d = out.get(k) ?? { seances: [], dureeS: 0, questions: 0, justes: 0, reussite: null, terminee: false };
    d.seances.push(s); d.dureeS += s.dureeS ?? 0; d.questions += s.questions ?? 0; d.justes += s.justes ?? 0; d.terminee ||= !!s.terminee;
    d.reussite = d.questions ? d.justes / d.questions : null;
    out.set(k, d);
  }
  return out;
}
// le bilan d'un mois : jours travaillés (au moins une séance terminée), séances, durée, réussite
export function monthSummary(seances, year, month) {
  const inMonth = seances.filter((s) => { const d = new Date(s.debut); return d.getFullYear() === year && d.getMonth() === month; });
  const days = new Set(inMonth.filter((s) => s.terminee).map((s) => dayKey(s.debut)));
  const q = inMonth.reduce((a, s) => a + (s.questions ?? 0), 0), j = inMonth.reduce((a, s) => a + (s.justes ?? 0), 0);
  return { jours: days.size, seances: inMonth.length, terminees: inMonth.filter((s) => s.terminee).length, dureeS: inMonth.reduce((a, s) => a + (s.dureeS ?? 0), 0), reussite: q ? j / q : null };
}
// la couleur d'un taux de réussite (seuils de content/parent.json) : "bien", "moyen", "faible" ou null
export const level = (x, { bien, moyen }) => (x === null || x === undefined ? null : x >= bien ? "bien" : x >= moyen ? "moyen" : "faible");

// ---------------------------------------------------------------- séances et réponses
// les réponses d'une séance, dans l'ordre, groupées par module (l'échauffement, puis la notion du jour)
export function answersOf(reponses, seanceId) {
  const list = reponses.filter((r) => r.seance === seanceId).sort((a, b) => a.t - b.t), groups = [];
  // (lot 2, étape 6 : les additions de la notion du jour, marquées `notion`, forment leur propre groupe)
  // (lot 2, étape 7 : les réponses du défi record, marquées `defi`, aussi)
  for (const r of list) { const notion = r.module === 2 && !!r.notion, defi = !!r.defi; let g = groups.at(-1); if (!g || g.module !== r.module || g.notion !== notion || !!g.defi !== defi) groups.push((g = { module: r.module, notion, defi, reponses: [] })); g.reponses.push(r); }
  return groups;
}
// une leçon d'une séance, telle que le parent la lit : vue jusqu'au bout, passée (bouton « passer »), arrêtée
export const lessonNote = (l) => (l.vue ? " (vue jusqu'au bout)" : l.passee ? " (passée)" : " (arrêtée)");
// les étapes d'une séance, lisibles
// les crans du sélecteur de difficulté, pour le parent
export const CRAN_NAMES = { facile: "plus facile", conseille: "conseillé", dur: "plus dur", tresdur: "très dur" };
export const STEP_NAMES = { accueil: "accueil", echauffement: "échauffement", notion: "notion du jour", defi: "défi record", probleme: "problème du jour", recompense: "récompense" };

// ---------------------------------------------------------------- semaine par semaine
// par semaine (du lundi), pour un module : réponses comptées, taux de réussite, temps médian des réponses
// justes. Les exemples guidés et les questions du temps de base ne comptent pas (ce ne sont pas des
// questions du niveau) ; les semaines sans réponse entre la première et `now` sont gardées (vides).
export function weekly(reponses, module, now = Date.now()) {
  const rs = reponses.filter((r) => r.module === module && !r.guide && r.forme !== "base");
  if (!rs.length) return [];
  const first = weekStart(Math.min(...rs.map((r) => r.t))), last = weekStart(now), out = [];
  for (let w = first; w <= last; w = weekStart(w + 8 * DAY)) {
    const x = rs.filter((r) => weekStart(r.t) === w), ok = x.filter((r) => r.juste);
    out.push({ semaine: w, n: x.length, justes: ok.length, taux: x.length ? ok.length / x.length : null, medianeMs: median(ok.map((r) => r.tempsMs).filter((v) => typeof v === "number")) });
  }
  return out;
}
// le journal des erreurs : par semaine, combien de fois chaque code, avec au plus `ex` exemples réels
export function errorJournal(reponses, { ex = 2 } = {}) {
  const weeks = new Map();
  // (lot 3 : C2, juste mais lent, est une réponse juste qui compte au journal)
  for (const r of reponses.filter((x) => (!x.juste || x.erreur === "C2") && x.erreur).sort((a, b) => a.t - b.t)) {
    const w = weekStart(r.t), wk = weeks.get(w) ?? { semaine: w, codes: {} }, c = (wk.codes[r.erreur] ??= { n: 0, exemples: [] });
    c.n++; if (c.exemples.length < ex) c.exemples.push({ question: r.question, donnee: r.donnee, attendue: r.attendue, module: r.module });
    weeks.set(w, wk);
  }
  return [...weeks.values()].sort((a, b) => b.semaine - a.semaine);
}

// ---------------------------------------------------------------- niveaux et faits
// l'histoire d'un module : chaque niveau obtenu (date), chaque redescente, dans l'ordre du temps
export function levelHistory(st) {
  if (!st) return [];
  return [...(st.obtenus ?? []).map((o) => ({ date: o.date, type: o.parent ? "parent" : "obtenu", niveau: o.niveau, cran: !!o.cran, de: o.de })), ...(st.redescentes ?? []).map((r) => ({ date: r.date, type: "redescente", de: r.de, niveau: r.a }))].sort((a, b) => a.date - b.date);
}
// les faits d'addition : combien par boîte, et ceux qui résistent (au moins 2 erreurs, ou encore en
// boîte 1 après 3 passages), du plus résistant au moins résistant
export function factsSummary(faits) {
  const boites = [0, 0, 0, 0, 0];
  for (const f of faits) if (f.boite >= 1 && f.boite <= 5) boites[f.boite - 1]++;
  const resist = faits.map((f) => ({ ...f, erreurs: (f.historique ?? []).filter((h) => !h.juste && !h.parent).length, passages: (f.historique ?? []).filter((h) => !h.parent).length }))
    .filter((f) => f.erreurs >= 2 || (f.boite === 1 && f.passages >= 3)).sort((a, b) => b.erreurs - a.erreurs || a.boite - b.boite);
  return { rencontres: faits.length, boites, resistent: resist };
}

// ---------------------------------------------------------------- module 2 (lot 2, étape 7)
// LA GRILLE DES ADDITIONS (docs/SPEC.md, tableau de bord 3 ; docs/SPEC-LOT2.md, section 7) : un tableau 11 × 11,
// a en ligne (0 à 10), b en colonne ; les cases a + b ≤ 10. Les 45 faits (a, b de 1 à 9) sont colorés selon
// leur boîte et leur rapidité (temps médian des réponses justes sous le seuil « rapide ») ; les 21 cases « + 0 »
// montrent seulement le temps de base (le temps médian des réponses à cette question triviale), en gris.
// Chaque case : { a, b, kind: "fait" | "base" | "hors", fait?, boite (0 : pas encore rencontré), rapide,
// tempsMedian, passages, erreurs }.
export function additionGrid(faits, reponses, { c, baseMs = null } = {}) {
  const by = new Map(faits.map((f) => [f.fait, f])), limit = c ? threshold(c, baseMs ?? c.base.defautS * 1000, faits) : null;
  const base = new Map();
  for (const r of reponses) if (r.forme === "base" && r.juste && typeof r.tempsMs === "number") { const k = r.question.replace(/\s/g, ""); (base.get(k) ?? base.set(k, []).get(k)).push(r.tempsMs); }
  const known = new Set(c ? catalog(c).map((f) => f.fait) : []);
  return Array.from({ length: 11 }, (_, a) => Array.from({ length: 11 }, (_, b) => {
    if (a + b > 10) return { a, b, kind: "hors" };
    const k = `${a}+${b}`;
    if (!a || !b) return { a, b, kind: "base", tempsMedian: median(base.get(k) ?? []) };
    const f = by.get(k), hist = f?.historique ?? [];
    return { a, b, kind: "fait", fait: k, catalogue: !c || known.has(k), boite: f?.boite ?? 0, tempsMedian: f?.tempsMedian ?? null, rapide: f?.tempsMedian != null && limit != null && f.tempsMedian < limit, passages: hist.filter((h) => !h.parent).length, erreurs: hist.filter((h) => !h.juste && !h.parent).length };
  }));
}
// l'historique d'un fait, pour le parent : chaque passage (date, juste, temps, forme, aide, boîte avant et après)
export const factHistory = (f) => [...(f?.historique ?? [])].sort((x, y) => y.t - x.t).map((h) => ({ date: h.t, juste: !!h.juste, ms: h.ms, forme: h.forme ?? "directe", aide: !!h.aide, avant: h.boite, apres: h.apres, parent: !!h.parent }));
// les familles du module 2, pour le parent : ouverte (date, par le parent ?), acquise (date), formes à trou,
// faits de la règle bien sus (boîte 3 ou plus) ; la famille en cours de la notion du jour ; dépassée (stagnation :
// pas acquise après 6 séances en notion du jour, la suivante a pris la relève) et séances en notion du jour
export function familiesSummary(c, st, faits) {
  st ??= initialFamilies(c, 0);
  const by = new Map(faits.map((f) => [f.fait, f])), K = cfgOf(c).acquise;
  const cur = currentFamily(c, st);
  return {
    enCours: cur,
    familles: c.familles.map((f) => {
      const rule = ruleFacts(c, f.id), ouv = (st.ouvertures ?? []).find((o) => o.famille === f.id), acq = (st.obtenus ?? []).find((o) => o.famille === f.id);
      return { id: f.id, nom: f.nom, ouverte: st.ouvertes.includes(f.id), ouverteLe: ouv?.date ?? null, ouverteParent: !!ouv?.parent, ouverteEchauffement: !!ouv?.echauffement, acquise: st.acquises.includes(f.id), acquiseLe: acq?.date ?? null, acquiseParent: !!acq?.parent, trou: (st.trou ?? []).includes(f.id), bienSus: rule.filter((r) => (by.get(r.fait)?.boite ?? 0) >= K.boite).length, total: rule.length, enCours: f.id === cur, depassee: (st.depassees ?? []).some((d) => d.famille === f.id), seancesNotion: st.seancesNotion?.[f.id] ?? 0 };
    }),
  };
}
// semaine par semaine : combien de faits sont en boîte 3 ou plus à la fin de chaque semaine (d'après
// l'historique de chaque fait : la boîte après son dernier passage de la semaine ou d'avant)
export function weeklySolid(faits, now = Date.now(), boite = 3) {
  const all = faits.flatMap((f) => (f.historique ?? []).map((h) => h.t));
  if (!all.length) return [];
  const out = [];
  for (let w = weekStart(Math.min(...all)); w <= weekStart(now); w = weekStart(w + 8 * DAY)) {
    const end = w + 7 * DAY;
    const n = faits.filter((f) => { const last = (f.historique ?? []).filter((h) => h.t < end).at(-1); return (last ? last.apres ?? f.boite : 0) >= boite; }).length;
    out.push({ semaine: w, n });
  }
  return out;
}
// le défi record, pour le parent : le record, sa date, chaque défi (date, score, record battu ?)
export function challengeSummary(fiche, seances = []) {
  const scores = (fiche?.scores ?? []).map((x) => ({ ...x }));
  let best = null;
  for (const x of scores) { x.record = x.score > 0 && (best == null || x.score > best); if (x.record) best = x.score; }
  const n = seances.filter((s) => s.defi).length;
  return { record: fiche?.record ?? null, date: fiche?.date ?? null, defis: Math.max(scores.length, n), scores };
}

// ---------------------------------------------------------------- export
// CSV pour un tableur français : séparateur « ; », virgule décimale, dates lisibles ; le BOM (ajouté au
// téléchargement) fait lire les accents à Excel.
const cell = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "oui" : "non";
  if (typeof v === "number") return String(v).replace(".", ",");
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export const dateTime = (t) => (t ? `${dayKey(t)} ${two(new Date(t).getHours())}:${two(new Date(t).getMinutes())}:${two(new Date(t).getSeconds())}` : "");
export function toCSV(columns, rows) {
  return [columns.map(([h]) => cell(h)).join(";"), ...rows.map((r) => columns.map(([, f]) => cell(f(r))).join(";"))].join("\r\n") + "\r\n";
}
export const SESSION_COLUMNS = [
  ["séance", (s) => s.id], ["date", (s) => dayKey(s.debut)], ["début", (s) => dateTime(s.debut)], ["fin", (s) => dateTime(s.fin)], ["durée (s)", (s) => s.dureeS],
  ["terminée", (s) => !!s.terminee], ["interrompue : raison", (s) => (s.terminee || s.libre ? null : s.interruption?.raison ?? (s.arreteeParParent ? "terminée par le parent" : null))], ["module du jour", (s) => s.module], ["questions", (s) => s.questions], ["justes", (s) => s.justes],
  ["taux de réussite (%)", (s) => (s.reussite === null || s.reussite === undefined ? null : Math.round(s.reussite * 100))], ["étoiles", (s) => s.etoiles],
  ["leçons", (s) => (s.lecons ?? []).map((l) => `${l.id}${l.vue ? "" : l.passee ? " (passée)" : " (arrêtée)"}`).join(" ")], ["cartes", (s) => (s.cartes ?? []).join(" ")],
  ["entraînement libre", (s) => !!s.libre], ["pauses", (s) => s.pauses ?? 0],
  ["cran choisi", (s) => (s.cranDepart ? CRAN_NAMES[s.cranDepart] : null)], ["cran à la fin", (s) => (s.cran ? CRAN_NAMES[s.cran] : null)], ["descentes de cran", (s) => (s.descentes ?? []).length],
  ["famille du jour (additions)", (s) => s.famille ?? null], ["exercice choisi par l'enfant", (s) => (s.leconChoisie ? `leçon ${s.lecons?.[0]?.id ?? ""}` : s.choix ? (s.choix.module === 1 ? `ligne, niveau ${s.choix.niveau}` : s.choix.module === 3 ? `calcul rapide, niveau ${s.choix.niveau}` : s.choix.module === 4 ? `voiliers, niveau ${s.choix.niveau}` : `additions, famille ${s.choix.famille}`) : null)], ["échauffement passé", (s) => (s.echauffementPasse ? true : null)], ["défi : bonnes réponses", (s) => s.defi?.score ?? null], ["défi : nouveau record", (s) => (s.defi ? !!s.defi.nouveauRecord : null)],
  ["étapes", (s) => (s.etapes ?? []).map((e) => (e.sautee ? `${e.id} (sautée)` : `${e.id} ${e.dureeS ?? ""}s`)).join(" | ")],
];
export const ANSWER_COLUMNS = [
  ["réponse", (r) => r.id], ["séance", (r) => r.seance], ["horodatage", (r) => dateTime(r.t)], ["module", (r) => r.module], ["niveau", (r) => r.niveau],
  ["question", (r) => r.question], ["forme", (r) => r.forme], ["réponse donnée", (r) => r.donnee], ["réponse attendue", (r) => r.attendue], ["juste", (r) => !!r.juste],
  ["temps (s)", (r) => (typeof r.tempsMs === "number" ? Math.round(r.tempsMs / 100) / 10 : null)], ["écoutes de la consigne", (r) => r.ecoutes], ["aide utilisée", (r) => !!r.aide],
  ["code d'erreur", (r) => r.erreur], ["question qui revient", (r) => !!r.revient], ["exemple guidé", (r) => !!r.guide],
  ["exemple passé", (r) => !!r.passe], ["correction passée", (r) => !!r.correctionPassee], ["entraînement libre", (r) => !!r.libre],
  ["cran", (r) => (r.cran ? CRAN_NAMES[r.cran] : null)], ["notion du jour", (r) => !!r.notion], ["défi record", (r) => !!r.defi],
];
export const FACT_COLUMNS = [
  ["fait", (f) => f.fait.replace("+", " + ")], ["famille", (f) => f.famille], ["boîte", (f) => f.boite], ["prochain passage", (f) => dayKey(f.prochain)],
  ["passages", (f) => (f.historique ?? []).filter((h) => !h.parent).length], ["erreurs", (f) => (f.historique ?? []).filter((h) => !h.juste && !h.parent).length], ["temps médian (s)", (f) => (typeof f.tempsMedian === "number" ? Math.round(f.tempsMedian / 100) / 10 : null)],
];
// l'export JSON ne contient pas le code parent (il resterait lisible dans le fichier)
export const PRIVATE_SETTINGS = ["codeParent"];
export const cleanDump = (dump) => ({ ...dump, reglages: (dump.reglages ?? []).filter((r) => !PRIVATE_SETTINGS.includes(r.cle)) });
// un fichier JSON peut-il être restauré ? renvoie null si oui, sinon la raison (en français)
export function restoreProblem(dump, { base, version, stores }) {
  if (!dump || typeof dump !== "object") return "ce fichier n'est pas une sauvegarde de l'application";
  if (dump.base !== base) return "ce fichier n'est pas une sauvegarde de l'application";
  if (typeof dump.version !== "number" || dump.version > version) return "cette sauvegarde vient d'une version plus récente de l'application";
  const missing = stores.filter((s) => !Array.isArray(dump[s]));
  if (missing.length) return `il manque une partie de la sauvegarde (${missing.join(", ")})`;
  return null;
}
// faut-il rappeler l'export ? oui s'il y a des séances et que le dernier export (ou, s'il n'y en a jamais
// eu, la première séance) date de plus de `jours` jours
export function exportDue({ dernierExport, premiereSeance, now = Date.now(), jours = 7 }) {
  if (!premiereSeance) return false;
  return now - (dernierExport ?? premiereSeance) >= jours * DAY;
}
// le nom d'un fichier exporté : ocean-des-nombres-reponses-2026-09-26.csv
export const fileName = (what, ext, now = Date.now()) => `ocean-des-nombres-${what}-${dayKey(now)}.${ext}`;

// ---------------------------------------------------------------- le code
export const validCode = (s, n = 4) => new RegExp(`^\\d{${n}}$`).test(s);
// « code oublié » : une question qu'un enfant de 7 ans ne sait pas faire (a × b + c)
export function gateQuestion(rnd = Math.random) {
  const a = 6 + Math.floor(rnd() * 4), b = 6 + Math.floor(rnd() * 4), c = 11 + Math.floor(rnd() * 19);
  return { texte: `${a} × ${b} + ${c}`, reponse: a * b + c };
}

// ---------------------------------------------------------------- les cartes (lot 2)
// Pour le parent seulement (docs/SPEC-LOT2.md, section 7) : cartes et brillantes, cartes encore gagnables selon
// le quota, zones, étoiles dorées et arc-en-ciel, semaines réussies (plus de cadeaux de la surprise depuis le
// 5 octobre 2026, ni dans l'espace parent : lot « Correctifs », écart 10.1). R : les fiches du magasin
// « recompenses » par clé ; cartes, calendrier : le contenu ; seances : les séances enregistrées.
export function cardsSummary(R, cartes, calendrier, seances, now = Date.now()) {
  const owned = R.cartes?.cartes ?? {}, et = R.etoiles ?? {}, C = cartes.cartes, n = Object.keys(owned).length;
  const open = R.zones?.ouvertes ?? cartes.zones.filter((z) => z.ouverte).map((z) => z.id);
  const zones = cartes.zones.map((z) => { const all = C.filter((c) => c.zone === z.id); return { id: z.id, nom: z.nom, ouverte: open.includes(z.id), gagnees: all.filter((c) => owned[c.id]).length, total: all.length, pret: all.every((c) => c.illustration && c.anecdote) }; });
  const quota = quotaAt(R.quota, calendrier, now, cartes.quota);
  // la zone suivante : ce qu'elle attend
  const last = Math.max(...zones.map((z, i) => (z.ouverte ? i : -1))), next = zones[last + 1] ?? null;
  let attend = null;
  if (next) {
    const cur = zones[last], reste = C.filter((c) => c.zone === cur.id && c.rarete !== "legendaire" && !owned[c.id]).length;
    attend = !zoneDone(C, owned, cur.id) ? (reste > 1 ? `que les ${reste} cartes (communes et rares) qui restent dans « ${cur.nom} » soient gagnées` : `que la dernière carte (commune ou rare) de « ${cur.nom} » soit gagnée`) : !next.pret ? "ses illustrations et ses anecdotes (contenu à livrer)" : "une étoile arc-en-ciel (le prochain niveau franchi)";
  }
  const debuts = seances.filter((s) => s.terminee && !s.libre).map((s) => s.debut), semaines = goodWeeks(debuts, cartes.semaine), per = cartes.semaine.semainesParDoree;
  return {
    cartes: n, total: C.length, brillantes: Object.values(owned).filter((o) => o.brillante).length,
    legendaires: C.filter((c) => c.rarete === "legendaire" && owned[c.id]).length, legendairesTotal: C.filter((c) => c.rarete === "legendaire").length,
    quota, gagnables: Math.max(0, quota - n), base: R.quota ?? null, zones, suivante: next ? { nom: next.nom, attend } : null,
    dorees: et.dorees ?? 0, doreesDepensees: et.doreesDepensees ?? 0, semaines, prochaineDoree: per - (semaines % per),
    arc: et.arcEnCiel ?? 0, arcDepensees: et.arcDepensees ?? 0, arcLibre: et.arcLibre ?? 0,
  };
}
