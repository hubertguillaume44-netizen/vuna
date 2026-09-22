// STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ sur `260920.10` (une ligne GOLD rangée,
// « PÉRIODE MESURÉE : configuration → introuvable », et un reclic sur « Ranger au
// portefeuille » qui ne change rien de visible), cause, magnitude et correctif MESURÉS
// DANS LE DÉPÔT, au rendu, sur le fichier livré.
//
// ————— CE QUI A ÉTÉ MESURÉ AVANT LE CORRECTIF —————
// La photo de `ligneBt()` ne se pose qu'à la CRÉATION. Sur une ligne déjà enregistrée
// sans photo, `cleValide` la retrouve — donc `estValide` rend vrai, le bouton lit
// « ✓ Au portefeuille », et son clic la RETIRE : trois lignes retenues passent à deux,
// mesuré au rendu. Le correctif de `260920.9` était INATTEIGNABLE pour la seule
// population qui en avait besoin, et la seule issue était de détruire et recréer, ce
// que rien à l'écran ne disait.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// La confrontation qui borne l'écrasement compare DEUX sources : le libellé que la
// ligne porte (`v.filtres`, posé à sa création) et celui que le panneau produit. Elle
// ne peut donc rien dire d'un réglage que le libellé ne nomme pas — une sécurisation,
// une unité de décision, une fenêtre. `cleValide` ne porte que sept champs sur les
// soixante-cinq de `REGLAGES` : deux configurations de même clé peuvent différer
// ailleurs, et le geste les confondrait. Ce qui reste derrière est le refus d'export,
// qui confronte le même libellé à l'en-tête RÉELLEMENT émis.
//
// Et le cas sans libellé n'est pas écrasé en silence : il est REFUSÉ, avec la
// destruction-recréation nommée — c'est la seule réponse quand rien ne peut confronter.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { POSER_SEMIS, INSTANCE } from "./lib/semis.mjs";
import { CLIC_CONTIENT, CLIC_EXACT } from "./lib/vues.mjs";

const APP = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

test("une ligne validée a UNE fabrique, lue par ses deux gestes", () => {
  // Trente champs recopiés dans un second geste divergeraient à la première qu'on
  // oublie — la figure de `deposes`, appliquée à un objet.
  assert.match(APP, /\n  ligneValidee\(sym, cfg\) \{\n    return \{ sym,/,
    "la fabrique d'une ligne validée n'est plus une fonction nommée : le rangement et "
    + "le réenregistrement en reconstruisent chacun une version.");
  const lecteurs = (APP.match(/this\.ligneValidee\(/g) || []).length;
  assert.equal(lecteurs, 2,
    lecteurs + " lecteurs de `ligneValidee` au lieu de 2 — le rangement et le "
    + "réenregistrement. Un troisième site qui bâtirait l'objet à la main redevient une "
    + "copie.");
  // ————— LE REPLI PAR PHOTO A UN SEUL LECTEUR, ET C'EST LA MOITIÉ QUI COMPTE —————
  // Posé dans `cfgDeLigne`, il rendait `repriseEcart` VACUE : cette fonction compare ce
  // qui va tourner (dérivé de la photo) à ce que la ligne ÉTAIT (`cfgDeLigne`), et faire
  // lire la photo au second côté rend les deux identiques — un accord qui ne peut pas
  // échouer. C'est `reprise-fidele` qui l'a dit, sur la suite complète.
  const parPhoto = (APP.match(/this\.cfgParPhoto\(/g) || []).length;
  assert.equal(parPhoto, 1,
    parPhoto + " appels à `cfgParPhoto` au lieu de 1 — `pfTrades`, le seul lecteur dont "
    + "la question est « quelle configuration MESURER » et non « qu'était cette ligne ». "
    + "Un appelant de plus doit prouver qu'il pose la première : posé dans `cfgDeLigne`, "
    + "ce repli a rendu `repriseEcart` vacue, et `reprise-fidele` l'a dit.");
  assert.match(APP, /const cfg = this\.cfgDeLigne\(v\) \|\| this\.cfgParPhoto\(v\);/,
    "`pfTrades` ne retombe plus sur la photo : la colonne des deux dates, la réserve et "
    + "les quatre calculs redeviennent « configuration introuvable » sur toute ligne née "
    + "dans le Backtest.");
  assert.match(APP, /  cfgDeLigne\(r\) \{\n    if \(!r \|\| !r\.filtre \|\| !r\.sym\) return null;/,
    "`cfgDeLigne` ne rend plus `null` sans variante : elle cesse d'être une source "
    + "indépendante, et la comparaison de `repriseEcart` ne peut plus échouer.");
});

test("le geste rend la photo, refuse quand il ne peut pas confronter, et les dates reviennent",
  { timeout: 300000 }, async () => {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas — "
    + "un geste absent ne se plaint pas, c'est tout le sujet."); }
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

    // Le panneau est réglé sur la configuration de la ligne : c'est la situation de
    // quelqu'un qui vient de rouvrir sa ligne en Backtest.
    const cle = await p.evaluate(`(() => { const i = ${INSTANCE};
      const l = i.normValides(i.state.valides).map((x) => ({ ...x }));
      const v = l[0];
      i.setState({ valides: l, btSym: v.sym, btPeriode: v.periode, btSL: v.sl, btRR: v.rr,
        btEntree: v.entree, btLigne: v.ligne, btSens: v.sens || 'achat' });
      i.maj({}); return i.cleValide(v); })()`);
    await p.evaluate(CLIC_CONTIENT + "('Mes scans')"); await p.waitForTimeout(400);
    await p.evaluate(CLIC_EXACT + "('Backtest')"); await p.waitForTimeout(400);
    await p.waitForFunction(`(() => { const i = ${INSTANCE}; return !!i.state.res; })()`,
      null, { timeout: 90000 });
    await p.waitForTimeout(700);
    const K = JSON.stringify(cle);

    /** Repose la ligne SANS photo, avec le libellé voulu — l'état exact du rapport. */
    const poser = (lib) => p.evaluate(`(() => { const i = ${INSTANCE};
      const l = i.normValides(i.state.valides).map((x) => ({ ...x }));
      const v = l.find((x) => i.cleValide(x) === ${K});
      delete v._reg; delete v._sid; delete v.filtre; delete v.filtreNom;
      if (${JSON.stringify(lib)} === null) delete v.filtres;
      else v.filtres = ${JSON.stringify(lib)} === '='
        ? i.filtresTexte(i.cfgCourante(i.state.btSym)) : ${JSON.stringify(lib)};
      i.setState({ valides: l, hasardMsg: '' }); i.forceUpdate(); return !!v.filtres; })()`);
    const lire = () => p.evaluate(`(() => { const i = ${INSTANCE};
      const v = i.normValides(i.state.valides).find((x) => i.cleValide(x) === ${K});
      const btn = [...document.querySelectorAll('button')].find((x) => x.offsetParent !== null
        && /Réenregistrer cette mesure|Au portefeuille|Ranger au portefeuille|Contrôler puis ranger/
          .test((x.textContent || '').trim()));
      return { valides: (i.state.valides || []).length, aReg: v ? !!v._reg : 'ABSENTE',
        cfgNull: v ? ((i.pfTrades([v])[0] || {}).trades === null) : null,
        pf: (i.state.pfs || []).map((x) => (x.syms || []).length),
        bouton: btn ? (btn.textContent || '').trim() : null,
        msg: (i.state.hasardMsg || '') }; })()`);
    const cliquer = () => p.evaluate(`(() => { const b = [...document.querySelectorAll('button')]
      .find((x) => x.offsetParent !== null && /Réenregistrer cette mesure/.test((x.textContent||'').trim()));
      if (b) { b.click(); return true; } return false; })()`);

    // ————— LA PRISE, AVANT LE VERDICT —————
    await poser("=");
    await p.waitForTimeout(500);
    const av = await lire();
    assert.equal(av.aReg, false,
      "le semis ne produit plus une ligne SANS photo : la garde mesurerait le cas où le "
      + "piège ne peut pas se refermer (règle 10).");
    assert.equal(av.cfgNull, true,
      "la ligne semée se résout déjà : elle n'est pas dans l'état rapporté.");
    assert.equal(av.bouton, "Réenregistrer cette mesure",
      "le bouton de rangement n'offre pas le réenregistrement sur une ligne qui ne sait "
      + "pas se décrire. Obtenu : « " + av.bouton + " ». Mesuré avant le correctif : il "
      + "lisait « ✓ Au portefeuille » et son clic RETIRAIT la ligne.");

    // ————— A · LES DEUX LIBELLÉS S'ACCORDENT : la photo est posée —————
    assert.ok(await cliquer(), "le bouton de réenregistrement n'a pas pu être cliqué.");
    await p.waitForTimeout(800);
    const ap = await lire();
    assert.equal(ap.aReg, true,
      "la photo n'est pas posée après le geste : la ligne reste muette, et son robot "
      + "descendrait sur `etatDeReference` — tous filtres éteints.");
    assert.equal(ap.cfgNull, false,
      "la configuration ne se résout toujours pas : la colonne des deux dates, la "
      + "réserve et les quatre calculs restent dans leur état « introuvable ». C'est ce "
      + "que le repli `cfgParPhoto` existe pour fermer.");
    assert.equal(ap.valides, av.valides,
      "le compte des lignes retenues a bougé (" + av.valides + " → " + ap.valides
      + ") : le geste REMPLACE en place, il ne retire ni n'ajoute.");
    assert.deepEqual(ap.pf, av.pf,
      "la place dans les portefeuilles a bougé : un retrait suivi d'un rangement "
      + "l'aurait perdue, puisque `basculerValide` sort l'instrument des portefeuilles "
      + "quand c'est sa dernière configuration.");
    assert.equal(ap.bouton, "✓ Au portefeuille",
      "le bouton ne revient pas au retrait une fois la ligne réparée — le geste ne "
      + "s'offre que tant qu'il a un objet. Obtenu : « " + ap.bouton + " ».");

    // ————— B · LES DEUX LIBELLÉS DIVERGENT : on refuse, en citant les deux —————
    await poser("Plus haut D1 · plus haut 20 · marge 1 %");
    await p.waitForTimeout(500);
    await cliquer();
    await p.waitForTimeout(800);
    const b = await lire();
    assert.equal(b.aReg, false,
      "une photo a été gravée alors que le panneau porte d'AUTRES filtres que ceux que "
      + "la ligne annonce. `cleValide` ne borne que sept champs sur soixante-cinq : "
      + "l'écrasement remplacerait une mesure par un état plausible.");
    assert.match(b.msg, /Plus haut D1/,
      "le refus ne cite pas ce que la LIGNE annonce : un refus qui ne nomme pas ses deux "
      + "sources n'est pas confrontable. Obtenu : " + b.msg);

    // ————— C · RIEN À CONFRONTER : on refuse, et on NOMME la sortie —————
    await poser(null);
    await p.waitForTimeout(500);
    await cliquer();
    await p.waitForTimeout(800);
    const c = await lire();
    assert.equal(c.aReg, false,
      "une photo a été gravée sur une ligne qui n'enregistre pas ses filtres : rien ne "
      + "pouvait la confronter, donc rien ne peut dire qu'elle est juste.");
    assert.match(c.msg, /Retirez-la .* rangez-la à nouveau/,
      "le refus ne nomme pas la seule sortie qui reste. Un refus sans sortie est un "
      + "piège — c'est la règle 16, et c'est le défaut d'hier. Obtenu : " + c.msg);

    // ————— ET LA RANGÉE DU PORTEFEUILLE, qui est l'écran du rapport —————
    const periodes = async () => {
      await p.evaluate(CLIC_CONTIENT + "('Mes décisions')"); await p.waitForTimeout(400);
      await p.evaluate(CLIC_CONTIENT + "('Portefeuille principal')"); await p.waitForTimeout(700);
      return p.evaluate(`(() => [...document.querySelectorAll('.rang')]
        .filter((x) => x.offsetParent !== null)
        .map((x) => ((x.children[6] || {}).innerText || '').replace(/\\s+/g, ' ').trim()))()`);
    };
    const avant = await periodes();
    assert.ok(avant.some((x) => /introuvable/i.test(x)),
      "aucune rangée ne rend « configuration introuvable » : la garde mesurerait le "
      + "décor. Obtenu : " + JSON.stringify(avant));
    await p.evaluate(CLIC_CONTIENT + "('Mes scans')"); await p.waitForTimeout(400);
    await p.evaluate(CLIC_EXACT + "('Backtest')"); await p.waitForTimeout(500);
    await poser("="); await p.waitForTimeout(500);
    await cliquer(); await p.waitForTimeout(900);
    const apres = await periodes();
    assert.ok(!apres.some((x) => /introuvable/i.test(x)),
      "la rangée rend encore « configuration introuvable » après le réenregistrement. "
      + "Obtenu : " + JSON.stringify(apres));
    for (const x of apres) {
      assert.match(x, /^\d{4}\.\d{2}\.\d{2} \d{4}\.\d{2}\.\d{2}$/,
        "une rangée ne rend pas les deux dates au format du testeur : « " + x + " ». "
        + "C'est ce que l'utilisateur recopie, et c'est ce qui le bloquait.");
    }
  } finally { await nav.close(); }
});
