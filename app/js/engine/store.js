// LE STOCKAGE : une petite enveloppe autour d'IndexedDB, avec un schéma versionné (docs/SPEC.md, « Espace
// parent »). Rien ne quitte la tablette, sauf l'export déclenché par le parent.
//
// Magasins :
//   seances      une séance : début, fin, durée, terminée, module du jour, questions, taux de réussite
//   reponses     une réponse : horodatage, séance, module, niveau, question exacte, forme, réponse donnée,
//                juste, temps, nombre d'écoutes, aide utilisée, code d'erreur détecté
//   faits        un fait d'addition (« 3+4 ») : boîte, prochain passage, historique, temps médian
//   niveaux      par module : niveau atteint, dates d'obtention, redescentes, fenêtre des dernières réponses
//   bilans       un bilan : date, module, score brut, durée, palier officiel
//   recompenses  côté enfant : étoiles, coquillages, cartes, zones ouvertes, série de jours
//   reglages     clé -> valeur : code parent, nom de la pieuvre, durée de séance, module imposé…
//
// Pour faire évoluer le schéma : ajouter une migration à la fin de MIGRATIONS (jamais modifier une
// migration déjà publiée) ; la version de la base est le nombre de migrations.
export const DB_NAME = "ocean-des-nombres";
export const MIGRATIONS = [
  // 1 : schéma initial (lot 1)
  (db) => {
    const s = db.createObjectStore("seances", { keyPath: "id", autoIncrement: true }); s.createIndex("debut", "debut");
    const r = db.createObjectStore("reponses", { keyPath: "id", autoIncrement: true }); r.createIndex("seance", "seance"); r.createIndex("t", "t"); r.createIndex("module", "module");
    const f = db.createObjectStore("faits", { keyPath: "fait" }); f.createIndex("boite", "boite"); f.createIndex("prochain", "prochain");
    db.createObjectStore("niveaux", { keyPath: "module" });
    const b = db.createObjectStore("bilans", { keyPath: "id", autoIncrement: true }); b.createIndex("date", "date");
    db.createObjectStore("recompenses", { keyPath: "id" });
    db.createObjectStore("reglages", { keyPath: "cle" });
  },
];
export const STORES = ["seances", "reponses", "faits", "niveaux", "bilans", "recompenses", "reglages"];

const req = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

export class Store {
  constructor(db) { this.db = db; }
  static open(idb = globalThis.indexedDB, name = DB_NAME) {
    return new Promise((res, rej) => {
      const r = idb.open(name, MIGRATIONS.length);
      r.onupgradeneeded = (e) => { for (let v = e.oldVersion; v < MIGRATIONS.length; v++) MIGRATIONS[v](r.result, r.transaction); };
      r.onsuccess = () => res(new Store(r.result)); r.onerror = () => rej(r.error);
      r.onblocked = () => rej(new Error("base bloquée par un autre onglet"));
    });
  }
  get(store, key) { return req(this.db.transaction(store).objectStore(store).get(key)); }
  async put(store, value) { const t = this.db.transaction(store, "readwrite"), k = await req(t.objectStore(store).put(value)); await done(t); return k; }
  async add(store, value) { const t = this.db.transaction(store, "readwrite"), k = await req(t.objectStore(store).add(value)); await done(t); return k; }
  async all(store, index, range) { const s = this.db.transaction(store).objectStore(store); return req((index ? s.index(index) : s).getAll(range)); }
  async del(store, key) { const t = this.db.transaction(store, "readwrite"); t.objectStore(store).delete(key); await done(t); }
  async clear(store) { const t = this.db.transaction(store, "readwrite"); t.objectStore(store).clear(); await done(t); }
  // réglages : une valeur par clé
  async setting(cle, def = null) { const v = await this.get("reglages", cle); return v ? v.valeur : def; }
  setSetting(cle, valeur) { return this.put("reglages", { cle, valeur }); }
  // tout le contenu, pour l'export JSON du parent
  async dump() { const out = { base: DB_NAME, version: MIGRATIONS.length, exporte: new Date().toISOString() }; for (const s of STORES) out[s] = await this.all(s); return out; }
  // réinitialisation (espace parent)
  async wipe() { for (const s of STORES) await this.clear(s); }
  // restaure une sauvegarde (le JSON de dump) : tout est remplacé en une seule transaction (rien n'est
  // effacé si elle échoue) ; `keep` : réglages actuels gardés (le code parent n'est pas dans l'export)
  async restore(dump, keep = []) {
    const kept = (await Promise.all(keep.map((k) => this.get("reglages", k)))).filter(Boolean);
    const t = this.db.transaction(STORES, "readwrite");
    for (const s of STORES) { const o = t.objectStore(s); o.clear(); for (const v of dump[s] ?? []) o.put(v); }
    for (const v of kept) t.objectStore("reglages").put(v);
    await done(t);
  }
}
const done = (t) => new Promise((res, rej) => { t.oncomplete = res; t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); });

// demander un stockage persistant (qu'Android n'efface pas de lui-même) ; renvoie true si accordé
export const persist = async () => { try { return (await navigator.storage?.persisted?.()) || (await navigator.storage?.persist?.()) || false; } catch { return false; } };
