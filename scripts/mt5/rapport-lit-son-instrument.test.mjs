// STATUT · CAUSE ÉTABLIE, MESURÉE DANS LE DÉPÔT — le faux refus a été observé sur les
// quatre rapports déposés dans `scripts/mt5/` (concorde: false sur les quatre, avec
// « ce rapport ne décrit pas C1 »), et la cause relue dans `contexteRapport`.
//
// ————— UN ANCRAGE PAR RANG A ACCUSÉ QUATRE RAPPORTS VALIDES —————
//
// `contexteRapport` lisait l'instrument à `expert.split("_")[1]` — le segment 1. Or
// `nomRobot` compose `Vuna_<sym>_<Achat|Vente>_…` et l'APPLICATION insère l'étiquette
// de compte juste après « Vuna_ » (`etiquetteCompte`), ce qui a poussé l'instrument
// d'un cran. Le lecteur a donc pris `C1` pour un instrument et réclamé un graphique
// « C1 » qui n'existe pas, sur chaque rapport.
//
// C'est la troisième instance de « le geste était juste, la carte non » : le
// générateur ne connaît pas les comptes, l'application insère l'étiquette, le lecteur
// en aval lit une position dont le sens a changé sous lui. Aucun des trois n'a tort
// isolément.
//
// ET LE FAUX REFUS ÉTAIT INVISIBLE PARCE QUE PERSONNE NE LISAIT CES RAPPORTS. Il
// accusait depuis le chantier du nom tronqué et aurait accusé indéfiniment : son seul
// usage naissait le jour du dépôt des quatre. *Une garde qui n'a jamais tourné sur un
// cas réel n'a jamais été éprouvée, quel que soit son âge.*
//
// ANGLE MORT, EN TÊTE (règle 9) : cette garde tient que l'instrument est le segment
// qui PRÉCÈDE le sens, et que `nomRobot` compose bien ainsi. Elle ne prouve pas que
// `Achat`/`Vente` restera le vocabulaire du sens — rien ici n'exécute MQL5, et c'est
// le générateur JS qui est relu. Si quelqu'un traduisait ces deux mots, la garde
// tomberait en le nommant, ce qui est la bonne fin.
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { nomRobot } from "../../robot-mt5.js";
import {
  lireFichierMt5, lireRapportMt5, contexteRapport, instrumentDeExpert, memeInstrument,
} from "./parse-mt5.mjs";

const DOSSIER = new URL(".", import.meta.url);
const RAPPORTS = readdirSync(DOSSIER).filter((f) => f.endsWith(".html")).sort();

test("la prise est prouvée : des rapports réels sont là, et ils portent des trades", () => {
  // SANS CE PREMIER TEMPS, tout ce qui suit mesurerait le décor : zéro rapport rend
  // zéro faux refus, et la garde passerait au vert sans avoir rien regardé.
  assert.ok(RAPPORTS.length >= 4,
    `${RAPPORTS.length} rapport(s) dans scripts/mt5/ — il en faut au moins quatre pour `
    + "que cette garde morde. S'ils ont été retirés, elle ne garde plus rien.");
  for (const f of RAPPORTS) {
    const r = lireRapportMt5(lireFichierMt5(new URL(f, DOSSIER)));
    assert.ok(r.trades.length > 0,
      `« ${f} » rend zéro trade. Soit le décodage a raté, soit le rapport est vide — `
      + "et les deux se ressemblent, ce qui est précisément le défaut qu'on ferme.");
  }
});

test("aucun rapport réel n'est refusé, et chacun nomme son instrument", () => {
  for (const f of RAPPORTS) {
    const { contexte } = lireRapportMt5(lireFichierMt5(new URL(f, DOSSIER)));
    assert.notEqual(contexte.attendu, null,
      `« ${f} » : aucun instrument lu dans « ${contexte.expert} ». L'ancre est le `
      + "segment qui PRÉCÈDE Achat/Vente — si le nom a changé de forme, réancrez.");
    assert.equal(contexte.concorde, true,
      `« ${f} » est REFUSÉ : le lecteur attend « ${contexte.attendu} » et le rapport `
      + `porte « ${contexte.symbole} ». Un refus sur le cas normal se fait désactiver `
      + "le premier jour (règle 16) — vérifiez l'ancre avant de toucher au rapport.");
  }
});

test("le refus attrape ENCORE l'accident qu'il existe pour attraper", () => {
  // La moitié qui compte : réparer un faux refus en rendant le refus impossible
  // aurait été une garde vacue. Un robot Spain35 posé sur un graphique GOLD doit
  // toujours être refusé.
  const exp = "Vuna_C1_Spain35_Achat_ema_20_SL0p5_RR2p5_260919_1901";
  assert.equal(instrumentDeExpert(exp), "Spain35");
  assert.equal(memeInstrument("GOLD", instrumentDeExpert(exp)), false,
    "un robot Spain35 tournant sur GOLD n'est plus refusé : le lecteur rendrait des "
    + "chiffres qui ont la forme d'une mesure de GOLD sans en être une");
});

test("l'ancre survit à ce qui a cassé la précédente, et à un cran de plus", () => {
  const cas = [
    ["Vuna_GOLD_Achat_ma_5_SL0p5_RR1p5_260919_1901", "GOLD", "sans étiquette de compte"],
    ["Vuna_C1_GOLD_Achat_ma_5_SL0p5_RR1p5_260919_1901", "GOLD", "avec l'étiquette — ce qui a cassé le rang"],
    ["Vuna_C1_X_GOLD_Achat_ma_5_SL0p5_RR1p5_260919_1901", "GOLD", "un segment de plus : un rang recasserait"],
    ["Vuna_C1_US30_Vente_ma_12_SL0p5_RR3_260919_1901", "US30", "le sens Vente"],
  ];
  for (const [exp, attendu, quoi] of cas) {
    assert.equal(instrumentDeExpert(exp), attendu,
      `${quoi} : « ${exp} » rend « ${instrumentDeExpert(exp)} » au lieu de « ${attendu} »`);
  }
});

test("sans sens lisible, on ne sait pas — et on n'accuse pas", () => {
  // Trois états, et le troisième n'est jamais un refus (la règle du zéro qui prouve
  // sa prise, appliquée à un verdict au lieu d'un compte).
  assert.equal(instrumentDeExpert("Vuna_C1_GOLD_260919_1901"), null);
  assert.equal(memeInstrument("GOLD", null), null,
    "un instrument non identifié produit un REFUS au lieu d'un « je ne sais pas » : "
    + "c'est le faux refus qui vient d'être fermé, réintroduit");

  // ET PAR LE CHEMIN RÉEL, pas seulement par la fonction nue. La première version de
  // ce test appelait `memeInstrument` en direct : la mutation qui remet l'indéterminé
  // en refus DANS `contexteRapport` est restée VERTE, parce que l'assertion ne
  // traversait jamais ce site. Une mutation inerte ne dit pas qu'une garde est
  // aveugle — elle dit qu'elle n'a pas exercé le chemin qu'on croyait éprouver.
  const faux = "<html>Expert: Vuna_C1_GOLD_260919_1901 Symbole: GOLD</html>";
  const ctx = contexteRapport(faux);
  assert.equal(ctx.attendu, null, "l'expert sans sens ne doit pas livrer d'instrument");
  assert.equal(ctx.concorde, null,
    `contexteRapport rend concorde=${ctx.concorde} au lieu de null sur un nom dont `
    + "l'instrument n'est pas identifiable : il ACCUSE sur une incertitude, ce qui "
    + "est exactement le faux refus qu'on vient de fermer");
  // L'assertion porte sur le refus DE SYMBOLE, pas sur tous les avertissements : ce
  // faux rapport n'a légitimement aucune table, et s'en plaindre est juste. Une
  // assertion trop large aurait accusé le code pour un avertissement mérité.
  const r = lireRapportMt5(faux);
  const refus = r.avertissements.filter((a) => /Rejouez le test/.test(a));
  assert.deepEqual(refus, [],
    `un rapport dont l'instrument est illisible est REFUSÉ : ${refus[0]}`);
});

test("la décoration du courtier n'est pas un autre instrument", () => {
  for (const [sym, att] of [["#HongKong50", "HongKong50"], ["#Spain35", "Spain35"], ["GOLD.r", "GOLD"]]) {
    assert.equal(memeInstrument(sym, att), true,
      `« ${sym} » contre « ${att} » est refusé : c'est le même instrument chez un `
      + "courtier qui décore ses noms (règle 16, le cas fondateur du chantier MQL5)");
  }
});

test("l'ancre est celle que nomRobot compose — relue, pas supposée", () => {
  // Sans ce test, la garde mesurerait une règle que le générateur n'applique plus :
  // le commentaire ci-dessus décrit une composition, et c'est elle qu'on vérifie.
  const nom = nomRobot(
    { sym: "Spain35", sens: "achat", ligne: "ema", periode: 20, sl: 0.5, rr: 2.5 },
    "260919_1901",
  );
  const seg = nom.split("_");
  assert.equal(seg[0], "Vuna", `nomRobot ne préfixe plus « Vuna_ » : ${nom}`);
  assert.equal(seg[2], "Achat",
    `nomRobot ne place plus le sens juste après l'instrument : ${nom}. L'ancre de `
    + "instrumentDeExpert (le segment qui PRÉCÈDE Achat/Vente) est perdue — réancrez "
    + "sur ce qui les sépare désormais, et surtout pas sur un rang.");
  assert.equal(instrumentDeExpert(nom), "Spain35",
    `l'ancre ne retrouve pas l'instrument dans un nom que nomRobot vient de produire : ${nom}`);
});

test("un décodage raté se DIT, au lieu de rendre zéro trade", () => {
  // Règle 15 : le repli devine sur une proportion d'octets nuls, et son échec était
  // muet. Un zéro de décodage raté est indistinguable d'un rapport vide.
  const d = mkdtempSync(join(tmpdir(), "mt5-decode-"));
  try {
    // UTF-16 sans marque d'ordre, précédé d'assez d'ASCII pour que l'heuristique
    // échantillonne la mauvaise fenêtre et choisisse UTF-8
    const p = join(d, "sans-bom.html");
    writeFileSync(p, Buffer.concat([
      Buffer.from("<!-- " + "x".repeat(5000) + " -->\n", "utf8"),
      Buffer.from("<tr><td>Transactions</td></tr>", "utf16le"),
    ]));
    assert.throws(() => lireFichierMt5(p), /caractères nuls/,
      "un fichier UTF-16 que l'heuristique lit en UTF-8 passe en SILENCE : l'appelant "
      + "lira zéro trade et le prendra pour un rapport vide");
    // et le message dit QUOI FAIRE — une réserve sans son geste n'est qu'une inquiétude
    let msg = "";
    try { lireFichierMt5(p); } catch (e) { msg = e.message; }
    assert.match(msg, /Rapport → HTML/,
      "le refus ne dit pas comment produire un fichier lisible : il laisse devant un "
      + "mur au lieu d'un geste");
  } finally { rmSync(d, { recursive: true }); }
});

test("et il n'a AUCUN faux refus sur les rapports réels", () => {
  // Le coût d'un refus se juge sur ses faux positifs (règle 16). La prise est le
  // caractère NUL, qu'un texte correctement décodé ne porte jamais.
  for (const f of RAPPORTS) {
    assert.doesNotThrow(() => lireFichierMt5(new URL(f, DOSSIER)),
      `« ${f} » — un rapport valide est refusé par la garde de décodage`);
  }
});
