// STATUT · CAUSE ÉTABLIE — défaut RAPPORTÉ par l'utilisateur (il a coché « Zones » au lieu
// de la bonne tuile et serait tombé sur un bouton grisé), cause et correctif MESURÉS DANS
// LE DÉPÔT, en confrontant le mode d'emploi au panneau de `Vuna.dc.html`.
//
// ANGLE MORT, EN TÊTE — elle exige que le nom d'ÉCRAN soit PRÉSENT dans le document dès
// que le nom INTERNE y est cité ; elle ne sait pas dire s'il est présent au bon endroit.
// Un document qui écrirait « Plus haut » une fois en passant et « cochez Sous résistance »
// dans l'instruction passerait. Anchorer sur l'instruction demanderait de reconnaître une
// phrase — de la prose, que la règle 3 interdit comme prise. Ce qui est tenu est la classe
// du défaut fondateur : le document nommait le filtre comme la SOURCE l'appelle, et ne
// montrait nulle part le nom que l'écran porte.
//
// LE COÛT EN FAUX REFUS EST MESURÉ (règle 16), et c'est ce qui a écarté la forme proposée.
// « tout libellé cité entre « » doit se retrouver dans les nom: du panneau » refuse
// 15 citations sur 15 sur ce document : « Entrée », « Stop », « Transactions », « Chaque
// tick basé sur des ticks réels » — des listes, des champs, des options du testeur et de
// la prose citée. Une garde qui refuse la totalité du cas normal est morte le premier jour.
// La population retenue est donc DÉCOUVERTE et étroite : les libellés de `COURTS_FILTRE`,
// qui sont exactement les noms que la source donne aux filtres — trois d'entre eux ne sont
// pas des tuiles du panneau aujourd'hui (« Sans filtre », « Moyenne mobile »,
// « Sous résistance »), et c'est ce décalage qui est le piège.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { borne } from "../lib/tranche.mjs";

const SRC = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const DOC = readFileSync(new URL("../../REJEU-SOUS-RESISTANCE.md", import.meta.url), "utf8");

const litteral = (s) => String(s)
  .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
  .replace(/\\'/g, "'")
  .replace(/\\\\/g, "\\");

// Les noms que la SOURCE donne aux filtres : la table des libellés courts, celle que
// lisent les messages de refus. Découverte, jamais énumérée ici.
function libellesInternes() {
  const d = borne(SRC, "COURTS_FILTRE = {");
  const f = borne(SRC, "};", d);
  const tbl = SRC.slice(d, f);
  const out = new Map();
  for (const m of tbl.matchAll(/(\w+):\s*'((?:[^'\\]|\\.)*)'/g)) out.set(m[1], litteral(m[2]));
  return out;
}

// Les noms que l'ÉCRAN porte : les tuiles du panneau de filtres, avec leur drapeau.
function tuilesDuPanneau() {
  const d = borne(SRC, "const defs = [");
  const f = borne(SRC, "\n        ];", d);
  const bloc = SRC.slice(d, f);
  const out = new Map();
  for (const m of bloc.matchAll(/\{\s*nom:\s*'((?:[^'\\]|\\.)*)'[^\n]*?drapeau:\s*(?:'(\w+)'|null)/g)) {
    out.set(m[2] || null, litteral(m[1]));
  }
  return out;
}

// La correspondance se DÉRIVE du drapeau, elle ne s'écrit pas : `resist` → `fResist`,
// `mtf` → `btMtf`. Une table de correspondance tenue à la main ici serait un lieu.
function tuileDe(cle, tuiles) {
  const cap = cle[0].toUpperCase() + cle.slice(1);
  for (const p of ["f" + cap, "bt" + cap]) if (tuiles.has(p)) return tuiles.get(p);
  return null;
}

test("le mode d'emploi nomme les filtres comme l'ÉCRAN, pas comme la source", () => {
  const internes = libellesInternes();
  const tuiles = tuilesDuPanneau();

  // PRISE — sans ces trois-là, tout ce qui suit passerait sur du vide.
  assert.ok(internes.size >= 8, `table des libellés internes désancrée : ${internes.size} entrées`);
  assert.ok([...tuiles.values()].length >= 8, `tuiles du panneau désancrées : ${tuiles.size}`);
  const divergents = [...internes].filter(([k, v]) => {
    const t = tuileDe(k, tuiles);
    return t && t !== v;
  });
  assert.ok(divergents.length >= 1,
    "aucun libellé interne ne diverge du nom de sa tuile : la garde n'a plus de sujet. "
    + "Soit les deux vocabulaires ont été unifiés — alors retirez-la (règle 14) — soit la "
    + "découverte a perdu sa prise.");

  const fautes = [];
  for (const [cle, interne] of internes) {
    if (!DOC.includes(interne)) continue;
    const tuile = tuileDe(cle, tuiles);
    if (!tuile) {
      fautes.push(`« ${interne} » est cité dans le mode d'emploi, et le panneau ne porte `
        + `AUCUNE tuile pour « ${cle} » : le lecteur cherchera une case qui n'existe pas.`);
      continue;
    }
    if (tuile !== interne && !DOC.includes(tuile)) {
      fautes.push(`« ${interne} » est le nom que la SOURCE donne à « ${cle} » (messages de `
        + `refus) ; l'écran porte « ${tuile} », et le document ne l'écrit nulle part. `
        + `Un mode d'emploi nomme les choses comme l'écran les montre.`);
    }
  }
  assert.deepEqual(fautes, [],
    "le mode d'emploi envoie cocher un libellé que l'écran ne montre pas :\n" + fautes.join("\n"));
});

// Même classe, un cran plus bas : les CHAMPS de la tuile. Le document les appelait
// « unité / bougies / marge % » quand le panneau écrit « Unité » / « Fenêtre » / « Marge » —
// « bougies » n'est que le suffixe d'unité affiché après le champ.
test("les champs du filtre rejoué portent les libellés du panneau", () => {
  const d = borne(SRC, "{ nom: 'Plus haut', on: !!s.fResist");
  const c = borne(SRC, "champs: [", d);
  const f = borne(SRC, "defaut: {", c);
  const champs = [...SRC.slice(c, f).matchAll(/ch\('((?:[^'\\]|\\.)*)'/g)].map((m) => litteral(m[1]));

  assert.equal(champs.length, 3, `champs de la tuile désancrés : ${JSON.stringify(champs)}`);
  const manquants = champs.filter((n) => !DOC.includes("« " + n + " »"));
  assert.deepEqual(manquants, [],
    `le mode d'emploi ne cite pas les champs sous le nom que le panneau leur donne : `
    + `${JSON.stringify(manquants)} — attendus ${JSON.stringify(champs)}.`);
});

// ————— ÉPROUVÉE PAR MUTATION —————
//
// 1 · le défaut fondateur remis : dans REJEU-SOUS-RESISTANCE.md, les deux « Plus haut »
//     repassés en « Sous résistance » (échange aller, puis échange INVERSE — jamais un
//     `git checkout --`, règle 13). Le premier test tombe en nommant les deux noms :
//     « Sous résistance » est le nom que la SOURCE donne à « resist » … ; l'écran porte
//     « Plus haut », et le document ne l'écrit nulle part.
//
// 2 · un champ renommé dans le panneau — `ch('Fenêtre', …)` en `ch('Longueur', …)` — fait
//     tomber le second test en nommant le manquant. C'est le sens utile : le jour où le
//     panneau change de mot, c'est le document qui a tort, et il le dit.
//
// 3 · la PRISE, éprouvée sur la perte de sujet plutôt que sur un désancrage : le libellé
//     interne aligné sur celui de la tuile (`resist: 'Plus haut'`) rend `divergents` vide,
//     et la garde tombe en disant qu'elle n'a plus de sujet — avec les deux issues écrites
//     (les vocabulaires ont été unifiés, ou la découverte a perdu sa prise). Sans elle, une
//     unification silencieuse la laisserait verte en ne gardant plus rien.
