// LE JOURNAL TECHNIQUE (lot « Correctifs de l'installation et de la veille », point 5 ; docs/SPEC.md, section 12). Les 300
// derniers événements techniques, gardés sur la tablette, montrés dans l'espace parent (« Données et réglages ») et compris
// dans la sauvegarde complète, pour que le parent puisse les donner à la conception après un essai :
//  - les lancements, avec le temps jusqu'à la première image ;
//  - le service worker : version, installation, activation, erreurs (écrits par app/sw.js lui-même, dans la même base) ;
//  - les passages au premier plan et en arrière-plan ; l'état du son (AudioContext) ;
//  - les lectures refusées (play()) de la voix et des vidéos de la mascotte ;
//  - les erreurs non traitées et les promesses rejetées ; les écrans ouverts.
// Une base à part (`maths-ce1-journal`), hors du schéma versionné de engine/store.js : le service worker y écrit sans connaître
// ce schéma, et le journal ne peut jamais gêner une migration. Il ne doit jamais rien empêcher : chaque écriture est protégée.
export const BASE = "maths-ce1-journal", TABLE = "evenements", MAX = 300;

let db = null, file = Promise.resolve();
const ouvrir = (idb) => (db ??= new Promise((res, rej) => {
  const r = idb.open(BASE, 1);
  r.onupgradeneeded = () => r.result.createObjectStore(TABLE, { autoIncrement: true });
  r.onsuccess = () => res(r.result); r.onerror = () => { db = null; rej(r.error); };
}));
const fini = (tx) => new Promise((res, rej) => { tx.oncomplete = () => res(); tx.onerror = tx.onabort = () => rej(tx.error); });

// les derniers événements notés par cette page, en mémoire (pour les parcours de test : window.__journalTechnique)
export const recents = [];

// note un événement : `type` (« lancement », « écran », « voix »…), `message` en français simple, `details` (des valeurs simples)
export function noter(type, message, details = {}, { idb = globalThis.indexedDB, source = "page" } = {}) {
  const e = { t: Date.now(), source, type, message, ...details };
  recents.push(e); if (recents.length > MAX) recents.shift();
  if (!idb) return Promise.resolve();
  file = file.then(async () => {
    const base = await ouvrir(idb), tx = base.transaction(TABLE, "readwrite"), st = tx.objectStore(TABLE);
    st.add(e);
    const c = st.count();
    c.onsuccess = () => { let n = c.result - MAX; if (n > 0) st.openCursor().onsuccess = (ev) => { const k = ev.target.result; if (k && n-- > 0) { k.delete(); k.continue(); } }; };
    await fini(tx);
  }).catch(() => { /* le journal ne doit jamais gêner l'enfant */ });
  return file;
}

// tous les événements gardés, du plus ancien au plus récent
export async function lire({ idb = globalThis.indexedDB } = {}) {
  try {
    await file;
    const base = await ouvrir(idb), tx = base.transaction(TABLE, "readonly"), r = tx.objectStore(TABLE).getAll();
    return await new Promise((res, rej) => { r.onsuccess = () => res(r.result.sort((a, b) => a.t - b.t)); r.onerror = () => rej(r.error); });
  } catch { return []; }
}

// efface le journal (« tout effacer » de l'espace parent)
export async function vider({ idb = globalThis.indexedDB } = {}) {
  try { await file; const base = await ouvrir(idb), tx = base.transaction(TABLE, "readwrite"); tx.objectStore(TABLE).clear(); await fini(tx); } catch { /* rien */ }
  recents.length = 0;
}

// (pour les tests unitaires : une autre base IndexedDB)
export const _oublier = () => { db = null; file = Promise.resolve(); recents.length = 0; };
