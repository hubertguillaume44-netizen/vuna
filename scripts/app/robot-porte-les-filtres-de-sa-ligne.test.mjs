// STATUT · CAUSE ÉTABLIE — défaut LIVRÉ et RAPPORTÉ (en-tête du .mq5 lu par l'utilisateur
// dans MetaEditor : « Filtres générés : aucun » sous « Mesuré : 237 trades », rejeu au
// testeur 316 trades contre 315 sans filtre) ; mécanisme, correctif et les deux sens du
// refus MESURÉS DANS LE DÉPÔT, en appelant le générateur et le prédicat du produit.
//
// ANGLE MORT, EN TÊTE — elle confronte deux TEXTES : le libellé que la ligne porte
// (`v.filtres`) et la ligne « Filtres générés » du robot produit. Elle ne prouve pas que
// l'un des deux décrit JUSTE la mesure — seulement qu'ils ne peuvent plus se contredire.
// Un libellé de ligne faux et un robot faux du même côté la laisseraient verte. C'est la
// forme de `meme-horloge` : le défaut n'est dans aucun maillon pris seul, il est dans
// leur désaccord — et c'est le désaccord qui a coûté le rejeu.
//
// SECOND ANGLE MORT, celui du faux refus (règle 16) : la troisième issue — « la ligne
// n'enregistre pas ses filtres » — refuse. `ligneBt()` et `basculerValide` posent tous
// deux le champ aujourd'hui, donc la population devrait être vide ; mais c'est une mesure
// sur les données de quelqu'un, pas sur une fixture, et elle n'a pas été faite.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { genererMQ5 } from "../../robot-mt5.js";
import { borne } from "../lib/tranche.mjs";

const SRC = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");

/** Le prédicat du PRODUIT, extrait et joué tel quel — jamais réécrit ici. Un port réécrit
 *  mesurerait une règle que personne n'exécute. */
const corps = SRC.slice(borne(SRC, "  filtresPerdus(v, txt) {"),
  borne(SRC, "\n  async exporterRobotBrut(v) {"));
// eslint-disable-next-line no-new-func
const filtresPerdus = new Function("return function " + corps + ";")();

const ETAT_BASE = { btMtf: false, fPente: false, fRsi: false, fAdx: false, fNuage: false,
  fPivot: false, fZone: false, fMa: false, btDelai: 0, btFenDeb: 0, btFenFin: 0 };
const AVEC = { ...ETAT_BASE, fResist: true, utResist: "D1", resistLookback: 20, resistMarge: 1 };
const SANS = { ...ETAT_BASE, fResist: false };

function robot(etat) {
  return genererMQ5({ sym: "GOLD", sens: "achat", ligne: "mediane", periode: 7,
    sl: 0.7, rr: 1.5, n: 237, total: 54.7, rAn: 8.2 },
  { etat, risquePct: 1, ut: "D1", hasard: "non contrôlé", spreadMaxPct: 0.05,
    stamp: "260920_1153", magic: 1234 });
}
const enTete = (txt) => (/Filtres générés\s*:\s*(.+?)\s*$/m.exec(txt) || [])[1];

test("un robot sans filtre ne descend pas sous une ligne qui en nomme un", () => {
  const nu = robot(SANS);
  const arme = robot(AVEC);

  // ————— LA PRISE, AVANT LE VERDICT —————
  // Sans elle, un générateur qui n'émettrait plus d'en-tête du tout rendrait les deux
  // états identiques et tout ce qui suit passerait sur du décor.
  assert.equal(enTete(nu), "aucun",
    "le générateur n'émet plus « aucun » quand l'état ne porte aucun filtre : la "
    + "confrontation n'a plus ses deux états. Obtenu : " + JSON.stringify(enTete(nu)));
  assert.match(String(enTete(arme)), /sous résistance/,
    "le générateur n'émet plus le filtre quand l'état le porte — obtenu : "
    + JSON.stringify(enTete(arme)));

  // LE CAS FONDATEUR, à l'octet près : la ligne annonce son filtre, le fichier dit
  // « aucun ». C'est exactement ce qui est descendu le 20/09/2026.
  const dit = filtresPerdus({ filtres: "Plus haut D1 · plus haut 20 · marge 1 %" }, nu);
  assert.ok(dit, "le cas LIVRÉ passe : une ligne qui nomme un filtre a produit un robot "
    + "annonçant « Filtres générés : aucun », et le refus ne s'est pas déclenché.");
  assert.match(dit, /Plus haut/, "le refus ne cite pas ce que la LIGNE porte : "
    + "un refus qui ne nomme pas les deux sources n'est pas confrontable. Obtenu : " + dit);
  assert.match(dit, /aucun/, "le refus ne cite pas ce que le FICHIER porte. Obtenu : " + dit);

  // ————— ET DANS L'AUTRE SENS —————
  // Un filtre ÉMIS que la ligne ne porte pas est le défaut symétrique : le robot
  // mesurerait autre chose que la ligne, et personne ne le verrait davantage.
  const inverse = filtresPerdus({ filtres: "Aucun filtre" }, arme);
  assert.ok(inverse, "le sens symétrique passe : un robot qui porte un filtre que la "
    + "ligne n'annonce pas descendrait sans un mot.");
  assert.match(inverse, /Aucun filtre/, "le refus symétrique ne cite pas la ligne. Obtenu : " + inverse);

  // ————— LES DEUX ACCORDS NE REFUSENT RIEN (règle 16) —————
  assert.equal(filtresPerdus({ filtres: "Plus haut D1" }, arme), "",
    "faux refus sur le cas NORMAL : ligne filtrée, robot filtré.");
  assert.equal(filtresPerdus({ filtres: "Aucun filtre" }, nu), "",
    "faux refus sur le cas NORMAL : ligne sans filtre, robot sans filtre.");

  // ————— LA TROISIÈME ISSUE : « je ne sais pas » n'est pas « aucun » —————
  const muet = filtresPerdus({}, nu);
  assert.ok(muet, "une ligne qui n'enregistre pas ses filtres passe : elle serait lue "
    + "comme une ligne SANS filtres, ce qui est exactement l'erreur à fermer.");
  assert.match(muet, /IGNORE/, "la troisième issue ne se distingue pas de « aucun filtre » "
    + "dans son message — c'est la distinction qui a coûté le rejeu. Obtenu : " + muet);
});

test("le chemin d'export APPELLE le prédicat, et avant d'écrire quoi que ce soit", () => {
  const bloc = SRC.slice(borne(SRC, "  async exporterRobotBrut(v) {"),
    borne(SRC, "\n    a.click();"));
  const iAppel = bloc.indexOf("this.filtresPerdus(v, txt)");
  assert.ok(iAppel > 0,
    "`exporterRobotBrut` n'appelle plus `filtresPerdus` : le prédicat ci-dessus mesure "
    + "une règle que personne n'exécute.");
  // La trace du Journal et le téléchargement viennent APRÈS : un refus qui arriverait
  // après l'écriture laisserait le registre annoncer un robot qui n'est pas descendu.
  const iTrace = bloc.indexOf("this.ecrireLive(m)");
  assert.ok(iTrace > iAppel,
    "la trace du Journal est écrite AVANT la confrontation : un robot refusé y serait "
    + "quand même inscrit, et le registre annoncerait un fichier qui n'existe pas.");
});

// ————— ÉPROUVÉE PAR MUTATION —————
//
// 1 · le refus retiré du chemin d'export (`this.filtresPerdus(v, txt)` en
//     `''` /*MUT*/) : le second test tombe en disant que le prédicat n'est plus appelé.
// 2 · la troisième issue CONFONDUE avec « aucun » — le repli de `dit` passé de `''` à
//     `'Aucun filtre'` — : le premier test tombe sur « une ligne qui n'enregistre pas ses
//     filtres passe : elle serait lue comme une ligne SANS filtres ». C'est la mutation
//     qui modélise le défaut réel : elle ne fait pas taire le prédicat, elle lui fait
//     lire « je ne sais pas » comme « rien ».
//     (Une première version mutait `if (!dit)` en `if (false)`. Elle rougissait, et sur
//     la BONNE assertion — mais par un autre chemin : la ligne vide retombait dans la
//     branche du désaccord. Relue plutôt que crue, refaite pour ne toucher QUE le fait
//     visé, comme la règle de la mutation voisine le demande.)
// 3 · la confrontation réduite à un seul sens — `|| !aLaLigne` ajouté à la sortie
//     d'accord — : le test tombe sur « le sens symétrique passe : un robot qui porte un
//     filtre que la ligne n'annonce pas descendrait sans un mot ».
// 4 · l'appel déplacé APRÈS `ecrireLive` : le second test tombe en nommant le registre.
