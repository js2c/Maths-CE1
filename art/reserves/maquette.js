// MAQUETTE DU LOT « RÉSERVES D'ÉTOILES ET ÉTOILES ARC-EN-CIEL » (décisions du parent du 2 novembre 2026 ; docs/LOTS.md, fiche 16).
// Elle se pose SUR l'application elle-même (sa mascotte, sa bulle, ses dessins, sa boutique), sans rien modifier sous app/ :
// ce script est injecté dans la page de l'application (art/reserves/index.html, ou art/reserves/captures.mjs) et ajoute ce que
// le lot propose :
//  1. les deux réserves, à droite du compteur d'étoiles : l'étoile arc-en-ciel et l'étoile de diamant, chacune avec son nombre
//     (masquée à 0) ; toucher une réserve fait dire combien il y en a et ce qu'elles débloquent ;
//  2. la boutique, une créature du récif touchée : faire briller avec les étoiles de mer OU une étoile arc-en-ciel (deux coches,
//     chacune portant ce qu'on donne), ou l'étoile arc-en-ciel gardée pour la prochaine zone (la tuile le montre, la voix le dit) ;
//  3. la récompense : les étoiles arc-en-ciel et l'étoile de diamant volent jusqu'à leur réserve, qui se met à jour.
// Les phrases de la maquette ne sont pas encore dans textes.json (elles le seront au code) : la voix ne les dit pas, la bulle les
// écrit. Les dessins sont ceux de l'atelier déjà dans l'application (etoile.arc, etoile.diamant, etoile, boutique.coche,
// boutique.cadenas) : rien de nouveau à dessiner.
(() => {
  const M = (window.MaquetteReserves = {});
  const imp = (p) => import(new URL(p, document.baseURI).href);

  // ---------------------------------------------------------------- les phrases proposées
  // `etat` : { n, fermees (zones encore fermées), gardees (étoiles gardées : une par zone fermée), zonePrete (la zone en cours
  // est complète : une zone va s'ouvrir) } pour l'arc-en-ciel ; { n, legendaireMaintenant, zoneLegendaire (« du grand large »,
  // « des abysses ») ou null : toutes les légendaires sont là } pour le diamant
  M.ARC_MAX = 50; M.DIAMANT_MAX = 15;
  M.phraseArc = ({ n, fermees, zonePrete }) => {
    const nb = n === 1 ? "Tu as une étoile arc-en-ciel." : n > M.ARC_MAX ? "Tu as beaucoup d'étoiles arc-en-ciel." : `Tu as ${n} étoiles arc-en-ciel.`;
    const libres = n - fermees;
    const role = !fermees ? (n === 1 ? "Elle fait briller une créature, à la boutique." : "Elles font briller tes créatures, à la boutique.")
      : libres >= 1 ? "Elles ouvrent les nouvelles zones du récif, et font briller tes créatures."
      : n === 1 ? "Elle ouvrira la prochaine zone du récif." : "Elles ouvriront les prochaines zones du récif.";
    return [nb, role, zonePrete ? "Une nouvelle zone va bientôt s'ouvrir." : null].filter(Boolean).join(" ");
  };
  M.phraseDiamant = ({ n, legendaireMaintenant, zoneLegendaire }) => {
    const nb = n === 1 ? "Tu as une étoile de diamant." : n > M.DIAMANT_MAX ? "Tu as beaucoup d'étoiles de diamant." : `Tu as ${n} étoiles de diamant.`;
    const role = zoneLegendaire === null ? "Tu as déjà toutes les créatures légendaires !"
      : legendaireMaintenant ? "À la fin de ta prochaine séance, une étoile de diamant t'offrira une créature légendaire !"
      : n === 1 ? `Elle t'offrira une créature légendaire, quand tu auras toutes les créatures ${zoneLegendaire}.` : `Elles t'offriront les créatures légendaires, quand tu auras toutes les créatures ${zoneLegendaire}.`;
    return `${nb} ${role}`;
  };
  M.OU_ARC = "Ou bien une étoile arc-en-ciel !";
  M.CHOISIS = "Touche la coche de l'étoile que tu veux donner.";
  M.GARDEE = (n) => (n === 1 ? "Ton étoile arc-en-ciel est gardée pour ouvrir une nouvelle zone." : "Tes étoiles arc-en-ciel sont gardées pour ouvrir les nouvelles zones.");
  M.PRIX_CHANGES = "Les prix de la boutique ont changé !";

  // ---------------------------------------------------------------- 1. les réserves
  // à droite du compteur (960 à 1130, en haut) : deux cases de 68 × 100 px logiques (cibles d'au moins 64 px), l'étoile en haut,
  // son nombre dessous ; une réserve vide n'est pas montrée, la suivante prend sa place
  M.CASE = { x: 1136, y: 22, w: 68, h: 100, pas: 72 };
  M.centre = (k) => [M.CASE.x + k * M.CASE.pas + M.CASE.w / 2, M.CASE.y + 34];
  M.reserves = async (app, { arc = 0, diamant = 0, sombre = false } = {}) => {
    const R = await imp("js/art/runtime.js"), { spriteBox, onBrief } = await imp("js/engine/ui.js");
    document.querySelectorAll(".maquette-reserve").forEach((e) => e.remove());
    const st = { arc, diamant }, els = {};
    const peindre = (kind) => (ctx, px) => {
      const q = app.sprites.frame(kind === "arc" ? "etoile.arc" : "etoile.diamant", 0), k = kind === "arc" ? 0.6 : 0.56, cx = M.CASE.w / 2, cy = 34;
      if (sombre) { ctx.setTransform(px, 0, 0, px, 0, 0); R.drawPanel(ctx, 2, 4, M.CASE.w - 4, M.CASE.h - 8); ctx.setTransform(1, 0, 0, 1, 0, 0); }
      if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, cx * px + q.dx * k, cy * px + q.dy * k, q.w * k, q.h * k);
      ctx.setTransform(px, 0, 0, px, 0, 0);
      const s = String(st[kind]), t = s.length > 1 ? 28 : 32; R.drawNumber(ctx, s, cx, 62 + (32 - t) / 2, t, { w: 4.8, seed: kind === "arc" ? 921 : 922 });
    };
    const placer = () => { let k = 0; for (const kind of ["arc", "diamant"]) { const e = els[kind]; e.style.display = st[kind] > 0 ? "" : "none"; if (st[kind] > 0) { e.style.left = `${M.CASE.x + k * M.CASE.pas}px`; e.k = k; k++; } } };
    for (const kind of ["arc", "diamant"]) {
      const e = spriteBox(app, { x: M.CASE.x, y: M.CASE.y, w: M.CASE.w, h: M.CASE.h, cls: `bubble reserve maquette-reserve ${kind}`, label: kind === "arc" ? "étoiles arc-en-ciel" : "étoiles de diamant", paint: peindre(kind) });
      e.style.background = "none"; e.style.border = "none"; e.style.boxShadow = "none";
      onBrief(app, e, () => { e.classList.remove("pop"); void e.offsetWidth; e.classList.add("pop"); M.toucher(app, kind); }, null);
      els[kind] = e;
    }
    placer();
    M.etat = { st, els, placer, set: (kind, n) => { st[kind] = n; els[kind].repaint(); placer(); } };
    return M.etat;
  };
  // ce que dit la mascotte quand on touche une réserve (calculé d'après la sauvegarde de l'application)
  M.etatArc = (app) => {
    const r = app.rewards, fermees = r.c.zones.filter((z) => !r.zones.ouvertes.includes(z.id)).length, last = r.zones.ouvertes.at(-1);
    const zonePrete = fermees > 0 && r.c.cartes.filter((c) => c.zone === last && c.rarete !== "legendaire").every((c) => r.owned[c.id]);
    return { n: M.etat?.st.arc ?? r.arcDispo, fermees, zonePrete };
  };
  M.etatDiamant = (app) => {
    const r = app.rewards, leg = r.c.cartes.find((c) => c.rarete === "legendaire" && !r.owned[c.id]);
    return { n: M.etat?.st.diamant ?? r.doreesDispo, legendaireMaintenant: !!r.goldenCard?.(), zoneLegendaire: !leg ? null : leg.zone === "large" ? "du grand large" : "des abysses" };
  };
  M.toucher = (app, kind) => {
    const t = kind === "arc" ? M.phraseArc(M.etatArc(app)) : M.phraseDiamant(M.etatDiamant(app));
    app.voice.stop(); app.bulle.ancrer(null);
    // (la bulle part de la mascotte et évite la réserve touchée : engine/bulle.js, eviter)
    app.bulle.eviter?.("reserve", M.etat.els[kind]);
    app.voice.say(t);
    return t;
  };

  // ---------------------------------------------------------------- 2. la boutique
  // une créature du récif touchée (la tuile choisie par l'application) : on y ajoute ce que le lot propose.
  // `facon` : « deux » (assez d'étoiles de mer et une étoile arc-en-ciel à dépenser : deux coches), « arc » (pas assez d'étoiles de
  // mer : la seule coche arc-en-ciel), « gardee » (l'étoile arc-en-ciel gardée pour la prochaine zone)
  M.boutique = async (app, { facon = "deux", gardees = 1 } = {}) => {
    const { bulleTuile } = await imp("js/session/selection.js"), { fill } = await imp("js/modules/numberline/screen.js");
    const B = app.boutique, b = B.sel, c = b.carte, cout = app.rewards.cout(c.id, "terne"), px = app.stage.px, T = app.text.data;
    document.querySelectorAll(".maquette-conf, .maquette-badge").forEach((e) => e.remove());
    // le badge de la tuile choisie, en haut à droite : l'étoile arc-en-ciel (avec le cadenas quand elle est gardée)
    const badge = document.createElement("canvas"), S = 54; badge.className = "maquette-badge"; badge.width = badge.height = Math.round(S * px);
    Object.assign(badge.style, { position: "absolute", right: "-12px", top: "-14px", width: `${S}px`, height: `${S}px`, pointerEvents: "none" });
    const bc = badge.getContext("2d"), dessine = (name, x, y, k) => { const q = app.sprites.frame(name, 0); if (q) bc.drawImage(q.img, q.sx, q.sy, q.w, q.h, x * px + q.dx * k, y * px + q.dy * k, q.w * k, q.h * k); };
    if (facon === "gardee") bc.filter = "saturate(0.55) brightness(0.95)";
    dessine("etoile.arc", S / 2, S / 2, 0.62); bc.filter = "none";
    if (facon === "gardee") dessine("boutique.cadenas", S / 2 + 12, S / 2 + 12, 0.62);
    b.append(badge);
    // les coches : celle des étoiles de mer porte l'étoile de mer, celle de l'étoile arc-en-ciel porte l'étoile arc-en-ciel
    const [croix, coche] = B.conf, CONF = 88, GAP = 18;
    const porter = (btn, name, k) => { const s = document.createElement("canvas"), S2 = 52; s.className = "maquette-badge"; s.width = s.height = Math.round(S2 * px); Object.assign(s.style, { position: "absolute", right: "-14px", bottom: "-12px", width: `${S2}px`, height: `${S2}px`, pointerEvents: "none" }); const q = app.sprites.frame(name, 0), x = s.getContext("2d"); if (q) x.drawImage(q.img, q.sx, q.sy, q.w, q.h, (S2 / 2) * px + q.dx * k, (S2 / 2) * px + q.dy * k, q.w * k, q.h * k); btn.append(s); return s; };
    const nom = fill(T.carteNouvelle, { nom: c.nomLu ?? c.nom }), briller = fill(T.boutique.briller, { n: cout });
    let t, boutons;
    if (facon === "gardee") {
      t = [nom, T.boutique.dejaLa, briller, M.GARDEE(gardees), app.rewards.total >= cout ? T.boutique.daccord : fill(T.boutique.manque, { n: cout - app.rewards.total })].join(" ");
      porter(coche, "etoile", 0.5);
      boutons = app.rewards.total >= cout ? [croix, coche] : [];
    } else {
      const arcBtn = coche.cloneNode(false); arcBtn.className = "bubble boutique-conf coche maquette-conf invite"; arcBtn.setAttribute("aria-label", "faire briller avec une étoile arc-en-ciel");
      const cv = document.createElement("canvas"); cv.width = cv.height = Math.round(CONF * px); arcBtn.append(cv);
      const q = app.sprites.frame("boutique.coche", 0), x = cv.getContext("2d"); if (q) x.drawImage(q.img, q.sx, q.sy, q.w, q.h, (CONF / 2 - 2) * px + q.dx * 1.05, (CONF / 2 - 2) * px + q.dy * 1.05, q.w * 1.05, q.h * 1.05);
      coche.parentNode.append(arcBtn); porter(arcBtn, "etoile.arc", 0.62);
      if (facon === "deux") { porter(coche, "etoile", 0.5); boutons = [croix, coche, arcBtn]; t = [nom, T.boutique.dejaLa, briller, M.OU_ARC, M.CHOISIS].join(" "); }
      else { coche.style.visibility = "hidden"; boutons = [croix, arcBtn]; t = [nom, T.boutique.dejaLa, briller, M.OU_ARC, T.boutique.daccord].join(" "); }
    }
    // la rangée de coches, sous la tuile (au-dessus pour la dernière rangée), gardée dans l'écran
    if (boutons.length) {
      const [x0, y0, x1, y1] = [b.offsetLeft, b.offsetTop, b.offsetLeft + b.offsetWidth, b.offsetTop + b.offsetHeight], l = boutons.length * CONF + (boutons.length - 1) * GAP;
      const mid = (x0 + x1) / 2, X = mid + 14 + l <= 1272 ? mid + 14 : Math.max(8, mid - 14 - l), Y = y1 + CONF + 4 > 800 ? y0 - CONF + 22 : y1 + 2;
      boutons.forEach((k, i) => Object.assign(k.style, { left: `${X + i * (CONF + GAP)}px`, top: `${Y}px`, visibility: "visible", width: `${CONF}px`, height: `${CONF}px` }));
    } else B.conf.forEach((k) => { k.style.visibility = "hidden"; });
    app.voice.stop();
    bulleTuile(app, b, B.tuiles, t, { commandes: ".boutique-retour, .boutique-onglet, .boutique-conf, .maquette-reserve" });
    app.voice.say(t, { instruction: true });
    return t;
  };
  // faire briller avec l'étoile arc-en-ciel : l'étoile part de sa réserve et vole jusqu'à la tuile (la réserve descend d'un cran),
  // puis la gerbe et le reflet, comme « faire briller » aujourd'hui. `t` : la fraction du vol (pour une capture), ou null : tout
  M.brillerArc = async (app, { arret = null } = {}) => {
    const B = app.boutique, b = B.sel, r = b.getBoundingClientRect(), s = app.stage.ui.getBoundingClientRect(), k0 = app.stage.ui.offsetWidth / s.width;
    const cible = [(r.left + r.width / 2 - s.left) * k0, (r.top + r.height / 2 - s.top) * k0], de = M.centre(M.etat.els.arc.k ?? 0);
    return M.vol(app, "etoile.arc", de, cible, { arret, k: 0.6, avant: () => M.etat.set("arc", M.etat.st.arc - 1) });
  };

  // ---------------------------------------------------------------- un vol d'étoile (de la réserve, ou vers elle)
  // composé par le navigateur, comme les étoiles arc-en-ciel d'aujourd'hui (session/screens.js, flyRainbowStars) ; `arret` : figé à
  // cette fraction du trajet (les captures)
  M.vol = async (app, name, [x0, y0], [x1, y1], { arret = null, k = 0.7, avant = null, apres = null, delai = 0 } = {}) => {
    const { spriteBox } = await imp("js/engine/ui.js"), S = 130;
    const el = spriteBox(app, { x: x0 - S / 2, y: y0 - S / 2, w: S, h: S, cls: "hud special maquette-vol", still: true, paint: (ctx, px) => { const q = app.sprites.frame(name, 0); if (q) ctx.drawImage(q.img, q.sx, q.sy, q.w, q.h, (S / 2) * px + q.dx * k, (S / 2) * px + q.dy * k, q.w * k, q.h * k); } });
    avant?.();
    const mx = (x0 + x1) / 2 + (x1 > x0 ? -80 : 80), my = Math.min(y0, y1) - 70, kf = [];
    for (let j = 0; j <= 16; j++) { const u = j / 16, x = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u * u * x1, y = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * my + u * u * y1; kf.push({ transform: `translate(${x - x0}px, ${y - y0}px) rotate(${u * 200}deg) scale(${1 - 0.35 * u})` }); }
    const a = el.animate(kf, { duration: 1000, delay: delai, easing: "cubic-bezier(.45,.05,.55,.95)", fill: "forwards" });
    if (arret !== null) { a.pause(); a.currentTime = delai + 1000 * arret; return el; }
    await a.finished; el.remove(); apres?.(); return null;
  };

  // ---------------------------------------------------------------- 3. la récompense
  // le bilan de la séance (le dessin de l'application), la grande étoile de diamant gagnée, puis les étoiles qui volent jusqu'à
  // leur réserve ; `arret` : la fraction du vol à figer pour une capture
  M.recompense = async (app, { etoiles = 34, arcs = 2, diamant = true, arret = 0.55, phrase = null } = {}) => {
    const R = await imp("js/art/runtime.js"), { spriteBox } = await imp("js/engine/ui.js");
    const tally = spriteBox(app, { x: 720 - 210, y: 300 - 115, w: 430, h: 240, cls: "hud tally maquette-vol", still: true, paint: (ctx, px) => { app.sprites.draw(ctx, "bilan", 0, 210, 115); ctx.setTransform(px, 0, 0, px, 0, 0); R.drawNumber(ctx, String(etoiles), 282, 70, 92, { w: 12, seed: 810 }); } });
    void tally;
    app.ocean.mascotte.play("rejouir", { fort: true });
    const T = app.text.data;
    if (phrase) app.voice.say(phrase);
    else app.voice.say(arcs === 1 ? T.etoileArc : T.etoilesArc.replace("{n}", arcs));
    const vols = [];
    for (let i = 0; i < arcs; i++) vols.push(M.vol(app, "etoile.arc", [640 + (i - (arcs - 1) / 2) * 120, 520], M.centre(0), { arret: arret === null ? null : Math.max(0, arret - i * 0.14), k: 0.62 }));
    if (diamant) vols.push(M.vol(app, "etoile.diamant", [640 + (arcs / 2 + 0.6) * 120, 500], M.centre(1), { arret: arret === null ? null : Math.max(0, arret - 0.3), k: 0.9 }));
    return Promise.all(vols);
  };
})();
