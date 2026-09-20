// STATUT · CAUSE ÉTABLIE — piège RAPPORTÉ sur `260920.9` (une ligne née dans Backtest,
// export refusé à bon droit et AUCUN bouton de retrait), cause et correctif MESURÉS DANS
// LE DÉPÔT, au rendu, sur le fichier livré.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Elle tient qu'un retrait est OFFERT et qu'il AGIT — le compte des lignes retenues
// baisse — sur chaque onglet du portefeuille, y compris sur une ligne dont la
// configuration ne se retrouve pas. Elle ne tient pas qu'il n'existe aucun AUTRE état de
// ligne sans sortie : les états sont semés, pas découverts, et un quatrième naîtrait hors
// de portée. Ce qui la rendrait générale est une énumération des causes de refus depuis
// le produit ; elle n'existe pas.
//
// ————— POURQUOI LE RETRAIT NE SE REFUSE JAMAIS —————
// L'export peut être refusé : il PRODUIT un artefact, et un robot qui ne reproduit pas sa
// mesure est pire qu'un robot absent. Un retrait ne produit rien et ne peut rien affirmer
// de faux. Une garde qui refuse sans laisser de sortie n'est pas stricte, elle est un
// piège : la ligne morte reste dans le portefeuille, elle entre dans les agrégats, et la
// seule issue offerte est d'aller désarmer quelque chose. C'est la règle 16 dans sa forme
// la plus dure — celle où il n'y a même pas d'interrupteur à désarmer.
//
// ————— CE QUI A ÉTÉ MESURÉ AVANT LE CORRECTIF, sur l'artefact `260920.9` —————
//   · « Toutes les lignes », l'onglet PAR DÉFAUT : 3 rangées, ZÉRO « Retirer » — sur des
//     lignes parfaitement saines comme sur la ligne piégée ;
//   · onglet d'un portefeuille : 3 rangées, 3 « Retirer » ;
//   · et la même absence décalait la grille : 7 cellules pour 8 pistes (tenu par
//     `grille-compte-ses-cellules`, dont la population couvre désormais TOUS les onglets).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { POSER_SEMIS, INSTANCE } from "./lib/semis.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

test("une ligne se retire depuis n'importe quel onglet, même quand l'export la refuse",
  { timeout: 240000 }, async () => {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas — un "
    + "bouton absent ne se plaint pas, c'est tout le sujet."); }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
  try {
    const p = await (await nav.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    await p.goto("file://" + SOLO);
    await p.waitForFunction(() => document.body && document.body.innerText.length > 400,
      null, { timeout: 60000 });
    const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 })
      .catch(() => null);
    if (porte) {
      await porte.click();
      await p.waitForSelector(".dialog-backdrop", { state: "detached", timeout: 10000 }).catch(() => {});
    }
    await p.evaluate(POSER_SEMIS);
    await p.evaluate("window.__semis.scan(6, ['VX-EUR','VX-500','VX-OR'])");
    await p.waitForTimeout(600);
    await p.evaluate("window.__semis.decisions(3, ['VX-EUR','VX-500','VX-OR'])");
    await p.waitForTimeout(600);

    // ————— LA LIGNE PIÉGÉE : celle qui est NÉE DANS BACKTEST —————
    // Ni `_reg`, ni `_sid`, ni `filtre` : `cfgDeLigne` rend null, la période dit
    // « configuration introuvable », et c'est l'état exact du rapport. Une ligne saine
    // ne prouverait rien — le cas où le défaut ne peut pas se produire (règle 10).
    const semee = await p.evaluate(`(() => { const i = ${INSTANCE};
      const l = i.normValides(i.state.valides).map((x) => ({ ...x }));
      const v = l[0];
      delete v._reg; delete v._sid; delete v.filtre; delete v.filtreNom;
      i.setState({ valides: l, vue: 'portefeuille' }); i.forceUpdate();
      return { cfgNull: !i.cfgDeLigne(v), sym: v.sym }; })()`);
    assert.equal(semee.cfgNull, true,
      "le semis ne produit plus une ligne dont la configuration est introuvable : la "
      + "garde mesurerait une ligne saine, c'est-à-dire le cas où le piège ne peut pas "
      + "se refermer.");

    // La population des onglets se DÉCOUVRE : le défaut a vécu sur celui que la garde
    // voisine n'avait pas mesuré.
    const onglets = await p.evaluate(`(() => { const i = ${INSTANCE};
      return 1 + ((i.state.pfs || []).length); })()`);
    assert.ok(onglets >= 2, "moins de deux onglets découverts (" + onglets + ").");

    for (let og = 0; og < onglets; og++) {
      await p.evaluate(`(() => { const i = ${INSTANCE};
        i.setState({ vue: 'portefeuille', pfOnglet: ${og} }); i.forceUpdate(); })()`);
      await p.waitForFunction(() => document.querySelectorAll(".rang").length >= 3,
        null, { timeout: 60000 });
      const m = await p.evaluate(`(() => { const i = ${INSTANCE};
        const vis = (t) => [...document.querySelectorAll('button')]
          .filter((b) => b.offsetParent !== null && (b.textContent || '').trim() === t);
        return { rangs: document.querySelectorAll('.rang').length,
          retraits: vis('Retirer').length,
          aides: vis('Retirer').map((b) => (b.getAttribute('title') || '').slice(0, 400)) }; })()`);
      assert.ok(m.rangs >= 3, "onglet " + og + " : moins de trois rangées rendues ("
        + m.rangs + ") — la garde mesurerait le décor.");
      assert.equal(m.retraits, m.rangs,
        "onglet " + og + " : " + m.retraits + " bouton(s) de retrait pour " + m.rangs
        + " rangée(s). Une rangée sans retrait est une ligne qu'on ne peut plus sortir "
        + "de ses agrégats — et l'export, lui, peut être refusé à bon droit. Un refus "
        + "sans sortie n'est pas une garde, c'est un piège.");
      // Le VERBE est le même des deux côtés ; le SUJET, non. Il vit dans l'infobulle,
      // parce que c'est le seul endroit qui distingue « retirer du portefeuille » de
      // « retirer de mes lignes retenues ».
      for (const a of m.aides) {
        assert.match(a, /Retirer .+ (de vos lignes retenues|de .+ —)/,
          "onglet " + og + " : l'infobulle du retrait ne nomme pas son SUJET. Le même "
          + "verbe couvre deux gestes — quitter un portefeuille, quitter les lignes "
          + "retenues — et rien d'autre à l'écran ne les sépare. Obtenu : « " + a + " »");
      }
    }

    // ————— ET LE GESTE AGIT : on compte, on ne regarde pas un bouton —————
    // Mesuré sur une première forme de ce correctif : un `basculerValide` rebâti depuis
    // l'objet MAPPÉ de la rangée faisait passer les lignes retenues de 3 à 4 — `cleValide`
    // ne retrouvait rien et AJOUTAIT. Le bouton était là, il répondait, et il faisait
    // l'inverse. Un retrait qui ne retire pas est pire qu'un retrait absent.
    await p.evaluate(`(() => { const i = ${INSTANCE};
      i.setState({ vue: 'portefeuille', pfOnglet: 0 }); i.forceUpdate(); })()`);
    await p.waitForTimeout(400);
    const avant = await p.evaluate(`(() => { const i = ${INSTANCE};
      return (i.state.valides || []).length; })()`);
    await p.evaluate(`(() => { const b = [...document.querySelectorAll('button')]
      .filter((x) => x.offsetParent !== null && (x.textContent || '').trim() === 'Retirer')[0];
      b && b.click(); })()`);
    await p.waitForTimeout(700);
    const apres = await p.evaluate(`(() => { const i = ${INSTANCE};
      return { n: (i.state.valides || []).length,
        annuler: [...document.querySelectorAll('button')]
          .filter((b) => b.offsetParent !== null && /Annuler le retrait/.test(b.textContent || '')).length }; })()`);
    assert.equal(apres.n, avant - 1,
      "un clic sur « Retirer » depuis « Toutes les lignes » a porté les lignes retenues "
      + "de " + avant + " à " + apres.n + ". Attendu : " + (avant - 1) + ".");
    assert.equal(apres.annuler, 1,
      "« Annuler le retrait » n'est pas offert après le retrait. Le geste est à UN clic "
      + "des deux côtés parce qu'il s'annule ; sans l'annulation il lui faudrait une "
      + "confirmation, et ce n'est pas ce qui est livré.");
  } finally { await nav.close(); }
});
