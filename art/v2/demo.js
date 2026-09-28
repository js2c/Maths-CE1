import { assertScene, entriesByDepth, normalizedEntry } from "./scene-manifest.js";

const viewport = document.querySelector("#viewport");
const root = document.querySelector("#scene");
const pointer = { x: 0, y: 0 };

function resize() {
  const k = Math.min(innerWidth / 1280, innerHeight / 800);
  root.style.transform = `translate(${(innerWidth - 1280 * k) / 2}px, ${(innerHeight - 800 * k) / 2}px) scale(${k})`;
}

function placeholderNode(entry) {
  const p = entry.placeholder;
  const el = document.createElement("div");
  el.className = "v2-entry";
  el.dataset.slot = entry.slot;
  el.dataset.id = entry.id;
  el.style.zIndex = String(entry.depth);
  el.style.opacity = String(entry.opacity);

  const left = entry.x + (p.x ?? 0) - (entry.kind === "actor" ? (p.w ?? 0) / 2 : 0);
  const top = entry.y + (p.y ?? 0) - (entry.kind === "actor" ? (p.h ?? 0) / 2 : 0);
  Object.assign(el.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${p.w}px`,
    height: `${p.h}px`,
    background: p.fill ?? "#fff",
    borderRadius: p.type === "ellipse" ? "50%" : `${p.radius ?? 0}px`,
  });

  const label = document.createElement("span");
  label.className = "v2-label";
  label.textContent = `${entry.depth} · ${entry.id}`;
  el.append(label);
  return el;
}

const scene = assertScene(await fetch("./ocean-01/scene.json").then((r) => r.json()));
const rendered = entriesByDepth(scene).map((raw) => {
  const entry = normalizedEntry(raw);
  const el = placeholderNode(entry);
  root.append(el);
  return { entry, el };
});

function tick(now) {
  for (const { entry, el } of rendered) {
    const f = entry.motion?.float;
    const phase = f ? (now % f.periodMs) / f.periodMs * Math.PI * 2 : 0;
    const dy = f ? Math.sin(phase) * f.amplitude : 0;
    const rot = f?.rotateDeg ? Math.sin(phase * 0.83) * f.rotateDeg : 0;
    const dxParallax = pointer.x * entry.parallax;
    const dyParallax = pointer.y * entry.parallax * 0.55;
    el.style.transform = `translate(${dxParallax}px, ${dy + dyParallax}px) scale(${entry.scale}) rotate(${rot}deg)`;
  }
  requestAnimationFrame(tick);
}

addEventListener("resize", resize);
addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / innerWidth - 0.5;
  pointer.y = event.clientY / innerHeight - 0.5;
});
addEventListener("pointerleave", () => { pointer.x = 0; pointer.y = 0; });
resize();
requestAnimationFrame(tick);
