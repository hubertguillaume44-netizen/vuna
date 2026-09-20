// STATUT · CAUSE ÉTABLIE — écart MESURÉ DANS LE DÉPÔT (recouvrement des jeux de trades,
// R par an, part de la grille exposée) ; la population de lignes touchées au 20/09/2026
// est RAPPORTÉE par l'utilisateur, sonde lancée sur ses deux espaces : zéro, dont zéro
// indéterminable.
//
// ————— CE QUE CETTE GARDE TIENT, ET SON ANGLE MORT EN TÊTE —————
//
// ELLE MESURE LA CONFIGURATION RÉSOLUE, JAMAIS LE PANNEAU. C'est la seule chose qui
// compte : un menu qui masque une option ne la retire ni de l'état enregistré, ni d'une
// sauvegarde importée, ni d'une archive de scan. La mutation qui le prouve est écrite en
// pied de fichier — restreindre les menus SANS normaliser dans `cfgCourante` doit laisser
// cette garde ROUGE. Si elle passait au vert, elle mesurerait le menu et un correctif
// cosmétique lui suffirait.
//
// ANGLE MORT : elle éprouve `cfgCourante`, donc ce que l'application DÉCIDE de mesurer.
// Elle ne rejoue aucun backtest et ne prouve pas que `backtesterSuivi` honore ensuite
// cette unité — c'est précisément l'inverse qui est vrai et qui a fondé le correctif :
// il ré-échantillonne AVANT d'appliquer les filtres, donc une unité plus fine y est
// inerte. La garde ferme la SOURCE de l'écart, pas le chemin du moteur.
//
// ————— LE DÉFAUT, ET CE QU'IL COÛTAIT —————
//
// `backtesterSuivi(df, cfg, ut)` passe aux filtres la série de DÉCISION. Une unité de
// filtre plus fine y est sans effet ; le robot MQL5, lui, l'honore — `secs(etat.utRsi,
// 3600)`. Les deux ne calculent pas la même chose, et le produit OFFRAIT l'écart : les
// menus servaient H1 quelle que soit la décision, et H1 était le DÉFAUT du RSI et de
// l'ADX, H4 celui de la pente. Mesuré sur la grille : 47,1 % des variantes balayées sous
// une décision D1 (16 sur 34, toutes unités de panneau par défaut).
//
// Mesuré sur les dix familles d'exemple, décision D1, croisement/rebond médiane 7 :
//
//   RSI H1   955 trades côté moteur, 1 155 côté robot — recouvrement des jeux 64 %,
//            soit 78 % de son plafond, quand « filtrer ou ne pas filtrer » en laisse 97 %
//   ADX H1   805 contre 876 — +8,8 %, DANS le bruit du testeur — pour 48 % de
//            recouvrement (52 % du plafond) et |écart R/an| médian de 80 %
//
// Le compte net était l'indicateur le plus rassurant et le seul qui ne le disait pas :
// deux jeux de même taille et de contenu disjoint rendent un écart nul. Un R par an
// change de signe sur une famille dans chacun des trois cas mesurés.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { INSTANCE } from "./lib/semis.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);
const UTS = ["H1", "H4", "D1", "W1"];

async function surLaPage(fn) {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch (e) {
    assert.fail("Cette garde lit la configuration RÉSOLUE par l'application, dans un vrai "
      + "navigateur — playwright est introuvable. Installez-le, ou posez VUNA_CHROMIUM. "
      + "Elle ne saute pas en silence : une garde de source ne peut pas voir la valeur "
      + "d'une unité, seulement le texte qui la produit.");
  }
  const exe = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(exe ? { executablePath: exe } : {})
    .catch(() => assert.fail("Chromium introuvable : installez les navigateurs playwright "
      + "ou posez VUNA_CHROMIUM. Cette garde ne saute pas."));
  try {
    const p = await (await nav.newContext()).newPage();
    const jets = [];
    p.on("pageerror", (e) => jets.push(String((e && e.message) || e)));
    await p.goto("file://" + SOLO);
    await p.waitForFunction(() => document.body && document.body.innerText.length > 400,
      { timeout: 60000 });
    const r = await fn(p);
    assert.deepEqual(jets, [], "la page a jeté pendant la mesure : " + jets.join(" · "));
    return r;
  } finally { await nav.close(); }
}

test("aucun filtre ne se résout sur une unité plus fine que l'unité de décision", { timeout: 120000 }, async () => {
  const r = await surLaPage((p) => p.evaluate(`(() => {
    const inst = ${INSTANCE};
    const RANG = { H1: 1, H4: 2, D1: 3, W1: 4 };
    const UTS = ${JSON.stringify(UTS)};
    const appel = (etat) => inst.cfgCourante('VX-500', 7, 0.7, 1.5, etat, {});
    const types = (etat) => (appel(etat).filtres || [])
      .filter((f) => f.type !== 'delai_bougies' && f.type !== 'horaire');

    // ————— LES DRAPEAUX SE DÉCOUVRENT PAR CE QU'ILS PRODUISENT (règle 7) —————
    // Pas de liste de noms : on éteint tous les booléens de l'état, puis on en rallume
    // UN et on regarde si un filtre naît. Un dixième filtre entre ici sans qu'une ligne
    // change — et un drapeau renommé ne peut pas nous faire mesurer le vide en silence.
    const base = { ...inst.state, btDelai: 0 };
    for (const k of Object.keys(base)) if (typeof base[k] === 'boolean') base[k] = false;
    const avant = new Set(types(base).map((f) => f.type));
    const drapeaux = [];
    for (const k of Object.keys(base)) {
      if (typeof base[k] !== 'boolean') continue;
      let t = [];
      try { t = types({ ...base, [k]: true }).map((f) => f.type); } catch (e) { continue; }
      const neufs = t.filter((x) => !avant.has(x));
      if (neufs.length) drapeaux.push({ cle: k, types: neufs });
    }

    // LES UNITÉS SONT FORCÉES AU PLUS FIN : sans ça la garde mesurerait les défauts du
    // panneau, qui viennent d'être corrigés, et non la normalisation qui les tient.
    const tout = { ...base };
    for (const d of drapeaux) tout[d.cle] = true;
    for (const k of Object.keys(tout)) if (/^ut[A-Z]/.test(k)) tout[k] = 'H1';

    const fautes = [], vus = new Set();
    for (const ut of UTS) {
      for (const f of types({ ...tout, ut })) {
        vus.add(f.type);
        const x = String(f.ut || '').toUpperCase();
        if (!RANG[x] || RANG[x] < RANG[ut]) {
          fautes.push('décision ' + ut + ' → ' + f.type + ' résolu sur ' + (f.ut === undefined ? '(aucune unité)' : f.ut));
        }
      }
    }
    // la porte d'affichage, sur les défauts du panneau et non sur un état forcé
    const patch = inst.unitesSuivantDecision('D1');
    return { drapeaux: drapeaux.map((d) => d.cle), types: [...vus], fautes,
      patchD1: { ut: patch.ut, utMtf: patch.utMtf, utRsi: patch.utRsi, utAdx: patch.utAdx,
        utPente: patch.utPente },
      etatUtRsi: inst.state.utRsi };
  })()`));

  // ————— LA PRISE AVANT LE VERDICT —————
  // Zéro filtre découvert n'est pas « rien à vérifier », c'est une découverte désancrée :
  // la boucle ci-dessus passerait au vert sans avoir regardé un seul filtre.
  assert.ok(r.types.length >= 6,
    "la découverte n'a trouvé que " + r.types.length + " type(s) de filtre (" + r.types.join(", ")
    + ") à partir de " + r.drapeaux.length + " drapeau(x). `cfgCourante` en construit neuf : "
    + "le repérage par « un booléen qui fait naître un filtre » a perdu sa prise, et tout "
    + "ce qui suit mesurerait un ensemble vide.");

  assert.deepEqual(r.fautes, [],
    "une unité de filtre se résout PLUS FINE que l'unité de décision :\n  "
    + r.fautes.join("\n  ")
    + "\n\nLe moteur ne la lira pas — `backtesterSuivi` ré-échantillonne AVANT d'appliquer "
    + "les filtres — et le robot MQL5, lui, l'honorera. Les deux jeux de trades divergent "
    + "alors majoritairement : 48 % de recouvrement mesuré sur l'ADX, pour un écart de "
    + "compte de 8,8 % qu'aucun rejeu ne distingue du bruit. La normalisation vit dans "
    + "`cfgCourante` (la fonction `utF`) ; la restaurer dans le seul menu ne referme rien.");
});

test("la porte d'affichage remonte les unités du panneau, et `utMtf` garde sa règle", { timeout: 120000 }, async () => {
  // ————— SANS ELLE, LE PANNEAU MENTIRAIT SUR CE QUE LA MESURE EMPLOIE —————
  // La normalisation seule suffit à la justesse du chiffre ; elle laisserait l'écran
  // afficher « RSI H1 » pendant que le moteur porte du D1. C'est la classe de
  // `fenetre-nest-pas-seance` : un champ qui nomme mal ce qu'il porte coûte plus cher
  // qu'un champ absent. Cette garde tombe si quelqu'un rétablit la constante H1.
  const r = await surLaPage((p) => p.evaluate(`(() => {
    const inst = ${INSTANCE};
    const patch = inst.unitesSuivantDecision('D1');
    const patchH1 = inst.unitesSuivantDecision('H1');
    return { d1: patch, h1: patchH1, defauts: { utRsi: inst.state.utRsi, utAdx: inst.state.utAdx,
      utPente: inst.state.utPente, utMtf: inst.state.utMtf } };
  })()`));

  assert.equal(r.defauts.utRsi, "H1",
    "le défaut de fabrique de `utRsi` n'est plus H1 (" + r.defauts.utRsi + ") : cette garde "
    + "éprouve la remontée DEPUIS le cas le plus fin, et elle ne mord plus.");

  for (const k of ["utRsi", "utAdx", "utPente"]) {
    assert.equal(r.d1[k], "D1",
      "sous une décision D1, `" + k + "` reste à " + r.d1[k] + " dans le patch du panneau. "
      + "Le chiffre serait juste — `cfgCourante` normalise — et l'écran annoncerait une "
      + "unité que la mesure n'emploie pas. C'est le défaut que cette porte existe pour "
      + "fermer, et c'est lui qui faisait 47,1 % de la grille sous une décision D1.");
  }
  assert.equal(r.d1.utMtf, "W1",
    "`utMtf` ne suit pas SA règle — strictement au-dessus de la décision : attendu W1 sous "
    + "D1, obtenu " + r.d1.utMtf + ". Son nom promet une unité supérieure, pas égale ; "
    + "l'unifier avec les autres changerait sa sémantique.");
  assert.equal(r.h1.utRsi, undefined,
    "sous une décision H1, la porte remonte quand même `utRsi` (" + r.h1.utRsi + ") alors "
    + "qu'aucune unité ne peut être plus fine que H1. Elle écrase un réglage choisi.");
});

// ————— LES DEUX MUTATIONS, ET CE QUE CHACUNE PROUVE —————
//
// 1 · Rendre une unité plus fine à un filtre — dans `cfgCourante`, remplacer
//     `ut: utF(s.utRsi)` par `ut: s.utRsi` — fait tomber le premier test en nommant
//     « décision D1 → rsi résolu sur H1 ». Vérifié.
//
// 2 · CELLE QUI COMPTE : restreindre les MENUS sans normaliser. On retire `utF` de
//     `cfgCourante` en gardant `uts3 = utsDe([...])` et les défauts `utD(…)`. La garde
//     doit rester ROUGE — elle appelle `cfgCourante` sur un état forcé, jamais le
//     panneau. Vérifié : elle tombe au même endroit, avec le même message.
//
//     Si elle passait au vert, elle mesurerait le menu et non la configuration, et un
//     correctif cosmétique lui suffirait — alors qu'un état importé, une archive de scan
//     ou une sauvegarde ancienne ne passent par aucun menu.
