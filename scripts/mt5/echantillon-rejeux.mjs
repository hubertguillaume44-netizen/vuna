// ————— L'ÉCHANTILLON SE DÉRIVE DES RAPPORTS, IL NE S'ÉCRIT PLUS —————
//
// Le texte livré annonce depuis quel échantillon ses repères viennent. Ce nombre a
// été « neuf » pendant des semaines, et il n'était soutenu nulle part : deux entrées
// du registre de travail portaient le même neuf au-dessus de DEUX listes différentes,
// et l'union de ce qui avait été mesuré en faisait douze. Un compte posé une fois et
// recopié, jamais recompté.
//
// Il se dérive maintenant de ce que `scripts/mt5/` CONTIENT. Ajouter un rapport fait
// monter le chiffre ; en retirer un le fait descendre. Personne n'a plus à le tenir,
// et il ne peut plus diverger de ce qu'il décrit.
//
// ANGLE MORT, EN TÊTE : ce module compte les rapports QUI SONT LÀ. Il ne dit rien des
// rejeux qui ont eu lieu sans que leur rapport entre dans le dépôt — et il y en a eu.
// C'est délibéré et c'est le sens prudent : un échantillon annoncé à un client doit
// être celui qu'on peut montrer, pas celui dont on se souvient.
import { readdirSync } from "node:fs";
import { lireFichierMt5, lireRapportMt5 } from "./parse-mt5.mjs";

const DOSSIER = new URL(".", import.meta.url);

/** Les nombres jusqu'à douze, en toutes lettres — le texte livré les écrit ainsi. */
export const EN_LETTRES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six",
  "sept", "huit", "neuf", "dix", "onze", "douze"];

/**
 * Ce que les rapports déposés dans `scripts/mt5/` permettent d'affirmer.
 * { instruments: [...], courtiers: [...], rapports: n }
 */
export function echantillonRejeux() {
  const instruments = new Set(), courtiers = new Set();
  let rapports = 0;
  for (const f of readdirSync(DOSSIER).filter((x) => x.endsWith(".html")).sort()) {
    const txt = lireFichierMt5(new URL(f, DOSSIER));
    const r = lireRapportMt5(txt);
    rapports++;
    if (r.contexte.attendu) instruments.add(r.contexte.attendu);
    const b = txt.match(/([A-Za-z]+-MT5[^<(\n]*)/);
    if (b) courtiers.add(b[1].trim().replace(/\s+/g, " "));
  }
  return { instruments: [...instruments], courtiers: [...courtiers], rapports };
}
