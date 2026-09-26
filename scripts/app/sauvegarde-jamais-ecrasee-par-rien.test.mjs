// STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ (une sauvegarde écrite sous l'ancien nom, que
// l'application dit « illisible », à la veille d'un changement d'adresse), écrasements
// MESURÉS DANS LE DÉPÔT, au rendu, sur le fichier livré : sur 260922, navigateur vide, un
// fichier de cinq blocs choisi par « Choisir le fichier de sauvegarde » n'en portait plus
// qu'un ; sur 260926, le stockage local vidé et IndexedDB gardé, les portefeuilles
// partaient du fichier au premier battement, sans un clic.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Aucun banc ne peut ouvrir le sélecteur natif : le fichier est un faux handle, dont
// l'écriture suit la sémantique de `createWritable()` (rien n'arrive à l'original avant
// `close()`). Un faux handle n'est pas clonable dans IndexedDB : `idbSet` est neutralisé
// pour la seule poignée de fichier — la trace des suppressions, elle, y est écrite pour de
// vrai. La comparaison est PAR CLÉ : une valeur appauvrie des deux côtés (une ligne retirée
// d'un portefeuille) est une modification, et cette garde ne la voit pas.
//
// ————— CE QU'ELLE TIENT —————
// Le fichier n'est jamais remplacé par un état moins complet sans un geste : « Choisir »
// sur un fichier existant le CHARGE (écran de l'import, adoption après le geste) ; la
// première écriture automatique d'une séance rend au navigateur ce qu'il a perdu avant
// d'écrire ; une suppression VOULUE, elle, n'est pas ressuscitée, même après un
// rechargement ; et un fichier qu'on ne peut pas relire, ou dont une clé ne peut pas être
// remise, n'est pas écrit. Les cas normaux passent (règle 16) : un fichier neuf, un
// navigateur qui a déjà tout.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { INSTANCE } from "./lib/semis.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

// Une sauvegarde telle que l'export l'écrivait sous l'ancien nom : petites clés, puis
// blocs lourds. L'espace est celui d'un navigateur neuf — l'essai.
const PF = '{"pfs":[{"nom":"P1","syms":["GOLD"]}],"favoris":[],"valides":[]}';
const sauvegarde = (esp) => JSON.stringify({ outil: "vena", version: 1, date: "2026-08-30T10:00:00.000Z",
  donnees: { ["vena.portefeuilles.v1" + esp]: PF, ["vena.series.v1" + esp]: '["GOLD"]',
    ["gros:vena.series.v1" + esp + "|GOLD"]: { t: [1], c: [1] } } });
const CHIFFRE = JSON.stringify({ vena_chiffre: 1, sel: "x", iv: "y", donnees: "gros:" });

// `ecritures` compte les close() ; le contenu vit dans window.__f et survit à la page
// par le banc, qui le repose après un rechargement.
const FAUX_HANDLE = `(contenu, adopter) => {
  window.__f = { contenu, ecritures: 0 };
  const h = { kind: 'file', name: 'sauvegarde.json',
    queryPermission: async () => 'granted', requestPermission: async () => 'granted',
    getFile: async () => new File([window.__f.contenu], 'sauvegarde.json'),
    createWritable: async () => { let t = '';
      return { write: async (x) => { t += typeof x === 'string' ? x : await new Blob([x]).text(); },
        close: async () => { window.__f.contenu = t; window.__f.ecritures++; }, abort: async () => {} }; } };
  window.showSaveFilePicker = async () => h;
  if (adopter) { const i = ${INSTANCE}; i.handleAuto = h; i._confronte = undefined; i._refusConfronte = null; }
}`;

async function ouvrir(p) {
  await p.goto("file://" + SOLO);
  await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
  const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 }).catch(() => null);
  if (porte) { await porte.click(); await p.waitForTimeout(500); }
  await p.evaluate(`(() => { const i = ${INSTANCE}; const vrai = i.idbSet.bind(i);
    i.idbSet = async (v, cle) => (cle && cle !== 'fichier' ? vrai(v, cle) : true); })()`);
}
const etat = (p) => p.evaluate(`(async () => { const i = ${INSTANCE}; let b = null;
  try { b = JSON.parse(window.__f.contenu); } catch (e) {}
  const k = b && b.donnees ? Object.keys(b.donnees) : [];
  return { ecritures: window.__f.ecritures, cles: k, msg: i.state.autoMsg || null,
    dlg: i.state.dlgImport ? { adopter: !!i.state.dlgImport.adopter, series: i.state.dlgImport.series } : null,
    adopte: !!i.handleAuto && i.handleAuto === (await window.showSaveFilePicker()),
    pfs: (i.state.pfs || []).map((x) => x.nom), esp: i.cle('') }; })()`);
async function choisir(p, contenu) {
  await p.evaluate(`(${FAUX_HANDLE})(${JSON.stringify(contenu)}, false)`);
  await p.evaluate(`(async () => { const i = ${INSTANCE}; i.handleAuto = null; i._confronte = undefined;
    i.setState({ autoMsg: null, dlgImport: null }); i._autoEchecs = 0; await i.choisirFichierAuto(); })()`);
  await p.waitForTimeout(600);
  return etat(p);
}
/** L'écriture automatique, sans geste : la périodique de la minute, sur un fichier déjà adopté. */
async function battement(p, contenu) {
  await p.evaluate(`(${FAUX_HANDLE})(${JSON.stringify(contenu)}, true)`);
  await p.evaluate(`(async () => { const i = ${INSTANCE}; i.setState({ autoMsg: null }); i._autoEchecs = 0;
    await i.sauverAuto(); })()`);
  await p.waitForTimeout(900);
  return etat(p);
}
const cliquer = async (p, libelle) => {
  const b = await p.waitForSelector(`button:has-text("${libelle}")`, { timeout: 10000 });
  await b.click(); await p.waitForTimeout(1500);
};

async function navigateur() {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas."); }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  return chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
}

test("« Choisir » sur une sauvegarde existante la CHARGE — jamais d'écriture avant le geste",
  { timeout: 300000 }, async () => {
  const nav = await navigateur();
  try {
    const p = await (await nav.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    await ouvrir(p);
    const esp = await p.evaluate(`(${INSTANCE}).cle('')`);
    // ————— LA PRISE : un navigateur qui n'a PAS ces données —————
    const avant = await p.evaluate(`(async () => { const i = ${INSTANCE}; let n = 0;
      for await (const [k] of i.blocsExport()) if (k.startsWith('gros:')) n++; return n; })()`);
    assert.equal(avant, 0, "le banc part d'un navigateur qui porte " + avant + " bloc(s) lourd(s) : "
      + "le cas mesuré (quelqu'un qui arrive SANS ses données) n'existe plus.");

    // A · Annuler : rien n'est écrit, et le fichier n'est pas adopté
    const a = await choisir(p, sauvegarde(esp));
    assert.equal(a.ecritures, 0, "« Choisir » a ÉCRIT dans une sauvegarde existante avant tout geste.");
    assert.ok(a.dlg && a.dlg.adopter, "« Choisir » sur une sauvegarde existante n'ouvre pas l'écran de "
      + "l'import : elle n'est ni chargée ni montrée. Message : « " + a.msg + " ».");
    assert.equal(a.dlg.series, 1, "l'écran de l'import ne compte pas la série du fichier (lecture au fil).");
    await cliquer(p, "Annuler");
    const a2 = await etat(p);
    assert.equal(a2.ecritures, 0, "« Annuler » a écrit dans le fichier.");
    assert.ok(!a2.adopte, "« Annuler » a quand même fait du fichier la sauvegarde automatique.");
    assert.match(a2.msg || "", /pas devenu votre sauvegarde automatique/, "« Annuler » est muet.");

    // B · Fusionner : le fichier est chargé, PUIS adopté, PUIS écrit — et il n'a rien perdu
    await choisir(p, sauvegarde(esp));
    await cliquer(p, "Fusionner");
    const b = await etat(p);
    assert.ok(b.adopte, "après « Fusionner », le fichier n'est pas devenu la sauvegarde automatique.");
    assert.ok(b.pfs.includes("P1"), "après « Fusionner », le portefeuille du fichier n'est pas ici : "
      + JSON.stringify(b.pfs));
    assert.equal(b.ecritures, 1, "après « Fusionner », la sauvegarde n'est pas écrite une fois : " + b.ecritures);
    for (const k of ["vena.portefeuilles.v1" + esp, "gros:vena.series.v1" + esp + "|GOLD"]) {
      assert.ok(b.cles.includes(k), "l'écriture qui suit le chargement a retiré " + k + " du fichier.");
    }

    // C · chiffré, étranger, abîmé : ni écrit, ni adopté, et la cause est dite
    for (const [nom, contenu, motif] of [["chiffré", CHIFFRE, /CHIFFRÉE/],
      ["étranger", '{"a":1}', /pas une sauvegarde Vuna/],
      ["tronqué", sauvegarde(esp).slice(0, 90), /s’arrête avant sa fin/]]) {
      const c = await choisir(p, contenu);
      assert.equal(c.ecritures, 0, "un fichier " + nom + " a été écrasé par « Choisir ».");
      assert.ok(!c.adopte && !c.dlg, "un fichier " + nom + " a été adopté ou ouvert comme une sauvegarde.");
      assert.match(c.msg || "", motif, "le refus d'un fichier " + nom + " ne dit pas sa cause : « " + c.msg + " ».");
    }
    // D · RÈGLE 16 : un fichier NEUF est adopté et écrit tout de suite — le premier usage du bouton
    const d = await choisir(p, "");
    assert.equal(d.ecritures, 1, "un fichier NEUF n'est plus écrit. Message : « " + d.msg + " ».");
    assert.ok(d.adopte, "un fichier NEUF n'est pas adopté.");
  } finally { await nav.close(); }
});

test("le fichier rend au navigateur ce qu'il a PERDU, et ne ressuscite pas ce qu'on a SUPPRIMÉ",
  { timeout: 300000 }, async () => {
  const nav = await navigateur();
  try {
    const ctx = await nav.newContext({ viewport: { width: 1440, height: 1000 } });
    const p = await ctx.newPage();
    await ouvrir(p);
    // un navigateur qui a TOUT : un portefeuille, deux séries (index + blocs), écrit une fois
    const esp = await p.evaluate(`(${INSTANCE}).cle('')`);
    await p.evaluate(`(async () => { const i = ${INSTANCE};
      localStorage.setItem(i.cle(i.CLE_PF), ${JSON.stringify(PF)});
      localStorage.setItem(i.cle(i.CLE_SERIES), '["GOLDX","SILVX"]');
      await i.grosSet(i.cle(i.CLE_SERIES) + '|GOLDX', { t: [1], c: [1] });
      await i.grosSet(i.cle(i.CLE_SERIES) + '|SILVX', { t: [2], c: [2] }); })()`);
    const e0 = await battement(p, "");
    assert.equal(e0.ecritures, 1, "RÈGLE 16 : un navigateur qui a tout n'écrit plus dans un fichier neuf. "
      + "Message : « " + e0.msg + " ».");
    const PFK = "vena.portefeuilles.v1" + esp, SILV = "gros:vena.series.v1" + esp + "|SILVX";
    assert.ok(e0.cles.includes(PFK) && e0.cles.includes(SILV), "le fichier de départ ne porte pas le semis : "
      + JSON.stringify(e0.cles) + " — la suite mesurerait le décor.");
    const fichier = await p.evaluate("window.__f.contenu");

    // E · une suppression VOULUE, puis un rechargement : la trace survit, rien ne ressuscite
    await p.evaluate(`(async () => { const i = ${INSTANCE}; await i.supprimerSerie('SILVX'); })()`);
    await p.waitForTimeout(500);
    await p.reload(); await ouvrir(p);
    const e = await battement(p, fichier);
    assert.equal(e.ecritures, 1, "après une suppression voulue, l'écriture est refusée — un faux refus "
      + "qui reviendrait à chaque séance. Message : « " + e.msg + " ».");
    assert.ok(!e.cles.includes(SILV), "une série SUPPRIMÉE par l'utilisateur a été remise par le fichier : "
      + "la trace de la suppression n'a pas survécu au rechargement.");
    const silvIci = await p.evaluate(`(async () => { const i = ${INSTANCE};
      return !!(await i.grosGet(i.cle(i.CLE_SERIES) + '|SILVX')); })()`);
    assert.ok(!silvIci, "la série supprimée est revenue dans ce navigateur.");
    const fichier2 = await p.evaluate("window.__f.contenu");

    // F · LE TROU MESURÉ SUR 260926 : le stockage local vidé, IndexedDB gardé — et, juste
    // avant, une suppression voulue que le fichier n'a pas encore vue. La trace de celle-ci
    // vivait AUSSI dans le stockage vidé : elle doit survivre par sa copie d'IndexedDB.
    const GOLD = "gros:vena.series.v1" + esp + "|GOLDX";
    assert.ok(e.cles.includes(GOLD), "le fichier n'a plus GOLDX avant F : la suite mesurerait le décor.");
    await p.evaluate(`(async () => { const i = ${INSTANCE}; await i.supprimerSerie('GOLDX'); })()`);
    await p.waitForTimeout(500);
    await p.evaluate("localStorage.clear()");
    await p.reload(); await ouvrir(p);
    // et pendant la séance, AVANT la première écriture, la clé perdue est recréée ici —
    // un portefeuille neuf sur un écran vidé. Elle est présente au moment de comparer ;
    // seule son absence à l'ouverture dit qu'elle a été perdue.
    await p.evaluate(`(() => { const i = ${INSTANCE};
      localStorage.setItem(i.cle(i.CLE_PF), '{"pfs":[{"nom":"NEUF","syms":[]}],"favoris":[],"valides":[]}'); })()`);
    const f = await battement(p, fichier2);
    const pfFichier = JSON.parse(await p.evaluate("window.__f.contenu")).donnees[PFK] || "";
    assert.match(pfFichier, /P1/, "LE TROU EST OUVERT, sous sa forme recréée : le portefeuille recréé à "
      + "l'écran vide a remplacé celui du fichier. Porté : " + pfFichier);
    assert.ok(f.cles.includes(PFK), "LE TROU EST OUVERT : le stockage local vidé, la première écriture "
      + "sans geste a retiré le portefeuille du fichier. Clés : " + JSON.stringify(f.cles));
    assert.ok(f.pfs.includes("P1"), "le portefeuille n'a pas été rendu au navigateur : " + JSON.stringify(f.pfs));
    assert.match(f.msg || "", /remis ici/, "la remise est muette — l'utilisateur ne sait pas ce qui "
      + "s'est passé. Message : « " + f.msg + " ».");
    assert.match(f.msg || "", /recréé.*remplacé/, "la clé recréée depuis la perte a été remplacée sans "
      + "que le message le dise. Message : « " + f.msg + " ».");
    assert.ok(!f.cles.includes(GOLD), "une série supprimée JUSTE AVANT que le stockage local soit vidé a "
      + "été remise : la trace ne vivait que dans le stockage vidé, sa copie d'IndexedDB n'a pas servi.");

    // G · une clé qu'on ne peut pas remettre : rien n'est écrit
    await p.evaluate("localStorage.clear()");
    await p.reload(); await ouvrir(p);
    await p.evaluate(`(() => { const i = ${INSTANCE}; const vrai = Storage.prototype.setItem;
      window.__refuse = true; Storage.prototype.setItem = function (k, v) {
        if (window.__refuse && String(k).startsWith(i.CLE_PF)) throw new DOMException('plein', 'QuotaExceededError');
        return vrai.call(this, k, v); }; })()`);
    const g = await battement(p, fichier2);
    assert.equal(g.ecritures, 0, "une clé que le navigateur a refusé de reprendre a été retirée du fichier "
      + "par l'écriture qui a suivi.");
    assert.match(g.msg || "", /n’ont pas pu y être remis/, "le refus d'écrire ne dit pas pourquoi : « " + g.msg + " ».");
  } finally { await nav.close(); }
});
