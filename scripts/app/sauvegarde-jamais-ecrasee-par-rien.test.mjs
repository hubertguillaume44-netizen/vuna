// STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ (une sauvegarde écrite sous l'ancien nom, que
// l'application dit « illisible », à la veille d'un changement d'adresse), écrasement
// MESURÉ DANS LE DÉPÔT, au rendu, sur le fichier livré : navigateur vide, un fichier de
// cinq blocs choisi par « Choisir le fichier de sauvegarde » → il n'en portait plus
// qu'un, la session vide de l'essai.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Aucun banc ne peut ouvrir le sélecteur natif : le fichier est un faux handle, dont
// l'écriture suit la sémantique de `createWritable()` (rien n'arrive à l'original avant
// `close()`). Et un faux handle n'est pas clonable dans IndexedDB : `idbSet` est
// neutralisé, lui seul — un vrai FileSystemFileHandle l'est. Ce que la garde ne voit pas :
// la boîte « remplacer ? » de Chrome, qui précède l'écriture et que personne ne lit
// comme un avertissement quand il croit CHARGER son fichier.
//
// ————— CE QU'ELLE TIENT —————
// Une écriture qui ne porte aucun bloc lourd (série ou scan) ne remplace jamais un
// fichier qui en porte — décidé sur ce qui a été ÉCRIT, avant `close()`. Et les trois
// cas normaux passent (règle 16) : un fichier neuf, un fichier qui ne portait que la
// session vide du même navigateur, un navigateur qui a des données.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { POSER_SEMIS, INSTANCE } from "./lib/semis.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

// Une sauvegarde Véna telle que l'export l'écrivait : petites clés, puis blocs lourds.
const SAUVEGARDE = JSON.stringify({ outil: "vena", version: 1, date: "2026-08-30T10:00:00.000Z",
  donnees: { "vena.portefeuilles.v1.client.fxpro": '{"pfs":[{"nom":"P1","syms":["GOLD"]}],"valides":[]}',
    "vena.series.v1.client.fxpro": '["GOLD"]',
    "gros:vena.series.v1.client.fxpro|GOLD": { t: [1], c: [1] } } });
const CHIFFRE = JSON.stringify({ vena_chiffre: 1, sel: "x", iv: "y", data: "gros:" });
const SESSION_SEULE = JSON.stringify({ outil: "vuna", version: 1, date: "2026-09-26T08:00:00.000Z",
  donnees: { "vena.session.v1.client.fxpro": "{}" } });

const FAUX_HANDLE = `(contenu) => {
  window.__f = { contenu, ecritures: 0 };
  const h = { kind: 'file', name: 'sauvegarde.json',
    queryPermission: async () => 'granted', requestPermission: async () => 'granted',
    getFile: async () => new File([window.__f.contenu], 'sauvegarde.json'),
    createWritable: async () => { let t = '';
      return { write: async (x) => { t += typeof x === 'string' ? x : await new Blob([x]).text(); },
        close: async () => { window.__f.contenu = t; window.__f.ecritures++; }, abort: async () => {} }; } };
  window.showSaveFilePicker = async () => h;
}`;

async function ouvrir(nav) {
  const p = await (await nav.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
  await p.goto("file://" + SOLO);
  await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
  const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 }).catch(() => null);
  if (porte) { await porte.click(); await p.waitForTimeout(500); }
  await p.evaluate(`(() => { const i = ${INSTANCE}; i.idbSet = async () => {}; })()`);
  return p;
}
/** Choisit un fichier au contenu donné par le geste du produit, et dit ce qu'il est devenu. */
async function choisir(p, contenu) {
  await p.evaluate(`(${FAUX_HANDLE})(${JSON.stringify(contenu)})`);
  await p.evaluate(`(async () => { const i = ${INSTANCE}; i.setState({ autoMsg: null });
    i._autoEchecs = 0; await i.choisirFichierAuto(); })()`);
  await p.waitForTimeout(600);
  return p.evaluate(`(() => { const i = ${INSTANCE}; let b = null; try { b = JSON.parse(window.__f.contenu); } catch (e) {}
    return { ecritures: window.__f.ecritures, blocs: b && b.donnees ? Object.keys(b.donnees).length : null,
      lourds: b && b.donnees ? Object.keys(b.donnees).filter((k) => k.startsWith('gros:')).length : null,
      msg: i.state.autoMsg || null }; })()`);
}

test("une écriture qui ne porte rien ne remplace jamais une sauvegarde qui porte quelque chose",
  { timeout: 300000 }, async () => {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas."); }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
  try {
    const p = await ouvrir(nav);
    // ————— LA PRISE : le navigateur du banc ne porte AUCUN bloc lourd —————
    // Sinon l'écriture en porterait, et le cas d'écrasement ne pourrait pas se produire.
    // Elle se lit sur la grandeur même que la garde compare : les blocs lourds que
    // l'écriture de ce navigateur porterait, énumérés par le chemin de l'export.
    const lourdsIci = await p.evaluate(`(async () => { const i = ${INSTANCE}; let n = 0;
      for await (const [k] of i.blocsExport()) if (k.startsWith('gros:')) n++; return n; })()`);
    assert.equal(lourdsIci, 0, "le banc part d'un navigateur dont l'écriture porterait "
      + lourdsIci + " bloc(s) lourd(s) : le cas mesuré (quelqu'un qui arrive SANS ses données) "
      + "n'existe plus, et la garde mesurerait le décor.");

    // A · le cas mesuré : une vraie sauvegarde, un navigateur vide → rien n'est écrit
    const a = await choisir(p, SAUVEGARDE);
    assert.equal(a.ecritures, 0,
      "l'écriture a remplacé une sauvegarde qui porte un bloc lourd par un état qui n'en porte "
      + "aucun — il reste " + a.blocs + " bloc(s), " + a.lourds + " lourd(s). C'est la perte "
      + "mesurée : cinq blocs devenus un seul, la session vide.");
    assert.equal(a.lourds, 1, "la sauvegarde n'est plus intacte : " + a.lourds + " bloc lourd au lieu de 1.");
    assert.match(a.msg || "", /Rien n’a été écrit/,
      "le refus est muet : il faut qu'il dise ce qui n'a pas été fait. Rendu : « " + a.msg + " ».");
    assert.match(a.msg || "", /Importer mes données/,
      "le refus ne nomme pas le geste que la personne voulait faire — recharger. Rendu : « " + a.msg + " ».");

    // D · un fichier CHIFFRÉ ne se lit pas sans sa phrase : il est traité comme plein
    const d = await choisir(p, CHIFFRE);
    assert.equal(d.ecritures, 0, "une sauvegarde chiffrée a été écrasée par un état vide : "
      + "son contenu ne se lit pas, donc rien ne disait qu'elle était vide.");

    // ————— RÈGLE 16 : les trois cas normaux passent —————
    // B · un fichier NEUF (vide) : c'est le premier usage du bouton
    const b = await choisir(p, "");
    assert.equal(b.ecritures, 1, "un fichier NEUF n'est plus écrit : le premier usage du bouton "
      + "est refusé. Message : « " + b.msg + " ».");
    // C · un fichier qui ne portait que la session vide du même navigateur : la
    // sauvegarde automatique de quelqu'un qui n'a encore rien déposé
    const c = await choisir(p, SESSION_SEULE);
    assert.equal(c.ecritures, 1, "la sauvegarde automatique d'un navigateur encore vide est "
      + "refusée sur son propre fichier, qui ne porte aucun bloc lourd — un faux refus qui "
      + "reviendrait chaque minute. Message : « " + c.msg + " ».");
    // E · un navigateur qui a des données écrit par-dessus une sauvegarde : le cas courant
    await p.evaluate(POSER_SEMIS);
    await p.evaluate("window.__semis.scan(4, ['VX-EUR','VX-500'])");
    await p.waitForTimeout(800);
    // le semis pose le scan en MÉMOIRE ; c'est le produit qui le range — sans ce geste,
    // l'écriture ne porterait toujours aucun bloc lourd et E mesurerait le décor
    await p.evaluate(`(() => { const i = ${INSTANCE}; i.ecrireScan(i.lignesScan, i.state.fiche); })()`);
    await p.waitForTimeout(1500);
    const e = await choisir(p, SAUVEGARDE);
    assert.equal(e.ecritures, 1, "un navigateur qui PORTE des données ne peut plus écrire dans "
      + "une sauvegarde existante : la sauvegarde automatique est morte pour tout le monde. "
      + "Message : « " + e.msg + " ».");
    assert.ok(e.lourds >= 1, "l'écriture du navigateur semé ne porte aucun bloc lourd : le semis "
      + "n'a rien posé, et le cas E mesure le décor.");
  } finally { await nav.close(); }
});
