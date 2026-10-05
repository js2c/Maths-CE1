// CATALOGUE DES SPRITES DE L'APPLICATION. Chaque entrée dit : sur quelle planche elle va, la taille du
// calque où elle est dessinée (en px logiques de la scène 1280 x 800), son point d'ancrage (origin),
// son nombre d'images et la fonction qui dessine l'image f. L'outil `tools/export-app.mjs` rend chaque
// image à l'échelle 1 et 2, la recadre au plus juste, et range tout en planches WebP + `atlas.json`.
// Les positions dans l'atlas sont relatives à l'ancrage : l'application pose un sprite par son ancrage.
import type { Gfx, P } from "../core";
import { BUBBLE_R, drawAnswerBubble, drawBubble, drawCheck, drawFish, drawMoon, drawEraseKey, drawNameTag, drawShellKey, drawSlate, drawReplayKey, drawTally, SLATE_H, SLATE_W, NAME_H, NAME_W, TALLY_H, TALLY_W, drawPlay, drawSpeaker, drawStar, FISH_KINDS, FISH_N } from "./decor";
import { IDLE_N, OCTO_CLIPS, OCTO_FPS, octoParts, type Part, RING_Y } from "./octopus";
import { drawTurtle, TURTLE_CLIPS, TURTLE_FPS } from "./turtle";
import { CARD_H, CARD_W, drawBigShell, drawShinySweep, SWEEP_H, SWEEP_W, drawCardBack, drawCardBanner, drawCardFrame, drawCardVerso, drawCardWater, drawGlint, drawGoldStar, drawHomeKey, drawRainbowStar, drawReefKey, SHELL_N } from "./treasure";
import { CRAN_W, drawCranGlow, drawCranKey, GLOW_CR } from "./selector";
import { drawFishNet, drawTrawl, NET_H, NET_W, TRAWL } from "./hundreds";
import { DEFI_N, drawRecordFlag, drawScorePearl, drawStepChallenge, drawTimerBubble, TIMER_W } from "./challenge";
import { drawHermit, HERMIT_CLIPS, HERMIT_FPS, HERMIT_REST } from "./hermit";
import { drawBonusBubble, drawCellGlow, drawHouseBase, drawHouseFloor, drawHouseRoof, drawTenFrame, HOUSE, TEN, TEN_H, TEN_W, tenCell } from "./aids";
import { drawCalcTile, drawExerciseCalc, drawStepCalc, drawWallFish, WALL_FISH_N } from "./calc";
import { GLOW_PAD, drawChooseKey, drawExerciseLessons, drawExerciseLine, drawFamilyTile, drawLessonTile, drawLineTile, drawTileGlow, TILE_H, TILE_W } from "./choice";
import { drawBigFlag, drawCloseKey, drawHintKey, drawLegendKey, drawShrugKey, drawSmallFish, drawStarTrail, drawTagFish, drawTallNet, drawZoneTab, FLAG_N, HOUSE_FISH, LEGEND_R, NETV_H, NETV_W, TAG, TAG_FISH_N, TRAIL_H, TRAIL_W, ZONE_TAB_R } from "./lot3bis";
import { drawWarmupSkipKey } from "./lot3ter";
import { drawAgainKey, drawAlbumKey, drawFreeFacts, drawFreeLessons, drawFreeLine, drawMoonDecor, drawPearl, drawProgressDot, drawSkipKey, drawStepHello, drawStepLine, drawStepPlus, drawStepGlow, drawStepShell, GLOW_R, STEP_R } from "./ui";

// la tortue dans l'application : longueur ~110 px logiques, assez petite pour tenir sur une bouée
export const TURTLE_S = 1;

export type Spec = {
  name: string; sheet: string; W: number; H: number; origin: P; frames: number; fps?: number;
  draw: (g: Gfx, f: number) => void; meta?: Record<string, unknown>;
  loop?: [number, number]; // boucle à contrôler (raccord) : images [a, b)
  full?: boolean; // ne pas recadrer (le fond)
  scales?: number[]; // défaut [1, 2]
};

// ---------------------------------------------------------------- la pieuvre, en pièces
// Chaque image de chaque geste est découpée en pièces (octopus.ts, `octoParts`). Une pièce déjà vue (même
// calque, même clé) n'est fabriquée qu'une fois. Les pièces du repos vont sur la planche « pieuvre »
// (chargée au démarrage), celles qui n'apparaissent que dans un geste sur « pieuvre-gestes ». La frise
// (OCTO_TIMELINE) dit, pour chaque image de chaque geste, quelles pièces poser et la transformation du tout.
export const OW = 820, OH = 660, OX = 400, OY = 300; // calque d'une pièce ; centre du manteau en (OX, OY)
const partFrames: Record<string, Part[]> = {}, seen = new Map<string, [string, number]>();
type Ref = [string, number];
export const OCTO_TIMELINE = {
  fps: OCTO_FPS, idleFrames: IDLE_N, ring: RING_Y * 1.12,
  clips: {} as Record<string, { frames: number; entry: number; exit: number; hold: [number, number] | null; tl: [number, number, number, number, number, Ref[]][] }>,
};
OCTO_CLIPS.forEach((c) => {
  const tl: [number, number, number, number, number, Ref[]][] = [];
  for (let f = 0; f < c.frames; f++) {
    const { parts, tf } = octoParts(c.pose(f));
    const refs = parts.map((pt): Ref => {
      const id = `${pt.layer}|${pt.key}`;
      if (!seen.has(id)) { const sprite = `pieuvre.${c.name === "repos" ? "" : "g."}${pt.layer}`, list = (partFrames[sprite] ??= []); seen.set(id, [sprite, list.length]); list.push(pt); }
      return seen.get(id)!;
    });
    const r = (v: number, k = 1000) => Math.round(v * k) / k;
    tl.push([r(tf.tilt), r(tf.dx, 10), r(tf.dy, 10), r(tf.sx), r(tf.sy), refs]);
  }
  OCTO_TIMELINE.clips[c.name] = { frames: c.frames, entry: c.entry, exit: c.exit, hold: c.hold ?? null, tl };
});
const octoSpecs: Spec[] = Object.entries(partFrames).map(([name, list]) => ({
  name, sheet: name.startsWith("pieuvre.g.") ? "pieuvre-gestes" : "pieuvre", W: OW, H: OH, origin: [OX, OY], frames: list.length, fps: OCTO_FPS,
  draw: (g, f) => list[f].draw(g, OX, OY),
}));

export const SPECS: Spec[] = [
  // (lot « Lagon en fond d'exercices » : le fond, ses rayons, ses algues et ses reflets ne sont plus fabriqués ici ; le fond de
  // l'application est le lagon du récif vivant, extrait par tools/export-lagon.mjs. Récif vivant, 5 octobre 2026 : plus de
  // créatures dessinées en code (planche « recif »), de décors des doublons (« decors »), de cadeaux ni de perles de page ;
  // les créatures sont les images de la maquette, extraites par tools/export-recif.mjs)
  ...octoSpecs,
  ...FISH_KINDS.flatMap((_, k) => ([-1, 1] as const).map((dir): Spec => ({
    name: `poisson.${k}.${dir < 0 ? "g" : "d"}`, sheet: "poissons", W: 200, H: 120, origin: [100, 60], frames: FISH_N, fps: 12,
    draw: (g, f) => drawFish(g, k, dir, f, 100, 60), loop: [0, FISH_N],
  }))),
  ...BUBBLE_R.map((r, i): Spec => ({ name: `bulle.${r}`, sheet: "petits", W: 40, H: 40, origin: [20, 20], frames: 1, draw: (g) => drawBubble(g, r, 20, 20, i) })),
  // la tortue : une boucle par clip ; ancrage = sous son ventre, là où elle se pose sur la bouée.
  // meta.path (saut) : par image, [avancée 0..1 entre les deux bouées, hauteur 0..1 de l'arc]
  ...TURTLE_CLIPS.map((c): Spec => ({
    name: `tortue.${c.name}`, sheet: "tortue", W: 200, H: 170, origin: [80, 115], frames: c.frames, fps: TURTLE_FPS,
    draw: (g, f) => drawTurtle(g, { ...c.pose(f), s: TURTLE_S }, 80, 115), meta: { loop: c.loop, path: c.path ?? null }, loop: c.loop ? [0, c.frames] : undefined,
  })),
  { name: "etoile", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawStar(g, 70, 70) },
  { name: "reponse", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawAnswerBubble(g, 70, 70, 0) },
  { name: "jouer", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawPlay(g, 90, 90) },
  { name: "nom", sheet: "petits", W: NAME_W + 40, H: NAME_H + 40, origin: [NAME_W / 2 + 20, NAME_H / 2 + 20], frames: 1, draw: (g) => drawNameTag(g, NAME_W / 2 + 20, NAME_H / 2 + 20, 0) },
  { name: "bilan", sheet: "petits", W: TALLY_W + 50, H: TALLY_H + 50, origin: [TALLY_W / 2 + 20, TALLY_H / 2 + 20], frames: 1, draw: (g) => drawTally(g, TALLY_W / 2 + 20, TALLY_H / 2 + 20) },
  { name: "ardoise", sheet: "petits", W: SLATE_W + 50, H: SLATE_H + 50, origin: [SLATE_W / 2 + 20, SLATE_H / 2 + 20], frames: 1, draw: (g) => drawSlate(g, SLATE_W / 2 + 20, SLATE_H / 2 + 20) },
  { name: "effacer", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawEraseKey(g, 70, 70) },
  // (lot 3 bis, R23 : le coquillage d'aide est un triton bleu-violet, pour ne plus ressembler au coquillage rose de la récompense)
  { name: "aide", sheet: "petits", W: 150, H: 150, origin: [75, 75], frames: 1, draw: (g) => drawHintKey(g, 75, 75) },
  { name: "valider", sheet: "petits", W: 160, H: 160, origin: [80, 80], frames: 1, draw: (g) => drawCheck(g, 80, 80) },
  { name: "rejouer", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawReplayKey(g, 70, 70) },
  { name: "etoile.doree", sheet: "petits", W: 120, H: 120, origin: [60, 60], frames: 1, draw: (g) => drawGoldStar(g, 60, 60, 44) },
  { name: "etoile.arc", sheet: "petits", W: 120, H: 120, origin: [60, 60], frames: 1, draw: (g) => drawRainbowStar(g, 60, 60, 44) },
  { name: "eclat", sheet: "petits", W: 80, H: 80, origin: [40, 40], frames: 1, draw: (g) => drawGlint(g, 40, 40, 30) },
  { name: "recif", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawReefKey(g, 90, 90) },
  { name: "maison", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawHomeKey(g, 70, 70) },
  // lot 1 bis : « je ne sais pas », « passer », « Encore ! », l'album, la frise, la lune-décor, l'entraînement libre
  // (lot 3 bis, R23 : « je ne sais pas » est la pieuvre qui hausse les bras ; l'ancien « ? » se confondait avec celui de la question)
  { name: "nsp", sheet: "petits", W: 150, H: 150, origin: [75, 75], frames: 1, draw: (g) => drawShrugKey(g, 75, 75) },
  { name: "passer", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawSkipKey(g, 70, 70) },
  // lot 3 ter (T1) : « passer l'échauffement », son propre pictogramme (une vague franchie par une flèche dorée)
  { name: "passer.echauffement", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawWarmupSkipKey(g, 70, 70) },
  { name: "encore", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawAgainKey(g, 90, 90) },
  { name: "album", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawAlbumKey(g, 90, 90) },
  ...([["accueil", drawStepHello], ["echauffement", drawStepPlus], ["notion", drawStepLine], ["defi", drawStepChallenge], ["recompense", drawStepShell]] as const).map(([id, f]): Spec => ({ name: `frise.${id}`, sheet: "petits", W: 2 * STEP_R + 24, H: 2 * STEP_R + 24, origin: [STEP_R + 10, STEP_R + 10], frames: 1, draw: (g) => f(g, STEP_R + 10, STEP_R + 10) })),
  { name: "frise.lueur", sheet: "petits", W: 2 * GLOW_R + 8, H: 2 * GLOW_R + 8, origin: [GLOW_R + 4, GLOW_R + 4], frames: 1, draw: (g) => drawStepGlow(g, GLOW_R + 4, GLOW_R + 4) },
  { name: "frise.point", sheet: "petits", W: 30, H: 30, origin: [15, 15], frames: 2, draw: (g, f) => drawProgressDot(g, 15, 15, f === 1) },
  { name: "lune.decor", sheet: "petits", W: 240, H: 220, origin: [120, 110], frames: 1, draw: (g) => drawMoonDecor(g, 120, 110) },
  ...([["ligne", drawFreeLine], ["faits", drawFreeFacts], ["lecons", drawFreeLessons]] as const).map(([id, f]): Spec => ({ name: `libre.${id}`, sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => f(g, 90, 90) })),
  { name: "reecouter", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawSpeaker(g, 70, 70) },
  // les créatures du lagon, animées (le récif) : chargées seulement quand on visite le récif
  // les cartes et le coquillage : chargés pour la récompense, l'album et quand on regarde une carte dans le
  // récif. Origine : le coin haut gauche de la carte. L'illustration (image générée) est posée par
  // l'application sous le cadre et le bandeau ; « carte.fond » la remplace si elle manque.
  { name: "carte.dos", sheet: "cartes", W: CARD_W + 16, H: CARD_H + 16, origin: [0, 0], frames: 1, draw: (g) => drawCardBack(g, 0, 0) },
  { name: "carte.fond", sheet: "cartes", W: CARD_W, H: CARD_H, origin: [0, 0], frames: 1, draw: (g) => drawCardWater(g, 0, 0) },
  { name: "carte.bandeau", sheet: "cartes", W: CARD_W, H: CARD_H, origin: [0, 0], frames: 1, draw: (g) => drawCardBanner(g, 0, 0) },
  ...["commune", "rare", "legendaire"].flatMap((r): Spec[] => [
    { name: `carte.cadre.${r}`, sheet: "cartes", W: CARD_W + 4, H: CARD_H + 4, origin: [0, 0], frames: 1, draw: (g) => drawCardFrame(g, 0, 0, r) },
    { name: `carte.verso.${r}`, sheet: "cartes", W: CARD_W + 16, H: CARD_H + 16, origin: [0, 0], frames: 1, draw: (g) => drawCardVerso(g, 0, 0, r) },
  ]),
  // lot 3, étape 5 : la perle d'une page du récif (0 : vide ; 1 : la page affichée), dans une petite planche toujours chargée
  { name: "perle", sheet: "cartes", W: 30, H: 30, origin: [15, 15], frames: 2, draw: (g, f) => drawPearl(g, 15, 15, f === 1) },
  { name: "coquillage", sheet: "cartes", W: 300, H: 280, origin: [150, 150], frames: SHELL_N, fps: 12, draw: (g, f) => drawBigShell(g, 1 - Math.pow(1 - f / (SHELL_N - 1), 2.2), 150, 150) },
  // lot 2 : le coquillage doré (une étoile dorée, une légendaire) et le reflet irisé des cartes brillantes
  { name: "coquillage.or", sheet: "cartes", W: 300, H: 280, origin: [150, 150], frames: SHELL_N, fps: 12, draw: (g, f) => drawBigShell(g, 1 - Math.pow(1 - f / (SHELL_N - 1), 2.2), 150, 150, true) },
  { name: "carte.reflet", sheet: "cartes", W: SWEEP_W, H: SWEEP_H, origin: [0, 0], frames: 1, draw: (g) => drawShinySweep(g, 0, 0) },
  // lot 2 : le sélecteur de difficulté (chargé au début de la séance, libéré ensuite) : un cran avec ses
  // étoiles, le même sans étoiles (entraînement libre), la lueur du cran conseillé
  ...[0, 1, 2, 3].flatMap((lv): Spec[] => [
    { name: `cran.${lv}`, sheet: "selecteur", W: CRAN_W, H: CRAN_W, origin: [CRAN_W / 2, CRAN_W / 2], frames: 1, draw: (g) => drawCranKey(g, CRAN_W / 2, CRAN_W / 2, lv) },
    { name: `cran.libre.${lv}`, sheet: "selecteur", W: CRAN_W, H: CRAN_W, origin: [CRAN_W / 2, CRAN_W / 2], frames: 1, draw: (g) => drawCranKey(g, CRAN_W / 2, CRAN_W / 2, lv, false) },
  ]),
  { name: "cran.lueur", sheet: "selecteur", W: 2 * GLOW_CR, H: 2 * GLOW_CR, origin: [GLOW_CR, GLOW_CR], frames: 1, draw: (g) => drawCranGlow(g, GLOW_CR, GLOW_CR) },
  // lot 2, étape 5 : le bernard-l'ermite, guide du module 2 (planche « ermite », chargée le temps du module 2),
  // en deux calques comme la pieuvre : la coquille (une image fixe par coquille, que l'application décale et
  // tourne) et le corps (une image par pose ; ce qui est rentré dans la coquille est déjà coupé). Ancrage : sur
  // le sable, sous l'ouverture de la coquille. meta.comp, par image : [coquille portée, décalage x, y, rotation
  // (degrés), coquille posée à côté ou -1, sa position x] ; hold : boucle intérieure d'un geste ; to : où il est à
  // la fin de « changer » (dans la nouvelle coquille), vide : où reste l'ancienne.
  ...HERMIT_CLIPS.filter((c) => c.name !== "repos.b").map((c): Spec => ({
    name: `ermite.${c.name}`, sheet: "ermite", W: 440, H: 240, origin: [150, 205], frames: c.frames, fps: HERMIT_FPS,
    draw: (g, f) => drawHermit(g, c.pose(f), 150, 205, "corps"),
    meta: { loop: c.loop, hold: c.hold ?? null, ...(c.meta ?? {}), comp: Array.from({ length: c.frames }, (_, f) => { const p = c.pose(f), r = (v: number) => Math.round(v * 10) / 10; return [p.shell, r(p.dx + p.sx), r(p.dy + p.sy), r(p.stilt), p.other ? p.other.shell : -1, p.other ? r(p.other.x) : 0]; }) },
    loop: c.loop ? [0, c.frames] : undefined,
  })),
  ...[0, 1].map((k): Spec => ({ name: `ermite.coquille.${k}`, sheet: "ermite", W: 240, H: 190, origin: [150, 150], frames: 1, draw: (g) => drawHermit(g, { ...HERMIT_REST, shell: k }, 150, 150, "coquille") })),
  // les aides visuelles du module 2 (planche « aides ») : le cadre de 10 (ancrage : coin haut gauche ;
  // meta.cells : centre de chaque alvéole), la lueur d'une alvéole, la maison des nombres en trois morceaux
  // (ancrage : milieu du bas du toit, du haut d'un étage, du haut du seuil), la bulle dorée du double + 1
  // (lot 3 : calque élargi : le contour du bord gauche, bombé, et le haut de la boîte étaient coupés)
  { name: "aide.cadre10", sheet: "aides", W: TEN_W + 70, H: TEN_H + 50, origin: [32, 16], frames: 1, draw: (g) => drawTenFrame(g, 32, 16), meta: { cells: Array.from({ length: 10 }, (_, i) => tenCell(i)), w: TEN_W, h: TEN_H, cell: TEN.cell } },
  { name: "aide.cadre.lueur", sheet: "aides", W: TEN.cell + 24, H: TEN.cell + 24, origin: [TEN.cell / 2 + 12, TEN.cell / 2 + 12], frames: 1, draw: (g) => drawCellGlow(g, TEN.cell / 2 + 12, TEN.cell / 2 + 12) },
  { name: "aide.maison.toit", sheet: "aides", W: HOUSE.w + 70, H: HOUSE.roof + 40, origin: [HOUSE.w / 2 + 30, HOUSE.roof + 14], frames: 1, draw: (g) => drawHouseRoof(g, HOUSE.w / 2 + 30, HOUSE.roof + 14), meta: { ...HOUSE } },
  { name: "aide.maison.etage", sheet: "aides", W: HOUSE.w + 30, H: HOUSE.floor + 20, origin: [HOUSE.w / 2 + 10, 4], frames: 1, draw: (g) => drawHouseFloor(g, HOUSE.w / 2 + 10, 4) },
  { name: "aide.maison.etage.vide", sheet: "aides", W: HOUSE.w + 30, H: HOUSE.floor + 20, origin: [HOUSE.w / 2 + 10, 4], frames: 1, draw: (g) => drawHouseFloor(g, HOUSE.w / 2 + 10, 4, false) },
  // (lot 3 : le seuil sortait de son calque à gauche, à droite et en bas ; dessin resserré, calque élargi avec une marge)
  { name: "aide.maison.seuil", sheet: "aides", W: HOUSE.w + 70, H: HOUSE.base + 36, origin: [HOUSE.w / 2 + 30, 10], frames: 1, draw: (g) => drawHouseBase(g, HOUSE.w / 2 + 30, 10) },
  // lot 2, étape 8 : les centaines (leçon L10, retours E6 et E7) : le filet de dix poissons (ancrage : coin haut
  // gauche) et le chalut, vide puis avec 1 à 10 filets (ancrage : milieu de la ralingue du haut)
  { name: "aide.filet", sheet: "centaines", W: NET_W + 20, H: NET_H + 20, origin: [6, 6], frames: 1, draw: (g) => drawFishNet(g, 6, 6), meta: { w: NET_W, h: NET_H } },
  { name: "aide.chalut", sheet: "centaines", W: TRAWL.w + 40, H: TRAWL.h + 60, origin: [TRAWL.w / 2 + 16, 28], frames: 11, draw: (g, f) => drawTrawl(g, TRAWL.w / 2 + 16, 28, f), meta: { ...TRAWL } },
  { name: "aide.bulle.doree", sheet: "aides", W: 100, H: 100, origin: [50, 50], frames: 1, draw: (g) => drawBonusBubble(g, 50, 50) },
  // lot 2, étape 7 : le défi record (planche « defi », chargée le temps du défi) : la bulle-sablier (DEFI_N
  // niveaux d'eau, du plein au vide), la perle d'une bonne réponse, le drapeau du record (ancrage : pied du mât)
  { name: "defi.bulle", sheet: "defi", W: TIMER_W, H: TIMER_W, origin: [TIMER_W / 2, TIMER_W / 2], frames: DEFI_N, draw: (g, f) => drawTimerBubble(g, TIMER_W / 2, TIMER_W / 2, f) },
  { name: "defi.perle", sheet: "defi", W: 44, H: 44, origin: [20, 20], frames: 1, draw: (g) => drawScorePearl(g, 20, 20) },
  { name: "defi.record", sheet: "defi", W: 60, H: 80, origin: [14, 72], frames: 1, draw: (g) => drawRecordFlag(g, 14, 72) },
  // lot 3 : l'écran « choisir » (docs/SPEC-LOT3.md, section 2). Le bouton de l'accueil va sur « petits » ; le reste sur
  // la planche « choix », chargée le temps du choix : les exercices, une plaque par niveau de la ligne graduée et par
  // famille d'additions, la plaque des leçons, la lueur du conseillé (ancrage : le centre)
  { name: "choisir", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawChooseKey(g, 90, 90) },
  { name: "choix.ex.ligne", sheet: "choix", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawExerciseLine(g, 90, 90) },
  { name: "choix.ex.lecons", sheet: "choix", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawExerciseLessons(g, 90, 90) },
  ...Array.from({ length: 13 }, (_, i): Spec => ({ name: `choix.ligne.${i + 1}`, sheet: "choix", W: TILE_W + 30, H: TILE_H + 30, origin: [TILE_W / 2 + 12, TILE_H / 2 + 12], frames: 1, draw: (g) => drawLineTile(g, TILE_W / 2 + 12, TILE_H / 2 + 12, i + 1) })),
  ...Array.from({ length: 7 }, (_, i): Spec => ({ name: `choix.famille.${i + 1}`, sheet: "choix", W: TILE_W + 30, H: TILE_H + 30, origin: [TILE_W / 2 + 12, TILE_H / 2 + 12], frames: 1, draw: (g) => drawFamilyTile(g, TILE_W / 2 + 12, TILE_H / 2 + 12, i + 1) })),
  { name: "choix.lecon", sheet: "choix", W: TILE_W + 30, H: TILE_H + 30, origin: [TILE_W / 2 + 12, TILE_H / 2 + 12], frames: 1, draw: (g) => drawLessonTile(g, TILE_W / 2 + 12, TILE_H / 2 + 12) },
  { name: "choix.lueur", sheet: "choix", W: TILE_W + 2 * GLOW_PAD + 12, H: TILE_H + 2 * GLOW_PAD + 12, origin: [TILE_W / 2 + GLOW_PAD + 6, TILE_H / 2 + GLOW_PAD + 6], frames: 1, draw: (g) => drawTileGlow(g, TILE_W / 2 + GLOW_PAD + 6, TILE_H / 2 + GLOW_PAD + 6) },
  // lot 3, étape 3 : le calcul rapide. Le pictogramme de l'écran « choisir » et les neuf plaques de niveaux (planche
  // « choix ») ; celui de la frise (« petits », comme les autres étapes) ; le petit poisson jaune du mur de corail,
  // vers la droite et vers la gauche, sa queue battant en 12 images (planche « calcul », chargée le temps du module 3 ;
  // ancrage : le centre du poisson, posé au centre d'une case)
  { name: "choix.ex.calcul", sheet: "choix", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawExerciseCalc(g, 90, 90) },
  ...Array.from({ length: 9 }, (_, i): Spec => ({ name: `choix.calcul.${i + 1}`, sheet: "choix", W: TILE_W + 30, H: TILE_H + 30, origin: [TILE_W / 2 + 12, TILE_H / 2 + 12], frames: 1, draw: (g) => drawCalcTile(g, TILE_W / 2 + 12, TILE_H / 2 + 12, i + 1) })),
  { name: "frise.calcul", sheet: "petits", W: 2 * STEP_R + 24, H: 2 * STEP_R + 24, origin: [STEP_R + 10, STEP_R + 10], frames: 1, draw: (g) => drawStepCalc(g, STEP_R + 10, STEP_R + 10) },
  ...([1, -1] as const).map((dir): Spec => ({ name: `mur.poisson.${dir > 0 ? "d" : "g"}`, sheet: "calcul", W: 80, H: 60, origin: [40, 30], frames: WALL_FISH_N, fps: 12, loop: [0, WALL_FISH_N], draw: (g, f) => drawWallFish(g, f, 40, 30, dir, 40) })),
  // lot 3 bis, partie B (docs/SPEC-LOT3BIS.md, B8 ; sea/lot3bis.ts, sea/reefdecor.ts). Sur « petits » (toujours chargée) : le
  // bouton de la légende et la croix du panneau, la traînée d'une étoile arc-en-ciel qui vole (ancrage : la tête), le filet
  // haut de la leçon L2 (ancrage : le nœud) ; sur « aides » : les poissons des maisons, orange (premier nombre) et bleu
  // (second) ; sur « poissons » (toujours chargée) : le poisson porteur d'étiquette du format « placer » (ancrage : la pointe
  // de l'étiquette ; meta.tag : le centre de l'étiquette, sa largeur et sa hauteur) ; sur « defi » : le grand drapeau du
  // record (ancrage : le pied du mât) ; sur « decors » (chargée avec le
  // récif et quand un doublon apporte un décor) : les quinze décors (ancrage : le milieu de leur base) ; les onglets de zone de l'album vont aussi sur « petits » (sur « cartes », ils faisaient passer sa planche de 34 à 47 Mo)
  { name: "legende", sheet: "petits", W: 2 * LEGEND_R + 30, H: 2 * LEGEND_R + 30, origin: [LEGEND_R + 12, LEGEND_R + 12], frames: 1, draw: (g) => drawLegendKey(g, LEGEND_R + 12, LEGEND_R + 12) },
  { name: "fermer", sheet: "petits", W: 130, H: 130, origin: [62, 62], frames: 1, draw: (g) => drawCloseKey(g, 62, 62) },
  { name: "etoile.trainee", sheet: "petits", W: TRAIL_W + 20, H: TRAIL_H + 30, origin: [TRAIL_W + 5, TRAIL_H / 2 + 10], frames: 1, draw: (g) => drawStarTrail(g, TRAIL_W + 5, TRAIL_H / 2 + 10) },
  { name: "aide.filet.haut", sheet: "petits", W: NETV_W + 30, H: NETV_H + 30, origin: [NETV_W / 2 + 10, 4], frames: 1, draw: (g) => drawTallNet(g, NETV_W / 2 + 10, 4), meta: { w: NETV_W, h: NETV_H } },
  ...HOUSE_FISH.map((pal, k): Spec => ({ name: `aide.poisson.${k}`, sheet: "aides", W: 70, H: 44, origin: [36, 22], frames: 1, draw: (g) => drawSmallFish(g, 36, 22, 38, pal, 9800 + k * 10) })),
  { name: "placer.poisson", sheet: "poissons", W: 210, H: 190, origin: [120, 180], frames: TAG_FISH_N, fps: 12, loop: [0, TAG_FISH_N], draw: (g, f) => drawTagFish(g, f, 120, 180), meta: { tag: { ...TAG } } },
  { name: "defi.drapeau", sheet: "defi", W: 170, H: 200, origin: [50, 186], frames: FLAG_N, fps: 8, loop: [0, FLAG_N], draw: (g, f) => drawBigFlag(g, 50, 186, f) },
  ...["lagon", "corail", "large", "abysses"].map((z): Spec => ({ name: `album.zone.${z}`, sheet: "petits", W: 2 * ZONE_TAB_R + 24, H: 2 * ZONE_TAB_R + 24, origin: [ZONE_TAB_R + 10, ZONE_TAB_R + 10], frames: 1, draw: (g) => drawZoneTab(g, ZONE_TAB_R + 10, ZONE_TAB_R + 10, z) })),
];
