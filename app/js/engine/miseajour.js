// LA MISE À JOUR DE L'APPLICATION (lot « Correctifs : passage de l'échauffement aux voiliers », point 12). Une page ne mélange
// jamais deux versions : une nouvelle version (son service worker, app/sw.js) s'installe en arrière-plan puis ATTEND. Elle
// prend la main au lancement suivant, ou pendant l'écran de démarrage, avant le toucher : la page lui demande alors de
// s'activer (« activer ») et se recharge aussitôt, avant que l'enfant ait rien touché. Une fois l'écran de démarrage touché,
// plus rien ne change jusqu'au lancement suivant.
// `decider` est la règle seule (testée : tests/unit/miseajour.test.mjs) ; `suivreMiseAJour` la branche sur le navigateur.

// faut-il activer la version qui attend, et recharger ? (`attend` : une version installée attend ; `controlee` : la page est
// servie par une version précédente ; `touche` : l'écran de démarrage a été touché ; `recharge` : la page vient déjà d'être
// rechargée pour une mise à jour, une seule fois par lancement)
export const decider = ({ attend, controlee, touche, recharge = false }) => !!attend && !!controlee && !touche && !recharge;

// le navigateur : `reg` (l'enregistrement du service worker), `touche()` (l'écran de démarrage a-t-il été touché ?)
export function suivreMiseAJour(reg, { touche, journal = () => {} } = {}) {
  const sw = navigator.serviceWorker, deja = sessionStorage.getItem("miseAJour") === "1";
  sessionStorage.removeItem("miseAJour");
  const essayer = () => {
    if (!decider({ attend: reg.waiting, controlee: sw.controller, touche: touche(), recharge: deja })) return;
    journal({ type: "mise à jour", message: "nouvelle version activée pendant l'écran de démarrage" });
    sessionStorage.setItem("miseAJour", "1");
    sw.addEventListener("controllerchange", () => location.reload(), { once: true });
    reg.waiting.postMessage("activer");
  };
  essayer();
  // une version qui finit de s'installer pendant que l'écran de démarrage attend son toucher
  reg.addEventListener("updatefound", () => { const w = reg.installing; w?.addEventListener("statechange", () => { if (w.state === "installed") essayer(); }); });
}
