// STATUT · CAUSE ÉTABLIE, MESURÉE DANS LE DÉPÔT. Rapporté sur `260918.7` : « Retirer »
// occupait la colonne « Période à tester », qui se tassait à gauche. Relu ici : l'en-tête
// déclarait SEPT pistes, le corps HUIT. Les deux gabarits étaient écrits à la main, l'un
// en face de l'autre, et ils ont divergé le jour où la colonne « Part » a été retirée —
// « Retirer » vivait à côté d'elle, il est resté, et il s'est décalé d'un cran.
//
// ————— POURQUOI LA GARDE MESURE AU RENDU —————
//
// Deux gabarits identiques dans le source ne prouvent pas deux grilles identiques à
// l'écran : c'est la grille CALCULÉE qui décale, et elle dépend de la largeur du parent,
// du `gap`, du contenu d'une piste `max-content`. La garde lit donc les pistes résolues
// de l'en-tête et de chaque rangée, en pixels, et les compare.
//
// ————— ET LE TIRET QUI NE DIT RIEN —————
//
// Même rapport, même écran : les deux dates rendaient « — » sur toutes les lignes. Un
// tiret couvre trois causes — bornes non enregistrées, bougies non chargées,
// configuration introuvable — donc il disculpe sans avoir regardé. C'est la règle des
// trois états, celle des quatre calculs du portefeuille, appliquée à une date.
//
// ANGLE MORT DÉCLARÉ, en tête : la garde mesure la grille des LIGNES du portefeuille, à
// une largeur de fenêtre, sur trois rangées. Elle ne dit rien des autres tableaux du
// fichier, dont plusieurs portent aussi deux gabarits écrits en face l'un de l'autre —
// c'est relevé, pas fermé.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { POSER_SEMIS, INSTANCE } from "./lib/semis.mjs";

const APP = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

test("le gabarit de la grille des lignes est écrit UNE fois", () => {
  assert.match(APP, /grilleLigne: '14px minmax\(0,1fr\) 80px 84px 88px 100px 112px 74px',/,
    "le gabarit nommé a disparu : chaque grille redevient une vérité à tenir d'accord "
    + "avec l'autre, et la divergence ne se voit qu'à l'écran.");
  assert.equal(APP.split("grid-template-columns:{{ grilleLigne }}").length - 1, 2,
    "le gabarit nommé n'est plus lu par EXACTEMENT deux grilles — l'en-tête et la "
    + "rangée. S'il n'en reste qu'une, l'autre a été réécrite à la main.");
  // et l'infobulle du dépli ne vit plus sur la rangée entière
  assert.ok(!APP.includes('onClick="{{ vl.deplier }}" title="{{ vl.deplierAide }}"'),
    "l'infobulle du dépli est revenue sur la rangée ENTIÈRE : elle s'ouvre alors sous le "
    + "curseur où qu'il soit, y compris au-dessus du bouton « Exporter » de la rangée "
    + "suivante, qu'elle recouvre. Une infobulle qui recouvre une action est une action "
    + "perdue tant qu'elle est ouverte. Elle vit sur le chevron.");
});

test("l'en-tête et chaque rangée ont les MÊMES pistes, mesurées", { timeout: 180000 }, async () => {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch (e) {
    assert.fail("Cette garde compare deux grilles CALCULÉES — playwright est introuvable. "
      + "Installez-le, ou posez VUNA_CHROMIUM. Elle ne saute pas en silence : deux "
      + "gabarits identiques dans le source ne prouvent pas deux grilles identiques.");
  }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable. Cette garde ne saute pas."));
  try {
    const p = await (await nav.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    await p.goto("file://" + SOLO);
    await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
    await p.waitForFunction(`(() => { try { const i = ${INSTANCE};
      return !!(i.dfs && i.dfs['VX-EUR'] && i.dfs['VX-EUR'].n > 1000); } catch (e) { return false; } })()`,
    null, { timeout: 90000 });
    await p.evaluate(POSER_SEMIS);
    await p.evaluate("window.__semis.portefeuille(3)");
    // ————— LA POPULATION EST TOUS LES ONGLETS, PAS CELUI QU'ON AVAIT SOUS LA MAIN —————
    //
    // Première forme : `pfOnglet: 1`, l'onglet d'un portefeuille. Le défaut a vécu sur
    // l'onglet PAR DÉFAUT — « Toutes les lignes », `pfOnglet: 0` —, où un `sc-if` retirait
    // la cellule du retrait : mesuré sur `260920.9`, SEPT cellules pour HUIT pistes, sur
    // l'écran que tout le monde ouvre en premier. La garde était verte parce qu'elle
    // regardait le seul onglet où la cellule est là. Le nombre d'onglets se DÉCOUVRE
    // (règle 7) : un portefeuille de plus entre dans la mesure sans qu'une ligne change.
    const onglets = await p.evaluate(`(() => { const i = ${INSTANCE};
      i.setState({ vue: 'portefeuille' }); i.forceUpdate();
      return 1 + ((i.state.pfs || []).length); })()`);
    assert.ok(onglets >= 2, "moins de deux onglets découverts (" + onglets + ") : « Toutes "
      + "les lignes » et au moins un portefeuille. La découverte est désancrée.");

    for (const og of Array.from({ length: onglets }, (_, j) => j)) {
    await p.evaluate(`(() => { const i = ${INSTANCE};
      i.setState({ vue: 'portefeuille', pfOnglet: ${og} }); i.forceUpdate(); })()`);
    await p.waitForFunction(() => document.querySelectorAll(".rang").length >= 3,
      null, { timeout: 60000 });

    const mes = await p.evaluate(() => {
      const tete = [...document.querySelectorAll("span")].find((x) =>
        getComputedStyle(x).display === "grid" && (x.textContent || "").includes("Instrument"));
      const rangs = [...document.querySelectorAll(".rang")];
      return {
        tete: tete ? { pistes: getComputedStyle(tete).gridTemplateColumns,
          cellules: tete.children.length,
          txt: (tete.innerText || "").replace(/\s+/g, " ").trim() } : null,
        rangs: rangs.map((r) => ({ pistes: getComputedStyle(r).gridTemplateColumns,
          cellules: r.children.length,
          periode: ((r.children[6] || {}).innerText || "").replace(/\s+/g, " ").trim(),
          retirer: ((r.children[7] || {}).innerText || "").trim() })),
      };
    });

    // ————— LA PRISE, AVANT LE VERDICT —————
    assert.ok(mes.tete, "l'en-tête du tableau des lignes n'est pas rendu : la garde "
      + "mesurerait le décor.");
    assert.ok(mes.rangs.length >= 3,
      "moins de trois rangées rendues (" + mes.rangs.length + ").");

    for (const r of mes.rangs) {
      assert.equal(r.cellules, mes.tete.cellules,
        "onglet " + og + " : une rangée porte " + r.cellules + " cellules quand l'en-tête en déclare "
        + mes.tete.cellules + ". Les deux comptes diffèrent, dans un sens ou dans "
        + "l'autre : toutes les colonnes après l'écart se décalent d'un cran, et deux "
        + "d'entre elles se partagent une piste — ou une piste reste vide. Une grille "
        + "dont le nombre de colonnes porte du sens compte ses cellules.");
      assert.equal(r.pistes, mes.tete.pistes,
        "onglet " + og + " : les pistes CALCULÉES diffèrent — en-tête « " + mes.tete.pistes + " » contre "
        + "rangée « " + r.pistes + " ». Le même gabarit peut se résoudre différemment "
        + "sous deux parents ; c'est la grille résolue qui décale les colonnes, pas la "
        + "déclaration.");
    }

    // ————— ET LA PÉRIODE DIT QUELQUE CHOSE —————
    for (const r of mes.rangs) {
      assert.ok(r.periode && r.periode !== "—" && r.periode !== "— —",
        "la colonne « Période à tester » rend un tiret muet : « " + r.periode + " ». Un "
        + "tiret couvre trois causes — bornes non enregistrées, bougies non chargées, "
        + "configuration introuvable — et n'en nomme aucune : il disculpe sans avoir "
        + "regardé. Chacune des trois se dit en toutes lettres.");
      assert.match(r.periode, /^\d{4}\.\d{2}\.\d{2} \d{4}\.\d{2}\.\d{2}$/,
        "sur un portefeuille dont les trois lignes SONT mesurables, la période doit "
        + "rendre les deux dates au format du testeur. Rendu : « " + r.periode + " ». "
        + "Si c'est un message d'état, le semis ne sème plus des lignes mesurables et "
        + "la garde ne mesure plus le cas normal.");
      assert.equal(r.retirer, "Retirer",
        "onglet " + og + " : la dernière colonne ne porte plus le retrait de la ligne : « " + r.retirer
        + " ». C'est la cellule que l'en-tête avait en trop, et sa disparition "
        + "réintroduit l'écart de comptes.");
    }

    // ————— ET L'EN-TÊTE DIT D'OÙ VIENT LE FORMAT —————
    //
    // L'assertion ci-dessus tient la FORME de la valeur ; elle ne dit pas au lecteur
    // pourquoi cette forme-là. La question « pourquoi pas JJ/MM/AAAA ? » a été posée, et
    // elle était légitime : rien à l'écran ne disait que le format appartient à la
    // DESTINATION de la colonne. Les deux infobulles le disaient — et une infobulle ne
    // s'ouvre pas toute seule, c'est la règle que ce dépôt a déjà payée deux fois.
    //
    // Mesuré avant d'écrire, sur les quatre rapports de `scripts/mt5/` : 5 150 dates,
    // toutes en AAAA.MM.JJ, aucune dans une autre forme — et sur un poste en locale
    // FRANÇAISE, ce qui écarte l'hypothèse d'un format qui suivrait la locale.
    assert.match(mes.tete.txt, /testeur MT5/,
      "l'en-tête de la colonne ne nomme plus le testeur : « " + mes.tete.txt + " ». Le "
      + "format AAAA.MM.JJ n'est pas un choix d'affichage — c'est celui que MT5 attend, "
      + "et la colonne existe pour être recopiée là-bas. Sans cette mention dans ce qui "
      + "est LU, le format passe pour une bizarrerie et quelqu'un le « corrigera » en "
      + "JJ/MM/AAAA, ce qui casse le seul geste que la colonne sert. Écrivez-le dans "
      + "l'en-tête, pas dans une infobulle : une infobulle ne s'ouvre pas toute seule.");
    }
  } finally { await nav.close(); }
});
