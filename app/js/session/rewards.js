// LES ÉTOILES DE MER (docs/SPEC.md, « Gains d'étoiles de mer »). Le trésor est rangé dans le magasin
// « recompenses » (clé « etoiles ») : `total` ce qui reste à dépenser (en coquillages, étape 10),
// `cumul` tout ce qui a été gagné depuis le début. On ne perd jamais rien.
export class Rewards {
  constructor(store) { this.store = store; this.st = { id: "etoiles", total: 0, cumul: 0 }; this.listeners = new Set(); }
  async load() { this.st = (await this.store.get("recompenses", "etoiles")) ?? this.st; return this; }
  get total() { return this.st.total; }
  async add(n, raison = "") { this.st = { ...this.st, total: this.st.total + n, cumul: this.st.cumul + n }; await this.store.put("recompenses", this.st); this.listeners.forEach((f) => f(n, raison)); }
  onChange(f) { this.listeners.add(f); }
}
