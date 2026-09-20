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
// LE TRI, ET C'EST LUI LE LIVRABLE. « Une réserve doit garder une porte » est trop
// large : certaines informent un JUGEMENT, et la prose y est le bon outil. La coupe qui
// décide est ailleurs :
//   FAUX  — l'artefact descend en AFFIRMANT quelque chose qui n'est pas vrai. Le fichier
//           porte un chiffre que ce robot ne rendra pas. Celles-là doivent refuser.
//   JUGE  — l'utilisateur décide en connaissance de cause ; rien dans le fichier ne ment.
const RESERVES = [
  ["FAUX", "« configuration → introuvable » (colonne Période)", "configuration introuvable",
    "la ligne n'est pas rejouable : le robot est bâti depuis un état reconstruit dont rien ne garantit qu'il soit celui de la mesure"],
  ["JUGE", "« non vérifié » (étiquette de rangée)", "non v\u00e9rifi\u00e9",
    "absence de PREUVE contre un testeur, pas présence d'un mensonge — et l'étiquette porte déjà son échantillon"],
  ["FAUX", "l'état reconstruit n'est pas fidèle (`_exact`)", "_exact",
    "tout ce qui en dérive — robot, remesure — décrit une autre configuration que la ligne"],
  ["FAUX", "« mesure antérieure à la règle actuelle »", "mesureVieille",
    "l'en-tête porte des chiffres produits sous une règle de moteur périmée : ce robot ne les rendra pas"],
  ["FAUX", "« chiffre d'une version antérieure » (W1)", "w1Perimee",
    "même forme : le chiffre vient de l'ancien repli sur H4, le robot fait de vraies semaines"],
  ["JUGE", "« fenêtre choisie, pas toute la série »", "verrou",
    "les chiffres sont VRAIS de leur fenêtre, et la fenêtre est nommée — jusque dans le nom du fichier"],
  ["FAUX", "« la reprise n'a pas restitué la ligne »", "varianteRatee",
    "le panneau montre une autre configuration que la ligne : ce qui en sort n'est pas la ligne"],
  ["FAUX", "« reprise incertaine »", "repriseIncertaine",
    "« je ne sais pas » n'est pas « c'est bon » — on ne certifie pas un artefact qu'on ne peut pas vérifier"],
  ["JUGE", "« bougies non chargées »", "bougies non charg\u00e9es",
    "empêche de REMESURER, pas de décrire : les chiffres enregistrés étaient vrais quand ils ont été mesurés"],
  ["JUGE", "« dernier trade en … — rien depuis N ans »", "SEUIL_MORT",
    "avertissement de jugement : la configuration s'est tue, et c'est à l'utilisateur d'en décider"],
  ["FAUX", "un filtre non transposable en MQL5", "filtresBloquants",
    "le robot ne peut pas reproduire la mesure — refuse déjà"],
  ["FAUX", "le robot ne porte pas les filtres de sa ligne", "filtresPerdus",
    "l'en-tête annonce une mesure filtrée sous un robot qui ne l'est pas — refuse depuis 260920.8"],
];

// ————— ET DEUX DÉFAUTS DE CE JOUR N'ONT AUCUNE RÉSERVE —————
// Ils sont SOUS le plancher de ce recensement : sa population est « ce que l'écran dit »,
// et l'écran ne dit rien d'eux. Ils sont inscrits ici pour que le tri ne se lise pas
// comme un inventaire des dangers.
const SANS_RESERVE = [
  ["FAUX", "stop suiveur mesuré, robot sans aucune sécurisation",
    "`paliersDe` rend [] pour `typeSecu: 'trailing'`, `robot-mt5.js` ne contient pas le mot, et rien ne refuse"],
  ["FAUX", "« Longueur de la ligne » (periodePente) ignorée par le robot",
    "la mesure lit `periodePente || periodeMtf`, le générateur lit `periodeMtf` seul"],
];

if (Object.values(GESTES).some((c) => c.length < 200)) throw new Error("corps de geste désancré");

console.log("RECENSEMENT B — " + RESERVES.length + " réserves \u00d7 " + Object.keys(GESTES).length + " gestes\n");
let muettes = 0;
for (const tas of ["FAUX", "JUGE"]) {
  console.log(tas === "FAUX"
    ? "### RENDENT L'ARTEFACT FAUX — elles doivent refuser"
    : "\n### INFORMENT UN JUGEMENT — la prose y est le bon outil");
  for (const [t, nom, pred, raison] of RESERVES.filter((r) => r[0] === tas)) {
    const bloque = Object.entries(GESTES)
      .filter(([, c]) => new RegExp("\\b" + pred.replace(/[^\w\u00c0-\u017f ]/g, ".") + "\\b").test(c))
      .map(([g]) => g);
    if (!bloque.length && t === "FAUX") muettes++;
    console.log("  " + (bloque.length ? "[lue par " + bloque.join(", ") + "]" : "[AUCUN GESTE NE LA LIT]"));
    console.log("     " + nom);
    console.log("     " + raison + "\n");
  }
}
console.log("\n### SOUS LE PLANCHER — aucun écran n'en parle");
for (const [, nom, raison] of SANS_RESERVE) console.log("  [AUCUNE RÉSERVE N'EXISTE]\n     " + nom + "\n     " + raison + "\n");
console.log(muettes + " r\u00e9serve(s) du tas FAUX sur " + RESERVES.filter((r) => r[0] === "FAUX").length
  + " ne sont lues par aucun geste, plus " + SANS_RESERVE.length + " d\u00e9faut(s) sans r\u00e9serve du tout.");
