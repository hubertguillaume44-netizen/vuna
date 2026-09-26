// STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ (« quand je fais Importer, rien ne se passe »,
// venapp.fr, 260926.2 confirmée par l'utilisateur, console réduite au bruit de fond
// connu), mécanisme MESURÉ DANS LE DÉPÔT, au rendu, sur 260922, 260926 et 260926.2 : par le
// bouton « Importer mes données » du bandeau et un vrai sélecteur de fichier, l'examen avait
// lieu et l'écran « Ce fichier contient » était posé dans l'état — mais il vit dans le
// tiroir, que ce bouton n'ouvrait pas. Un fichier refusé disait sa cause ; un fichier VALIDE
// ne montrait rien.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Ce banc n'est pas le navigateur de l'utilisateur, ni son fichier : il prouve que chaque
// porte RÉPOND À L'ÉCRAN dans un Chromium automatique, pas que le fichier de l'utilisateur
// se recharge chez lui. Ce constat-là ne se fait que chez lui, et le journal de l'import
// existe pour qu'une photo de l'écran dise où ça s'arrête. Et Playwright déclenche
// `change` même quand on rechoisit le même fichier : le défaut du champ non vidé ne s'y
// reproduit pas — ce qui est mesuré est sa CAUSE, la valeur du champ après le choix.
//
// ————— CE QU'ELLE TIENT —————
// Les six portes d'import écrivent, dans le journal VISIBLE, l'accusé de réception avant
// toute lecture, puis ouvrent l'écran d'examen à l'écran ; chaque champ est vidé après le
// choix, donc un second choix du même fichier repart ; une exception de l'examen se dit à
// l'écran ; et la lecture d'un fichier lent montre sa progression.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { writeFileSync, mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { INSTANCE } from "./lib/semis.mjs";
import { CLIC_CONTIENT, CLIC_EXACT } from "./lib/vues.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);
const DIR = mkdtempSync(path.join(os.tmpdir(), "vuna-import-"));
const SAUVEGARDE = path.join(DIR, "sauvegarde-du-22-09.json");
writeFileSync(SAUVEGARDE, JSON.stringify({ outil: "vena", version: 1, date: "2026-09-22T08:00:00.000Z",
  donnees: { "vena.portefeuilles.v1.client.fxpro": '{"pfs":[{"nom":"P1","syms":[]}],"favoris":[],"valides":[]}' } }));

async function navigateur() {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas."); }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  return chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
}
async function ouvrir(nav) {
  const p = await (await nav.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto("file://" + SOLO);
  await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
  const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 }).catch(() => null);
  if (porte) { await porte.click(); await p.waitForTimeout(500); }
  await p.evaluate(`(() => { const i = ${INSTANCE}; window.__examens = 0; const v = i.examinerImport.bind(i);
    i.examinerImport = (...a) => { window.__examens++; return v(...a); }; i.idbSet = async () => true; })()`);
  return p;
}
/** Ce que l'écran MONTRE : le journal et l'écran d'examen, s'ils sont dans la fenêtre. */
const ecran = (p) => p.evaluate(() => {
  const vu = (el) => { if (!el) return false; const r = el.getBoundingClientRect();
    return r.height > 0 && r.bottom > 0 && r.top < innerHeight; };
  const log = document.querySelector('[role=log]');
  const examen = [...document.querySelectorAll('span')].find((s) => /^ce fichier contient$/i.test(s.innerText.trim()));
  return { journal: vu(log) ? log.innerText : null, examen: vu(examen), examens: window.__examens };
});
const remettre = (p) => p.evaluate(`(() => { const i = ${INSTANCE};
  i.setState({ dlgImport: null, impJournal: null, sauvMsg: null, tiroir: false }); })()`);

test("les six portes d'import répondent À L'ÉCRAN, avant toute lecture, et ouvrent l'examen",
  { timeout: 300000 }, async () => {
  const nav = await navigateur();
  try {
    const p = await ouvrir(nav);
    const constater = async (nom, geste) => {
      await remettre(p);
      await p.waitForTimeout(300);
      const avant = (await ecran(p)).examens;
      await geste();
      await p.waitForTimeout(900);
      const e = await ecran(p);
      assert.ok(e.examens > avant, nom + " : l'examen n'a même pas été appelé — le geste n'est pas arrivé.");
      assert.ok(e.journal, nom + " : aucun journal d'import À L'ÉCRAN — le geste est muet, c'est le défaut rapporté.");
      assert.match(e.journal, /fichier reçu : « sauvegarde-du-22-09\.json »/, nom + " : pas d'accusé de réception. Journal : " + e.journal);
      assert.match(e.journal, /Vuna \d{6}(\.\d+)? · /, nom + " : le journal ne porte pas la version — une photo ne dirait pas laquelle tourne.");
      assert.ok(e.examen, nom + " : l'écran « Ce fichier contient » n'est pas à l'écran. Journal : " + e.journal);
      return e;
    };
    // 1 · le bandeau — la porte du rapport, et celle qui était muette
    await constater("bandeau « Importer mes données »", async () => {
      const b = await p.$('button:has-text("Importer mes données")');
      assert.ok(b, "le bouton du bandeau a disparu : la porte du rapport n'est plus éprouvée.");
      const [fc] = await Promise.all([p.waitForEvent("filechooser"), b.click()]);
      await fc.setFiles(SAUVEGARDE);
    });
    // 2 et 3 · les deux champs du tiroir — le second vit dans la section « Ce qui sort d'ici »
    for (const [porte, sec] of [["Fichier à importer", null], ["Importer un fichier", "sort"]]) {
      await constater("tiroir « " + porte + " »", async () => {
        await p.evaluate(`(() => { const i = ${INSTANCE}; i.setState({ tiroir: true, tiroirOnglet: 'donnees'${sec ? ", tirSec: '" + sec + "'" : ""} }); })()`);
        await p.waitForTimeout(400);
        const inp = await p.$(`input[type=file][data-porte*="${porte}"]`);
        assert.ok(inp, "le champ « " + porte + " » est introuvable dans le tiroir ouvert.");
        await inp.setInputFiles(SAUVEGARDE);
        const valeur = await inp.evaluate((x) => x.value);
        assert.equal(valeur, "", "le champ « " + porte + " » garde « " + valeur + " » après le choix : rechoisir le "
          + "même fichier ne déclencherait rien — le geste de quelqu'un dont le premier essai a paru muet.");
      });
    }
    // 4 · la page Journal — « Réimporter »
    await constater("page Journal « Réimporter »", async () => {
      await p.evaluate(`${CLIC_CONTIENT}("Mes décisions")`);
      await p.waitForTimeout(400);
      await p.evaluate(`${CLIC_EXACT}("Journal")`);
      await p.waitForTimeout(600);
      const inp = await p.$('input[type=file][data-porte*="Réimporter"]');
      assert.ok(inp, "le champ « Réimporter » de la page Journal est introuvable.");
      await inp.setInputFiles(SAUVEGARDE);
      assert.equal(await inp.evaluate((x) => x.value), "", "« Réimporter » garde sa valeur après le choix.");
    });
    // 5 · le dépôt d'un fichier
    await constater("dépôt d'un fichier", async () => {
      await p.evaluate(`(async () => { const i = ${INSTANCE};
        const f = new File([${JSON.stringify(JSON.stringify({ outil: "vena", version: 1, date: "2026-09-22T08:00:00.000Z",
          donnees: { "vena.portefeuilles.v1.client.fxpro": '{"pfs":[],"favoris":[],"valides":[]}' } }))}],
          'sauvegarde-du-22-09.json', { type: 'application/json' });
        i.accepterTout([f]); })()`);
    });
    // 6 · « Choisir le fichier de sauvegarde », sur un fichier existant
    await constater("« Choisir le fichier de sauvegarde »", async () => {
      await p.evaluate(`(() => { const i = ${INSTANCE};
        const txt = ${JSON.stringify(JSON.stringify({ outil: "vena", version: 1, date: "2026-09-22T08:00:00.000Z",
          donnees: { "vena.portefeuilles.v1.client.fxpro": '{"pfs":[],"favoris":[],"valides":[]}' } }))};
        window.showSaveFilePicker = async () => ({ kind: 'file', name: 'sauvegarde-du-22-09.json',
          queryPermission: async () => 'granted', requestPermission: async () => 'granted',
          getFile: async () => new File([txt], 'sauvegarde-du-22-09.json'),
          createWritable: async () => ({ write: async () => {}, close: async () => {}, abort: async () => {} }) });
        i.choisirFichierAuto(); })()`);
    });
  } finally { await nav.close(); }
});

test("le même fichier choisi DEUX FOIS par le bandeau est examiné deux fois", { timeout: 120000 }, async () => {
  const nav = await navigateur();
  try {
    const p = await ouvrir(nav);
    for (let k = 1; k <= 2; k++) {
      // le premier essai ouvre le tiroir par-dessus le bandeau : on le referme, comme le
      // ferait quelqu'un qui recommence
      await remettre(p);
      await p.waitForTimeout(300);
      const [fc] = await Promise.all([p.waitForEvent("filechooser"), p.click('button:has-text("Importer mes données")')]);
      await fc.setFiles(SAUVEGARDE);
      await p.waitForTimeout(700);
      assert.equal((await ecran(p)).examens, k, "le choix nº " + k + " du même fichier n'a pas relancé l'examen.");
    }
  } finally { await nav.close(); }
});

test("une exception de l'examen se DIT à l'écran, et une lecture lente montre sa progression",
  { timeout: 120000 }, async () => {
  const nav = await navigateur();
  try {
    const p = await ouvrir(nav);
    // l'exception : un défaut de Vuna injecté à l'exécution, rien n'est modifié sur le disque
    // (sur une méthode que SEUL l'examen appelle : une méthode du gabarit casserait le rendu
    // entier, et la sonde mesurerait la page blanche au lieu du filet)
    await p.evaluate(`(() => { const i = ${INSTANCE}; window.__nv = i.examinerSauvegarde;
      i.examinerSauvegarde = async () => { throw new TypeError('sonde du banc'); }; })()`);
    const [fc] = await Promise.all([p.waitForEvent("filechooser"), p.click('button:has-text("Importer mes données")')]);
    await fc.setFiles(SAUVEGARDE);
    await p.waitForTimeout(800);
    const e = await ecran(p);
    assert.match(e.journal || "", /ÉCHEC de l’examen — TypeError : sonde du banc/,
      "l'exception de l'examen est muette à l'écran — elle partait dans une console que personne ne lit. Journal : " + e.journal);
    await p.evaluate(`(() => { const i = ${INSTANCE}; i.examinerSauvegarde = window.__nv; })()`);
    // la progression : un fichier dont le flux livre ses morceaux lentement
    await remettre(p);
    await p.evaluate(`(() => { const i = ${INSTANCE};
      const txt = new TextEncoder().encode(${JSON.stringify(JSON.stringify({ outil: "vena", version: 1,
        donnees: Object.fromEntries(Array.from({ length: 40 }, (_, k) => ["vena.runs.v1.client.fxpro.k" + k, "x".repeat(4000)])) }))});
      let n = 0; const pas = 8000;
      const f = { name: 'lente.json', size: txt.length, lastModified: Date.now(),
        stream: () => new ReadableStream({ async pull(c) { await new Promise((r) => setTimeout(r, 250));
          if (n >= txt.length) { c.close(); return; } c.enqueue(txt.slice(n, n + pas)); n += pas; } }) };
      i.examinerImport(f, null, 'banc · fichier lent'); })()`);
    const vus = [];
    for (let k = 0; k < 8; k++) {
      await p.waitForTimeout(350);
      vus.push(await p.evaluate(() => { const el = document.querySelector('[role=status]');
        if (!el) return null; const r = el.getBoundingClientRect();
        return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight ? el.innerText : 'HORS ÉCRAN'; }));
    }
    const lus = vus.filter((x) => x && /Lecture de « lente\.json » — /.test(x));
    assert.ok(lus.length >= 2, "la lecture lente ne montre pas sa progression à l'écran : " + JSON.stringify(vus));
    assert.notEqual(lus[0], lus[lus.length - 1], "la progression ne bouge pas : " + JSON.stringify(lus));
  } finally { await nav.close(); }
});
