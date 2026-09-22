// STATUT · PORT MESURÉ DANS LE DÉPÔT — bougie par bougie contre `filtreSousResistance`,
// et chaque décision de la simulation RELUE dans le corps MQL5 émis ; REJEU MT5 EU LIEU,
// RAPPORTÉ — GOLD chez FxPro, 2020.01.01 → 2026.09.08, 235 trades pour 237 mesurés, dans
// la bande de réussite. Aucun journal n'est entré dans `scripts/mt5/`.
//
// LE PARTAGE, ET IL EST LA SEULE FORME HONNÊTE DU VERDICT :
//
//   le REJEU ferme la PRÉSENCE  — le filtre agit dans le robot réel
//   la GARDE ferme la JUSTESSE  — la fenêtre, la marge et l'unité sont les bonnes
//
// Écrire « port validé » promettrait les deux, et c'est ce fichier lui-même qui l'interdit :
// il a MESURÉ qu'un port faux de fenêtre (±1 seau), de marge (0,9 % contre 1 %) ou d'unité
// rend 0,4 à 4,2 % d'écart, et l'écart observé — 0,84 % — tombe DEDANS. Le rejeu ne
// distingue donc pas la justesse des paramètres, et ne le pourra jamais. Voir « ce que
// l'arbitre peut trancher », en tête, et le pied de fichier pour ce que le rejeu a rendu.
//
// ————— CE QUE L'ARBITRE PEUT TRANCHER, ET CE QU'IL NE PEUT PAS —————
//
// Le report du port avait été justifié par le bruit du testeur MT5 — 50 249 prix en
// désaccord entre deux jeux de données du même courtier. L'objection prouvait trop : le
// même arbitre a établi six concordances au trade près. Elle a donc été CHIFFRÉE, sur
// les dix familles d'exemple, configuration d'achat croisement/rebond 7, SL 0,7 / RR 1,5 :
//
//   filtre absent → présent   1 328 → 950 trades   −28,5 %   (10,7 % à 44,7 % par famille)
//   bruit de l'arbitre        12/161 = 7,5 %   ·   10/91 = 11,0 %
//
// L'écart du FILTRE vaut 3,8 fois le bruit : l'arbitre sait dire « le filtre est là ou
// il n'y est pas », comme il l'a dit six fois. Mais la question du port n'est pas
// celle-là, et la seconde mesure la retourne :
//
//   fenêtre N = 19 au lieu de 20        939 trades   1,2 %   ← SOUS le bruit
//   fenêtre N = 21 au lieu de 20        954 trades   0,4 %   ← SOUS le bruit
//   marge 0,9 % au lieu de 1 %          990 trades   4,2 %   ← SOUS le bruit
//
// UNE QUATRIÈME LIGNE A ÉTÉ RETIRÉE, ET SA CORRECTION VAUT MIEUX QUE LE CHIFFRE.
// « unité H4 au lieu de D1 → 0,0 % » avait été rapporté comme un fait remarquable : un
// port qui se trompe d'unité passerait un rejeu sans une ride. C'était faux, et
// l'explication avait été annoncée puis jamais donnée — un chiffre trop propre dont on
// tait la cause.
//
// Mesuré : `backtesterSuivi(df, cfg, 'D1')` ré-échantillonne AVANT d'appliquer les
// filtres, donc il passe au filtre la série D1 (783 bougies), jamais la H1 (18 009).
// Ré-échantillonner une série D1 en H4 la rend telle quelle — 783 bougies des deux
// côtés, masques identiques, zéro trade d'écart PAR CONSTRUCTION. L'unité du filtre est
// dégénérée dès qu'elle est plus grossière ou égale à celle de la décision.
//
// Les « 5 447 bougies qui diffèrent » avaient été comptées sur la série H1 — celle que
// ce backtest ne donne jamais au filtre. Deux populations, comptées l'une pour l'autre,
// dans le paragraphe qui nomme ce défaut.
//
// Ce qui reste : les trois premières lignes, mesurées par le même chemin et toutes sous
// le bruit. L'argument tient sur elles ; il n'avait pas besoin de la quatrième.
//
// > Un arbitre qui distingue la PRÉSENCE d'un filtre ne distingue pas sa JUSTESSE.
// > Ce sont deux questions, et une seule mesure répondait — c'est la figure des deux
// > populations comptées l'une pour l'autre, appliquée à un critère de preuve.
//
// La mutation que le brief proposait — décaler la fenêtre d'un seau, rouge obligatoire —
// aurait donc été VERTE sur un rejeu MT5 : 1,2 %, dans le bruit. Posée ici, sur les
// bougies, elle est rouge immédiatement. C'est la même mutation ; seul l'instrument
// change, et c'est l'instrument qui décidait.
//
// ————— CE QUE CETTE GARDE PROUVE, ET SON ANGLE MORT EN TÊTE —————
//
// Elle porte en JS la logique que le MQL5 émis exécute — agrégation par seaux, seau
// contenant la bougie décidante, plafond sur les n seaux PRÉCÉDENTS — et exige
// l'égalité BOUGIE PAR BOUGIE avec `filtreSousResistance`. Zéro tolérance.
//
// ANGLE MORT : rien dans le dépôt n'exécute MQL5. Ce port est fidèle à la LECTURE du
// source émis, pas à ce que MetaTrader en fait. Il attrape une erreur de fenêtre, de
// borne, de marge, d'unité ou d'alignement de seau ; il n'attrape pas une différence
// entre ce que je lis de MQL5 et ce que MQL5 fait. C'est la même portée que le port de
// `Ligne()` dans `panneau-se-replie`, et elle se déclare pareil.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chargerMoteur } from "./charger-moteur.mjs";
import { genererMQ5 } from "../../robot-mt5.js";
import { construireConfig } from "./config.mjs";
import { borne } from "../lib/tranche.mjs";

const M = await chargerMoteur();
const SRC = readFileSync(new URL("../../Vuna.dc.html", import.meta.url), "utf8");
const code = SRC.slice(borne(SRC, "// ————— LES DIX SÉRIES D'EXEMPLE SONT ENGENDRÉES, JAMAIS LIVRÉES —————"),
  borne(SRC, "// ————— FIN DU GÉNÉRATEUR D'EXEMPLES —————"))
  + "\nexport { EXEMPLES, engendrerExemple, facteurMacro };";
const G = await import("data:text/javascript;base64,"
  + Buffer.from(code, "utf8").toString("base64"));
const macro = G.facteurMacro(3 * 365 * 24);
const SECONDES = { H1: 3600, H4: 14400, D1: 86400 };

// ————— LE PORT : ce que le MQL5 émis calcule, écrit en JS —————
//
// IL SIMULE LA VUE DU ROBOT, et c'est ce qui l'empêche d'être tautologique. Réécrire
// l'algorithme du moteur en d'autres mots ne prouverait rien — c'est la prise dérivée de
// ce qu'elle vérifie, nommée ailleurs dans ce dépôt. Ce port-ci suit la contrainte que
// le moteur n'a pas : le robot ne voit que des seaux bâtis à la volée, dont le dernier
// est RETIRÉ parce qu'il se forme encore.
//
// ET LA MUTATION A DIT QUE CETTE CONTRAINTE-LÀ NE MORD PAS, ce qui est une réponse et
// non un trou. Compter le seau en formation parmi les gardés (`seau.length` au lieu de
// `seau.length - 1`) laisse la garde VERTE — et en relisant pourquoi, les deux
// formulations retombent sur le même ensemble : « les n seaux qui précèdent celui de la
// bougie décidante ». Que le seau courant soit déjà clos ou encore en formation change
// l'indice trouvé, jamais la fenêtre.
//
// > Une mutation inerte qui s'explique est une PROPRIÉTÉ mesurée, pas une garde aveugle.
// > Ici elle dit que l'alignement de seau est robuste — le seul endroit où le port
// > pouvait dériver en silence ne peut pas. Ce qui mord, ce sont la FENÊTRE, la BORNE
// > du plafond et la MARGE : les trois autres mutations tombent, celle-ci ne peut pas.
//
// L'agrégation est incrémentale : la reconstruire à chaque bougie coûtait 39 s pour le
// même résultat, et un banc lent finit par être sauté.

function masqueRobot(df, par, decalage = 0, gardeBrute = false) {
  const sec = par.sec;
  const marge = par.marge;
  const n = par.n + decalage;
  const out = new Array(df.n).fill(false);
  const seau = [], haut = [];                 // seaux bâtis sur les bougies déjà closes
  for (let i = 0; i < df.n; i++) {
    // la bougie i est EN FORMATION du point de vue du robot : CopyRates la rend, et
    // c'est elle qui décide si le seau de la bougie décidante est encore le dernier.
    // On l'intègre AVANT de décider, sinon la branche « le seau est déjà clos » de
    // `PlafondResist` n'existe pas dans la simulation.
    const kc = Math.floor(df.t[i] / 1000 / sec);
    if (seau.length === 0 || seau[seau.length - 1] !== kc) { seau.push(kc); haut.push(df.h[i]); }
    else if (df.h[i] > haut[haut.length - 1]) haut[haut.length - 1] = df.h[i];
    if (i < 1) continue;
    // `Agreger` retire le seau en formation ; `gardeBrute` ne le retire pas, et la
    // garde d'équivalence plus bas MESURE que les deux rendent le même masque.
    const garde = seau.length - (gardeBrute ? 0 : 1);
    const sD = Math.floor(df.t[i - 1] / 1000 / sec);
    let j = garde;
    for (let k = garde - 1; k >= 0; k--) if (seau[k] === sD) { j = k; break; }
    if (j - n < 0) continue;
    let hi = -Infinity;
    for (let k = j - n; k < j; k++) if (haut[k] > hi) hi = haut[k];
    if (hi > 0) out[i] = df.c[i - 1] < hi * marge;
  }
  return out;
}

const CAS = [{ ut: "D1", lookback: 20, marge_pct: 1 }, { ut: "D1", lookback: 50, marge_pct: 2 },
  { ut: "H4", lookback: 10, marge_pct: 0.5 }, { ut: "W1", lookback: 8, marge_pct: 1 }];

// ————— LES PARAMÈTRES VIENNENT DU TEXTE ÉMIS, PAS DE LA CONFIGURATION —————
// Sans ça, la simulation et le générateur liraient tous deux `cfg` et s'accorderaient
// par construction : une émission qui écrirait 19 au lieu de 20 passerait, puisque la
// simulation ne l'aurait jamais lue. On EXTRAIT donc du MQL5 produit les trois nombres
// qui décident, et c'est eux qu'on joue.
function emis(etat) {
  return genererMQ5({ sym: "VX-500", sens: "achat", ligne: "mediane", periode: 7,
    sl: 0.7, rr: 1.5 }, { etat, risquePct: 1, ut: "H1", hasard: "non contrôlé",
    spreadMaxPct: 0.05, stamp: "260920_0000", magic: 1234 });
}
function parametresEmis(etat) {
  const src = emis(etat);
  const appel = /PlafondResist\((\d+), (\d+), tDec\)/.exec(src);
  const seuil = /double seuil = plaf \* ([\d.]+);/.exec(src);
  const clot = /double c = C_\((\d+), (\d+)\);/.exec(src);
  if (!appel || !seuil || !clot) {
    throw new Error("le MQL5 émis ne porte plus la forme attendue de « sous résistance » :"
      + " appel=" + !!appel + " seuil=" + !!seuil + " clôture=" + !!clot
      + ". La simulation ne peut plus tirer ses paramètres du texte, donc elle les "
      + "tirerait de la configuration — et s'accorderait avec le moteur par construction.");
  }
  return { sec: Number(appel[1]), n: Number(appel[2]), marge: Number(seuil[1]),
    secClot: Number(clot[1]), shiftClot: Number(clot[2]), src };
}

test("le port MQL5 de « sous résistance » rend le MÊME masque que le moteur, bougie par bougie", () => {
  const dits = [];
  let bougies = 0, vrais = 0;
  for (const [id] of G.EXEMPLES) {
    const df = G.engendrerExemple(id, Date.UTC(2022, 8, 12), macro);
    for (const cfg of CAS) {
      const par = parametresEmis({ fResist: true, utResist: cfg.ut,
        resistLookback: cfg.lookback, resistMarge: cfg.marge_pct, btSens: "achat" });
      const att = M.filtreSousResistance(df, cfg);
      const obt = masqueRobot(df, par);
      let diff = 0, premier = -1;
      for (let i = 0; i < df.n; i++) {
        if (att[i] !== obt[i]) { diff++; if (premier < 0) premier = i; }
      }
      bougies += df.n;
      vrais += att.filter(Boolean).length;
      if (diff) {
        dits.push(id + " · " + cfg.ut + " N=" + cfg.lookback + " marge " + cfg.marge_pct
          + " % → " + diff + " bougie(s) divergent, la première à l'indice " + premier
          + " (" + new Date(df.t[premier]).toISOString() + ") : moteur " + att[premier]
          + ", robot " + obt[premier]);
      }
    }
  }
  // ————— LA PRISE AVANT LE VERDICT —————
  // Un masque tout à faux serait identique des deux côtés et ne prouverait rien : la
  // garde exige d'avoir vu le filtre DÉCIDER, dans les deux sens.
  assert.ok(bougies > 100000 && vrais > bougies * 0.1 && vrais < bougies * 0.95,
    "la confrontation porte sur " + bougies + " bougies dont " + vrais + " passantes : "
    + "le filtre ne décide plus rien sur ce semis, et l'égalité serait celle de deux "
    + "masques constants.");
  assert.deepEqual(dits, [],
    "le robot et le moteur ne lisent pas la même chose :\n  " + dits.join("\n  ")
    + "\n\nUn robot qui diverge du moteur sur le masque donne un nombre de trades "
    + "différent de la mesure — et l'écart serait SOUS le bruit du testeur MT5, donc "
    + "invisible à un rejeu. C'est ici qu'il se voit ou nulle part.");
});

test("le source ÉMIS appelle la règle, et porte ses trois paramètres", () => {
  // Sans ça, le port ci-dessus mesurerait une règle que personne n'exécute — le piège
  // que `robot-tient-son-symbole` nomme depuis son premier jour.
  const cfg = { sym: "VX-500", sens: "achat", ligne: "mediane", periode: 7, sl: 0.7, rr: 1.5 };
  const etat = { fResist: true, utResist: "D1", resistLookback: 20, resistMarge: 1, btSens: "achat" };
  const mq5 = genererMQ5(cfg, { etat, risquePct: 1, ut: "H1", hasard: "non contrôlé",
    spreadMaxPct: 0.05, stamp: "260920_0000", magic: 1234 });
  assert.match(mq5, /double PlafondResist\(long sec, int n, datetime tDecision\)/,
    "le source émis ne porte plus la fonction du plafond : le port ci-dessus décrit une "
    + "règle que le robot n'exécute pas.");
  assert.match(mq5, /PlafondResist\(86400, 20, tDec\)/,
    "l'appel n'emporte pas les trois paramètres de la ligne (86400 s, 20 seaux) : "
    + "le robot mesurerait une autre configuration que celle qui a été validée.");
  assert.match(mq5, /plaf \* 0\.99/,
    "la marge n'est pas écrite dans la comparaison : 1 % doit donner un seuil à 0,99 "
    + "du plafond.");
  // et le refus ne doit plus exister pour ce filtre
  assert.doesNotMatch(mq5, /Sous résistance/,
    "le générateur nomme encore « Sous résistance » comme réglage refusé alors qu'il "
    + "sait l'écrire.");
});

test("chaque décision de la simulation est LUE dans le corps MQL5 émis", () => {
  // ————— DEUX ARTEFACTS QUI DISENT LE MÊME SAVOIR, ET RIEN NE LES CONFRONTAIT —————
  //
  // La garde du haut prouve que la SIMULATION égale le moteur. Elle ne prouvait pas que
  // la simulation égale le MQL5 : les deux ont été écrits à la main, d'après la même
  // intention, et personne ne les confrontait. C'est mot pour mot la classe des cinq
  // copies d'une phrase — une transcription manquée reste verte.
  //
  // Et la sortie de secours est fermée par la mesure : un rejeu MT5 ne rattraperait pas
  // un port faux, puisque les signatures d'erreur fines sont sous le bruit du testeur.
  // Si la simulation diverge du MQL5, rien ne le voit — ni le dépôt, qui n'exécute pas
  // MQL5, ni le testeur, qui ne résout pas l'écart.
  //
  // La chaîne est donc refermée par le seul bout disponible : chaque décision que la
  // simulation prend est ASSERTÉE dans le texte émis. Les paramètres en sont déjà tirés
  // (voir `parametresEmis`) ; voici la structure. Ce qui reste dehors est écrit en tête
  // du fichier — ce que MetaTrader fait de ce texte.
  const { src } = parametresEmis({ fResist: true, utResist: "D1", resistLookback: 20,
    resistMarge: 1, btSens: "achat" });
  const corps = src.slice(borne(src, "double PlafondResist(long sec, int n, datetime tDecision)"));
  const fn = corps.slice(0, borne(corps, "\n}\n"));
  const exige = [
    [/int j = g_n;/, "j vaut g_n par défaut", "la simulation part du seau JUSTE APRÈS le dernier gardé"],
    [/for\(int i = g_n - 1; i >= 0; i--\) if\(g_seau\[i\] == sD\) \{ j = i; break; \}/,
      "la recherche descend depuis g_n - 1", "la simulation descend depuis garde - 1"],
    [/if\(j - n < 0\) return 0\.0;/, "le refus quand l'historique manque",
      "la simulation saute la bougie quand j - n < 0"],
    [/for\(int k = j - n; k < j; k\+\+\) if\(g_h\[k\] > hi\) hi = g_h\[k\];/,
      "la fenêtre est [j-n, j-1] et le maximum porte sur les HAUTS",
      "la simulation lit haut[k] sur la même borne EXCLUSIVE"],
    [/long sD = SeauDe\(tDecision, sec\);/, "le seau cherché est celui de la bougie décidante",
      "la simulation calcule sD de la même façon"],
  ];
  const manquants = exige.filter(([re]) => !re.test(fn))
    .map(([, quoi, pourquoi]) => quoi + " — " + pourquoi);
  assert.deepEqual(manquants, [],
    "le corps MQL5 émis ne porte plus ce que la simulation suppose :\n  "
    + manquants.join("\n  ")
    + "\n\nLa simulation continuerait d'égaler le moteur, et le robot livré ferait autre "
    + "chose. Aucun rejeu ne le verrait : les erreurs de port sont sous le bruit du "
    + "testeur. C'est ici ou nulle part.");
  // et la clôture comparée vient bien de la bougie H1, pas du seau du filtre
  assert.match(src, /datetime tDec = \(datetime\)\(SeauCourant\(3600\) \* 3600\);/,
    "l'instant décidant n'est plus tiré de la bougie H1 : la simulation compare "
    + "`df.c[i - 1]`, donc le MQL5 doit lire la clôture H1 et son seau, pas ceux du "
    + "filtre. C'est la différence de forme qui distingue ce filtre de tous les autres.");
  assert.match(src, /if\(g_n > 0\) g_n--;/,
    "`Agreger` ne retire plus le seau en formation : la simulation le retire, donc les "
    + "deux ne comptent plus les mêmes seaux.");
});

test("retirer ou garder le seau en formation rend le MÊME masque — mesuré, pas raconté", () => {
  // ————— UNE MUTATION INERTE DIT « NON MESURÉ », PAS « ROBUSTE » —————
  // MR3 — compter le seau en formation parmi les gardés — reste verte. L'explication
  // tient : les deux formulations retombent sur « les n seaux qui précèdent celui de la
  // bougie décidante ». Mais une explication vit en prose, et la prose ne mesure rien.
  // L'équivalence est assertable ; la voici assertée, sur la même population.
  const par = parametresEmis({ fResist: true, utResist: "D1", resistLookback: 20,
    resistMarge: 1, btSens: "achat" });
  const dits = [];
  let decide = 0;
  for (const [id] of G.EXEMPLES) {
    const df = G.engendrerExemple(id, Date.UTC(2022, 8, 12), macro);
    const a = masqueRobot(df, par, 0, false);   // le seau en formation RETIRÉ
    const b = masqueRobot(df, par, 0, true);    // le seau en formation GARDÉ
    let d = 0;
    for (let i = 0; i < df.n; i++) { if (a[i] !== b[i]) d++; if (a[i]) decide++; }
    if (d) dits.push(id + " → " + d + " bougie(s)");
  }
  assert.ok(decide > 1000,
    "le masque ne laisse passer que " + decide + " bougies : l'équivalence serait celle "
    + "de deux masques vides.");
  assert.deepEqual(dits, [],
    "compter ou non le seau en formation change le masque :\n  " + dits.join("\n  ")
    + "\n\nL'équivalence affirmée en tête du fichier est fausse, et l'alignement de seau "
    + "n'est PAS robuste — c'est alors le seul endroit où le port peut dériver en "
    + "silence, et il faut le mesurer autrement.");
});

// ————— LA SECONDE ÉCHELLE D'ERREUR, ET CE QUI LA TRANCHERAIT —————
//
// Les gardes ci-dessus ferment les erreurs FINES : un paramètre mal écrit, une borne
// déplacée, une recherche désancrée, un seau compté de travers. Elles ne ferment pas ce
// que MetaTrader fait du texte — rien ici n'exécute MQL5, et c'est déclaré en tête.
//
// Une transcription rate rarement de 1,2 % ; elle rate de 40 %. Ce qui trancherait cette
// échelle-là est un rejeu unique, et il n'a pas besoin d'être fin :
//
//   instrument      une ligne d'ACHAT portant « Sous résistance »
//   configuration   croisement/rebond · médiane 7 · SL 0,7 · RR 1,5 · D1 · aucune sécurisation
//   filtre          utResist D1 · lookback 20 · marge 1 %
//   ce qu'on lit    le NOMBRE DE TRADES du rapport, rien d'autre
//
// LA PRÉDICTION EST UNE SÉPARATION, PAS UN NOMBRE — et ce n'est pas un détail de
// formulation. `950` et `1 328` sont les TOTAUX des dix familles ; un rejeu porte sur UN
// instrument. Annoncer 950 comme attente ferait échouer la vérification à coup sûr, et
// l'échec serait celui de l'attente, pas du port.
//
// Ce qui se prédit est donc : le compte du robot doit être PLUS PRÈS du compte Vuna avec
// filtre que du compte SANS filtre, les deux lus sur le même instrument en décochant la
// case. Un port grossièrement faux — comparaison inversée, seau décalé de dix, plafond
// sur la mauvaise série — ressort du côté « sans filtre », ou ailleurs.
//
// ET LA SÉPARATION SE VÉRIFIE AVANT DE LANCER, sinon l'arbitre ne peut pas trancher.
// Les dix séparations ne sont PAS recopiées ici : elles vivent dans le tableau de
// `REJEU-SOUS-RESISTANCE.md`, et le test du bas les y confronte à une remesure. Deux
// copies d'un même compte divergent, et c'est le compte qu'un utilisateur relit qui doit
// faire foi.
//
// LE SEUIL D'EXPLOITABILITÉ SE CALCULE, IL NE SE CHOISIT PAS — et il vaut 19,8 %, pas
// « un peu au-dessus du bruit ». Le bruit du testeur vaut 7,5 % et 11,0 % sur les deux
// instruments rejoués, donc un compte est « proche de N-avec » dans [0,89 ; 1,11] × A et
// « proche de N-sans » dans [0,89 ; 1,11] × S. Pour que les deux lectures ne puissent pas
// être vraies ENSEMBLE : 1,11·A < 0,89·S, soit A/S < 0,802, soit séparation > 19,8 %.
// Arrondi à 20 % du côté sûr.
//
// DEUX FAMILLES SUR DIX TOMBENT, ET PAS POUR LA MÊME RAISON — c'est ce qui rend le calcul
// préférable au coup d'œil. vx-btc (10,7 %) est sous le BRUIT : les deux comptes sont
// indiscernables. vx-tech (18,1 %) est au-dessus du bruit et quand même inutilisable, ses
// deux bandes se recouvrant encore sur [0,890 ; 0,909] × S. Un seuil posé « au-dessus de
// 11 % » l'aurait accepté, et le rejeu aurait rendu un nombre qu'on ne saurait pas lire.
//
// > **Une bande de tolérance autour de DEUX références doit être disjointe des deux,
// > sinon le verdict a une zone où les deux lectures sont vraies.** Ce n'est pas une
// > marge à choisir large : c'est une inégalité, et elle a une solution.
//
// C'est la règle déjà écrite pour ce chantier — le seuil de résolution d'un arbitre se
// mesure avant de lui confier une preuve — poussée d'un cran : on ne le compare pas au
// bruit, on le compare à ce que le bruit rend AMBIGU.
//
// Le mode d'emploi pour le faire tourner vit dans `REJEU-SOUS-RESISTANCE.md`, à la
// racine : il est écrit pour quelqu'un qui n'a pas lu ce dépôt.
//
// CE QUE CE REJEU NE TRANCHE PAS, et c'est mesuré : les erreurs à 0,4 %, 1,2 % et 4,2 %
// sont sous le bruit. Il ne remplace donc AUCUNE des gardes ci-dessus — il ferme l'autre
// bout, et les deux échelles ensemble sont la seule couverture honnête.
//
// ————— CE QUE LE REJEU A RENDU (RAPPORTÉ, 22/09/2026) —————
//
// Cette note disait « un jour où le rejeu aura eu lieu, elle dit quoi remplacer ». Il a eu
// lieu. GOLD chez FxPro, H1, 1 minute OHLC, 2020.01.01 → 2026.09.08, 40 164 barres,
// qualité 99 %, 46 s. Robot `Vuna_C1_GOLD_Achat_mediane_7_SL0p7_RR1p5_260922_1719`,
// en-tête relu AVANT le lancement : « Filtres générés : sous résistance D1 20 (marge 1 %)
// · Types émis : sous_resistance · Mesuré : 237 trades ».
//
//   N-avec (Vuna)   237      bande de réussite  [211 ; 263]
//   N-sans (Vuna)   315      bande de panne     [280 ; 350]
//   N-robot         235      ← dans la première, hors de la seconde
//   séparation      24,8 %   au-dessus du seuil calculé de 19,8 %
//
// L'écart vaut 0,84 % (2 trades sur 237). Compté plutôt que juré : c'est NEUF À TREIZE
// fois sous le bruit de l'arbitre (7,5 % et 11,0 %), et non vingt — le premier rapport
// portait « vingt fois », une apposition chiffrée de plus, dans le sens qui amplifie.
//
// CE QUE ÇA FERME : la présence. Le mécanisme du filtre agit dans le robot réel et son
// effet coïncide avec la mesure. La sortie nº 2 du chantier — « le port n'a jamais été
// confronté à une exécution » — n'existe plus.
//
// CE QUE ÇA NE FERME PAS, et c'est la mesure ci-dessus qui le dit : la justesse des
// paramètres. 0,84 % est À L'INTÉRIEUR de la bande que les mutations rendent (0,4 % à
// 4,2 %), donc ce rejeu ne distingue pas un port juste d'un port décalé d'un seau. Cette
// moitié reste tenue par les gardes de ce fichier, et par elles seules.

// ————— LE TABLEAU DU MODE D'EMPLOI SE RECALCULE, IL NE SE RECOPIE PAS —————
//
// STATUT · INSTRUMENTATION, AUCUNE CAUSE PRÉTENDUE. Rien n'est réparé : les dix
// séparations que lit l'utilisateur deviennent une valeur confrontée à une mesure.
//
// `REJEU-SOUS-RESISTANCE.md` porte les seuls chiffres de ce chantier qu'une PERSONNE
// relira avant d'agir — et il les portait sans commande. *Un compte posé sans sa commande
// est un compte recopié en puissance* : le jour où le générateur d'exemples ou le filtre
// bouge, le tableau reste juste d'apparence et envoie choisir un instrument sur une
// séparation qui n'existe plus.
//
// ELLE ÉCHOUE DANS LES DEUX SENS, la forme de `boucles-mql5` : une famille mesurée qui
// n'a pas de ligne dans le tableau, et une ligne du tableau qui ne correspond à aucune
// famille, tombent chacune de son côté.
//
// ET LA CLASSIFICATION EST DÉRIVÉE, PAS LUE : le seuil sort de la bande de tolérance
// (± 11 %) par l'inégalité de non-recouvrement, et le test exige que le document porte
// les deux bornes. Écrit à la main des deux côtés, il aurait suffi qu'un seul bouge.
//
// ANGLE MORT, EN TÊTE : elle tient les NOMBRES et leur classement, pas la prose autour.
// Que le document dise juste ce qu'il faut FAIRE de ces nombres n'est vérifiable par
// personne ici — c'est l'utilisateur qui l'a relu, et il l'a dit.
const DOC = readFileSync(new URL("../../REJEU-SOUS-RESISTANCE.md", import.meta.url), "utf8");

/** La bande dans laquelle un compte est « proche de » sa référence : le bruit mesuré du
 *  testeur sur les deux instruments rejoués, 7,5 % et 11,0 %. On prend le pire. */
const BANDE = 0.11;
/** Deux bandes autour de deux références sont disjointes quand la haute de la première
 *  passe sous la basse de la seconde : (1+b)·A < (1−b)·S. */
const SEUIL = (1 - (1 - BANDE) / (1 + BANDE)) * 100;

function mesurerSeparations() {
  const F = [{ type: "sous_resistance", ut: "D1", lookback: 20, marge_pct: 1 }];
  const base = { entree: "croisement_ou_rebond", ligne: "mediane", periode: 7,
    sl: 0.7, rr: 1.5, paliers: [] };
  const out = new Map();
  for (const [id] of G.EXEMPLES) {
    const df = G.engendrerExemple(id, Date.UTC(2022, 8, 12), macro);
    const avec = M.backtesterSuivi(df, construireConfig({ ...base, filtres: F }), "D1").length;
    const sans = M.backtesterSuivi(df, construireConfig({ ...base, filtres: [] }), "D1").length;
    out.set(id, { avec, sans, sep: sans ? (sans - avec) / sans * 100 : 0 });
  }
  return out;
}

/** Les rangées du tableau du document, lues par leur FORME — quatre cellules dont trois
 *  chiffrées. Le gras et le barré sont du balisage : ils sont retirés, jamais cherchés. */
function rangeesDuDoc() {
  const out = new Map();
  for (const ligne of DOC.split("\n")) {
    if (!ligne.startsWith("|")) continue;
    const c = ligne.split("|").slice(1, -1)
      .map((x) => x.replace(/[*~]/g, "").trim());
    if (c.length !== 4) continue;
    const id = c[0].toLowerCase();
    const nb = (x) => Number(x.replace(/[^0-9]/g, ""));
    const sep = (c[3].match(/([0-9]+),([0-9])/) || [])
      .slice(1).join(".");
    if (!/^vx-/.test(id) || !sep) continue;
    out.set(id, { avec: nb(c[1]), sans: nb(c[2]), sep: Number(sep),
      inutilisable: /inutilisable/i.test(c[3]) });
  }
  return out;
}

test("le tableau du mode d'emploi porte les séparations que le dépôt recalcule", () => {
  const mes = mesurerSeparations();
  const doc = rangeesDuDoc();

  // ————— LA PRISE, AVANT LE VERDICT —————
  assert.ok(mes.size >= 10, "seulement " + mes.size + " famille(s) mesurée(s) : la "
    + "confrontation porterait sur une population choisie.");
  // La prise du LECTEUR est basse exprès : elle prouve que le tableau se lit encore, et
  // rien d'autre. Exiger dix rangées ici ferait mordre CETTE assertion quand une rangée
  // manque, avec un message qui parle de FORME — alors que le défaut est une population.
  // C'est la mutation voisine évitée à l'écriture plutôt que constatée après.
  assert.ok(doc.size >= 5, "seulement " + doc.size + " rangée(s) lue(s) dans "
    + "REJEU-SOUS-RESISTANCE.md : le tableau a changé de forme et la garde ne le lit "
    + "plus. Zéro rangée lue rendrait « aucun désaccord » — un zéro qui n'a rien regardé.");

  // ————— DANS LES DEUX SENS —————
  const sansRangee = [...mes.keys()].filter((k) => !doc.has(k));
  const sansMesure = [...doc.keys()].filter((k) => !mes.has(k));
  assert.deepEqual([sansRangee, sansMesure], [[], []],
    "le tableau et la mesure ne portent pas la même population.\n  familles mesurées "
    + "absentes du document : " + (sansRangee.join(", ") || "aucune")
    + "\n  rangées du document sans mesure : " + (sansMesure.join(", ") || "aucune")
    + "\n\nUne famille ajoutée au générateur sans rangée laisse le document incomplet ; "
    + "une rangée sans mesure décrit un état qui n'existe plus. Le registre échoue des "
    + "deux côtés pour qu'il ne devienne pas une liste de tolérances.");

  const ecarts = [];
  for (const [id, m] of mes) {
    const d = doc.get(id);
    if (d.avec !== m.avec || d.sans !== m.sans) {
      ecarts.push(id + " : le document dit " + d.avec + " / " + d.sans
        + ", la mesure rend " + m.avec + " / " + m.sans);
    } else if (Math.abs(d.sep - m.sep) > 0.05) {
      ecarts.push(id + " : séparation " + d.sep.toFixed(1) + " % au document, "
        + m.sep.toFixed(1) + " % mesurée");
    }
  }
  assert.deepEqual(ecarts, [], "le tableau du mode d'emploi a dérivé de la mesure :\n  "
    + ecarts.join("\n  ")
    + "\n\nC'est le seul chiffre de ce chantier qu'une PERSONNE relit avant d'agir, et "
    + "il servait à choisir l'instrument du rejeu. Un tableau périmé envoie choisir sur "
    + "une séparation qui n'existe plus — et rien, dans un document, ne rougit.");
});

test("le classement « inutilisable » se DÉRIVE de la bande, il ne se décrète pas", () => {
  const mes = mesurerSeparations();
  const doc = rangeesDuDoc();
  // les deux bornes de la bande doivent être écrites dans le document : sans elles, le
  // seuil dérivé ici et le seuil raconté là-bas pourraient diverger sans se contredire
  assert.ok(DOC.includes("0,89") && DOC.includes("1,11"),
    "le document ne porte plus les deux bornes de la bande de tolérance (0,89 et 1,11). "
    + "Le seuil se dérive d'elles : s'il est écrit d'un côté et la bande de l'autre, "
    + "l'un peut bouger sans que l'autre le sache.");
  const faux = [];
  for (const [id, m] of mes) {
    const d = doc.get(id);
    if (!d) continue;
    const doitTomber = m.sep <= SEUIL;
    if (doitTomber !== d.inutilisable) {
      faux.push(id + " : " + m.sep.toFixed(1) + " % → "
        + (doitTomber ? "sous le seuil de " + SEUIL.toFixed(1) + " %, et le document ne "
          + "le marque pas inutilisable" : "au-dessus du seuil, et le document le "
          + "marque inutilisable"));
    }
  }
  assert.deepEqual(faux, [], "le classement du tableau ne suit plus le seuil dérivé :\n  "
    + faux.join("\n  ")
    + "\n\nLe seuil n'est pas « un peu au-dessus du bruit » : c'est la séparation à "
    + "partir de laquelle les deux lectures du verdict cessent de se recouvrir — "
    + "(1+b)·N-avec < (1−b)·N-sans, soit " + SEUIL.toFixed(1) + " % pour une bande de "
    + "± " + (BANDE * 100).toFixed(0) + " %. En dessous, un même résultat satisfait « le "
    + "filtre agit » ET « le filtre ne filtre rien ».");
  // et la garde prouve que le seuil MORD : si les dix familles passaient, le classement
  // serait vrai sans rien décider
  const sous = [...mes.values()].filter((m) => m.sep <= SEUIL).length;
  assert.ok(sous >= 1 && sous < mes.size,
    sous + " famille(s) sur " + mes.size + " sous le seuil : le classement ne sépare "
    + "plus rien, et les deux assertions ci-dessus passeraient sur un tableau uniforme.");
});

// ————— LES QUATRE MUTATIONS DE LA CONFRONTATION, ET CE QUE CHACUNE PROUVE —————
//
// Chacune ne touche QUE le fait visé — une cellule du tableau —, et chacune a été lue
// sur son MESSAGE, pas sur la couleur de la suite.
//
// 1 · `VX-CU 112 → 113` → rouge, « vx-cu : le document dit 113 / 143, la mesure rend
//     112 / 143 ». Le tableau ne peut plus dériver de la mesure en silence.
//
// 2 · marquer `VX-CU` (21,7 %) inutilisable → rouge, « au-dessus du seuil, et le
//     document le marque inutilisable ».
//
// 3 · démarquer `VX-TECH` (18,1 %) → rouge, « sous le seuil de 19.8 %, et le document ne
//     le marque pas inutilisable ». Les deux sens du classement sont couverts.
//
// 4 · retirer la rangée `VX-40` → rouge, « familles mesurées absentes du document :
//     vx-40 ».
//
//     ELLE A MORDU LA MAUVAISE ASSERTION AU PREMIER JET, et c'est ce qui a corrigé la
//     PRISE. Celle-ci exigeait dix rangées lues : une rangée retirée la faisait tomber
//     AVANT la confrontation, avec un message qui parle de FORME (« le tableau a changé
//     de forme ») alors que le défaut est une POPULATION. La suite était rouge et la
//     mutation semblait bonne — c'est la mutation voisine, évitée à l'écriture plutôt
//     que constatée après. La prise du lecteur est donc basse (cinq rangées : elle
//     prouve que le tableau se lit), et c'est la confrontation qui fait le travail.
