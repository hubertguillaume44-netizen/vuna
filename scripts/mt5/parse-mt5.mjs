import { readFileSync } from "node:fs";

/**
 * Lecture d'un rapport du testeur de stratégies MetaTrader 5.
 *
 * Accepte, sans configuration :
 *   - le rapport HTML complet (ReportTester-….html, « Rapport » / « Rapport ouvert XML »),
 *   - un copier-coller des onglets « Transactions » / « Ordres » / « Positions »,
 *   - un export CSV/TSV de ces mêmes onglets.
 *
 * Produit une liste de trades aller-retour normalisée :
 *   { entree_t, entree, sortie_t, sortie, motif, volume, commission, swap, profit, net }
 * où les temps sont des millisecondes epoch lues telles quelles (heure du serveur,
 * sans conversion) : le décalage éventuel est mesuré ensuite par le comparateur.
 */

/**
 * Lit un rapport MT5 depuis le disque en devinant son encodage.
 * MetaTrader enregistre ses rapports HTML en **UTF-16 petit-boutiste** : lus en UTF-8,
 * ils ne donnent que des caractères nuls et le rapport paraît vide. Le copier-coller,
 * lui, arrive en UTF-8. On tranche sur la marque d'ordre des octets, et à défaut sur la
 * proportion d'octets nuls aux positions impaires.
 */
export function lireFichierMt5(chemin) {
  const b = readFileSync(chemin);
  if (b.length >= 2 && b[0] === 0xff && b[1] === 0xfe) return b.toString("utf16le", 2);
  if (b.length >= 2 && b[0] === 0xfe && b[1] === 0xff) return b.swap16().toString("utf16le", 2);
  if (b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf) return b.toString("utf8", 3);
  let nuls = 0;
  const n = Math.min(b.length, 4096);
  for (let i = 1; i < n; i += 2) if (b[i] === 0) nuls++;
  const txt = nuls > n / 4 ? b.toString("utf16le") : b.toString("utf8");
  // ————— LE REPLI NE SE TAIT PLUS (règle 15) —————
  //
  // Les deux lignes ci-dessus DEVINENT, sur une proportion d'octets nuls : un rapport
  // sans marque d'ordre, réenregistré par un autre terminal ou par un éditeur, peut
  // tomber du mauvais côté. Le décodage rate alors en SILENCE, et le texte rendu ne
  // porte plus une seule balise — si bien que l'appelant lit « zéro trade » et le
  // prend pour un rapport vide. *Un zéro de décodage raté est indistinguable d'un
  // rapport sans trades*, et c'est le pire mode de panne de ce dépôt.
  //
  // LA PRISE EST LE CARACTÈRE NUL, et elle n'a aucun faux refus : un texte
  // correctement décodé n'en porte jamais — ni le HTML de MT5, ni un copier-coller,
  // ni un CSV. Sa présence PROUVE que la lecture a échoué, elle ne le suppose pas.
  if (txt.includes("\u0000")) {
    throw new Error(
      `« ${chemin} » n'a pas pu être décodé : le texte obtenu porte des caractères `
      + "nuls, signe d'un fichier UTF-16 lu comme de l'UTF-8. Aucune marque d'ordre "
      + "des octets n'a été trouvée et la proportion d'octets nuls n'a pas tranché. "
      + "Réenregistrez le rapport depuis MT5 (clic droit sur l'onglet Backtest → "
      + "Rapport → HTML), qui écrit la marque d'ordre — ou convertissez-le en UTF-8. "
      + "Sans ça, la lecture rendrait ZÉRO trade, indistinguable d'un rapport vide.",
    );
  }
  return txt;
}

const ENTITES = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&#160;": " ",
};

function decoder(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&[a-z]+;|&#\d+;/gi, (e) => ENTITES[e.toLowerCase()] ?? e)
    .replace(/[\u00a0\u202f\u2009]/g, " ");
}

/** Nombre MT5 : « 1 234.56 », « -2 863,00 », « 0.87654 ». Espaces = séparateurs de milliers. */
export function nombre(x) {
  if (typeof x === "number") return x;
  let s = String(x ?? "")
    .replace(/[\u2212\u2012\u2013\u2014\u2011]/g, "-") // signes moins typographiques
    .replace(/[\s\u00a0\u202f]/g, "")
    .replace(/[^0-9,.+-]/g, "");
  if (!s || !/\d/.test(s)) return null;
  const dernierPoint = s.lastIndexOf(".");
  const derniereVirgule = s.lastIndexOf(",");
  if (dernierPoint >= 0 && derniereVirgule >= 0) {
    // Les deux présents : le dernier est le séparateur décimal.
    if (dernierPoint > derniereVirgule) s = s.replace(/,/g, "");
    else s = s.replace(/\./g, "").replace(",", ".");
  } else if (derniereVirgule >= 0) {
    // MT5 sépare les milliers par une espace : une virgule seule est décimale.
    s = s.replace(",", ".");
  }
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
}

/** Horodatage MT5 : « 2024.03.15 09:00:00 », « 15.03.2024 09:00 », « 2024-03-15T09:00 ». */
export function horodatage(x) {
  const s = String(x ?? "").trim();
  const m = /(\d{1,4})[.\-/](\d{1,2})[.\-/](\d{1,4})(?:[ T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(
    s,
  );
  if (!m) return null;
  const a = +m[1],
    b = +m[2],
    c = +m[3];
  const an = String(m[1]).length === 4 ? a : c;
  const jour = String(m[1]).length === 4 ? c : a;
  const ms = Date.UTC(an, b - 1, jour, +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
  return Number.isFinite(ms) ? ms : null;
}

/** Découpe le texte collé en lignes de cellules, que ce soit du HTML ou du texte tabulé. */
export function cellules(texte) {
  const brut = String(texte ?? "");
  if (/<t[rd]\b/i.test(brut)) {
    const lignes = [];
    for (const tr of brut.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
      const cs = [];
      for (const td of tr.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi) ?? []) {
        cs.push(
          decoder(td.replace(/<[^>]*>/g, ""))
            .replace(/\s+/g, " ")
            .trim(),
        );
      }
      if (cs.length) lignes.push(cs);
    }
    return lignes;
  }
  const lignes = [];
  for (const ligne of brut.replace(/^\ufeff/, "").split(/\r?\n/)) {
    const l = decoder(ligne).replace(/\s+$/, "");
    if (!l.trim()) continue;
    let cs;
    if (l.includes("\t")) cs = l.split("\t");
    else if (/;/.test(l) && l.split(";").length >= 4) cs = l.split(";");
    else if (/ {2,}/.test(l)) cs = l.split(/ {2,}/);
    else cs = [l];
    lignes.push(cs.map((c) => c.trim()));
  }
  return lignes;
}

const CLES = {
  heure: ["time", "heure", "open time", "heure d'ouverture", "date"],
  transaction: ["deal", "transaction", "trade", "op\u00e9ration", "operation"],
  position: ["position"],
  ordre: ["order", "ordre"],
  symbole: ["symbol", "symbole"],
  type: ["type"],
  direction: ["direction", "sens"],
  volume: ["volume", "lots", "size"],
  prix: ["price", "prix", "cours"],
  sl: ["s / l", "s/l", "sl", "stop loss"],
  tp: ["t / p", "t/p", "tp", "take profit"],
  commission: ["commission", "commissions"],
  swap: ["swap", "swaps", "\u00e9change", "echange"],
  profit: ["profit", "b\u00e9n\u00e9fice", "benefice", "resultat", "r\u00e9sultat", "p/l"],
  balance: ["balance", "solde"],
  etat: ["state", "état", "etat"],
  commentaire: ["comment", "commentaire"],
};

function cle(nom) {
  const n = nom.toLowerCase().replace(/\s+/g, " ").trim();
  for (const [k, alias] of Object.entries(CLES)) if (alias.includes(n)) return k;
  return null;
}

/** Reconnaît une ligne d'en-tête et renvoie la carte colonne → index (doublons suffixés _2). */
function enTete(cs) {
  const carte = {};
  let connus = 0;
  cs.forEach((c, i) => {
    const k = cle(c);
    if (!k) return;
    connus++;
    carte[k in carte ? `${k}_2` : k] = i;
  });
  if (connus < 4) return null;
  if (!("heure" in carte) || !("prix" in carte)) return null;
  return carte;
}

const SECTIONS = {
  transactions: /^(deals?|transactions?|trades)$/i,
  ordres: /^(orders?|ordres?)$/i,
  positions: /^(positions?)$/i,
};

function section(cs) {
  const seul = cs.filter((c) => c !== "");
  if (seul.length !== 1) return null;
  for (const [nom, re] of Object.entries(SECTIONS)) if (re.test(seul[0])) return nom;
  return null;
}

const ENTRANT = /^(in|entr|buy in|achat)/i;
const SORTANT = /^(out|sort|sell out|vente)/i;

function motifDe(commentaire, type) {
  const c = String(commentaire ?? "").toLowerCase();
  if (/\bt\s*\/?\s*p\b|\btp\b|take profit/.test(c)) return "tp";
  if (/\bs\s*\/?\s*l\b|\bsl\b|stop loss/.test(c)) return "sl";
  if (/\bso\b|stop out/.test(c)) return "so";
  if (/close at stop|clôture à la fin|end of test|fin du test/i.test(c)) return "fin";
  if (
    String(type ?? "")
      .toLowerCase()
      .includes("balance")
  )
    return "balance";
  return c.trim() ? "autre" : "";
}

/**
 * MT5 commente « sl » toute sortie au stop, y compris quand ce stop a été remonté au
 * point mort : le rapport ne distingue pas un stop plein d'un trade rendu à l'équilibre.
 * On les sépare sur le seul indice présent dans le rapport — le profit — étalonné sur la
 * perte médiane des stops de CE rapport, sans rien supposer de l'instrument.
 * Le motif d'origine reste lisible dans `motifBrut`.
 */
export function separerPointsMorts(trades, fraction = 0.25) {
  const pertes = trades.filter((t) => t.motif === "sl" && t.profit < 0).map((t) => -t.profit);
  if (pertes.length < 3) return trades;
  const v = [...pertes].sort((a, b) => a - b);
  const perteMediane = v[Math.floor(v.length / 2)];
  const seuil = perteMediane * fraction;
  for (const t of trades) {
    if (t.motif !== "sl") continue;
    t.motifBrut = "sl";
    if (Math.abs(t.profit) < seuil) t.motif = "be";
  }
  return trades;
}

/**
 * Le symbole sur lequel le test a réellement tourné, et le robot qui l'a exécuté.
 *
 * MT5 lance l'expert sur le SYMBOLE DU GRAPHIQUE, pas sur celui que son nom annonce.
 * Un robot HongKong50 déposé sur un graphique Germany40 tourne sans broncher et rend un
 * rapport d'apparence normale. C'est arrivé : 94 trades au lieu de 67, dix journées
 * communes avec le moteur sur 94, et la conclusion — à tort — qu'une correction récente
 * avait tout cassé. Rien n'était cassé ; le rapport décrivait un autre instrument.
 */
export function contexteRapport(texte) {
  const t = String(texte);
  const expert = (t.match(/Vuna_\S*?_\d{6}_\w+/) || [null])[0];
  let symbole = null;
  const i = t.search(/Symbole\s*:/);
  if (i >= 0) {
    const bout = t.slice(i, i + 300).replace(/<[^>]*>/g, "\n");
    const m = bout.match(/Symbole\s*:\s*\n*\s*([A-Za-z#][\w#.]{1,24})/);
    symbole = m ? m[1] : null;
  }
  const attendu = instrumentDeExpert(expert);
  // TROIS ÉTATS, ET LE TROISIÈME N'EST PAS UN REFUS : sans instrument identifié ou
  // sans symbole lu, on ne sait pas — et on ne peut donc pas accuser. Un refus posé
  // sur une incertitude est exactement le faux refus qui vient de mordre.
  const concorde = !symbole || !attendu ? null : memeInstrument(symbole, attendu);
  return { expert, symbole, attendu, concorde };
}

/**
 * L'instrument, lu dans le nom d'expert — ANCRÉ SUR LE SENS, JAMAIS SUR UN RANG.
 *
 * `nomRobot` compose `Vuna_<sym>_<Achat|Vente>_…` : l'instrument est le segment qui
 * PRÉCÈDE le sens, à quelque profondeur qu'il se trouve. L'ancrage par rang — « le
 * segment 1 » — a accusé quatre rapports valides le jour où l'application a inséré
 * l'étiquette de compte après « Vuna_ » (`etiquetteCompte`), et « le segment 2 »
 * recasserait au prochain segment inséré : ce serait la seconde fois.
 *
 * ET LE CHOIX NE PEUT PAS SE FAIRE EN COMPARANT AU SYMBOLE DU RAPPORT. Élire le
 * segment qui ressemble le plus au symbole serait circulaire : l'élu concorderait
 * toujours, `concorde` ne vaudrait jamais `false`, et le refus cesserait d'attraper
 * l'accident pour lequel il existe — un robot posé sur le graphique d'un autre
 * instrument. La prise doit être INDÉPENDANTE de ce qu'elle sert à vérifier.
 *
 * ANGLE MORT, déclaré : `Achat`/`Vente` est un vocabulaire fermé émis par `nomRobot`,
 * et rien ici ne l'exécute. `scripts/mt5/rapport-lit-son-instrument.test.mjs` fait
 * donc tourner `nomRobot` et relit sa composition — sans quoi ce commentaire
 * décrirait une règle que personne n'applique plus.
 */
export function instrumentDeExpert(expert) {
  const seg = String(expert || "").split("_");
  const i = seg.findIndex((s) => s === "Achat" || s === "Vente");
  return i > 0 ? seg[i - 1] : null;
}

/**
 * Deux noms désignent-ils le même instrument ? La règle du dépôt, celle que le robot
 * applique lui-même (`robot-tient-son-symbole`) : noyau en capitales, tout caractère
 * non alphanumérique retiré, et l'un préfixe ou suffixe de l'autre. C'est ce qui fait
 * qu'un courtier écrivant `#HongKong50` ne produit pas un refus sur `HongKong50`.
 */
export function memeInstrument(a, b) {
  const noyau = (x) => String(x || "").toUpperCase().replace(/[^0-9A-Z]/g, "");
  const na = noyau(a), nb = noyau(b);
  if (!na || !nb) return null;
  return na.startsWith(nb) || na.endsWith(nb) || nb.startsWith(na) || nb.endsWith(na);
}

/**
 * Analyse un rapport MT5 et renvoie
 * { trades, sections: {…nb de lignes lues…}, source: 'positions'|'transactions', avertissements }
 */
export function lireRapportMt5(texte) {
  const lignes = cellules(texte);
  const avertissements = [];
  const ctx = contexteRapport(texte);
  if (ctx.concorde === false) {
    avertissements.push(
      `Le robot « ${ctx.expert} » a tourné sur le symbole ${ctx.symbole}. `
      + "MT5 exécute l'expert sur le symbole DU GRAPHIQUE : ce rapport ne décrit pas "
      + `${ctx.attendu}. Rejouez le test sur un graphique ${ctx.attendu}.`,
    );
  }
  const tables = { transactions: [], ordres: [], positions: [] };
  let courante = null;
  let carte = null;

  for (const cs of lignes) {
    const s = section(cs);
    if (s) {
      courante = s;
      carte = null;
      continue;
    }
    const h = enTete(cs);
    if (h) {
      carte = h;
      if (!courante) {
        // En-tête sans titre de section : on devine d'après les colonnes.
        courante =
          "direction" in h || "transaction" in h
            ? "transactions"
            : "etat" in h
              ? "ordres"
              : "position" in h || "prix_2" in h
                ? "positions"
                : "transactions";
      }
      continue;
    }
    if (!carte || !courante) continue;
    const val = (k) => (carte[k] === undefined ? undefined : cs[carte[k]]);
    if (horodatage(val("heure")) === null) continue;
    tables[courante].push({ cs, val });
  }

  const compte = Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length]));

  // 1) Les « Positions » donnent directement l'aller-retour : c'est la source la plus sûre.
  if (tables.positions.length) {
    const trades = [];
    for (const { val } of tables.positions) {
      const type = String(val("type") ?? "").toLowerCase();
      if (type.includes("balance")) continue;
      const entree_t = horodatage(val("heure"));
      const sortie_t = horodatage(val("heure_2")) ?? entree_t;
      const entree = nombre(val("prix"));
      const sortie = nombre(val("prix_2"));
      if (entree === null || sortie === null) continue;
      const commission = nombre(val("commission")) ?? 0;
      const swap = nombre(val("swap")) ?? 0;
      const profit = nombre(val("profit")) ?? 0;
      trades.push({
        entree_t,
        entree,
        sortie_t,
        sortie,
        sens: type.includes("sell") ? "sell" : "buy",
        volume: nombre(val("volume")) ?? 0,
        sl_mt5: nombre(val("sl")),
        tp_mt5: nombre(val("tp")),
        motif: motifDe(val("commentaire"), type),
        commission,
        swap,
        profit,
        net: profit + commission + swap,
      });
    }
    if (trades.length) {
      return {
        trades: separerPointsMorts(trades.sort((a, b) => a.entree_t - b.entree_t)),
        source: "positions",
        compte,
        contexte: ctx,
        avertissements,
      };
    }
  }

  // 2) Sinon on apparie les transactions « in » → « out ».
  if (!tables.transactions.length) {
    avertissements.push(
      "Aucune table exploitable trouvée dans le rapport MT5 (ni Positions, ni Transactions/Deals).",
    );
    return { trades: [], source: "aucune", compte, contexte: ctx, avertissements };
  }

  const deals = tables.transactions
    .map(({ val }) => ({
      t: horodatage(val("heure")),
      type: String(val("type") ?? "").toLowerCase(),
      direction: String(val("direction") ?? "").toLowerCase(),
      volume: nombre(val("volume")) ?? 0,
      prix: nombre(val("prix")),
      commission: nombre(val("commission")) ?? 0,
      swap: nombre(val("swap")) ?? 0,
      profit: nombre(val("profit")) ?? 0,
      commentaire: val("commentaire") ?? "",
    }))
    .filter((d) => d.t !== null && !d.type.includes("balance"))
    .sort((a, b) => a.t - b.t);

  const trades = [];
  let ouverte = null;
  for (const d of deals) {
    const entrant = ENTRANT.test(d.direction) || (!d.direction && !ouverte);
    const sortant = SORTANT.test(d.direction) || (!d.direction && !!ouverte);
    if (entrant && !sortant) {
      if (ouverte) {
        avertissements.push(
          `Transaction entrante à ${new Date(d.t).toISOString()} alors qu'une position est ouverte : position précédente abandonnée.`,
        );
      }
      ouverte = {
        entree_t: d.t,
        entree: d.prix,
        sens: d.type.includes("sell") ? "sell" : "buy",
        volume: d.volume,
        reste: d.volume,
        commission: d.commission,
        swap: d.swap,
        profit: 0,
        sortie_num: 0,
        sortie_den: 0,
        sortie_t: d.t,
        motif: "",
      };
      continue;
    }
    if (!sortant || !ouverte) continue;
    ouverte.commission += d.commission;
    ouverte.swap += d.swap;
    ouverte.profit += d.profit;
    ouverte.sortie_num += (d.prix ?? 0) * (d.volume || 1);
    ouverte.sortie_den += d.volume || 1;
    ouverte.sortie_t = d.t;
    ouverte.motif = motifDe(d.commentaire, d.type) || ouverte.motif;
    ouverte.reste -= d.volume;
    if (ouverte.reste > 1e-8) continue;
    trades.push({
      entree_t: ouverte.entree_t,
      entree: ouverte.entree,
      sortie_t: ouverte.sortie_t,
      sortie: ouverte.sortie_num / (ouverte.sortie_den || 1),
      sens: ouverte.sens,
      volume: ouverte.volume,
      sl_mt5: null,
      tp_mt5: null,
      motif: ouverte.motif,
      commission: ouverte.commission,
      swap: ouverte.swap,
      profit: ouverte.profit,
      net: ouverte.profit + ouverte.commission + ouverte.swap,
    });
    ouverte = null;
  }
  if (ouverte)
    avertissements.push("Une position MT5 reste ouverte en fin de rapport : elle est ignorée.");
  return {
    trades: separerPointsMorts(trades.sort((a, b) => a.entree_t - b.entree_t)),
    contexte: ctx,
    source: "transactions",
    compte,
    avertissements,
  };
}
