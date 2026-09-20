// STATUT · CAUSE ÉTABLIE, MESURÉE DANS LE DÉPÔT — `W1` était replié sur `H4` par le
// moteur, l'écart chiffré en bougies avant correction (13 270 sur vx-eur seul, les dix
// familles sans exception), et la correction mesurée par la même garde.
//
// ————— LE MOTEUR ET LE ROBOT DOIVENT CONNAÎTRE LES MÊMES SEAUX —————
//
// `resamplerBrut` testait `H1`, puis `D1`, puis faisait tomber TOUT LE RESTE dans un seau
// de 4 h. L'interface offre pourtant `W1` — la liste `['H1', 'H4', 'D1', 'W1']` et le
// choix de référence du pivot — et le robot le fait vraiment : `SECONDES.W1 = 604800`.
//
// Un réglage que l'interface OFFRE, que le moteur IGNORE et que le robot HONORE est la
// classe habituelle prise à l'envers : ici ce n'est pas le robot qui ne sait pas faire,
// c'est le moteur qui n'applique pas ce qu'il annonce — et rien ne ment visiblement. La
// ligne dit « W1 », le chiffre est du H4, le robot exporté fait de vraies semaines, et
// l'écart s'impute au robot.
//
// ELLE DÉCOUVRE SA POPULATION (règle 7) : les unités viennent de `SECONDES`, dans
// `robot-mt5.js` — la table de ce qui AGIT côté robot. Une cinquième unité ajoutée là
// sans seau correspondant dans le moteur fait tomber cette garde, sans être nommée ici.
//
// ANGLE MORT, EN TÊTE : elle vérifie que chaque unité produit une série DISTINCTE et que
// son grain correspond à sa durée. Elle ne vérifie pas que le découpage tombe aux mêmes
// INSTANTS que MetaTrader — rien ici n'exécute MQL5. Ce qui est tenu, c'est que les deux
// tables reconnaissent les mêmes unités et qu'aucune ne s'efface en silence.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chargerMoteur } from "./charger-moteur.mjs";
import { borne } from "../lib/tranche.mjs";

const M = await chargerMoteur();
const ROBOT = readFileSync(new URL("../../robot-mt5.js", import.meta.url), "utf8");

// la table de ce qui AGIT côté robot — jamais une liste écrite ici
function unitesDuRobot() {
  const d = ROBOT.slice(borne(ROBOT, "const SECONDES = {"));
  return [...d.slice(0, borne(d, "};")).matchAll(/(\w+):\s*(\d+)/g)]
    .map((m) => ({ ut: m[1], sec: Number(m[2]) }));
}

// une série H1 synthétique de deux mois — assez pour que la semaine ait des voisines
function serieH1(n = 24 * 60) {
  const t = [], o = [], h = [], l = [], c = [];
  const T0 = Date.UTC(2023, 0, 2, 0, 0);          // un lundi, pour ne pas s'aligner sur l'époque
  for (let i = 0; i < n; i++) {
    const px = 100 + Math.sin(i / 17) * 3 + i * 0.01;
    t.push(T0 + i * 3600000); o.push(px); h.push(px + 0.4); l.push(px - 0.4); c.push(px + 0.1);
  }
  return { n, t, o, h, l, c };
}

test("chaque unité que le robot connaît produit une série DISTINCTE dans le moteur", () => {
  const unites = unitesDuRobot();
  assert.ok(unites.length >= 4,
    "la table `SECONDES` du robot n'est plus lisible (" + unites.length + " unité(s) "
    + "trouvée(s)) : la garde a perdu sa population et passerait au vert sur du vide.");
  const df = serieH1();
  const vus = unites.map(({ ut, sec }) => ({ ut, sec, n: M.resampler(df, ut).n }));
  const dire = vus.map((x) => x.ut + " (" + x.sec + " s) → " + x.n + " bougies").join("\n  ");

  // ————— DEUX UNITÉS QUI RENDENT LE MÊME COMPTE SONT UNE UNITÉ QUI S'EFFACE —————
  const parN = new Map();
  const collisions = [];
  for (const x of vus) {
    if (parN.has(x.n)) collisions.push(parN.get(x.n) + " et " + x.ut + " rendent " + x.n + " bougies");
    else parN.set(x.n, x.ut);
  }
  assert.deepEqual(collisions, [],
    "deux unités rendent la MÊME série :\n  " + collisions.join("\n  ")
    + "\n\nMesuré sur la même série :\n  " + dire
    + "\n\nL'une des deux est repliée sur l'autre, donc le moteur annonce une unité qu'il "
    + "n'applique pas — pendant que le robot, lui, l'applique. C'est exactement ce qui "
    + "est arrivé à `W1`, replié sur `H4` : 13 270 bougies d'écart sur une seule famille.");

  // ————— ET LE GRAIN SUIT LA DURÉE, SINON LE COMPTE SEUL NE PROUVE RIEN —————
  // Deux unités pourraient différer d'une bougie par hasard. On exige que le nombre de
  // bougies suive le rapport des secondes, à une bougie de bord près de chaque côté.
  const ecarts = [];
  for (const { ut, sec } of unites) {
    const attendu = Math.ceil(df.n * 3600 / sec);
    const obtenu = M.resampler(df, ut).n;
    if (Math.abs(obtenu - attendu) > 2) {
      ecarts.push(ut + " : " + obtenu + " bougies pour ~" + attendu + " attendues ("
        + df.n + " H1 pour des seaux de " + sec + " s)");
    }
  }
  assert.deepEqual(ecarts, [],
    "le grain d'une unité ne suit pas sa durée :\n  " + ecarts.join("\n  ")
    + "\n\nLe compte seul peut coïncider par hasard ; le RAPPORT, non. Une unité dont le "
    + "grain ne correspond pas à ses secondes est agrégée par un autre seau que celui "
    + "que le robot emploie.");
});
