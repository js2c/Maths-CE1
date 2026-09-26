// RÈGLES D'ADAPTATION (docs/SPEC.md, « Règles d'adaptation »), communes à tous les modules. Fonctions
// pures : l'état d'un module (magasin « niveaux ») entre, un nouvel état et des événements sortent.
//  - montée : 8 bonnes réponses sur les 10 dernières du niveau, avec au plus une aide ;
//  - voie rapide : les 5 premières questions d'un niveau justes, sans aide, en moins de 6 s chacune ;
//  - difficulté persistante : 3 erreurs sur les 5 dernières questions (relance de la leçon, puis une
//    question plus simple) ;
//  - redescente : deux séances de suite sous 50 % font redescendre d'un niveau (invisible pour l'enfant).
// Les seuils viennent de content/module1.json (reglesAdaptation), jamais du code.
export const initialLevelState = (module, now = Date.now()) => ({ module, niveau: 1, obtenus: [{ niveau: 1, date: now }], redescentes: [], fenetre: [], vus: 0, taux: [], lecons: [] });

// une réponse au niveau courant. r = { juste, aide, ms } ; renvoie { st, events }
export function afterAnswer(st0, r, rules, maxLevel, now = Date.now()) {
  const st = structuredClone(st0), events = [];
  st.fenetre = [...st.fenetre, { juste: !!r.juste, aide: !!r.aide, ms: r.ms }].slice(-rules.montee.sur);
  st.vus += 1;
  const up = (rapide) => {
    if (st.niveau >= maxLevel) return;
    events.push({ type: "montee", de: st.niveau, a: st.niveau + 1, rapide });
    st.niveau += 1; st.obtenus.push({ niveau: st.niveau, date: now }); st.fenetre = []; st.vus = 0;
  };
  const f = st.fenetre, vr = rules.voieRapide;
  if (st.vus === vr.premieres && f.length === vr.premieres && f.every((x) => x.juste && !x.aide && x.ms < vr.tempsMaxS * 1000)) up(true);
  else if (f.length >= rules.montee.sur && f.filter((x) => x.juste).length >= rules.montee.justes && f.filter((x) => x.aide).length <= rules.montee.aidesMax) up(false);
  const last = st.fenetre.slice(-rules.difficulte.sur);
  if (!events.length && last.length >= rules.difficulte.sur && last.filter((x) => !x.juste).length >= rules.difficulte.erreurs) { events.push({ type: "difficulte", niveau: st.niveau }); st.fenetre = st.fenetre.slice(0, -rules.difficulte.sur); }
  return { st, events };
}

// fin de séance : taux de réussite dans ce module ; deux séances de suite sous le seuil -> un niveau de moins
export function afterSession(st0, rate, rules, now = Date.now()) {
  const st = structuredClone(st0), events = [], R = rules.redescente;
  if (rate === null || rate === undefined) return { st, events };
  st.taux = [...st.taux, rate].slice(-R.seances);
  if (st.taux.length >= R.seances && st.taux.every((x) => x < R.sousTaux) && st.niveau > 1) {
    events.push({ type: "redescente", de: st.niveau, a: st.niveau - 1 });
    st.redescentes.push({ de: st.niveau, a: st.niveau - 1, date: now }); st.niveau -= 1; st.fenetre = []; st.vus = 0; st.taux = [];
  }
  return { st, events };
}
