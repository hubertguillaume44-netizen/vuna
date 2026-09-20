#!/usr/bin/env node
/**
 * Publie l'APPLICATION dans la sortie de construction du site, sous `/app`.
 *
 * Le site (`src/`) et l'application (`Vuna.dc.html`) sont deux choses. Le site se
 * construit avec Vite ; l'application est un fichier unique fabriqué par
 * `scripts/app/solo.mjs`. Sans ce pont, `venapp.fr` sert la vitrine et l'application
 * n'est servie par aucune route — un client qui paie ne peut pas l'ouvrir.
 *
 * IL RÉGÉNÈRE AVANT DE PUBLIER, et c'est le point important. Copier le
 * `Vuna.solo.html` présent dans le dépôt publierait ce que le dernier
 * `npm run app:solo` a laissé — c'est-à-dire, un jour ou l'autre, une version figée qui
 * diverge silencieusement de `Vuna.dc.html`. La même panne que le préréglage de
 * déploiement, une strate plus haut : une configuration qui décrit un état passé.
 *
 * Il refuse de publier si la version affichée par l'artefact ne correspond pas à celle
 * de la source : mieux vaut une construction qui échoue qu'un site qui sert autre chose
 * que ce que le dépôt contient.
 *
 *   node scripts/app/publier-solo.mjs
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const RACINE = path.resolve(new URL("../../", import.meta.url).pathname);
const SOURCE = path.join(RACINE, "Vuna.dc.html");
const SOLO = path.join(RACINE, "Vuna.solo.html");
const SORTIE = path.join(RACINE, "dist", "app", "index.html");

/** La version que l'application affiche dans son pied — la seule qui se lise à l'écran. */
function versionDe(fichier, quoi) {
  const m = readFileSync(fichier, "utf8").match(/VERSION_APP = '([^']+)'/);
  if (!m) throw new Error(`${quoi} ne porte pas de VERSION_APP — impossible de vérifier ce qui est publié`);
  return m[1];
}

// 1. REFAIRE l'artefact. Il n'est jamais publié tel qu'il traîne dans le dépôt.
execFileSync(process.execPath, [path.join(RACINE, "scripts/app/solo.mjs")], {
  cwd: RACINE, stdio: "inherit",
});

// 2. La version publiée doit être celle de la source.
const vSource = versionDe(SOURCE, "Vuna.dc.html");
const vSolo = versionDe(SOLO, "Vuna.solo.html");
if (vSource !== vSolo) {
  console.error(`[publier-solo] ARRÊT : la source annonce ${vSource}, l'artefact ${vSolo}.`);
  process.exit(1);
}

// 2 bis. AUCUN MARQUEUR DE MUTATION DANS CE QU'ON PUBLIE.
//
//    Un `</*MUT*//span>` a ete livre dans CINQ versions — 260919.5 a 260920.5 — pose par
//    une restauration de mutation qui a rendu `</span>` sous une forme abimee. Le
//    navigateur en fait un commentaire bogue, la balise n'est jamais fermee, et
//    l'element suivant descend d'un niveau dans l'arbre. Rien n'a rougi : ni la suite,
//    ni la construction, ni les trois nombres rapportes a chaque livraison.
//
//    C'EST LA LECON, ET ELLE N'EST PAS SUR LA MUTATION : la taille et l'empreinte
//    prouvent qu'on regarde le MEME fichier, jamais qu'il est JUSTE. Cinq artefacts
//    rapportes avec leurs trois nombres, verifies de part et d'autre, et un `</span>`
//    casse traversant l'ensemble sans qu'un seul de ces nombres bouge — ils ne
//    pouvaient pas bouger, ils ne mesurent pas ca. *Une empreinte est une preuve
//    d'IDENTITE, pas de SANTE.*
//
//    ELLE DECODE, PARCE QU'UN GREP SUR L'ARTEFACT NE VOIT PAS TOUT. Celui-la etait en
//    clair ; un marqueur laisse dans `moteur.js` ou `robot-mt5.js` voyage en base64 et
//    serait invisible a une recherche de texte — la classe « chercher une chaine dans
//    une representation qui ne la contient pas », commise des deux cotes cette semaine.
//    On decode donc toute suite base64 assez longue, sans nommer aucun module : un
//    sixieme module inline entre dans la population sans qu'une ligne change ici.
//
//    LE MOTIF EST `/*MUT` ET NON `MUT`, ET C'EST MESURE (regle 16) : sur l'artefact
//    decode du 20 septembre 2026, `/*MUT` rend 0, `MUT` nu en rend 3 et `MUTATION` 7 —
//    le mot vit dans la prose francaise du produit. Un motif sur `MUT` refuserait donc
//    le cas normal des le premier jour.
//
//    ANGLE MORT, ET IL EST DOUBLE. (1) Aucun test n'exerce ce refus : son echec est
//    BRUYANT — la construction s'arrete —, donc la regle 15 ne s'applique pas, mais sa
//    propre vacuite n'est gardee par rien. (2) Le recit de cette garde ne doit pas
//    EPELER le marqueur : ce fichier serait alors sa propre victime. C'est pourquoi le
//    motif ci-dessous est compose, et non ecrit en clair.
const MARQUEUR = "/" + "*MUT";
{
  const brut = readFileSync(SOLO, "utf8");
  let decode = "";
  for (const run of brut.match(/[A-Za-z0-9+/]{200,}={0,2}/g) || []) {
    try { decode += Buffer.from(run, "base64").toString("utf8") + "\n"; } catch (e) { /* pas du base64 */ }
  }
  // LA PRISE AVANT LE VERDICT : un decodage qui ne rend presque rien ne regarde pas
  // l'interieur des modules, et « aucun marqueur » serait alors un zero qui n'a rien vu.
  // Mesure le 20/09/2026 : 856 892 octets decodes pour 3,3 Mo d'artefact.
  if (decode.length < 100000) {
    console.error(`[publier-solo] ARRET : ${decode.length} octets decodes seulement — la`);
    console.error("               recherche de marqueurs ne voit plus l'interieur des modules.");
    console.error("               Le format d'integration de solo.mjs a change : reancrez la prise.");
    process.exit(1);
  }
  const ou = [];
  if (brut.includes(MARQUEUR)) ou.push("en clair dans l'artefact");
  if (decode.includes(MARQUEUR)) ou.push("dans un module integre en base64");
  if (ou.length) {
    console.error(`[publier-solo] ARRET : un marqueur de mutation survit ${ou.join(" et ")}.`);
    console.error("               Une mutation n'a pas ete defaite. La taille et l'empreinte");
    console.error("               ne le diront pas : elles prouvent l'identite, pas la sante.");
    console.error("               Defaites-la par l'echange inverse, puis relisez le FICHIER.");
    process.exit(1);
  }
}

// 3. Publier. Sans `dist/`, c'est que la construction du site n'a pas eu lieu :
//    publier quand même laisserait un dossier orphelin que rien ne sert.
const distDir = path.join(RACINE, "dist");
if (!existsSync(distDir)) {
  console.error("[publier-solo] ARRÊT : dist/ est absent — lancez la construction du site d'abord.");
  process.exit(1);
}
mkdirSync(path.dirname(SORTIE), { recursive: true });
copyFileSync(SOLO, SORTIE);

// 3 bis. LE MANIFESTE DE VERSION — /app/version.json, { "version": "260913.x" }.
//    La page le lit à son montage et se compare à lui : c'est la seule façon pour elle
//    de dire « une version plus récente est en ligne » — le dépôt dit ce qui est poussé,
//    le manifeste dit ce qui est SERVI, et le verrou de publication vit dans cet écart.
//    Il DÉRIVE de vSource, la version déjà vérifiée contre l'artefact trois lignes plus
//    haut : jamais écrit à la main, donc jamais divergent. netlify.toml le sert en
//    no-store — quelques octets peuvent se permettre ce que 2,4 Mo ne peuvent pas.
writeFileSync(path.join(path.dirname(SORTIE), "version.json"),
  JSON.stringify({ version: vSource }) + "\n");


// 4. LE HABILLAGE. L'application charge sa feuille de style et son paquet depuis
//    `_ds/…/`, qui ne sont PAS dans le dépôt. Sans eux la page se charge, mais la mise
//    en page s'effondre : textes superposés, dialogue par-dessus l'accroche. Ce n'est
//    pas « seulement l'habillage », et une panne visuelle ne doit pas être silencieuse.
//    Déposés dans `public/_ds/…`, Vite les recopie dans `dist/` tout seul.
const ds = (readFileSync(SOLO, "utf8").match(/(?:src|href)="(_ds\/[^"]+)"/g) || [])
  .map((x) => x.replace(/^(?:src|href)="|"$/g, ""));
const absents = [...new Set(ds)].filter((rel) => !existsSync(path.join(RACINE, "dist", rel)));
if (absents.length) {
  console.warn("[publier-solo] ATTENTION : l'application sera servie SANS habillage.");
  for (const a of absents) console.warn("               absent de dist/ : " + a);
  console.warn("               Déposez ces fichiers dans public/ (public/_ds/…) : Vite les publiera.");
}

// 5. LA DATE EST-ELLE CELLE DE CE QU'ON PUBLIE ? `VERSION_APP` part avec chaque rapport
//    d'avis et chaque diagnostic : c'est la seule chose qui dise quelle version
//    l'utilisateur avait sous les yeux. Oubliée, elle ne se contente pas d'être inutile,
//    elle MENT — et un rapport qui ment sur sa version fait chercher un défaut là où il
//    n'est plus.
//
//    C'est un AVERTISSEMENT, pas un arrêt : la date de dernière écriture d'un fichier ne
//    survit pas à un clone, et refuser de construire un dépôt fraîchement cloné serait
//    un piège pire que l'oubli qu'on prévient. Même parti que l'habillage ci-dessus :
//    une panne silencieuse est le seul défaut qu'on ne corrige jamais.
const jour = (d) => String(d.getFullYear() % 100).padStart(2, "0")
  + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
const ecritLe = jour(statSync(SOURCE).mtime);
if (vSource < ecritLe) {
  console.warn(`[publier-solo] ATTENTION : l'application annonce la version ${vSource},`);
  console.warn(`               mais Vuna.dc.html a été écrit le ${ecritLe}.`);
  console.warn("               Les rapports d'avis et les diagnostics porteront une date fausse.");
  console.warn("               Pour dater : npm run app:version && npm run app:solo");
}

const mo = (statSync(SORTIE).size / 1048576).toFixed(2);
console.log(`[publier-solo] dist/app/index.html — ${mo} Mo, version ${vSource}, servi tel quel sous /app (+ version.json).`);
