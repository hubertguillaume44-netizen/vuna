// STATUT · CAUSE ÉTABLIE — défaut LIVRÉ et RAPPORTÉ (en-tête du .mq5 lu par l'utilisateur
// dans MetaEditor : « Filtres générés : aucun » sous « Mesuré : 237 trades », rejeu au
// testeur 316 trades contre 315 sans filtre) ; mécanisme, correctif et les deux sens du
// refus MESURÉS DANS LE DÉPÔT, en appelant le générateur et le prédicat du produit.
//
// ANGLE MORT, EN TÊTE — le prédicat porte DEUX COUCHES, et aucune ne rattrape
// l'aveuglement de l'autre :
//   · la PRÉSENCE, contre `v.filtres` — la seule source indépendante de la
//     reconstruction d'état, donc la seule qui voie un état EFFACÉ en amont. Son
//     vocabulaire diffère de celui du robot (« Plus haut » contre « sous résistance »),
//     donc elle ne peut comparer que « y en a-t-il ? » ;
//   · le COMPTE, terme à terme sur les TYPES du moteur — elle voit une perte PARTIELLE,
//     et elle ne peut PAS voir un état effacé, puisque ses deux côtés en descendent.
// Ce qu'aucune des deux ne prouve : qu'un des deux côtés décrive JUSTE la mesure. Un
// libellé faux et un robot faux du même côté les laisseraient vertes — la forme de
// `meme-horloge`, où le défaut n'est que dans le désaccord.
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
const brut = new Function("return function " + corps + ";")();
/** Le prédicat lit `this.etatDeLigne` et `this.cfgCourante` : on lui donne un porteur
 *  dont les deux sont pilotés par le cas, pour exercer la couche des TYPES sans monter
 *  l'application entière. Ce que ça ne prouve pas — que les vrais appels soient faits —
 *  est tenu par le troisième test, sur ce qui AGIT dans le corps. */
const filtresPerdus = (v, txt, types) => brut.call({
  etatDeLigne: () => ({}),
  cfgCourante: () => (types === undefined ? { filtres: [] } : { filtres: (types || []).map((t) => ({ type: t })) }),
}, v, txt);

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
const types = (txt) => (/Types émis\s*:\s*(.+?)\s*$/m.exec(txt) || [])[1];

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
  assert.equal(filtresPerdus({ filtres: "Plus haut D1" }, arme, ["sous_resistance"]), "",
    "faux refus sur le cas NORMAL : ligne filtrée, robot filtré, mêmes types.");
  assert.equal(filtresPerdus({ filtres: "Aucun filtre" }, nu, []), "",
    "faux refus sur le cas NORMAL : ligne sans filtre, robot sans filtre.");

  // ————— LA PERTE PARTIELLE, QUE LA PRÉSENCE NE VOIT PAS —————
  // Le défaut du 20/09 éteignait les neuf filtres d'un coup : la présence suffisait. La
  // prochaine perte sera d'UN filtre, et les deux booléens vaudront « vrai » des deux
  // côtés — « un désancrage PARTIEL est invisible à une prise qui compte zéro », sur un
  // ensemble au lieu d'un zéro.
  const troisPourUn = filtresPerdus({ filtres: "RSI D1 \u00b7 ADX D1 \u00b7 Plus haut D1" },
    arme, ["rsi", "adx", "sous_resistance"]);
  assert.ok(troisPourUn,
    "une mesure à TROIS filtres et un robot qui n'en émet qu'UN s'accordent : la "
    + "confrontation est restée un booléen sur une population.");
  assert.match(troisPourUn, /MANQUE\s*:\s*adx, rsi/,
    "le refus ne NOMME pas les types perdus. Obtenu : " + troisPourUn);

  const enTrop = String(filtresPerdus({ filtres: "Plus haut D1" }, arme, []));
  assert.match(enTrop, /EN TROP\s*:\s*sous_resistance/,
    "un filtre émis que la mesure ne porte pas n'est pas nommé. Obtenu : " + enTrop);

  // LA LIGNE MACHINE est ce qui rend le terme à terme possible : sans elle il ne reste
  // que deux phrases françaises écrites dans deux vocabulaires.
  assert.equal(types(arme), "sous_resistance",
    "le robot ne déclare plus ses TYPES émis : les deux côtés redeviennent "
    + "incomparables. Obtenu : " + JSON.stringify(types(arme)));
  assert.equal(types(nu), "aucun",
    "la ligne des types ne dit plus « aucun » sur un robot sans filtre.");

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
