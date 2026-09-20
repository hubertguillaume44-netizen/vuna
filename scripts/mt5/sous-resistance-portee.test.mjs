// STATUT · PORT MESURÉ DANS LE DÉPÔT — bougie par bougie contre `filtreSousResistance`,
// et chaque décision de la simulation RELUE dans le corps MQL5 émis ; NON CONFRONTÉ À UNE
// EXÉCUTION RÉELLE, et le rejeu qui fermerait l'autre échelle d'erreur est décrit en pied
// de fichier, avec sa prédiction. AUCUN REJEU MT5 — et ce n'est pas un manque, c'est une MESURE qui dit que le rejeu ne
// pouvait pas servir de preuve ici. Voir « ce que l'arbitre peut trancher », en tête.
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
  { ut: "H4", lookback: 10, marge_pct: 0.5 }];

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
// LA PRÉDICTION EST ÉCRITE AVANT LA MESURE, pour être relue telle quelle : sur les dix
// familles d'exemple, cette configuration rend 950 trades avec le filtre et 1 328 sans.
// Un robot qui reproduit le filtre doit donc être PLUS PRÈS de son compte Vuna avec
// filtre que de son compte sans — l'écart entre les deux vaut 28,5 %, quatre fois le
// bruit du testeur. Un port grossièrement faux — comparaison inversée, seau décalé de
// dix, plafond sur la mauvaise série — ressort du côté « sans filtre », ou ailleurs.
//
// CE QUE CE REJEU NE TRANCHE PAS, et c'est mesuré : les erreurs à 0,4 %, 1,2 % et 4,2 %
// sont sous le bruit. Il ne remplace donc AUCUNE des gardes ci-dessus — il ferme l'autre
// bout, et les deux échelles ensemble sont la seule couverture honnête.
//
// TANT QUE CE REJEU N'A PAS EU LIEU, LE STATUT DU PORT EST : fidèle au texte émis,
// mesuré bougie par bougie contre le moteur, et NON CONFRONTÉ À UNE EXÉCUTION RÉELLE.
// C'est écrit ici parce que c'est ce que l'utilisateur doit savoir avant d'installer le
// robot, et parce qu'un jour où le rejeu aura eu lieu, cette note dit quoi remplacer.
