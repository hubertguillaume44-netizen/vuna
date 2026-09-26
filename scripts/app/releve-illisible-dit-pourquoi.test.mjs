// STATUT · CAUSE ÉTABLIE — relevé dans le dépôt le 26/09/2026 (un seul `catch` rendait
// « Fichier illisible. » pour toutes les causes de l'import du relevé de courtier, la forme
// que l'import des sauvegardes venait de quitter), correctif MESURÉ DANS LE DÉPÔT, au rendu.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Les causes sont éprouvées sur des fichiers FABRIQUÉS : un refus de lecture du navigateur
// est simulé par un `text()` qui jette. Ce que le navigateur de l'utilisateur rend pour un
// fichier déplacé n'est pas mesuré ici.
//
// ————— CE QU'ELLE TIENT —————
// Chaque cause rend SA phrase — aucun fichier reçu, lecture refusée, fichier vide, aucune
// ligne reconnue (avec la première ligne du fichier), défaut de l'analyse —, et la phrase
// attrape-tout n'existe plus dans la source (ancrée sur l'absence : règle 14).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { INSTANCE } from "./lib/semis.mjs";

const APP = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

test("la phrase attrape-tout n'est plus écrite nulle part dans la source", () => {
  const n = (APP.match(/'Fichier illisible\.'/g) || []).length;
  assert.equal(n, 0, n + " « Fichier illisible. » dans la source : la phrase qui couvrait toutes les causes est revenue.");
});

test("chaque cause d'un relevé qu'on ne peut pas lire rend SA phrase", { timeout: 120000 }, async () => {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas."); }
  const executablePath = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(executablePath ? { executablePath } : {})
    .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
  try {
    const p = await (await nav.newContext()).newPage();
    await p.goto("file://" + SOLO);
    await p.waitForFunction(() => document.body && document.body.innerText.length > 400, null, { timeout: 60000 });
    const CAS = [
      ["aucun fichier", "null", /Aucun fichier n’est arrivé/],
      ["lecture refusée", "{ name: 'r.csv', size: 1200, text: async () => { throw new DOMException('x', 'NotReadableError'); } }", /refusé de lire « r\.csv » \(NotReadableError/],
      ["vide", "new File(['  \\n'], 'r.csv')", /« r\.csv » est vide/],
      ["aucune ligne", "new File(['abc;def\\n1;2\\n'], 'r.csv')", /première ligne est « abc;def »/],
      ["défaut de l'analyse", "new File(['x'], 'r.csv')", /a échoué \(TypeError : sonde\) : c’est un défaut de Vuna/, true],
    ];
    for (const [nom, f, attendu, casser] of CAS) {
      const msg = await p.evaluate(`(async () => { const i = ${INSTANCE}; i.setState({ baremeMsg: null });
        const vrai = i.analyserBareme;
        ${casser ? "i.analyserBareme = () => { throw new TypeError('sonde'); };" : ""}
        try { await i.accepterBareme(i.COURTIERS[0][0], ${f}); } finally { i.analyserBareme = vrai; }
        await new Promise((r) => setTimeout(r, 50));
        return i.state.baremeMsg || ''; })()`);
      assert.doesNotMatch(msg, /^Fichier illisible\.$/, nom + " : l'attrape-tout est revenu.");
      assert.match(msg, attendu, nom + " : la cause n'est pas nommée. Rendu : « " + msg + " ».");
    }
  } finally { await nav.close(); }
});
