# Rejouer « Sous résistance » dans MetaTrader 5 — mode d'emploi

*À faire une fois. Compter ≈ 30 minutes, dont 25 d'attente.*

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

Puis cochez **un seul filtre**, « **Sous résistance** », et réglez-le ainsi :

| Champ du filtre | Valeur |
|---|---|
| unité | **D1** |
| bougies | **20** |
| marge % | **1** |

**Décochez tous les autres filtres.** Un second filtre brouillerait la mesure : on ne
saurait plus lequel des deux le robot reproduit mal.

**Notez le nombre de trades affiché.** C'est votre **N-avec**.

Puis **décochez « Sous résistance »**, laissez tout le reste identique, et notez le
nouveau nombre : c'est votre **N-sans**. **Recochez le filtre** ensuite.

> Ces deux nombres sont toute la mesure. Gardez-les à portée de main.

---

## 3 · Exporter le robot

Toujours avec le filtre coché :

1. **Sauvegardez ce résultat** (le bouton du panneau Backtest) — la ligne rejoint *Mes
   décisions*.
2. Page **Mes décisions → Portefeuille**, trouvez la ligne, colonne **ROBOT**, cliquez
   **Exporter**.
3. Un fichier descend, nommé ainsi :

   ```
   Vuna_<compte>_<VOTRE_INSTRUMENT>_Achat_mediane_7_SL0p7_RR1p5_<horodatage>.mq5
   ```

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

**Si cette séparation est inférieure à 15 %, changez d'instrument.** Le testeur MT5 a son
propre bruit — mesuré à **7,5 % et 11,0 %** sur les deux instruments déjà rejoués — et
en dessous de 15 % le test ne peut rien trancher : le résultat serait compatible avec les
deux réponses.

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
| VX-TECH | 113 | 138 | 18,1 % |
| VX-BTC | 158 | 177 | 10,7 % |
| **les dix ensemble** | **950** | **1 328** | **28,5 %** |

La dernière ligne, VX-BTC, est exactement le cas à éviter : 10,7 %, sous le bruit du
testeur. Sur un instrument comme celui-là, le rejeu ne dirait rien.

### Ensuite : le nombre attendu

**Le robot doit rendre un compte proche de N-avec, à ± 11 % près.**

Ces 11 % ne sont pas une marge de confort : c'est le bruit mesuré du testeur lui-même —
le courtier utilisé porte jusqu'à **50 249 prix en désaccord** entre son propre historique
de tiques et ses propres bougies M1, sur le même symbole. L'arbitre n'est pas plus fin
que ça, et prétendre le contraire serait inventer une précision.

---

## 6 · La signature de l'échec — le seul contrôle à faire à l'œil

Écrivez les trois nombres l'un sous l'autre :

```
N-avec  (Vuna, filtre coché)      = ______
N-sans  (Vuna, filtre décoché)    = ______
N-robot (MetaTrader)              = ______
```

| Ce que vous voyez | Ce que ça veut dire |
|---|---|
| **N-robot proche de N-avec** | ✅ le filtre agit dans le robot — c'est ce qu'on voulait savoir |
| **N-robot proche de N-sans** | ❌ **le filtre ne filtre rien** : il est présent dans le code et sans effet. C'est le mode de panne visé |
| **N-robot bien au-dessus de N-sans** | ❌ le filtre agit à l'envers, ou une borne est fausse |
| **N-robot bien en dessous de N-avec** | ❌ le filtre coupe trop — fenêtre ou marge de travers |
| **N-robot = 0** | le robot n'a pas tradé du tout : lisez le journal, ce n'est probablement pas le filtre (symbole refusé, devise non convertible, historique absent) |

> C'est tout ce qu'il y a à regarder. Pas de R, pas de pourcentage de réussite, pas de
> courbe : **un compte de trades**, comparé à deux autres.

---

## 7 · Ce qu'il faut me renvoyer

Court, dans cet ordre :

1. **l'instrument** et **les deux dates** utilisées ;
2. **les trois nombres** ci-dessus ;
3. **la première ligne du journal du testeur** (onglet *Journal*) — elle dit si la
   conversion de devise a réussi, échoué, ou n'était pas nécessaire ;
4. **seulement si N-robot s'écarte** : relancez une fois avec l'entrée `InpConformite`
   cochée, et envoyez les lignes qui commencent par `CONF|`. Elles disent, journée par
   journée, ce que le robot a décidé et pourquoi — c'est ce qui permet de trouver *où*
   les deux lectures divergent, au lieu de le deviner.

**Si le résultat est bon, dites-le simplement.** Un rejeu qui confirme ne demande aucun
fichier : les trois nombres suffisent, et c'est cette ligne-là qui fermera le dossier.
