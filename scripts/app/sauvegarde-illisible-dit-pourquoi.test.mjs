// STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ (« Fichier illisible. » sur une sauvegarde
// écrite sous l'ancien nom, version publiée non identifiée), mécanisme MESURÉ DANS LE
// DÉPÔT, au rendu : un seul `catch` rendait la même phrase pour cinq causes, dont une
// sauvegarde Véna VALIDE de 587 Mo, que `text()` refuse de lire d'un bloc.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Le cas « trop long » est mesuré pour de vrai une seule fois, hors de cette garde (un
// fichier de 560 Mo coûte ~10 s et 600 Mo de mémoire) : ici la BRANCHE est éprouvée par
// un fichier dont `text()` jette, à la taille mesurée. Ce qu'elle ne sait pas : le seuil
// d'un AUTRE navigateur, qui peut refuser plus tôt — le message nomme donc aussi
// l'exception et la taille.
//
// ————— CE QU'ELLE TIENT —————
// Chaque cause rend SA phrase, par la porte unique des trois boutons d'import ; aucune ne
// rend plus « Fichier illisible. » ; une enveloppe Véna est lue sous ses deux formats ; et
// toutes les entrées de fichier de sauvegarde acceptent les mêmes extensions — les trois
// noms du produit, que le registre promet d'accepter sans date limite.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { INSTANCE } from "./lib/semis.mjs";

const APP = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

test("toutes les entrées de fichier de sauvegarde acceptent les trois noms", () => {
  // Découvertes, pas énumérées : toute liste `accept` qui nomme `.json` est une porte de
  // sauvegarde. Mesuré avant : quatre portes, trois listes différentes, une seule avec `.vena`.
  // Les extensions ne sont PAS épelées ici : elles se dérivent de l'union des portes, et
  // chaque porte doit porter l'union. Épeler les trois noms ferait de cette garde un membre
  // du registre des anciens noms — et une union se vérifie sans rien énumérer (règle 7).
  const listes = [...APP.matchAll(/accept(?:="|\s*=\s*')([^"']*\.json[^"']*)["']/g)].map((m) => m[1]);
  assert.ok(listes.length >= 4, "moins de quatre portes d'import trouvées (" + listes.length
    + ") : la découverte s'est désancrée, et l'égalité ci-dessous se vérifierait sur le vide.");
  const union = [...new Set(listes.flatMap((l) => l.split(",")))];
  const noms = union.filter((e) => e.startsWith(".") && e !== ".json");
  assert.ok(noms.length >= 3, "les portes ne connaissent plus que " + noms.length + " extension(s) "
    + "propre(s) au produit : " + JSON.stringify(noms) + ". Le registre promet d'accepter une "
    + "sauvegarde écrite sous chacun des trois noms, sans date limite.");
  for (const ext of union) {
    const sans = listes.filter((l) => !l.split(",").includes(ext));
    assert.equal(sans.length, 0, sans.length + " porte(s) d'import grisent les fichiers « " + ext
      + " » dans le sélecteur du système : " + JSON.stringify(sans) + " — une autre porte les "
      + "accepte. Mesuré avant : quatre portes, trois listes différentes.");
  }
});

test("chaque cause d'une sauvegarde qu'on ne peut pas relire rend SA phrase", { timeout: 300000 }, async () => {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas."); }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
  try {
    const p = await (await nav.newContext({ viewport: { width: 1440, height: 1000 } })).newPage();
    await p.goto("file://" + SOLO);
    await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
    const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 }).catch(() => null);
    if (porte) { await porte.click(); await p.waitForTimeout(500); }

    const donnees = (brut) => ({
      "vena.portefeuilles.v1.client.fxpro": JSON.stringify({ pfs: [{ nom: "P1", syms: ["GOLD"] }], favoris: [], valides: [] }),
      "vena.series.v1.client.fxpro": '["GOLD"]',
      "gros:vena.series.v1.client.fxpro|GOLD": brut ? { t: [1], c: [1] } : JSON.stringify({ t: [1], c: [1] }) });
    const env = (outil, brut) => JSON.stringify({ outil, version: 1, date: "2026-08-30T10:00:00.000Z", donnees: donnees(brut) });
    // Les noms d'outil se DÉCOUVRENT dans la source : chaque nom que le produit promet de
    // lire est examiné sous les deux formats de bloc. Un quatrième nom y entrerait seul.
    const OUTILS = JSON.parse(APP.match(/const OUTILS_LUS = (\[[^\]]*\])/)[1].replace(/'/g, '"'));
    assert.ok(OUTILS.length >= 3, "OUTILS_LUS introuvable ou raccourci : " + JSON.stringify(OUTILS));
    const complet = env(OUTILS[1], true);
    const milieu = complet.slice(0, 60) + "@@@" + complet.slice(63);
    // [nom, texte, taille forcée (null = vraie), jette à la lecture, ce qui doit être rendu]
    const CAS = [
      ...OUTILS.flatMap((o) => [["« " + o + " », format courant", env(o, true), null, false, { examen: true }],
        ["« " + o + " », format d'avant le 16/09", env(o, false), null, false, { examen: true }]]),
      ["tronqué", complet.slice(0, Math.floor(complet.length * 0.6)), null, false, { msg: /s’arrête avant sa fin/ }],
      ["abîmé au milieu", milieu, null, false, { msg: /abîmé en son milieu/ }],
      ["vide", "", null, false, { msg: /vide \(0 octet\)/ }],
      ["pas du JSON", "PK\u0003\u0004 zip", null, false, { msg: /commence par « PK/ }],
      ["autre outil", JSON.stringify({ outil: "autre", donnees: {} }), null, false, { msg: /vient de « autre »/ }],
      ["sans en-tête", JSON.stringify({ donnees: {} }), null, false, { msg: /champ « outil » absent/ }],
      ["sans données", JSON.stringify({ outil: "vena" }), null, false, { msg: /champ « donnees » absent/ }],
      ["trop long (587 Mo, mesuré)", "", 587202726, true, { msg: /trop long pour que ce navigateur le lise/ }],
      ["refus de lecture sous le plafond", "", 20000000, true, { msg: /modifié ou déplacé/ }],
    ];
    for (const [nom, texte, taille, jette, attendu] of CAS) {
      const r = await p.evaluate(`(async () => { const i = ${INSTANCE};
        i.setState({ sauvMsg: '', dlgImport: null, dlgChiffre: null });
        await new Promise((ok) => setTimeout(ok, 30));
        const vrai = new File([${JSON.stringify(texte)}], 'sauvegarde.json');
        const f = ${taille === null && !jette ? "vrai" : `{ name: 'sauvegarde.json', size: ${taille},
          text: async () => { ${jette ? "throw new DOMException('refus', 'NotReadableError');" : "return ''"} } }`};
        await i.examinerImport(f);
        await new Promise((ok) => setTimeout(ok, 120));
        return { msg: i.state.sauvMsg || '', examen: !!i.state.dlgImport }; })()`);
      assert.doesNotMatch(r.msg, /^Fichier illisible\.$/,
        nom + " : la phrase attrape-tout est revenue — « Fichier illisible. » couvrait cinq causes, "
        + "dont une sauvegarde valide trop longue pour être lue d'un bloc.");
      if (attendu.examen) {
        assert.ok(r.examen, nom + " : une enveloppe que le produit a écrite n'est plus examinée — "
          + "le registre promet de la lire sans date limite. Rendu : « " + r.msg + " ».");
      } else {
        assert.match(r.msg, attendu.msg, nom + " : la cause n'est pas nommée. Rendu : « " + r.msg + " ».");
      }
    }
  } finally { await nav.close(); }
});
