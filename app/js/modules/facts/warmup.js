// MODULE 2 · L'ÉCHAUFFEMENT (docs/SPEC.md, « Cadre d'une séance », étape 2) : 5 à 8 faits d'addition dus,
// précédés de questions triviales (« 4 + 0 ») qui mesurent le temps de base. Une erreur fait revenir le
// fait 3 questions plus loin (ou à la fin). Chaque réponse est enregistrée (magasins « reponses » et
// « faits ») ; le temps de base est rangé dans les réglages (« tempsDeBase »).
import { afterFact, key, median, plan, threshold } from "./facts.js";

export class Warmup {
  constructor({ store, content, rnd, seance = null, clock = () => Date.now() }) { this.store = store; this.c = content; this.rnd = rnd; this.seance = seance; this.clock = clock; }
  async load() {
    this.facts = await this.store.all("faits");
    this.base = (await this.store.setting("tempsDeBase")) ?? { mesures: [] };
    return this;
  }
  get baseMs() { return median(this.base.mesures) ?? this.c.base.defautS * 1000; }
  get limitMs() { return threshold(this.c, this.baseMs, this.facts); }
  // la liste des questions : triviales d'abord, puis les faits ; n : nombre de faits voulu (5 à 8)
  questions(n, min = 5) {
    const B = this.c.base, k = this.base.mesures.length ? B.ensuite : B.premiere, triv = [];
    for (let i = 0; i < k; i++) { const a = 2 + Math.floor(this.rnd() * 7); triv.push(this.rnd() < 0.5 ? { a, b: 0 } : { a: 0, b: a }); }
    this.queue = [...triv.map((t) => ({ ...t, fait: key(t.a, t.b), base: true })), ...plan(this.c, this.facts, this.clock(), n, min)];
    return this.queue;
  }
  // enregistre une réponse ; renvoie { etoiles } ; une erreur replace le fait plus loin dans la file
  async record(q, r, rest) {
    const now = this.clock(), juste = r.value === q.a + q.b;
    await this.store.add("reponses", {
      t: now, seance: this.seance, module: 2, niveau: q.famille ?? 0, question: `${q.a} + ${q.b}`, forme: q.base ? "base" : "directe", donnee: r.value, attendue: q.a + q.b,
      juste, tempsMs: r.ms, ecoutes: r.listens, aide: !!r.aide, erreur: juste ? null : r.nsp ? "NSP" : "autre", revient: !!q.revient, anticipe: !!q.anticipe,
      ...(this.libre ? { libre: true } : {}),
    });
    if (q.base) {
      // temps de base : seulement les réponses justes, on garde les dernières
      if (juste) { this.base = { mesures: [...this.base.mesures, r.ms].slice(-this.c.base.garder) }; await this.store.setSetting("tempsDeBase", this.base); }
      return { juste, etoiles: juste ? 1 : 0 };
    }
    const cur = this.facts.find((f) => f.fait === q.fait) ?? q, limit = this.limitMs;
    const { nouveau, anticipe, revient, ...clean } = cur; void nouveau; void anticipe; void revient;
    // une question qui revient, ou un second passage, ne fait pas monter de boîte (mais une erreur fait redescendre)
    const f = afterFact(this.c, clean, { juste, ms: r.ms, aide: r.aide, anticipe: q.anticipe || q.revient }, limit, now);
    this.facts = [...this.facts.filter((x) => x.fait !== f.fait), f];
    await this.store.put("faits", f);
    if (!juste && !q.revient) rest.splice(Math.min(rest.length, 3), 0, { ...q, revient: true });
    return { juste, rapide: juste && r.ms < limit, etoiles: juste ? (q.revient ? 2 : 1) : 0 };
  }
}
