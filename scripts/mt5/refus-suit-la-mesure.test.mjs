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
import * as espree from "espree";

// ————— CE QUI EST ÉMIS, PAS CE QUI EST ÉCRIT —————
// Rend le texte de chaque chaîne du source, les chaînes d'un `+` APLATIES en une. Deux
// littéraux concaténés redeviennent la phrase qu'ils composent, et un échappement
// redevient son caractère : la garde cesse de dépendre de la façon dont le texte est
// coupé ou épelé. Un fichier qu'espree refuse LÈVE, avec sa raison — le taire rendrait
// la garde aveugle sur ce fichier sans rougir.
function textesEmis(src, genre) {
  const blocs = genre === "module" ? [src]
    : [...src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter((m) => !/\bsrc\s*=/.test(m[1])).map((m) => m[2]);
  const out = [];
  for (const code of blocs) {
    let arbre;
    try {
      arbre = espree.parse(code, { ecmaVersion: 2023, sourceType: "module", loc: true });
    } catch (e) {
      throw new Error("espree refuse un bloc de source : " + e.message
        + " — la garde ne saute pas en silence, elle serait aveugle sur ce bloc.");
    }
    const plat = (n) => {
      if (n.type === "Literal" && typeof n.value === "string") return n.value;
      if (n.type === "TemplateLiteral" && !n.expressions.length) return n.quasis[0].value.cooked;
      if (n.type === "BinaryExpression" && n.operator === "+") {
        const g = plat(n.left), d = plat(n.right);
        if (g === null && d === null) return null;
        return (g === null ? "\u0000" : g) + (d === null ? "\u0000" : d);
      }
      return null;
    };
    const vus = new Set();
    const marcher = (n, dansPlus) => {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) { for (const x of n) marcher(x, dansPlus); return; }
      if (n.type === "BinaryExpression" && n.operator === "+" && !dansPlus) {
        const t = plat(n);
        if (t !== null) { out.push(t); for (const y of noeudsDe(n)) vus.add(y); }
      }
      if (n.type === "Literal" && typeof n.value === "string" && !vus.has(n)) out.push(n.value);
      for (const k of Object.keys(n)) {
        if (k === "loc" || k === "range" || k === "parent") continue;
        marcher(n[k], dansPlus || (n.type === "BinaryExpression" && n.operator === "+"));
      }
    };
    marcher(arbre, false);
  }
  return out;
}
function* noeudsDe(n) {
  if (!n || typeof n !== "object") return;
  if (Array.isArray(n)) { for (const x of n) yield* noeudsDe(x); return; }
  if (typeof n.type === "string") yield n;
  for (const k of Object.keys(n)) {
    if (k === "loc" || k === "range" || k === "parent") continue;
    yield* noeudsDe(n[k]);
  }
}
const NEUF_SRC = /pas encore transpos\u00e9 en MQL5/;

const SRC = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const I_CFG = borne(SRC, "  cfgCourante(sym, periode, sl, rr, etat, plus) {");
const CFG = SRC.slice(I_CFG, borne(SRC, "\n  }", I_CFG));

const ROBOT = readFileSync(new URL("../../robot-mt5.js", import.meta.url), "utf8");

const HARNAIS = readFileSync(new URL("./config.mjs", import.meta.url), "utf8");

// ce qui AGIT, de chaque côté. La MESURE donne aussi la correspondance drapeau → type,
// puisque c'est la même ligne qui décide et qui nomme : pas de table à tenir à jour.
function retiresALaVente() {
  return [...CFG.matchAll(/if \(s\.(\w+) && !vente\) filtres\.push\(\{ type: '(\w+)'/g)]
    .map((m) => ({ drapeau: m[1], type: m[2] }))
    .sort((x, y) => x.drapeau < y.drapeau ? -1 : 1);
}
function declaresSansSymetrique() {
  const d = ROBOT.slice(borne(ROBOT, "const SANS_SYMETRIQUE_VENDEUR = {"));
  return [...d.slice(0, borne(d, "};")).matchAll(/(\w+):/g)].map((m) => m[1]).sort();
}
// le HARNAIS : `mirroirVente` retire les types sans symétrique avant de bâtir la
// configuration contre laquelle la fidélité du robot se mesure.
function retiresParLeHarnais() {
  const l = HARNAIS.slice(borne(HARNAIS, "export function mirroirVente(filtres) {"));
  const ligne = l.slice(0, borne(l, "continue;"));
  return [...ligne.matchAll(/f\.type === "(\w+)"/g)].map((m) => m[1]).sort();
}

test("les TROIS sources du miroir de vente disent le même jeu", () => {
  // ————— UNE PAIRE VÉRIFIÉE SUR UN TRIPLET EST UNE POPULATION CHOISIE —————
  // Première forme : elle confrontait DEUX sources — la mesure et le générateur — et
  // c'est elle qui a rendu le faux refus visible. Il y en a trois. `mirroirVente`, dans
  // le harnais, retire les mêmes types avant de bâtir la configuration CONTRE LAQUELLE
  // la fidélité du robot se mesure : un troisième filtre ajouté demain aux deux premières
  // passerait au vert pendant que le harnais continuerait de le transmettre au moteur.
  // Le harnais mesurerait alors une configuration que l'application ne mesure pas, et
  // l'écart s'imputerait au robot.
  //
  // C'est exactement la classe fermée deux commits plus tôt sur un comptage : vérifier
  // une paire d'un triplet est choisir sa population. Le geste est le même — énumérer
  // les sources, puis les confronter toutes.
  //
  // LES DEUX VOCABULAIRES SE DÉRIVENT DU MÊME ENDROIT : la ligne de `cfgCourante` qui
  // gate le filtre NOMME aussi son type. Aucune table à tenir à jour (règle 8).
  const mesure = retiresALaVente();
  const drapeaux = mesure.map((x) => x.drapeau);
  const types = mesure.map((x) => x.type).sort();
  const genere = declaresSansSymetrique();
  const harnais = retiresParLeHarnais();

  assert.ok(mesure.length > 0,
    "aucun `filtres.push({ type: … })` gaté par `&& !vente` trouvé dans `cfgCourante` : "
    + "l'ancre a perdu sa prise. Ce n'est pas « plus aucun filtre n'est retiré à la "
    + "vente » — c'est que la garde ne sait plus où regarder, et les trois confrontations "
    + "qui suivent seraient vertes sur du vide.");

  // ————— ET LA PRISE COUVRE LE DÉSANCRAGE PARTIEL —————
  // « pas vide » ne suffit pas : un motif qui perdrait UN membre laisserait les deux
  // autres s'accorder sur la moitié d'une population. C'est mesuré — la première version
  // de cette garde est restée verte sous exactement cette mutation.
  assert.deepEqual(drapeaux, genere,
    "la mesure retire [" + drapeaux.join(", ") + "] à la vente ; le générateur déclare ["
    + genere.join(", ") + "] comme étant sans symétrique vendeur. Le défaut n'est dans "
    + "aucune des deux listes prise seule — il est dans leur DÉSACCORD : un filtre gaté "
    + "et non déclaré sera refusé à tort sur une vente, un filtre déclaré et non gaté "
    + "sera offert alors que la mesure le porte.");
  assert.deepEqual(types, harnais,
    "la mesure retire les types [" + types.join(", ") + "] à la vente ; `mirroirVente` "
    + "retire [" + harnais.join(", ") + "]. Le harnais bâtit la configuration contre "
    + "laquelle la fidélité du robot se mesure : s'il transmet au moteur un filtre que "
    + "l'application n'y met pas, il compare deux configurations différentes et impute "
    + "l'écart au robot.");
});

test("un filtre que la MESURE retire à la vente n'est pas refusé à l'export", () => {
  const jeu = retiresALaVente();
  const encore = jeu.map((x) => x.drapeau)
    .filter((k) => filtresBloquants({ [k]: true, btSens: "vente" }).length);
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
  // ————— LA POPULATION EST L'INTERSECTION, PAS LE JEU ENTIER —————
  // Un filtre retiré à la vente n'est pas forcément intransposable : `fResist` a quitté
  // `INCONNUS` le jour où il a été porté en MQL5, et il reste sans symétrique vendeur.
  // Exiger qu'il soit encore refusé à l'achat aurait fait de cette garde une LISTE au
  // lieu d'un accord — elle serait tombée sur un port réussi. Les deux faits sont
  // indépendants : « la mesure le porte-t-elle à la vente ? » et « le robot sait-il
  // l'écrire ? ». On ne juge donc que ceux que le générateur déclare encore inconnus.
  const inconnus = [...ROBOT.slice(borne(ROBOT, "const INCONNUS = {"))
    .slice(0, borne(ROBOT.slice(borne(ROBOT, "const INCONNUS = {")), "};"))
    .matchAll(/(\w+):/g)].map((m) => m[1]);
  const muets = jeu.map((x) => x.drapeau).filter((k) => inconnus.includes(k))
    .filter((k) => !filtresBloquants({ [k]: true, btSens: "achat" }).length);
  assert.deepEqual(muets, [],
    "à l'achat, la mesure PORTE " + muets.join(", ") + " et l'export ne le refuse plus. "
    + "Livrer le robot sans ce filtre donnerait un nombre de trades différent de celui "
    + "qui est affiché.");
});

test("un état sans sens retombe sur le REFUS, jamais sur l'offre", () => {
  // Le côté sûr se choisit, il ne se constate pas : un geste offert à tort livre un
  // robot qui ne reproduit pas la mesure ; un geste refusé à tort se voit et se
  // rapporte. La garde le fige plutôt que de le laisser dépendre d'un défaut de langage.
  const inconnus = [...ROBOT.slice(borne(ROBOT, "const INCONNUS = {"))
    .slice(0, borne(ROBOT.slice(borne(ROBOT, "const INCONNUS = {")), "};"))
    .matchAll(/(\w+):/g)].map((m) => m[1]);
  for (const k of retiresALaVente().map((x) => x.drapeau).filter((k) => inconnus.includes(k))) {
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
  // ELLE A ÉTÉ ÉCRITE UNE PREMIÈRE FOIS SUR LE TEXTE BRUT, ET ELLE A LAISSÉ PASSER LA
  // SURFACE QUI COMPTAIT. Deux raisons, et chacune est une figure que ce fichier porte
  // déjà :
  //   · `faireAide` coupe sa phrase en DEUX littéraux — `' n’a pas d’équivalent '` puis
  //     `'MQL5 fidèle.'` — donc aucun littéral pris seul ne portait les deux mots
  //     cherchés. C'est la fragmentation en littéraux, dont le SEUIL était déjà écrit :
  //     « la conclusion n'est pas un troisième prettier-ignore, c'est de concaténer les
  //     littéraux adjacents avant de lire » ;
  //   · elle porte l'apostrophe RÉELLE (U+2019), quand le motif épelait l'échappement
  //     `’` — le miroir exact du piège de `sorties-hors-seance`.
  //
  // La prise change donc de FORME plutôt que de gagner deux motifs (règle 3) : espree
  // lit les `<script>` et rend la valeur des chaînes, donc l'échappement et le
  // caractère réel deviennent le même texte ; et les chaînes d'un `+` sont aplaties,
  // donc la coupure cesse d'exister pour la garde. Il n'y a plus de grammaire à
  // réapprendre au coup par coup.
  //
  // ET ELLE PROUVE SA PRISE : elle exige de voir la formule NEUVE. Une garde qui
  // interdit une chaîne et ne trouve plus rien du tout est verte sur du vide — c'est
  // exactement comme ça qu'on a annoncé quatre surfaces corrigées pour cinq.
  const SOURCES = [["Vuna.dc.html", SRC, "script"], ["robot-mt5.js", ROBOT, "module"]];
  const OLD = /(n'a|n'ont|sans) (pas )?d?'?\s*équivalent[^.]*MQL5|MQL5[^.]*(n'a|n'ont) pas d'équivalent/;
  const NEUF = /pas encore transpos/;
  const fautifs = [];
  let vus = 0;
  for (const [nom, src, genre] of SOURCES) {
    for (const txt of textesEmis(src, genre)) {
      const t = txt.replace(/[‘’ʼ]/g, "'");
      if (NEUF.test(t)) vus++;
      if (OLD.test(t)) fautifs.push(nom + " : « " + t.slice(0, 110) + " »");
    }
  }
  assert.ok(vus >= 2, "la formule « pas encore transposé » n'est rendue que " + vus
    + " fois dans les chaînes émises : la garde ne regarde plus les bons fichiers, et "
    + "son interdit passerait au vert sur du vide.");
  assert.deepEqual(fautifs, [],
    "un libellé affirme qu'un réglage n'a pas d'équivalent MQL5 :\n  "
    + fautifs.join("\n  ")
    + "\n\nCe n'est pas ce que le dépôt sait. Le commentaire de `INCONNUS` dit que les "
    + "quatre filtres sont transposables et que le refus est un chantier non fait. Un "
    + "libellé qui annonce une impossibilité fait renoncer au filtre ; un libellé qui "
    + "annonce un chantier laisse le choix d'attendre. Écrivez « n'est pas encore "
    + "transposé en MQL5 » — et passez par `REFUS_ROBOT`, qui est la seule source.");
});

test("le motif du refus a UNE source, pas une surface par appelant", () => {
  // ————— C'EST LA MOITIÉ QUI FERME LA CLASSE —————
  // Interdire l'ancienne formule empêche la RÉINTRODUCTION ; elle n'empêche pas qu'un
  // sixième appelant recopie la neuve et diverge au renommage suivant. Cinq copies ont
  // produit exactement ça : quatre corrigées, une manquée, et rien pour le dire.
  // Une porte unique ferme la CLASSE — la figure de `deposes`, appliquée à une phrase.
  const porteurs = textesEmis(SRC, "script").filter((t) => NEUF_SRC.test(t));
  assert.deepEqual(porteurs.length, 1,
    porteurs.length + " chaîne(s) de `Vuna.dc.html` portent le motif du refus en clair, "
    + "1 attendue (la constante `REFUS_ROBOT`). Les voici :\n  "
    + porteurs.map((t) => "« " + t.slice(0, 80) + " »").join("\n  ")
    + "\n\nChaque copie est une surface qu'un remplacement en masse peut manquer — et il "
    + "en a manqué une. Lisez `this.REFUS_ROBOT` au lieu de réécrire la phrase.");
  // ————— ET CETTE ASSERTION-CI A ÉTÉ ÉCRITE CREUSE UNE FOIS —————
  // Premier jet : `assert.match(SRC, /REFUS_ROBOT = '/)`. Éprouvée par la mutation qui
  // recoupe la constante en deux morceaux, elle est restée VERTE — le motif décrit le
  // DÉBUT d'un littéral, donc il passe avec ou sans la coupure qu'il prétend interdire.
  // C'est l'assertion creuse : sa condition ne mord pas sur le décor. La prise est donc
  // la forme du nœud, pas celle du texte.
  const decl = [...noeudsDe(espree.parse(
    [...SRC.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter((m) => !/\bsrc\s*=/.test(m[1])).map((m) => m[2]).join("\n;\n"),
    { ecmaVersion: 2023, sourceType: "module" }))]
    .filter((n) => (n.type === "PropertyDefinition" || n.type === "VariableDeclarator")
      && n.key?.name === "REFUS_ROBOT" || n.id?.name === "REFUS_ROBOT");
  assert.equal(decl.length, 1,
    decl.length + " déclaration(s) de `REFUS_ROBOT`, 1 attendue : la garde ne trouve "
    + "plus son sujet, et les deux assertions ci-dessus mesureraient le décor.");
  assert.equal(decl[0].value?.type, "Literal",
    "`REFUS_ROBOT` n'est plus UN littéral — son initialisateur est un "
    + decl[0].value?.type + ". La phrase est de nouveau coupée en morceaux, et c'est "
    + "exactement la coupure qui l'a rendue invisible à un remplacement en masse : "
    + "`' n’a pas d’équivalent ' + 'MQL5 fidèle.'` ne contient aucune des deux chaînes "
    + "qu'on cherchait. Écrivez-la d'un seul tenant.");
});

test("la phrase du refus est GREPPABLE dans le fichier livré, pas seulement émise", () => {
  // ————— CE QU'ON NE PEUT PAS LIRE À PLAT, ON NE PEUT PAS LE VÉRIFIER —————
  //
  // Le compte rendu d'une livraison est relu sur l'ARTEFACT, avec un `grep`, par
  // quelqu'un qui n'analyse pas le source. Écrite `transposé`, la phrase ne répond
  // pas : un comptage sur le livré a rendu 1 pour 2 surfaces, et la seule occurrence
  // trouvée était une prose cassée. L'échappement ne trompe pas les gardes — espree rend
  // la valeur — il ne trompe que l'œil, c'est-à-dire la seule vérification que
  // l'utilisateur puisse faire lui-même.
  //
  // > Une garde vérifie ce qui est ÉMIS ; une personne vérifie ce qui est ÉCRIT. Quand
  // > les deux diffèrent, c'est la personne qui perd — et elle perd en silence, parce
  // > qu'un grep qui ne trouve rien ressemble à un grep qui trouve zéro.
  //
  // La prise est donc un RÉSULTAT et non une interdiction : on n'interdit pas les
  // échappements — le fichier en porte des centaines de légitimes, et les interdire
  // serait un faux refus massif (règle 16). On exige que la phrase se RETROUVE, telle
  // quelle, dans l'artefact livré. Une seule façon d'y arriver : l'écrire en clair.
  //
  // ANGLE MORT, EN TÊTE : elle tient LA phrase que ces gardes policent. Elle ne connaît
  // pas la population des textes qu'un rapport pourrait citer — il n'y en a pas de
  // mécanique. La règle générale vit dans CLAUDE.md ; ce qui est gardé, c'est ce cas.
  const solo = readFileSync(new URL("../../Vuna.solo.html", import.meta.url), "utf8");
  const m = /REFUS_ROBOT = '((?:[^'\\]|\\.)*)'/.exec(SRC);
  assert.ok(m, "`REFUS_ROBOT` est introuvable dans la source : la garde a perdu son sujet.");
  const phrase = JSON.parse('"' + m[1].replace(/"/g, '\\"') + '"');
  assert.ok(phrase.length > 80,
    "la phrase du refus ne fait que " + phrase.length + " caractères : la garde mesure "
    + "un fragment, et un fragment se retrouve partout.");
  assert.ok(solo.includes(phrase),
    "la phrase du refus n'est pas lisible À PLAT dans `Vuna.solo.html`. Elle y est "
    + "sans doute ÉMISE — un échappement rend la même valeur — mais un `grep` sur le "
    + "fichier livré ne la trouve pas, donc personne ne peut vérifier un compte rendu "
    + "qui la cite. Écrivez-la en caractères réels.\n\n  cherché : « "
    + phrase.slice(0, 70) + "… »");
});
