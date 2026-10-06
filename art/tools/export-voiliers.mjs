// LE JEU DES VOILIERS DANS L'APPLICATION (docs/SPEC.md, section 7 bis ; décision du parent du 6 octobre 2026, lot « Les
// voiliers »). Le jeu est la maquette art/voiliers/index.html, validée par le parent, intégrée telle quelle : on ne la
// réécrit pas, on la transporte. Cet outil, sans jamais modifier la maquette :
//   1. sort ses images (embarquées en base64 : bateaux, cartes des bateaux, bouées, ciel, nuages, côte) dans
//      app/assets/voiliers/ (un fichier par image, au format d'origine) et leurs réglages dans app/assets/voiliers/donnees.json ;
//   2. fabrique app/js/voiliers/voiliers-scene.js : le script de la maquette lui-même (la mer en WebGL, les bateaux, les
//      bouées, la houle, le vent, les pirates, le recul de la caméra du double encadrement, le geste), enveloppé dans une
//      fonction `startVoiliers(OPTS)`, avec ses seuls raccords à l'application retouchés (RETOUCHES et SECTIONS
//      ci-dessous) : l'écran et ses canvas, le temps (qui s'arrête pendant la pause), le toucher, la place du bateau qui
//      attend (à droite du centre : la bulle de la mascotte, en haut à gauche, ne cache jamais la voile), la séance (la
//      maquette enchaînait seule les bateaux et ses niveaux ; ici, c'est l'application qui dit quel bateau arrive, avec
//      quel nombre, sur quelle mer, et ce qu'il fait après le geste de l'enfant). La bulle, la mascotte, le panneau de
//      réglage, les pastilles et l'écran « Jouer » de la maquette disparaissent : l'application a les siens.
// Chaque retouche doit trouver son texte exactement une fois : si la maquette change, l'export échoue au lieu de
// produire un module faux. Une seconde fabrication doit donner les mêmes octets (contrôlé ici).
//
//   node tools/export-voiliers.mjs
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const HERE = resolve(new URL(".", import.meta.url).pathname, "..");
const MAQUETTE = join(HERE, "voiliers/index.html"), APP = resolve(HERE, "../app");
const OUT_IMG = join(APP, "assets/voiliers"), OUT_JS = join(APP, "js/voiliers/voiliers-scene.js");

// les raccords : [ce que dit la maquette, ce que dit l'application, pourquoi]
const RETOUCHES = [
  ["const $=id=>document.getElementById(id);\n", "", "aucun élément de la page de la maquette"],
  ["const stage=$('stage'),cs=$('gl'),cb=$('gs'),fx=$('fx'),c2=fx.getContext('2d');", "const stage=OPTS.racine,cs=OPTS.gl,cb=OPTS.gs,fx=OPTS.fx,c2=fx.getContext('2d');", "les canvas sont fournis par l'application, la scène est la sienne"],
  ["if(!gl||!gb||!gl.getExtension('OES_standard_derivatives')){$('err').style.display='grid';return;}", "if(!gl||!gb||!gl.getExtension('OES_standard_derivatives')){OPTS.sansWebGL?.();return null;}", "sans WebGL, l'application le sait (le jeu ne peut pas se jouer)"],
  ["let SEA=.6,SEA_T=.6,QUAL=1,T=0;", "let SEA=.6,SEA_T=.6,QUAL=OPTS.qualite??1,T=0;const VIT={k:1};let OLD=null,ATTENTE=null,REDESSINE=true;", "la qualité de la mer de départ (allègement) ; la vitesse des corrections ; le bateau qui s'en va ; le geste attendu"],
  ["function fit(){const W=innerWidth,H=innerHeight;scale=Math.min(W/1280,H/800);\n stage.style.transform=`translate(${(W-1280*scale)/2}px,${(H-800*scale)/2}px) scale(${scale})`;\n", "function fit(){scale=OPTS.echelle();REDESSINE=true;\n", "la taille de la scène est celle de l'application (elle la met à l'échelle de l'écran)"],
  ["addEventListener('resize',fit);fit();", "OPTS.on(window,'resize',fit);fit();", "écouteurs de la fenêtre retirés en sortant"],
  ["const LINE_Y=690,WAIT={x:430,y:410},AUTO_Y0=405;", "const LINE_Y=690,WAIT={x:OPTS.attente?.x??430,y:OPTS.attente?.y??410},AUTO_Y0=405;", "le bateau attend à droite du centre (décision du parent du 6 octobre 2026 : la mascotte et sa bulle sont en haut à gauche)"],
  ["function tween(o,to,dur,ease,done){o.tw={from:{x:o.x,y:o.y},to,t0:T,dur:dur/1000,", "function tween(o,to,dur,ease,done){o.tw={from:{x:o.x,y:o.y},to,t0:T,dur:dur/1000/VIT.k,", "les corrections et les exemples vont à la vitesse de l'application (vitesseAnimations) ; « passer » les termine vite"],
  ["function startPirates(){P=newShip('pirate');P.vis=true;P.x=1420;P.y=AUTO_Y0-95;P.mode='chase';P.deadline=T+G.windDur/1.3/1000;}", "function startPirates(){P=newShip('pirate');P.vis=true;P.x=1420;P.y=AUTO_Y0-95;P.mode='chase';P.deadline=T+G.windDur/(OPTS.piratesK??1.3)/1000;}", "les pirates : leur avance sur le vent vient de module4.json"],
  ["gb.uniform4f(ub('uNumRect'),...slotRect(0));}", "gb.uniform4f(ub('uNumRect'),...slotRect(o.slot??0));}", "deux bateaux de l'enfant peuvent être à l'eau (celui qui s'en va, celui qui arrive) : chacun son nombre"],
  ["stage.addEventListener('pointerdown',e=>{\n if(!['wait'].includes(B.mode))return;", "OPTS.on(stage,'pointerdown',e=>{\n if(!OPTS.toucher(e)||!['wait'].includes(B.mode))return;", "le toucher : pas pendant la pause, pas à travers un bouton ; écouteur retiré en sortant"],
  ["addEventListener('pointermove',e=>{", "OPTS.on(window,'pointermove',e=>{", "écouteur retiré en sortant"],
  [" if(B.y>LINE_Y-48) evaluate(chenalAt(B.x)); else B.mode='wait';}", " if(B.y>LINE_Y-48) lacher(chenalAt(B.x)); else B.mode='wait';}", "le bateau lâché dans un passage : l'application juge"],
  ["addEventListener('pointerup',release);addEventListener('pointercancel',release);", "OPTS.on(window,'pointerup',release);OPTS.on(window,'pointercancel',release);", "écouteurs retirés en sortant"],
  ["$('replay').addEventListener('click',()=>{if(B.num!=null)say(numLine(B.num),CONSIGNE);});\n", "", "« réécouter » est celui de l'application"],
  [" stepTween(B);\n", " stepTween(B);if(OLD){stepTween(OLD);if(OLD.vis)rideWaves(OLD,T,dt);else OLD=null;}\n", "le bateau rangé finit de s'en aller pendant que le suivant arrive"],
  ["B.y=Math.min(B.y,LINE_Y+10);drag=null;evaluate(chenalAt(B.x));}", "B.y=Math.min(B.y,LINE_Y+10);drag=null;lacher(chenalAt(B.x));}", "le vent a poussé le bateau dans un passage : l'application juge"],
  ["const sailing=B.mode==='enter'||B.mode==='pass'||B.mode==='travel'||", "const sailing=B.mode==='enter'||B.mode==='pass'||B.mode==='travel'||B.mode==='auto'||", "le bateau qui va seul au bon passage navigue (voiles gonflées, sillage)"],
  ["if(P.mode==='chase'&&B.mode!=='pass'&&B.mode!=='sink'){", "if(P.mode==='chase'&&(B.mode==='wait'||B.mode==='drag')){", "les pirates ne rattrapent pas un bateau déjà lâché, que l'application juge"],
  ["P.mode='board';drag=null;G.attempts++;sinkBoat('Les pirates ont rattrapé le bateau !','Il fallait le mettre à l’abri plus vite.');}", "P.mode='board';drag=null;rattrape();}", "le bateau rattrapé : l'application le dit, puis le fait couler"],
  [" if(B.vis)list.push({y:1e4,f:()=>drawBoatSprite(B)});", " if(OLD&&OLD.vis)list.push({y:1e4-1,f:()=>drawBoatSprite(OLD)});\n if(B.vis)list.push({y:1e4,f:()=>drawBoatSprite(B)});", "le bateau qui s'en va est dessiné lui aussi"],
  ["function frame(now){\n const tNow=window.__T!=null?window.__T:now/1000;const dt=clamp(tNow-T,0,.1);T=tNow;\n update(dt||.016);render();NFR++;\n fpsN++;if(now-fpsT>1000){FPS=Math.round(fpsN*1000/(now-fpsT));fpsN=0;fpsT=now;if(!$('panel').hidden)$('pperf').textContent=`(${FPS} images/s)`;}\n requestAnimationFrame(frame);}",
    "function frame(now){\n if(!VIVANT)return;RAF=requestAnimationFrame(frame);\n if(OPTS.fige?.()){if(REDESSINE){REDESSINE=false;render();}return;}REDESSINE=false;OPTS.mesure?.(now);\n const tNow=OPTS.temps(now);const dt=clamp(tNow-T,0,.1);T=tNow;\n update(dt||.016);render();NFR++;\n fpsN++;if(now-fpsT>1000){FPS=Math.round(fpsN*1000/(now-fpsT));fpsN=0;fpsT=now;}\n}",
    "le temps est celui de l'application : il s'arrête pendant la pause (tout s'arrête : la houle, le vent, les pirates) ; l'animation s'arrête en sortant ; le temps d'image est mesuré"],
];
// les sections remplacées en entier (entre deux bannières de la maquette) : [titre de la section, texte de l'application, pourquoi]
const SECTIONS = [
  ["HUD", "/* ---- HUD : la bulle et la mascotte de la maquette sont celles de l'application (engine/bulle.js, engine/mascotte.js) */\n", "la bulle et la mascotte sont celles de l'application"],
  ["FLOW", null, "la séance : l'application dit quel bateau arrive et ce qu'il fait (RACCORDS, ci-dessous)"],
  ["PARENT PANEL", "", "le panneau de réglage de la maquette disparaît (docs/SPEC.md, section 7 bis)"],
  ["START", null, "le démarrage : l'animation, et l'interface rendue à l'application"],
];
// LA SÉANCE, CÔTÉ SCÈNE. Ce qui remplace la section FLOW de la maquette : ses gestes (l'arrivée du bateau, le passage, le
// retour au calme, la rafale, les pirates qui l'abordent et le font couler, le recul de la caméra du double encadrement)
// sont repris ligne à ligne de ses fonctions newBoat, evaluate, sinkBoat et startTravel, mais c'est l'application qui les
// déclenche, un par un, et qui attend leur fin (des promesses) ; elle ajoute le bateau qui va seul au bon passage
// (exemple guidé, deuxième erreur, « je ne sais pas »).
const RACCORDS = String.raw`/* =====================================================================================
   RACCORDS AVEC L'APPLICATION (art/tools/export-voiliers.mjs) : l'application conduit la partie
   ===================================================================================== */
const MERS={calme:1,vent:2,pirates:3};
let JETON=0,FENTE=0;
// un délai en temps du jeu (il s'arrête pendant la pause), annulé si la scène s'arrête
function apres(ms,f){const j=JETON;later.push({t:T+ms/1000/VIT.k,f:()=>{if(j===JETON)f();},any:true});}
// le geste de l'enfant (ou le vent, ou les pirates) : l'application l'attend
function lacher(c){B.mode='juge';G.zoneOn=0;const r=ATTENTE;ATTENTE=null;r&&r({c});}
function rattrape(){B.mode='juge';const r=ATTENTE;ATTENTE=null;r&&r({rattrape:true});}
function seaFor(mv){return[0,.6,1,1.25][mv];}
const sameRow=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const API={
  // la rangée de bouées du bateau ; nouvelle : l'ancienne s'efface et la nouvelle apparaît (comme la maquette)
  bouees(vals){
    const row2=BU.some(b=>b.row===2);
    if(BU.length&&!row2&&G.stage===1&&sameRow(G.buoys,vals))return Promise.resolve();
    G.row1=vals.slice();
    // le double encadrement : la première rangée revient à la ligne des bouées, sans attendre (maquette, newBoat)
    if(row2&&sameRow(G.row1,BU.filter(b=>b.row===1).map(b=>b.val))){G.stage=1;G.buoys=vals.slice();BU.forEach(b=>b.fade=-1);addRow(G.buoys,1,Z_LINE-ZC,true);return Promise.resolve();}
    const had=BU.length;BU.forEach(b=>b.fade=-1);
    return new Promise(res=>apres(had?500:0,()=>{G.stage=1;G.buoys=vals.slice();addRow(G.buoys,1,Z_LINE-ZC,true);res();}));
  },
  // la mer (calme, vent, pirates)
  mer(m){G.mv=MERS[m]??1;SEA_T=seaFor(G.mv);},
  // un bateau arrive avec son nombre (maquette, newBoat) ; au calme, il attend au point d'attente, touchable ; avec le vent
  // et les pirates, il s'arrête au-dessus d'un mauvais passage (à droite si possible : la bulle est à gauche) et ne part
  // qu'à partir() (la consigne dite)
  arrivee({num}){
    G.epoch++;
    let type;do{type=pick(PLAYER_BOATS);}while(type===G.lastType);G.lastType=type;
    if(B.vis&&B.mode==='pass')OLD=B;
    B=newShip(type);B.vis=true;B.num=num;B.slot=FENTE=FENTE?0:10;G.v=num;G.s1ok=false;
    paintNumber(B.slot,num,BOATDEF[type].meta.plate?'plate':'sail',quadAspect(BOATDEF[type].meta.num));
    BU.forEach(b=>b.lit=0);SEA_T=seaFor(G.mv);
    B.x=1460;B.y=300;B.mode='enter';
    let target;
    if(G.mv===1) target={x:WAIT.x,y:WAIT.y};
    else{const n=G.buoys.length,k=G.buoys.filter(x=>x<num).length,wrong=[...Array(n+1).keys()].filter(c=>c!==k),droite=wrong.filter(c=>zoneCenter(c)>=(OPTS.attenteXMin??0));target={x:zoneCenter(pick(droite.length?droite:wrong)),y:AUTO_Y0};}
    if(G.mv!==3&&P.vis&&P.mode!=='leave'){P.mode='leave';}
    return new Promise(res=>tween(B,target,2200,p=>1-Math.pow(1-p,2.2),()=>{B.mode=G.mv===1?'wait':'tenu';res();}));
  },
  // la consigne est dite : le vent pousse, les pirates partent en chasse
  partir(){if(B.mode==='tenu')B.mode='wait';if(G.mv===3&&B.mode==='wait'&&!(P.vis&&P.mode==='chase'))startPirates();},
  // le geste attendu : { c } (le passage où le bateau a été lâché, ou poussé par le vent) ou { rattrape: true }
  attendreLacher(){return new Promise(res=>{ATTENTE=res;});},
  // les bouées de la rangée en cours, allumées (leurs rangs)
  allumer(rangs){BU.forEach(x=>x.lit=0);activeBU().forEach((x,i)=>x.lit=rangs.includes(i)?1:0);},
  // le bon passage : le bateau passe et s'en va (maquette, evaluate) ; la promesse se tient quand il a franchi la ligne
  passe(k){
    B.mode='pass';BU.forEach(x=>x.lit=0);if(G.mv===3&&P.vis)P.mode='leave';
    const b=B,x=zoneCenter(k);
    return new Promise(res=>tween(b,{x,y:LINE_Y+30},700,p=>p,()=>{res();tween(b,{x:x-260,y:1060},1700,p=>p*p,()=>{b.vis=false;});}));
  },
  // une erreur au calme : le bateau revient attendre ; au vent : une rafale le repousse (il repart à partir())
  revenir(){B.mode='return';const w=G.stage===2?G.wait2:WAIT;return new Promise(res=>tween(B,{x:w.x,y:w.y},1300,undefined,()=>{B.mode='wait';res();}));},
  rafale(){B.mode='gust';B.gustT=T;return new Promise(res=>tween(B,{x:B.x,y:G.stage===2?G.wait2.y:AUTO_Y0},1500,p=>1-Math.pow(1-p,3),()=>apres(400,()=>{B.mode='tenu';res();})));},
  // les pirates l'abordent, il coule (maquette, sinkBoat)
  couler(){
    B.mode='sink';
    if(!P.vis){P=newShip('pirate');P.vis=true;P.x=1420;P.y=AUTO_Y0-95;}
    P.mode='board';const tgt=pirTarget();
    return new Promise(res=>tween(P,tgt,600,p=>p*p,()=>{B.sinkT=T;apres(3600,()=>{B.vis=false;P.mode='leave';BU.forEach(x=>x.lit=0);res();});}));
  },
  // le bateau va seul jusqu'au bon passage, au bord de la ligne des bouées (puis passe(k))
  guider(k){
    B.mode='auto';drag=null;BU.forEach(x=>x.lit=0);if(P.vis&&P.mode!=='leave')P.mode='leave';
    return new Promise(res=>tween(B,{x:zoneCenter(k),y:LINE_Y-70},1600,undefined,res));
  },
  // le double encadrement : la bonne centaine franchie, la caméra recule, la rangée des dizaines apparaît (maquette, startTravel)
  traversee(row2){
    const v=B.num,b=G.buoys,k=b.filter(x=>x<v).length;
    B.mode='travel';BU.forEach(x=>x.lit=0);if(G.mv===3&&P.vis)P.mode='leave';
    const x=zoneCenter(k);
    return new Promise(res=>tween(B,{x,y:LINE_Y+30},700,p=>p,()=>{
      const w=toWorld(B.x,B.y);B.wx=w.x;B.wz=w.z-ZC;
      addRow(row2,2,Z_LINE-ZC-PULL,false);
      const e2=[0,...row2.map((_,i)=>1280*(i+1)/6),1280],kk=row2.filter(x=>x<v).length,wrong=[0,1,2,3,4,5].filter(c=>c!==kk),droite=wrong.filter(c=>(e2[c]+e2[c+1])/2>=(OPTS.attenteXMin??0)),cw=pick(droite.length?droite:wrong);
      const xc=clamp((e2[cw]+e2[cw+1])/2,170,1060);B.wx0=B.wx;B.wxT=(xc-640)/F*(B.wz+ZC+PULL);
      G.travel={t0:T,dur:2.6,z0:ZC,z1:ZC+PULL,done:()=>{
        G.stage=2;G.buoys=row2.slice();G.travel=null;G.wait2={x:B.x,y:B.y};
        BU.filter(x=>x.row===1).forEach(x=>x.lit=0);
        B.mode=G.mv===1?'wait':'tenu';res();}};}));
  },
  // la vitesse des gestes (1 : celle de la maquette)
  vitesse(k){VIT.k=k;},
  // la qualité de la mer (0 économe, 1 normale, 2 fine : la maquette)
  qualite(q){if(q!==QUAL){QUAL=q;fit();}},
  get qual(){return QUAL;},
  // où est le bateau de l'enfant (pour la bulle, qui ne le couvre jamais) : là où il va s'il arrive
  zoneBateau(){if(!B.vis)return null;const t=B.tw&&B.mode==='enter'?B.tw.to:B,s=boatK(t.y)/.44;return[t.x-190*s,t.y-330*s,t.x+200*s,t.y+55*s];},
  // pour les parcours : poser le bateau dans le passage c, comme le doigt
  deposer(c){if(B.mode!=='wait')return false;B.x=zoneCenter(c);B.y=LINE_Y-20;drag=null;lacher(chenalAt(B.x));return true;},
  etat(){return{mode:B.mode,vis:B.vis,x:B.x,y:B.y,k:B.k,num:B.num,bouees:G.buoys.slice(),rangee:G.stage,xs:xsOf(),LINE_Y,mer:G.mv,pirates:P.vis?P.mode:null,allumees:activeBU().map(b=>b.lit),images:pending,qualite:QUAL,ZC,depart:OLD?OLD.vis:false};},
  centre:k=>zoneCenter(k),
  chenal:x=>chenalAt(x),
  pret(){return new Promise(res=>{const t=()=>pending>0?setTimeout(t,50):res();t();});},
  redessiner(){REDESSINE=true;},
  resize(){fit();},
  stop(){VIVANT=false;JETON++;cancelAnimationFrame(RAF);ATTENTE=null;for(const c of [gl,gb]){try{c.getExtension('WEBGL_lose_context')?.loseContext();}catch(e){void e;}}},
};
`;
const DEMARRAGE = "G.windDur=OPTS.ventMs??7000;\nRAF=requestAnimationFrame(frame);\nreturn API;\n";

// une section de la maquette : de sa bannière (« /* ==== … NOM … */ », ou « /* ---- NOM */ ») à la bannière suivante
function section(js, nom) {
  const ban = nom === "HUD" ? "/* ---- HUD */" : `/* =====================================================================================\n   ${nom}\n`;
  const i = js.indexOf(ban); if (i < 0 || js.indexOf(ban, i + 1) >= 0) throw new Error(`export-voiliers : section ${nom} introuvable ou en double ; la maquette a changé`);
  const j = js.indexOf("/* =====================================================================================\n", i + 4);
  return [i, j < 0 ? js.length : j];
}

export function exportVoiliers({ log = console.log, ecrire = true } = {}) {
  const html = readFileSync(MAQUETTE, "utf8"), empreinte = createHash("sha256").update(html).digest("hex").slice(0, 12);
  const m = html.match(/<script>\n([\s\S]*?)\n<\/script>/); if (!m) throw new Error("export-voiliers : script de la maquette introuvable");
  let js = m[1];
  if (!js.startsWith("(function(){\n") || !js.endsWith("\n})();")) throw new Error("export-voiliers : le script de la maquette n'est plus une fonction anonyme");
  js = js.slice("(function(){\n".length, -"\n})();".length);
  // 1. les images, sorties des données
  const ecrits = new Map(), donnees = {};
  const nom = (p) => p.join("-").replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  const sortir = (v, path) => {
    if (typeof v === "string" && v.startsWith("data:image/")) {
      const [, type, b64] = v.match(/^data:image\/([a-z+]+);base64,(.*)$/), ext = type === "jpeg" ? "jpg" : type.replace("+xml", "");
      const f = `${nom(path)}.${ext}`; if (ecrits.has(f)) throw new Error(`export-voiliers : deux images nommées ${f}`);
      ecrits.set(f, Buffer.from(b64, "base64"));
      return `assets/voiliers/${f}`;
    }
    if (Array.isArray(v)) return v.map((x, i) => sortir(x, [...path, String(i)]));
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, sortir(x, [...path, k])]));
    return v;
  };
  for (const [k, prefixe] of [["ASSETS", []], ["SKY", ["ciel"]]]) {
    const re = new RegExp(`^const ${k}=(\\{.*\\});$`, "m"), d = js.match(re);
    if (!d) throw new Error(`export-voiliers : données ${k} introuvables`);
    donnees[k] = sortir(JSON.parse(d[1]), prefixe);
    js = js.replace(re, () => `const ${k}=OPTS.donnees.${k};`);
  }
  // 2. les raccords
  for (const [a, b, pourquoi] of RETOUCHES) {
    const n = js.split(a).length - 1; if (n !== 1) throw new Error(`export-voiliers : retouche « ${pourquoi} » : ${n} occurrence(s) au lieu d'une ; la maquette a changé`);
    js = js.replace(a, () => b);
  }
  // les sections, de la dernière à la première (les indices restent justes)
  const places = SECTIONS.map(([n, txt, pourquoi]) => ({ n, txt, pourquoi, at: section(js, n) })).sort((x, y) => y.at[0] - x.at[0]);
  for (const s of places) js = js.slice(0, s.at[0]) + (s.n === "FLOW" ? RACCORDS : s.n === "START" ? DEMARRAGE : s.txt) + js.slice(s.at[1]);
  // plus rien de la page de la maquette (ses éléments, sa bulle, sa mascotte, ses crochets d'essai)
  for (const [re, quoi] of [[/\$\(['"]/, "un élément de la page de la maquette"], [/document\.getElementById/, "un élément de la page de la maquette"], [/\bMASC\b|\bsay\(|\bevaluate\(|\bsinkBoat\(|\bnewBoat\(|\bupdatePanel\(|window\.__/, "un reste de la séance de la maquette"], [/(^|[^.\w])addEventListener\(/m, "un écouteur de la fenêtre qui ne serait pas retiré"]]) {
    const x = js.match(re); if (x) throw new Error(`export-voiliers : ${quoi} reste : ${js.slice(Math.max(0, x.index - 40), x.index + 60)}`);
  }
  const module = `// FICHIER GÉNÉRÉ par art/tools/export-voiliers.mjs depuis art/voiliers/index.html (empreinte ${empreinte}) : ne pas
// modifier à la main. Le script de la maquette du jeu des voiliers, tel quel, enveloppé dans startVoiliers ; ses raccords
// à l'application sont décrits dans l'outil (RETOUCHES, SECTIONS, RACCORDS). Les images sont dans assets/voiliers/.
//
// OPTS : { racine : la scène (#stage) ; gl, gs, fx : les trois canvas (la mer, les bateaux et les bouées, les effets) ;
// donnees : assets/voiliers/donnees.json ; echelle() : px d'écran par px de la scène ; temps(now) : le temps du jeu en s
// (il s'arrête pendant la pause) ; fige() : la scène est-elle en pause ; toucher(e) : ce toucher peut-il prendre le
// bateau ; on(cible, type, f, o) : un écouteur à retirer en sortant ; attente : le point d'attente du bateau ;
// attenteXMin : avec le vent et les pirates, le bateau s'arrête de préférence au-dessus d'un passage plus à droite ;
// ventMs, piratesK : le vent et les pirates (module4.json) ; qualite : la qualité de la mer au départ ; mesure(t) : appelé à
// chaque image ; sansWebGL() : pas de WebGL } ; renvoie l'interface de la scène (API), ou null sans WebGL.
/* eslint-disable */
export function startVoiliers(OPTS) {
let VIVANT = true, RAF = 0;
${js}
}
`;
  const json = JSON.stringify({ source: `art/voiliers/index.html (empreinte ${empreinte})`, ...donnees });
  if (ecrire) {
    mkdirSync(OUT_IMG, { recursive: true });
    for (const [f, buf] of ecrits) writeFileSync(join(OUT_IMG, f), buf);
    for (const f of readdirSync(OUT_IMG)) if (f !== "donnees.json" && !ecrits.has(f)) unlinkSync(join(OUT_IMG, f));
    writeFileSync(join(OUT_IMG, "donnees.json"), json);
    mkdirSync(join(APP, "js/voiliers"), { recursive: true });
    writeFileSync(OUT_JS, module);
    execFileSync(process.execPath, ["--check", OUT_JS]); // (le module se lit)
  }
  const poids = [...ecrits.values()].reduce((s, b) => s + b.length, 0);
  const empreinteSortie = createHash("sha256").update(module).update(json).update([...ecrits.entries()].map(([f, b]) => f + createHash("sha256").update(b).digest("hex")).join()).digest("hex").slice(0, 12);
  log(`voiliers : ${ecrits.size} images (${(poids / 1048576).toFixed(2)} Mo) -> ${OUT_IMG} ; module ${(module.length / 1024).toFixed(0)} Ko -> ${OUT_JS} ; empreinte ${empreinteSortie}`);
  return { images: ecrits.size, poids, empreinte, empreinteSortie };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = exportVoiliers(), b = exportVoiliers({ ecrire: false, log: () => {} });
  if (a.empreinteSortie !== b.empreinteSortie) throw new Error("export-voiliers : deux fabrications différentes");
  console.log("seconde fabrication identique");
}
