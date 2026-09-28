export const DESIGN_SIZE = Object.freeze({ width: 1280, height: 800 });
export const SCENE_SLOTS = Object.freeze(["background", "back", "octo", "front", "ui"]);

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);
const isPositive = (value) => isFiniteNumber(value) && value > 0;
const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const safeAsset = (value) => typeof value === "string"
  && value.trim().length > 0
  && !value.startsWith("/")
  && !value.includes("..")
  && !/^https?:/i.test(value);

const hasVisualSource = (entry) => {
  const hasAsset = safeAsset(entry.asset);
  const hasPlaceholder = isObject(entry.placeholder) && typeof entry.placeholder.type === "string";
  return hasAsset || hasPlaceholder;
};

function validateEntry(entry, kind, seen, errors) {
  if (!isObject(entry)) {
    errors.push(`${kind}: entrée invalide`);
    return;
  }

  if (typeof entry.id !== "string" || entry.id.trim() === "") errors.push(`${kind}: id manquant`);
  else if (seen.has(entry.id)) errors.push(`id dupliqué : ${entry.id}`);
  else seen.add(entry.id);

  if (!SCENE_SLOTS.includes(entry.slot)) errors.push(`${entry.id ?? kind}: slot inconnu (${entry.slot ?? "absent"})`);
  if (!isFiniteNumber(entry.depth)) errors.push(`${entry.id ?? kind}: depth doit être un nombre fini`);
  if (!hasVisualSource(entry)) errors.push(`${entry.id ?? kind}: asset relatif sûr ou placeholder requis`);
  if (entry.asset !== undefined && !safeAsset(entry.asset)) errors.push(`${entry.id ?? kind}: chemin d'asset invalide`);

  for (const key of ["x", "y", "scale", "opacity", "parallax"]) {
    if (entry[key] !== undefined && !isFiniteNumber(entry[key])) errors.push(`${entry.id ?? kind}: ${key} doit être un nombre fini`);
  }
  for (const key of ["w", "h"]) {
    if (entry[key] !== undefined && !isPositive(entry[key])) errors.push(`${entry.id ?? kind}: ${key} doit être > 0`);
  }
  if (entry.asset && (!isPositive(entry.w) || !isPositive(entry.h))) errors.push(`${entry.id}: w et h sont requis pour un asset raster`);
  if (entry.scale !== undefined && entry.scale <= 0) errors.push(`${entry.id ?? kind}: scale doit être > 0`);
  if (entry.opacity !== undefined && (entry.opacity < 0 || entry.opacity > 1)) errors.push(`${entry.id ?? kind}: opacity doit être compris entre 0 et 1`);

  if (entry.motion !== undefined) {
    if (!isObject(entry.motion)) errors.push(`${entry.id ?? kind}: motion doit être un objet`);
    else if (entry.motion.float !== undefined) {
      const f = entry.motion.float;
      if (!isObject(f)) errors.push(`${entry.id ?? kind}: motion.float doit être un objet`);
      else {
        if (!isFiniteNumber(f.amplitude)) errors.push(`${entry.id ?? kind}: motion.float.amplitude doit être un nombre fini`);
        if (!isPositive(f.periodMs)) errors.push(`${entry.id ?? kind}: motion.float.periodMs doit être > 0`);
        if (f.rotateDeg !== undefined && !isFiniteNumber(f.rotateDeg)) errors.push(`${entry.id ?? kind}: motion.float.rotateDeg doit être un nombre fini`);
      }
    }
  }

  if (entry.animation !== undefined) {
    if (!isObject(entry.animation)) errors.push(`${entry.id ?? kind}: animation doit être un objet`);
    else {
      if (entry.animation.clip !== undefined && typeof entry.animation.clip !== "string") errors.push(`${entry.id ?? kind}: animation.clip doit être une chaîne`);
      if (entry.animation.fps !== undefined && !isPositive(entry.animation.fps)) errors.push(`${entry.id ?? kind}: animation.fps doit être > 0`);
    }
  }
}

export function validateScene(scene) {
  const errors = [];
  if (!isObject(scene)) return ["scene doit être un objet"];

  if (scene.version !== 1) errors.push("version doit valoir 1");
  if (typeof scene.id !== "string" || scene.id.trim() === "") errors.push("id de scène manquant");

  if (!isObject(scene.design)) errors.push("design manquant");
  else if (scene.design.width !== DESIGN_SIZE.width || scene.design.height !== DESIGN_SIZE.height) {
    errors.push(`design doit rester ${DESIGN_SIZE.width} × ${DESIGN_SIZE.height}`);
  }

  if (!Array.isArray(scene.layers)) errors.push("layers doit être un tableau");
  if (!Array.isArray(scene.actors)) errors.push("actors doit être un tableau");

  const seen = new Set();
  for (const layer of scene.layers ?? []) validateEntry(layer, "layer", seen, errors);
  for (const actor of scene.actors ?? []) validateEntry(actor, "actor", seen, errors);
  return errors;
}

export function assertScene(scene) {
  const errors = validateScene(scene);
  if (errors.length) throw new Error(`Manifest de scène invalide:\n- ${errors.join("\n- ")}`);
  return scene;
}

export function entriesByDepth(scene) {
  assertScene(scene);
  return [
    ...scene.layers.map((entry) => ({ ...entry, kind: "layer" })),
    ...scene.actors.map((entry) => ({ ...entry, kind: "actor" })),
  ].sort((a, b) => a.depth - b.depth || a.id.localeCompare(b.id, "fr"));
}

export function normalizedEntry(entry) {
  return {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    parallax: 0,
    ...entry,
  };
}
