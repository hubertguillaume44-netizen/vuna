# Rejouer « Sous résistance » dans MetaTrader 5 — mode d'emploi

*Compter ≈ 30 minutes, dont 25 d'attente.*

---

## ✅ CE REJEU A EU LIEU — 22 septembre 2026

**Il n'est plus à faire**, et ce qui suit reste écrit pour qui voudrait le refaire sur un
autre instrument. Le résultat, d'abord, pour qu'on ne le cherche pas à la fin :

| | |
|---|---|
| instrument | **GOLD** chez FxPro, H1, 1 minute OHLC |
| période | 2020.01.01 → 2026.09.08 · 40 164 barres · qualité 99 % · 46 s |
| N-avec (Vuna) | **237** — bande de réussite [211 ; 263] |
| N-sans (Vuna) | **315** — bande de panne [280 ; 350] |
| N-robot | **235** — dans la première, hors de la seconde ✅ |
| séparation | **24,8 %**, au-dessus du seuil calculé de 19,8 % |

Facteur de profit 1,38 contre 1,46 · réussite 50,21 % contre 51,5 % · 235 longues,
0 courte. L'écart vaut **0,84 %** — deux trades sur 237, soit neuf à treize fois sous le
bruit de l'arbitre.

### Ce que ça établit, et la borne

> **Le rejeu ferme la PRÉSENCE ; la garde ferme la JUSTESSE.**

*La présence* : le filtre agit dans le robot réel, et son effet coïncide avec la mesure.
C'est ce que ce mode d'emploi cherchait, et c'est acquis.

*La justesse* — fenêtre, marge, unité — **n'est pas** ce que ce rejeu mesure, et ce n'est
pas une prudence de langage : le dépôt a mesuré qu'un port décalé d'un seau rend 0,4 à
1,2 % d'écart, et une marge fausse 4,2 %. **0,84 % tombe dedans.** Un rejeu ne peut donc
pas distinguer un port juste d'un port décalé, aujourd'hui ni jamais — cette moitié est
tenue par `scripts/mt5/sous-resistance-portee.test.mjs`, qui compare bougie par bougie.

Écrire « port validé » promettrait les deux. Les deux échelles ensemble sont la seule
couverture honnête, et elles se disent séparément.

### Et il a fallu trois lancements — les deux premiers ont servi

| lancement | résultat | ce qu'il a trouvé |
|---|---|---|
| `260920_1153` | 316 pour 237 attendus | l'export émettait « Filtres générés : aucun » sous une mesure filtrée |
| `260922_1655` | 102 pour 112 attendus | un réenregistrement avait ajouté un filtre **en silence** : la mesure passait de 237 à 112, et l'agrégat du portefeuille de 86,4 à 96,3 R |
| `260922_1719` | **235** pour 237 attendus | ✅ |

**Aucun des deux échecs ne portait sur le port.** Les deux portaient sur ce qui FABRIQUE
l'entrée du port, et aucune garde dérivée du texte émis ne pouvait les voir : le texte
émis était cohérent avec l'état qu'il avait reçu.

**Et le second n'aurait pas été trouvé sans l'en-tête du robot.** « Mesuré : N trades »
est la seule ligne qui ait dit que le fichier n'était pas celui de la ligne. Elle reste,
et c'est l'argument pour confronter ce `N` au compte que la ligne porte.

---

## Ce qu'on vérifie, et pourquoi ça vaut le déplacement

Le filtre **« Sous résistance »** (« n'achète pas juste sous le plus haut récent ») existe
depuis longtemps dans Vuna. Il vient d'être **écrit une seconde fois**, en MQL5, pour que
le robot téléchargé le reproduise au lieu de refuser de se construire.

Les deux écritures ont été comparées ligne à ligne dans le dépôt, et elles s'accordent.
**Mais rien, ici, n'exécute du MQL5** — personne n'a encore vu ce que MetaTrader fait de
ce texte. C'est le seul morceau du produit qui part chez un courtier sans avoir jamais
tourné sous l'œil de celui qui l'a écrit.

> Ce rejeu ne cherche pas un écart de deux ou trois trades : il cherche à savoir si le
> filtre **agit** dans le robot. Une transcription ratée ne se trompe pas de 1 %, elle se
> trompe de 30 %.

---

## ⚠ Une correction au brief, avant de commencer

Le brief demandait de choisir **une série d'exemple** (VX-EUR, VX-500, …). **Ce n'est pas
possible, et ce n'est pas un détail de confort** : ces dix séries sont *engendrées* par
Vuna, elles n'existent chez aucun courtier. MetaTrader n'a aucun symbole à leur donner, et
le robot refuserait de démarrer (c'est sa garde de symbole qui parlerait).

**Le rejeu se fait donc sur un de VOS instruments** — un que vous avez à la fois dans
MetaTrader et dans Vuna. Ça ne coûte rien au protocole : les deux nombres à comparer se
lisent sur votre propre écran, et ils sont même **meilleurs** que les miens, parce qu'ils
décrivent vos données.

*(Les dix familles servent quand même, plus bas : elles disent quelle SÉPARATION attendre,
et c'est ce qui permet de choisir une ligne sur laquelle le test peut trancher.)*

---

## 1 · Choisir l'instrument — sur une propriété, pas au hasard

Prenez un instrument qui remplit **les trois** conditions :

1. il est **dans MetaTrader** chez votre courtier (vous pouvez ouvrir son graphique) ;
2. ses **bougies H1 sont chargées dans Vuna** (page *Mes instruments*, il a des bougies) ;
3. il a **beaucoup d'historique** — au moins trois ans. Moins de 80 trades et le test ne
   tranchera rien.

Si plusieurs conviennent, **prenez le plus volatil** : c'est là que le filtre retire le
plus de trades, donc là que le test sépare le mieux. L'étape 5 vous dira si votre choix
sépare assez, *avant* de lancer quoi que ce soit.

---

## 2 · Poser la configuration dans Vuna, réglage par réglage

Page **Mes scans → Backtest**. Choisissez votre instrument, puis :

| Réglage | Valeur | Où |
|---|---|---|
| Sens | **Achat** | en haut du panneau |
| Entrée | **Croisement et Rebond** | liste « Entrée » |
| Ligne | **Médiane** | liste « Ligne » |
| Période | **7** | champ à côté de la ligne |
| Stop | **0,7 %** | champ « Stop » |
| R/R (objectif) | **1,5** | champ « R/R » |
| Sécurisation | **Aucune** | section Sécurisation |
| Unité de décision | **D1** | liste « Unité » du panneau |
| Frais | laissez ce qui est déjà là | — |

Puis, dans la section des filtres, cochez **un seul filtre** : la tuile
« **Plus haut** ». Réglez ses trois champs ainsi :

| Champ du filtre (tel qu'il est écrit) | Valeur |
|---|---|
| « Unité » | **D1** |
| « Fenêtre » | **20** |
| « Marge » | **1** |

> **⚠ NE CONFONDEZ PAS AVEC « Zones », la tuile juste à côté.** Sa description parle
> elle aussi de résistance — « *n'entre que s'il reste de la place sous la zone de
> résistance la plus proche* » — et c'est un **autre filtre** (`fZone`), qui n'est **pas**
> transposé en MQL5. Cochée, elle fait **refuser l'export** à l'étape 3, et le bouton
> **Exporter** reste gris : vous perdriez le rejeu sans savoir pourquoi.
>
> La bonne tuile est celle dont la description dit « *refuse d'acheter trop près du plus
> haut des N dernières bougies* ».

**Si vous lisez « Sous résistance » quelque part, c'est le même filtre.** C'est le nom
qu'en donnent les **messages de refus** de l'application (et ce document, dans son titre).
Le panneau, lui, l'appelle « Plus haut ». Un seul filtre, deux noms.

**Décochez tous les autres filtres.** Un second filtre brouillerait la mesure : on ne
saurait plus lequel des deux le robot reproduit mal.

**Notez le nombre de trades affiché.** C'est votre **N-avec**.

Puis **décochez « Plus haut »**, laissez tout le reste identique, et notez le
nouveau nombre : c'est votre **N-sans**. **Recochez le filtre** ensuite.

> Ces deux nombres sont toute la mesure. Gardez-les à portée de main.

---

## 3 · Exporter le robot

> ## ⚠ LA LIGNE DOIT VENIR D'UN SCAN, PAS DU BACKTEST
>
> **C'est une CONDITION du rejeu, pas un détail de confort, et elle manquait ici.** Une
> ligne sauvegardée depuis le panneau Backtest ne garde pas la photo de ses réglages :
> l'export repart alors d'un état où **tous les filtres sont éteints**, et le robot
> descend **sans filtre** — avec, en en-tête, la mesure filtrée. Mesuré le 20 septembre
> 2026 sur GOLD : `Filtres générés : aucun` sous `Mesuré : 237 trades`, et 316 trades au
> testeur, soit un de plus que le compte SANS filtre.
>
> **Le geste correct** : lancez un **scan** (page *Mes scans*) sur votre instrument avec
> cette configuration, puis validez la ligne que le scan produit. C'est elle qu'on
> exporte.
>
> **Et l'application refuse désormais** : si le robot qu'elle produit n'annonce pas les
> filtres que la ligne nomme, l'export est bloqué et le message dit les deux. Vous ne
> pouvez plus tomber dans ce cas sans le savoir — mais vous ne pouvez pas non plus
> exporter depuis une ligne née dans le Backtest si elle porte un filtre.

Toujours avec le filtre coché :

1. Lancez le **scan** sur votre instrument, puis **validez la ligne** qui porte la
   configuration du § 2 — la ligne rejoint *Mes décisions*.
2. Page **Mes décisions → Portefeuille**, trouvez la ligne, colonne **ROBOT**, cliquez
   **Exporter**.
3. Un fichier descend, nommé ainsi :

   ```
   Vuna_<compte>_<VOTRE_INSTRUMENT>_Achat_mediane_7_SL0p7_RR1p5_<horodatage>.mq5
   ```

4. **Ouvrez le `.mq5` dans MetaEditor et lisez son en-tête avant de lancer quoi que ce
   soit.** Deux lignes, l'une sous l'autre :

   ```
   //|  Filtres générés : sous résistance D1 20 (marge 1 %)
   //|  Mesuré          : 237 trades · … R cumulés · … R/an
   ```

   **`Filtres générés` doit NOMMER le filtre.** S'il dit `aucun`, arrêtez-vous : le robot
   ne reproduira pas la mesure annoncée juste en dessous, et le rejeu ne mesurerait que
   ça. Trente secondes de lecture contre trente minutes de testeur.

   *Si le bouton est grisé*, survolez-le : l'infobulle dit pourquoi. Avec cette
   configuration-ci il ne doit pas l'être.

4. Déposez ce `.mq5` dans `MQL5\Experts\` de votre terminal, puis **compilez-le** dans
   MetaEditor (F7). Zéro erreur attendue.

---

## 4 · Le testeur MT5 — ce qu'on règle, et ce qu'on ne touche pas

Ouvrez **Vue → Testeur de stratégies** (Ctrl+R), onglet **Réglages** :

| Champ | Valeur |
|---|---|
| Expert | le robot que vous venez de compiler |
| Symbole | **votre instrument**, tel que le courtier l'écrit (`#HongKong50`, `GOLD.r`… peu importe le suffixe) |
| Période | **H1** |
| Date : de / à | **les deux dates de la colonne « PÉRIODE À TESTER »** de la ligne, recopiées telles quelles — elles sont déjà au format du testeur (`2023.09.13`) |
| Modélisation | **1 minute OHLC** |
| Dépôt | ce que vous voulez — il n'entre pas dans le compte de trades |
| Optimisation | **désactivée** |

**❌ NE PRENEZ PAS « Chaque tick basé sur des ticks réels ».** Mesuré : sur un instrument
dont la devise de cotation n'est pas celle du compte, ce mode fait télécharger tout
l'historique de tiques de la paire de change — **32 secondes deviennent près de 28 heures**.
Et il n'apporte rien ici : on lit un nombre de trades, pas un centime.

Onglet **Entrées** — **ne touchez à rien**. Le robot arrive réglé par l'export. En
particulier laissez tels quels :

- `InpRisquePct`, `InpMaxPositions`, `InpSlippagePoints` — sans effet sur le nombre de trades ;
- `InpPasDebutSemaine`, `InpHeureEntreeDeb/Fin` — ils font partie de la mesure ;
- les six `InpPalierNSeuil/Niveau` — ils doivent rester à **0** (aucune sécurisation) ;
- `InpSymboleLibre` — **laissez-le décoché**. S'il refuse de démarrer, lisez d'abord le
  journal : il dit quel symbole il attendait.

Lancez. Le compte de trades se lit dans l'onglet **Résultats** (« Transactions » ou
« Total Trades » du rapport).

---

## 5 · Ce qu'on attend — et le contrôle à faire AVANT de lancer

### D'abord : votre ligne sépare-t-elle assez ?

Calculez l'écart entre vos deux nombres :

```
séparation = (N-sans − N-avec) / N-sans × 100
```

**Si cette séparation est inférieure à 20 %, changez d'instrument.**

Ce seuil n'est pas « un peu au-dessus du bruit » : il se calcule. Le testeur MT5 a son
propre bruit — mesuré à **7,5 % et 11,0 %** sur les deux instruments déjà rejoués —, donc
un résultat compte comme « proche de N-avec » dans `[0,89 ; 1,11] × N-avec`, et comme
« proche de N-sans » dans `[0,89 ; 1,11] × N-sans`. Pour que les deux lectures ne puissent
pas être vraies en même temps, il faut que la bande haute de la première passe sous la
bande basse de la seconde :

```
1,11 × N-avec  <  0,89 × N-sans
⟺  N-avec / N-sans  <  0,802
⟺  séparation  >  19,8 %
```

**En dessous, les deux bandes se recouvrent** — à 15 % de séparation, le recouvrement va
de `0,890` à `0,944 × N-sans`, et un résultat qui tombe là est *simultanément* « à ± 11 %
de N-avec » et « proche de N-sans ». Il n'y a pas de ligne pour ce cas dans le tableau
plus bas, et c'est exactement le cas que le seuil existe pour empêcher.

On arrondit à **20 %**, du côté sûr.

*Mesuré sur les dix séries d'exemple, avec exactement cette configuration, pour vous dire
quelle séparation est normale :*

| série | N-avec | N-sans | séparation |
|---|---|---|---|
| VX-YEN | 57 | 103 | 44,7 % |
| VX-OR | 82 | 140 | 41,4 % |
| VX-CONSO | 89 | 139 | 36,0 % |
| VX-EUR | 54 | 81 | 33,3 % |
| VX-500 | 95 | 138 | 31,2 % |
| VX-40 | 93 | 135 | 31,1 % |
| VX-2000 | 97 | 134 | 27,6 % |
| VX-CU | 112 | 143 | 21,7 % |
| ~~VX-TECH~~ | 113 | 138 | **18,1 % — inutilisable** |
| ~~VX-BTC~~ | 158 | 177 | **10,7 % — inutilisable** |
| **les dix ensemble** | **950** | **1 328** | **28,5 %** |

**Deux séries sur dix sont sous le seuil, et elles n'y sont pas pour la même raison.**
VX-BTC (10,7 %) est sous le **bruit** lui-même : les deux comptes sont indiscernables.
VX-TECH (18,1 %) est au-dessus du bruit et quand même inutilisable — ses deux bandes se
recouvrent encore. C'est ce qui rend le seuil calculé préférable à un seuil choisi : à
l'œil, 18,1 % contre un bruit de 11 % a l'air suffisant.

**Huit séries sur dix passent.** Un instrument réel un peu volatil a toutes les chances
d'y être aussi.

### Ensuite : le nombre attendu

**Le robot doit rendre un compte proche de N-avec, à ± 11 % près.**

Ces 11 % ne sont pas une marge de confort : c'est le bruit mesuré du testeur lui-même —
le courtier utilisé porte jusqu'à **50 249 prix en désaccord** entre son propre historique
de tiques et ses propres bougies M1, sur le même symbole. L'arbitre n'est pas plus fin
que ça, et prétendre le contraire serait inventer une précision.

### Et si aucun de vos instruments n'atteint 20 %

**Alors le rejeu ne peut pas conclure, et il ne faut pas le faire.** Ce n'est pas un échec
du port ni un défaut de vos données : c'est l'arbitre qui se récuse — il n'est pas assez
fin pour la question posée. Mieux vaut le savoir maintenant que passer trente minutes puis
lire un nombre qu'on ne saura pas interpréter.

Dites-le moi simplement, et je chercherai l'autre bout : ce qui reste alors est de fermer
l'échelle grossière autrement, pas de faire tourner un test qui ne tranche rien.

---

## 6 · La signature de l'échec — le seul contrôle à faire à l'œil

Écrivez les trois nombres l'un sous l'autre :

```
N-avec  (Vuna, filtre coché)      = ______
N-sans  (Vuna, filtre décoché)    = ______
N-robot (MetaTrader)              = ______
```

Les deux bandes ci-dessous **ne se recouvrent pas**, puisque votre séparation dépasse
20 % — c'est à ça que servait l'étape précédente. Les six cas sont donc exclusifs, et il
y en a un pour chaque résultat possible.

| Où tombe N-robot | Ce que ça veut dire |
|---|---|
| **entre 0,89 et 1,11 × N-avec** | ✅ le filtre agit dans le robot — c'est ce qu'on voulait savoir |
| **entre 0,89 et 1,11 × N-sans** | ❌ **le filtre ne filtre rien** : il est présent dans le code et sans effet. C'est le mode de panne visé |
| **entre les deux bandes** | ⚠️ **indéterminé** — ni l'un ni l'autre. Le filtre agit, mais pas comme la mesure. C'est le cas qui demande le journal `CONF\|` (étape 7) |
| **au-dessus de 1,11 × N-sans** | ❌ le filtre agit à l'envers, ou une borne est fausse |
| **en dessous de 0,89 × N-avec** | ❌ le filtre coupe trop — fenêtre ou marge de travers |
| **0** | le robot n'a pas tradé du tout : lisez le journal, ce n'est probablement pas le filtre (symbole refusé, devise non convertible, historique absent) |

**La troisième ligne est celle qu'il ne faut pas forcer dans une des deux autres.** Un
résultat entre les bandes n'est ni une réussite ni la panne visée : c'est un troisième
état, et l'écrire évite de le lire comme le plus proche des deux.

> C'est tout ce qu'il y a à regarder. Pas de R, pas de pourcentage de réussite, pas de
> courbe : **un compte de trades**, comparé à deux autres.

---

## 7 · Ce qu'il faut me renvoyer

Court, dans cet ordre :

1. **l'instrument** et **les deux dates** utilisées ;
2. **les trois nombres** ci-dessus ;
3. **la première ligne du journal du testeur** (onglet *Journal*) — elle dit si la
   conversion de devise a réussi, échoué, ou n'était pas nécessaire ;
4. **si N-robot n'est pas dans la bande de N-avec** : relancez une fois avec l'entrée `InpConformite`
   cochée, et envoyez les lignes qui commencent par `CONF|`. Elles disent, journée par
   journée, ce que le robot a décidé et pourquoi — c'est ce qui permet de trouver *où*
   les deux lectures divergent, au lieu de le deviner.

**Si le résultat est bon, dites-le simplement.** Un rejeu qui confirme ne demande aucun
fichier : les trois nombres suffisent, et c'est cette ligne-là qui fermera le dossier.
