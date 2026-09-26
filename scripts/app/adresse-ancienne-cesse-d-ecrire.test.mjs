// STATUT · CAUSE ÉTABLIE — risque RAPPORTÉ (la bascule venapp.fr → vuna.fr laisse un onglet
// de l'ancienne adresse ouvert), mécanisme MESURÉ EN SÉANCE (une redirection 301 n'arrête pas
// le script d'une page déjà chargée ; banc local à deux origines, non versionné), correctif
// MESURÉ DANS LE DÉPÔT, au rendu, sur le fichier livré.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Un onglet chargé AVANT cette version ne lit pas la signature : lui, seule la procédure
// l'arrête (« fermer tous les onglets venapp.fr »). Et le banc tourne en `file://`, dont
// l'origine est « null » : l'adresse étrangère est posée dans le fichier, jamais servie.
//
// ————— CE QU'ELLE TIENT —————
// Chaque écriture automatique signe le fichier de son adresse ; une adresse n'écrit pas
// dans un fichier signé par une AUTRE, et le dit ; un fichier sans signature (écrit avant
// cette version) s'écrit comme avant (règle 16) ; et le geste « Choisir le fichier » lève la
// garde pour l'écriture qui suit, qui re-signe le fichier.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { INSTANCE } from "./lib/semis.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

const fichier = (origine) => JSON.stringify({ outil: "vuna", version: 1, date: "2026-09-26T08:00:00.000Z",
  ...(origine ? { origine } : {}),
  donnees: { "vena.portefeuilles.v1.client.fxpro": '{"pfs":[{"nom":"P1","syms":[]}],"favoris":[],"valides":[]}' } });

const FAUX_HANDLE = `(contenu) => {
  window.__f = { contenu, ecritures: 0 };
  const h = { kind: 'file', name: 'vuna-sauvegarde.json',
    queryPermission: async () => 'granted', requestPermission: async () => 'granted',
    getFile: async () => new File([window.__f.contenu], 'vuna-sauvegarde.json'),
    createWritable: async () => { let t = '';
      return { write: async (x) => { t += typeof x === 'string' ? x : await new Blob([x]).text(); },
        close: async () => { window.__f.contenu = t; window.__f.ecritures++; }, abort: async () => {} }; } };
  window.showSaveFilePicker = async () => h;
  return h;
}`;
const etat = (p) => p.evaluate(`(() => { const i = ${INSTANCE}; let b = null;
  try { b = JSON.parse(window.__f.contenu); } catch (e) {}
  return { ecritures: window.__f.ecritures, origine: b ? b.origine : undefined, msg: i.state.autoMsg || null,
    ici: location.origin }; })()`);
/** L'écriture de la minute, SANS geste, sur un fichier déjà tenu par cet onglet. */
async function battement(p, contenu) {
  await p.evaluate(`(async () => { const i = ${INSTANCE}; const h = (${FAUX_HANDLE})(${JSON.stringify(contenu)});
    i.handleAuto = h; i._confronte = h; i._adopteIci = null; i._autoEchecs = 0; i.setState({ autoMsg: null });
    await i.sauverAuto(); })()`);
  await p.waitForTimeout(500);
  return etat(p);
}

test("une adresse n'écrit pas dans un fichier qu'une AUTRE adresse a repris — sauf par un geste",
  { timeout: 180000 }, async () => {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas."); }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
  try {
    const p = await (await nav.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
    await p.goto("file://" + SOLO);
    await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
    const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 }).catch(() => null);
    if (porte) { await porte.click(); await p.waitForTimeout(500); }
    await p.evaluate(`(() => { const i = ${INSTANCE}; i.idbSet = async () => true; })()`);

    // LA PRISE : l'adresse du banc n'est pas celle qu'on pose dans le fichier
    const AUTRE = "https://vuna.fr";
    assert.notEqual(await p.evaluate(() => location.origin), AUTRE, "le banc tourne sous l'adresse qu'il simule ailleurs.");

    // A · un fichier signé par une autre adresse : rien n'est écrit, et la raison est dite
    const a = await battement(p, fichier(AUTRE));
    assert.equal(a.ecritures, 0, "un onglet de l'ancienne adresse a réécrit le fichier que la nouvelle a repris.");
    assert.equal(a.origine, AUTRE, "la signature du fichier repris a changé sans écriture ?");
    assert.match(a.msg || "", /écrit en dernier depuis https:\/\/vuna\.fr/, "le refus ne nomme pas l'adresse qui tient le fichier : « " + a.msg + " ».");
    assert.match(a.msg || "", /Fermez-le/, "le refus ne dit pas quoi faire : « " + a.msg + " ».");

    // B · RÈGLE 16 : un fichier écrit avant cette version, sans signature, s'écrit comme avant
    const b = await battement(p, fichier(null));
    assert.equal(b.ecritures, 1, "un fichier sans signature n'est plus écrit — toutes les sauvegardes d'avant "
      + "cette version seraient refusées. Message : « " + b.msg + " ».");
    assert.equal(b.origine, b.ici, "l'écriture ne signe pas le fichier de son adresse : « " + b.origine + " ».");

    // C · un fichier signé de CETTE adresse s'écrit
    const c = await battement(p, fichier(b.ici));
    assert.equal(c.ecritures, 1, "un fichier signé par cette adresse même est refusé. Message : « " + c.msg + " ».");

    // D · le geste reprend le fichier : « Choisir », examen, « Fusionner » → écrit et re-signé
    await p.evaluate(`(() => { (${FAUX_HANDLE})(${JSON.stringify(fichier(AUTRE))}); })()`);
    await p.evaluate(`(async () => { const i = ${INSTANCE}; i.handleAuto = null; i._confronte = undefined;
      i.setState({ autoMsg: null, dlgImport: null }); await i.choisirFichierAuto(); })()`);
    await p.waitForTimeout(700);
    const b2 = await p.waitForSelector('button:has-text("Fusionner")', { timeout: 10000 });
    await b2.click();
    await p.waitForTimeout(1500);
    const d = await etat(p);
    assert.equal(d.ecritures, 1, "après « Choisir » puis « Fusionner », le fichier repris ailleurs n'est pas écrit : "
      + "le geste ne lève pas la garde. Message : « " + d.msg + " ».");
    assert.equal(d.origine, d.ici, "le fichier repris par le geste n'est pas re-signé de cette adresse.");
  } finally { await nav.close(); }
});
