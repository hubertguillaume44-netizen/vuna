#!/usr/bin/env node
// ————— RECENSEMENT B · CHAQUE RÉSERVE GARDE-T-ELLE SA PORTE ? —————
//
// Ce n'est PAS une garde : rien n'échoue ici. C'est un compte.
//   node scripts/recensement-reserves.mjs
//
// LE CONSTAT QUI LE MOTIVE : le 20 septembre 2026, trois réserves étaient affichées sur
// la même rangée — « configuration → introuvable », « non vérifié », `_exact` faux — et
// l'export a produit un fichier qui affirmait 237 trades. *Une réserve qui n'empêche
// rien est une décoration, et elle est pire qu'absente : elle donne l'impression que le
// cas est traité.*
//
// ANGLE MORT, EN TÊTE, ET IL EST IRRÉDUCTIBLE (règle 9) : une réserve est de la PROSE.
// Rien dans un fichier ne dit « ceci est une réserve », donc la population est ÉNUMÉRÉE
// et non découverte — un onzième avertissement naîtrait hors de portée de cette liste.
// Ce qui est mesuré, en revanche, l'est : pour chaque réserve on cherche son PRÉDICAT
// dans le corps des gestes, et c'est un fait vérifiable.
import { readFileSync } from "node:fs";
import { borne } from "./lib/tranche.mjs";
const APP = readFileSync(new URL("../Vuna.dc.html", import.meta.url), "utf8");
const corps = (debut, fin) => { const d = borne(APP, debut); return APP.slice(d, borne(APP, fin, d)); };

// LES GESTES : ce qu'une ligne permet de FAIRE, et où leur corps commence et finit.
const GESTES = {
  "exporter un robot": corps("  async exporterRobotBrut(v) {", "\n    a.click();"),
  "ranger au portefeuille": corps("  basculerValide(sym, cfg) {", "\n    this.majPf("),
  "exporter le lot": corps("  async exporterRobots(", "\n  }\n"),
};

// LES RÉSERVES : le texte que l'écran montre, et le prédicat qui le produit.
const RESERVES = [
  ["« configuration → introuvable » (colonne Période)", "configuration introuvable"],
  ["« non vérifié » (étiquette de rangée)", "non vérifié"],
  ["l'état reconstruit n'est pas fidèle", "_exact"],
  ["« mesure antérieure à la règle actuelle »", "mesureVieille"],
  ["« chiffre d'une version antérieure » (W1)", "w1Perimee"],
  ["« fenêtre choisie, pas toute la série »", "verrou"],
  ["« la reprise n'a pas restitué la ligne »", "varianteRatee"],
  ["« reprise incertaine »", "repriseIncertaine"],
  ["« bougies non chargées »", "bougies non chargées"],
  ["« dernier trade en … — rien depuis N ans »", "SEUIL_MORT"],
  ["un filtre non transposable en MQL5", "filtresBloquants"],
  ["le robot ne porte pas les filtres de sa ligne", "filtresPerdus"],
];

if (Object.values(GESTES).some((c) => c.length < 200)) throw new Error("corps de geste désancré");

console.log("RECENSEMENT B — " + RESERVES.length + " réserves × " + Object.keys(GESTES).length + " gestes\n");
let muettes = 0;
for (const [nom, pred] of RESERVES) {
  const bloque = Object.entries(GESTES)
    .filter(([, c]) => new RegExp("\\b" + pred.replace(/[^\wÀ-ſ ]/g, ".") + "\\b").test(c))
    .map(([g]) => g);
  if (!bloque.length) muettes++;
  // « CITÉ PAR » et non « EMPÊCHE » : un grep voit la mention, pas le refus.
  // `mesureVieille` est CITÉE par l'export — elle lui est passée pour l'en-tête du robot,
  // et n'empêche rien. Le verdict « refus » est relu à la main, ligne par ligne, et il
  // est écrit dans le rapport ; ici on ne rapporte que le fait vérifiable.
  console.log((bloque.length ? "  cit\u00e9e par      " : "  AUCUN GESTE NE LA LIT").padEnd(24)
    + nom.padEnd(52) + (bloque.length ? "\u2192 " + bloque.join(", ") : ""));
}
console.log("\n" + muettes + " r\u00e9serve(s) sur " + RESERVES.length + " ne sont lues par AUCUN geste.");
