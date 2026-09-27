// CATALOGUE DES SPRITES DE L'APPLICATION. Chaque entrée dit : sur quelle planche elle va, la taille du
// calque où elle est dessinée (en px logiques de la scène 1280 x 800), son point d'ancrage (origin),
// son nombre d'images et la fonction qui dessine l'image f. L'outil `tools/export-app.mjs` rend chaque
// image à l'échelle 1 et 2, la recadre au plus juste, et range tout en planches WebP + `atlas.json`.
// Les positions dans l'atlas sont relatives à l'ancrage : l'application pose un sprite par son ancrage.
import type { Gfx, P } from "../core";
import { BUBBLE_R, drawAnswerBubble, drawBackground, drawBubble, drawCheck, drawFish, drawMoon, drawEraseKey, drawNameTag, drawShellKey, drawSlate, drawReplayKey, drawTally, SLATE_H, SLATE_W, NAME_H, NAME_W, TALLY_H, TALLY_W, drawRays, drawPlay, drawShimmer, drawSpeaker, drawStar, drawWeed, FISH_KINDS, FISH_N, SHIMMER_N, WEEDS } from "./decor";
import { IDLE_N, OCTO_CLIPS, OCTO_FPS, octoParts, type Part, RING_Y } from "./octopus";
import { drawTurtle, TURTLE_CLIPS, TURTLE_FPS } from "./turtle";
import { CREATURE_FPS, CREATURE_N, CREATURES } from "./creatures";
import { CARD_H, CARD_W, drawBigShell, drawGift, drawShinySweep, GIFTS, SWEEP_H, SWEEP_W, drawCardBack, drawCardBanner, drawCardFrame, drawCardVerso, drawCardWater, drawGlint, drawGoldStar, drawHomeKey, drawRainbowStar, drawReefKey, SHELL_N } from "./treasure";
import { CRAN_W, drawCranGlow, drawCranKey, GLOW_CR } from "./selector";
import { drawAgainKey, drawAlbumKey, drawDontKnowKey, drawFreeFacts, drawFreeLessons, drawFreeLine, drawMoonDecor, drawPearl, drawProgressDot, drawSkipKey, drawStepHello, drawStepLine, drawStepPlus, drawStepGlow, drawStepShell, GLOW_R, STEP_R } from "./ui";

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
  { name: "fond", sheet: "fond", W: 1280, H: 800, origin: [0, 0], frames: 1, full: true, draw: (g) => drawBackground(g) },
  { name: "rayons", sheet: "rayons", W: 1280, H: 800, origin: [0, 0], frames: 1, full: true, scales: [1], draw: (g) => drawRays(g) },
  ...octoSpecs,
  ...WEEDS.map((w, i): Spec => ({ name: `algue.${i}`, sheet: "algues", W: 1280, H: 800, origin: [w.x, w.y], frames: 1, draw: (g) => drawWeed(g, w, i), meta: { ...w } })),
  ...FISH_KINDS.flatMap((_, k) => ([-1, 1] as const).map((dir): Spec => ({
    name: `poisson.${k}.${dir < 0 ? "g" : "d"}`, sheet: "poissons", W: 200, H: 120, origin: [100, 60], frames: FISH_N, fps: 12,
    draw: (g, f) => drawFish(g, k, dir, f, 100, 60), loop: [0, FISH_N],
  }))),
  ...BUBBLE_R.map((r, i): Spec => ({ name: `bulle.${r}`, sheet: "petits", W: 40, H: 40, origin: [20, 20], frames: 1, draw: (g) => drawBubble(g, r, 20, 20, i) })),
  ...Array.from({ length: SHIMMER_N }, (_, i): Spec => ({ name: `reflet.${i}`, sheet: "petits", W: 260, H: 40, origin: [130, 20], frames: 1, draw: (g) => drawShimmer(g, i, 130, 20) })),
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
  { name: "aide", sheet: "petits", W: 150, H: 150, origin: [75, 75], frames: 1, draw: (g) => drawShellKey(g, 75, 75) },
  { name: "valider", sheet: "petits", W: 160, H: 160, origin: [80, 80], frames: 1, draw: (g) => drawCheck(g, 80, 80) },
  { name: "rejouer", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawReplayKey(g, 70, 70) },
  { name: "etoile.doree", sheet: "petits", W: 120, H: 120, origin: [60, 60], frames: 1, draw: (g) => drawGoldStar(g, 60, 60, 44) },
  { name: "etoile.arc", sheet: "petits", W: 120, H: 120, origin: [60, 60], frames: 1, draw: (g) => drawRainbowStar(g, 60, 60, 44) },
  { name: "eclat", sheet: "petits", W: 80, H: 80, origin: [40, 40], frames: 1, draw: (g) => drawGlint(g, 40, 40, 30) },
  { name: "recif", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawReefKey(g, 90, 90) },
  { name: "maison", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawHomeKey(g, 70, 70) },
  // lot 1 bis : « je ne sais pas », « passer », « Encore ! », l'album, la frise, la lune-décor, l'entraînement libre
  { name: "nsp", sheet: "petits", W: 150, H: 150, origin: [75, 75], frames: 1, draw: (g) => drawDontKnowKey(g, 75, 75) },
  { name: "passer", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawSkipKey(g, 70, 70) },
  { name: "encore", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawAgainKey(g, 90, 90) },
  { name: "album", sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => drawAlbumKey(g, 90, 90) },
  ...([["accueil", drawStepHello], ["echauffement", drawStepPlus], ["notion", drawStepLine], ["recompense", drawStepShell]] as const).map(([id, f]): Spec => ({ name: `frise.${id}`, sheet: "petits", W: 2 * STEP_R + 24, H: 2 * STEP_R + 24, origin: [STEP_R + 10, STEP_R + 10], frames: 1, draw: (g) => f(g, STEP_R + 10, STEP_R + 10) })),
  { name: "frise.lueur", sheet: "petits", W: 2 * GLOW_R + 8, H: 2 * GLOW_R + 8, origin: [GLOW_R + 4, GLOW_R + 4], frames: 1, draw: (g) => drawStepGlow(g, GLOW_R + 4, GLOW_R + 4) },
  { name: "frise.point", sheet: "petits", W: 30, H: 30, origin: [15, 15], frames: 2, draw: (g, f) => drawProgressDot(g, 15, 15, f === 1) },
  { name: "lune.decor", sheet: "petits", W: 240, H: 220, origin: [120, 110], frames: 1, draw: (g) => drawMoonDecor(g, 120, 110) },
  ...([["ligne", drawFreeLine], ["faits", drawFreeFacts], ["lecons", drawFreeLessons]] as const).map(([id, f]): Spec => ({ name: `libre.${id}`, sheet: "petits", W: 180, H: 180, origin: [90, 90], frames: 1, draw: (g) => f(g, 90, 90) })),
  { name: "reecouter", sheet: "petits", W: 140, H: 140, origin: [70, 70], frames: 1, draw: (g) => drawSpeaker(g, 70, 70) },
  // les créatures du lagon, animées (le récif) : chargées seulement quand on visite le récif
  ...CREATURES.map((c): Spec => ({ name: `creature.${c.id}`, sheet: "recif", W: c.W, H: c.H, origin: c.origin, frames: CREATURE_N, fps: CREATURE_FPS, loop: [0, CREATURE_N], draw: (g, f) => c.draw(g, f / CREATURE_N, c.origin[0], c.origin[1]), meta: { ground: c.ground } })),
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
  // les cadeaux du récif (la surprise) : ancrés au milieu de leur base, posés sur le sable
  ...GIFTS.map((id): Spec => ({ name: `cadeau.${id}`, sheet: "petits", W: 200, H: 180, origin: [100, 160], frames: 1, draw: (g) => drawGift(g, id, 100, 160) })),
];
