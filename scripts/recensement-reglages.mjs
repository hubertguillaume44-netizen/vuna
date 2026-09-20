#!/usr/bin/env node
// ————— RECENSEMENT A · CHAQUE RÉGLAGE, DES DEUX CÔTÉS —————
//
// Ce n'est PAS une garde : rien n'échoue ici. C'est un compte, et il existe pour que le
// chiffre qu'on rapporte ait sa commande — « un compte posé sans sa commande est un
// compte recopié en puissance ».
//
//   node scripts/recensement-reglages.mjs
//
// POPULATION DÉCOUVERTE : `REGLAGES`, la liste que la photo `_reg` recopie. Un réglage
// ajouté demain entre dans le recensement sans qu'une ligne change ici.
//
// LES DEUX CÔTÉS, et il a fallu DEUX passes pour que la prise tienne. La première
// cherchait `s.<clé>` dans la seule tranche de `cfgCourante` et `etat.<clé>` dans le
// générateur : elle classait 14 réglages en « ni l'un ni l'autre » — dont `risquePct`,
// qui part au robot par `ctx`, et les paliers, qui entrent dans `cfg` par `paliersDe`.
// Un recensement qui sous-déclare envoie chasser des fantômes, ce qui coûte plus cher
// que pas de recensement. Les deux surfaces sont donc l'UNION des producteurs nommés,
// et les clés de `ctx` sont DÉRIVÉES du site d'appel plutôt qu'écrites ici.
//
// ANGLE MORT, EN TÊTE — la troisième colonne dit QUELLE GARDE NOMME la clé, pas si elle
// CONFRONTE les deux côtés. Une garde qui cite `utRsi` ne prouve pas qu'elle compare ce
// que la mesure en fait à ce que le robot en fait. C'est un fait vérifiable ; le jugement
// reste à l'humain, et c'est pourquoi la colonne porte des NOMS et non un verdict.
import { readFileSync, readdirSync } from "node:fs";
import { borne } from "./lib/tranche.mjs";
import { genererMQ5 } from "../robot-mt5.js";

const R = new URL("..", import.meta.url).pathname;
const APP = readFileSync(R + "Vuna.dc.html", "utf8");
const ROB = readFileSync(R + "robot-mt5.js", "utf8");

const tranche = (depart, fin) => { const d = borne(APP, depart); return APP.slice(d, borne(APP, fin, d)); };

const d = borne(APP, "  REGLAGES = [");
const REGLAGES = [...APP.slice(d, borne(APP, "];", d)).matchAll(/'([^']+)'/g)].map((m) => m[1]);

// CE QUI ENTRE DANS LA MESURE : l'union des producteurs nommés de `cfg`.
const PRODUCTEURS = ["  cfgCourante(", "  paliersDe(", "  fenetre(etat)", "  momentResolu("];
const MESURE = PRODUCTEURS.map((p) => tranche(p, "\n  }\n")).join("\n");

// CE QUI ENTRE DANS LE ROBOT : ce que le générateur lit, plus ce que le site d'appel lui
// passe par `ctx` — DÉRIVÉ de l'appel, jamais listé ici.
const appel = tranche("txt = mod.genererMQ5(cfgRobot, {", "});");
const CTX = [...appel.matchAll(/(\w+):/g)].map((m) => m[1]);
const PORTE_CTX = { risquePct: "risquePct", ut: "ut", btMoment: "moment", btMomentHeure: "moment",
  fenMode: "cfgRobot.fen", fenDu: "cfgRobot.fen", fenAu: "cfgRobot.fen",
  btFenDeb: "heures_entree", btFenFin: "heures_entree" };

const gardes = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(dir + "/" + e.name);
    else if (e.name.endsWith(".test.mjs")) gardes.push([e.name.replace(".test.mjs", ""), readFileSync(dir + "/" + e.name, "utf8")]);
  }
})(R + "scripts");

const mot = (k) => new RegExp("\\b" + k + "\\b");

// ————— LA COLONNE « ROBOT » EST MESURÉE, PAS GREPÉE —————
//
// Premier jet : `etat.<clé>` dans le générateur. Il classait `btSL`, `btEntree`,
// `btPeriode`… en « MESURE seule » — alors qu'ils partent tous au robot. La raison est
// le défaut même que ce recensement cherche : **le panneau et la configuration
// n'emploient pas les mêmes mots** (`btSL` devient `cfg.sortie.sl.valeur`), donc aucun
// grep ne peut répondre sans une table de correspondance que personne n'a écrite.
//
// On pose donc la question en RÉSULTAT : *changer ce réglage change-t-il le `.mq5` ?*
// Aucun vocabulaire n'est requis, et un réglage renommé demain reste mesuré.
// La correspondance panneau → cfg est DÉRIVÉE de `ligneBt()`, qui est l'endroit où elle
// s'écrit, plutôt que recopiée ici.
const lb = tranche("  ligneBt() {", "\n  }\n");
const VERS_CFG = {};
for (const m of lb.matchAll(/(\w+):\s*s\.(\w+)/g)) VERS_CFG[m[2]] = m[1];

const BASE_ETAT = Object.fromEntries(REGLAGES.map((k) => [k, /^(f|bt)[A-Z]/.test(k) ? false : 0]));
const BASE_CFG = { sym: "GOLD", sens: "achat", ligne: "mediane", periode: 7, sl: 0.7, rr: 1.5 };
const emettre = (etat, cfg) => {
  try { return genererMQ5({ ...BASE_CFG, ...cfg }, { etat: { ...BASE_ETAT, ...etat },
    risquePct: 1, ut: "D1", hasard: "x", spreadMaxPct: 0.05, stamp: "S", magic: 1 }); }
  catch (e) { return "REFUS:" + (e && e.message); }
};
// UN SOUS-RÉGLAGE NE BOUGE LE ROBOT QUE SI SON FILTRE PARENT EST ALLUMÉ. Mesuré depuis
// le seul état éteint, `utRsi` et `resistLookback` paraissaient ne jamais atteindre le
// robot — c'est la règle 10 dans l'outillage : l'état qu'on sème spontanément est celui
// où l'effet ne peut pas se produire. On mesure donc depuis DEUX états, et le second est
// découvert : tous les drapeaux que le générateur accepte d'émettre (ceux qu'il REFUSE
// sont exclus, sinon le refus masquerait tout le reste).
const DRAPEAUX = REGLAGES.filter((k) => /^(f|bt)[A-Z]/.test(k));
const ALLUME = {};
for (const k of DRAPEAUX) if (!/^REFUS:/.test(emettre({ [k]: true }, {}))) ALLUME[k] = true;

const TEMOINS = [{}, ALLUME];
function bougeLeRobot(k) {
  const variantes = [true, false, 3, 9, 20, "D1", "H4", "ema", "sma", "mediane", "point_mort"];
  for (const socle of TEMOINS) {
    const ref = emettre(socle, {});
    for (const v of variantes) if (emettre({ ...socle, [k]: v }, {}) !== ref) return true;
    if (VERS_CFG[k] !== undefined) {
      const c = VERS_CFG[k];
      for (const alt of [c === "sens" ? "vente" : c === "ligne" ? "ema"
        : c === "entree" ? "croisement" : c === "sym" ? "SILVER" : 9, 11]) {
        if (emettre(socle, { [c]: alt }) !== ref) return true;
      }
    }
  }
  return false;
}

const lignes = REGLAGES.map((k) => ({
  k,
  mesure: mot(k).test(MESURE) || VERS_CFG[k] !== undefined,
  robot: bougeLeRobot(k),
  via: VERS_CFG[k] ? "cfg." + VERS_CFG[k] : (PORTE_CTX[k] || ""),
  g: gardes.filter(([, t]) => mot(k).test(t)).map(([n]) => n),
}));

// ————— LA PRISE, AVANT LE VERDICT —————
if (REGLAGES.length < 40) throw new Error("REGLAGES désancré : " + REGLAGES.length + " clés");
if (!CTX.length) throw new Error("le site d'appel de genererMQ5 n'a pas été lu : les clés de ctx manquent");
const nMesure = lignes.filter((x) => x.mesure).length;
if (nMesure < 20) throw new Error("surface MESURE désancrée : " + nMesure + " réglages lus sur " + REGLAGES.length);

const ISSUE = (x) => !x.mesure && !x.robot ? "HORS CHAÎNE"
  : x.mesure && !x.robot ? "MESURE seule"
  : !x.mesure && x.robot ? "ROBOT seul"
  : x.g.length ? "les deux, nommé par une garde" : "LES DEUX, RIEN NE LE NOMME";

const par = new Map();
for (const x of lignes) { const i = ISSUE(x); if (!par.has(i)) par.set(i, []); par.get(i).push(x); }

console.log("RECENSEMENT A — " + REGLAGES.length + " réglages, population `REGLAGES`");
console.log("surface MESURE : " + PRODUCTEURS.join(" + "));
console.log("clés de ctx dérivées du site d'appel : " + CTX.join(", ") + "\n");
for (const i of ["LES DEUX, RIEN NE LE NOMME", "MESURE seule", "ROBOT seul", "HORS CHAÎNE",
  "les deux, nommé par une garde"]) {
  const l = par.get(i) || [];
  console.log("### " + i + "  —  " + l.length + " / " + REGLAGES.length);
  for (const x of l) {
    console.log("    " + x.k.padEnd(16) + (x.via ? "  [au robot par " + x.via + "]" : "")
      + (x.g.length ? "  ← " + x.g.join(", ") : ""));
  }
  console.log("");
}
