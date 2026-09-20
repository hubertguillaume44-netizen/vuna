// STATUT · CAUSE ÉTABLIE — défaut MESURÉ DANS LE DÉPÔT (un état à stop suiveur rendait
// un `.mq5` sans une ligne de sécurisation, sous un en-tête annonçant la mesure de la
// ligne) ; le correctif et les deux sens de la partition MESURÉS ICI, en appelant le
// ternaire du produit et le prédicat du générateur.
//
// ANGLE MORT, EN TÊTE — elle tient que les deux côtés NOMMENT les mêmes sorties et que
// chacune a une porte. Elle ne tient pas que le robot ÉCRIVE juste les deux qu'il
// accepte : la fidélité de `be_progressif` est le sujet du port des paliers, pas celui
// de cette garde. Et rien ici n'exécute MQL5.
//
// SECOND ANGLE MORT, celui du faux refus (règle 16) : les trois cas qui doivent PASSER
// sont éprouvés — `btBE` éteint, `be_progressif` avec paliers, `be_progressif` sans un
// seul palier armé. Ce qui n'est pas éprouvé, c'est une quatrième façon d'arriver à
// « aucun » que le ternaire n'écrirait pas.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filtresBloquants, sortieSecu, genererMQ5 } from "../../robot-mt5.js";
import { borne } from "../lib/tranche.mjs";

const APP = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const ROBOT = readFileSync(new URL("../../robot-mt5.js", import.meta.url), "utf8");

// ————— SOURCE 1 · LE TERNAIRE DU PRODUIT, extrait et JOUÉ, jamais réécrit —————
// Un port réécrit ici mesurerait une règle que personne n'exécute. On s'ancre sur ce
// qui AGIT — l'affectation `securisation:` — et `borne` JETTE si elle la perd.
const TERNAIRE = APP.slice(
  borne(APP, "        securisation: !s.btBE ? { type: 'aucun' }"),
  borne(APP, "\n      },\n      frais:"),
).replace(/^\s*securisation:\s*/, "").replace(/,\s*$/, "");
// eslint-disable-next-line no-new-func
const resoudre = new Function("s", "self", "return (" + TERNAIRE.replace(/\bthis\./g, "self.") + ");");
const secuDuProduit = (etat) => resoudre(etat, { paliers: (s) => [[s.beSeuil1, s.beNiveau1]].filter((x) => Number(x[0]) > 0) });

// ————— SOURCE 2 · LA PARTITION DU GÉNÉRATEUR, découverte dans ses déclarations —————
const cles = (nom) => {
  const i = borne(ROBOT, "const " + nom + " = {");
  const bloc = ROBOT.slice(i, borne(ROBOT, "};", i));
  return [...bloc.matchAll(/(\w+)\s*:/g)].map((m) => m[1]);
};
const BLOQUANTES = cles("SORTIES_BLOQUANTES");
const ECRITES = cles("SORTIES_ECRITES");

/** Les états qui produisent chaque sortie — bâtis, puis VÉRIFIÉS par le ternaire. */
const ETATS = {
  aucun: { btBE: false, typeSecu: "trailing", trailingPct: 1.5 },
  trailing: { btBE: true, typeSecu: "trailing", trailingPct: 1.5 },
  be_progressif: { btBE: true, typeSecu: "paliers", beSeuil1: 50, beNiveau1: 0 },
  be_sans_palier: { btBE: true, typeSecu: "paliers", beSeuil1: 0, beNiveau1: 0 },
};

test("toute sécurisation que la mesure produit a une porte, dans un sens ou dans l'autre", () => {
  // ————— LA PRISE, AVANT LE VERDICT —————
  // Un ternaire qui aurait perdu ses littéraux rendrait un ensemble vide, et la
  // partition passerait sur du décor.
  const duProduit = [...new Set([...TERNAIRE.matchAll(/type:\s*'(\w+)'/g)].map((m) => m[1]))];
  assert.ok(duProduit.length >= 3,
    "moins de trois sorties découvertes dans le ternaire de `cfgCourante` — la "
    + "découverte est désancrée, pas la partition. Obtenu : " + JSON.stringify(duProduit));
  assert.ok(BLOQUANTES.length >= 1 && ECRITES.length >= 2,
    "les deux tables du générateur ne se lisent plus : bloquantes=" + JSON.stringify(BLOQUANTES)
    + " écrites=" + JSON.stringify(ECRITES));

  // ————— LA CONFRONTATION, DANS LES DEUX SENS —————
  const declarees = [...BLOQUANTES, ...ECRITES];
  const sansPorte = duProduit.filter((t) => !declarees.includes(t));
  assert.deepEqual(sansPorte, [],
    "la mesure peut produire une sécurisation que le générateur ne déclare NI savoir "
    + "écrire NI refuser : elle descendrait en silence, comme le stop suiveur le "
    + "faisait. Sans porte : [" + sansPorte.join(", ") + "] · le ternaire rend ["
    + duProduit.join(", ") + "] · le générateur déclare [" + declarees.join(", ") + "]");
  const orphelines = declarees.filter((t) => !duProduit.includes(t));
  assert.deepEqual(orphelines, [],
    "le générateur déclare une sécurisation que la mesure ne produit plus : une entrée "
    + "sans membre fait du registre une liste de tolérances (échec dans les deux sens). "
    + "Orphelines : [" + orphelines.join(", ") + "]");
  const deuxFois = declarees.filter((t) => BLOQUANTES.includes(t) && ECRITES.includes(t));
  assert.deepEqual(deuxFois, [], "une sortie est à la fois écrite et bloquante : ["
    + deuxFois.join(", ") + "]");
});

test("le miroir `sortieSecu` rend ce que le ternaire du produit rend", () => {
  // Deux lectures d'un seul fait — le défaut ne serait dans aucune des deux prise
  // seule, il serait dans leur désaccord. La forme de `meme-horloge`.
  for (const [nom, etat] of Object.entries(ETATS)) {
    const attendu = secuDuProduit(etat).type;
    assert.equal(sortieSecu(etat), attendu,
      "cas « " + nom + " » : `cfgCourante` mesure une sécurisation « " + attendu
      + " » et le générateur en lit « " + sortieSecu(etat) + " ». Le robot décide alors "
      + "sur une sécurisation que personne ne mesure.");
  }
});

test("le stop suiveur est refusé, et les trois cas légitimes passent", () => {
  const dits = (etat) => filtresBloquants(etat);

  // LE CAS FONDATEUR : la mesure sécurise, le robot n'a rien à écrire.
  const refus = dits(ETATS.trailing);
  assert.ok(refus.length,
    "un état à stop suiveur n'est pas refusé : le robot descendrait SANS AUCUNE "
    + "sécurisation pendant que la ligne affiche « stop suiveur ». Une sécurisation "
    + "absente ne change pas un nombre de trades — elle change ce qui arrive à une "
    + "position ouverte.");
  assert.match(refus.join(", "), /suiveur/i,
    "le refus ne NOMME pas le stop suiveur : un refus qui ne nomme pas son réglage "
    + "envoie chercher ailleurs. Obtenu : " + JSON.stringify(refus));

  // LES FAUX REFUS (règle 16) — les trois états qui doivent rendre un bouton actif.
  for (const nom of ["aucun", "be_progressif", "be_sans_palier"]) {
    assert.deepEqual(dits(ETATS[nom]), [],
      "faux refus sur le cas NORMAL « " + nom + " » : " + JSON.stringify(dits(ETATS[nom]))
      + ". Une garde qu'il faut désarmer pour travailler ne garde rien.");
  }
});

test("le générateur refuse aussi à l'émission, et non seulement à l'infobulle", () => {
  // Le bouton grisé est un signal ; le refus qui compte est celui qui empêche le
  // fichier d'exister. Les deux lisent la même fonction — on vérifie le second, parce
  // que c'est lui qui a laissé passer le robot du 20/09.
  const cfg = { sym: "GOLD", sens: "achat", ligne: "mediane", periode: 7, sl: 0.7, rr: 1.5 };
  const ctx = { risquePct: 1, ut: "D1", hasard: "non contrôlé", spreadMaxPct: 0.05,
    stamp: "260920_1153", magic: 1234, paliers: [] };
  assert.throws(() => genererMQ5(cfg, { ...ctx, etat: ETATS.trailing }), /suiveur/i,
    "le générateur produit un `.mq5` depuis un état à stop suiveur : `ctx.paliers` rend "
    + "`[]` pour « aucun » ET pour « suiveur », donc rien en aval ne peut plus les "
    + "distinguer — c'est exactement l'aveuglement que la porte ferme.");
  assert.doesNotThrow(() => genererMQ5(cfg, { ...ctx, etat: ETATS.be_progressif }),
    "faux refus à l'émission sur une sécurisation par paliers.");
});
