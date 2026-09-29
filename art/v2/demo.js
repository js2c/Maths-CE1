import { assertScene, entriesByDepth, normalizedEntry } from "./scene-manifest.js";

const root = document.querySelector("#scene");
const status = document.querySelector("#status");
const pointer = { x: 0, y: 0 };
let octopusObject = null;
let octopusState = "idle";

function resize() {
  const k = Math.min(innerWidth / 1280, innerHeight / 800);
  root.style.transform = "translate(" + ((innerWidth - 1280 * k) / 2) + "px, " + ((innerHeight - 800 * k) / 2) + "px) scale(" + k + ")";
}

async function bundleURL(path) {
  const manifestURL = new URL("./ocean-01/" + path, location.href);
  const bundle = await fetch(manifestURL).then((r) => {
    if (!r.ok) throw new Error("bundle introuvable : " + path);
    return r.json();
  });
  const parts = await Promise.all(bundle.parts.map((part) =>
    fetch(new URL(part, manifestURL)).then((r) => {
      if (!r.ok) throw new Error("fragment introuvable : " + part);
      return r.text();
    })
  ));
  const raw = atob(parts.join(""));
  const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: bundle.mime }));
}

function basePosition(entry) {
  return entry.kind === "actor"
    ? { left: entry.x - entry.w / 2, top: entry.y - entry.h / 2 }
    : { left: entry.x, top: entry.y };
}

async function assetNode(entry) {
  const isSvgActor = entry.kind === "actor" && entry.asset && entry.asset.endsWith(".svg");
  const el = document.createElement(isSvgActor ? "object" : "img");
  const pos = basePosition(entry);

  el.className = "v2-entry v2-asset" + (entry.kind === "actor" ? " v2-actor-asset" : "");
  el.dataset.slot = entry.slot;
  el.dataset.id = entry.id;

  if (isSvgActor) {
    el.type = "image/svg+xml";
    el.data = new URL("./ocean-01/" + entry.asset, location.href).href;
    el.setAttribute("aria-label", "Pieuvre mascotte animée");
    el.addEventListener("load", () => {
      if (entry.id !== "octopus") return;
      octopusObject = el;
      applyOctopusState();
    });
  } else {
    el.alt = "";
    el.src = entry.assetBundle
      ? await bundleURL(entry.assetBundle)
      : new URL("./ocean-01/" + entry.asset, location.href).href;
  }

  Object.assign(el.style, {
    left: pos.left + "px",
    top: pos.top + "px",
    width: entry.w + "px",
    height: entry.h + "px",
    zIndex: String(entry.depth),
    opacity: String(entry.opacity)
  });
  return el;
}

function placeholderNode(entry) {
  const p = entry.placeholder;
  const el = document.createElement("div");
  el.className = "v2-entry v2-placeholder";
  el.dataset.slot = entry.slot;
  el.dataset.id = entry.id;
  el.style.zIndex = String(entry.depth);
  el.style.opacity = String(entry.opacity);

  const left = entry.x + (p.x || 0) - (entry.kind === "actor" ? (p.w || 0) / 2 : 0);
  const top = entry.y + (p.y || 0) - (entry.kind === "actor" ? (p.h || 0) / 2 : 0);
  Object.assign(el.style, {
    left: left + "px",
    top: top + "px",
    width: p.w + "px",
    height: p.h + "px",
    background: p.fill || "#fff",
    borderRadius: p.type === "ellipse" ? "50%" : ((p.radius || 0) + "px")
  });

  const label = document.createElement("span");
  label.className = "v2-label";
  label.textContent = entry.depth + " · " + entry.id;
  el.append(label);
  return el;
}

function applyOctopusState() {
  const svg = octopusObject && octopusObject.contentDocument
    ? octopusObject.contentDocument.documentElement
    : null;
  if (svg) svg.dataset.state = octopusState;
  document.querySelectorAll("[data-octo-state]").forEach((button) => {
    button.classList.toggle("active", button.dataset.octoState === octopusState);
  });
  const labels = { idle: "repos", happy: "bonne réponse", explain: "explication" };
  status.textContent = "Étape 3 — pieuvre réellement animée · état : " + labels[octopusState] + ".";
}

function setGuides(value) {
  document.body.classList.toggle("show-guides", value);
  document.querySelectorAll("[data-guides]").forEach((button) => {
    button.classList.toggle("active", button.dataset.guides === String(value));
  });
}

const scene = assertScene(await fetch("./ocean-01/scene.json").then((r) => r.json()));
status.textContent = "Chargement du décor et de la pieuvre animée…";

const rendered = [];
for (const raw of entriesByDepth(scene)) {
  const entry = normalizedEntry(raw);
  const el = entry.asset || entry.assetBundle ? await assetNode(entry) : placeholderNode(entry);
  root.append(el);
  rendered.push({ entry, el });
}

document.querySelectorAll("[data-guides]").forEach((button) => {
  button.addEventListener("click", () => setGuides(button.dataset.guides === "true"));
});

document.querySelectorAll("[data-octo-state]").forEach((button) => {
  button.addEventListener("click", () => {
    octopusState = button.dataset.octoState;
    applyOctopusState();
  });
});

function tick(now) {
  for (const { entry, el } of rendered) {
    if (entry.kind !== "actor") continue;
    const f = entry.motion && entry.motion.float;
    const phase = f ? (now % f.periodMs) / f.periodMs * Math.PI * 2 : 0;
    const dy = f ? Math.sin(phase) * f.amplitude : 0;
    const rot = f && f.rotateDeg ? Math.sin(phase * .83) * f.rotateDeg : 0;
    const dx = pointer.x * entry.parallax;
    const py = pointer.y * entry.parallax * .55;
    el.style.transform = "translate(" + dx + "px, " + (dy + py) + "px) scale(" + entry.scale + ") rotate(" + rot + "deg)";
  }
  requestAnimationFrame(tick);
}

addEventListener("resize", resize);
addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / innerWidth - .5;
  pointer.y = event.clientY / innerHeight - .5;
});
addEventListener("pointerleave", () => {
  pointer.x = 0;
  pointer.y = 0;
});

resize();
setGuides(false);
applyOctopusState();
requestAnimationFrame(tick);
