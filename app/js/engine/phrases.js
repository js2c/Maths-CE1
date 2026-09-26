// LES PHRASES LUES (fonctions pures, partagées par l'application et par l'outil qui fabrique la voix,
// tools/voix/). Ce que la voix dit est découpé en phrases (après « . », « ! », « ? », « … ») : chaque
// phrase a son fichier son, fabriqué à l'avance avec ses nombres (docs/SPEC.md, « Voix enregistrée à
// l'avance »). Une phrase n'est jamais collée en morceaux ; seules des phrases entières se suivent.

// un gabarit de content/textes.json rempli : « {a} plus {b} ? » -> « 3 plus 4 ? ». Une variable non
// fournie reste telle quelle, pour être remplie ensuite : `fill(text.pick("fait"), { a, b })` (pick remplit
// d'abord {mascotte}). Avant le lot 1 bis, elle devenait vide et la voix disait « plus ? » au lieu de
// « 0 plus 6 ? » (le défaut que docs/SPEC.md attribuait à la synthèse du navigateur).
export const fill = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (v[k] == null ? m : String(v[k])));

// la forme de référence d'une phrase : espaces insécables et répétés ramenés à une espace, apostrophe droite
export const normalize = (s) => s.replace(/[  \s]+/g, " ").replace(/[’ʼ]/g, "'").trim();

// « Bravo ! Ce soir, tu as gagné 3 étoiles de mer. » -> ["Bravo !", "Ce soir, tu as gagné 3 étoiles de mer."]
export const sentences = (text) => normalize(text).split(/(?<=[.!?…])\s+(?=\S)/).filter(Boolean);
