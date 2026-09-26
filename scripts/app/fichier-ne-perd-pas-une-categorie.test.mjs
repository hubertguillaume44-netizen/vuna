// STATUT · CAUSE ÉTABLIE — cas RAPPORTÉ (un import incomplet : 56 séries, 2 portefeuilles,
// 19 lignes, ZÉRO scan, et un seul fichier complet qui en porte 4), trous MESURÉS DANS LE
// DÉPÔT sur 260926.3, au rendu, sur le fichier livré : les trois chemins rapportés
// n'écrivaient rien ; deux autres perdaient les scans. Un scan NEUF lancé dans la séance
// avant la première écriture automatique : le fichier passait de 4 scans à 1 (la
// confrontation compare par CLÉ, et la clé du scan existait ici). « Exporter mes données »
// en choisissant le même fichier : 4 → 0, sans aucune confrontation.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Aucun banc ne peut ouvrir le sélecteur natif : le fichier est un faux handle dont
// l'écriture suit la sémantique de `createWritable()` — rien n'arrive à l'original avant
// `close()`, `abort()` le laisse tel quel. La règle compare des COMPTES par catégorie
// (séries, scans, portefeuilles, lignes) : un scan perdu et un autre ajouté se compensent,
// et elle ne le voit pas. Un geste de vidage ouvre sa catégorie pour le reste de la séance :
// une perte subie dans la même catégorie, ensuite, passe avec lui.
//
// ————— CE QU'ELLE TIENT —————
// Une écriture dont une catégorie BAISSE par rapport au fichier, sans geste qui l'ait
// vidée, n'est pas écrite — jugé sur ce qui est réellement écrit, avant `close()` — et le
// refus n'est pas retenté à chaque minute. Les cas normaux passent (règle 16) : un scan
// supprimé, une ligne retirée, et la même suppression faite juste avant de fermer l'onglet,
// écrite à la séance suivante.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { INSTANCE, POSER_SEMIS } from "./lib/semis.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);
const SERIES = ["GOLD", "US30", "BRENT"];

let nav = null, FICHIER = null;

async function ouvrir(ctx, p0) {
  const p = p0 || await ctx.newPage();
  await p.goto("file://" + SOLO);
  await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
  const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 }).catch(() => null);
  if (porte) { await porte.click(); await p.waitForTimeout(500); }
  // un faux handle n'est pas clonable dans IndexedDB : seule la poignée est neutralisée
  await p.evaluate(`(() => { const i = ${INSTANCE}; const vrai = i.idbSet.bind(i);
    i.idbSet = async (v, cle) => (cle && cle !== 'fichier' ? vrai(v, cle) : true); })()`);
  return p;
}
// l'état du cas rapporté, sans scan : des séries, deux portefeuilles, trois lignes
const semerBase = (p) => p.evaluate(`(async () => { const i = ${INSTANCE}; const esp = i.cle('');
  localStorage.setItem('vena.series.v1' + esp, JSON.stringify(${JSON.stringify(SERIES)}));
  for (const s of ${JSON.stringify(SERIES)}) await i.grosSet('vena.series.v1' + esp + '|' + s, { t: [1, 2], c: [1, 2] });
  const v = (sym) => ({ sym, entree: 'crois', ligne: 'mme', periode: 9, sl: 1.5, rr: 2, sens: 'achat' });
  localStorage.setItem('vena.portefeuilles.v1' + esp, JSON.stringify({ pfs: [{ nom: 'P1', syms: ['GOLD'] },
    { nom: 'P2', syms: ['US30'] }], favoris: [], valides: [v('GOLD'), v('US30'), v('BRENT')] })); })()`);

// Le faux fichier. `ouvertures` compte les createWritable : un refus retenté se voit là,
// même quand il n'écrit rien.
const FAUX = `(contenu, adopter) => {
  window.__f = { contenu, ecritures: 0, ouvertures: 0 };
  const h = { kind: 'file', name: 'sauvegarde.json',
    queryPermission: async () => 'granted', requestPermission: async () => 'granted',
    getFile: async () => new File([window.__f.contenu], 'sauvegarde.json'),
    createWritable: async () => { let t = ''; window.__f.ouvertures++;
      return { write: async (x) => { t += typeof x === 'string' ? x : await new Blob([x]).text(); },
        close: async () => { window.__f.contenu = t; window.__f.ecritures++; }, abort: async () => {} }; } };
  window.showSaveFilePicker = async () => h;
  if (adopter) { const i = ${INSTANCE}; i.handleAuto = h; i._confronte = undefined; i._refusConfronte = null; }
}`;
const compter = (txt) => {
  const b = JSON.parse(txt); let scans = 0, series = 0, pfs = 0, lignes = 0;
  for (const [k, v0] of Object.entries(b.donnees || {})) {
    let v = v0; for (let n = 0; n < 2 && typeof v === "string"; n++) { try { v = JSON.parse(v); } catch (e) { v = null; } }
    if (k.startsWith("gros:vena.scan.v1") && v) scans += (v.archives || []).length;
    if (k.startsWith("gros:vena.series.v1") && k.includes("|")) series++;
    if (k.startsWith("vena.portefeuilles.v1") && v) { pfs += (v.pfs || []).length; lignes += (v.valides || []).length; }
  }
  return { series, scans, pfs, lignes };
};
const lire = async (p) => {
  const r = await p.evaluate(`(() => { const i = ${INSTANCE}; return { ecritures: window.__f.ecritures,
    ouvertures: window.__f.ouvertures, contenu: window.__f.contenu,
    msg: i.state.autoMsg || i.state.sauvMsg || '' }; })()`);
  return { ...r, porte: compter(r.contenu) };
};
async function victime() {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await ouvrir(ctx);
  await semerBase(p);
  return { ctx, p };
}
// « Choisir le fichier de sauvegarde » sur le fichier complet, puis « Fusionner » : la
// victime devient complète, et le fichier est sa sauvegarde automatique
async function adopterComplet(p) {
  await p.evaluate(`(${FAUX})(${JSON.stringify(FICHIER)}, false)`);
  await p.evaluate(`(async () => { const i = ${INSTANCE}; i.handleAuto = null; await i.choisirFichierAuto(); })()`);
  await p.waitForTimeout(700);
  await (await p.waitForSelector('button:has-text("Fusionner")', { timeout: 10000 })).click();
  await p.waitForTimeout(1800);
  const r = await lire(p);
  assert.equal(r.porte.scans, 4, "PRISE : après « Fusionner », le fichier adopté doit porter ses 4 scans — sinon "
    + "les cas de non-refus ne mesurent rien. Lu : " + JSON.stringify(r.porte) + " · " + r.msg);
}

before(async () => {
  const exe = CHROMIUMS.find((x) => existsSync(x));
  if (!exe) throw new Error("Chromium introuvable : cette garde ne saute pas en silence (VUNA_CHROMIUM=…)");
  const { chromium } = await import("playwright");
  nav = await chromium.launch({ executablePath: exe });
  // LE FICHIER est produit par les écrivains du produit : quatre scans posés et écrits par
  // `poserScan` / `ecrireScan`, puis `ecrireExportAu` — jamais un JSON écrit à la main
  const ctx = await nav.newContext();
  const p = await ouvrir(ctx);
  await semerBase(p);
  await p.evaluate(POSER_SEMIS);
  await p.evaluate(`(async () => { const i = ${INSTANCE};
    const L = (s, k, sid) => ({ sym: s, periode: 9, sl: 1.5, rr: 2, entree: 'crois', ligne: 'mme', filtre: 'v1|adx@14/20',
      filtreNom: 'ADX', n: 40, total: 12 + k, brut: 15, frais: 2, rAn: 4, esp: .3, nGains: 18, nPertes: 17, neutres: 5,
      winRate: 45, pf: 1.4, sommets: 3, exposes: 2, ambigus: 1, dd: -6, calmar: 2, nuits: .6, positifs: 4, segTotal: 5,
      oos: 3, tenue: 60, t0: Date.UTC(2023,0,2), t1: Date.UTC(2026,8,11), _sid: sid });
    const archives = [], scan = [];
    for (let a = 1; a <= 4; a++) { const id = 'scan-' + a;
      for (let k = 0; k < 5; k++) scan.push(L(${JSON.stringify(SERIES)}[k % 3], k, id));
      archives.push({ id, nom: 'Scan ' + a, date: new Date(Date.UTC(2026, 8, a)).toISOString(), n: 5, produites: 5 }); }
    i.poserScan(scan, null, { archives, fiche: null, scanVu: null });
    await new Promise((z) => setTimeout(z, 300));
    i.ecrireScan(i.lignesScan, null);
    await new Promise((z) => setTimeout(z, 800)); })()`);
  FICHIER = await p.evaluate(`(async () => { const i = ${INSTANCE}; let t = '';
    await i.ecrireExportAu({ write: async (x) => { t += typeof x === 'string' ? x : await new Blob([x]).text(); } },
      '"outil":"vuna","version":1,"date":"2026-09-22T10:00:00.000Z",');
    return t; })()`);
  await ctx.close();
  assert.deepEqual(compter(FICHIER), { series: 3, scans: 4, pfs: 2, lignes: 3 },
    "PRISE : le fichier de départ doit porter 3 séries, 4 scans, 2 portefeuilles, 3 lignes");
});
after(async () => { if (nav) await nav.close(); });

test("un scan neuf lancé avant la première écriture ne retire pas au fichier les 4 qu'il porte", async () => {
  const { ctx, p } = await victime();
  try {
    await p.evaluate(`(async () => { const i = ${INSTANCE};
      const L = { sym: 'GOLD', periode: 9, sl: 1.5, rr: 2, entree: 'crois', ligne: 'mme', n: 40, total: 1, _sid: 'neuf' };
      i.poserScan([L], null, { archives: [{ id: 'neuf', nom: 'Scan neuf', date: new Date().toISOString(), n: 1, produites: 1 }] });
      await new Promise((z) => setTimeout(z, 300)); i.ecrireScan(i.lignesScan, null);
      await new Promise((z) => setTimeout(z, 800)); })()`);
    await p.evaluate(`(${FAUX})(${JSON.stringify(FICHIER)}, true)`);
    await p.evaluate(`(async () => { const i = ${INSTANCE}; await i.sauverAuto(); })()`);
    let r = await lire(p);
    assert.equal(r.ecritures, 0, "le fichier a été remplacé : il porte maintenant " + JSON.stringify(r.porte)
      + " — la baisse des scans (4 → 1) devait être refusée avant close()");
    assert.equal(r.porte.scans, 4);
    assert.match(r.msg, /il porte 4 scans, et ce navigateur 1 scan/, "le refus doit nommer la catégorie et les deux comptes : " + r.msg);
    // le refus n'est pas retenté à chaque minute : il réécrirait tout pour refuser pareil
    const ouv = r.ouvertures;
    await p.evaluate(`(async () => { const i = ${INSTANCE}; await i.sauverAuto(); await i.sauverAuto(); })()`);
    r = await lire(p);
    assert.equal(r.ouvertures, ouv, "le battement a rouvert le fichier " + (r.ouvertures - ouv)
      + " fois après un refus pour perte : il ne doit le faire qu'au geste");
  } finally { await ctx.close(); }
});

test("« Exporter mes données » sur le fichier complet ne le remplace pas par moins", async () => {
  const { ctx, p } = await victime();
  try {
    await p.evaluate(`(${FAUX})(${JSON.stringify(FICHIER)}, false)`);
    await p.evaluate(`(async () => { const i = ${INSTANCE}; await i.exporterTout(); })()`);
    const r = await lire(p);
    assert.equal(r.ecritures, 0, "l'export a remplacé le fichier : il porte maintenant " + JSON.stringify(r.porte));
    assert.equal(r.porte.scans, 4);
    assert.match(r.msg, /il porte 4 scans, et ce navigateur 0 scan/, "le refus doit nommer ce qui serait perdu : " + r.msg);
    assert.match(r.msg, /AUTRE nom de fichier/, "le refus doit donner sa sortie : " + r.msg);
  } finally { await ctx.close(); }
});

test("règle 16 : un scan SUPPRIMÉ par le geste s'écrit (4 → 3)", async () => {
  const { ctx, p } = await victime();
  try {
    await adopterComplet(p);
    await p.evaluate(`(async () => { const i = ${INSTANCE}; i.supprimerScan(i.state.archives[0].id);
      await new Promise((z) => setTimeout(z, 900)); await i.sauverAuto(true); })()`);
    const r = await lire(p);
    assert.equal(r.porte.scans, 3, "un scan supprimé exprès doit quitter le fichier ; il porte "
      + JSON.stringify(r.porte) + " · " + r.msg);
  } finally { await ctx.close(); }
});

test("règle 16 : une ligne retirée s'écrit (3 → 2)", async () => {
  const { ctx, p } = await victime();
  try {
    await adopterComplet(p);
    await p.evaluate(`(async () => { const i = ${INSTANCE}; const s = i.lirePf();
      i.ecrirePf(s.pfs, s.favoris, s.valides.slice(1)); await i.sauverAuto(true); })()`);
    const r = await lire(p);
    assert.equal(r.porte.lignes, 2, "une ligne retirée doit quitter le fichier ; il porte "
      + JSON.stringify(r.porte) + " · " + r.msg);
  } finally { await ctx.close(); }
});

test("règle 16 : un scan supprimé juste avant de fermer l'onglet s'écrit à la séance suivante", async () => {
  const { ctx, p } = await victime();
  try {
    await adopterComplet(p);
    // supprimé, puis la page est rechargée AVANT toute écriture : le geste doit survivre
    await p.evaluate(`(async () => { const i = ${INSTANCE}; i.planifierAuto = () => {}; i.sauverAuto = async () => {};
      i.supprimerScan(i.state.archives[0].id); await new Promise((z) => setTimeout(z, 900)); })()`);
    const r0 = await lire(p);
    assert.equal(r0.porte.scans, 4, "PRISE : rien ne doit avoir été écrit avant le rechargement");
    await ouvrir(ctx, p);
    await p.evaluate(`(${FAUX})(${JSON.stringify(r0.contenu)}, true)`);
    await p.evaluate(`(async () => { const i = ${INSTANCE}; await i.sauverAuto(true); })()`);
    const r = await lire(p);
    assert.equal(r.porte.scans, 3, "la suppression faite avant le rechargement est refusée : le fichier porte "
      + JSON.stringify(r.porte) + " · " + r.msg);
  } finally { await ctx.close(); }
});
