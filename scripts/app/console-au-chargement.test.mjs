// STATUT · INSTRUMENTATION, AUCUNE CAUSE PRÉTENDUE. Rien n'est réparé ici : les
// quatre-vingt-quinze messages du chargement sont mesurés, classés, et la ligne de base
// devient surveillée. Le classement fondateur est MESURÉ DANS LE DÉPÔT (capture Chromium
// sur le fichier livré) ; le compte de 47 erreurs et 48 avertissements qui l'a déclenché
// est RAPPORTÉ par l'utilisateur, et les deux tombent à l'unité.
//
// ————— POURQUOI UNE GARDE PLUTÔT QU'UN SILENCE —————
//
// Le problème n'était pas le bruit. Les quatre-vingt-quinze messages ne coûtent rien à
// personne — la console est un canal de développeur. Ce qu'ils coûtent, c'est la
// capacité de voir le QUATRE-VINGT-SEIZIÈME, et ça ne se répare pas en supprimant les
// quatre-vingt-quinze : ça se répare en donnant le canal à une garde plutôt qu'à un œil.
//
// > **Un fond permanent de messages est un canal de diagnostic hors service.** Le jour
// > où une vraie erreur sortira, elle sera la suivante d'une liste que personne ne lit.
// > Une ligne de base SURVEILLÉE rend le canal à son usage sans rien faire taire.
//
// ————— LA PRISE EST À DEUX CÔTÉS, ET C'EST LA SECONDE MOITIÉ QUI PORTE —————
//
// · tout message capturé tombe dans une classe DÉCLARÉE — un seul non classé fait
//   rougir, EN CITANT le message ;
// · et chaque classe déclarée compte au moins une occurrence — sinon une classe morte
//   laisserait la garde verte sur du vide, et le jour où le gabarit cesserait de
//   produire la classe A, on ne l'apprendrait pas.
//
// C'est la forme de `boucles-mql5` et du registre de `nom-vuna` : un registre qui échoue
// DANS LES DEUX SENS, faute de quoi il devient une liste de tolérances. La seconde
// moitié est aussi la seule PRISE possible : sans elle, une page qui n'émettrait plus
// rien du tout satisferait la première.
//
// ————— CE QUI N'A PAS DE CLASSE, ET NE PEUT PAS EN AVOIR —————
//
// `pageerror` reste à ZÉRO, sans classe possible. Une exception dans un producteur
// efface la page ENTIÈRE — `renderVals()` est une seule fonction — et c'est la panne la
// plus large que ce dépôt ait connue. Il n'y a pas de forme acceptable pour ça.
//
// ————— LES COMPTES NE SONT PAS ASSERTÉS, ET C'EST LA RÈGLE 16 —————
//
// 47 / 46 / 2 / 3 sont IMPRIMÉS, jamais exigés. Les figer ferait rougir la garde au
// premier trou ajouté à un attribut SVG — un faux refus sur le cas normal, donc une
// garde qu'on désactive. Ce qui est tenu est la FORME ; ce qui est rendu est le compte.
//
// ————— ANGLE MORT, EN TÊTE —————
//
// Elle charge le fichier en `file://`, comme les trois autres bancs de rendu. La classe
// D n'existe QUE là — sous `/app` le manifeste de version se charge et les trois
// messages disparaissent. Un message qui n'apparaîtrait QUE sous HTTP échappe donc à
// cette garde. Le choix est déclaré plutôt que tu : servir l'artefact en HTTP
// demanderait un serveur au banc, et la classe D porte SA CONDITION dans sa définition.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

const SOLO = new URL("../../Vuna.solo.html", import.meta.url).pathname;
const CHROMIUMS = [process.env.VUNA_CHROMIUM,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].filter(Boolean);

// ————— LES CLASSES DÉCLARÉES —————
// Chacune est une FORME de message, pas un compte. `ctx` porte ce que la capture entière
// sait, pour les classes qui ont une condition (voir D).
// ————— UNE SOURCE POUR LA VALEUR, TROIS CLASSES QUI LA LISENT —————
//
// Les trois classes de trou portaient chacune leur `includes("{{")`. Trois copies
// adjacentes d'un même prédicat sont la classe de `REFUS_ROBOT` prise à son premier
// jour : la quatrième copie n'existe pas encore, elle naîtra avec la classe E — et rien
// n'aurait rappelé que le prédicat doit porter la VALEUR et non la seule forme.
//
// Nommée, l'omission se voit : une classe de trou qui n'appelle pas `surUnTrou` se lit
// comme une classe qui tolère par la forme, c'est-à-dire comme un fond de bruit
// CERTIFIÉ. Et la mutation de valeur (troisième, en pied) les couvre toutes les trois
// d'un coup au lieu d'une.
const surUnTrou = (m) => m.texte.includes("{{");

const CLASSES = [
  // ————— LA VALEUR FAIT PARTIE DE LA CLASSE, ET C'EST CE QUI L'EMPÊCHE D'AVALER —————
  // Les trois classes de trou passent par `surUnTrou`, et ce n'est pas un ornement du
  // motif : une classe écrite sur la FORME seule — « Expected length » — absorberait un
  // VRAI défaut rendant `y1="NaN"`, qui se compterait au vert et se noierait dans les 47.
  // La garde aurait alors remplacé un fond de bruit par un fond de bruit CERTIFIÉ, ce qui
  // est pire : on croirait le canal surveillé. Mesuré, troisième mutation en pied de
  // fichier — le compte de A reste à 47 et le « NaN » sort ORPHELIN.
  { cle: "A · attribut SVG recevant un trou de gabarit",
    pourquoi: "le navigateur type-vérifie x1/y1/d/points… AVANT que le runtime DC "
      + "substitue le trou. Artefact d'analyse, une fois par chargement.",
    voir: (m) => m.type === "error"
      && /^Error: <\w+> attribute [\w:-]+: /.test(m.texte) && surUnTrou(m) },
  { cle: "B · input type=number recevant un trou",
    pourquoi: "même mécanisme, autre analyseur — la valeur d'un champ numérique.",
    voir: (m) => m.type === "warning"
      && /cannot be parsed, or is out of range/.test(m.texte) && surUnTrou(m) },
  { cle: "C · input type=date recevant un trou",
    pourquoi: "MÊME mécanisme que B et AUTRE chaîne de message — c'est la classe qui "
      + "manquait au premier classement, et par laquelle une quatrième serait entrée "
      + "sans se faire voir. Un tri écrit sur « cannot be parsed » ne la voit pas.",
    voir: (m) => m.type === "warning"
      && /does not conform to the required format/.test(m.texte) && surUnTrou(m) },
  // ————— D PORTE SA CONDITION, ET ELLE EST ÉTROITE EXPRÈS —————
  // Sous `file://`, `fetch('version.json')` est refusé par la politique d'origine. Le
  // navigateur en tire TROIS lignes pour UN fait, dont une — « Failed to load resource »
  // — ne nomme rien. L'accepter sans condition ferait de cette classe un trou qui
  // avalerait n'importe quel échec réseau futur : elle n'est donc admise QUE si un échec
  // nommément sur le manifeste a été vu dans la même capture.
  { cle: "D · manifeste de version refusé sous file:// (trois lignes, un fait)",
    pourquoi: "n'existe pas sous /app, où le manifeste se charge. Voir manifeste-version.",
    voir: (m, ctx) => (/version\.json/.test(m.texte)
      && (m.type === "requestfailed" || /CORS policy|net::ERR_FAILED/.test(m.texte)))
      || (ctx.manifesteRefuse && m.type === "error"
        && /^Failed to load resource: net::ERR_FAILED$/.test(m.texte.trim())) },
];

async function capturer() {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch (e) {
    assert.fail("Cette garde LIT LA CONSOLE d'un vrai navigateur — playwright est "
      + "introuvable. Installez-le, ou posez VUNA_CHROMIUM. Elle ne saute pas en "
      + "silence : une garde de ligne de base qui saute rend le fond invisible, ce "
      + "qu'elle existe précisément pour empêcher.");
  }
  const exe = CHROMIUMS.find((c) => existsSync(c));
  const nav = await chromium.launch(exe ? { executablePath: exe } : {})
    .catch(() => assert.fail("Chromium introuvable : installez les navigateurs "
      + "playwright ou posez VUNA_CHROMIUM. Cette garde ne saute pas."));
  try {
    const p = await (await nav.newContext()).newPage();
    const msgs = [];
    p.on("console", (m) => msgs.push({ type: m.type(), texte: m.text() }));
    p.on("pageerror", (e) => msgs.push({ type: "pageerror", texte: String((e && e.message) || e) }));
    p.on("requestfailed", (r) => msgs.push({ type: "requestfailed",
      texte: r.url() + " — " + ((r.failure() && r.failure().errorText) || "?") }));
    if (process.env.VUNA_CONSOLE_MUT) {
      // mutation : un message d'une QUATRIÈME forme, injecté au chargement
      await p.addInitScript(`console.warn(${JSON.stringify(process.env.VUNA_CONSOLE_MUT)})`);
    }
    if (process.env.VUNA_CONSOLE_MUT_JS) {
      // mutation : du JS arbitraire, pour faire produire au NAVIGATEUR un message de la
      // forme d'une classe déclarée mais avec une valeur fautive RÉELLE. Voir la troisième
      // mutation en pied de fichier.
      await p.addInitScript(process.env.VUNA_CONSOLE_MUT_JS);
    }
    await p.goto("file://" + SOLO);
    await p.waitForFunction(() => document.body && document.body.innerText.length > 400,
      { timeout: 60000 });
    // le montage s'achève APRÈS le premier rendu : les dix familles arrivent ensuite, et
    // c'est là que les courbes SVG — la classe A — sont écrites.
    await p.waitForFunction(() => {
      const t = document.querySelector("table.table tbody");
      return t && t.querySelectorAll("tr").length >= 10;
    }, { timeout: 45000 }).catch(() => {});
    await p.waitForTimeout(3000);
    return msgs;
  } finally { await nav.close(); }
}

test("la console du chargement ne porte QUE des formes déclarées, et chacune est vivante",
  { timeout: 150000 }, async () => {
    const msgs = await capturer();
    const ctx = { manifesteRefuse: msgs.some((m) => /version\.json/.test(m.texte)) };

    // ————— AUCUNE EXCEPTION, ET PAS DE CLASSE POUR EN AVOIR UNE —————
    const jets = msgs.filter((m) => m.type === "pageerror");
    assert.deepEqual(jets.map((m) => m.texte), [],
      "une EXCEPTION est sortie au chargement :\n  " + jets.map((m) => m.texte).join("\n  ")
      + "\n\n`renderVals()` est UNE fonction : une exception dans un producteur efface la "
      + "page entière, y compris ce qui n'a rien à voir. C'est la panne la plus large de "
      + "ce dépôt, et il n'y a aucune forme acceptable pour elle — pas de classe à "
      + "déclarer, pas de tolérance à écrire.");

    const compte = new Map(CLASSES.map((c) => [c.cle, 0]));
    const orphelins = [];
    for (const m of msgs) {
      const c = CLASSES.find((x) => x.voir(m, ctx));
      if (c) compte.set(c.cle, compte.get(c.cle) + 1);
      else orphelins.push("[" + m.type + "] " + m.texte);
    }

    for (const [cle, n] of compte) console.log("  " + String(n).padStart(3) + "  " + cle);
    console.log("  " + String(msgs.length).padStart(3) + "  TOTAL capturé");

    // 1 · tout message tombe dans une classe déclarée
    assert.deepEqual(orphelins, [],
      "un message d'une forme NON DÉCLARÉE est sorti au chargement :\n  "
      + orphelins.join("\n  ")
      + "\n\nC'est exactement ce que cette garde existe pour attraper : un fond de "
      + "quatre-vingt-quinze lignes rend un message inédit indétectable à l'œil. "
      + "Deux issues, et une seule est défendable sans mesure : si ce message décrit un "
      + "VRAI défaut, réparez-le ; s'il décrit un artefact d'analyse comme les autres, "
      + "AJOUTEZ SA CLASSE ici, avec sa raison écrite. Le laisser sans classe est la "
      + "troisième issue, et c'est celle qui rouvre l'angle mort.");

    // 2 · et chaque classe déclarée est VIVANTE — c'est la prise, et la moitié qui porte
    const mortes = [...compte].filter(([, n]) => n === 0).map(([cle]) => cle);
    assert.deepEqual(mortes, [],
      "une classe déclarée ne compte AUCUNE occurrence :\n  " + mortes.join("\n  ")
      + "\n\nUne classe morte laisse cette garde verte sur du vide : elle n'est plus "
      + "qu'une tolérance écrite, et le jour où le gabarit cesse de produire cette forme, "
      + "personne ne l'apprend. Si la forme a disparu pour de bon — parce qu'un correctif "
      + "l'a fermée — RETIREZ la classe, en écrivant pourquoi. Le registre échoue dans "
      + "les deux sens, comme celui de `boucles-mql5`.");
  });

// ————— LES DEUX MUTATIONS, ET CE QUE CHACUNE PROUVE —————
//
// 1 · Un message d'une QUATRIÈME forme, injecté au chargement sans toucher au dépôt :
//     VUNA_CONSOLE_MUT="…" node --test scripts/app/console-au-chargement.test.mjs
//     → rouge, en citant le message. Vérifié. C'est la mutation la plus isolante que ce
//     dépôt ait posée : elle ne touche AUCUN fichier, donc elle ne peut rien emporter à
//     la restauration (règle 13, prise par le bout où le problème n'existe pas).
//
// 2 · Retirer une classe déclarée de `CLASSES` → rouge par la PREMIÈRE moitié (ses
//     messages deviennent orphelins). Et en ajouter une qui ne décrit rien → rouge par
//     la SECONDE. Les deux vérifiées. C'est le registre à deux sens : une forme sans
//     classe et une classe sans forme tombent chacune de leur côté.
//
// 3 · Un VRAI défaut de la forme d'une classe déclarée, mais avec une valeur fautive
//     réelle — un calcul qui rendrait `NaN` :
//       VUNA_CONSOLE_MUT_JS="addEventListener('DOMContentLoaded',()=>{…\
//         l.setAttribute('y1','NaN')})" node --test scripts/app/console-au-chargement.test.mjs
//     → rouge, en citant `Error: <line> attribute y1: Expected length, "NaN".`, et le
//     compte de la classe A reste à 47 — le message n'a PAS été absorbé. Vérifié.
//
//     C'est la mutation qui éprouve la VALEUR et non la forme, et elle était la seule
//     question ouverte sur ce fichier : une classe écrite sur « Expected length » seul
//     serait restée VERTE ici, en comptant 48. Et elle répond du même coup au choix de ne
//     pas figer les comptes (règle 16) : non figés, ils laisseraient un désancrage
//     partiel invisible ; c'est la valeur dans le prédicat, pas le compte, qui tient.
