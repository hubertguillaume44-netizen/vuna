// STATUT · CAUSE ÉTABLIE — le repli de `W1` sur `H4` est MESURÉ DANS LE DÉPÔT
// (`unites-agregees` : 13 270 bougies en désaccord sur la seule première famille
// d'exemple) ; la population de lignes touchées est RAPPORTÉE par l'utilisateur —
// zéro chez lui au 20/09/2026, sur ses deux espaces.
//
// ————— ANGLE MORT, EN TÊTE (règle 9) —————
// Elle tient que les TROIS ISSUES sont rendues et que la version gate le marquage.
// Elle ne tient pas que `cfgCourante` rende la bonne unité : c'est `unites-agregees` et
// `unite-filtre-pas-plus-fine` qui s'en chargent, et une erreur de définition PARTAGÉE
// entre le prédicat et le produit les laisserait vertes ensemble.
//
// ————— POURQUOI UN TEST EXISTE ALORS QUE LA POPULATION EST VIDE —————
//
// Le prédicat avait été refusé une fois, au motif que « son test compterait zéro ».
// Le motif est juste et la conclusion ne l'était pas : la population est vide dans les
// DONNÉES d'un utilisateur, pas dans une fixture. Trois lignes semées — une par issue —
// la font exister, et le test compte trois. Il n'a jamais eu besoin de la population
// réelle : il a besoin d'un CAS.
//
// ————— LES TROIS ISSUES, ET LA QUATRIÈME QUI EST UN FAUX REFUS —————
//
//   `_reg` posée à la validation, unité W1  → « à remesurer », les filtres nommés
//   archive complète, aucune unité W1       → RIEN (marquer serait un faux refus)
//   ni photo ni archive                     → « je ne peux pas le dire », jamais un silence
//   `_va` ≥ 260920.5                        → RIEN : mesurée sous le correctif (règle 16)
//
// La quatrième est celle qui décide de la survie de la garde. Un marquage qui tomberait
// aussi sur les lignes mesurées depuis serait le cas COURANT de tout le monde, et une
// garde qu'il faut désactiver pour travailler ne garde rien.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { POSER_SEMIS, INSTANCE } from "./lib/semis.mjs";
import { CLIC_CONTIENT, CLIC_EXACT } from "./lib/vues.mjs";
import { borne } from "../lib/tranche.mjs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const APP = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

// ————— LA MARQUE DE MESURE A UNE SOURCE, ET TROIS LECTEURS —————
// Trois sites estampillent une ligne mesurée. Écrits à la main, ils divergent à la
// première qu'on oublie — c'est la classe de `REFUS_ROBOT`, quatre surfaces sur cinq.
// La garde s'ancre sur ce qui AGIT (règle 3) : l'appel, jamais la prose qui le raconte.
test("l'estampille de mesure a UNE source, lue par tous ses sites", () => {
  const src = (APP.match(/marqueMesure\(\)\s*\{[^}]*\}/) || [])[0] || "";
  assert.ok(/_mv:\s*this\.MOTEUR_V/.test(src) && /_va:\s*this\.VERSION_APP/.test(src),
    "`marqueMesure()` ne rend plus les deux estampilles : "
    + (src || "elle n’existe plus")
    + "\n\n`_mv` dit sous quelle RÈGLE les trades ont été calculés, `_va` sous quelle "
    + "VERSION de l’application. Sans la seconde, un défaut de moteur refermé ne se "
    + "date pas, et une ligne qui porte le réglage touché est indistinguable d’une "
    + "ligne mesurée depuis.");
  const lecteurs = (APP.match(/this\.marqueMesure\(\)/g) || []).length;
  assert.ok(lecteurs >= 4, "seulement " + lecteurs + " site(s) appellent "
    + "`marqueMesure()` : il en faut quatre — les deux publications de scan, la "
    + "validation d’une ligne, et la remesure. Un site qui estampille à la main redevient une copie, et une copie "
    + "diverge à la première qu’on oublie.");
  const aLaMain = (APP.match(/_mv:\s*this\.MOTEUR_V/g) || []).length
    + (APP.match(/_mv = this\.MOTEUR_V/g) || []).length;
  assert.equal(aLaMain, 1, aLaMain + " écritures de `_mv` en clair : une seule est "
    + "légitime, celle de `marqueMesure()`. Les autres sont des copies qui ne "
    + "porteront pas `_va` le jour où quelqu’un les oubliera.");
});

// La comparaison de versions est de l'arithmétique, pas du texte : en lexicographique
// '260920.5' > '260921', et le prédicat laisserait passer toutes les lignes du 21.
test("deux versions se comparent par leurs NOMBRES, et une estampille absente est un AVANT", () => {
  // Les bornes JETTENT quand le motif disparaît : −1 est une borne valide pour `slice`,
  // et une tranche qui s'élargit en silence ferait compiler tout le fichier.
  const deb = borne(APP, "  versionAvant(a, b) {");
  const fin = borne(APP, "\n  }", deb);
  const f = new Function("return function " + APP.slice(deb + 2, fin + 4))();
  const cas = [
    ["", "260920.5", true, "une ligne sans estampille a été mesurée avant qu’elle existe"],
    [undefined, "260920.5", true, "idem, champ absent"],
    ["260920", "260920.5", true, "même jour, rang absent = 0 < 5"],
    ["260920.4", "260920.5", true, "même jour, rang inférieur"],
    ["260920.5", "260920.5", false, "la version du correctif elle-même"],
    ["260920.6", "260920.5", false, "rang supérieur le même jour"],
    ["260921", "260920.5", false, "le lendemain"],
    ["261001", "260920.5", false, "un mois plus tard"],
    // ————— LE CAS QUI PIÈGE UNE COMPARAISON DE CHAÎNES, ET C'EST LE RANG À DEUX
    // CHIFFRES —————
    // Il a fallu la mutation pour le trouver : la table portait « 260921 contre
    // 260920.5 » sous cette étiquette, et une comparaison de chaînes y répond JUSTE
    // ('1' > '0' à la position qui décide). Les huit cas passaient sous la mutation —
    // une garde verte sur une propriété qu'elle ne mesurait pas. Le dépôt a livré des
    // rangs à deux chiffres (`260915.12`), donc le cas est réel et non fabriqué.
    ["260920.9", "260920.10", true, "9 < 10, alors que '260920.9' > '260920.10' en texte"],
    ["260920.10", "260920.9", false, "10 > 9, alors que le texte dit l'inverse"],
  ];
  for (const [a, b, att, quoi] of cas) {
    assert.equal(f(a, b), att, "versionAvant(" + JSON.stringify(a) + ", " + JSON.stringify(b)
      + ") rend " + f(a, b) + ", attendu " + att + " — " + quoi
      + ".\n\nEn lexicographique '260920.5' > '260921' : une comparaison de chaînes "
      + "marquerait toutes les lignes mesurées le lendemain du correctif.");
  }
});

test("les trois issues du repli W1 sont RENDUES sur la rangée, et une ligne mesurée depuis ne l’est pas",
  { timeout: 240000 }, async () => {
    let chromium;
    try { ({ chromium } = await import("playwright")); }
    catch { assert.fail("garde de rendu : playwright introuvable. Elle ne saute pas."); }
    const executablePath = CHROMIUMS.find((c) => existsSync(c));
    const nav = await chromium.launch(executablePath ? { executablePath } : {})
      .catch(() => assert.fail("Chromium introuvable : cette garde ne saute pas."));
    try {
      const p = await (await nav.newContext()).newPage();
      await p.goto("file://" + SOLO);
      await p.waitForFunction(() => document.body && document.body.innerText.length > 400,
        { timeout: 60000 });
      const porte = await p.waitForSelector("button:has-text(\"J'ai compris\")", { timeout: 15000 })
        .catch(() => null);
      if (porte) {
        await porte.click();
        await p.waitForSelector(".dialog-backdrop", { state: "detached", timeout: 10000 }).catch(() => {});
      }
      await p.evaluate(POSER_SEMIS);
      await p.evaluate("window.__semis.portefeuille(3)");

      // ————— LE SEMIS POSE LES TROIS ÉTATS, ET IL VÉRIFIE SON PROPRE EFFET —————
      // Il relit par `w1Perimee` — la fonction du produit — plutôt que par les champs
      // qu'il vient d'écrire : « j'ai posé » est une intention, « l'application en
      // rend trois issues distinctes » est un résultat.
      const semer = (va) => p.evaluate("(() => { const i = " + INSTANCE + ";"
        + " const V = i.state.valides.map((v, k) => {"
        + "   if (k === 0) return { ...v, _va: " + JSON.stringify(va) + ","
        + "     _reg: { btSens: 'achat', fPivot: true, utPivot: 'W1' } };"
        + "   if (k === 1) return { ...v, _va: undefined, _reg: undefined,"
        + "     filtre: '', _sid: 'ARCH-1' };"
        + "   return { ...v, _va: undefined, _reg: undefined, _sid: 'NULLE-PART' };"
        + " });"
        + " i.setState({ valides: V, archives: [{ id: 'ARCH-1', reglages: {}, plan: {} }],"
        + "   pfOnglet: 1 });"
        + " i.forceUpdate();"
        + " return V.map((v) => { const w = i.w1Perimee(v); return w ? w.etat : 'rien'; }); })()")
        .then(async (r) => { await p.waitForTimeout(900); return r; });

      const issues = await semer(undefined);
      assert.deepEqual(issues, ["porte", "rien", "inconnu"],
        "le semis n’a pas fait exister les trois issues : " + JSON.stringify(issues)
        + ".\n\nUne garde posée sur un semis qui ne porte qu’un état mesure le DÉCOR — "
        + "la borne coupe, PUIS on vérifie ce qu’elle a coupé. Attendu : la ligne à "
        + "photo W1 « porte », celle qui a son archive et aucune unité W1 « rien », "
        + "celle qui n’a ni photo ni archive « inconnu ».");

      await p.evaluate(CLIC_CONTIENT + "('Mes décisions')");
      await p.waitForTimeout(500);
      await p.evaluate(CLIC_EXACT + "('Portefeuille')");
      await p.waitForTimeout(1800);
      const lire = () => p.evaluate(
        "(document.body.innerText || '').replace(/\\s+/g, ' ')");

      const avant = await lire();
      // ————— LA PRISE, AVANT LE VERDICT —————
      // Les rangées du portefeuille rendent tard : une capture prise trop tôt donne un
      // écran sans rangées, et « la marque n'y est pas » serait alors vrai pour une tout
      // autre raison. Une mutation voisine se lit exactement comme la bonne (§ règle 2) —
      // on exige donc d'avoir VU les trois rangées avant de conclure sur ce qu'elles
      // portent.
      const rangees = (avant.match(/Exporter/g) || []).length;
      assert.ok(rangees >= 3, "seulement " + rangees + " rangée(s) rendue(s) sur 3 : la "
        + "garde regarderait un écran sans lignes, et tout ce qui suit mesurerait le "
        + "décor.\n\nÉcran : " + avant.slice(0, 700));
      assert.ok(/ce chiffre vient du repli sur H4/.test(avant),
        "la ligne mesurée sous l’ancien repli n’est pas marquée à l’écran. Un "
        + "prédicat qui décide juste et ne rend rien ne dit rien à personne — seul le "
        + "rendu prouve que la valeur arrive (règle 11).\n\nÉcran : " + avant.slice(0, 700));
      assert.ok(/\bpivot\b/.test(avant),
        "la marque ne NOMME pas le filtre en cause. « à remesurer » sans son sujet "
        + "demande de chercher lequel des neuf filtres porte l’unité.\n\nÉcran : "
        + avant.slice(0, 700));
      assert.ok(/je ne peux pas dire si ce chiffre/.test(avant),
        "la ligne dont ni la photo ni l’archive ne se relisent ne dit RIEN — et un "
        + "silence se lit « elle va bien ». C’est `cachesDispo` : « mesuré à zéro » et "
        + "« pas mesurable » ne s’écrivent pas pareil.\n\nÉcran : " + avant.slice(0, 700));

      // ————— LE FAUX REFUS, ET C'EST LUI QUI DÉCIDE DE LA SURVIE DE LA GARDE —————
      const issues2 = await semer("260920.6");
      assert.equal(issues2[0], "rien",
        "une ligne estampillée APRÈS le correctif est encore marquée : le prédicat "
        + "tombe sur le cas normal de tout le monde, et une garde qu’il faut "
        + "désactiver pour travailler ne garde rien (règle 16).");
      await p.waitForTimeout(900);
      const apres = await lire();
      assert.ok(!/ce chiffre vient du repli sur H4/.test(apres),
        "la marque survit à l’écran sur une ligne mesurée sous le correctif.\n\nÉcran : "
        + apres.slice(0, 700));
      // et la troisième issue, elle, reste — sinon on aurait juste vidé l'écran
      assert.ok(/je ne peux pas dire si ce chiffre/.test(apres),
        "l’écran ne porte plus AUCUNE marque : l’assertion précédente passerait sur un "
        + "écran vide. La ligne indéterminable doit rester marquée.");
    } finally { await nav.close(); }
  });

// ————— LES MUTATIONS —————
//
// 1 · Retirer l'appel à `w1Perimee` du producteur de rangée (ou son `sc-if` du
//     gabarit), reconstruire le solo → la ligne semée redevient MUETTE → rouge, en
//     citant l'écran rendu. C'est la mutation demandée : le prédicat décide juste et
//     personne ne le lit.
//
// 2 · Comparer les versions comme des CHAÎNES (`String(a) < String(b)`) → rouge sur
//     `['260920.9', '260920.10']`.
//
//     ELLE EST RESTÉE VERTE AU PREMIER JET, et c'est ce qui a corrigé la table. Le cas
//     qui portait l'étiquette « piège une comparaison de chaînes » était
//     `['260921', '260920.5']` — et le texte y répond JUSTE, '1' > '0' à la position qui
//     décide. Les huit cas passaient sous la mutation : une garde verte sur la propriété
//     même qu'elle prétendait tenir. Le vrai discriminant est le RANG À DEUX CHIFFRES,
//     et le dépôt en a livré (`260915.12`).
//
// 3 · Retirer `_va` de `marqueMesure()` → rouge, PAR LA PREMIÈRE garde, qui lit la
//     source. La troisième reste verte, et c'est son angle mort : le semis POSE `_va`
//     sur les lignes plutôt que de les faire estampiller par le produit — il n'a pas de
//     scan à jouer. Ce que la garde de rendu tient est donc le PRÉDICAT et son rendu,
//     pas la chaîne qui remplit le champ ; c'est la garde de source qui la tient.
//     (Prédit à l'envers avant de mesurer : « issues2[0] rend porte ». Il rend « rien ».)
