// STATUT · CAUSE ÉTABLIE, MESURÉE DANS LE DÉPÔT — une sauvegarde VALIDE de 587 Mo rendait
// « Fichier illisible. » : l'import construisait le fichier entier en une chaîne, et
// Chromium refuse au-delà d'un seuil mesuré entre 461 et 482 millions d'octets. L'export,
// lui, écrit au fil. Ce fichier tient le lecteur qui relit comme on écrit.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// La propriété « ne tient jamais le fichier entier » ne se prouve pas sur un petit
// fichier : elle est mesurée une fois au rendu, sur un fichier au-delà du seuil (voir
// CLAUDE.md). Ici se prouve ce qui la rend possible : le lecteur rend, pour tout
// découpage en morceaux, exactement ce que `JSON.parse` rend du texte entier — et il
// déclare TRONQUÉ chaque préfixe strict d'un fichier valide.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { borne } from "../lib/tranche.mjs";

const APP = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const i0 = APP.indexOf("async function* lireSauvegardeAuFil(");
assert.ok(i0 > 0, "le lecteur par morceaux n'existe plus dans la source");
const lireSauvegardeAuFil = new Function(APP.slice(i0, borne(APP, "\n}\n", i0) + 2)
  + "\nreturn lireSauvegardeAuFil;")();

/** Un faux Blob qui livre le texte en morceaux de `n` OCTETS — un caractère accentué peut
 * donc être coupé en deux, ce que le vrai navigateur fait aussi. */
const decoupe = (texte, n) => ({ stream() {
  const octets = new TextEncoder().encode(texte); let i = 0;
  return new ReadableStream({ pull(c) { if (i >= octets.length) { c.close(); return; }
    c.enqueue(octets.slice(i, i + n)); i += n; } });
} });
async function lire(texte, n, options) {
  const champs = {}, entrees = [];
  for await (const e of lireSauvegardeAuFil(decoupe(texte, n), options)) {
    if ("cle" in e) entrees.push([e.cle, e.valeur]); else champs[e.champ] = e.valeur;
  }
  return { champs, entrees };
}
// Le lecteur DÉLIMITE les valeurs ; il ne revalide pas la grammaire à l'intérieur de
// chacune. Chaque consommateur fait `JSON.parse` sur chaque valeur qu'il garde — c'est
// là qu'une valeur abîmée se voit, et c'est donc ce que ce contrôle rejoue.
const cause = async (texte, n = 5) => {
  try { const r = await lire(texte, n); for (const [, v] of r.entrees) JSON.parse(v);
    for (const v of Object.values(r.champs)) JSON.parse(v); return "lu"; }
  catch (e) { return e.cause || (e instanceof SyntaxError ? "syntaxe" : e.name); } };

const PIEGE = 'a"b\\c{d}e[f]g,h:é — éè';
const DOCS = [
  { outil: "vena", version: 1, date: "2026-08-30T10:00:00.000Z", donnees: {
    "vena.portefeuilles.v1.client.fxpro": JSON.stringify({ pfs: [{ nom: PIEGE, syms: ["GOLD"] }] }),
    "gros:vena.series.v1.client.fxpro|GOLD": { t: [1, 2], c: [1.5, -2e-3], n: null, ok: true, s: PIEGE },
    ["clé \"guillemet\" \\ " + PIEGE]: "[]",
    "gros:vena.scan.v1.client.fxpro": JSON.stringify({ archives: [{ id: 1 }], lignes: [[], [[]], {}] }) } },
  { outil: "vuna", donnees: {} },
  { donnees: { a: "1" }, outil: "vuna", apres: { x: [1, { y: "}" }] } },
];

test("le lecteur rend ce que JSON.parse rend, pour tout découpage", async () => {
  for (const doc of DOCS) {
    for (const forme of [JSON.stringify(doc), JSON.stringify(doc, null, 2), "﻿" + JSON.stringify(doc)]) {
      for (const n of [1, 2, 3, 7, 64, 65536]) {
        const r = await lire(forme, n);
        assert.deepEqual(r.entrees.map(([k, v]) => [k, JSON.parse(v)]), Object.entries(doc.donnees),
          "entrées différentes de JSON.parse, découpage " + n + " : " + forme.slice(0, 60));
        for (const [k, v] of Object.entries(doc)) {
          if (k === "donnees") continue;
          assert.deepEqual(JSON.parse(r.champs[k]), v, "champ « " + k + " » mal rendu, découpage " + n);
        }
      }
    }
  }
});

test("le format chiffré rend `donnees` comme un champ, et `valeurs:false` ne garde que les clés", async () => {
  const chiffre = JSON.stringify({ vuna_chiffre: 1, sel: "abc", iv: "d", donnees: "QkFTRTY0" });
  const r = await lire(chiffre, 3);
  assert.equal(r.entrees.length, 0);
  assert.equal(JSON.parse(r.champs.donnees), "QkFTRTY0");
  const k = await lire(JSON.stringify(DOCS[0]), 4, { valeurs: false });
  assert.deepEqual(k.entrees.map(([c]) => c), Object.keys(DOCS[0].donnees));
  assert.ok(k.entrees.every(([, v]) => v === null), "`valeurs:false` a gardé des valeurs");
});

test("chaque préfixe strict d'un fichier valide est TRONQUÉ ; le reste se nomme", async () => {
  const t = JSON.stringify(DOCS[0]);
  let vus = 0;
  for (let L = 1; L < t.length; L++) {
    const c = await cause(t.slice(0, L), 3);
    assert.equal(c, "tronque", "un préfixe de " + L + " caractères sur " + t.length + " rend « " + c
      + " » : « " + t.slice(Math.max(0, L - 20), L) + " ». Il n'est ni complet ni abîmé : il s'arrête.");
    vus++;
  }
  assert.ok(vus > 300, "trop peu de préfixes éprouvés (" + vus + ")");
  assert.equal(await cause(""), "vide");
  assert.equal(await cause("   \n "), "vide");
  assert.equal(await cause("PK\u0003\u0004 zip"), "pasObjet");
  assert.equal(await cause('{"a":"1"}}'), "syntaxe");
  assert.equal(await cause('{"a" "1"}'), "syntaxe");
  assert.equal(await cause('{"a":[1,2}}'), "syntaxe");
  assert.equal(await cause(t), "lu");
});

test("`garder` choisit clé par clé : une valeur non gardée n'est jamais assemblée", async () => {
  const doc = JSON.stringify(DOCS[0], null, 1);
  const gardees = [];
  const r = await lire(doc, 7, { garder: (c, entete) => { if (!entete) gardees.push(c); return entete || c.startsWith("gros:"); } });
  assert.deepEqual(gardees, Object.keys(DOCS[0].donnees), "`garder` n'est pas consulté pour chaque entrée, dans l'ordre");
  for (const [c, v] of r.entrees) {
    if (c.startsWith("gros:")) assert.deepEqual(JSON.parse(v), DOCS[0].donnees[c], "une valeur gardée diffère : " + c);
    else assert.equal(v, null, "une valeur NON gardée a été assemblée : " + c);
  }
  assert.equal(JSON.parse(r.champs.outil), "vena", "l'en-tête a été écarté par `garder`");
});

test("aucune sauvegarde ne se relit d'un bloc — découvert, pas énuméré", () => {
  // La forme exacte de la panne : le fichier entier en une chaîne, puis parsé.
  const bloc = APP.match(/JSON\.parse\(await [\w.]+\.text\(\)\)/g) || [];
  assert.deepEqual(bloc, [], "une lecture d'un bloc est revenue : " + bloc.join(" · "));
  // Et chaque méthode qui JUGE une sauvegarde — son en-tête, son marqueur de chiffrement, ou
  // ses entrées — est découverte par ce qu'elle appelle, puis lue : aucune n'appelle `.text(`.
  const appels = [...APP.matchAll(/this\.refusEnveloppe\(|this\.estChampChiffre\(|this\.examinerSauvegarde\(|lireSauvegardeAuFil\((?!blob)/g)];
  const classe = APP.indexOf("class Component extends DCLogic {");
  const tetes = [...APP.matchAll(/\n  (?:async )?([A-Za-z_]\w*)\([^)\n]*\) \{\n/g)].filter((m) => m.index > classe);
  const vues = new Set();
  for (const m of appels) {
    const tete = tetes.filter((x) => x.index < m.index).pop();
    if (!tete) continue;
    const nom = tete[1], debut = tete.index;
    if (vues.has(nom)) continue;
    vues.add(nom);
    const corps = APP.slice(debut, borne(APP, "\n  }\n", debut));
    assert.ok(!/\.text\(/.test(corps), nom + " juge une sauvegarde et lit un fichier d'un bloc (`.text(`) : "
      + "au-delà de 461 à 482 millions d'octets, Chromium refuse, et le produit refuse ses propres fichiers.");
  }
  assert.ok(vues.size >= 4, "moins de quatre chemins de lecture découverts (" + [...vues].join(", ")
    + ") : la découverte s'est désancrée, et l'absence de `.text(` se vérifierait sur le vide.");
});
