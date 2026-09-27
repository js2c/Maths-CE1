// L'ESPACE PARENT (docs/SPEC.md, « Espace parent ») : ce que le parent voit, en français simple.
//  - accès : appui long (2 s) sur le logo posé sur le sable de l'écran d'accueil, puis un code à 4 chiffres
//    choisi par le parent au premier accès (« code oublié » : une opération qu'un enfant ne sait pas faire,
//    puis un nouveau code ; les données sont gardées) ;
//  - quatre onglets : Calendrier (jours travaillés, durée, réussite), Séances (historique, chaque réponse),
//    Progression (niveaux, courbes semaine par semaine, faits d'addition, journal des erreurs, trésor),
//    Données et réglages (exports CSV et JSON, restauration, nom de la pieuvre, durée de séance, code,
//    tout effacer) ; rappel d'export chaque semaine ;
//  - pendant la visite, l'océan s'arrête (la scène ne dessine plus rien) et la voix se tait.
// Les calculs sont dans data.js (fonctions pures, testées) ; ici, seulement l'affichage.
import * as D from "./data.js";
import { catalog, median } from "../modules/facts/facts.js";
import { DB_NAME, MIGRATIONS, persist, STORES } from "../engine/store.js";
import { familyKnown, markFamilyKnown, setLineLevel } from "./depart.js";

// ---------------------------------------------------------------- petits outils du DOM
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") el.className = v; else if (k.startsWith("on")) el.addEventListener(k.slice(2), v); else if (k === "html") el.innerHTML = v; else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat(Infinity)) if (c !== null && c !== undefined && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}
const SVG = "http://www.w3.org/2000/svg";
function s(tag, attrs = {}, ...kids) { const el = document.createElementNS(SVG, tag); for (const [k, v] of Object.entries(attrs)) if (k.startsWith("on")) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v); for (const c of kids.flat()) if (c !== null && c !== undefined) el.append(c instanceof Node ? c : document.createTextNode(String(c))); return el; }
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const shake = (el) => { el.classList.remove("pa-shake"); void el.offsetWidth; el.classList.add("pa-shake"); };
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type })), a = h("a", { href: url, download: name });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
}
const plural = (n, one, many = `${one}s`) => `${n} ${n > 1 ? many : one}`;

// ---------------------------------------------------------------- le logo et son appui long
// Un simple toucher ne fait rien (l'enfant n'y gagne rien) ; pendant l'appui, un anneau clair se remplit.
export function parentLogo(app, { onOpen, holdMs = 2000, src = "icons/icon-192.png" }) {
  const b = h("button", { class: "logo", "aria-label": "espace parent (appui long)" }, h("img", { src, alt: "", draggable: "false" }));
  const svg = s("svg", { viewBox: "0 0 116 116" }, s("circle", { cx: 58, cy: 58, r: 52 }));
  b.append(svg); b.style.setProperty("--hold", `${holdMs}ms`);
  let timer = null;
  const stop = () => { clearTimeout(timer); timer = null; b.classList.remove("holding"); };
  b.addEventListener("pointerdown", (e) => { e.preventDefault(); b.setPointerCapture?.(e.pointerId); stop(); void b.offsetWidth; b.classList.add("holding"); timer = setTimeout(() => { stop(); onOpen(); }, holdMs); });
  for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) b.addEventListener(ev, stop);
  b.addEventListener("contextmenu", (e) => e.preventDefault());
  app.stage.ui.append(b);
  return b;
}

// ---------------------------------------------------------------- l'espace parent
export class ParentSpace {
  // content : parent.json ; seance : seance.json (durée par défaut) ; module2 : module2.json (catalogue des faits) ;
  // cartes : cartes.json ; calendrier : calendrier.json (quota des cartes)
  constructor(app, { content, seance, module2, cartes, calendrier = null }) {
    this.app = app; this.c = content; this.seance = seance; this.module2 = module2; this.cartes = cartes; this.calendrier = calendrier;
    this.depart = content.pointDeDepart ?? { niveauxMax: 8, familles: [1, 2] }; // lot 2 : étendu aux niveaux 9 à 13 à l'étape 8
    this.root = null; this.tab = "calendrier"; this.changed = false;
  }
  get store() { return this.app.store; }

  // ouvre l'espace parent ; la promesse se résout à la fermeture ({ reload } si les données ont changé)
  async open() {
    if (this.root) return;
    const { app } = this;
    app.voice.stop?.();
    this.root = h("div", { class: "pa", role: "dialog", "aria-label": "espace parent" }, h("div", { class: "pa-veil" }));
    document.body.append(this.root);
    return new Promise((resolve) => { this.resolve = resolve; this.gate(); });
  }
  close() {
    this.root?.remove(); this.root = null; this.app.stage.paused = false;
    const r = { reload: this.changed }; this.changed = false;
    this.resolve?.(r);
  }

  // ---------------------------------------------------------------- le code
  async gate(mode = null) {
    const code = await this.store.setting("codeParent");
    mode ??= code ? "entrer" : "choisir";
    const N = this.c.codeChiffres;
    this.root.querySelector(".pa-gate")?.remove();
    const sub = h("p", { class: "pa-sub" }), msg = h("p", { class: "pa-msg", role: "alert" }), dots = h("div", { class: "pa-dots", "aria-hidden": "true" });
    const typed = h("div", { class: "pa-typed" });
    const card = h("div", { class: "pa-gate-card" }, h("h1", {}, "Espace parent"), sub);
    let value = "", first = null, question = null, fails = 0, lockedUntil = 0;
    const masked = () => mode !== "oubli";
    const render = () => {
      dots.replaceChildren(...Array.from({ length: N }, (_, i) => h("span", { class: i < value.length ? "on" : "" })));
      typed.textContent = value || " ";
      dots.hidden = !masked(); typed.hidden = masked();
    };
    const say = (t) => { sub.textContent = t; };
    const setMode = (m) => {
      mode = m; value = ""; msg.textContent = "";
      if (m === "choisir") say(`Choisissez un code à ${N} chiffres. Il protège cet espace ; l'enfant ne doit pas le connaître.`);
      if (m === "confirmer") say("Tapez le même code une seconde fois.");
      if (m === "entrer") say(`Tapez votre code à ${N} chiffres.`);
      if (m === "oubli") { question = D.gateQuestion(this.app.rnd ?? Math.random); say(`Code oublié : combien font ${question.texte} ? Ensuite, vous choisirez un nouveau code.`); }
      forgot.hidden = m !== "entrer"; back.textContent = m === "oubli" && code ? "Retour au code" : "Retour à l'océan"; ok.style.visibility = m === "oubli" ? "visible" : "hidden";
      render();
    };
    const submit = async () => {
      if (mode === "oubli") {
        if (Number(value) === question.reponse) return setMode("choisir");
        msg.textContent = "Ce n'est pas le bon résultat."; shake(card); value = ""; return render();
      }
      if (value.length < N) return;
      if (mode === "choisir") { first = value; return setMode("confirmer"); }
      if (mode === "confirmer") {
        if (value !== first) { setMode("choisir"); msg.textContent = "Les deux codes étaient différents. Recommençons."; shake(card); return; }
        await this.store.setSetting("codeParent", value); return this.dashboard();
      }
      if (Date.now() < lockedUntil) return;
      if (value === (await this.store.setting("codeParent"))) return this.dashboard();
      fails++; value = ""; render(); shake(card);
      if (fails % 5 === 0) { lockedUntil = Date.now() + 30000; msg.textContent = "Trop d'essais : attendez 30 secondes."; setTimeout(() => { msg.textContent = ""; }, 30000); }
      else msg.textContent = "Ce n'est pas le bon code.";
    };
    const press = (k) => {
      if (k === "effacer") { value = value.slice(0, -1); return render(); }
      if (k === "ok") return submit();
      if (value.length >= (mode === "oubli" ? 3 : N)) return;
      value += k; render();
      if (mode !== "oubli" && value.length === N) setTimeout(submit, 120);
    };
    const key = (k, label = k, cls = "") => h("button", { class: cls, "data-key": k, "aria-label": label, onpointerdown: (e) => { e.preventDefault(); press(k); } }, label);
    const ok = key("ok", "Valider", "pa-key-ok");
    const keys = h("div", { class: "pa-keys" }, ..."123456789".split("").map((d) => key(d)), key("effacer", "Effacer", "pa-key-small"), key("0"), ok);
    const forgot = h("button", { class: "pa-link", onclick: () => setMode("oubli") }, "Code oublié ?");
    const back = h("button", { class: "pa-link", onclick: () => (mode === "oubli" && code ? setMode("entrer") : this.close()) }, "Retour à l'océan");
    card.append(dots, typed, msg, keys, h("div", { class: "pa-links" }, forgot, back));
    this.root.append(h("div", { class: "pa-gate" }, card));
    this.onKey ??= (e) => { if (!this.root?.querySelector(".pa-gate")) return; if (/^\d$/.test(e.key)) press(e.key); else if (e.key === "Backspace") press("effacer"); else if (e.key === "Enter") press("ok"); };
    removeEventListener("keydown", this.onKey); addEventListener("keydown", this.onKey);
    setMode(mode);
  }

  // ---------------------------------------------------------------- les tableaux de bord
  async load() {
    const st = this.store, [seances, reponses, niveaux, faits, recompenses] = await Promise.all(["seances", "reponses", "niveaux", "faits", "recompenses"].map((x) => st.all(x)));
    this.d = { seances: seances.sort((a, b) => b.debut - a.debut), reponses, niveaux, faits, recompenses: Object.fromEntries(recompenses.map((r) => [r.id, r])) };
    this.d.dernierExport = await st.setting("dernierExport");
  }
  async dashboard() {
    removeEventListener("keydown", this.onKey);
    this.app.stage.paused = true;
    await this.load();
    const mascotte = (await this.store.setting("mascotte")) ?? "pas encore choisie";
    this.root.replaceChildren();
    this.main = h("main", { class: "pa-main" });
    const tabs = [["calendrier", "Calendrier"], ["seances", "Séances"], ["progression", "Progression"], ["donnees", "Données et réglages"]];
    this.tabsEl = h("nav", { class: "pa-tabs", role: "tablist" }, tabs.map(([id, label]) => h("button", { role: "tab", "data-tab": id, "aria-selected": String(id === this.tab), onclick: () => this.show(id) }, label)));
    this.root.append(h("div", { class: "pa-sheet" },
      h("header", { class: "pa-top" }, h("img", { src: "icons/icon-192.png", alt: "" }), h("div", { class: "pa-grow" }, h("h1", {}, "Espace parent"), h("p", {}, `L'océan des nombres · la pieuvre s'appelle ${mascotte}`)),
        h("button", { class: "pa-close", onclick: () => this.close() }, "Fermer")),
      this.tabsEl, this.main));
    this.show(this.tab);
  }
  show(id, opts = {}) {
    this.tab = id;
    for (const b of this.tabsEl.children) b.setAttribute("aria-selected", String(b.dataset.tab === id));
    const page = h("div", { class: "pa-page" });
    const due = D.exportDue({ dernierExport: this.d.dernierExport, premiereSeance: this.d.seances.at(-1)?.debut ?? null, jours: this.c.rappelExportJours });
    if (due && id !== "donnees") page.append(h("div", { class: "pa-reminder" }, h("p", {}, h("b", {}, "Pensez à la sauvegarde de la semaine. "), this.d.dernierExport ? `La dernière date du ${D.fmtDay(this.d.dernierExport)}.` : "Aucune sauvegarde n'a encore été faite."), h("button", { class: "pa-btn primary", onclick: () => this.show("donnees") }, "Sauvegarder")));
    ({ calendrier: () => this.calendar(page, opts), seances: () => this.sessions(page, opts), progression: () => this.progress(page), donnees: () => this.dataPage(page) })[id]();
    this.main.replaceChildren(page); this.main.scrollTop = 0;
  }

  // ---------------------------------------------------------------- calendrier
  calendar(page, { year, month, sel } = {}) {
    // l'entraînement libre n'est pas une séance : il reste dans l'historique, pas dans le calendrier
    const now = new Date(), S = this.d.seances.filter((x) => !x.libre);
    year ??= this.calY ?? now.getFullYear(); month ??= this.calM ?? now.getMonth(); this.calY = year; this.calM = month;
    const days = D.byDay(S), sum = D.monthSummary(S, year, month), first = S.at(-1) ? new Date(S.at(-1).debut) : now;
    const canPrev = year * 12 + month > first.getFullYear() * 12 + first.getMonth(), canNext = year * 12 + month < now.getFullYear() * 12 + now.getMonth();
    const go = (dm) => { const d = new Date(year, month + dm, 1); this.show("calendrier", { year: d.getFullYear(), month: d.getMonth() }); };
    page.append(h("div", { class: "pa-stats" },
      stat(plural(sum.jours, "jour"), "travaillés ce mois-ci"), stat(String(sum.terminees), `séance${sum.terminees > 1 ? "s" : ""} terminée${sum.terminees > 1 ? "s" : ""}${sum.seances > sum.terminees ? ` (${sum.seances - sum.terminees} interrompue${sum.seances - sum.terminees > 1 ? "s" : ""})` : ""}`),
      stat(D.fmtDuration(sum.dureeS), "de travail en tout"), stat(D.fmtPct(sum.reussite), "de réponses justes")));
    const grid = h("div", { class: "pa-cal" }, ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"].map((d) => h("div", { class: "pa-dow" }, d)));
    const detail = h("div");
    for (const week of D.monthGrid(year, month)) for (const t of week) {
      if (t === null) { grid.append(h("div", { class: "pa-day out" })); continue; }
      const k = D.dayKey(t), d = days.get(k), lv = d ? D.level(d.reussite, this.c.reussite) : null;
      const cls = ["pa-day", d && "has", d && (d.terminee ? lv : "stopped"), k === D.dayKey(now) && "today", sel === k && "sel"].filter(Boolean).join(" ");
      const label = d ? `${D.fmtDay(t)} : ${plural(d.seances.length, "séance")}, ${D.fmtDuration(d.dureeS)}, ${D.fmtPct(d.reussite)} de réussite` : D.fmtDay(t);
      grid.append(h(d ? "button" : "div", { class: cls, "aria-label": label, onclick: d ? () => this.show("calendrier", { year, month, sel: k }) : null },
        h("span", { class: "n" }, new Date(t).getDate()),
        d && h("span", { class: "v" }, d.questions ? D.fmtPct(d.reussite) : "—"),
        d && h("span", { class: "d" }, d.terminee ? D.fmtDuration(d.dureeS) : "interrompue")));
    }
    if (sel && days.get(sel)) {
      const d = days.get(sel);
      detail.append(h("div", { class: "pa-card-box" }, h("h2", {}, D.fmtDay(d.seances[0].debut)), d.seances.map((x) => this.sessionCard(x, true))));
    }
    page.append(h("div", { class: "pa-card-box" },
      h("div", { class: "pa-month" }, h("button", { class: "pa-nav", "aria-label": "mois précédent", disabled: !canPrev, onclick: () => go(-1) }, "‹"), h("h2", {}, `${D.monthName(month)} ${year}`), h("button", { class: "pa-nav", "aria-label": "mois suivant", disabled: !canNext, onclick: () => go(1) }, "›")),
      grid,
      h("div", { class: "pa-legend" }, h("span", {}, h("i", { class: "bien" }), `${Math.round(this.c.reussite.bien * 100)} % de réussite ou plus`), h("span", {}, h("i", { class: "moyen" }), `de ${Math.round(this.c.reussite.moyen * 100)} à ${Math.round(this.c.reussite.bien * 100) - 1} %`), h("span", {}, h("i", { class: "faible" }), `moins de ${Math.round(this.c.reussite.moyen * 100)} %`), h("span", {}, h("i", { class: "stopped" }), "séance interrompue")),
      !S.length && h("p", { class: "pa-empty" }, "Aucune séance pour l'instant. Les séances apparaîtront ici dès la première partie.")), detail);
    if (sel) requestAnimationFrame(() => detail.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  // ---------------------------------------------------------------- séances
  sessions(page, { shown = 15 } = {}) {
    const S = this.d.seances;
    const box = h("div", { class: "pa-card-box" }, h("h2", {}, "Historique des séances"), h("p", { class: "pa-note" }, "Touchez une séance pour voir chaque question, la réponse donnée et le temps mis."));
    if (!S.length) box.append(h("p", { class: "pa-empty" }, "Aucune séance pour l'instant."));
    for (const x of S.slice(0, shown)) box.append(this.sessionCard(x));
    if (S.length > shown) box.append(h("button", { class: "pa-btn pa-more", onclick: () => this.show("seances", { shown: shown + 15 }) }, `Afficher plus (${S.length - shown} autres)`));
    page.append(box);
  }
  sessionCard(x, open = false) {
    const lv = D.level(x.reussite, this.c.reussite), det = h("div", { class: "pa-detail" });
    const el = h("div", { class: "pa-session" });
    const head = h("button", { "aria-expanded": "false", onclick: () => { const o = el.classList.toggle("open"); head.setAttribute("aria-expanded", String(o)); det.hidden = !o; if (o && !det.childElementCount) this.sessionDetail(x, det); } },
      h("span", { class: "t" }, `${D.fmtDay(x.debut)}, ${D.fmtTime(x.debut)}${x.libre ? " · entraînement libre" : ""}`),
      h("span", { class: "s" }, `${D.fmtDuration(x.dureeS)} · ${plural(x.questions ?? 0, "question")} · ${plural(x.etoiles ?? 0, "étoile")} de mer`),
      h("span", { class: "r" }, h("span", { class: `pa-badge ${x.terminee || x.libre ? lv ?? "neutre" : "neutre"}` }, x.libre ? (x.questions ? `${D.fmtPct(x.reussite)} de réussite` : "libre") : x.terminee ? (x.questions ? `${D.fmtPct(x.reussite)} de réussite` : "terminée") : "interrompue"), h("span", { class: "chev", "aria-hidden": "true" }, "›")));
    el.append(head, det); det.hidden = true;
    if (open) head.click();
    return el;
  }
  sessionDetail(x, det) {
    const mine = this.d.reponses.filter((r) => r.seance === x.id), nsp = mine.filter((r) => r.erreur === "NSP").length, passes = mine.filter((r) => r.passe).length, corr = mine.filter((r) => r.correctionPassee).length;
    const steps = (x.etapes ?? []).filter((e) => !e.sautee || e.sautee === "temps écoulé").map((e) => `${D.STEP_NAMES[e.id] ?? e.id}${e.sautee ? " (sautée, temps écoulé)" : e.dureeS !== undefined ? ` ${D.fmtDuration(e.dureeS)}` : ""}`);
    const cartes = (x.cartes ?? []).map((id) => this.cartes.cartes.find((c) => c.id === id)?.nom ?? id);
    det.append(h("div", { class: "pa-facts" },
      h("span", {}, "De ", h("b", {}, D.fmtTime(x.debut)), " à ", h("b", {}, x.fin ? D.fmtTime(x.fin) : "—")),
      h("span", {}, "Notion du jour : ", h("b", {}, `${this.c.modules[x.module]?.nom ?? `module ${x.module}`}${x.module === 2 && x.famille ? ` (famille « ${this.module2.familles.find((f) => f.id === x.famille)?.nom ?? x.famille} »)` : ""}`)),
      x.defi && h("span", {}, "Défi record : ", h("b", {}, `${plural(x.defi.score, "bonne réponse")} sur ${x.defi.questions}${x.defi.nouveauRecord ? " (nouveau record !)" : x.defi.record ? ` (record : ${x.defi.record})` : ""}`)),
      h("span", {}, "Réponses justes : ", h("b", {}, `${x.justes ?? 0} sur ${x.questions ?? 0}`)),
      steps.length > 0 && h("span", {}, "Étapes : ", h("b", {}, steps.join(", "))),
      (x.lecons ?? []).length > 0 && h("span", {}, "Leçons : ", h("b", {}, x.lecons.map((l) => `${l.id}${D.lessonNote(l)}`).join(", "))),
      x.cranDepart && h("span", {}, "Difficulté choisie : ", h("b", {}, `${D.CRAN_NAMES[x.cranDepart]}${(x.descentes ?? []).length ? ` (redescendue à « ${D.CRAN_NAMES[x.cran]} » après des erreurs)` : ""}`)),
      nsp > 0 && h("span", {}, "« Je ne sais pas » : ", h("b", {}, `${nsp} (comptés à part des erreurs)`)),
      passes > 0 && h("span", {}, "Exemples guidés passés : ", h("b", {}, String(passes))),
      corr > 0 && h("span", {}, "Corrections passées : ", h("b", {}, String(corr))),
      x.pauses > 0 && h("span", {}, "Pauses : ", h("b", {}, `${x.pauses}${x.pauseS ? `, ${D.fmtDuration(x.pauseS)} en tout (non comptées dans la durée)` : ""}`)),
      cartes.length > 0 && h("span", {}, "Cartes gagnées : ", h("b", {}, cartes.join(", ")))));
    const groups = D.answersOf(this.d.reponses, x.id);
    if (!groups.length) det.append(h("p", { class: "pa-muted" }, "Aucune réponse enregistrée pour cette séance."));
    for (const g of groups) det.append(h("h3", {}, g.defi ? "Défi record : faits d'addition en une minute" : g.module === 2 && !g.notion ? "Échauffement : faits d'addition" : `Notion du jour : ${this.c.modules[g.module]?.nom ?? g.module}`), this.answerTable(g.reponses));
  }
  answerTable(rs) {
    const E = this.c.erreurs, F = this.c.formes;
    const note = (r) => [r.guide && (r.passe ? "exemple guidé passé" : "exemple guidé"), r.correctionPassee && "correction passée", r.revient && "question qui revient", r.aide && !r.guide && "aide utilisée", r.libre && "entraînement libre"].filter(Boolean).join(", ");
    return h("div", { class: "pa-table-wrap" }, h("table", { class: "pa-table" },
      h("thead", {}, h("tr", {}, ["Heure", "Niveau", "Forme", "Question", "Réponse", "Attendue", "Résultat", "Temps", "Écoutes", "Erreur", "Remarque"].map((t, i) => h("th", { class: [4, 5, 7, 8].includes(i) ? "num" : "" }, t)))),
      h("tbody", {}, rs.map((r) => h("tr", { class: r.juste ? "" : "faux" },
        h("td", {}, D.dateTime(r.t).slice(11)), h("td", { class: "num" }, r.niveau), h("td", {}, F[r.forme] ?? r.forme ?? ""), h("td", { class: "q" }, r.question),
        h("td", { class: "num" }, r.donnee ?? "—"), h("td", { class: "num" }, r.attendue ?? ""), h("td", {}, r.juste ? h("span", { class: "pa-yes" }, "✓ juste") : h("span", { class: "pa-no" }, "✗ faux")),
        h("td", { class: "num" }, D.fmtSeconds(r.tempsMs)), h("td", { class: "num" }, r.ecoutes ?? ""), h("td", { title: E[r.erreur] ?? "" }, r.juste ? "" : r.erreur === "NSP" ? "je ne sais pas" : r.erreur && r.erreur !== "autre" ? `${r.erreur} · ${E[r.erreur] ?? ""}` : "autre"), h("td", {}, note(r)))))));
  }

  // ---------------------------------------------------------------- progression
  progress(page) {
    const n1 = this.d.niveaux.find((n) => n.module === 1), M1 = this.c.modules[1], max = Object.keys(M1.niveaux).length;
    const m1 = h("div", { class: "pa-card-box" }, h("h2", {}, `Module 1 · ${M1.nom}`));
    if (!n1) m1.append(h("p", { class: "pa-empty" }, "Pas encore commencé."));
    else {
      m1.append(h("p", { class: "pa-big" }, `Niveau ${n1.niveau} sur ${max}`), h("p", { class: "pa-note" }, M1.niveaux[n1.niveau]),
        h("div", { class: "pa-levels", "aria-hidden": "true" }, Array.from({ length: max }, (_, i) => h("span", { class: i + 1 < n1.niveau ? "done" : i + 1 === n1.niveau ? "cur" : "" }, i + 1))),
        h("h3", {}, "Historique des niveaux"), h("ul", { class: "pa-hist" }, D.levelHistory(n1).map((e) => h("li", {}, e.type === "parent" ? `${D.fmtDay(e.date)} : niveau ${e.niveau} choisi par le parent (point de départ${e.de ? `, au lieu du niveau ${e.de}` : ""})` : e.type === "obtenu" ? `${D.fmtDay(e.date)} : ${e.niveau === 1 && !e.cran ? "début au niveau 1" : `niveau ${e.niveau} atteint${e.cran ? " (en réussissant à un cran plus dur)" : ""}`}` : `${D.fmtDay(e.date)} : redescente du niveau ${e.de} au niveau ${e.niveau} (deux séances de suite sous 50 % ; l'enfant ne le voit pas)`))),
        (n1.lecons ?? []).length ? h("p", { class: "pa-note" }, `Leçons déjà vues : ${n1.lecons.join(", ")}.`) : null);
    }
    this.weeklyBlock(m1, 1);
    // module 2 : les faits d'addition (lot 2, étape 7 : familles, grille des additions, faits bien sus semaine par semaine)
    const M2 = this.module2, F = D.factsSummary(this.d.faits), cat = catalog(M2), st2 = this.d.niveaux.find((n) => n.module === 2) ?? null, FS = D.familiesSummary(M2, st2, this.d.faits);
    const famName = (id) => M2.familles.find((f) => f.id === id)?.nom ?? id;
    const m2 = h("div", { class: "pa-card-box" }, h("h2", {}, `Module 2 · ${this.c.modules[2].nom}`),
      h("p", { class: "pa-big" }, `${F.rencontres} faits rencontrés sur ${cat.length}`),
      h("p", { class: "pa-note" }, `Famille en cours (celle de la notion du jour sur les additions) : `, h("b", {}, famName(FS.enCours)), `. Un fait monte d'une boîte quand il est juste et rapide (au plus une boîte par séance) ; une erreur le renvoie en boîte 1. Une famille est acquise quand ${Math.round(100 * (M2.familles2?.acquise?.part ?? 0.8))} % des faits de sa règle sont en boîte 3 ou plus.`),
      h("div", { class: "pa-table-wrap" }, h("table", { class: "pa-table pa-fam" },
        h("thead", {}, h("tr", {}, ["Famille", "Ouverte", "Faits bien sus", "Acquise", "Formes à trou"].map((t, i) => h("th", { class: i === 2 ? "num" : "" }, t)))),
        h("tbody", {}, FS.familles.map((f) => h("tr", { class: f.enCours ? "cur" : f.ouverte ? "" : "off" },
          h("td", {}, `${f.id} · ${f.nom}${f.enCours ? " (en cours)" : ""}`),
          h("td", {}, f.ouverte ? (f.ouverteLe ? `${D.fmtShortDay(f.ouverteLe)}${f.ouverteParent ? " (parent)" : ""}` : "dès le départ") : "pas encore"),
          h("td", { class: "num" }, `${f.bienSus} / ${f.total}`),
          h("td", {}, f.acquise ? `${f.acquiseLe ? D.fmtShortDay(f.acquiseLe) : "oui"}${f.acquiseParent ? " (point de départ)" : ""}` : "—"),
          h("td", {}, f.trou ? "ouvertes" : "—")))))),
      h("h3", {}, "Les faits par boîte"),
      h("div", { class: "pa-boxes" }, F.boites.map((n, i) => h("div", {}, h("b", {}, n), h("span", {}, i === 0 ? "boîte 1 · chaque séance" : `boîte ${i + 1} · tous les ${M2.boites[i]} jours`)))),
      h("p", { class: "pa-note", id: "pa-base" }, ""),
      h("h3", {}, "Les faits qui résistent"),
      F.resistent.length ? h("div", { class: "pa-chips" }, F.resistent.slice(0, 16).map((f) => h("span", { class: "pa-chip" }, `${f.a} + ${f.b} · ${plural(f.erreurs, "erreur")}, boîte ${f.boite}`))) : h("p", { class: "pa-muted" }, "Aucun pour l'instant."));
    this.store.setting("tempsDeBase").then((b) => {
      const m = median(b?.mesures ?? []);
      m2.querySelector("#pa-base").textContent = m ? `Temps de base (réponse à « a + 0 ») : ${D.fmtSeconds(m)}. Un fait est « rapide » s'il est donné en moins de ce temps plus ${M2.seuilS} secondes (${M2.seuilAvanceS} secondes quand la moitié des faits sont en boîte 3 ou plus).` : "Temps de base : pas encore mesuré.";
      m2.querySelector(".pa-grid-host").replaceChildren(this.additionGrid(m));
    });
    m2.append(h("h3", {}, "La grille des additions"), h("div", { class: "pa-grid-host" }));
    this.weeklyBlock(m2, 2);
    const WS = D.weeklySolid(this.d.faits);
    if (WS.length) { const cap = h("p", { class: "pa-caption" }, "Touchez un point pour voir le détail de la semaine."); m2.append(h("p", { class: "pa-note" }, "Faits bien sus (boîte 3 ou plus) à la fin de chaque semaine"), chart(WS, (w) => w.n, { fmt: (v) => String(Math.round(v)), tell: (w) => { cap.textContent = `Semaine du ${D.fmtDay(w.semaine)} : ${plural(w.n, "fait bien su", "faits bien sus")} sur ${cat.length}.`; } }), cap); }
    // le défi record
    const DS = D.challengeSummary(this.d.recompenses.defi, this.d.seances);
    const df = h("div", { class: "pa-card-box" }, h("h2", {}, "Défi record"),
      h("p", { class: "pa-note" }, "Une minute de faits d'addition déjà bien sus (boîte 3 ou plus), à partir de la 5e séance et quand au moins 8 faits sont bien sus. L'enfant voit une bulle qui se vide et une perle par bonne réponse ; son score n'est comparé qu'à son propre record (un drapeau rouge), jamais à une norme. Un nouveau record rapporte 5 étoiles de mer."),
      DS.defis ? h("div", { class: "pa-stats" }, stat(String(DS.record ?? "—"), `bonnes réponses : son record${DS.date ? ` (le ${D.fmtDay(DS.date)})` : ""}`), stat(String(DS.defis), "défis joués")) : h("p", { class: "pa-empty" }, "Pas encore de défi."),
      DS.scores.length ? h("div", { class: "pa-chips" }, DS.scores.slice(-20).reverse().map((x) => h("span", { class: `pa-chip${x.record ? " rec" : ""}` }, `${D.fmtShortDay(x.t)} : ${x.score}${x.record ? " · record" : ""}`))) : null);
    // le journal des erreurs
    const J = D.errorJournal(this.d.reponses), E = this.c.erreurs;
    const jr = h("div", { class: "pa-card-box" }, h("h2", {}, "Journal des erreurs"), h("p", { class: "pa-note" }, "Pour la ligne graduée, chaque mauvaise réponse révèle souvent une erreur type (E1 à E5 ; avec les nombres jusqu'à 1 000, E6 : dizaines et centaines confondues, et E7 : le nombre écrit comme on l'entend, 3007 pour 307) ; l'application la corrige avec une animation, et relance une leçon si elle revient deux fois dans une séance. Le bouton « je ne sais pas » (NSP) a sa propre ligne : ce n'est pas une erreur, mais la question revient comme après une erreur."));
    if (!J.length) jr.append(h("p", { class: "pa-muted" }, "Aucune erreur enregistrée."));
    for (const w of J.slice(0, 6)) {
      jr.append(h("h3", {}, `Semaine du ${D.fmtDay(w.semaine)}`));
      for (const [code, c] of Object.entries(w.codes).sort((a, b) => b[1].n - a[1].n)) jr.append(h("div", { class: "pa-err" }, h("span", { class: "code" }, code === "autre" ? "—" : code === "NSP" ? "?" : code), h("span", {}, E[code] ?? code), h("span", { class: "n" }, `${c.n} fois`),
        h("span", { class: "ex" }, "Exemples : ", c.exemples.map((x) => `${x.question} → réponse ${x.donnee ?? "—"} au lieu de ${x.attendue}`).join(" ; "))));
    }
    // le trésor de l'enfant
    const R = this.d.recompenses, et = R.etoiles ?? {};
    const tr = h("div", { class: "pa-card-box" }, h("h2", {}, "Le trésor de l'enfant"), h("div", { class: "pa-stats" },
      stat(String(et.cumul ?? 0), "étoiles de mer gagnées depuis le début"), stat(String(et.total ?? 0), "étoiles pas encore dépensées"), stat(String(et.coquillages ?? 0), "coquillages ouverts"),
      stat(String(R.serie?.seances ?? 0), "séances dans la série (elle ne retombe jamais à zéro)")));
    page.append(m1, m2, df, jr, tr, this.cardsBox());
  }
  // LA GRILLE DES ADDITIONS (lot 2, étape 7) : a en ligne, b en colonne ; couleur selon la boîte, anneau vert si le
  // fait est donné vite ; les cases « + 0 » en gris avec le temps de base ; toucher une case montre son historique
  additionGrid(baseMs) {
    const G = D.additionGrid(this.d.faits, this.d.reponses, { c: this.module2, baseMs }), info = h("div", { class: "pa-grid-info" }, h("p", { class: "pa-caption" }, "Touchez une case pour voir l'historique de l'addition."));
    const show = (x) => {
      if (x.kind === "base") return info.replaceChildren(h("p", {}, h("b", {}, `${x.a} + ${x.b}`), ` : question « + 0 », qui ne sert qu'à mesurer la vitesse de frappe. Temps médian : ${D.fmtSeconds(x.tempsMedian)}.`));
      const f = this.d.faits.find((y) => y.fait === x.fait), H = D.factHistory(f);
      info.replaceChildren(h("p", {}, h("b", {}, `${x.a} + ${x.b} = ${x.a + x.b}`), f ? ` : boîte ${f.boite}, ${plural(x.passages, "passage")}, ${plural(x.erreurs, "erreur")}, temps médian ${D.fmtSeconds(f.tempsMedian)}${x.rapide ? " (rapide)" : ""} ; prochain passage le ${D.fmtDay(f.prochain)}.` : " : pas encore rencontrée."),
        H.length ? h("div", { class: "pa-table-wrap" }, h("table", { class: "pa-table" }, h("thead", {}, h("tr", {}, ["Date", "Résultat", "Temps", "Forme", "Boîte"].map((t, i) => h("th", { class: i === 2 ? "num" : "" }, t)))),
          h("tbody", {}, H.map((e) => h("tr", { class: e.juste || e.parent ? "" : "faux" }, h("td", {}, `${D.fmtShortDay(e.date)} ${D.fmtTime(e.date)}`),
            h("td", {}, e.parent ? "point de départ (parent)" : e.juste ? h("span", { class: "pa-yes" }, `✓ juste${e.aide ? " (avec l'aide)" : ""}`) : h("span", { class: "pa-no" }, "✗ faux")), h("td", { class: "num" }, e.parent ? "" : D.fmtSeconds(e.ms)),
            h("td", {}, this.c.formes[e.forme] ?? e.forme), h("td", {}, e.avant != null && e.apres != null && e.avant !== e.apres ? `${e.avant ?? "—"} → ${e.apres}` : String(e.apres ?? e.avant ?? ""))))))) : null);
    };
    const table = h("table", { class: "pa-grid", role: "grid", "aria-label": "grille des additions" },
      h("thead", {}, h("tr", {}, h("th", { class: "corner" }, "+"), Array.from({ length: 11 }, (_, b) => h("th", {}, b)))),
      h("tbody", {}, G.map((row, a) => h("tr", {}, h("th", {}, a), row.map((x) => x.kind === "hors" ? h("td", { class: "hors" }) :
        h("td", { class: x.kind === "base" ? "base" : `b${x.boite}${x.rapide ? " vite" : ""}`, tabindex: "0", title: `${x.a} + ${x.b}`, onpointerdown: (ev) => { table.querySelectorAll(".sel").forEach((e) => e.classList.remove("sel")); ev.currentTarget.classList.add("sel"); show(x); } },
          x.kind === "base" ? (x.tempsMedian != null ? D.fmtSeconds(x.tempsMedian).replace(" s", "") : "") : x.boite ? String(x.boite) : ""))))));
    const legend = h("div", { class: "pa-grid-legend" }, h("span", { class: "b0" }, "pas encore vue"), [1, 2, 3, 4, 5].map((b) => h("span", { class: `b${b}` }, `boîte ${b}`)), h("span", { class: "b3 vite" }, "anneau : rapide"), h("span", { class: "base" }, "+ 0 : temps de base (s)"));
    return h("div", {}, h("p", { class: "pa-note" }, "Chaque case est une addition (le nombre de la ligne plus celui de la colonne). Le chiffre est la boîte de révision (1 : revue à chaque séance, 5 : bien sue) ; un anneau vert : elle est donnée vite, sans compter."), legend, h("div", { class: "pa-table-wrap" }, table), info);
  }
  // les cartes (lot 2) : ce que l'enfant a gagné et ce qui règle le rythme ; pour le parent seulement
  cardsBox() {
    const K = D.cardsSummary(this.d.recompenses, this.cartes, this.calendrier, this.d.seances), pl = (n, w) => plural(n, w, w.split(" ").map((x) => `${x}s`).join(" "));
    const box = h("div", { class: "pa-card-box" }, h("h2", {}, "Cartes"),
      h("p", { class: "pa-note" }, `Pour que toutes les cartes arrivent d'ici l'été, l'enfant peut gagner ${pl(this.cartes.quota.parSemaine, "carte nouvelle")} par semaine d'école (vacances non comptées). Au-delà, un coquillage donne un doublon d'une carte déjà gagnée. Une carte nouvelle a une chance sur cinq d'être brillante, un doublon une chance sur vingt. L'enfant ne voit aucun de ces nombres.`),
      h("div", { class: "pa-stats" },
        stat(`${K.cartes} / ${K.total}`, "cartes gagnées"), stat(String(K.brillantes), "cartes brillantes"),
        stat(String(K.gagnables), `cartes nouvelles encore gagnables d'ici dimanche${K.gagnables ? "" : " (quota atteint : de nouvelles lundi, sauf pendant les vacances)"}`),
        stat(`${K.legendaires} / ${K.legendairesTotal}`, "légendaires (une étoile dorée chacune)"),
        stat(String(K.dorees - K.doreesDepensees), `étoiles dorées en réserve (${K.dorees} gagnées)`),
        stat(String(K.semaines), `semaines réussies (au moins ${pl(this.cartes.semaine.seances, "séance")}) ; prochaine étoile dorée dans ${pl(K.prochaineDoree, "semaine réussie")}`),
        stat(String(K.arc - K.arcDepensees), `étoiles arc-en-ciel en réserve (${K.arc} gagnées, ${K.arcDepensees} pour ouvrir des zones)${K.arcLibre ? ` ; ${K.arcLibre} gagnée(s) en entraînement libre, remise(s) à la prochaine séance` : ""}`),
        stat(`${K.cadeaux} / 4`, "cadeaux de la surprise dans le récif")),
      h("h3", {}, "Les zones"),
      h("div", { class: "pa-chips" }, K.zones.map((z) => h("span", { class: "pa-chip" }, `${z.nom} : ${z.ouverte ? `${z.gagnees} / ${z.total}` : z.pret ? "fermée" : "fermée, contenu à venir"}`))),
      h("p", { class: "pa-note" }, K.suivante ? `Prochaine zone, « ${K.suivante.nom} » : elle attend ${K.suivante.attend}.` : "Toutes les zones sont ouvertes."));
    if (K.base) box.append(h("p", { class: "pa-muted" }, `Quota compté depuis le ${D.fmtDay(K.base.date)} (${pl(K.base.cartes, "carte")} déjà gagnée${K.base.cartes > 1 ? "s" : ""} ce jour-là).`));
    return box;
  }
  // les courbes semaine par semaine d'un module (réussite, puis temps médian : deux graphiques, jamais deux axes)
  weeklyBlock(box, module) {
    const W = D.weekly(this.d.reponses, module);
    box.append(h("h3", {}, "Semaine par semaine"));
    if (!W.length) { box.append(h("p", { class: "pa-muted" }, "Pas encore de réponses.")); return; }
    const cap = h("p", { class: "pa-caption" }, "Touchez un point pour voir le détail de la semaine.");
    const tell = (w) => { cap.textContent = w.n ? `Semaine du ${D.fmtDay(w.semaine)} : ${plural(w.n, "réponse")}, ${D.fmtPct(w.taux)} de réussite, temps médian ${D.fmtSeconds(w.medianeMs)} (réponses justes).` : `Semaine du ${D.fmtDay(w.semaine)} : pas de séance.`; };
    box.append(h("div", { class: "pa-two" },
      h("div", {}, h("p", { class: "pa-note" }, "Réussite (part des réponses justes)"), chart(W, (w) => w.taux, { max: 1, fmt: D.fmtPct, ticks: [0, 0.5, 1], tell })),
      h("div", {}, h("p", { class: "pa-note" }, "Temps médian d'une réponse juste"), chart(W, (w) => (w.medianeMs === null ? null : w.medianeMs / 1000), { fmt: (v) => D.fmtSeconds(v * 1000), unit: "s", tell }))), cap);
  }

  // ---------------------------------------------------------------- données et réglages
  dataPage(page) {
    const last = this.d.dernierExport;
    const exp = h("div", { class: "pa-card-box" }, h("h2", {}, "Sauvegarder et exporter"),
      h("p", { class: "pa-note" }, "Les données restent sur cette tablette. Elles disparaissent si l'on efface les données de Chrome ou si l'on désinstalle l'application : faites une sauvegarde complète chaque semaine et gardez le fichier ailleurs (ordinateur, Drive, e-mail)."),
      h("p", {}, last ? h("span", { class: "pa-ok" }, `Dernière sauvegarde complète : ${D.fmtDay(last)} à ${D.fmtTime(last)}.`) : h("b", {}, "Aucune sauvegarde complète pour l'instant.")));
    const msg = h("p", { class: "pa-note", role: "status" });
    const full = async () => {
      const text = JSON.stringify(D.cleanDump(await this.store.dump()), null, 1), name = D.fileName("sauvegarde", "json");
      download(name, text, "application/json"); await this.marked(); msg.textContent = `Fichier « ${name} » enregistré dans les téléchargements.`;
      return { text, name };
    };
    const csv = async (what, cols, rows) => { const name = D.fileName(what, "csv"); download(name, "﻿" + D.toCSV(cols, rows), "text/csv;charset=utf-8"); msg.textContent = `Fichier « ${name} » enregistré dans les téléchargements (s'ouvre avec un tableur).`; };
    const canShare = typeof navigator.canShare === "function" && navigator.canShare({ files: [new File(["{}"], "x.json", { type: "application/json" })] });
    exp.append(h("div", { class: "pa-row" },
      h("button", { class: "pa-btn primary", "data-export": "json", onclick: full }, "Sauvegarde complète (JSON)"),
      canShare && h("button", { class: "pa-btn", onclick: async () => { const text = JSON.stringify(D.cleanDump(await this.store.dump()), null, 1), name = D.fileName("sauvegarde", "json"); try { await navigator.share({ files: [new File([text], name, { type: "application/json" })], title: name }); await this.marked(); msg.textContent = "Sauvegarde envoyée."; } catch { /* annulé */ } } }, "Envoyer la sauvegarde…")),
      h("h3", {}, "Tableaux pour un tableur (CSV)"),
      h("div", { class: "pa-row" },
        h("button", { class: "pa-btn", "data-export": "reponses", onclick: () => csv("reponses", D.ANSWER_COLUMNS, [...this.d.reponses].sort((a, b) => a.t - b.t)) }, `Toutes les réponses (${this.d.reponses.length})`),
        h("button", { class: "pa-btn", "data-export": "seances", onclick: () => csv("seances", D.SESSION_COLUMNS, [...this.d.seances].reverse()) }, `Les séances (${this.d.seances.length})`),
        h("button", { class: "pa-btn", "data-export": "faits", onclick: () => csv("faits", D.FACT_COLUMNS, [...this.d.faits].sort((a, b) => a.a - b.a || a.b - b.b)) }, `Les faits d'addition (${this.d.faits.length})`)), msg);
    // restaurer
    const rmsg = h("div");
    const input = h("input", { type: "file", accept: "application/json,.json", hidden: true, onchange: async () => {
      const f = input.files[0]; input.value = ""; if (!f) return;
      let dump = null; try { dump = JSON.parse(await f.text()); } catch { /* illisible */ }
      const why = D.restoreProblem(dump, { base: DB_NAME, version: MIGRATIONS.length, stores: STORES });
      if (why) { rmsg.replaceChildren(h("p", { class: "pa-no" }, `Impossible de restaurer : ${why}.`)); return; }
      const n = dump.seances.length, date = dump.exporte ? D.fmtDay(Date.parse(dump.exporte)) : "date inconnue";
      rmsg.replaceChildren(h("div", { class: "pa-confirm" }, h("p", {}, `Remplacer toutes les données de cette tablette par la sauvegarde du ${date} (${plural(n, "séance")}) ? Ce qui a été fait depuis sera perdu.`),
        h("div", { class: "pa-row" }, h("button", { class: "pa-btn danger primary", onclick: async () => { await this.store.restore(dump, ["codeParent"]); this.changed = true; await this.load(); this.show("donnees"); this.main.querySelector("[data-restored]")?.replaceChildren(h("p", { class: "pa-ok" }, "Sauvegarde restaurée.")); } }, "Oui, restaurer"), h("button", { class: "pa-btn", onclick: () => rmsg.replaceChildren() }, "Annuler"))));
    } });
    const rest = h("div", { class: "pa-card-box" }, h("h2", {}, "Restaurer une sauvegarde"), h("p", { class: "pa-note" }, "Sur une nouvelle tablette, ou après un effacement : choisissez le fichier JSON d'une sauvegarde complète."), input,
      h("button", { class: "pa-btn", onclick: () => input.click() }, "Choisir un fichier de sauvegarde…"), rmsg, h("div", { "data-restored": "" }));
    page.append(exp, rest, this.settingsBox());
  }
  // les crans que l'enfant peut choisir au début de la séance : du plus facile autorisé au plus dur autorisé
  cransRow(row) {
    const names = ["facile", "conseille", "dur", "tresdur"], lo = h("div", { class: "pa-seg", role: "group", "aria-label": "cran le plus facile" }), hi = h("div", { class: "pa-seg", role: "group", "aria-label": "cran le plus dur" }), ok = h("span", { class: "pa-ok" });
    let cur = { min: "facile", max: "tresdur" };
    const paint = () => { for (const b of lo.children) b.setAttribute("aria-pressed", String(b.dataset.v === cur.min)); for (const b of hi.children) b.setAttribute("aria-pressed", String(b.dataset.v === cur.max)); };
    const save = async (k, v) => { cur = { ...cur, [k]: v }; if (names.indexOf(cur.min) > names.indexOf(cur.max)) cur = k === "min" ? { ...cur, max: v } : { ...cur, min: v }; await this.store.setSetting("cransAutorises", cur); paint(); ok.textContent = "Enregistré."; };
    for (const v of ["facile", "conseille"]) lo.append(h("button", { "data-v": v, onclick: () => save("min", v) }, D.CRAN_NAMES[v]));
    for (const v of ["conseille", "dur", "tresdur"]) hi.append(h("button", { "data-v": v, onclick: () => save("max", v) }, D.CRAN_NAMES[v]));
    this.store.setting("cransAutorises").then((c) => { if (c) cur = { ...cur, ...c }; paint(); });
    const line = (t, seg, ...more) => h("div", { class: "pa-row" }, h("span", { class: "pa-muted", style: "min-width: 9em" }, t), seg, ...more);
    return row("Difficulté proposée à l'enfant", "Au début de chaque séance, l'enfant choisit un cran (plus c'est dur, plus les bonnes réponses rapportent d'étoiles). Vous pouvez interdire les crans extrêmes.",
      h("div", { style: "display: grid; gap: 10px" }, line("Le plus facile :", lo), line("Le plus dur :", hi, ok)));
  }
  defiRow(row) {
    const seg = h("div", { class: "pa-seg", role: "group", "aria-label": "défi record" }), paint = (v) => { for (const b of seg.children) b.setAttribute("aria-pressed", String((b.dataset.v === "oui") === v)); };
    for (const [v, t] of [["oui", "activé"], ["non", "désactivé"]]) seg.append(h("button", { "data-v": v, onclick: async () => { await this.store.setSetting("defiActif", v === "oui"); paint(v === "oui"); } }, t));
    this.store.setting("defiActif").then((v) => paint(v !== false));
    return row("Défi record", "Une minute de faits d'addition déjà bien sus, comparés au record de l'enfant (jamais à une norme), après la notion du jour. Il n'a lieu qu'à partir de la 5e séance et quand au moins 8 faits sont bien sus (onglet Progression, « Défi record »).", seg);
  }
  // le module imposé pour la prochaine séance (lot 2, étape 6) : valable une séance, ensuite l'alternance reprend
  moduleRow(row) {
    const seg = h("div", { class: "pa-seg", role: "group", "aria-label": "module de la prochaine séance" }), ok = h("span", { class: "pa-ok" });
    const paint = (v) => { for (const b of seg.children) b.setAttribute("aria-pressed", String(b.dataset.v === String(v ?? "auto"))); };
    for (const [v, t] of [["auto", "au choix de l'application"], ["1", "ligne graduée"], ["2", "additions"]]) seg.append(h("button", { "data-v": v, onclick: async () => { await this.store.setSetting("moduleImpose", v === "auto" ? null : { module: Number(v), t: Date.now() }); paint(v === "auto" ? null : v); ok.textContent = "Enregistré."; } }, t));
    this.store.setting("moduleImpose").then((m) => paint(m?.module ?? null));
    return row("Notion du jour de la prochaine séance", "D'habitude, la ligne graduée et les additions alternent d'une séance à l'autre. Vous pouvez imposer l'une des deux pour la prochaine séance seulement.", seg, ok);
  }
  // le son (lot 2) : musique oui/non et son volume, bruitages oui/non ; un seul réglage « son » dans la base
  sonRow(row) {
    let cur = { musique: true, volume: "moyen", bruitages: true };
    const ok = h("span", { class: "pa-ok" }), segs = [];
    const seg = (label, key, opts) => { const g = h("div", { class: "pa-seg", role: "group", "aria-label": label }); for (const [v, t] of opts) g.append(h("button", { "data-v": String(v), onclick: async () => { cur = { ...cur, [key]: v }; await this.store.setSetting("son", cur); paint(); ok.textContent = "Enregistré."; } }, t)); segs.push([g, key]); return g; };
    const mus = seg("musique", "musique", [[true, "oui"], [false, "non"]]), vol = seg("volume de la musique", "volume", [["doux", "douce"], ["moyen", "moyenne"], ["fort", "plus forte"]]), sfx = seg("bruitages", "bruitages", [[true, "oui"], [false, "non"]]);
    const paint = () => { for (const [g, key] of segs) for (const b of g.children) b.setAttribute("aria-pressed", String(b.dataset.v === String(cur[key]))); vol.style.opacity = cur.musique ? "1" : "0.45"; };
    this.store.setting("son").then((v) => { if (v) cur = { ...cur, ...v }; paint(); });
    const line = (t, g, ...more) => h("div", { class: "pa-row" }, h("span", { class: "pa-muted", style: "min-width: 9em" }, t), g, ...more);
    return row("Son", "Une musique douce pendant la séance (l'une des trois, tirée au hasard), toujours plus basse que la voix, et de petits bruitages (bonne réponse, étoiles, coquillage…). Ils s'arrêtent dans cet espace.",
      h("div", { style: "display: grid; gap: 10px" }, line("Musique :", mus), line("Volume :", vol), line("Bruitages :", sfx, ok)));
  }
  // le point de départ : le niveau de la ligne graduée, les familles de faits déjà connues
  departRow(row) {
    const box = h("div", { class: "pa-depart" }), msg = h("span", { class: "pa-ok" });
    const levels = h("div", { class: "pa-seg", role: "group", "aria-label": "niveau de la ligne graduée" });
    const paint = (n) => { for (const b of levels.children) b.setAttribute("aria-pressed", String(Number(b.dataset.v) === n)); };
    for (let n = 1; n <= this.depart.niveauxMax; n++) levels.append(h("button", { "data-v": n, onclick: async () => { const st = await setLineLevel(this.store, n); paint(st.niveau); msg.textContent = `Ligne graduée : niveau ${n} à la prochaine séance.`; } }, String(n)));
    this.store.get("niveaux", 1).then((st) => paint(st?.niveau ?? 1));
    const fams = h("div", { class: "pa-row" });
    const famBtns = async () => {
      const faits = await this.store.all("faits");
      fams.replaceChildren(...this.depart.familles.map((id) => { const f = this.module2.familles.find((x) => x.id === id), known = familyKnown(this.module2, faits, id);
        return h("button", { class: "pa-btn", disabled: known, onclick: async () => { const n = (await markFamilyKnown(this.store, this.module2, id)).length; msg.textContent = `Famille « ${f.nom} » marquée connue : ${n} fait(s) en boîte 3.`; famBtns(); } }, known ? `« ${f.nom} » : déjà connue` : `Marquer « ${f.nom} » comme connue`); }));
    };
    famBtns();
    box.append(h("div", { class: "pa-row" }, h("span", { class: "pa-muted" }, "Niveau de la ligne graduée :"), levels), fams, msg);
    return row("Point de départ", "Si l'enfant sait déjà faire : choisissez le niveau de la ligne graduée où elle commencera, ou marquez une famille de faits d'addition comme connue (ses faits seront revus moins souvent). C'est noté dans l'historique comme votre choix, et cela ne rapporte rien à l'enfant.", box);
  }
  async marked() { const t = Date.now(); await this.store.setSetting("dernierExport", t); this.d.dernierExport = t; }
  settingsBox() {
    const box = h("div", { class: "pa-card-box" }, h("h2", {}, "Réglages"));
    const row = (title, help, ...ctl) => h("div", { class: "pa-setting" }, h("div", {}, h("b", {}, title), help && h("span", {}, help)), h("div", { class: "pa-row" }, ...ctl));
    // le nom de la pieuvre (il est seulement dit par la voix : le parent peut en taper un autre)
    const name = h("input", { class: "pa-input", maxlength: "20", "aria-label": "nom de la pieuvre", autocomplete: "off" }), nameOk = h("span", { class: "pa-ok" });
    this.store.setting("mascotte").then((m) => { name.value = m ?? ""; });
    const saveName = async () => { const v = name.value.trim().replace(/\s+/g, " "); if (!v) return; await this.store.setSetting("mascotte", v); this.app.mascotte = v; nameOk.textContent = "Enregistré."; this.root.querySelector(".pa-top p").textContent = `L'océan des nombres · la pieuvre s'appelle ${v}`; };
    box.append(row("Nom de la pieuvre", "Choisi par l'enfant au premier lancement ; vous pouvez le changer ici.", name, h("button", { class: "pa-btn", onclick: saveName }, "Enregistrer"), nameOk));
    // la durée maximale d'une séance
    const seg = h("div", { class: "pa-seg", role: "group", "aria-label": "durée maximale d'une séance" });
    const paint = (v) => { for (const b of seg.children) b.setAttribute("aria-pressed", String(Number(b.dataset.v) === v)); };
    for (const m of this.c.dureesSeance) seg.append(h("button", { "data-v": m, onclick: async () => { await this.store.setSetting("dureeSeanceMin", m); paint(m); } }, `${m} min`));
    this.store.setting("dureeSeanceMin", this.seance.dureeMaxMin).then(paint);
    box.append(row("Durée maximale d'une séance", "Au bout de ce temps, l'application dit « à demain » (la dernière minute est gardée pour la récompense).", seg));
    // lot 2 : le sélecteur de difficulté (crans proposés à l'enfant), le défi record, le point de départ
    box.append(this.moduleRow(row), this.sonRow(row), this.cransRow(row), this.defiRow(row), this.departRow(row));
    // le code
    box.append(row("Code parent", "Le code à 4 chiffres qui ouvre cet espace.", h("button", { class: "pa-btn", onclick: () => { this.root.replaceChildren(h("div", { class: "pa-veil" })); this.app.stage.paused = false; this.gate("choisir"); } }, "Changer le code")));
    // le stockage persistant
    const pst = h("span");
    const check = async () => { const p = await navigator.storage?.persisted?.(); pst.replaceChildren(p ? h("span", { class: "pa-ok" }, "Oui : Android ne les effacera pas de lui-même.") : h("span", { class: "pa-full" }, "Non accordé pour l'instant (Chrome l'accorde en général quand l'application est installée sur l'écran d'accueil). ")); if (!p) pst.append(h("button", { class: "pa-btn", onclick: async () => { await persist(); check(); } }, "Demander à nouveau")); };
    check();
    box.append(row("Données protégées", "Stockage persistant de la base locale.", pst));
    // tout effacer
    const conf = h("div");
    box.append(row("Tout effacer", "Remet l'application à zéro : séances, réponses, niveaux, étoiles, cartes, nom de la pieuvre et code.",
      h("button", { class: "pa-btn danger", onclick: () => conf.replaceChildren(h("div", { class: "pa-confirm" }, h("p", {}, h("b", {}, "Tout effacer ? "), "Rien ne pourra être récupéré sans sauvegarde. Pensez d'abord à la sauvegarde complète."),
        h("div", { class: "pa-row" }, h("button", { class: "pa-btn danger primary", onclick: async () => { await this.store.wipe(); this.changed = true; this.close(); } }, "Oui, tout effacer"), h("button", { class: "pa-btn", onclick: () => conf.replaceChildren() }, "Annuler")))) }, "Tout effacer…"), conf));
    return box;
  }
}

// un chiffre clé
function stat(v, label) { return h("div", { class: "pa-stat" }, h("b", {}, v), h("span", {}, label)); }

// une courbe simple (SVG) : une série, un axe, les semaines en abscisse ; le dernier point porte sa
// valeur ; toucher un point raconte la semaine (tell)
function chart(W, get, { max = null, fmt, ticks = null, tell }) {
  const w = 520, hgt = 190, L = 58, R = 44, T = 18, B = 30, vals = W.map(get);
  const top = max ?? Math.max(1, Math.ceil(Math.max(...vals.filter((v) => v !== null), 0)));
  const tk = ticks ?? [0, top / 2, top], X = (i) => (W.length === 1 ? (L + w - R) / 2 : L + (i * (w - L - R)) / (W.length - 1)), Y = (v) => T + (1 - v / top) * (hgt - T - B);
  const svg = s("svg", { class: "pa-chart", viewBox: `0 0 ${w} ${hgt}`, role: "img", "aria-label": W.map((x, i) => `${D.fmtShortDay(x.semaine)} : ${vals[i] === null ? "—" : fmt(vals[i])}`).join(", ") });
  for (const t of tk) svg.append(s("line", { class: "grid", x1: L, x2: w - R + 10, y1: Y(t), y2: Y(t) }), s("text", { class: "axis", x: L - 8, y: Y(t) + 4, "text-anchor": "end" }, fmt(t)));
  const step = Math.max(1, Math.ceil(W.length / 8));
  W.forEach((x, i) => { if (i % step === 0 || i === W.length - 1) svg.append(s("text", { class: "axis", x: X(i), y: hgt - 8, "text-anchor": "middle" }, D.fmtShortDay(x.semaine))); });
  // la ligne s'interrompt sur une semaine sans réponse
  let d = "", pen = false;
  vals.forEach((v, i) => { if (v === null) { pen = false; return; } d += `${pen ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`; pen = true; });
  svg.append(s("path", { class: "line", d }));
  const dots = [];
  vals.forEach((v, i) => { if (v === null) return; const c = s("circle", { class: "dot", cx: X(i), cy: Y(v), r: 5 }); dots.push(c); svg.append(c); });
  const lastI = vals.findLastIndex((v) => v !== null);
  if (lastI >= 0) svg.append(s("text", { class: "lab", x: Math.min(X(lastI) + 8, w - 4), y: Y(vals[lastI]) - 10, "text-anchor": X(lastI) + 8 > w - R ? "end" : "start" }, fmt(vals[lastI])));
  vals.forEach((v, i) => { svg.append(s("rect", { class: "hit", x: X(i) - 22, y: 0, width: 44, height: hgt, onpointerdown: () => { dots.forEach((c) => c.classList.toggle("sel", Number(c.getAttribute("cx")) === X(i))); tell(W[i]); } })); });
  return svg;
}
