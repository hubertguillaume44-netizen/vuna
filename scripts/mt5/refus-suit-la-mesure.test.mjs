// STATUT · CAUSE ÉTABLIE — faux refus RAPPORTÉ (hypothèse d'un brief utilisateur, non
// mesurée par lui), cause et correctif MESURÉS DANS LE DÉPÔT, sur la source des deux
// fonctions et en les appelant.
//
// ————— LE REFUS D'EXPORT DOIT JUGER CE QUE LA MESURE PORTE —————
//
// `cfgCourante` construit la configuration RÉSOLUE d'une ligne. Deux filtres y sont
// poussés sous `&& !vente` : à la vente, « sous résistance » et « hors zone de
// résistance » n'ont pas de symétrique utile, donc la mesure ne les porte pas.
//
// `filtresBloquants` décide si le robot peut être écrit. Il lisait les cases cochées.
// Sur une ligne VENDEUSE portant l'une de ces cases, la mesure ne portait aucun filtre
// de résistance et le robot refusait quand même : un geste retiré à quelqu'un qui n'a
// rien fait de mal. C'est la règle 1 — une intention (« la case est-elle cochée ? »)
// pour un résultat (« la mesure porte-t-elle ce filtre ? ») —, et un faux refus sur le
// cas normal, qui est ce qui fait désarmer une garde (règle 16).
//
// LA GARDE LIE LES DEUX FONCTIONS, elle n'en éprouve aucune séparément. C'est la forme
// de `manifeste-version` et de `meme-horloge` : prise isolément, chacune est
// défendable — `cfgCourante` a le droit de retirer un filtre, `filtresBloquants` a le
// droit de refuser une case. Le défaut n'est dans aucune des deux, il est dans leur
// DÉSACCORD.
//
// ELLE DÉCOUVRE, elle n'énumère pas (règle 7). Le jeu des filtres retirés à la vente se
// lit dans la source de `cfgCourante`, sur ce qui AGIT — un `filtres.push` gaté par
// `&& !vente` —, jamais sur un nom de filtre qui pourrait vivre dans de la prose
// (règle 3). Un troisième filtre qui gagnerait ce gâteau demain fait tomber cette garde
// dans `robot-mt5.js`, sans que personne l'ait nommé ici.
//
// ANGLE MORT DÉCLARÉ, EN TÊTE (règle 9) : elle tient l'accord sur le SENS tel que
// `cfgCourante` le lit — `etat.btSens`. Elle ne prouve pas que `cfg.sens`, dont
// `genererMQ5` dérive son propre `vente` pour ÉCRIRE le code, vaut toujours la même
// chose. Les deux descendent de `sens` sur la ligne et ne peuvent diverger qu'en amont
// des deux fonctions mesurées ici ; c'est une propriété de l'application, antérieure à
// ce correctif et non touchée par lui. Relevé, non fermé.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { borne } from "../lib/tranche.mjs";
import { filtresBloquants } from "../../robot-mt5.js";

const SRC = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const I_CFG = borne(SRC, "  cfgCourante(sym, periode, sl, rr, etat, plus) {");
const CFG = SRC.slice(I_CFG, borne(SRC, "\n  }", I_CFG));

const ROBOT = readFileSync(new URL("../../robot-mt5.js", import.meta.url), "utf8");

// ce qui AGIT, de chaque côté : une poussée de filtre gatée sur l'absence de vente
// dans la mesure, une déclaration dans le générateur.
function retiresALaVente() {
  return [...CFG.matchAll(/if \(s\.(\w+) && !vente\) filtres\.push/g)].map((m) => m[1]).sort();
}
function declaresSansSymetrique() {
  const d = ROBOT.slice(borne(ROBOT, "const SANS_SYMETRIQUE_VENDEUR = {"));
  return [...d.slice(0, borne(d, "};")).matchAll(/(\w+):/g)].map((m) => m[1]).sort();
}

test("le jeu retiré par la MESURE et le jeu déclaré par le GÉNÉRATEUR sont le même", () => {
  // ————— UNE PRISE QUI NE VÉRIFIE QUE « PAS ZÉRO » SE LAISSE RÉTRÉCIR —————
  // Premier jet : cette prise demandait seulement que la découverte ne soit pas vide.
  // Éprouvée par mutation — on réécrit UN des deux gâteaux en `!vente && s.fResist` —,
  // elle est restée VERTE : le motif perdait `fResist` et trouvait encore `fZone`, donc
  // le jeu n'était pas vide et les trois assertions suivantes passaient sur la moitié
  // d'une population. Un désancrage PARTIEL est invisible à une prise qui compte zéro,
  // et c'est la forme que ce dépôt connaît sous « un compteur à zéro sans dénominateur
  // a deux sens », un cran plus bas : ici il ne s'agit même pas de zéro.
  //
  // La prise est donc la CONFRONTATION des deux sources, et elle échoue dans les deux
  // sens (la forme de `boucles-mql5`) : un filtre gaté que le générateur ne déclare pas,
  // un filtre déclaré qui n'est plus gaté, ou un motif qui en perd un en route font
  // tomber la même assertion, en nommant de quel côté le membre manque.
  const mesure = retiresALaVente();
  const genere = declaresSansSymetrique();
  assert.ok(mesure.length > 0,
    "aucun `filtres.push` gaté par `&& !vente` trouvé dans `cfgCourante` : l'ancre a "
    + "perdu sa prise. Ce n'est pas « plus aucun filtre n'est retiré à la vente » — "
    + "c'est que la garde ne sait plus où regarder, et tout ce qui suit serait vert "
    + "sur du vide.");
  assert.deepEqual(mesure, genere,
    "la mesure retire [" + mesure.join(", ") + "] à la vente ; le générateur déclare "
    + "[" + genere.join(", ") + "] comme étant sans symétrique vendeur. Le défaut n'est "
    + "dans aucune des deux listes prise seule — il est dans leur DÉSACCORD : un filtre "
    + "gaté et non déclaré sera refusé à tort sur une vente, un filtre déclaré et non "
    + "gaté sera offert alors que la mesure le porte.");
});

test("un filtre que la MESURE retire à la vente n'est pas refusé à l'export", () => {
  const jeu = retiresALaVente();
  const encore = jeu.filter((k) => filtresBloquants({ [k]: true, btSens: "vente" }).length);
  assert.deepEqual(encore, [],
    "à la vente, `cfgCourante` RETIRE " + encore.join(", ") + " de la configuration "
    + "mesurée, et `filtresBloquants` le refuse quand même. Le robot n'a rien à "
    + "reproduire : c'est un FAUX REFUS, et il retire un geste sans recours — pas de "
    + "case à décocher, pas d'interrupteur à désarmer, juste un bouton éteint sur une "
    + "ligne parfaitement exportable. Le refus doit juger ce que la MESURE porte, pas "
    + "ce que la case annonce.");
});

test("et il reste refusé à l'ACHAT, où la mesure le porte", () => {
  // ————— L'ERREUR SYMÉTRIQUE EST LA PIRE DES DEUX —————
  // Retirer le refus tout court ferait descendre un robot amputé de son filtre, donc
  // un nombre de trades différent de la mesure : un chiffre faux qui a l'air d'un
  // chiffre. Sans cette moitié, la correction ci-dessus passerait en supprimant le
  // refus au lieu de le restreindre.
  const jeu = retiresALaVente();
  const muets = jeu.filter((k) => !filtresBloquants({ [k]: true, btSens: "achat" }).length);
  assert.deepEqual(muets, [],
    "à l'achat, la mesure PORTE " + muets.join(", ") + " et l'export ne le refuse plus. "
    + "Livrer le robot sans ce filtre donnerait un nombre de trades différent de celui "
    + "qui est affiché.");
});

test("un état sans sens retombe sur le REFUS, jamais sur l'offre", () => {
  // Le côté sûr se choisit, il ne se constate pas : un geste offert à tort livre un
  // robot qui ne reproduit pas la mesure ; un geste refusé à tort se voit et se
  // rapporte. La garde le fige plutôt que de le laisser dépendre d'un défaut de langage.
  for (const k of retiresALaVente()) {
    assert.ok(filtresBloquants({ [k]: true }).length,
      "sans `btSens`, " + k + " n'est plus refusé : un état muet sur le sens est traité "
      + "comme une vente. C'est le mauvais côté du doute.");
  }
});

test("aucun libellé du produit n'affirme une IMPOSSIBILITÉ de transposition", () => {
  // ————— LE DÉPÔT DIT CHANTIER ; L'ÉCRAN DISAIT FATALITÉ —————
  // Le commentaire au-dessus de la table `INCONNUS` écrit noir sur blanc qu'aucun des
  // quatre filtres n'est intransposable — le robot garde déjà les hauts de ses seaux,
  // et « sous résistance » coûte une dizaine de lignes. Les libellés, eux, disaient
  // « n'a pas d'équivalent MQL5 fidèle » : une propriété permanente là où il y a du
  // code qui manque. Ce que ça change pour le lecteur n'est pas cosmétique — c'est
  // renoncer au filtre ou l'attendre.
  //
  // ANGLE MORT DÉCLARÉ, EN TÊTE (règle 9) : elle attrape LA FORMULE, pas la classe. Une
  // autre façon de dire la même fatalité — « impossible à transposer », « ne sera
  // jamais écrit » — lui échapperait. Lui apprendre un motif de plus à chaque essai est
  // la course que la règle 3 refuse, et la classe « ce libellé affirme-t-il une
  // impossibilité ? » n'a pas de forme qu'un test puisse lire : c'est de la prose. Ce
  // qu'elle ferme est ce qui s'est produit — la RÉINTRODUCTION d'une formule courte,
  // évidente et déjà écrite quatre fois. S'ancrer sur l'ABSENCE (règle 14, troisième
  // issue) est tout ce qu'on peut honnêtement garder ici.
  //
  // Elle lit les CHAÎNES émises, jamais la prose : UN commentaire du produit raconte
  // encore l'ancien libellé, et il a le droit de le citer (règle 3). Elle n'a pas
  // besoin de s'exclure nommément — elle ne lit ni son propre fichier ni CLAUDE.md,
  // donc l'interdit qu'elle épelle ne vit pas dans sa population.
  const fautifs = [];
  for (const [nom, src] of [["Vuna.dc.html", SRC], ["robot-mt5.js", ROBOT]]) {
    for (const m of src.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)) {
      if (/MQL5/.test(m[1]) && /(n\\u2019|n')(a|ont) pas d/.test(m[1])) {
        fautifs.push(nom + " : « " + m[1].slice(0, 90) + " »");
      }
    }
  }
  assert.deepEqual(fautifs, [],
    "un libellé affirme qu'un réglage n'a pas d'équivalent MQL5 :\n  "
    + fautifs.join("\n  ")
    + "\n\nCe n'est pas ce que le dépôt sait. Le commentaire de `INCONNUS` dit que les "
    + "quatre filtres sont transposables et que le refus est un chantier non fait. Un "
    + "libellé qui annonce une impossibilité fait renoncer au filtre ; un libellé qui "
    + "annonce un chantier laisse le choix d'attendre. Écrivez « n'est pas encore "
    + "transposé en MQL5 ».");
});
