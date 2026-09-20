# Vuna — conventions du dépôt

> **LE PRODUIT S'APPELAIT VÉNA JUSQU'AU 19 SEPTEMBRE 2026**, et Sivula avant lui. Le
> signe — un V — n'a pas changé ; le mot, deux fois.
>
> **Les récits qui citent « Véna » ne sont PAS réécrits.** Ce fichier est un registre de
> défauts réels, et chacun est daté par le nom que le produit portait ce jour-là. On
> interdit le code, pas le récit du code (règle 3) — et un registre réécrit
> rétroactivement perd sa valeur de témoignage : on ne saurait plus lequel des trois noms
> tournait quand la page blanche a duré des semaines.
>
> **Ce qui est réécrit, ce sont les CONSIGNES** — un chemin, une commande, une
> affirmation sur ce que le code fait aujourd'hui. Une consigne périmée a l'autorité des
> vraies et envoie chercher une panne qui n'existe plus ; c'est la règle 5, et ce fichier
> l'a déjà payée deux fois (« `_ds/` n'est pas dans le dépôt »). La frontière se dit en
> une ligne : **au passé, on laisse ; au présent, on renomme.**

## Le nom, et sa règle d'écriture

**« Vuna » partout où un humain lit**, et **VUNA** en capitales. La marque, la page de
vente, l'en-tête de l'application, les mails, les libellés de paiement, le titre de
fenêtre, les mentions de licence, les infobulles, les commentaires du code.

**`vuna` partout où une machine lit.** Sans majuscule. Noms de fichiers, bases IndexedDB,
noms de robots MQL5, identifiants dans le code, noms de fichiers exportés, chemins de
dossiers. **Les clés de stockage n'en sont plus** — voir « Ce que `vena` garde » plus bas.

> **LA SÉPARATION S'EST RÉDUITE À LA CASSE, et le renommage l'a réduite sans qu'on le
> décide.** « Véna » portait un accent ; « Vuna » n'en porte pas. Il ne reste donc entre
> les deux colonnes qu'une capitale, et la moitié des gardes qui tenaient l'accent n'ont
> plus de sujet — `site-titres` a perdu la sienne (règle 14, première issue), `nom-vuna`
> deux motifs. **Et leur généralisation a été mesurée, puis refusée** : « tout accent dans
> un littéral qui ressemble à un chemin » rend **531 faux refus** sur ce dépôt, parce
> qu'une phrase française contenant un « / » en est un. Ce qui reste s'ancre sur ce qui
> AGIT — trois appels qui écrivent un identifiant.
>
> **Le paragraphe reste quand même, et il change de travail** : il ne dit plus comment
> écrire ce nom-ci, il dit ce qu'on ne pourra pas choisir au suivant. Un accent dans un
> nom de fichier ou une clé casse au premier transfert entre Windows et macOS — les deux
> systèmes ne normalisent pas le « é » de la même façon (NFC contre NFD), et le fichier
> devient introuvable. `nomRobot` efface tout caractère non alphanumérique : « Véna » y
> devenait « V_na », et c'est **mesuré** — `nom-genere.test.mjs` le vérifie encore, sur le
> nom que `nomRobot` produit aujourd'hui.

L'adresse du site est **venapp.fr**, et **elle n'a pas suivi** : un nom de domaine vit
chez un registraire, pas dans le dépôt. Le suffixe est technique : il n'entre ni dans le
logo, ni dans l'en-tête, ni dans les mails.

Ne pas confondre avec les mots français **simulateur**, **simulation**, **simuler** : ce
ne sont pas la marque, ils restent tels quels. **Et « vena » a sa propre famille de
sosies, plus fournie que celle de « simula »** : `provenance`, `venait`, `devenait`,
`revenait`, `convenait` — **169 occurrences** dans les fichiers versionnés, dont 49 pour le
seul mot `provenance`, qui est le vocabulaire de ce fichier-ci (le compte est celui du jour
où il est écrit, et il bougera : c'est l'ordre de grandeur qui décide, pas l'unité). Une garde qui chercherait « vena » sans bornes de mot accuserait tout ce
registre, et serait désactivée le premier jour (règle 16).

## Ce qui ne change JAMAIS de nom

Trois familles sont gelées. Les renommer casserait des données déjà chez l'utilisateur.

| Constante | Où | Pourquoi elle est gelée |
|---|---|---|
| Le **numéro magique** (`magicDe`) | robot MQL5, journal | Il identifie les positions ouvertes chez le courtier. Un robot qui perd son magique perd la trace de ses propres positions. Il ne hache que la configuration et le compte — le nom de l'application n'y entre pas, et ne doit jamais y entrer. |
| **`SIV_trades_`**, **`SIV_NIV_`** (et le repli `SIVTRADE;` du même journal) | protocole MT5 | Étiquettes écrites par les robots **déjà compilés** et RELUES — le fichier par l'application, les objets par le robot. Les basculer remplirait `Common\Files` de deux orthographes du même fichier — le symptôme même qu'on corrige — et couperait la trace des robots en place. |

### Ce n'est pas le NOM qui gèle ces trois-là, c'est un BINAIRE hors du dépôt

Et la distinction décide de tout le reste, parce qu'elle dit **quand** le gel tombe. Les
autres étiquettes MQL5 ont été renommées deux fois sans qu'un test rougisse ; celles-ci
non, et la raison n'est pas qu'elles seraient plus importantes — c'est qu'un `.ex5`
**déjà compilé**, sur le VPS de l'utilisateur, les écrit encore et ne sera jamais
recompilé par un commit d'ici.

> **Une constante gelée par un binaire hors du dépôt ne se dégèle pas en relisant le
> dépôt.** Aucune garde ne peut voir ce qui tourne sur une machine qu'elle ne lit pas ;
> la condition de dégel est un fait du monde, et seul l'utilisateur peut la constater.

**La condition, écrite pour être relue** : le jour où plus aucun `.ex5` compilé avant le
19 septembre 2026 ne tourne — c'est-à-dire le jour où les robots en place ont TOUS été
réexportés et recompilés —, les trois peuvent basculer, une par une, et
`nom-genere.test.mjs` dira laquelle enlever.

### La marque d'ordre et le préfixe de panneau, eux, ont été dégelés — deux fois

Sur une raison MESURÉE, pas déclarée, et la mesure a été REFAITE au second renommage : la
marque n'est jamais relue (les appariements passent tous par `POSITION_MAGIC`/`DEAL_MAGIC`,
aucun `POSITION_COMMENT` dans le robot) et le préfixe de panneau n'est relu que par le
robot qui l'écrit. `SIV_<stamp>` est devenu `VNA_<stamp>` (livraison 260914.2) puis
**`VUNA_<stamp>`** ; `SIV_PAN_` est devenu `VNA_PAN_` puis **`VUNA_PAN_`**.

**Et il y a donc DEUX balayages à `OnInit`, pas un.** Un terminal fermé brutalement laisse
les objets de l'ancien robot sous le panneau neuf ; un robot compilé avant le 14/09 en
laisse sous `SIV_PAN_`, un robot compilé entre le 14 et le 19/09 sous `VNA_PAN_`. N'en
balayer qu'un rouvrait le défaut que le balayage ferme — **chaque renommage en ajoute un,
et c'est le COMPTE qui garde**, pas la présence : `nom-genere.test.mjs` exige les deux, une
fois chacun, dans `OnInit`.

`scripts/mt5/nom-genere.test.mjs` remesure tout cela sur le source émis, et tient
l'exception des gelés.
| Les **signatures de journal** | Journal, reproductibilité | Une signature enregistrée sous l'ancien nom doit rester valide et recalculable. |

## Ce qui accepte les TROIS noms, sans date limite

Le premier renommage avait fait des listes à deux entrées. Le second a montré ce qu'elles
étaient : **une énumération qui grandit d'un cran à chaque renommage, et dont on oublie un
membre**. Elles sont donc nommées et lues d'un seul endroit.

- **L'import d'une sauvegarde** : `OUTILS_LUS = ['vuna', 'vena', 'simula']` en tête de la
  source, lu par les quatre sites qui décident ; `vuna_chiffre`, `vena_chiffre` et
  `sivula_chiffre` ; les extensions `.vuna`, `.vena` et `.sivula`. Quelqu'un réimportera
  dans deux ans un fichier exporté aujourd'hui. **À l'export : le nouveau nom seulement.**
- **LA LISTE NE COUVRE QUE LA LECTURE, et c'est la moitié qui compte.** Les sites qui
  ÉCRIVENT portent le littéral neuf, en clair, et se renomment mécaniquement — ils ne
  cassent rien, puisque personne d'autre ne les relit. Y faire passer la liste aurait
  ajouté une indirection là où il n'y a pas de choix à faire, et trois gardes ancrées sur
  l'en-tête JSON écrit seraient tombées sans qu'un défaut existe.
- **Le relais d'usage** (`netlify/functions/usage.mjs`) : une version ancienne encore
  ouverte dans un onglet continue d'envoyer l'ancien marqueur.
- **Les deux scripts MT5** : ils cherchent `vuna\symboles.txt`, puis balaient
  `ANCIENS_DOSSIERS[] = {"vena", "Sivula"}`, en le disant dans le journal MT5. **Le second
  a reçu ce filet au renommage, et il n'en avait aucun** : `Vuna_Releve.mq5` n'a jamais eu
  de repli, donc le renommage du dossier lui aurait fait perdre une liste **en silence** —
  la classe exacte que `repli-muet` existe pour fermer — et elle ne lit qu'UN des deux
  scripts (règle 8 : la garde porte un nom de LIEU, `Export_H1_Vuna.mq5`, là où
  l'invariant a un nom de classe). Le renommage du dossier a rendu le trou visible ; il
  était ouvert depuis toujours — **et ce n'est pas un petit trou : c'est la panne de
  septembre, celle d'une liste de symboles perdue sans un mot, RAPPORTÉE comme ayant coûté
  un mois d'installation de robots.** Elle dormait dans le second script pendant que la
  garde écrite pour elle lisait le premier. *Un renommage ne cause pas ce genre de défaut ;
  il le met sous la lampe, et c'est le seul bénéfice qu'un renommage puisse avoir.*

## Ce que `vena` garde, et pourquoi — le registre

**LE RENOMMAGE S'ARRÊTE À CES NEUF FAMILLES, et chacune a une raison qui se relit.** Sans
ce tableau, un `vena` survivant se lit comme un oubli, et le prochain renommage le
« corrigera » — c'est-à-dire qu'il cassera ce que la famille protège. `nom-vuna.test.mjs`
en tient le registre et **échoue dans les deux sens** (la forme de `boucles-mql5`) : une
occurrence hors registre le fait tomber, et une famille dont le dernier membre a disparu
aussi, pour que le registre ne devienne pas une liste de tolérances.

**IL Y EN A EU UNE DIXIÈME, ET ELLE EST NÉE ET MORTE LE MÊME JOUR — les deux fois par le
registre.** Les deux liens du dépôt avaient été passés à `vuna` d'avance, sur la foi de
l'inventaire plutôt que du distant ; la première poussée a rendu « *This repository moved…
/vena.git* », et la garde a refusé le retour à `vena` tant que sa raison n'était pas
écrite. *Une garde de registre gagne sa place le jour où elle attrape ce que son auteur
venait d'écrire.*

Quelques heures plus tard, l'utilisateur a renommé le dépôt, les deux liens sont passés à
`vuna` pour de bon, et **le registre a exigé le retrait de la famille** — il échoue dans
les deux sens, donc une entrée sans membre tombe comme une occurrence hors registre. C'est
la démonstration que la seconde moitié n'est pas décorative : *sans elle, la dixième serait
restée écrite, verte, et décrirait un état du monde qui n'existe plus.* Ce qu'elle a laissé
derrière est une leçon sur les commandes, écrite plus haut — « une condition de dégel ne
vaut que la commande qu'elle nomme ».

| La famille | Pourquoi elle reste |
|---|---|
| **le préfixe des clés** (`vena.`, et la base `vena.auto` avec lui) | **le seul geste irréversible de l'opération** — voir ci-dessous, c'est l'arbitrage principal du renommage. Condition de dégel : aucune |
| la graine `vena-exemple-v2` | **gelée et versionnée** : un scan enregistré hier doit se relire sur les mêmes bougies. La renommer changerait les bougies, donc périmerait les scans de tout le monde — pour un mot que personne ne lit |
| `venapp.fr` | un domaine s'achète ; il ne se renomme pas par un commit |
| `venacontact1@gmail.com` | une adresse réelle, que rien dans le dépôt ne contrôle |
| `VENA_ACCES` | une variable d'environnement Netlify, **posée dans l'interface** ; lue en repli derrière `VUNA_ACCES` |
| l'acceptation d'une sauvegarde ancienne (`OUTILS_LUS`, `.vena`, `vena_chiffre`) | un fichier que cette application a écrit ne doit jamais être refusé par elle, sans date limite |
| `ANCIENS_DOSSIERS` des deux scripts MT5 | une installation antérieure garde sa liste sous l'ancien nom, et la perdre serait **muet** |
| l'identifiant du sélecteur de dossier (`vena-mt5-common`) | le navigateur s'en sert pour rouvrir au même endroit : le renommer ne gagne rien et fait oublier le dernier dossier |
| les mots français (`provenance`, `venait`, …) | **169 occurrences** : ce n'est pas la marque |

**TROIS DE CES FAMILLES SONT HORS DU DÉPÔT, et ce sont celles de l'utilisateur** — le
domaine, la boîte, la variable Netlify. **Il y en avait quatre il y a quelques heures** :
le nom du dépôt est parti le jour où il a été renommé, et le registre a exigé son retrait
plutôt que de la laisser survivre en tolérance vide. Aucune garde ne peut les changer ni vérifier qu'elles
l'ont été ; ce qui est dans le dépôt, c'est de **ne pas tomber** si elles changent un jour.
`protection.js` lit donc `VUNA_ACCES` **d'abord** et `VENA_ACCES` **en repli** : la
variable peut être renommée dans l'interface Netlify à tout moment, ou jamais, sans
coupure ni dans un sens ni dans l'autre. Et la fonction **ferme quand les deux manquent** —
une protection qui disparaît avec sa configuration ne protège rien.

## Les clés de stockage n'ont PAS été renommées — et voici la raison

C'est la décision qui coûtait le plus cher à prendre à moitié, donc elle est écrite.

**Ce qu'une migration aurait demandé**, en entier : copier chaque clé de chaque espace
étanche (`.perso`, `.client`, `.essai`) de chaque compte, dans l'ordre données → réglages
→ trace, sans rien supprimer, idempotente **par une marque** et non par un « il ne reste
rien à faire », en lisant les index de séries **avant** les blocs de bougies — plus une
sonde d'idempotence sur un stockage **PEUPLÉ** avant la moindre exécution réelle (règle 10 :
à vide, la moitié des bugs d'état ne peuvent pas se produire). C'est exactement la
discipline de `retirerCompteDemo`, et elle existe parce qu'une version de cette migration a
déjà laissé 147 séries et 97 Mo inatteignables.

**Ce que ça achète** : un préfixe cohérent avec le nom du produit, dans un endroit
qu'aucun utilisateur ne regarde jamais.

> **Le gain est cosmétique et invisible ; le risque est la totalité du travail de
> l'utilisateur.** Une clé de stockage n'est pas lue par un humain : c'est le seul endroit
> où la règle du nom ne rapporte rien. Il n'y a donc pas d'arbitrage à faire — il y a une
> question mal posée, et la réponse est de ne pas la poser.

**Et le demi-chemin est le seul vrai danger.** Renommer le préfixe sans migration efface
tout, silencieusement, au premier chargement ; migrer à moitié laisse deux jeux de clés
dont aucun ne fait foi. Ce qui est livré ne fait **ni l'un ni l'autre** : `PREFIXE` vaut
toujours `'vena.'`, et rien n'a bougé dans le navigateur de personne.

**CE N'EST PAS RESTÉ EN PLACE TOUT SEUL, et c'est la morsure à retenir.** La substitution
en masse portait une liste de motifs gelés, dont `vena\.[A-Za-z]` pour les clés. Elle a
laissé passer `const PREFIXE = 'vena.';` — le point y est suivi d'une **apostrophe**, pas
d'une lettre. Le préfixe est devenu `'vuna.'`, et avec lui **tout** ce que l'utilisateur a
déposé serait devenu invisible au premier chargement — pas perdu, pas signalé : absent.

> **Un motif gelé écrit sur la FORME d'une chaîne se fait battre par la fin de cette
> chaîne.** `vena.` suivi d'une lettre décrit toutes les clés SAUF celle qui les
> construit — et c'est la seule qui décide. C'est la règle 3 retournée une fois de plus :
> ce n'est pas la prose qui a trompé le motif, c'est du code qu'il ne comprenait pas
> assez.

Ce qui l'a attrapé n'est pas une relecture : c'est **un test qui est tombé**. Et la même
forme a mordu **une seconde fois**, avant que la première soit refermée — `vena.test`
ressemble à une clé, si
bien que `scripts/app/nom-vena.test.mjs` est resté à l'intérieur des auto-exclusions de la
garde renommée, qui lisait alors son propre fichier. La classe a été mesurée plutôt que
rustinée au coup par coup : `vena.test`, `vena.mjs`, `vena.png`, `vena.zip` — quatre
extensions, quatre corrections, une seule lecture.

## La migration du stockage

**Elle est celle de `simula` → `vena`, et il n'y en a pas de seconde** : le renommage du
19 septembre 2026 n'a pas touché les clés, donc il n'avait rien à migrer (voir ci-dessus).
Ce qui suit décrit la migration en place, et la règle qui vaudrait pour une autre.

Elle vit **en tête de `Vuna.dc.html`, avant la classe** — donc avant la moindre lecture.
Un renommage sans migration efface tout le travail de l'utilisateur au premier
chargement, silencieusement : c'est le seul geste irréversible de l'opération.

Sa règle : **la clé neuve fait foi**. Si elle existe, on la garde ; sinon, si l'ancienne
existe, on la recopie. **Rien n'est supprimé** — l'ancien jeu reste au moins une version,
le temps d'être certain que la copie a réussi et que l'utilisateur a exporté une fois
depuis.

L'ordre compte : **les données d'abord** (séries, scans, portefeuilles, journal — ce qui
est irremplaçable), **les réglages ensuite**, **la trace en dernier**. Une interruption au
milieu laisse la trace absente : le chargement suivant reprend depuis le début, et les
clés déjà copiées sont sautées. Chaque espace étanche (`.essai`, `.client`, `.perso`) et
chaque compte migrent séparément, puisque le suffixe fait partie de la clé.

**Le site ne stocke plus rien.** Il avait ses propres clés et sa propre base
(`src/lib/store.ts`, `src/lib/uploads.ts`) pour une démonstration en React, à côté de
celle que l'application porte déjà. Les deux fichiers sont partis avec elle : le seul
stockage du navigateur est désormais celui de l'application, et la migration ci-dessus
est la seule à tenir.

Les balayages de clés (`estCleApp`) comptent **les deux jeux** tant que l'ancien n'est pas
supprimé : l'occupation réelle du navigateur est bien celle des deux.

## Fichiers

| Nom | Rôle |
|---|---|
| `Vuna.dc.html` | **la source**, un seul fichier |
| `Vuna.solo.html` | **artefact**, régénéré par `npm run app:solo` — ne jamais l'éditer à la main |
| `Export_H1_Vuna.mq5`, `Vuna_Releve.mq5` | scripts MT5 téléchargés par l'utilisateur |
| `aide-index.json` | **artefact**, régénéré par `npm run app:aide` après tout changement de `title=` |
| `src/lib/textes-recopies.ts` | **la source** des textes qui engagent et qu'aucune garde n'atteint — vente et après-vente, recopiés à la main ; vide et marquée tant que le statut n'est pas tranché |
| `REJEU-SOUS-RESISTANCE.md` | le mode d'emploi du seul rejeu MT5 qui reste à faire, écrit pour quelqu'un qui n'a pas lu ce dépôt |

À chaque livraison : `npm run app:version` avant `npm run app:solo` — voir « La version
affichée est une date » plus bas.

Le dépôt GitHub s'appelle **`hubertguillaume44-netizen/vuna`** — troisième nom, après
`simula` puis `vena`. Le renommage se fait depuis l'interface GitHub : c'est un geste de
l'utilisateur, qu'aucun commit ne peut porter. `README.md` et `PASSATION.md` le nomment.

**GitHub redirige les deux anciennes adresses, et ce n'est pas une raison de les écrire.**
Une redirection se retire le jour où quelqu'un recrée un dépôt sous l'ancien nom — et avec
trois noms en circulation, ce jour est trois fois plus probable qu'avec un.

### Une condition de dégel ne vaut que la COMMANDE qu'elle nomme

Ce paragraphe a porté pendant quelques heures l'inverse de ce qu'il dit — `vena`, avec la
mention que le renommage n'avait pas eu lieu — et le registre de `nom-vuna` en a fait sa
**dixième famille**, retirée depuis : le geste a eu lieu, les occurrences ont disparu, et
le registre a EXIGÉ le retrait, parce qu'une famille sans membre le fait tomber comme une
occurrence hors registre.

**Sa condition de dégel nommait une commande qui ne pouvait pas la dater**, et c'est ce
qu'il faut garder de l'épisode. Elle disait : *« `git ls-remote --get-url origin` cesse de
rendre une redirection »*. Or `--get-url` **n'interroge rien** — il imprime `.git/config`.
Il rendait l'ancienne URL avant le renommage, il la rend encore après, et il l'aurait
rendue pour toujours.

> **Une commande qui lit la configuration LOCALE ressemble exactement à une commande qui
> interroge le MONDE**, et un seul drapeau les sépare. `git ls-remote <url>` parle au
> serveur ; `git ls-remote --get-url` parle à un fichier. Écrite dans une note, la
> différence est invisible — et c'est une condition de dégel qui ne se déclenche jamais.

**Ce qui a répondu est le nom CANONIQUE que l'hébergeur rend** — le `full_name` d'un
listage des dépôts accessibles, qui dit `…/vuna` et rien d'autre. Et deux prises
plausibles ont été essayées avant, sans discriminer : les deux URL résolvent (GitHub
redirige, c'est son travail), et un `push --dry-run` ne transfère rien, donc le serveur
n'annonce rien.

C'est la classe déjà nommée, appliquée à un outil au lieu d'un fait : **un fait disponible
— ce que l'hébergeur déclare — remplacé par un fait plausible — ce qu'une commande d'allure
adéquate imprime.** Le geste ne change pas : *avant d'écrire une condition de dégel, la
faire échouer une fois.* Une condition qu'on n'a jamais vue rendre l'autre réponse est une
condition dont on ne sait pas si elle peut la rendre.

## Déploiement — la configuration vit dans le dépôt

`netlify.toml` porte les trois réglages : commande de construction, `publish = "dist"`,
répertoire de fonctions. **Il fait foi contre l'interface Netlify — sur ces trois-là.**

**UNE RÈGLE DIT OÙ ELLE S'ARRÊTE, SINON ELLE SE LIT COMME UNE GARANTIE GÉNÉRALE.** C'est
la même famille que la garde qui éprouvait le producteur au lieu du consommateur : une
consigne vraie sur son domaine, prise pour vraie partout. Ce fichier ne couvre **pas** la
branche construite, ni l'activation des constructions, ni **le verrou de publication** —
ni les variables d'environnement. Quatre réglages qui vivent dans l'interface, que rien
dans le dépôt ne peut contredire. Voir « Ce que `netlify.toml` ne tient pas » plus bas.

Un réglage posé dans
une interface ne se relit pas, ne se révise pas en revue, et personne ne sait qu'il existe
jusqu'au jour où il casse — c'est arrivé : l'interface annonçait `dist/client` et le dépôt
construisait pour Vercel, deux sorties dont aucune n'existait.

`vite.config.ts` construit avec `nitro({ preset: "netlify" })`. Le préréglage dépose les
fichiers statiques dans `dist/` et le serveur SSR dans `.netlify/functions-internal/`,
que Netlify déploie **en plus** du répertoire `netlify/functions`.

**Les deux fonctions écrites à la main** (`licence.mjs`, `usage.mjs`) déclarent leurs
chemins `/api/licence` et `/api/usage`. Le serveur SSR déclare `path: "/*"` et n'exclut
que `/.netlify/*` : les deux se recouvrent. `netlify.toml` tranche par deux redirections
`force = true` vers `/.netlify/functions/…`, cible hors de portée du fourre-tout SSR — on
ne parie pas sur une préséance non documentée quand une licence qui tombe sur le SSR rend
404 au webhook de paiement.

`scripts/deploiement-netlify.test.mjs` lie ces réglages entre eux : préréglage, répertoire
publié, présence des deux fonctions, et une redirection forcée par chemin déclaré.

### Ce que `netlify.toml` NE tient pas, et qui a déjà fait défaut

**Ni la branche, ni l'activation des constructions, ni le VERROU DE PUBLICATION.**
`netlify.toml` porte la commande, le répertoire publié et les fonctions. Ces trois-là sont
des réglages d'interface, et rien dans le dépôt ne peut les contredire — exactement le trou
que la section ci-dessus dénonce, une strate plus bas.

**LE VERROU DE PUBLICATION EST LE PLUS SOURNOIS DES TROIS, et c'est lui qui a mordu.** Un
déploiement est resté figé deux jours : sept constructions étaient parties, et **toutes
avaient réussi** — c'est la publication automatique qui était verrouillée. La version en
ligne restait sur `main@eeca9d5` pendant que les suivantes s'empilaient en réserve.

Retenir la forme, parce qu'elle se reproduira : **tout est vert, et rien n'arrive.** Une
construction verte ne prouve pas une mise en ligne. C'est la règle 1 déguisée en tableau
de bord — « la construction a-t-elle réussi ? » est une intention, « la version en ligne
a-t-elle changé ? » est le résultat.

> **Le journal qu'on regarde n'est pas celui qui répond à la question.**

Un journal de constructions réussies n'est pas un journal de publications, et il est
d'autant plus trompeur qu'il est vert : on y lit une confirmation là où il n'y a qu'une
étape. La seule preuve est **ce que sert l'adresse publique** — sur cette application, le
numéro du pied de page.

C'est ce qui donne rétroactivement sa valeur au **rang de version** : `260913.8` désigne
une livraison, `260905` ne désignait qu'une semaine. Un numéro qui ne distingue pas deux
mises en ligne ne peut pas servir de preuve qu'une mise en ligne a eu lieu.

Ce que le dépôt prouvait alors, et qui reste la façon de trancher — en sachant désormais
qu'aucune de ces vérifications n'atteint le verrou :

| Vérification | Commande |
|---|---|
| la branche par défaut est bien `main` | `git ls-remote --symref origin HEAD` |
| `main` porte le travail | `git log origin/main --oneline -5` |
| aucune branche périmée ne traîne | `git ls-remote --heads origin` |
| la construction passe de bout en bout | `npm run build` |

**Une branche périmée qui reste sur le dépôt est un piège**, pas un souvenir :
`claude/sivula-mt5-discrepancy-25ktd5` porte encore `Sivula.dc.html` et
`VERSION_APP = '260905'`. Une interface qui pointerait là construirait un fichier que
`publier-solo.mjs` ne trouve même plus, et le site resterait figé sans qu'aucune
construction n'échoue bruyamment.

**Elle est à supprimer, et elle ne perd rien** : vérifié, son sommet est un ancêtre de
`main` et elle ne porte **aucun** commit propre — `git log origin/main..<branche>` rend
zéro. La supprimer retire un pointeur, pas un historique.

```
git push origin --delete claude/sivula-mt5-discrepancy-25ktd5
```

Depuis une session Claude Code, cette commande ne passe pas : le mandataire git accepte la
poussée et **laisse tomber le refspec de suppression** — elle rend « Everything
up-to-date » et la branche reste. Trois tentatives, même résultat. C'est un geste à faire
depuis un poste, ou depuis l'interface GitHub.

## Deux entrées, deux promesses

| Adresse | Ce que c'est | Ce qu'elle promet |
|---|---|---|
| **`/app`** | `Vuna.solo.html` servi tel quel, hors du routeur du site | « ouvrir mon outil » — cinq pages, le moteur complet, vos données |
| **`/tarifs`** | une page du site, en React | « combien ça coûte » — trois formules, un comparatif, six objections |

**Il n'y a plus qu'une démonstration, et c'est celle de l'outil.** Le site portait la
sienne en React, sur `/simuler`, à côté de celle que l'application porte déjà avec le
moteur entier : deux moteurs à tenir d'accord, et le jour où ils divergent c'est la
vitrine qui ment sur le produit. Les séries de démonstration s'ouvrent dans `/app`.

**Le site vend, l'application travaille.** Le prix vit sur `/tarifs` et nulle part
ailleurs ; l'accueil n'en garde qu'un résumé de trois montants. Dans l'outil, le prix
n'est jamais écrit — il est POINTÉ, par un lien discret en bas de la section licence du
tiroir. Une seconde page de vente serait une seconde vérité à tenir à jour.

`/app` n'étant pas une route du routeur, on y va par un `<a href>` : un `<Link>`
tenterait une navigation interne vers une route qui n'existe pas.

**Le repère d'arrivée est `/app#licence`, et c'est le seul.** Les colonnes payantes de
`/tarifs` le portent ; il ouvre le tiroir de l'application sur la section Licence,
curseur dans le champ du courriel. Un **fragment** et non un paramètre : il ne part
jamais au serveur, donc il ne croise pas la redirection `/app` → `/app/index.html`.

`repereLicence()` le **nettoie** (`history.replaceState`) dès qu'il l'a lu, avant toute
décision — sans quoi un rechargement, ou un favori posé sur cette adresse, rouvrirait le
tiroir indéfiniment. Il n'est lu qu'APRÈS la revérification de la licence, qui est
asynchrone : le lire plus tôt ouvrirait le tiroir au nez de quelqu'un qui a déjà sa clé.
Il ne s'enregistre nulle part — ni session, ni drapeau « déjà vu ».

**Un seul champ de clé dans toute l'application**, celui du tiroir. Le bandeau de compte
vide y MÈNE, il ne le copie pas : deux champs seraient deux états à tenir d'accord.
`scripts/app/ou-poser-sa-cle.test.mjs` tient les trois points — un seul champ, le repère
nettoyé, et le bandeau qui s'efface dès qu'une clé est posée.

**La construction REFAIT l'application avant de la publier.** `npm run build` appelle
`scripts/app/publier-solo.mjs`, qui relance `solo.mjs`, vérifie que la version de
l'artefact est celle de `Vuna.dc.html`, puis copie dans `dist/app/index.html`. Publier le
`Vuna.solo.html` du dépôt aurait servi, un jour ou l'autre, une version figée divergeant
de la source — la même panne que le préréglage de déploiement, une strate plus haut.

**`_ds/` EST dans le dépôt depuis, et cette section disait le contraire.** Quinze fichiers
sous `public/_ds/industry-…/` — feuille, paquet, manifeste, polices — suivis par git et
recopiés dans `dist/` par Vite. `publier-solo.mjs` avertit s'ils manquent, et il
n'avertit plus. La phrase « `_ds/` n'est pas dans le dépôt » est restée après que le
problème eut été réglé : une consigne périmée envoie chercher une panne qui n'existe
plus, ce qui coûte plus cher que pas de consigne du tout.

**React et React-DOM viennent d'unpkg.com**, chargés par le runtime DC au démarrage. Un
réseau qui bloque unpkg laisse l'application vide.

## L'application ne dépend de rien d'extérieur

Une fois `/app` chargé, **aucune requête ne part vers un tiers**. Trois dépendances le
mettaient en défaut ; les trois sont dans le dépôt.

| Ce qui partait dehors | Où c'est maintenant |
|---|---|
| React et React-DOM, depuis unpkg.com | `vendor/react-18.3.1/` |
| La feuille et le paquet du système de design | `public/_ds/industry-…/` |
| Barlow et Barlow Condensed, importées par cette feuille | `public/_ds/industry-…/fonts/` |

**React.** `support.js` porte « do not edit » ; on ne le modifie pas. Son
`cdnScriptFor` lit `window.__resources` avant de retomber sur l'URL distante :
`Vuna.dc.html` pose cette table **avant** la balise du runtime, et `solo.mjs` la remplace
par des Blob URL pour que le fichier unique reste autonome. Les deux URL unpkg qui
subsistent dans le fichier livré sont les **clés** de cette table — ce que le runtime
cherche, jamais ce qu'il charge.

**Les versions sont épinglées à 18.3.1, pas à une plage.** Un produit qui se met à jour
tout seul quand un tiers publie casse un matin sans qu'on ait rien touché. Les fichiers
vendorés sont vérifiés **identiques aux empreintes SRI** que `support.js` attendrait du
CDN : ce n'est pas « une version de React », c'est la même, octet pour octet.

**Les polices** sont vendorées en latin et latin-ext seulement — l'application est en
français. `node scripts/app/vendorer-polices.mjs` les rafraîchit à la main ; il ne tourne
pas à la construction, qui ne doit pas dépendre d'un service tiers pour réussir.

**Les seules adresses externes tolérées** dans le fichier livré sont les portes ouvertes
sur demande : `finnhub.io` (actualités) et `api.mymemory.translated.net` (traduction).
Elles ne partent qu'avec une clé posée par l'utilisateur, et le tiroir Intendance les
affiche une par une.

`scripts/app/autonomie.test.mjs` tient tout cela : empreintes SRI, ordre de la
substitution, absence de chargement de tiers dans le fichier livré, présence des polices,
et correspondance entre le chemin que l'application déclare et celui où le fichier est
publié.

## Protection temporaire du site (à retirer au lancement)

Le site entier est derrière une authentification de base, déclarée dans `netlify.toml`
par un bloc `[[edge_functions]]` de trois lignes. **Supprimer ces trois lignes l'enlève**
— voir PASSATION.md, « La protection temporaire du site ».

Le mot de passe vit dans une variable d'environnement posée dans Netlify, au format
`identifiant:motdepasse`, jamais dans le dépôt. **`VUNA_ACCES` est lue d'abord,
`VENA_ACCES` en repli** : la variable est posée dans l'**interface**, que le dépôt ne peut
pas contredire (voir « Ce que `netlify.toml` ne tient pas »), donc la renommer là-bas est
un geste de l'utilisateur — à faire quand il veut, ou jamais, sans coupure dans aucun des
deux sens.

La fonction **ferme quand les deux manquent** : une protection qui disparaît avec sa
configuration ne protège rien.

Elle couvre `/api/licence` : **le webhook Revolut recevra 401 tant qu'elle est en place**.
À traiter le jour où le paiement s'ouvre, avec la liste `OUVERTS` de `protection.js`.

## Une barre d'état ne promet que les tâches qu'elle sait poser

Elle disait « tout est à jour ». Elle sait poser SES tâches — relevé manquant, bougies
absentes, scan jamais lancé, estampille absente. Elle ne sait pas si les chiffres
enregistrés sont ceux que le moteur calcule aujourd'hui, et l'estampille ne le sait pas
non plus. La phrase a donc été lue comme une réponse à la question des chiffres périmés,
à côté d'une pastille qui disait le contraire.

C'est la famille de `netlify.toml` : **une règle dit où elle s'arrête, sinon elle se lit
comme une garantie générale.** Elle dit maintenant « aucune tâche en attente », qui est
vrai et qui ne promet que son domaine.

## La version affichée est une date, et elle part avec les rapports

`VERSION_APP` n'est pas un ornement du pied de page. Elle voyage avec **chaque rapport
d'avis** et **chaque fichier de diagnostic** : c'est la seule chose qui dise quelle
version l'utilisateur avait sous les yeux quand il a vu ce qu'il rapporte. Restée à
`260905` pendant que l'application changeait de fond en comble, elle ne se contentait
pas d'être inutile — elle **mentait**, et un rapport qui ment sur sa version fait
chercher un défaut là où il n'est plus.

**À chaque livraison :** `npm run app:version` (pose la date du jour, format AAMMJJ),
puis `npm run app:solo`. `npm run app:version -- --voir` dit ce qui est posé sans rien
écrire.

**Et un RANG quand la journée ne suffit plus.** « La journée est la granularité utile »
était vrai jusqu'au jour où il a fallu savoir *laquelle* des livraisons du jour était en
ligne. Une seconde livraison le même jour prend `260913.2`, la troisième `260913.3` ; la
première du jour reste nue, pour que le cas courant garde sa lisibilité.

**Un rang ne répare pas le passé.** `VERSION_APP` est restée figée à `260905` pendant une
semaine entière : aucun numéro ne distingue les commits antérieurs au 12 septembre, et
lire « 260905 » dans un pied de page ne dit rien de plus que « avant le 12 ». C'est la
raison d'être du rang, et la limite de ce qu'il peut.

### La découverte des porteurs ne s'ancre PAS sur le nom du produit

C'est le piège que le second renommage a failli ouvrir, et il valait d'être vérifié plutôt
que supposé. `app:version` date la source **et** les scripts MT5 qui portent la marque de
version. La façon paresseuse de les trouver est le nom de fichier — « les `.mq5` qui
commencent par `Vuna_` » —, et elle serait devenue **aveugle sur les fichiers qu'on vient
de renommer**, sans rougir : zéro porteur, zéro écart signalé, et un `.ex5` compilé qu'on
croit à jour.

> **Un nom de LIEU déguisé en découverte**, et c'est la règle 8 dans l'outillage : la
> découverte s'ancre sur ce qui AGIT — `#define VUNA_VERSION "`, une déclaration —, sur
> **tous** les `.mq5` et `.js` de la racine. Trois porteurs aujourd'hui
> (`Export_H1_Vuna.mq5`, `Vuna_Releve.mq5`, `robot-mt5.js`) ; un quatrième serait daté
> sans qu'on le nomme nulle part.

**Et elle prouve sa prise** : zéro porteur trouvé n'est pas « rien à dater », c'est une
découverte désancrée. Le script le DIT et sort en erreur, plutôt que de rendre un succès
silencieux — la forme qui fait chercher plutôt que celle qui fait s'arrêter.

**Le script n'agit plus en étant importé.** `suivante()` est exportée pour être éprouvée ;
sans garde, la seule *lecture* du module posait une version — deux imports de vérification
ont fait passer le fichier de `260913` à `260913.3` en deux secondes, sans que personne
n'ait demandé une livraison. Un module qui agit au chargement n'est pas testable.

**Ne pas la confondre avec `MOTEUR_V`.** Celle-là est une clé de cache : la changer
PÉRIME les résultats enregistrés de tout le monde. `VERSION_APP` est une étiquette, elle
ne conditionne aucun calcul — c'est pour ça qu'on peut la bouger sans précaution, et
aussi pour ça qu'on l'oublie. `scripts/app/version-datee.test.mjs` interdit qu'elles se
confondent, et vérifie que la date existe, qu'elle n'est pas dans l'avenir, et que
l'artefact porte la même que la source.

**L'oubli se voit à la construction.** `publier-solo.mjs` avertit quand `Vuna.dc.html` a
été écrit après la date qu'il annonce. C'est un avertissement et non un arrêt : un clone
frais réécrit les dates de fichiers, et refuser de construire un dépôt fraîchement cloné
serait un piège pire que l'oubli qu'on prévient.

## Les séries d'exemple sont engendrées, jamais livrées

**Aucune série d'exemple n'est un fichier.** Tout vient d'un générateur déterministe à
graine fixe, en tête de `Vuna.dc.html` : quelques kilooctets de code, zéro octet de
données, les mêmes séries pour tout le monde. **Rien des exports d'un utilisateur n'entre
dans le produit** — ce qui était le cas des quatre séries `DEMO-*` livrées en CSV, dont
personne ne pouvait plus dire d'où venaient les prix.

**La graine est gelée, versionnée — jamais choisie : `vena-exemple-v2`.**

*Gelée* : un scan enregistré hier doit se relire sur les mêmes bougies. *Versionnée* : le
jour où le générateur change, les bougies changent, et le numéro suit. La `v2` date du
lissage et de la dispersion des régimes ; la `v1` était l'escalier commun aux dix
familles. Le test échoue à chaque changement du générateur, exprès — il oblige à décider
si les bougies ont bougé, et à le dire, plutôt qu'à s'en apercevoir le jour où un scan
enregistré ne se relit plus.

*Jamais choisie*, et c'est la partie qui demande de l'attention. On a proposé de
rechoisir la graine sur un critère de **présentation** — que la dernière clôture de
chaque famille tombe dans les 80 % centraux de son amplitude — au motif qu'un tel critère
ne parle pas de performance. **Mesuré sur vingt-quatre graines : deux le satisfont.** Une
propriété rare n'est pas un cadrage. Une clôture au bord de l'amplitude est la signature
d'une tendance qui a tenu jusqu'au bout ; exiger que les dix l'évitent retient les univers
où les tendances meurent avant la fin — exactement ce qu'un balayage de croisements de
moyennes est censé trouver, ou ne pas trouver. Le critère a l'air d'un cadrage, c'est un
réglage du marché.

### Aucune famille n'est cotée sous 1 — et ce n'est pas au générateur de le corriger

Un rapport a nommé l'angle mort : 423 trades côté MT5 contre 104 côté Véna sur **le
premier instrument coté sous 1** jamais éprouvé (0,65 ; les cinq autres, tous d'accord à
quelques unités, sont à 96, 99, 1790, 29000). Mesuré ici : les dix familles vont de
**1,0850** (VX-EUR) à 61 200 (VX-BTC), et les huit références MT5 non plus ne descendent
sous 1. Un défaut qui ne se réveille que là avait toute la place pour vivre.

**Descendre une famille sous 1 paraissait la réponse, et c'est la mauvaise.** Changer un
niveau de prix change les bougies, donc périme les scans enregistrés de tout le monde, et
se paie en `vena-exemple-v3` — voir la graine gelée plus haut. *Le prix d'éprouver une
propriété du moteur n'a pas à être payé par les données des utilisateurs.* Une série de
banc coûte zéro octet chez eux.

**La propriété se garde donc directement**, dans `scripts/mt5/echelle-des-prix.test.mjs` :
tout ce que le moteur décide est en pourcentage — stop, objectif, plafond de spread —,
donc multiplier tous les prix par une constante ne peut pas changer le nombre de trades.
Trois échelles, 1790 / 96 / 0,65, spread tenu à 0,012 % du cours à chacune. **C'est la
CLASSE et non le cas** : elle attrape un défaut à 0,000012 aussi bien qu'à 0,65, et elle
n'a aucune liste d'instruments à tenir à jour (règle 8 appliquée à la garde).

**Elle n'a rien attrapé, et son statut le dit** : 130 trades aux trois échelles. Deux
choses en sortent quand même, et elles rétrécissent la recherche :

| Ce qui a été éprouvé | Ce que ça élimine |
|---|---|
| grain forcé à 2 décimales (mutation) : spread relevé 0,012 % → **12,02 %** sur l'instrument à 0,65 | le compte passe de 130 à 130. **Le plafond de spread ne peut pas produire un écart de comptes** — même faux d'un facteur mille |
| le stop, l'objectif et les paliers lus dans le source émis | `prix × (1 ± STOP_PCT/100)` : aucun point, aucun `Digits`, aucune constante absolue. Le refus « stop sous le minimum courtier » RETIRE des entrées, il n'en ajoute pas |

**Ce qu'aucune des deux ne couvre, et qui reste le suspect** : un CSV réel abîmé — prix
tronqués à l'export, colonne de spread en points d'un autre pas, bougies plates par
arrondi. Ces trois-là ne se distinguent pas d'une série saine par leur ÉCHELLE, donc
l'invariance ne les voit pas, et c'est écrit dans l'angle mort de la garde.

## Le compte de découverte n'existe plus

Il était le **sixième compte** d'un sélecteur qui en offre cinq, avec ses bougies écrites
dans le navigateur, son relevé de frais à lui et un semis versionné. Trois défauts, et
aucun n'était cosmétique : il occupait une place de compte ; ses bougies pesaient dans la
jauge et partaient dans « Exporter mes données » ; et **ses frais appartenaient au
compte**, si bien que le spread d'une série changeait selon l'onglet depuis lequel on la
regardait.

Les dix séries d'exemple vivent maintenant **en mémoire**, visibles depuis n'importe quel
compte, et leur relevé vient de la table du générateur — deux colonnes, spread en pour-cent
du notionnel et swap annuel. Écrit en points, il restait « coût non chiffrable » jusqu'à ce
qu'une conversion de prix passe : le relevé d'exemple est donc marqué `mt4: false` et
`chiffre: true`, c'est-à-dire **déjà retraité**.

**`compteActif` est une liste blanche.** Une session enregistrée désigne peut-être encore
`ongCourtier: 'demo'`. Une liste noire ne protège que du cas qu'on a pensé ; la prochaine
clé morte viderait l'écran sans un mot, exactement comme le jour où la page d'accueil a été
retirée sans garder la porte.

**La couverture des séries d'exemple se calcule et ne s'enregistre pas.** Elle est lue en
surcouche de la carte et **retirée à l'écriture** : la carte lue est celle qu'on réécrit,
donc sans ce filtre elles se seraient enregistrées au premier relevé d'une vraie série.

**`retirerCompteDemo()` est le seul geste irréversible de l'opération**, et il n'efface que
des données engendrées. Il est idempotent **par une marque** — juger à « il ne reste rien à
faire » rebalaie tout le stockage à chaque chargement. Il ne prend que les clés se
terminant par `.demo` : un suffixe, jamais un fragment, sans quoi un compte que l'utilisateur
aurait nommé « demo-perso » partirait avec. Et il lit les index de séries **avant** de les
effacer, sinon leurs blocs de bougies restent inatteignables — la panne qui a déjà laissé
147 séries et 97 Mo derrière elle.

**Masquer n'est pas supprimer.** L'interrupteur du tiroir retire les dix de la vue et les
repose ; il n'efface rien, parce qu'il n'y a rien d'écrit. Un bouton « supprimer » mentirait
sur ce qu'il fait. Seul le choix est enregistré, un booléen dans la session.

**Le filtre de provenance est une deuxième question**, pas une variante de « avec bougies » :
l'une demande ce qui est mesurable, l'autre d'où ça vient. Les fondre en un segment rendrait
impossible « mes instruments qui ont des bougies », qui est la vue de travail.

**Ni le palier gratuit ni le bandeau d'arrivée ne les comptent.** Le premier fermerait la
mesure à quelqu'un qui n'a rien déposé ; le second disparaîtrait au premier chargement, et
avec lui la seule porte visible vers le champ de clé.

## Ce qu'on conserve porte deux promesses, et c'est ce qui les rend vraies

« **Rien n'est conservé sur vous, pas même votre achat** » a longtemps été écrit sur la page
de vente. C'était faux **et** illégal : une facture se conserve dix ans. La promesse vraie
porte sur les **données** — prix, scans, portefeuilles ne quittent pas le navigateur — et
elle est vérifiable. C'est la même figure que la limite de `netlify.toml` : *une règle dit
où elle s'arrête, sinon elle se lit comme une garantie générale.*

Une fois le domaine nommé, le registre des ventes cesse d'être une gêne et devient **ce qui
tient deux promesses** :

| La promesse | Ce qui la rend vraie |
|---|---|
| « votre clé vous est renvoyée autant de fois qu'il le faut » | le registre prouve que le demandeur a acheté |
| « le tarif ne remonte jamais pour ceux qui en bénéficient » | **le prix payé**, inscrit sur la facture et conservé avec elle |

La seconde ligne est une **ligne de plus dans ce qu'on conserve**, et sans elle la promesse
reste verbale — exactement le défaut qu'on venait de purger ailleurs.

**Ce qui prouve est ce qu'un tiers a écrit et conserve.** Le renoncement au droit de
rétractation suit la même règle : il doit vivre dans le **libellé de l'article** du lien de
paiement, donc dans la facture, et non à côté. Une première version le faisait voyager dans
l'adresse de paiement (`?renonce=<horodatage>`) : fausse preuve deux fois — un paramètre
d'URL est fabricable par l'acheteur, et son absence ne prouve rien non plus, alors que la
charge de la preuve pèse sur le **vendeur**. La case à cocher reste, et sa fonction reste
entière : elle fait **consentir**. C'est la facture qui **prouve**.

## Les seize règles, dans l'ordre où elles se servent

Elles viennent toutes d'un défaut réel de ce dépôt, et chacune est détaillée plus bas.

> **ET C'EST LE CRITÈRE D'ADMISSION DE TOUT CE FICHIER, pas seulement des seize.** Une
> règle entre ici parce qu'elle a été LUE sur la pratique — sur un défaut réel, ou sur
> une habitude réelle qu'on n'avait pas nommée. Elle n'entre jamais parce qu'elle
> paraissait vraie au bureau. *Ce qui n'est né ni d'un défaut ni d'une habitude n'entre
> pas.*

Le coût de ne pas l'appliquer n'est pas une ligne de trop : c'est que **le fichier cesse
d'être lu**. Une section écrite pour elle-même se reconnaît à ce qu'elle n'a ni cas
fondateur ni geste — et elle dilue les autres, qui en ont. Une règle prescrite à la
pratique, personne ne l'applique ; une règle lue sur elle n'a pas à être adoptée, elle
est déjà là.

1. **Demander une intention pour prédire un résultat** — décider après, pas avant ; et
   une intention qui se TROUVAIT vraie devient fausse au premier chemin d'interruption
   qu'on ouvre, sans qu'aucune mutation ait pu l'annoncer.
2. **Toute garde de frontière se vérifie par mutation** — une sonde qui ne tombe jamais ne
   prouve rien.
3. **On interdit le code, pas le récit du code.**
4. **Quand l'explication contredit l'étiquette, c'est l'étiquette qui est le défaut.**
5. **Une affirmation sur un fichier se relit avant d'être rapportée.**
6. **Une marque temporaire est reliée à la condition qui la justifie** — sinon elle devient
   un commentaire permanent que plus personne ne lit.
7. **La surface se découvre, elle ne s'énumère pas** — un périmètre écrit à la main porte
   toujours une hypothèse implicite.
8. **Un nom de LIEU fixe un périmètre ; un nom de PROPRIÉTÉ en découvre un** — c'est la
   règle 7 vue depuis l'amont, au moment où l'on nomme ; et elle vaut pour les GARDES
   elles-mêmes : un correctif qui ferme une classe ne se garde pas sur un fichier.
9. **Un angle mort qu'on ne peut pas fermer se déclare dans la garde elle-même** — sinon la
   garde suivante hérite d'une confiance qu'elle n'a pas méritée ; et il se déclare **DANS
   l'affirmation, en tête**, jamais dans une note en dessous : entre les deux, c'est la
   voix confiante qu'on lit.
10. **Le cas VIDE est le plus faible des tests** — c'est celui où la moitié des bugs
    d'état ne peuvent pas se produire, et c'est celui qu'on écrit spontanément.
11. **Seul le rendu prouve que la valeur arrive** — une garde de source voit ce qui est
    envoyé, jamais ce qui est reçu ; et un avertissement de runtime est une mesure, pas
    du bruit.
12. **Un mot relatif n'est vrai que depuis un référentiel stable** — un élément engendré,
    figé ou collant n'a ni « depuis quand » ni « depuis où » ; et un CHEMIN relatif non
    plus, sous un document servi par réécriture.
13. **Une mutation se défait par le mécanisme qui l'a faite** — jamais par une
    restauration de dépôt, qui ne distingue pas la mutation du travail en cours.
14. **Une suppression se cartographie avant de se faire** — chaque garde accrochée à ce
    qui part a une fin dite : elle part avec le geste, se réancre sur ce qui reste, ou
    s'ancre sur l'absence. Jamais en silence — et la prose se cartographie DANS LES DEUX
    SENS : celle qui reste autour se relit, et celle qu'on **ajoute** pour expliquer le
    retrait est du contenu neuf, qui entre dans le champ des gardes.

15. **Une sonde dont l'échec est SILENCIEUX PAR CONCEPTION se garde ailleurs** — le
    silence peut être le bon choix, et il rend alors le défaut indistinguable du cas
    normal. Le témoin ne peut pas être son propre témoin.

16. **Une garde se juge aussi sur ses FAUX REFUS** — une garde correcte peut être
    annulée par son propre taux de faux positifs. Le coût d'un faux refus n'est pas
    une gêne : c'est la DÉSACTIVATION, et la désactivation est permanente quand le
    faux refus était ponctuel.

Les règles 6 à 9 sont nées le même jour, sur la même garde. Elles ferment par
**construction** ce que les cinq premières ne fermaient que par **vigilance** — ou, quand
rien ne peut le fermer, elles l'écrivent. La onzième est née de la panne la plus large du
dépôt : toutes les tables vides, tous les tests verts. La douzième unifie deux corrections
d'affichage nées à un jour d'écart — « hier » sur une fenêtre figée, « ci-dessous » depuis
une barre collante. La treizième est née d'un incident évité de justesse : un
`git checkout --` posé pour défaire une mutation aurait emporté le correctif même qu'elle
éprouvait. La quatorzième est née de l'élagage des trois familles mortes : six gardes
s'accrochaient à ce qui partait — dont une dont personne ne savait qu'elle empruntait sa
source à l'affaire supprimée — et chacune a eu une fin dite. La seizième est née en une
soirée : une garde livrée le matin refusait le cas NORMAL — le « # » que ce courtier met
devant ses indices — et l'utilisateur l'a désactivée le soir, comme il fallait pour
travailler. Elle a immédiatement laissé passer ce qu'elle venait d'interdire.

## Le défaut a un nom : demander une INTENTION pour prédire un RÉSULTAT

**C'est la règle qui sert le plus, et de loin.** Cinq fois la même forme en deux séances,
et toujours le même geste pour en sortir : **décider après, pas avant.**

| Où | L'intention demandée | Le résultat voulu |
|---|---|---|
| Garde d'étanchéité | « le générateur écrit-il ? » | « quelque chose d'engendré entre-t-il dans le stockage ? » |
| `this.essai` | « a-t-il payé ? » | « y a-t-il quelque chose à mesurer ? » |
| `aMoi` | « a-t-il déposé ? » | idem |
| La sonde accrochée à `const OUVERTS = [];` | « la liste est-elle encore vide ? » | « où la déclaration se trouve-t-elle ? » |
| Le semis de mesure | « l'espace est-il `.essai` ? » | « quel espace l'application vient-elle d'écrire ? » |
| La garde du tarif gelé | « le mot *facture* existe-t-il quelque part ? » | « les deux phrases sont-elles ensemble ? » |

La dernière est une variante discrète : chercher un mot dans **tout un fichier** pour
conclure que deux phrases voyagent ensemble, c'est encore mesurer une intention pour un
résultat. Elle passait au vert sur une promesse nue, parce qu'une autre phrase, sur tout
autre chose, parlait de facture. Corrigée, elle a immédiatement trouvé un vrai défaut :
`mentionLancement` était écrite en trois littéraux, la promesse séparée de sa preuve.

À chaque fois l'intention était un **proxy plausible** du résultat, et à chaque fois elle
divergeait dans un cas que personne n'avait listé. Les deux du milieu sont les plus
instructives parce qu'elles n'ont rien cassé bruyamment : la sonde échouait en annonçant
« /merci : attendu 200 », un message qui ne désigne pas la cause ; et le semis de mesure
écrivait dans le mauvais espace en rapportant **« 0 série » sans se plaindre** — une
mesure fausse qui a l'air d'une mesure.

### Sa variante par effet de bord : un module qui AGIT au lieu d'OFFRIR

**Un module qui agit au chargement transforme toute lecture en écriture.** `version.mjs`
datait la source à l'import : deux imports de vérification ont livré deux versions en deux
secondes. Le lecteur demandait « que fait cette fonction ? », le module a répondu en le
faisant.

C'est la même erreur vue de l'autre bout : au lieu de prendre une intention pour un
résultat, le module prend une lecture pour un ordre. **Un script exporte, ou il agit — s'il
fait les deux, sa partie active vit derrière un test d'appel direct.**

Et une **consigne périmée** relève de la même famille : elle a l'autorité des vraies et
envoie chercher une panne qui n'existe plus — « `_ds/` n'est pas dans le dépôt » l'a fait,
des deux côtés de la conversation. La règle 5 vaut pour les consignes autant que pour le
code : une affirmation sur un fichier se relit sur le disque, qu'elle vienne d'un script,
d'un document, ou de quelqu'un qui cite le document.

**Quand le résultat est observable, observez-le.** Il l'est presque toujours : il suffit
d'accepter de le faire plus tard dans le code.

### Sa forme la plus coûteuse : le geste de RÉPARATION gaté sur l'intention

Les six premières occurrences faussaient un CHIFFRE. La huitième a fermé le seul
chemin de réparation qui existait, et personne ne l'a vue parce qu'elle ne produit
aucun message : un bouton absent ne se plaint pas.

« Remesurer les 12 lignes » a été livré gaté sur `(v._mv || 'e1') !== MOTEUR_V` —
l'estampille du moteur portée par la ligne. Mesuré au rendu, dans un navigateur, sur
le fichier livré :

| l'état de la ligne | ce que l'écran porte |
|---|---|
| sans `_mv` | « Remesurer les 3 lignes » + la tâche de la barre |
| `_mv = 'e4'` | **rien** |

Or `MOTEUR_V` vaut `e4` depuis le premier jour du dépôt et n'a **jamais** été tournée,
pendant que le moteur changeait de règle (4,00 R → 14,93 R sur la même configuration).
Toute ligne validée depuis la passation porte donc `e4` : le bouton était
**structurellement invisible sur le seul parc qui existe**, et les cinq gardes de
source qui le tenaient étaient vertes — elles prouvaient que la boucle, le refus et
l'écriture par ligne étaient justes, aucune ne pouvait voir la VALEUR du prédicat.

> **Gater un geste de réparation sur un prédicat de péremption, c'est refuser la
> réparation à ceux que le prédicat ne sait pas détecter.** Et c'est exactement eux
> qui en ont besoin : si le prédicat les voyait, ils ne seraient pas le cas difficile.

L'intention était « l'estampille est-elle vieille ? » — quelqu'un a-t-il pensé à
tourner la clé. Le résultat est « le chiffre a-t-il bougé ? », et il est **observable
par le geste lui-même** : il suffit de remesurer et de comparer. Le geste reprend
donc TOUTES les lignes et **nomme celles qui ont changé** ; le bilan rend aussi
« aucun chiffre n'a changé », parce qu'un zéro tu laisserait croire que rien n'a été
vérifié.

**Et le prédicat, lui, reste — pour ce qu'il sait dire.** Il compte les lignes SANS
estampille, ce qui est une information vraie, et il garde sa tâche de barre d'état,
qui peut se vider. Ce qu'on lui retire, c'est le droit d'éteindre le geste.

**La leçon d'outillage est la même que celle de la règle 11, un cran plus loin.** Le
banc de rendu partait d'un profil NEUF, sans ligne validée : il n'exerçait aucun des
deux états, et il est resté vert pendant toute la livraison. C'est la règle 10 —
le cas vide est celui où le défaut ne peut pas se produire — appliquée au banc qui
existe pour fermer la règle 11.

### Sa forme dormante : une intention qui se TROUVAIT vraie

Les six premières occurrences étaient des intentions qui se **trompaient** : on demandait
« a-t-il payé » pour « y a-t-il quelque chose à mesurer », et les deux divergeaient déjà.
La septième ne se trompait pas. `fusionCor` inscrivait `tirages: fin` — la CIBLE du
contrôle au lieu du compte réellement tiré — et c'était **juste**, aussi longtemps que
rien ne pouvait interrompre un calcul. Cible et compte joué coïncidaient par
construction ; l'intention était un proxy EXACT du résultat, pas un proxy plausible.

Elle est devenue fausse à la minute où un chemin d'arrêt a été ouvert dans la boucle de
tirage — dans le correctif de la même heure. Et `tirages` est le **dénominateur** de
`p = (au + 1) / (tirages + 1)` : 500 inscrit pour 120 tirages joués rend un p quatre
fois trop petit, sur une carte qui affirme « se distingue du hasard ».

> **Une garde de mutation ne peut pas attraper celle-là**, et c'est ce qui la distingue
> des six autres : elle ne devient fausse que sous un changement qui n'existait pas
> encore le jour où on l'aurait écrite. Muter le code de la veille l'aurait trouvée
> correcte, parce qu'elle l'était.

Le signal disponible n'est donc pas une garde, c'est une **question au moment d'ouvrir
le chemin** : *quelles valeurs cessent d'être vraies parce qu'elles ne pouvaient pas
être fausses ?* Un dénominateur de p en est une ; un compte de blocs écrits en est une
autre. Ce sont les valeurs qu'on a laissé dériver d'une BORNE (`fin`, `total`, `cible`)
parce que la borne était toujours atteinte — et un chemin d'interruption, de reprise ou
de repli est exactement ce qui retire cette garantie.

**L'intervalle est le bon indicateur, et il était d'une heure.** La valeur n'a jamais
menti dans une version livrée : elle est partie dans le commit qui l'activait. Mais ce
délai était celui d'une relecture, pas celui d'une garde — et une relecture ne se
reproduit pas à la demande.

## Une garde se juge aussi sur ses faux refus

**Les quinze premières règles parlent de gardes qui ne voient pas assez.** Celle-ci parle
d'une garde qui voyait juste et qui a été **annulée** — non par un défaut de son critère,
mais par son taux de faux refus. Elle a vécu une journée.

> **Le coût d'un faux refus n'est pas une gêne, c'est la DÉSACTIVATION.** Et la
> désactivation est permanente quand le faux refus était ponctuel. Une garde qu'il faut
> désactiver pour travailler ne garde rien — et elle est pire que pas de garde, parce
> qu'on la croit là.

Le refus comparait les chaînes **brutes**. Chez ce courtier, les indices s'écrivent
`#HongKong50` là où la mesure porte `HongKong50` : le refus tombait sur **le même
instrument**, à chaque lancement. La seule sortie offerte était `InpSymboleLibre`, qui
désarme la garde **entièrement** — et le soir même, elle a laissé passer un robot
HongKong50 sur les données d'un autre instrument. Exactement ce qu'elle venait d'être
écrite pour empêcher.

C'est une parente de la règle 1 : on avait demandé « les deux chaînes sont-elles
identiques ? » (une intention — *le courtier écrit-il le nom comme nous ?*) pour décider
« est-ce le même instrument ? » (le résultat). La comparaison porte donc sur le **noyau** :
capitales, tout caractère non alphanumérique retiré, et l'un des deux noms doit être
**préfixe ou suffixe** de l'autre. Aucune liste de courtiers, aucun tableau de préfixes
connus — `#` et `.` disparaissent d'eux-mêmes, `GOLD.r` garde `GOLD` en préfixe,
`FX_EURUSD` garde `EURUSD` en suffixe.

**La règle est mesurée, pas déclarée.** `robot-tient-son-symbole.test.mjs` porte un port
fidèle et onze cas nommés — dont les deux accidents réels, qui doivent refuser — et un
test distinct vérifie que le source émis **appelle** la règle, sans quoi le port
mesurerait une règle que personne n'exécute. L'angle mort est écrit : `GOLD` contre
`GOLDMINI` passe ; ils partagent leurs prix et le dimensionnement lit la taille de
contrat du symbole courant, donc le cas est supportable — il n'est pas prouvé inoffensif,
et chaque acceptation non exacte s'imprime au journal avec les deux noms.

### Et le geste qui en sort : une propriété, pas une énumération

La question à poser en écrivant une garde n'est donc plus seulement « qu'est-ce qu'elle
laisse passer ? » mais **« sur quels cas légitimes va-t-elle tomber ? »** — et si la
réponse est « le cas courant chez un utilisateur », la garde est déjà morte. Une porte de
sortie n'y suffit pas : c'est elle qu'on prendra, une fois, définitivement.

La sortie est la même que pour la règle 8 : remplacer l'égalité littérale par la
**propriété** qu'on voulait vraiment tester. Ici, « les deux chaînes sont-elles
identiques ? » est devenu « les deux noms désignent-ils le même instrument ? », et la
porte `InpSymboleLibre` est redevenue ce qu'elle aurait toujours dû être : un dernier
recours que personne n'a de raison d'actionner.

## Une garde d'étanchéité se pose à la frontière d'ÉCRITURE

C'est la leçon d'un aller-retour, et elle vaut au-delà de ce chantier. La première garde
vérifiait que le **générateur** n'écrit nulle part : elle passait, et la fuite était chez
le **consommateur** — `ecrireCouv` réécrivait la carte de couverture qu'il venait de lire,
séries d'exemple comprises. *La carte lue est celle qu'on réécrit.* Un producteur propre
ne prouve rien sur ce que le reste du programme fait de ce qu'il produit.

Le refus vit donc **au seul endroit par lequel une série entre dans le stockage** —
`garderSerie`, avant que la clé ne soit construite — et à la seconde frontière qu'est
`noterCouv`. Posé là, il vaut pour les trois espaces étanches (`.perso`, `.client`,
`.essai`) et les cinq comptes sans qu'on ait à les énumérer.

`scripts/app/etancheite-exemples.test.mjs` fait tourner **le vrai code** contre un faux
stockage, dans les trois espaces.

**Troisième occurrence, et c'est elle qui donne son nom à la figure : `deposes`.** Le
correctif d'un chemin — `reprendreSeries` cessant d'emporter les dix séries d'exemple —
laissait **cinq autres écritures** libres de refaire la même faute, et l'une d'elles la
faisait déjà : une purge de place remettait `deposes` à vide, alors que ces séries ne sont
écrites nulle part et ne libèrent pas un octet. La garde écrite pour l'occasion, « les
exemples survivent à une série à soi », éprouvait **le chemin réparé**.

> **Une garde sur un chemin ferme un CAS ; une porte unique ferme la CLASSE.**

Les six écritures passent donc par `deposesApres`, et la porte **décide sur un résultat** :
elle ne demande à personne « faut-il garder les exemples ? » — un drapeau rouvrirait le trou
au premier appelant qui l'oublie — elle regarde ce qui est vrai, les séries d'exemple
effectivement posées dans `this.dfs`. `poserExemples` les y met avant d'appeler ;
`retirerExemples` les en retire avant d'appeler ; les quatre autres n'ont rien à savoir.

La seule écriture qui ne passe pas par elle, `ETAT_DERIVE` au changement de compte, est
**déclarée comme exception et vérifiée** : le test lit que `reprendreSeries()` la suit et
repose les dix, plutôt que de le croire.

**La sonde d'idempotence** passe la migration **deux fois** et compare le stockage entier
entre les deux passages : le second ne doit rien retravailler, ni rebalayer les blocs de
bougies. Une troisième sonde pose la marque d'avance et vérifie que la migration n'entre
même pas — elle a fait son office une fois, elle ne surveille pas le stockage à vie.

> **Une garde doit échouer quand son HYPOTHÈSE cesse d'être vraie, pas seulement quand le
> code est faux.** Une garde qui perd sa prise doit tomber, pas passer au vert : sinon
> elle devient aveugle sans rougir, et c'est le pire mode de panne — on croit être
> couvert par une garde qui ne regarde plus rien.

**Toute garde qui protège une frontière se vérifie par MUTATION.** On l'écrit, puis on
casse le code exprès et on vérifie qu'elle tombe. Sans ça, on a écrit un commentaire
exécutable — c'est précisément pourquoi la garde du générateur passait pendant que la
couverture fuyait. Vérifié ici : désancrer la sélection des clés, retirer la lecture de la
marque, retirer le refus de `garderSerie`, ou décider du repli de l'indicateur avant le
relevé font tomber chacun le test correspondant.

### La mutation ÉPROUVE ; ce qui CONSTRUIT, c'est « la borne coupe, puis on vérifie ce qu'elle a coupé »

Ce n'est pas une règle de plus : c'est la règle 2 vue depuis l'écriture au lieu de la
vérification. La mutation dit *après coup* qu'une garde est aveugle ; cette formule-ci
l'empêche *pendant* qu'on l'écrit.

**Trois formes de garde aveugle en un seul chantier, et c'est ce qui les réunit qui
compte** — dans les trois, une assertion passait sans que rien ne soit regardé :

| La forme | Comment elle devient aveugle | Ce qui la ferme |
|---|---|---|
| **la tranche à −1** | `indexOf` rend −1, qui est une borne VALIDE pour `slice` : le motif disparaît et la tranche s'élargit en silence, jusqu'au fichier entier | `borne()`/`borneArriere()`, qui **jettent** en nommant le motif perdu |
| **la garde vacue** | son sujet a été supprimé ; elle reste verte en ne gardant plus rien | la règle 14 : partir avec le geste, se réancrer, ou s'ancrer sur l'absence |
| **l'assertion creuse** | sa condition ne MORD pas sur le décor : elle passe avec ou sans le code qu'elle vérifie | prouver que la condition mord, **avant** de vérifier son effet |

La troisième est la plus récente, et elle est passée sous mutation. Elle bornait une
découpe au 1ᵉʳ janvier 2021 ; l'amorce de 400 jours reculait la borne à novembre 2019,
donc **aucune bougie n'était coupée** et l'assertion sur ce qui restait passait dans les
deux sens. Corrigée sur une borne de fin, elle exige maintenant d'abord que la coupe ait
lieu — `d3.ecT.length > 0 && d3.ecT.length < df.ecT.length` — et seulement ensuite que ce
qui reste soit du bon côté.

> **La borne coupe, PUIS on vérifie ce qu'elle a coupé.** Et l'énoncé vaut au-delà des
> dates : toute assertion qui décrit l'effet d'une condition doit d'abord établir que la
> condition s'est appliquée. Sans ce premier temps, on mesure le décor.

#### Et une mutation ROUGE ne prouve pas que la BONNE assertion a mordu

Le dépôt connaissait deux façons pour une mutation de mal renseigner : elle ne tombe pas
alors que la garde est bonne — l'échange était **inerte**, et `lecture-ambigue` a fait
passer sa garde pour aveugle deux fois avant qu'on relise ; ou elle tombe et la garde
est bonne. Il en manquait une troisième, et elle est plus sournoise que l'inerte :

> **Une mutation qui fait rougir une garde VOISINE prouve seulement qu'une garde
> regarde — pas que la bonne regarde.** C'est le pendant exact de la mutation qui ne
> tombe pas : là on croit la garde aveugle alors qu'elle voit ; ici on la croit
> clairvoyante alors que l'assertion qu'on prétendait éprouver n'a jamais tourné.

**Deux fois dans la même séance**, et les voici plutôt qu'un compte :

| la mutation posée | ce qui a mordu | ce qu'on croyait éprouver |
|---|---|---|
| la ligne de filtre du lecteur remplacée par une liste de noms | « le lecteur ne passe plus par la porte unique » — la mutation avait aussi **retiré** l'appel au motif | « des noms de fichiers sont ÉCRITS dans le lecteur » |
| l'instant de lecture remplacé par un écart relatif | « l'instant n'est pas rendu » — la forme `relu à HH:MM` avait **disparu** | « l'instant de lecture est RELATIF » |

Dans les deux cas la suite était rouge, la restauration rendait le vert, et le rapport
aurait pu s'arrêter là. Dans les deux cas **l'assertion sous épreuve n'avait pas été
exécutée une seule fois** — et l'une d'elles était fausse, ce qu'a montré la mutation
refaite : « aucun *il y a* suivi d'un chiffre » laisse passer `il y a −582 min`.

**Le geste qui ferme ça ne coûte rien, et c'est le même que pour l'inerte : LIRE.** Une
mutation ne se juge pas sur la couleur de la suite mais sur le MESSAGE d'échec — s'il ne
nomme pas l'assertion qu'on visait, la mutation a raté sa cible, pas la garde. Et le
remède est d'écrire une mutation qui ne touche QUE le fait visé : ajouter la liste **à
côté** de la porte au lieu de la remplacer, ajouter l'écart **à côté** de l'heure au lieu
de la remplacer. *Une mutation trop large est une mutation qui ne dit pas ce qu'elle
mesure.*

##### Et les deux modes n'ont pas le même COÛT — c'est ce qui décide lequel rouvrir

Relire chaque message est le geste juste, et il arrive qu'on ne le fasse pas. Alors
l'ordre compte, et il est contre-intuitif :

| le mode | ce qu'il produit | ce qu'il coûte |
|---|---|---|
| **l'inerte** (mutation VERTE) | on doute d'une garde saine | une enquête — cher en temps, **rien ne part** |
| **la voisine** (mutation ROUGE) | on croit bonne une garde fausse | **on livre** |

> **L'inerte se paie en heures, la voisine se paie en production.** Et l'asymétrie n'est
> pas un hasard : l'inerte est AUTO-LIMITANTE — elle fait chercher davantage ; la voisine
> est AUTO-DISSIMULANTE — elle fait cesser de chercher. Un mode de panne qui éteint
> l'enquête coûte toujours plus qu'un mode qui la déclenche.

**Donc, à message d'échec non relu, c'est la mutation ROUGE qu'il faut rouvrir, pas la
verte.** Le réflexe va dans l'autre sens — une mutation verte inquiète, une rouge
rassure — et c'est précisément ce qui rend la règle utile.

La séance en porte la preuve chiffrée : sans la mutation rouge rouverte, « aucun *il y a*
suivi d'un chiffre » partait en production, et l'écran aurait pu afficher
**« il y a −582 min »** sous une garde verte.

###### Et l'énoncé déborde les mutations : ce qui coûte, c'est ce qui ARRÊTE DE CHERCHER

« Auto-limitante » contre « auto-dissimulante » explique l'asymétrie au lieu de la
constater — et une explication, contrairement à un constat, se transporte. Relus
ensemble, trois défauts que ce fichier tenait pour distincts disent une seule chose :

| le défaut | ce qu'il a coûté | ce qu'il a ÉTEINT |
|---|---|---|
| **457 tests verts pendant la page blanche** (« Seul le rendu prouve… ») | des semaines | la suite CERTIFIAIT : il n'y avait pas de raison de regarder l'écran |
| **« Activez le bouton Algo Trading »** sur trois causes (« le pli du panneau ») | l'utilisateur clique, revient, dit « le robot ne démarre pas » | le conseil a la forme d'une réponse : on ne cherche plus la cause |
| **la mutation voisine** (ci-dessus) | une garde fausse livrée | la suite est rouge, donc la garde est éprouvée — le message n'est pas lu |

> **Un mode de panne qui éteint l'enquête coûte toujours plus qu'un mode qui la
> déclenche.** Ce qui coûte n'est pas l'erreur — c'est qu'elle ait la forme d'une
> réponse. Un vert, un conseil, un rouge attendu : les trois rassurent, et c'est la
> seule chose qu'ils ont en commun.

**Et l'inverse est déjà écrit dans ce fichier, en trois endroits où ça a SERVI** : le
runtime qui criait `never resolved` sept fois à chaque chargement, les six jalons
d'initialisation dont le SILENCE a renvoyé la recherche hors du robot, et
`vuna:reprendreSeries 0 série` qui a dit que c'était la SONDE qui avait tort. Les trois
ont déclenché une recherche au lieu de la clore.

D'où un critère qui se pose **en concevant**, pas en autopsiant : *quand une chose peut
être fausse, préférer la forme qui fait chercher à la forme qui fait s'arrêter.* C'est
ce qui a décidé, dans la même séance, qu'un bloc sans poignée de dossier dise « je n'ai
pas regardé » plutôt que « aucun trade réel » — le second est une réponse, et il est
faux.

**Et ce sont les trois inverses qui rendent le critère tenable, pas la règle** : ils
montrent que la forme est un CHOIX. Un avertissement de runtime, un jalon qui se tait,
une marque posée dans le produit n'étaient pas des heureux hasards — quelqu'un les a
écrits de cette façon-là. Sans eux, « ce qui coûte, c'est ce qui arrête de chercher »
décrirait une fatalité, et une fatalité ne se corrige pas.

**PROVENANCE DE CE CRITÈRE, parce qu'elle change ce qu'il vaut** : il a été appliqué
avant d'être nommé, dans le commit même qui a produit sa dernière instance. Il n'a donc
pas à être adopté — il est relevé. C'est la différence entre une règle lue sur la
pratique et une règle prescrite à la pratique, et ce fichier n'a de valeur que pour la
première : toutes ses règles viennent d'un défaut réel, et celle-ci vient d'une
habitude réelle, ce qui est la même exigence vue du bon côté.

**Le dépôt en portait déjà des instances sans les avoir reliées** — c'est en les relisant
ensemble qu'on voit qu'elles disent une seule chose :

- `echelle-des-prix` exige `n > 50` trades à chaque échelle avant de comparer les
  comptes — « une garde qui compte zéro ne garde rien » ;
- la tournée des gestes tombe sous quinze éléments cliquables par vue, plutôt que de
  laisser passer un zéro qui n'a rien regardé ;
- `sautesVues` est la prise du zéro de `sautesSortie`, et `cachesVues` celle de
  `cachesStop` — un compteur à zéro sans dénominateur a deux sens ;
- `cachesDispo` distingue « mesuré à zéro » de « pas mesurable sur cette série ».

Les quatre premières vivent dans des tests, la dernière dans le produit. **C'est la même
exigence des deux côtés, et c'est ce qui la rend générale** : une sonde prouve sa prise
avant de rapporter, qu'elle rapporte à un test ou à un utilisateur.

### On interdit le code, pas le récit du code

C'est le piège de **toute garde qui lit du source**, et il s'est présenté trois fois en une
séance : l'analyseur de gabarit empilait un `<select>` cité dans un commentaire ; une garde
sur `calcRegime` échouait sur son propre commentaire, celui qui nomme `this.essai` pour
raconter l'erreur ; et la garde d'écriture du générateur tombait sur le nom d'une fonction
cité dans une note.

Le commentaire qui raconte une garde précédente la **nomme** — c'est son travail.

**LA CONCLUSION N'EST PAS « AJOUTER LE MOTIF SUIVANT ».** Le remède naïf est de dépouiller
les commentaires par expression régulière, puis d'en ajouter une à chaque échec : `//`,
puis `/* */`, puis `{/* */}`. Chaque langage apportera sa syntaxe, et la course est perdue
d'avance — on ne découvre le motif manquant qu'en tombant dessus.

**Une garde qui lit du source s'ancre sur une forme que la prose ne peut pas imiter** : une
structure, un marqueur explicite, un compte de nœuds. Pas un motif de commentaire.

Et on peut se tromper de forme une fois de plus. Un analyseur qui suivait les balises JSX
a paru être la réponse — jusqu'à ce qu'il faille lui apprendre qu'un `a < b` n'est pas une
balise, puis qu'un `=>` dans un attribut n'est pas la fin d'une balise. La même course, un
étage plus haut. **La forme retenue est la plus pauvre et la plus sûre : la chaîne de
caractères.** Un commentaire n'en est jamais une, quelle que soit sa syntaxe, et
reconnaître une chaîne ne demande de comprendre aucun langage.

> **Quand une garde demande un correctif de plus, changer de forme — pas ajouter un
> motif.** Le deuxième rustine est le signal ; le troisième est déjà trop tard.

#### Deuxième compteur de délimiteurs écrit à la main, deuxième échec

L'analyseur JSX avait déjà montré la limite : il fallait lui apprendre qu'un `a < b`
n'est pas une balise, puis qu'un `=>` dans un attribut n'est pas une fin de balise.
`bornes-de-tranche` a refait la même chose avec les parenthèses — et cette fois le coût
n'était pas un motif de plus, c'était un **faux refus sur le cas normal**.

Son repérage comptait les `(` et les `)` pour délimiter les arguments d'un `slice(`.
Il comptait aussi ceux qui vivent **dans une chaîne**. La borne
`borne(COMPARER, "export function euroParR(")` — parfaitement correcte, et la forme même
que la garde recommande — porte une parenthèse ouvrante non refermée dans un littéral :
le compteur partait en vrille, avalait les lignes suivantes, y trouvait un `indexOf` sans
rapport, et **accusait la convention qu'il existe pour imposer**.

> **Un compteur de délimiteurs écrit à la main ne sait pas ce qu'est une chaîne, et la
> prochaine chaîne portera le délimiteur.** C'est la règle 3 retournée : la garde
> échouait là où la prose ne l'avait pas trompée — c'est du CODE qui l'a trompée, parce
> qu'elle n'en comprenait pas assez.

La sortie est celle qui est écrite depuis le début — **changer de forme, pas ajouter un
motif** —, et le seuil de la règle 16 la rendait non négociable : une garde qui refuse la
forme qu'elle prescrit se fait désactiver. La prise est désormais l'**AST** (espree),
celle de `portee-script` et de `refus-export-parle` : un appel `.slice(…)` dont un
argument contient un appel `.indexOf(…)`. Une parenthèse dans une chaîne n'existe plus
pour elle, et il n'y a plus de grammaire à réapprendre au coup par coup — l'analyseur la
connaît déjà. Vérifié par mutation : une borne remise en `indexOf` en ligne la fait
tomber, en nommant le fichier et la ligne.

**Et elle ne saute pas quand elle ne sait pas lire.** Un fichier qu'espree refuse lève,
avec la raison — le taire la rendrait aveugle sur ce fichier sans rougir, ce qui est
exactement le mode de panne que ce fichier existe pour interdire. Un shebang devient un
commentaire de **même longueur**, pour que les numéros de ligne rapportés restent ceux du
fichier.

#### Cinq morsures plus tard : le point commun n'est pas le motif, c'est la PREMIÈRE OCCURRENCE

Le seuil disait « le deuxième rustine est le signal » — on en est à la cinquième morsure,
et chaque remède a été local : dépouiller `//`, puis `/* */`, puis `{/* */}`, changer de
forme pour la chaîne de caractères, puis réancrer la garde du manifeste. Relues ensemble,
elles partagent autre chose que la syntaxe des commentaires : **quatre sur cinq
cherchaient « la première apparition de X »** — et la première apparition de X est
presque toujours dans le commentaire qui explique X, **parce qu'un correctif s'explique
au-dessus du code qu'il corrige**. La note de `champsSession` citait `'familleFiltre'`
qu'elle venait de retirer ; le commentaire de `publier-solo` citait « 260913.x » au-dessus
de l'écriture du manifeste. La prose précède le code par construction : chercher la
première occurrence, c'est chercher la prose.

> **Une garde qui lit du source s'ancre sur ce qui AGIT — un appel, une affectation, une
> déclaration — jamais sur un nom de fichier ou une chaîne qui peut vivre dans de la
> prose.** `writeFileSync(path.join(path.dirname(SORTIE), "version.json")` ne peut pas
> apparaître dans une explication sans être du code ; `'version.json'` seul, si.

Ce n'est pas une règle de plus, c'est le critère d'ancrage de celle-ci : la forme que la
prose ne peut pas imiter était déjà l'énoncé — un appel complet, avec ses parenthèses et
ses arguments, est la plus courante de ces formes, et la plus courte à écrire.

**Sixième morsure, et le critère d'ancrage ne pouvait pas la couvrir** : la découverte de
`nom-vuna` a attrapé `nom-genere.test.mjs` — la garde qui cherche l'ancien nom dans le
source émis, et qui doit donc l'épeler pour le chercher. La prose n'était pas un
commentaire, c'était le **motif de recherche lui-même**. C'est la limite de la règle :
**une garde qui cherche une chaîne interdite s'exclut elle-même de la découverte,
explicitement et avec sa raison** — comme `stockage-plein.test.mjs`, qui sème l'ancien
préfixe pour éprouver la migration. L'exclusion nominative n'est pas un périmètre qui
revient : elle ne retire qu'un fichier dont l'interdit est le sujet.

### Une grille dont le nombre de colonnes porte du sens s'ÉCRIT, elle ne se calcule pas

Les quatre gestes MT5 se lisent **par rangs** : deux et deux. Confiés à `auto-fit`, ils ont
été placés en **trois** colonnes sur un écran large — le navigateur a fait son travail, il
ne pouvait pas savoir que le nombre portait du sens.

C'est la même famille que déléguer une décision à un motif : un algorithme de placement
optimise l'occupation, pas la lecture. Quand le compte de colonnes dit quelque chose, il
s'écrit (`repeat(2, …)`), et le repli en une colonne se demande explicitement par une
requête de média. `auto-fit` reste le bon outil quand le nombre n'a **pas** de sens — une
liste de cartes équivalentes.

**Et une forme pauvre a un angle mort qu'il faut garder, pas taire.** Le texte écrit en
clair entre deux balises JSX n'est pas une chaîne : les gardes ne le verraient pas, et
elles ne le diraient pas — le pire mode de panne. Une garde supplémentaire vérifie donc que
la copie commerciale vit bien dans des littéraux, et **échoue à la place des autres** le
jour où ce ne sera plus vrai.

**Une garde de convention doit ENSEIGNER la convention, pas signaler un écart.** Celle-là
impose une façon d'écrire : quelqu'un rendra `<p>Texte</p>` de bonne foi et la verra tomber
sans comprendre. Son message dit donc, en toutes lettres, ce qui vient d'arriver, *pourquoi
ça compte* — les six autres gardes deviendraient aveugles sans rougir — et *quoi écrire à
la place*. Une garde de convention dont le message n'enseigne rien est un piège pour le
prochain.

### Une phrase qui ENGAGE s'ancre sur un nom, pas sur son texte

C'est la conclusion de la règle 3 poussée d'un cran : une forme que **ni la prose ni le
balisage** ne peuvent défaire.

Une garde de proximité — *là où le tarif est promis gelé, la pièce qui le prouve doit être
nommée* — a été défaite deux fois sans mauvaise foi : par le **formatage**, un `<strong>`
au milieu fragmentant la phrase ; et par la **tournure**, « ne jamais remonter votre
tarif » ne correspondant pas au motif « ne remonte pas ». Les phrases qui engagent vivent
donc dans une **constante nommée** (`TARIF_GELE`, `mentionLancement`), que la garde lit par
son nom. Le rendu peut être mis en forme comme on veut autour.

**Avec un trou que l'ancrage par nom ouvre, et qu'il faut fermer** : recopier la phrase en
clair dans le rendu en laissant la constante derrière laisserait la garde verte sur un
texte que plus personne n'affiche. Elle vérifie donc aussi que la constante **est rendue**.

#### La fragmentation en littéraux est revenue deux fois — et la sortie est écrite d'avance

`parNom` lit **le premier littéral** de la déclaration, et rien de plus. Une phrase écrite
en morceaux concaténés lui livre donc son début et lui cache sa fin — c'est-à-dire, deux
fois sur deux, **la preuve, qui vient après la promesse** :

| | Ce que la garde lisait | Ce qui lui restait invisible |
|---|---|---|
| `mentionLancement` | « Tarif de lancement — garanti tant que… » | « …inscrit sur votre facture » |
| `SANS_COMPTE` | « …aucun compte à créer. » | « …il reste la facture et son registre » |

Les deux fois, le remède a été de **réécrire la phrase en un seul littéral** — aujourd'hui
avec un `// prettier-ignore`, parce que la ligne dépasse la largeur du formateur.

**Ça tient par discipline, et il faut le savoir.** Rien n'empêche quelqu'un de couper la
phrase de bonne foi : un formateur, une relecture, une insertion. **Si le cas revient une
troisième fois, la conclusion n'est pas un troisième `prettier-ignore` — c'est que `parNom`
doit concaténer les littéraux adjacents avant de lire.** C'est encore *changer de forme
plutôt qu'ajouter un motif* : la prise cesse d'être « le premier littéral » pour devenir
« tout ce que la déclaration produit », et la façon dont elle est coupée cesse d'exister
pour la garde.

On ne le fait pas avant, parce que deux occurrences se réparent moins cher qu'elles ne se
généralisent — mais le seuil est posé, et il se reconnaîtra.

### Une affirmation sur un fichier se relit avant d'être rapportée

Un commentaire a été annoncé comme écrit alors que le script qui le posait s'était arrêté
sur une substitution précédente **sans rien enregistrer**. Le rapport décrivait un fichier
qui n'existait pas.

« Les tests ne pouvaient pas l'attraper » n'est pas le bon diagnostic. **Une affirmation
sur le contenu d'un fichier est une affirmation sur le disque**, et elle se revérifie par
une lecture — jamais sur l'intention d'avoir écrit. Un script qui enchaîne des
substitutions et s'arrête au milieu ne laisse aucune trace : il faut relire ce qu'on
prétend avoir posé, avant de le dire.

### Quand l'explication doit contredire l'étiquette, c'est l'étiquette qui est le défaut

Une étiquette est **actionnable par construction**. « Périmée » veut dire *refais ton
export* ; sur une série d'exemple il n'y a pas d'action, et à partir du 27 octobre 2026 il
y en aurait eu dix, sur le premier écran, pour toujours — toute capture faite après cette
date montrant dix alertes que personne ne peut lever. Un premier correctif avait gardé le
mot en ajoutant « il n'y a rien à réexporter » juste en dessous : c'était le signal.

Le verdict devient donc **« fenêtre fixe »**, qui enseigne la même chose avec les dates à
côté — qu'une série a une fenêtre et qu'un scan s'arrête à sa fin. Ce qu'un export oublié a
de particulier, c'est qu'on peut le **refaire**, et c'est précisément ce que l'exemple ne
partage pas. Le seuil, lui, n'est **pas** exempté : `vieux` ne pilote que l'étiquette, une
phrase et deux encres — aucun comportement — donc c'est le verdict qui change, pas la
mesure. Les deux encres d'alerte suivent le verdict (`vieux && !estExemple(sel)`), sans
quoi les dix porteraient la couleur d'alerte sans porter le mot.

### Une marque temporaire est reliée à la condition qui la justifie

Une marque — « À COMPLÉTER », « à trancher », « provisoire » — dit *ne me prends pas pour
du texte relu*. Elle est vraie le jour où on l'écrit. Elle ne le reste que tant que la
raison de son existence tient, et **rien, dans son écriture, ne la fait tomber quand cette
raison disparaît**. Elle devient alors une consigne périmée : elle a l'autorité des vraies
et n'a plus de contenu.

C'est **la même famille que « `_ds/` n'est pas dans le dépôt »**, restée en place après que
le problème eut été réglé, et qui envoyait chercher une panne qui n'existait plus. La
différence tient en un mot : là c'était de la **vigilance** — quelqu'un devait penser à
relire —, ici c'est de la **construction**.

Le cas réel : l'accueil annonce quatorze jours de rétractation ; le chemin de paiement fait
renoncer l'acheteur à ce droit. Laquelle cède dépend d'un arbitrage juridique en cours. La
phrase de l'accueil est donc marquée par son nom — `RETRACTATION_A_TRANCHER` — comme le
libellé du renoncement l'est par son texte, `RENONCE_TXT = 'À COMPLÉTER…'`.

**Et les deux marques sont liées par une garde.** Elle lit `RENONCE_TXT` : tant qu'il porte
son « À COMPLÉTER », elle exige la marque de l'accueil ; **le jour où il ne le porte plus,
elle échoue** et redemande de trancher la phrase de l'accueil. La condition qui justifie la
marque est devenue la condition qui la tient en vie.

> **Une marque temporaire qu'aucune garde ne relie à sa condition est un commentaire
> permanent.** Écrire la marque est la moitié du geste ; écrire ce qui la retirera est
> l'autre.

Le piège que ça fermerait mal se voit dans la garde elle-même : la branche « la condition a
disparu » ne passe pas en silence, elle appelle `assert.fail` avec les deux issues
possibles écrites en toutes lettres. Une garde qui deviendrait vide se tairait ; celle-là
parle.

### La surface se découvre, elle ne s'énumère pas

Une garde a un **périmètre** : les fichiers qu'elle lit. Écrit à la main, ce périmètre est
une hypothèse — et comme elle n'est écrite nulle part, personne ne la révise. Le jour où
elle cesse d'être vraie, **la garde ne tombe pas : elle reste verte en ne regardant plus
qu'une partie de la surface.** C'est la règle 2 appliquée au périmètre plutôt qu'au code.

La même garde l'a fait **deux fois de suite**, et c'est ce qui rend le cas instructif :

| Périmètre | L'hypothèse, jamais écrite | Ce qui lui échappait |
|---|---|---|
| `tarifs.tsx` | « les promesses de vente vivent sur la page de vente » | l'accueil, qui garde un résumé des trois formules, promettait encore « rien n'est conservé sur vous, pas même votre achat » |
| `src/routes/` | « les promesses vivent dans les routes » | `SiteFooter`, dans `src/components/`, porte l'avertissement de risque — **rendu sur toutes les pages du site** |

**Corriger le premier périmètre en en écrivant un second, c'est déplacer le défaut, pas le
fermer** — exactement ce que `this.essai` → `aMoi` avait fait un chantier plus tôt. La
sortie n'est pas de remonter d'un cran : c'est de **retirer le périmètre**. Tout `src/` est
lu, récursivement. Le code moteur n'a aucune raison de porter une promesse commerciale, et
s'il finit par en porter une, c'est précisément ce qu'on veut voir.

**La preuve qu'il fallait est une mutation qui n'énumère rien** : on crée une route neuve
portant une promesse absolue, et la garde l'attrape sans que ce fichier ait été nommé nulle
part. Une garde par liste ne peut pas passer cette épreuve — c'est ce qui distingue une
découverte d'un périmètre simplement plus large.

**Et la découverte se garde elle-même.** Elle vérifie qu'elle atteint toujours les deux
fichiers d'où le défaut est venu ; si elle ne les atteint plus, c'est qu'un périmètre est
revenu, et elle le dit.

#### Et la surface déborde du dépôt — on déplace la source, on n'invente pas une garde

La découverte atteint tout ce qui est versionné. **Les phrases qui engagent le plus n'y
seront pas**, et elles se répartissent en deux familles que rien ne distingue du point de
vue d'une garde :

| | Ce que c'est | Ce qui les rend dangereuses |
|---|---|---|
| **La vente** | le libellé de l'article de chaque lien de paiement — celui qui porte le renoncement —, la description de la facture, le courriel de confirmation qui porte le lien de gestion | recopiées **une fois** dans un tableau de bord, puis plus jamais relues |
| **L'après-vente** | le renvoi d'une clé perdue, la réponse à une demande de remboursement | **réécrites à chaque demande**, à la main, sans version ni diff ni relecture |

**Le module a failli s'appeler « les textes de Revolut », et c'était nommer un LIEU au lieu
d'une PROPRIÉTÉ** — la moitié du sujet serait restée dehors. Ce qui les réunit, c'est que
chacun **engage** et qu'aucun n'est **atteignable par une garde**, parce qu'il est recopié à
la main. La seconde famille est la plus exposée des deux : une dérive y est invisible
jusqu'au jour où deux clients comparent ce qu'on leur a répondu.

**Le remède n'est pas une garde, c'est un déplacement de la source.** Ces textes sont
écrits dans le dépôt — `src/lib/textes-recopies.ts` — et le tableau de bord comme la boîte
de courrier n'en sont que le **miroir recopié**. Ils redeviennent alors lisibles comme
n'importe quelle autre phrase : ils sont dans `src/`, dans des chaînes, et les gardes les
voient sans qu'on ait rien à leur apprendre. Une divergence cesse d'être muette.

> **Ce qu'on ne peut pas vérifier, on fait en sorte qu'il n'y ait rien à inventer quand on
> le recopie.**

**Le module est vide, et il est marqué** (`EN_ATTENTE_DU_STATUT`) : la formule du
renoncement, la forme de la facture et l'identité du vendeur dépendent de l'arbitrage en
cours. Y écrire une formule plausible serait **pire que ne rien écrire** — elle aurait
l'autorité du dépôt sans avoir été relue, et serait recopiée telle quelle. **La case vide
est plus honnête que la case vraisemblable**, et un test la tient.

Quatre choses le tiennent :

- **un libellé par plan**, et les plans sont **lus dans l'application** : ajouter un
  cinquième plan là-bas fait tomber le test ici, en nommant la constante qui manque ;
- **tout texte déclaré est inscrit dans la liste à plat** — sinon il échappe à la marque et
  aux gardes, et partirait sans avoir été relu ;
- **la marque est reliée à sa condition** (règle 6) — tant que `RENONCE_TXT` porte son
  « À COMPLÉTER », les textes portent le leur ; le jour où il ne le porte plus, le test
  échoue, dit quoi remplir et où le recopier ;
- **le module est dans la surface découverte** : une promesse fausse écrite dedans est
  attrapée par les gardes ordinaires, sans que ce fichier soit nommé nulle part.

**Et la consigne de recopie ne vit qu'ici.** Elle n'est pas doublée dans PASSATION.md :
deux copies divergent, et la divergence est muette. Portée par la garde, elle arrive au
seul moment où elle sert — quand la marque tombe — et **elle ne peut pas être périmée,
puisqu'elle n'existe qu'au moment d'agir**.

**La partie énumérée est nommée comme telle.** Les quatre libellés d'article se dérivent ;
les quatre autres textes n'ont aucune source dont les dériver — chercher un mot dans la
prose de `/tarifs` pour conclure qu'un texte existe serait la règle 1 exactement. Ils sont
donc listés, et le test **écrit son propre angle mort** : un cinquième texte d'après-vente
naîtrait hors de portée de cette liste — voir la règle 9, qui est née là.

#### Une découverte lit ce qui EST son sujet, pas un voisin commode

C'est une précision au critère de la règle 7, de la même forme que le critère d'ancrage
ajouté à la règle 3 : la règle était juste, c'est le **point d'attache** qui manquait de
critère. La dérivation des libellés d'article découvrait bien — aucune liste, un
cinquième plan attrapé tout seul — mais elle lisait `const LIENS`, une structure qui
appartenait à **l'achat**, pas à la facturation. Une source empruntée à une autre
affaire : supprimer l'achat lui a retiré ses dents **sans qu'une ligne d'énumération
n'ait bougé**.

> **Une découverte qui lit un voisin commode hérite silencieusement de la durée de vie
> de ce voisin.**

Et la garde a eu la bonne fin — elle est **tombée** au moment où son hypothèse a cessé
d'être vraie, au lieu de passer au vert sur du vide : c'est la démonstration que les
règles 2 et 7 marchent ensemble. Réancrée depuis sur ce qui EST son sujet : les durées
payantes viennent de ce qui vend (`/tarifs`), les phases de la matrice du module des
textes — leur seule source restante, l'angle mort déclaré sur place.

### Un nom de LIEU fixe un périmètre ; un nom de PROPRIÉTÉ en découvre un

C'est **la règle 7 vue depuis l'amont** — non plus au moment où l'on écrit le périmètre,
mais au moment où l'on **nomme la chose**. Et c'est elle qui explique pourquoi les deux
premières tentatives étaient des impasses : `tarifs.tsx` puis `src/routes/` sont **deux
lieux**. Un lieu se déplace ; il ne se généralise pas. Aucune des deux corrections ne
pouvait mener ailleurs qu'à un troisième lieu.

Le même mouvement s'est rejoué sur le module des textes hors dépôt, et **le nom était le
symptôme** : il a failli s'appeler « les textes de Revolut ». Revolut est un lieu, et la
moitié du sujet — l'après-vente, réécrite à la main dans une boîte de courrier — serait
restée dehors sans que rien ne le signale. Nommé par sa **propriété** — *ce qui engage et
qu'aucune garde n'atteint, parce que c'est recopié à la main* —, le module a immédiatement
désigné ce qui lui manquait.

> **Quand un nom désigne un endroit, demandez ce que les choses qui y vivent ont en
> commun.** La réponse est le vrai nom, et elle découvre ce que l'endroit cachait.

Le test se fait à voix haute : un nom de propriété permet de dire « ceci en est un / ceci
n'en est pas un » sans regarder où la chose se trouve. Un nom de lieu ne le permet jamais.

#### Et un SECOND test, celui-là rétrospectif : une classe bien nommée ABSORBE

Le test à voix haute se fait avant d'écrire ; il dit si le nom désigne une propriété, pas
si c'est la BONNE. Une propriété peut être vraie et trop étroite — et elle a alors
exactement l'air d'une classe, puisqu'elle en a la forme.

Le second signal arrive après, et il ne coûte rien : **une classe correctement nommée
attire à elle une règle qui traînait à côté sans qu'on ait cherché à l'y mettre.** Le cas
mesuré est le renommage de la règle des nombres en apposition. Trois renommages successifs
— ordinal, puis nombre en apposition, puis nombre OU QUANTIFICATEUR en apposition — et
seul le troisième a rencontré un voisin : « un “seul” se périme sans bruit : compter, pas
jurer », écrite le 13 septembre (relu dans l'historique, `f359b42`) après un « le seul
date-contre-aujourd'hui du fichier » qui en cachait deux. C'est **un quantificateur en
apposition**, cinq jours avant l'ordinal, trouvé par un autre chemin.

> **Si un nom neuf n'absorbe rien, c'est probablement encore un lieu.** Un lieu plus
> large reste un lieu : il couvre plus de cas sans en expliquer aucun, donc il ne
> reconnaît pas ses parents. Une propriété, elle, les reconnaît — et ce qu'elle ramasse
> est la preuve qu'on a nommé le mécanisme et non son décor.

La conséquence pratique est un geste de fin de renommage, pas un de plus au début :
*après avoir renommé, chercher ce que le nouveau nom ramasse.* S'il ne ramasse rien, la
question « qu'est-ce que ces choses ont en commun ? » n'a pas encore reçu sa réponse.

##### Et l'absorption laisse DEUX entrées pour une règle — la tension est déclarée, pas réglée

Absorber n'a pas fusionné : « un “seul” se périme sans bruit » et « un nombre ou un
quantificateur en apposition se compte » vivent chacune dans leur chapitre, reliées par
un renvoi. **C'est exactement la forme que ce fichier interdit ailleurs** — la consigne de
recopie n'est pas doublée dans PASSATION.md, parce que *deux copies divergent, et la
divergence est muette*.

Ce qui la fait tolérer ici : ce ne sont pas deux copies d'un même énoncé, ce sont **deux
instances avec leur propre preuve** — un « seul » qui en cachait deux d'un côté, un
ordinal faux de deux de l'autre. Déplacer l'une priverait son chapitre de ce qui l'a fait
écrire, et un chapitre sans son cas fondateur redevient une consigne qu'on croit sur
parole.

**Mais le renvoi croisé n'a AUCUNE PRISE, et il faut le dire** : un renvoi est de la
prose, la règle 3 interdit d'y ancrer une garde, et rien dans le dépôt ne verra le jour
où l'une des deux sera reformulée sans l'autre. Seul un lecteur qui ouvre les deux
chapitres le verra — c'est-à-dire personne, la plupart du temps.

**Le seuil est donc écrit d'avance**, comme celui des statuts et celui de la
fragmentation en littéraux : *le jour où les deux énoncés cesseront de se paraphraser*,
la tolérance tombe — une seule des deux garde l'énoncé, l'autre devient un renvoi nu qui
ne porte plus que son exemple. On ne le fait pas avant, parce que deux instances valent
mieux qu'une pour comprendre une règle ; on le reconnaîtra parce que le signal est un
désaccord, pas une ressemblance.

#### Et la règle 8 s'applique aux GARDES : une classe fermée, une garde de classe

Deux fois dans la même journée, un correctif a fermé une **classe** et sa garde a été
posée sur un **lieu** :

| Le correctif, et ce qu'il fermait | La garde, et ce qu'elle gardait | Ce qui est resté ouvert |
|---|---|---|
| « aucun `ArrayFree` suivi d'un Copy* » | « les `.mq5` de la racine » | le robot, qui naît d'un générateur |
| « aucune attente qui se répète à l'identique » | `Export_H1_Vuna` | le cache d'agrégation du robot |

Les deux trous ont été trouvés par l'utilisateur, des heures plus tard, sur des pannes
coûteuses — un terminal mort, puis un cœur saturé pendant deux heures. Et les deux
auraient été fermés par le même geste, au moment du **premier** correctif.

> **Quand un correctif ferme une classe, la garde se pose sur la CLASSE — pas sur le
> fichier où elle est apparue.**

**Le signal est disponible au moment où l'on écrit la garde, et il tient en une
question : le correctif a-t-il un nom de classe ?** « Aucun `ArrayFree` », « aucune
boucle sans borne » sont des noms de classe. Alors la garde ne peut pas avoir un nom de
lieu — « les fichiers de la racine », « ce script-ci ». C'est la règle 8 retournée vers
l'outillage : on ne demande plus seulement « ce nom désigne-t-il un endroit ? » de ce
qu'on garde, mais de **la garde elle-même**.

La surface s'écrit alors une fois et se partage : `scripts/mt5/sources-mql5.mjs` rend
*tout source MQL5 que l'utilisateur peut faire tourner* — les scripts **livrés**,
découverts, et le robot **produit**, généré pour l'occasion. Le piège était qu'une
seule des deux familles a la forme d'un fichier : une découverte par extension ne
pouvait pas voir l'autre, et elle ne le disait pas.

**ET LA RÈGLE JOUE DANS LES DEUX SENS, ce qui s'est vérifié tout de suite.** Élargir la
surface a fait tomber une troisième garde du même fichier — celle qui interdit une
plage inversée (`t1 - 1 < t0`) — sur deux appels parfaitement sains du robot, qui lit
par NOMBRE et non par plage. Cet invariant-là n'est pas une classe : il ne vaut que
pour les lectures par plage. **Un invariant de lieu garde son lieu** — mais on ne le dit
pas non plus par un nom de fichier : on le dit par la propriété qui le rend applicable
(« l'appel passe-t-il deux dates ? »). Sinon on répare une énumération par une autre.

**Quand la classe ne se prouve pas par un critère, elle se tient par un REGISTRE.**
« Borné » n'est pas une propriété du texte : l'attente fautive bouclait sur
`while(GetTickCount() < fin && !IsStopped())`, bornée par le temps et défectueuse quand
même. `boucles-mql5.test.mjs` inscrit donc **chaque** boucle de la surface avec la
raison pour laquelle elle se termine, écrite en toutes lettres, et échoue **dans les
deux sens** — une boucle neuve jusqu'à ce que quelqu'un dise ce qui l'arrête, une entrée
dont la boucle a disparu pour que le registre ne devienne pas une liste de tolérances.
Son angle mort est déclaré : il relève les `while`, et la pire des deux pannes n'avait
**aucune boucle** — c'était une répétition par appel, tenue à part sur l'invariant
« la tentative est mémorisée ».

### Un angle mort qu'on ne peut pas fermer se déclare dans la garde elle-même

Les quatre libellés d'article se **dérivent** des plans de l'application : aucune liste,
donc aucune hypothèse. Les quatre autres textes n'ont **aucune source dont les dériver** —
la promesse de renvoi de clé vit en prose sur `/tarifs`, et chercher un mot dans de la
prose pour conclure qu'un texte existe serait la **règle 1** exactement, une intention pour
un résultat. Il fallait donc les énumérer, et une énumération a toujours un angle mort : un
cinquième texte d'après-vente naîtrait hors de portée.

**On ne pouvait pas le fermer sans commettre la règle 1. On l'a donc écrit** — dans le
commentaire de la garde, avec ce qu'il coûte et pourquoi il n'est pas refermable.

C'est la même exigence que l'angle mort déjà déclaré pour la forme « chaîne de caractères »
(le texte JSX nu, qu'une garde supplémentaire signale à la place des autres). Sans cette
déclaration, la prochaine personne lira une garde qui liste et croira lire une garde qui
découvre : **elle héritera d'une confiance qu'aucune mesure n'a méritée**, et c'est le pire
mode de panne — être couvert par une garde qui ne regarde plus ce qu'on croit.

> **Une garde qui énumère sans le dire finit par se lire comme une garde qui découvre.**

Et la conséquence pratique : un angle mort déclaré est un angle mort qui a une **date de
péremption**. Le jour où une source dont dériver apparaît, la note dit exactement quoi
remplacer. Un angle mort passé sous silence ne se rouvre jamais, parce que personne ne sait
qu'il est là.

#### La déclaration vit EN TÊTE de l'affirmation, pas en note sous elle

La règle ci-dessus a été appliquée à la lettre et n'a rien empêché. `init-sans-crash`
portait, dans sa note de règle 9 : « elle ne PROUVE pas le diagnostic et ne le prétend
pas ». Trois paragraphes plus haut, elle affirmait « CE QUI RESTE EST UNE INCOHÉRENCE
ENTRE DEUX FONCTIONS DU MÊME FICHIER ». La cause était fausse, la réserve était juste, et
c'est la cause qu'on a lue — pendant trois jours, jusqu'à ce que le journal du terminal
dise « disque plein ».

> **Une réserve placée sous une affirmation ne la tempère pas : elle la suit.** Ce qu'on
> retient d'un bloc de prose, c'est sa première phrase et son ton, pas sa dernière
> nuance. Déclarer l'angle mort quelque part dans la garde satisfait la règle 9 et rate
> ce qu'elle voulait.

**La forme retenue est une ligne de STATUT, première ligne du fichier, avant le titre.**
Deux valeurs, et elles se lisent d'un coup d'œil :

| La ligne | Ce qu'elle promet |
|---|---|
| `STATUT · CAUSE ÉTABLIE, MESURÉE` | la panne a été observée avant d'être corrigée — invariant ET cause tiennent |
| `STATUT · CORRECTIF DE FORME, CAUSE NON ÉTABLIE` | l'invariant vaut par lui-même ; la cause qu'on lui prêtait n'est pas prouvée |
| `STATUT · PANNE OBSERVÉE, MÉCANISME NON PROUVÉ` | la panne est un fait mesuré ; l'explication qu'on en donne est une hypothèse |
| `STATUT · INSTRUMENTATION, AUCUNE CAUSE PRÉTENDUE` | ça ne répare rien et n'explique rien — ça rend quelque chose décidable |

Les gardes du chantier MQL5 la portent, et c'est là qu'elle se lit le mieux :
`attente-sans-fin` et `boucles-mql5` en établie, `init-sans-crash` en forme,
`lecture-sans-crash` en panne observée, les six jalons du robot en instrumentation. Le
distinguo était dans les têtes de trois personnes ; il est dans les fichiers.

**LA TROISIÈME VALEUR EST NÉE EN APPLIQUANT LES DEUX PREMIÈRES**, et c'est la meilleure
preuve qu'il fallait l'écrire. Le schéma était binaire — mesurée ou devinée. En marquant
`lecture-sans-crash`, aucune des deux ne convenait : la mort du terminal est un FAIT
(journal de l'utilisateur, access violation sur US2000.cash) et c'est le MÉCANISME
(ArrayFree laisse un tampon que CopyRates réutilise) qui reste une hypothèse. La classer
« établie » aurait promis un mécanisme prouvé ; « correctif de forme » aurait nié une
panne réelle. Un schéma qu'on applique découvre ses manques ; un schéma qu'on énonce ne
les découvre jamais.

**LA PORTÉE S'ARRÊTE ICI, ET C'EST DÉLIBÉRÉ.** Les autres gardes du dépôt ne portent pas
de statut. Le leur poser demanderait de reconstituer de mémoire comment chacune est née —
c'est-à-dire d'écrire dans le dépôt des affirmations qu'aucune mesure ne soutient, ce que
la règle 5 interdit précisément. **Une ligne de statut fausse est pire que pas de ligne
du tout** : elle a la forme d'une provenance vérifiée. La convention s'applique donc là où
la distinction a été gagnée, et à toute garde neuve, dont la provenance est connue au
moment où on l'écrit.

**ELLE NE TENAIT QUE PAR DISCIPLINE, ET LE SEUIL ÉCRIT D'AVANCE A ÉTÉ FRANCHI.** Aucune
garde ne vérifiait qu'un statut est présent ni qu'il est honnête : une ligne de statut est
de la prose, et la règle 3 interdit d'ancrer une garde sur de la prose. Le seuil était
posé : *le jour où une garde livrée portera un statut « cause établie » sur un diagnostic
qui se révèle faux.* Ce jour est le 18 septembre 2026.

`remesurer-les-lignes` a été livré portant « CAUSE ÉTABLIE, MESURÉE — le compte vient de
l'utilisateur : douze lignes sur douze portaient un chiffre antérieur à la règle actuelle
du moteur ». **Le geste posé dans le même commit a réfuté sa propre justification** :
« 12 lignes remesurées · aucun chiffre n'a changé. » Les lignes n'étaient pas périmées ;
le symptôme venait d'un autre défaut, fermé la veille.

**Et la contradiction était DANS la ligne.** Elle dit « MESURÉE » et, dans la même phrase,
« le compte vient de l'utilisateur ». Ce n'est pas un mensonge, c'est une **omission** : le
mot a deux sens — mesurée *ici*, mesurée *quelque part* — et rien n'obligeait à choisir.

La prise construite est donc celle-là, et rien de plus : **`MESURÉE` doit être qualifiée.**
Le statut dit `DANS LE DÉPÔT` — et un test peut relire la trace — ou il dit `RAPPORTÉ` — et
personne ne le prendra pour une mesure reproductible. Jamais `MESURÉE` nue. Les deux
coexistent dans le cas courant : un symptôme rapporté dont la cause est relue dans le
source. `scripts/statut-dit-sa-provenance.test.mjs` découvre tous les statuts du dépôt et
échoue sur chaque « cause établie » sans provenance ; les douze qui existaient ont été
qualifiés depuis leur propre prose, pas de mémoire.

> **Elle rend l'OMISSION impossible et laisse le MENSONGE possible.** C'est écrit dans sa
> tête, parce que c'est exactement ce qu'elle ne ferme pas — et une omission suffisait à
> produire le cas fondateur. Son coût en faux refus est nul (règle 16) : la réponse
> attendue est toujours l'un des deux mots, et le message dit lequel écrire.

**Et elle s'est fait mordre par la règle 3 à sa PREMIÈRE EXÉCUTION.** Elle cherchait
« CAUSE ÉTABLIE » dans tout le paragraphe et a accusé `remesurer-les-lignes`, dont le
statut est désormais INSTRUMENTATION et dont la prose **raconte** le statut réfuté — c'est
même le sujet du fichier. Septième morsure, et la sortie était déjà écrite : la ligne
`// STATUT · …` est ce qui **agit**, le paragraphe qui la suit est du récit. La classe se
lit donc sur la ligne, la provenance dans tout le paragraphe.

### Le cas VIDE est le plus faible des tests, et c'est celui qu'on écrit

`reprendreSeries` remplaçait `deposes` par le seul index du compte et emportait les dix
séries d'exemple qu'elle venait d'y mettre. Le défaut a vécu des mois sans se montrer, pour
une raison qui vaut mieux qu'une anecdote : **à zéro série, la sortie anticipée passe AVANT
l'écriture fautive.** Le seul cas éprouvé était celui où le bug ne peut pas se produire.

Ce n'est pas un hasard de ce fichier-là. **Un état vide est, par construction, celui où la
moitié des bugs d'état ne peuvent pas arriver** : pas de fusion, pas de remplacement, pas de
collision, pas d'ordre entre deux écritures. Et c'est le test qu'on écrit spontanément —
c'est le plus court à mettre en place, il ne demande aucun semis, et il passe du premier
coup. Tout y invite.

> **Un test à vide prouve qu'un chemin s'exécute. Il ne prouve presque rien sur ce qu'il
> fait aux données qui étaient déjà là.**

Le seuil, ici, n'était même pas 55 séries : **une** suffisait. Une éprouve peuplée ne
demande donc pas un gros semis — elle demande qu'il y ait **un** élément d'avance, ce qui
est le minimum pour qu'une fusion, un remplacement ou un ordre existent.

La même forme se relit dans « mesurer à vide ne mesure personne » plus bas : un navigateur
vide n'est la condition de personne, et un état vide n'est pas le cas d'usage. Les deux
disent qu'un décor sans contenu ne mesure que le décor.

### Seul le rendu prouve que la valeur arrive — et le runtime le criait déjà

Chaque table de données de l'application a rendu **une rangée vide, pour tout le monde,
pendant des semaines** — instruments, fiche des courtiers, scans, journal. Le producteur
calculait juste, le gabarit était écrit juste, et 436 tests de source passaient au vert :
**aucun d'eux ne pouvait voir que la valeur ne rejoignait jamais son trou.** Un test qui
lit le code écrit sait ce qui est envoyé ; seul le rendu sait ce qui est reçu.

La chaîne causale, parce qu'elle resservira :

1. l'analyseur HTML **repose hors de la table** tout élément qui n'est pas de la famille
   table — `<sc-for>` en tête. Vérifié d'une ligne : `<table><tbody><sc-for><tr>…`
   devient `<sc-for></sc-for><table><tbody><tr>…` — la boucle vidée, la rangée-gabarit
   orpheline dans le tbody, ses trous à jamais irrésolubles ;
2. le runtime porte la parade (`RAW_WRAP` renomme les balises de table pour traverser
   l'analyse) — mais elle ne protège que ce qui n'est pas **déjà** abîmé, et `boot()` lit
   `dc.innerHTML`, le DOM après dégâts ;
3. le chemin de réparation — relire le texte brut — vit derrière `if (!window.__resources)`,
   et **le vendorage de React rend cette condition toujours fausse**. Une intention (« les
   ressources sont fournies ») lue comme un résultat (« le gabarit du DOM est sain ») : la
   règle 1, dans le runtime.

**Le correctif vit dans la source** : les tables du gabarit s'écrivent en `sc-raw-table`,
`sc-raw-tr`, `sc-raw-td`… — l'analyseur ne les connaît pas, donc ne les déplace pas, et
`RAW_UNWRAP` rend les vrais éléments, même CSS, même comportement. Deux gardes le
tiennent : l'interdiction de balise de table réelle dans le gabarit (le geste, avec le
numéro de ligne), et **la garde de rendu** — `rendu-gabarit.test.mjs` charge le vrai
fichier livré dans un vrai navigateur et échoue sur tout `never resolved`, avec le nom du
trou. Elle exige Chromium et tombe s'il manque : une garde qui saute en silence est une
garde aveugle sans rougir.

Trois leçons, dans l'ordre où elles ont coûté :

- **Le runtime le disait, sept fois, à chaque chargement, chez chaque utilisateur** —
  `{{ ir.nom }} never resolved`, en console. Un avertissement de runtime est une mesure,
  pas du bruit : celle-là désignait le trou par son nom depuis le premier jour.
- **Une dette déclarée sans sa gravité se classe toute seule en bas de la pile.** Le
  cliquet de `gabarit-contenu-restreint` avait MESURÉ les 37 balises reposées hors de
  leur table et écrit « à traiter en une passe dédiée ». « Dix-sept tableaux » se lisait
  comme du cosmétique ; ça voulait dire « aucune table ne rend ». La conséquence d'une
  dette s'écrit à côté de la dette, sinon le chiffre seul décide de l'urgence.
- **Une mesure qu'on explique au lieu de l'expliquer est une mesure perdue.** La sonde du
  chantier précédent affichait `lignes: 1` sur une liste annoncée à dix : c'était CE
  défaut, sous les yeux, et il a été rangé d'une phrase — « sans doute une autre table ».
  Le premier utilisateur, lui aussi, avait été cru sur la mauvaise cause : son filtre à
  0/4 était une coïncidence, sa liste était vide comme celle de tout le monde.

#### Le banc d'essai a un analyseur, et c'est un domaine — les `<select>` l'ont prouvé

L'ancien mode « in select » **supprime** toute balise étrangère (la boucle n'est pas
déplacée comme dans une table : elle n'existe plus — un menu à une option blanche) ;
l'analyse assouplie de Chromium ≥ 134 **garde** tout. Mesuré des deux côtés : sc-for
disparu sur le poste de l'utilisateur, 24/24 conservés sur le Chromium du banc. Vingt-
quatre menus muets sur le terrain, tous verts en CI — « ce Chromium les garde », la
note du cliquet, était une garantie vraie sur son domaine lue comme générale, la
famille de `netlify.toml`. Les vingt-quatre s'écrivent en `sc-raw-select` (les
`<option>` réelles restent : elles survivent dans les deux mondes ; PAS de
`sc-raw-option`, RAW_WRAP ne le connaît pas). Deux gardes : la structurelle
(`gabarit-contenu-restreint`) attrape le geste indépendamment de l'analyseur ; celle de
rendu attrape le symptôme, quelle qu'en soit la cause, et **déclare** que sur ce banc
la mutation d'analyseur ne peut pas la faire tomber — l'angle mort du banc est un
angle mort comme les autres : il se déclare dans la garde.

#### Le rendu ne prouve que les chemins qu'il exerce — la portée, elle, se prouve statiquement

La panne la plus grave du dépôt en une ligne : **« inedit is not defined » dans un
producteur, et la page entière est blanche** — `renderVals()` est UNE fonction, une
exception dans un producteur efface tout, y compris ce qui n'a rien à voir. Trois
locales (`inedit`, `plusFin`, `tDem`) avaient survécu à la suppression de leur
déclaration : leurs lecteurs vivaient plus bas dans `ligne()`, leur déclaration dans
un AUTRE producteur. 457 tests au vert pendant la panne totale, garde de rendu
comprise : le banc part d'un navigateur neuf, sans lignes de scan, donc `ligne()`
n'y tourne jamais. Une lecture hors de sa portée ne jette que si sa branche
s'exécute — mais elle est **parfaitement visible statiquement**.

Deux gardes ferment la classe, chacune déclarant ce que l'autre couvre :

- **`portee-script.test.mjs`** parse chaque `<script>` en ligne (espree) et résout
  les portées (eslint-scope) : toute référence qui n'est ni déclarée dans un bloc du
  fichier, ni un nom d'environnement navigateur (le paquet `globals`, rien d'énuméré
  à la main), ni une exception déclarée avec sa raison (`DCLogic`, support.js), est
  un échec nommé avec sa ligne. Sa première exécution a trouvé la panne — **et une
  deuxième de la même classe, endormie dans `testerAilleurs`** (`entrees[0]`… lus
  d'une portée qui n'existait pas : le repli d'un instrument inchargeable jetait).
- **`rendu-gabarit.test.mjs`** échoue sur toute `pageerror` : une exception y est
  plus grave qu'un trou, elle efface tout — mais seulement sur les chemins que le
  banc exerce.

Et le remède du fond n'est pas la garde, c'est **une seule vérité** : l'état du
tirage (`inedit`, `pousser`, `tirages`) vit dans `decisionDe` — `dec.inedit`,
`dec.pousser` (le mot dit ce que le bouton fait ; l'ancien `plusFin` portait deux
sens selon l'endroit, et c'est ce double sens qui a caché l'orpheline),
`dec.tirages` — et les trois producteurs lisent `dec` au lieu de recalculer chacun
sa copie. Re-déclarer sur place aurait réparé le symptôme en gardant la cause :
quatre copies du même calcul, dont n'importe laquelle pouvait diverger la prochaine
fois.

#### Et l'inverse : le compte de la SOURCE n'est pas le compte de l'ÉCRAN

La panne fondatrice de cette règle allait dans un sens : la source était juste, le rendu
était vide. Le cas miroir s'est présenté sur le BALISAGE, et il coûte l'inverse — une
garde de source aurait réclamé vingt-neuf corrections qui ne réparent rien.

Mesuré : `Vuna.dc.html` porte **trente-cinq** affectations d'un gestionnaire vide
(`x: () => {}`) sur un champ que le gabarit lie à un `onClick`. Rendues — le fichier
livré, les sept vues, l'état semé — **six** atteignent l'utilisateur. Les vingt-neuf
autres vivent dans des branches dont l'élément est masqué ou grisé : elles ne mentent à
personne. Les corriger aurait touché vingt-neuf branches que personne ne peut voir, ce
qui est la façon ordinaire dont un correctif introduit un défaut.

> **Une garde de source compte les occurrences ; une garde de rendu compte les
> utilisateurs.**

Et les six qui restaient étaient un défaut de BALISAGE, pas de comportement : un
`<button>` portant `cursor: default` et un gestionnaire vide entre dans l'ordre de
tabulation et s'annonce cliquable à un lecteur d'écran, pour ne pas répondre au clic.
C'est la règle 4 — l'explication (« le curseur dit que ce n'est pas cliquable »)
contredisait l'étiquette (`<button>`), et c'est l'étiquette qui était le défaut. La case
non calculée est un `<span>` depuis ; le curseur est parti avec la balise, n'ayant jamais
eu d'autre travail que de la démentir. `scripts/app/balisage-inerte.test.mjs` tient la
classe — *aucun élément annoncé cliquable ne porte un geste vide* — et non le lieu où
elle est apparue.

**Trois questions, trois bancs, et aucun ne couvre les autres** : « le gestionnaire
est-il branché ? » (`trous-branches`, qui lit les clés émises), « réagit-il ? » (la
tournée des gestes), « le DOM dit-il la vérité sur ce que c'est ? » (le balisage). Un
`<span>` inerte répond non à la deuxième et oui à la troisième, et il a raison des deux
fois. Les deux bancs de rendu parcourent désormais la **même** surface, écrite une fois
dans `scripts/app/lib/vues.mjs` : deux copies d'une liste d'écrans divergent, et la
divergence est muette.

**Et la mesure elle-même a rapporté zéro avant de rapporter six.** Les sept clics de
navigation échouaient tous — l'onglet porte son rang collé au libellé, « 2Mes scans » —
et les sept vues rendaient leur verdict sur le même écran d'accueil. Encore une mesure
fausse qui a l'air d'une mesure. La sonde vérifie donc sa prise : moins de quinze
éléments cliquables sur une vue la fait tomber, plutôt que de laisser passer un zéro qui
n'a rien regardé.

### Un motif qui dépend de l'ORDRE désigne l'environnement, pas le code

Trois jours de chantier MQL5 sur un symptôme dont la cause était hors du programme :
l'agent du testeur mourait après la synchro d'historique, sans une ligne de test. Le
journal du terminal portait la réponse — `file write error [112]`, disque plein ; 704 Mo
libres sur 95,8 Go, dont 72 Go dans trois dossiers de terminal. L'agent mourait **avant
d'exécuter une ligne du robot**.

**Le signal était disponible dès le premier rapport, et il a été lu à l'envers.** « GOLD,
Germany40 et USNDAQ100 échouent, BRENT et COPPER passent » se lisait comme une propriété
des instruments — profondeur d'historique, devise de cotation —, et deux hypothèses de
code en sont sorties. C'était une propriété du **rang** : le premier passé avait son cache
écrit, les suivants devaient en écrire, et la place manquait.

> **Un défaut du code ne dépend pas de qui est passé avant lui.** Quand le départage est
> « le premier marche, les suivants non », le suspect est une ressource partagée et
> consommable — disque, mémoire, descripteurs, quota — pas une ligne du programme.

Le test se fait comme celui des noms de lieu, à voix haute : *ce qui distingue les cas
qui échouent, est-ce ce qu'ils SONT ou quand ils sont passés ?* Le second ne peut pas
être une propriété du source.

#### Un correctif raisonné depuis une panne invisible garde son invariant et perd sa cause

Quatre correctifs ont été posés pendant ces trois jours, et ils ne se valent pas :

| D'où il venait | Ce qu'il en reste |
|---|---|
| la boucle de 1 800 s par symbole — **mesurée**, journal à l'appui | vrai, et la cause était la bonne |
| le cache d'agrégation, 2 h 12 de processeur à 100 % — **mesuré** | vrai, et la cause était la bonne |
| le plafonnement de `SpOuvAmorcer` — **raisonné** depuis une panne que personne ici ne pouvait observer | **l'invariant tient, la cause était fausse** |
| les six jalons d'initialisation | c'est eux qui ont rendu la mesure décisive |

Les deux premiers sont nés d'un symptôme qu'on pouvait relire ; le troisième d'un
symptôme qu'il fallait deviner. **Ce n'est pas une raison de ne pas le poser** — la forme
défensive vaut par elle-même, et le dépôt avait déjà vu ce geste faire cesser de répondre
un terminal. C'est une raison d'écrire son **statut** dans la garde : « l'invariant se
tient sur ses propres mérites », jamais « ce qui reste est ».

**Et l'angle mort était déjà déclaré, trois paragraphes plus bas.** La garde disait, dans
sa note de règle 9 : « elle ne PROUVE pas le diagnostic et ne le prétend pas ». Ça n'a
servi à rien — au-dessus, un paragraphe affirmait « CE QUI RESTE EST UNE INCOHÉRENCE ENTRE
DEUX FONCTIONS », et c'est la voix confiante qu'on lit.

> **Un angle mort déclaré ne rattrape pas une affirmation confiante écrite au-dessus de
> lui.** La règle 9 demande que l'angle mort soit dit ; elle ne dispense pas la phrase
> elle-même de porter son degré de certitude, à l'endroit où elle est écrite.

#### Une instrumentation qui n'imprime RIEN est une mesure, et elle pointe dehors

Les six jalons `VUNA INIT n/6` n'ont jamais rien imprimé, et c'est ce qui a tranché.
**Une initialisation muette sur six jalons posés dit « le programme n'a pas démarré » ;
une initialisation muette sans jalons ne disait rien du tout** — ni où elle s'était
arrêtée, ni si elle avait commencé. L'absence de trace n'est interprétable que si la trace
était garantie présente.

C'est le pendant de « le runtime le disait, sept fois, à chaque chargement » : là une
mesure existante était lue comme du bruit, ici une mesure absente est devenue lisible
parce qu'on savait ce qui aurait dû s'écrire. **Les deux disent qu'une instrumentation
vaut par ce qu'elle rend DÉCIDABLE, y compris quand elle ne rend rien.**

### Une grandeur qui CLASSE bien les cas n'est pas pour autant la grandeur du mécanisme

C'est la voisine de la règle précédente — là, un motif qui dépend du RANG désigne
l'environnement ; ici, un motif qui suit une VARIABLE désigne peut-être une autre
variable, cachée derrière celle qu'on regarde.

Deux instances mesurées, à deux jours d'écart, sur le même chantier :

| La grandeur qui classait | Ce qu'on en concluait | Pourquoi elle classait quand même |
|---|---|---|
| la **largeur de bande** entre les deux lectures | « les configurations larges divergent du testeur » | elle suit la volatilité, qui suit tout le reste — et deux exceptions l'ont cassée |
| le **nombre de barres H1** | « moins de barres, plus d'écart : Véna en jette » | il suit la largeur de séance, la politique de cotation du courtier ET la profondeur d'historique. Ce que Véna jette n'en est qu'un terme parmi quatre |

**Le nombre de barres est l'exemple parfait parce que l'ordre était PARFAIT** : cinq
instruments, aucune exception, du plus large au plus étroit. Et c'est justement ce qui
aurait dû alerter.

> **Un ordre trop propre est un indice FAIBLE, pas fort.** Une variable composite —
> en aval de plusieurs mécanismes à la fois — classe mieux que la vraie cause, parce
> qu'elle en agrège les effets et en lisse le bruit. La vraie cause, elle, a presque
> toujours des exceptions : un instrument où le mécanisme joue et ne coûte rien.

Le test se fait avant de croire l'ordre, et il tient en deux questions :

1. **La grandeur du mécanisme a-t-elle son propre nom ?** Ici oui — ce n'est pas « le
   nombre de barres », c'est « le nombre de bougies que `fenetreHomogene` écarte ».
2. **Est-elle mesurable SÉPARÉMENT ?** Ici oui, et c'est ce qui referme le cas sans
   rien coûter : `ecartees` est stocké avec chaque série et affiché sur le panneau.

Quand les deux réponses sont oui, on ne discute pas l'ordre — on lit l'autre chiffre.
Quand la seconde est non, l'ordre reste une piste et se dit comme telle.

**Et la confusion a une source récurrente : on lit la grandeur DISPONIBLE au lieu de la
grandeur VOULUE**, parce que la disponible est déjà à l'écran. C'est la même racine que
« un champ qui nomme mal ce qu'il porte », vue depuis le lecteur au lieu du libellé : là
le mot mentait sur le nombre, ici le nombre est juste et c'est la question qu'on lui pose
qui ne lui appartient pas.

### Un mot relatif n'est vrai que depuis un référentiel stable

Deux corrections à un jour d'écart, et c'était deux instances d'un seul énoncé :

| Le mot | Son référentiel supposé | Ce qui l'avait perdu |
|---|---|---|
| « hier » (couverture des exemples) | aujourd'hui, qui avance | une série **engendrée**, dont la dernière bougie est figée |
| « ci-dessous » (phrase de reprise du scan) | ma position dans la page | un pied **collant**, lu depuis n'importe quel point de défilement |

**Un mot relatif — de temps ou de lieu — emprunte son sens à un point fixe : « depuis
quand », « depuis où ». Un élément engendré, figé ou collant n'en a pas.** « Hier » était
vrai le jour de la génération et mentait dès le lendemain ; « ci-dessous » était vrai
depuis le cadre dans le flux et mentait depuis la barre qui suit l'écran.

Le test se fait à voix haute, comme celui des noms de lieu : **ce mot suppose-t-il un
« depuis où » ou un « depuis quand » ? Si oui, l'élément qui le porte doit prouver qu'il
a ce point fixe.** Une série à soi, fraîche par construction, a le sien — « hier » y
reste juste et se lit mieux ; un texte dans le flux du document a le sien — « ci-dessous »
y désigne bien ce qui suit. C'est l'élément qui perd le référentiel, jamais le mot qui
est interdit.

Le domaine est plus large que ces deux cas, et il se reconnaît au même test :
« récemment », « le mois dernier », « plus haut », « à droite », « le premier de la
liste ». Tout ce qui se déplace ou se fige les invalide — une liste retriée déplace « le
premier », une colonne repliée déplace « à droite », une capture d'écran fige
« récemment ».

Le remède est toujours le même : **remplacer le référentiel perdu par une valeur
absolue** — la date en toutes lettres, le nom de la chose (« la carte du balayage »), le
libellé de l'élément plutôt que sa position. Voir « Aucun mot relatif sur une fenêtre
figée » plus bas pour l'instance fondatrice, et sa garde de rendu dans
`rendu-gabarit.test.mjs` — qui lit l'écran, pas le code, parce qu'un mot relatif est un
défaut d'AFFICHAGE : il n'existe que rendu.

### Une mutation se défait par le mécanisme qui l'a faite

Le cas réel, évité de justesse : pour éprouver la garde du verbe de la carte, une
mutation avait été posée dans `Vuna.dc.html` par échange de chaîne — et la restauration
prévue était `git checkout -- Vuna.dc.html`. Le fichier portait aussi, **non committé**,
le correctif même que la garde éprouvait : la restauration l'aurait emporté avec la
mutation, silencieusement. Le garde-fou de l'environnement a refusé la commande ; il
n'était pas garanti.

C'est la règle 1 sous une forme neuve : `git checkout --` dit « remets ce fichier comme
il était au dernier commit ». **L'intention est « annule ma mutation » ; le résultat est
« annule tout ce que je n'ai pas committé ».** Les deux coïncident tant qu'on travaille
sur du code committé, et divergent exactement dans le cas où on éprouve son propre
correctif — c'est-à-dire le cas normal de la règle 2, puisqu'une garde neuve se vérifie
par mutation AVANT d'être livrée.

> **Un échange de chaîne s'annule par l'échange inverse ; jamais par une restauration de
> dépôt, qui ne distingue pas la mutation du travail en cours.**

La forme sûre, celle des mutations de cette séance : l'échange aller avec une assertion
de compte (la chaîne mutée doit exister, une fois), le test qu'on regarde tomber, puis
**l'échange inverse** avec la même assertion — la restauration est vérifiée comme
l'aller, et elle ne touche que ce que la mutation a touché. Une mutation marquée
(`/*MUT*/` dans la chaîne d'échange) rend l'inverse inambigu.

Et c'est le **second cas de la même séance où l'outil de vérification était plus
dangereux que ce qu'il vérifiait** — après la garde de rendu, verte pendant la panne
totale parce que son banc n'exerçait pas la branche en panne. Une garde qui ne regarde
pas est aveugle ; un geste de vérification qui déborde son objet est pire, il détruit.
Cette règle-ci ne se ferme que par vigilance : aucune garde du dépôt ne voit un geste
de séance, et le garde-fou d'environnement n'appartient pas au dépôt. C'est précisément
pourquoi elle est écrite.

### Une suppression se cartographie avant de se faire

Le cas réel : trois familles de producteurs sans consommateur — la page de vente de
l'application, le contrôle mémoire, le dialogue des manquants — à supprimer parce qu'un
producteur mort coûte deux fois : il pèse dans l'artefact et il fait croire à une
fonction. La cartographie préalable a trouvé **six gardes** accrochées à ce qui partait,
dont deux que personne n'aurait devinées. Sans elle, chacune serait devenue **vacue** —
verte en ne gardant plus rien, le pire mode de panne, appliqué à une suppression au lieu
d'une réécriture : *une garde doit échouer quand son hypothèse cesse d'être vraie.*

**Chaque garde accrochée a une fin, et elle se dit.** Trois issues :

- **elle part avec le geste** — quand le geste supprimé était son seul sujet
  (l'ancre `nomPlan(PLAN_ACHETE)` de `coherence`, partie avec la page de vente, la
  raison écrite à sa place) ;
- **elle se réancre sur ce qui reste** — quand son invariant survit au geste (la
  dérivation des libellés d'article, réancrée sur les durées de `/tarifs` et la
  matrice du module) ;
- **elle s'ancre sur l'ABSENCE** — la troisième issue, trouvée en pratique : la garde
  affirme que la chose n'est plus là (« aucun lien de paiement ne s'ouvre d'ici »).
  Elle garde ses dents alors que son sujet a disparu, et elle attrape la
  **réintroduction** — qui est précisément le risque, puisque la doctrine reste
  écrite au-dessus pour le jour où le geste renaîtra.

**Et une suppression périme de la PROSE, pas seulement du code.** Deux consignes sont
devenues fausses en une heure sans qu'aucun test ne les touche : `tarifs.tsx` disait
« les montants sont ceux du code de l'application » — l'application n'en portait plus
un seul —, et la note au-dessus de `RENONCE_TXT` disait « la garde vit ici, dans
l'unique fonction par laquelle un lien de paiement s'ouvre » — la fonction venait de
partir. Une consigne périmée a l'autorité des vraies et envoie chercher une panne qui
n'existe plus : les commentaires autour de ce qu'on supprime se relisent comme les
gardes, dans le même geste.

#### Et l'inverse : la PROSE QU'ON AJOUTE pour expliquer un retrait entre dans le champ des gardes

La phrase précédente ne couvrait qu'une moitié — le texte qui **reste** autour de ce
qui part. L'autre moitié est le texte qu'on **écrit** pour dire pourquoi ça part, et
c'est du contenu neuf : il s'ajoute au fichier, donc il s'ajoute à ce que les gardes
lisent. Deux fois dans un seul commit — le retrait de la vérification de place :

| Ce que la prose a fait | La garde qui a rougi |
|---|---|
| elle **épelait l'appel** qu'elle racontait (`storage.estimate(`) | celle qui interdit sa réintroduction l'a trouvé dans le récit |
| elle a **éloigné** le `finally` de l'ouverture du writable, 2 200 → 2 385 caractères | celle du `.crswap`, qui cherchait dans une fenêtre |

Aucune ligne de code n'avait bougé dans les deux cas. **Deux faux positifs, et deux
sorties différentes**, parce que ce n'est pas toujours la garde qui a tort :

- **La prose ne se fait pas passer pour du code.** Le récit d'un retrait cite ce qui
  est parti — c'est son travail — mais il peut le nommer sans l'épeler comme un
  appel. C'est la règle 3 vue depuis l'écrivain : on interdit le code, pas le récit
  du code, donc **le récit évite la forme du code**. Apprendre les commentaires à la
  garde serait le motif de plus que la règle 3 refuse.
- **Une garde dont la prise est une DISTANCE n'a pas de prise.** 2 200 caractères
  était un nombre magique, et la réponse n'était pas 2 600 : la troisième prose
  l'aurait dépassé. La portée qui compte n'était jamais un nombre de caractères,
  c'était **la méthode** — `borne(APP, "\n  }", i)`, qui jette si elle ne la trouve pas
  plutôt que de s'élargir en silence. Changer de forme, pas ajouter un motif.

> **Le texte qu'on ajoute pour expliquer une suppression se cartographie comme le
> code qu'on retire.** La cartographie de la règle 14 se fait donc dans les DEUX sens :
> ce qui part, et ce qu'on écrit à la place.

Et le corollaire pratique : une suppression bien expliquée est **longue**, par
construction — elle porte ses mesures et ses raisons. C'est précisément cette
longueur qui déborde les fenêtres et qui multiplie les chances d'épeler un motif
interdit. Plus le retrait est bien documenté, plus il accroche.

## Le démarrage se chronomètre — mesurer à vide ne mesure personne

Un chargement lent a d'abord été attribué au **poids du fichier**. Mesuré : 2,46 Mo bruts,
**554 Ko transférés** en brotli (4,4×), et sur un navigateur VIDE le premier rendu tient
en 0,4 s — 4,9 s dans le pire cas fabriqué, processeur ÷6 **et** 3G. Mais un navigateur
vide n'est la condition de personne.

**Deux jalons, et ils ne se comportent pas pareil.**

| | page affichée | **données là** | restauration |
|---|---|---|---|
| CPU ÷1 · vide | 463 ms | 768 ms | 185 ms |
| CPU ÷1 · 2,8 Mo | 405 ms | 980 ms | 424 ms |
| CPU ÷1 · 13,5 Mo | 409 ms | 1 199 ms | 675 ms |
| CPU ÷4 · vide | 1 761 ms | 3 062 ms | 721 ms |
| CPU ÷4 · 2,8 Mo | 1 705 ms | 3 964 ms | 1 844 ms |
| CPU ÷4 · 13,5 Mo | 1 899 ms | 5 317 ms | 3 027 ms |

Le moment où la **page** s'affiche **ne dépend pas des données** — 405 ms à vide comme
avec 13,5 Mo. Donc tout chantier sur le poids du fichier ne touche que ce jalon-là, celui
qui est déjà rapide : **déshabiller le gabarit rapporte un cinquième** (mesuré : 2 433 →
1 938 Ko, rendu −20 % à ÷4, −23 % à ÷6) et ne peut rien pour l'autre.

Le moment où les **données** sont là grandit avec le stockage. Mais à **CPU ÷1 le pire cas
mesuré est 1,2 s** : sur une machine normale, rien de ce qui est mesuré ici n'approche dix
secondes. Les lignes ÷4 et ÷6 donnent la **loi d'échelle**, pas le cas de quelqu'un.

**Trois marques sont posées dans le produit**, et se lisent d'une ligne sans outil :

```js
performance.getEntriesByType('measure').filter((m) => m.name.startsWith('vuna:'))
```

`reprendreSeries` (avec le nombre de séries), `lireScanComplet` et `reprendreScan` (avec
les lignes et les archives). **Deux marques pour le scan et non une**, parce que ce sont
deux coûts sans rapport : une lecture de base d'un côté, du calcul de fil principal de
l'autre — les confondre dirait « 4 s » sans dire s'il faut décoder plus tard ou calculer
autrement. Les sorties anticipées sont mesurées elles aussi : sans ça, le cas « rien en
mémoire » ne laisserait aucune trace, et c'est précisément celui auquel on compare.

**Et ces marques ont déjà sauvé un diagnostic, pas une performance.** En cherchant à
reproduire une perte de séries, deux semis de sonde sont tombés à côté — le champ `b` au
lieu de `l` pour les bas, puis l'espace `.perso.ic` quand le compte réel était
`.client.fxpro`. Les deux fois, la sonde rendait **« 0 série » sans se plaindre** : une
mesure fausse qui a l'air d'une mesure, le pire mode de panne d'un diagnostic. C'est
`vuna:reprendreSeries 0 série`, posée dans le produit, qui l'a dit — pas une assertion de
test, qui aurait simplement échoué sans dire que c'était la sonde qui avait tort.

> **Une instrumentation posée dans le produit attrape une mesure fausse ; une sonde de test
> ne peut attraper que le produit.** C'est l'argument pour en garder, et il ne se voit que
> le jour où on en a besoin.

**Avant tout nombre, savoir ce qui a été chronométré.** Le tableau ci-dessus écarte les
deux jalons de 405 ms à 5 317 ms — un facteur treize selon la définition. « Page blanche »
et « page visible, liste vide » mènent à deux chantiers différents.

## Aucun mot relatif sur une fenêtre figée

L'indicateur de régime, mesuré sur les séries d'exemple, travaille sur une fenêtre écrite
dans le générateur. « hier » y désigne la veille de **cette** date, pas la veille
d'aujourd'hui, et l'écart grandit à chaque jour qui passe : au bout de six mois, « hier »
annoncerait une veille vieille de six mois. Le régime porte donc `surExemples`, et les
trois chiffres de la veille comme la frise se datent **en toutes lettres** — « au 11
septembre 2026 » — pendant que `zBougie` ajoute « séries d'exemple, fenêtre fixe ». Sur
des bougies à soi, fraîches par construction, « hier » reste juste et se lit mieux.

**Deux « périmées » différentes, et il faut les distinguer.** Le filtre des 48 h de
`calcRegime` n'écarte JAMAIS les séries d'exemple : `tFin` est la dernière bougie du lot
mesuré, donc leur propre dernière bougie. Mais la fiche d'instrument porte un AUTRE test,
date-contre-aujourd'hui — `Date.now() - cv.t1 > 45 jours`, dans le producteur de la
fiche — et **celui-là s'applique bien à elles** : elles passeront « périmées »
quarante-cinq jours après leur dernière bougie.

**« Le seul date-contre-aujourd'hui du fichier » était écrit ici, et c'était faux** : la
colonne « Bougies présentes » en portait un deuxième (`< 8 jours` → « hier », au-delà →
« s'arrête en » à l'encre d'alerte), invisible tant que sa table ne rendait rien. Sur une
série d'exemple, elle disait « 2023 → hier · complet » — vrai le jour de la génération,
faux dès le lendemain — puis aurait basculé en alerte sans action possible. Corrigée en
date absolue, « 2023 → 11/09/2026 · fenêtre fixe », encre neutre, décidée AVANT le seuil
relatif. Un « seul » se périme sans bruit : compter, pas jurer.

**Et ça vaut pour les ORDINAUX, ce que l'énoncé ne disait pas.** « La troisième instance
de cette forme » a été écrite sans avoir été comptée ; comptée sur la table fondatrice,
c'était la cinquième. Un ordinal est **pire qu'un cardinal**, et pour une raison de
grammaire plutôt que d'arithmétique :

> **Un nombre placé dans le PRÉDICAT se fait vérifier ; un nombre placé dans une
> APPOSITION ne se fait pas vérifier.** « Il y a trois instances » est la phrase, donc
> son sujet ; « la troisième instance de … » est un qualificatif, et c'est la
> proposition principale qu'on relit.

C'est la même figure que la réserve placée SOUS une affirmation (règle 9, plus bas) : ce
qu'on lit d'un bloc de prose dépend d'où c'est écrit, pas de si c'est écrit. Ici la
phrase principale était juste et le chiffre incident était faux de deux — personne
n'audite un complément du nom.

Le geste coûte une commande : un ordinal se compte avant de s'écrire, ou il se remplace
par ce qu'on sait vraiment (« une de plus », « encore une fois ») qui ne promet rien.

**Et la règle a resservi deux jours plus tard, sur une DURÉE au lieu d'un rang.** « Le
défaut avait vécu des mois sous les yeux de tout le monde » : un ordre de grandeur juré
là où `git log -S` répondait. Compté, c'était **quatre jours** — et le chiffre juste n'a
rien changé à l'argument, parce que ce n'était pas le bon chiffre.

> **Le compte utile est le nombre d'OCCASIONS MANQUÉES, pas le temps écoulé.** « Des
> mois » cherchait à dire « personne ne l'a vu », et la durée ne le dit pas : elle est
> compatible avec un fichier que personne n'a rouvert. Le nombre de commits qui ont
> traversé le fichier, lui, le dit — **trente et un** sur ces quatre jours.

**Troisième fois dans la même semaine, et sur un troisième TYPE de nombre** : « douze
caractères gagnés par nom », dans un rapport. Compté sur la composition réelle, c'en est
**six** sur le cas mesuré et huit dans le pire cas. Le geste restait juste ; le chiffre
était juré.

| ce qui était écrit | ce que la commande rendait | le type de nombre |
|---|---|---|
| « la troisième instance de cette forme » | la cinquième | un **rang** |
| « des mois sous les yeux de tout le monde » | quatre jours, trente et un commits | une **durée** |
| « douze caractères gagnés par nom » | six, huit au pire | une **quantité** |

Les trois fois, la commande existait et tenait dans une ligne ; les trois fois, le nombre
était dans une apposition. **Un nombre placé dans le PRÉDICAT se fait vérifier ; dans une
apposition, non** — et « depuis des mois » comme « douze caractères gagnés » en sont,
exactement comme « la troisième instance de ».

> **La règle n'est donc pas « un ordinal se compte » : c'est « une apposition chiffrée se
> compte ».** L'ordinal était le premier cas, pas la classe — et la formuler sur lui
> aurait laissé passer les deux suivants, qui ne sont pas des rangs. C'est la règle 8
> appliquée à une règle : `ordinal` est un LIEU, `nombre en apposition` est une PROPRIÉTÉ.
> (Et elle s'est élargie une fois de plus au paragraphe suivant : un QUANTIFICATEUR est un
> compte déguisé, donc il entre dans la même classe.)

**Et les trois fois, c'est l'interlocuteur qui a compté, jamais l'auteur.** Ce n'est pas
une remarque de politesse : une apposition ne se relit pas par celui qui l'a écrite,
puisqu'il la lit comme un décor de sa phrase principale — laquelle est juste. Tant que le
seul mécanisme est la relecture par l'autre, la classe reste ouverte ; elle se ferme en
**posant la commande avant le chiffre**, pas après.

#### Et le chiffre s'ÉCRIT, pas seulement se compte — parce qu'un compte posé DÉTECTE

Tout ce qui précède justifie le compte par l'exactitude : ne pas jurer un ordre de
grandeur qu'une commande rend. C'est vrai et c'est trop faible. Le compte a une seconde
fonction, et elle vaut plus que la première :

> **Un compte affirmé ne détecte rien ; un compte POSÉ fait rougir la ligne d'après.**
> Une fois le chiffre écrit dans le fichier, toute phrase ajoutée qui le contredit se
> voit — il y a quelque chose à contredire. Une formulation prudente (« c'est rare »,
> « quelques occurrences ») est exacte et n'attrape jamais rien.

**Mesuré sur deux paragraphes écrits à la suite.** Le compte d'une tournure fautive avait
été posé — *deux fois hors de la phrase qui compte, trois en brut*. Le paragraphe suivant
l'a épelée une fois de plus, et le chiffre déjà écrit a rendu la faute visible dans la
minute : il y avait une valeur à recompter. Sans lui, la même phrase serait passée — rien
n'aurait été contredit, parce que rien n'aurait été promis.

C'est la figure de l'instrumentation posée dans le produit, appliquée à de la prose :
*une mesure écrite attrape ce qui vient après elle, y compris ce que son auteur n'avait
pas prévu.* Et c'est ce qui transforme le geste de compter, qui est une vigilance, en
quelque chose de beaucoup moins cher — mais **pas en un mécanisme, et le test de la
section précédente le refuse.** Retirez la personne : le chiffre posé ne contredit
rien, puisque plus rien ne recompte. Il reste une vigilance.

**Ce qu'il change est ailleurs, et c'est assez pour qu'on l'écrive** : il transforme la
question que le lecteur suivant doit se poser. Sans chiffre, elle est ouverte — *y
a-t-il quelque chose qui cloche ici ?* —, et ce fichier a mesuré quatre fois que cette
question-là ne se pose pas. Avec le chiffre, elle est fermée : *ce nombre est-il encore
juste ?*, à quoi une commande répond en une seconde.

> **Un compte posé ne supprime pas la personne ; il ramène son travail à une commande.**
> C'est la différence entre remarquer et vérifier — et c'est tout ce qu'on peut
> honnêtement promettre à de la prose, que nulle garde ne lit.

**Cette dernière phrase portait « le seul endroit de cette famille », et le mot est
parti.** Un quantificateur en apposition, dans le chapitre qui l'interdit, écrit sans
qu'aucune commande ne le rende : rien ne dit combien d'endroits de cette famille
méritent le mot, et je n'ai pas compté. La sortie est celle que ce chapitre prescrit —
remplacer par ce qu'on sait vraiment, qui ne promet rien.

### L'erreur a une DIRECTION — et elle en a deux, pas une

Le signal proposé était : *l'apposition chiffrée est là pour amplifier, donc son erreur
va toujours dans le sens qui renforce la phrase ; si le nombre rend la phrase plus forte,
c'est lui qu'il faut compter.* **Vérifié sur les trois, et ça tient deux fois sur trois** —
la troisième va dans l'autre sens, et c'est ce qui rend le signal utilisable au lieu de
magique :

| l'apposition | le sens de l'erreur | ce qui la produit |
|---|---|---|
| « des mois » pour quatre jours | **amplifie** | l'impression est formée par l'effort de la trouvaille, pas par le calendrier |
| « douze caractères » pour six | **amplifie** | le gain se raconte depuis la gêne qu'il retire |
| « la troisième instance » pour la cinquième | **affaiblit** | on ne se rappelle que les instances qu'on a vues soi-même |

> **Un nombre de mémoire est biaisé vers ce que l'auteur avait en main.** Une grandeur
> tirée d'une impression **surestime**, parce que l'impression s'est formée sur le coût
> ressenti ; un compte d'instances tiré du souvenir **sous-estime**, parce qu'on ne compte
> que ce qu'on a vu. Les deux vont dans le sens de la position de celui qui écrit — ce
> n'est pas toujours « plus fort », c'est toujours « plus près de ce qu'il croyait ».

**Le geste pratique tient quand même, et il ne coûte rien** : dans un message qui porte
cinq nombres, celui qui rend la phrase plus forte est celui qui mérite la commande. Ça ne
remplace pas la commande — **ça dit lequel des chiffres la mérite**, ce qui est le seul
arbitrage qu'on fasse vraiment en écrivant. Et l'exception mesurée dit où il ne suffit
pas : *un ordinal qui compte des instances se compte toujours, même quand il paraît
modeste* — c'est précisément sa modestie qui l'a fait passer.

#### Le compte ne peut pas ÉTABLIR la direction — et ce n'est pas ce qu'on lui demande

**Cas fondateur, à une heure d'intervalle** : le chapitre voisin a ajouté deux instances à
cette table, portant la population classée à **cinq** — trois qui amplifient, deux qui
atténuent. La récapitulation qui a suivi en a conclu que *« l'échantillon devient assez
large pour que ce partage cesse d'être une coïncidence »*. C'est faux, et c'est une
apposition de plus : à cinq, un partage 3/2 est ce qu'une pièce rend le plus souvent.

**Ce qui soutient la règle n'est donc pas le compte, et ne l'a jamais été** :

> **Un mécanisme est une explication, pas une statistique.** Il nomme **deux sources
> distinctes** — l'impression, formée sur le coût ressenti, qui SURESTIME ; le souvenir
> d'instances, qui ne retient que ce qu'on a vu et SOUS-ESTIME — et il prédit deux
> directions opposées **avant** qu'on regarde. Cinq cas ne peuvent qu'être *cohérents*
> avec ça ; aucun nombre de cas de cet ordre ne l'établit, et aucun n'a besoin de le
> faire.

**Le test, au moment de croire un partage** : *l'explication a-t-elle prédit la direction
avant la mesure, ou a-t-elle été écrite pour la décrire après ?* La première n'a pas
besoin d'un grand échantillon — elle a déjà pris un risque. La seconde en aurait besoin,
et ne l'aura jamais.

**Et le geste de tri n'en dépend pas du tout**, ce qui est la raison de l'écrire : il ne
demande pas que la répartition soit prouvée, seulement qu'elle soit assez fréquente pour
DÉCIDER LEQUEL DES CHIFFRES on va vérifier. Un tri ne promet rien sur le cas qu'il
classe — il ordonne un travail qu'on fera de toute façon.

> **Un critère de TRI se juge sur ce qu'il fait gagner, un critère de PREUVE sur ce qu'il
> exclut.** Les confondre fait réclamer à un tri une rigueur qu'il n'a pas à avoir, ou lui
> fait promettre une certitude qu'il n'a pas.

**LA PORTÉE DÉBORDE LES APPOSITIONS, et c'est ce qui rend la distinction utile ici** : ce
dépôt mesure presque tout à petit `n`. La table d'`ecartees` porte **cinq** lignes et
sépare sans contre-exemple ; l'échelle des prix éprouve **trois** échelles ; l'ordre des
barres H1 était parfait sur **cinq**. Le fichier en a déjà tiré la bonne conclusion deux fois, par deux
chemins — *« un ordre trop propre est un indice FAIBLE, pas fort »*, et `ecartees`
déclaré **utilisable comme signal, interdit comme explication**. Ce paragraphe dit
pourquoi ces deux verdicts étaient justes : dans les deux cas, aucune explication n'avait
prédit quoi que ce soit avant la mesure.

#### La quatrième instance était DANS l'énoncé de la règle — et ce n'était pas un nombre

Il y en a **cinq**, et les voici, parce qu'un compte qui ne s'énumère pas est
exactement ce que ce paragraphe interdit : « la troisième instance » pour la cinquième,
« des mois » pour quatre jours, « douze caractères » pour six, — dans le message qui
posait le signal ci-dessus — **« les trois nombres étaient faux dans le sens qui
renforçait »**, alors que deux le sont, et enfin **« trois morsures, CHACUNE attrapée
par la phrase que la précédente avait laissée derrière elle »**, alors qu'une seule
l'a été : les deux autres l'ont été par relecture.

C'est la figure que le dépôt connaît déjà sous une autre forme : *la règle 1, à
l'intérieur d'une garde écrite contre elle.* Ici c'est une règle de prose, commise dans la
phrase qui la formule — et la raison est la même qu'ailleurs : **l'énoncé hérite d'une
question toute faite, celle des cas qu'on vient de regarder.**

**Et son mécanisme n'est pas la mémoire, c'est la CLÔTURE.** Les trois premiers étaient
des nombres tirés du souvenir ; le quatrième est un nombre tiré des cas SOUS LES YEUX,
étendu à l'ensemble sans que chacun soit repris. Ce qui ouvre la classe :

> **Un quantificateur est un compte déguisé, et il se vérifie pareil.** « Les trois »,
> « toutes », « chacune », « aucune », « à chaque fois » ne disent rien d'autre qu'un
> nombre, et ils se placent dans les mêmes appositions. La différence est qu'ils ne
> ressemblent pas à un chiffre, donc ils échappent même à quelqu'un qui a décidé de
> compter ses chiffres.

Le geste ne change pas — il s'applique à un mot de plus. *Avant d'écrire « les trois »,
reprendre les trois.*

**Et la CLÔTURE a resservi, dans la même situation exactement.** Les deux
quantificateurs de cette liste — « les trois », « chacune » — ont été écrits *en
commentant la règle qui les interdit*, par la même personne, à six jours d'écart. Ce
n'est pas une distraction : commenter une règle, c'est avoir sous les yeux les cas qui
viennent de la produire, et **un ensemble qu'on vient d'examiner se clôt tout seul** —
on dit « chacune » de trois choses dont on a vérifié une, parce que les trois sont
là, ensemble, et paraissent avoir été vues.

> **Le moment le plus dangereux pour un quantificateur est celui où l'on RÉCAPITULE.**
> Les nombres de mémoire se trompent quand on est loin des cas ; les quantificateurs se
> trompent quand on en est tout près. La récapitulation a l'air d'être le moment où l'on
> est le mieux informé — c'est le moment où le compte est le moins fait.

Le geste, lui, ne change toujours pas ; c'est le déclencheur qui s'élargit. *Avant
d'écrire « les trois », reprendre les trois — et surtout dans la phrase qui conclut.*

##### Trois de plus en deux messages, et le compte est à HUIT — la densité est le fait

La récapitulation ne produit pas une apposition fausse de temps en temps : **elle en
produit en rafale, et dans la phrase même qui les dénonce.** Mesuré sur deux messages
consécutifs, tous deux consacrés à cette règle :

| l'apposition | ce qui était vrai | qui |
|---|---|---|
| « **Quatrième** instance » | la cinquième | l'auteur du rapport |
| « la **première** que je commets en commentant la règle » | la seconde | le même, **dans la même phrase** |
| « les cinq sont apparues dans des phrases de conclusion, et **jamais** dans le corps d'une mesure » | invérifié, et probablement faux — « douze caractères gagnés par nom » vivait dans un corps de rapport | celui qui rapportait les deux précédentes |

**Deux dans une seule phrase, et la phrase était celle qui les nommait.** La troisième
est venue du côté qui venait de corriger les deux autres — ce qui retire à l'affaire son
caractère d'inattention personnelle : *c'est la position de récapitulation qui produit
le défaut, pas celui qui l'occupe.*

> **La récapitulation est le seul endroit où l'on écrit beaucoup de quantificateurs
> d'affilée**, parce que c'est ce qu'elle est — une phrase sur un ensemble. Le taux ne
> monte donc pas par relâchement : il monte parce que la densité d'occasions monte,
> pendant que le temps disponible pour recompter, lui, ne bouge pas.

Ce qui rend la conséquence pratique nette, et différente du geste précédent : dans une
récapitulation, **on ne vérifie pas les quantificateurs un par un — on les remplace.**
« Chacune » devient « une sur trois, et voici laquelle » ; « jamais » devient rien du
tout. Reprendre trois ensembles au moment de conclure ne se fait pas ; écrire une phrase
qui ne promet aucun ensemble, si.

**Et ce qui le rend meilleur que les formulations précédentes du geste, c'est son COÛT.**
Les autres demandaient du temps — reprendre les cas, poser la commande — c'est-à-dire
précisément la ressource que la position de récapitulation n'a pas. Celui-ci n'en demande
aucun : *« une sur trois, et voici laquelle »* s'écrit dans le même souffle que
*« chacune »*, et **ne peut pas être faux**, puisqu'il ne promet que ce qu'il énumère.

**À UNE CONDITION QUI A MANQUÉ UNE FOIS, et il faut l'écrire ici aussi** : que le chiffre
et la liste soient relus L'UN CONTRE L'AUTRE. « Six commits, les voici » suivi de cinq
entrées satisfait la forme et ne vérifie rien — voir « le compte RECOPIÉ », où le cas est
mesuré. *Un total seul se recopie ; une liste seule rassure ; c'est leur confrontation qui
mesure.*

> **Un remède qui dépense la ressource manquante n'est pas un remède.** Quand un défaut
> naît d'un manque de temps, la sortie n'est pas de demander plus d'attention : c'est de
> trouver la formulation qui coûte le même effort et promet moins.

**Corollaire, pour le moment où l'on corrige : une affirmation jamais comptée se RETIRE,
elle ne se répare pas.** Le « jamais » de la troisième ligne du tableau n'a pas de version
juste — il n'a qu'une version absente. Chercher son chiffre après coup, c'est fabriquer
rétroactivement une mesure qui n'a pas eu lieu, et lui donner la forme d'une vérification.
*Un nombre qu'on n'a pas compté ne devient pas vrai quand on le compte après : il devient
un autre nombre, dans une phrase qui n'en avait pas besoin.*

**Et ce nom-là a ABSORBÉ une règle du dépôt, ce que les précédents n'avaient pas fait.**
« Un “seul” se périme sans bruit : compter, pas jurer » vivait depuis le 13 septembre dans
« Aucun mot relatif sur une fenêtre figée », née d'un « le seul date-contre-aujourd'hui du
fichier » qui en cachait deux. C'est la même règle, cinq jours plus tôt, par un autre
chemin : « le seul » est un quantificateur en apposition. Les deux restent écrites là où
elles sont nées — elles n'ont pas le même exemple —, mais elles ont cessé d'être deux
règles. **C'est ce qui a servi de preuve que le nom était enfin le bon**, et le critère
est écrit dans la règle 8, « une classe bien nommée ABSORBE ».

**Mais elles n'en portent pas le MOT** : le verdict est « fenêtre fixe » — voir « Quand
l'explication doit contredire l'étiquette » plus haut. Ce paragraphe a d'abord dit
l'inverse (« c'est voulu, ce n'est pas un défaut à corriger ») et il avait tort : le seuil
est bien voulu, l'étiquette ne l'était pas.

Ne pas confondre non plus avec les deux autres « périmé » du fichier : les « chiffres
périmés » (réglages changés, `perime()`) et `aScansPerimes` (un scan antérieur à une
livraison). **Trois mécanismes, un seul mot.**

## Un fait DISPONIBLE, remplacé par un fait PLAUSIBLE

**PROVENANCE · le nom vient de l'utilisateur, le 19 septembre 2026 ; les instances
étaient toutes déjà écrites ici, dans trois chapitres qui ne se savaient pas parents.**
C'est la règle 8 à son second test — *une classe bien nommée ABSORBE* — et ce qu'elle
ramasse était déjà relié par un renvoi : le chapitre de la carte du rapport dit, en toutes
lettres, « le geste coûte une commande, et **c'est la même que pour les nombres** ». Le
lien était vu ; le mécanisme n'avait pas de nom.

Le voici, et il n'est pas « une apposition chiffrée » — celui-là était un LIEU
grammatical, et il laissait dehors tout ce qui n'est pas un nombre :

> **Une commande existait, tenait dans une ligne, et personne ne l'a lancée — un fait
> plausible a pris la place du fait disponible.** Le plausible est presque toujours
> proche : il vient de ce qu'on avait en main, d'un brief, d'un souvenir, d'un écran
> ouvert. C'est ce qui le rend indistinguable du vérifié une fois écrit.

Les membres, énumérés plutôt que comptés — la forme que ce fichier prescrit pour une
phrase sur un ensemble :

| le fait plausible | la commande qui répondait | où il vit |
|---|---|---|
| les cinq appositions chiffrées | `git log -S`, un compte sur la composition réelle, reprendre les cas | « Aucun mot relatif sur une fenêtre figée » |
| `nomRobot` désigné pour un geste qui vit dans `etiquetteCompte` | chercher la phrase | « Un nom tronqué perd sa FIN » |
| `/tarifs` désigné pour une phrase qui vit sur l'accueil | la même | idem |
| la phrase réécrite de mémoire au lieu d'être cherchée | la même | « La colonne gratuite » |
| **le nom du dépôt, pris dans l'inventaire du brief** | `git ls-remote --get-url origin` | « Fichiers », plus haut |
| **un REMÈDE attribué de mémoire** — `grep -v $$` pour la sonde qui se mesurait elle-même | `grep` sur la trace de séance : la chaîne n'y paraît que dans le message qui l'affirme | « Ce que je mesure contient-il ma mesure ? » |
| **une ABSENCE conclue d'un `grep` à population choisie** — « `mirroirVente` n'existe pas dans le dépôt » | le même `grep`, sur `git ls-files` : la fonction vit dans `scripts/mt5/config.mjs` | ci-dessous, « le refus lisait la case » |

**ET LE DERNIER MEMBRE ÉLARGIT LA CLASSE UNE FOIS DE PLUS : ce n'est ni un nombre, ni un
nom, c'est un MÉCANISME.** Tous les autres remplaçaient une valeur qu'une commande rend —
un compte, un nom de dépôt, une phrase, un chemin. Celui-ci remplaçait une *explication* :
comment une sonde avait cessé de se mesurer elle-même. Et il a tenu parce qu'il était
cohérent avec ce qu'il expliquait.

> **Un nom faux se cherche ; un mécanisme faux se raconte.** Un nombre ou un identifiant
> appellent une commande évidente — on sait quoi taper. Un mécanisme, lui, s'accorde avec
> le symptôme qu'il explique, donc rien n'invite à aller voir : il a la forme d'une
> compréhension, et c'est la forme qui fait s'arrêter.

**Le dépôt en portait déjà un second sans l'avoir rangé ici** — *« le brief initial disait
« prix mélangés » : c'était un contresens sur le null »*, au chapitre du contrôle du
hasard. Deux instances, aucune reliée, et la raison est dans le nom : l'énoncé disait
**fait**, et un mécanisme n'a pas l'air d'en être un. La commande ne change pas pour
autant — pour un mécanisme de séance, c'est la trace ; pour un mécanisme de code, c'est le
source. *Ce qui change, c'est qu'il faut penser à la taper.*

**LE DERNIER EST LE PLUS INSTRUCTIF PARCE QU'IL N'EST PAS UN NOMBRE**, et c'est lui qui a
forcé le renommage de la classe. Le brief du renommage disait « le dépôt GitHub : `vena` →
`vuna` » ; c'était un ordre de travail, pas un état du monde. Le distant, lui, répondait —
et il répondait *« This repository moved… /vena.git »*. Trois fichiers ont été passés au
nom futur sur la foi de l'intention.

**Et la règle 1 est dessous, une fois de plus** : on a pris une INTENTION (« ce dépôt doit
s'appeler vuna ») pour un RÉSULTAT (« ce dépôt s'appelle vuna »). Ce qui distingue cette
famille-ci des six de la table fondatrice, c'est que le résultat n'était pas seulement
observable *plus tard dans le code* — il était observable **tout de suite**, par une
commande d'une ligne, et personne ne l'a tapée.

### Sa forme la plus stable : le compte RECOPIÉ, qui se corrobore tout seul

Les membres du tableau ci-dessus remplacent un fait disponible par un fait tiré d'ailleurs
— d'un brief, d'une impression, d'un écran ouvert. Il existe une variante où le fait
plausible est **sa propre version antérieure**, et c'est la plus stable des deux, parce
que rien ne la contredit jamais.

Le cas mesuré : « neuf instruments rejoués ». Relu dans le registre de travail hors dépôt,
il apparaît **deux fois, à un jour d'écart, sur deux listes différentes** — cinq
concordants d'un côté, six de l'autre, et pas les mêmes instruments. Le nombre a été posé
une fois, puis reporté. Personne n'a recompté, parce qu'il n'y avait rien à contredire :
le second écrit disait la même chose que le premier.

> **Un nombre qui apparaît à plusieurs endroits n'est pas corroboré — il est peut-être
> recopié.** La répétition ajoute de la confiance sans ajouter la moindre mesure, et
> l'écart grandit en silence : chaque recopie éloigne le nombre de la liste qui l'a
> produit, jusqu'à ce que la liste change sans que le nombre bouge.

**Le test ne porte pas sur le nombre, il porte sur ce qui est DESSOUS** : *les deux
occurrences reposent-elles sur la même énumération ?* Ici, non — et c'est visible
immédiatement dès qu'on regarde les listes au lieu des totaux. Deux entrées d'accord sur
un total et en désaccord sur leur contenu ne sont pas deux mesures : c'est une mesure et
une copie, posées sur des populations qui ont dérivé.

**Et c'est ce qui rend le remède différent du reste de la famille.** Pour les autres
membres, le geste est *taper la commande*. Ici il n'y a pas de commande — il n'y a qu'une
énumération à reprendre. D'où la forme que ce fichier prescrit déjà pour les phrases sur
un ensemble : **relire la liste CONTRE le total.** Un total seul se recopie ; une liste
recopiée se fait démentir par la première comparaison.

**ET LE MOT « CONTRE » N'EST PAS DÉCORATIF — il manquait, et son absence a coûté une
erreur le 19 septembre 2026.** La consigne disait « écrire la liste à côté du total », et
elle a été suivie : *« Les six commits du jour : … »* suivi de **cinq** entrées. La forme
prescrite était satisfaite ; l'autocontrôle qu'elle devait apporter ne l'était pas, parce
qu'écrire les deux moitiés n'est pas les confronter. Compté après coup : six est le bon
nombre, et c'est l'énumération qui était courte d'un — le commit du lecteur de rapports.

> **Un total seul se recopie ; une liste seule rassure ; c'est leur CONFRONTATION qui
> mesure.** C'est le cas que la règle n'avait pas, et il est plus vicieux que le nombre
> juré : une liste ressemble à la preuve qu'on a compté. Le geste est donc DEUX choses,
> pas une — écrire la liste, puis la relire contre le chiffre.

### Sa variante la plus convaincante : un fait qui ÉTAIT vrai, lu sur un artefact

Les membres du tableau remplacent un fait disponible par un fait qui n'a **jamais** été
vrai — un brief, une impression, un écran ouvert. Celui-ci est différent, et c'est ce qui
le rend plus difficile à refuser : le fait plausible **a été juste**, et il est écrit noir
sur blanc sur le disque de quelqu'un.

Le cas, du 19 septembre 2026 : un fichier de sauvegarde créé en **août** porte l'ancien nom
du produit. On en a déduit que l'application propose encore ce nom par défaut à un nouveau
venu. Mesuré : `suggestedName: 'vuna-sauvegarde.json'` dans la source (`Vuna.dc.html:20067`),
dans l'artefact et dans ce qui est publié ; **zéro** occurrence de l'ancienne forme dans les
fichiers versionnés.

> **Un artefact date de la version qui l'a ÉCRIT, jamais de celle qui tourne.** Un fichier
> exporté, un `.ex5` compilé, une capture d'écran, une clé de stockage : chacun est un
> fossile, et il est d'autant plus convaincant qu'il est RÉEL. C'est un fait du disque de
> l'utilisateur, lu comme un fait du code.

**Et le dépôt agissait déjà dessus sans l'avoir nommé** — c'est l'absorption qui dit que le
nom est le bon (règle 8). Les trois étiquettes gelées, `ANCIENS_DOSSIERS`, `OUTILS_LUS` à
trois noms, le lecteur de journaux qui accepte les deux préfixes : ces listes existent
**parce que** les artefacts survivent à la version qui les a écrits. Elles le disent depuis
le côté du produit — *ce qu'on lit peut être vieux, donc on l'accepte* ; la voici depuis le
côté du diagnostic — *ce qu'on lit ne dit pas ce que le code fait aujourd'hui, donc on ne
le rapporte pas.*

Le geste est celui du chapitre parent — la commande existait et tenait dans une ligne. Ce
qui s'y ajoute est une question, parce qu'un artefact ne porte pas sa date en évidence :
**quelle version a écrit ça ?**

#### Et « est-ce juste aujourd'hui ? » n'est pas la question qui protège

Les deux se répondent, et elles ne rendent pas la même chose :

| la question | ce qui y répond | ce qu'elle laisse |
|---|---|---|
| « est-ce juste aujourd'hui ? » | un `grep` | un CONSTAT, vrai à la seconde où on le tape |
| « qu'est-ce qui l'empêche de redevenir faux ? » | une MUTATION | une garde, ou la preuve qu'il n'y en a pas |

Éprouvé ici : l'échange de `vuna-` vers l'ancien préfixe sur cette seule ligne fait tomber
le registre de `nom-vuna`, **en nommant le fichier, la ligne et le littéral exact**. Sans
cet aller-retour, on savait que le nom était bon ; on ne savait pas qu'il le resterait.

> **Un constat dit où l'on en est ; une garde dit ce qui ne pourra plus arriver.** La règle
> 2 est écrite pour les gardes neuves — elle vaut aussi quand on vient de RÉPONDRE NON à
> un défaut supposé, et c'est le moment où on y pense le moins : rien n'est cassé, donc
> rien ne semble à éprouver.

**Et l'inventaire qui en sort vaut mieux que la réponse, par sa STRUCTURE et non par son
total.** Douze noms de fichier téléchargés dans l'application :

| | ce que c'est | ce qu'ils demandent |
|---|---|---|
| **cinq en littéral** | `vuna-sauvegarde.json`, `vuna-chiffre-<date>.json`, `vuna-diagnostic-<date>.txt`, `vuna_top_<date>.csv`, `scripts-mt5-vuna.zip` | le registre — ce sont les seuls à relire au prochain renommage |
| **cinq dérivés** | le nom du robot, l'export au fil, la liste de symboles, la trace du Journal | rien : ils suivent leur source, qui a sa propre garde |
| **deux sans marque** | `instruments-a-telecharger-<date>.txt`, `a-telecharger.txt` | rien à protéger |

*Un total dit combien il y en a ; une partition dit lesquels peuvent diverger.* C'est la
même exigence que « écrire la liste à côté du total », un cran plus loin : la liste dit ce
qu'on a compté, la partition dit où regarder la prochaine fois.

### Le chapitre a fait rougir DEUX de ses propres lignes, dans la minute

Et c'est sa meilleure provenance, parce qu'elle ne se raconte pas : elle se relit. Les
deux appositions ci-dessous ont été écrites **dans ce chapitre-ci**, par celui qui venait
de le formuler, et corrigées avant le commit — par les deux commandes que le chapitre
prescrit.

| ce qui était écrit | ce que la commande rendait | le sens de l'erreur |
|---|---|---|
| « **cinq** chapitres prescrivaient cinq vigilances » | **trois** chapitres (`grep -n "^## "`) | **amplifie** — cinq vigilances, donc cinq endroits, sans vérifier |
| « écrit **une heure** plus tôt » | **huit minutes** (`git log --date=format:%H:%M:%S`) | **atténue** — et le vrai chiffre est plus frappant que le juré |

**La seconde va dans le sens qui AFFAIBLIT, et c'est la même répartition que la table
fondatrice** : deux amplifient, une atténue. Le chiffre juré n'est pas « plus fort », il
est **plus près de ce que l'auteur croyait** — ici, la durée ressentie d'un travail long.

*Le chapitre a donc attrapé ce qui venait après lui, y compris ce que son auteur n'avait
pas prévu.* C'est la figure du compte posé, appliquée à un chapitre entier plutôt qu'à un
nombre : une fois « la commande existait-elle ? » écrit en tête, chaque fait de la page
devient une valeur à recompter.

### Ce qui referme la famille est un geste unique, et c'est ce qui en fait une classe

**Trois** chapitres prescrivaient **cinq** vigilances — compter un ordinal, compter une
durée, compter une quantité, chercher la phrase avant de corriger, chercher la phrase
avant d'écrire. **C'est un seul geste**, et le voir permet de cesser d'en enseigner cinq :

> **Avant d'écrire un fait, demander s'il a une commande — et la taper.** Un nombre, un
> nom, un chemin, une date, un état du monde : s'il existe une ligne qui répond, la ligne
> coûte une seconde et le fait plausible coûte une livraison.

**Et le coût est celui que ce fichier documente partout** : un fait plausible a la forme
d'une réponse, donc il éteint l'enquête. Le nom du dépôt écrit d'avance n'aurait produit
aucun symptôme le jour où il a été écrit — un lien mort ne se plaint pas — exactement
comme la seconde copie d'une phrase, qui s'affiche juste jusqu'au jour où l'une des deux
bouge.

**CE QUI L'A ATTRAPÉ N'ÉTAIT PAS UNE VIGILANCE, ET C'EST LA PARTIE QUI COMPTE.** Le
registre de `nom-vuna` a refusé le retour à `vena` dans les deux liens, parce qu'une
occurrence hors des familles recensées le fait tomber. Il a été livré à **18:09:35** et a
mordu à **18:17:49** — **huit minutes**, relues dans `git log`, sur une erreur de bonne foi
de son propre auteur, pas sur une mutation posée exprès.

> **Une garde de registre gagne sa place le jour où elle refuse un correctif JUSTE faute
> de sa raison écrite.** C'est la bonne sévérité et non un excès : un correctif juste est
> indistinguable d'un oubli tant que personne n'écrit pourquoi. La garde ne sait pas
> lequel des deux elle voit — elle sait seulement que rien ne l'explique.

**Ce que ce chapitre NE fait pas** : il ne reprend l'énoncé d'aucun des quatre autres. Il
porte le nom, la liste et le geste ; chaque instance garde sa prose et son cas fondateur là
où elle est née. C'est la tolérance déjà déclarée pour l'absorption précédente, et son
seuil vaut ici mot pour mot — le jour où ce chapitre et l'un des quatre cesseront de se
paraphraser, l'un des deux devient un renvoi nu.

## L'indicateur choisit son univers sur un RÉSULTAT, jamais sur une intention

Deux corrections successives au même endroit, et **la première déplaçait le défaut au lieu
de le fermer** — il portait même le nom.

| Garde | Ce qu'elle cassait |
|---|---|
| `this.essai` | Payer sans rien importer donnait l'univers réel, dont **aucune série n'est livrée** : zéro mesure, indicateur muet, pendant que le non-payant en voyait un. **Payer donnait moins.** |
| « ai-je des séries à moi » | Vrai dès **un** dépôt, même d'un instrument absent de la carte sectorielle. L'indicateur se taisait pour quelqu'un qui en avait un la veille. **Déposer donnait moins** — et la régression venait du geste qu'on lui demande de faire. |

Les deux demandaient une **intention** (as-tu payé, as-tu déposé) pour prédire un
**résultat** (y aura-t-il quelque chose à mesurer). On relève donc l'univers réel, et
**seulement s'il ne rend rien** on retombe sur les dix séries d'exemple, `surExemples` à
vrai. La page dit alors « séries d'exemple, fenêtre fixe » — ça se lit ; un écran vide ne
se lit pas.

C'est le même déplacement que celui de la garde d'étanchéité : **décider après, pas
avant.**

## Le contrôle du hasard se corrige de la sélection

Le champion d'une carte est le MEILLEUR de N configurations mesurées ; son ancien
chiffre le comparait à des tirages faits sur lui seul — **un maximum contre une
moyenne**, et le hasard seul en fait passer une sur vingt à 5 %. Le verdict corrigé
(`scan-noyau.js`, `controleCorrige`) compare **deux maxima** : à chaque tirage, les
têtes de l'instrument sont rejouées avec des entrées au hasard et le meilleur rejeu
doit être battu par le meilleur réel. `p = (au + 1) / (tirages + 1)` — jamais battu en
500 tirages veut dire « moins d'une fois sur 501 », pas « jamais ».

**Le null tire les DATES D'ENTRÉE, il ne mélange jamais les prix.** Mélanger détruirait
la structure des prix ; tirer les dates la garde et ne détruit que le choix du moment —
la question posée est « le signal choisit-il mieux ses entrées que le hasard ». Le
brief initial disait « prix mélangés » : c'était un contresens sur le null, corrigé.

**N est l'union des têtes** — les trois meilleures par critère de classement,
l'ensemble dont un champion peut sortir — **fixée sur les lignes en mémoire, jamais sur
les lignes affichées** : un p qui bouge quand on déplace un curseur de filtre serait le
défaut corrigé, sous sa forme la plus sournoise. L'**ordre des entrées est partagé** :
le flux est réamorcé PAR TÊTE sur la graine du tirage — la corrélation de deux
configurations voisines est absorbée par construction (Bonferroni les compterait comme
indépendantes), chaque case (tête, tirage) est indépendante du découpage, donc les
plages se parallélisent et **pousser AJOUTE** (500 → 2 000 conserve les 500 premiers).

**Plus de bouton PAR CARTE.** Le contrôle se calcule pendant le scan (cœurs encore
chauds, ~+25 % mesuré : un tirage vaut 1,5 combinaison balayée). Le nombre de tirages
vaut pour toute la page, jamais pour une carte — réglable par carte, il permettrait de
pousser le seul instrument qui a failli passer. Le cadre « Contrôle du hasard » en lot
(et son verdict Benjamini-Hochberg) est parti avec : il posait la même question, sans
corriger la sélection.

**Et les scans ANTÉRIEURS ne se complètent plus tout seuls.** Le complètement démarrait
à l'ouverture de la page : sur un arriéré de 56 instruments, une demi-heure de
processeur saturé que personne n'avait demandée et que rien ne pouvait arrêter —
« l'ordinateur rame », le contraire de ce que le retrait du bouton visait. La page des
scans porte une ligne d'état — « N verdicts corrigés manquants · environ X » (durée
estimée sur la vitesse mesurée de la machine) — avec un geste pour lancer et un pour
arrêter : un travail dont l'utilisateur connaît le prix. Pendant qu'il tourne :
**l'export a priorité** (le complètement se met en pause sur le témoin `exportEnCours`,
au grain de l'instrument — une sauvegarde qui échoue parce qu'un calcul de confort
tournait est le pire compromis possible), et **les bougies se libèrent par instrument**,
pas à la fin — mesuré, le cache du fil principal croissait de façon monotone sur tout
l'arriéré pendant que les cœurs, eux, restaient constants (une écurie mémoïsée, bougies
remplacées). `scripts/app/fond-budget.test.mjs` tient les trois, par mutation.

**Une épinglée (« Voir ») hors têtes porte un p à UNE configuration, nommé « NON
corrigé »** : choisie à l'œil parmi des centaines, aucun N ne décrit cette sélection —
fabriquer une correction ferait croire qu'on a mesuré une sélection qu'on ne connaît
pas (règle 9). Son contrôle individuel se lance tout seul à l'épinglage.

**L'angle mort est déclaré AVEC sa magnitude, mesurée** (hors produit, 2 400
combinaisons × 200 tirages, ordre partagé) : le meilleur rejeu de la grille entière
dépasse celui des têtes d'**environ 13 R en moyenne à 2 400**, et l'écart croît en
logarithme de la taille — de l'ordre de **+100 R extrapolé à 64 000** (extrapolation,
pas mesure). Au-dessus du seuil convenu (25 R), la déclaration vit **dans le verdict
lui-même** — « se distingue — des têtes rejouées » — pas dans une infobulle. Une dette
déclarée sans sa gravité se classe toute seule en bas de la pile.

`scripts/app/hasard-corrige.test.mjs` tient les huit gardes, chacune éprouvée par
mutation — critère actif, +1, valeur de page, plages additives, ordre partagé (deux
têtes identiques doivent rendre le même tirage), bouton parti, épinglée non corrigée,
angle mort rendu.

## Cet univers d'exemple monte, et l'application le dit

Sur ces trois ans, la médiane des dix familles finit à **+39 %**, quatre au-dessus de
+100 %. Un balayage y trouvera facilement un résultat flatteur, et l'utilisateur
l'attribuera à son idée.

**Ce n'est pas un défaut de conception, et ça ne se corrige pas dans les données.** La
dérive attendue par la table des régimes vaut 14,3 % × σ — négligeable devant σ√3. C'est un
tirage du facteur commun, pas un biais : rééquilibrer la table des dérives serait un remède
faux sur une cause inexistante, et rechoisir la graine un réglage du marché (voir plus
haut).

**Ce qui reste est un devoir de dire.** La phrase vit à deux endroits de l'interface, là où
les séries s'expliquent — le bandeau des données de démonstration et l'infobulle du filtre
de provenance. C'est l'éthique de l'outil : **il mesure, il ne promet pas.** Et c'est moins
cher que n'importe quelle correction de données.

**On n'écrit rien.** Elles vivent en mémoire, engendrées à la demande, une famille à la
fois. Jamais dans le stockage de l'utilisateur, jamais dans « Exporter mes données »,
jamais dans la jauge. C'est ce qui les distingue d'un compte : un compte porte des
données, celles-ci n'en sont pas.

Les dix familles, avec leur séance, leur volatilité annuelle, leur bêta au facteur macro
commun, et leurs frais — qui suivent l'instrument, jamais le compte :

| Ticker | Groupe | Séance | Vol./an | β | Spread | Swap/an |
|---|---|---|---|---|---|---|
| VX-EUR | Devises | 24 h, lun–ven | 8 % | 0,3 | 0,012 % | −1,2 % |
| VX-YEN | Devises | 24 h, lun–ven | 10 % | 0,4 | 0,013 % | −1,8 % |
| VX-40 | Indices | 14 h, lun–ven | 17 % | 0,9 | 0,018 % | −3,4 % |
| VX-500 | Indices | 23 h, lun–ven | 15 % | 1,0 | 0,015 % | −3,1 % |
| VX-2000 | Indices | 23 h, lun–ven | 22 % | 1,2 | 0,030 % | −3,8 % |
| VX-OR | Métaux | 23 h, lun–ven | 14 % | −0,2 | 0,022 % | −3,6 % |
| VX-CU | Métaux | 23 h, lun–ven | 22 % | 0,8 | 0,045 % | −4,2 % |
| VX-TECH | Actions | 7 h, jours de bourse | 40 % | 1,4 | 0,035 % | −2,8 % |
| VX-CONSO | Actions | 7 h, jours de bourse | 15 % | 0,6 | 0,030 % | −2,6 % |
| VX-BTC | Crypto | 24 h, 7 j | 60 % | 1,1 | 0,080 % | −8,0 % |

Identifiant machine en minuscules sans accent (`vx-eur`), libellé humain en capitales —
la règle du nom, appliquée aux séries. Le ticker est manifestement inventé : personne ne
doit confondre « VX-500 » avec un indice réel.

**Un facteur macro COMMUN**, pondéré par le bêta, plus un bruit propre. Sans lui, un
portefeuille de dix lignes paraîtrait dix fois moins risqué qu'il ne l'est. VX-OR porte
un bêta négatif pour qu'une famille aille à contre-courant.

**Cinq régimes au calendrier fixe** — calme haussier, choc baissier, reprise, range,
tendance accélérée. Datés et non tirés au hasard : un backtest doit avoir quelque chose
à trouver et quelque chose à perdre, et la même histoire pour tout le monde rend une
capture d'écran discutable.

**Ils arrivent en rampe, et pas le même jour pour tous.** Le profil de régime était un
escalier COMMUN : à une heure connue d'avance, la même pour tout le monde à jamais, la
volatilité des dix familles triplait d'un coup. Un balayage de sortie de volatilité —
l'usage même de l'outil — se serait déclenché là, sur une propriété du générateur.

Deux corrections, qui ne font pas la même chose. Le profil est **lissé** : convolution
exacte de l'escalier par un cosinus surélevé sur ±trois semaines, donc aucun angle ni au
début ni à la fin de la rampe — la volatilité met six semaines à tripler, ce qu'une crise
met réellement. Et son entrée est **dispersée** : chaque famille démarre sa rampe avec son
propre décalage, de zéro à soixante jours, tiré de sa graine. C'est la dispersion qui
compte. Un vrai marché a des crises communes ; il n'a pas le maximum absolu de variance de
chaque instrument le même jour du calendrier. Le facteur macro n'est pas touché : les
corrélations de rendements (0,54 entre les deux indices) et le contre-courant de VX-OR
restent entiers.

**La dérive d'un régime se mesure en volatilités, pas en pour-cent.** La table est écrite
pour une référence à 15 % de volatilité annuelle, et chaque famille l'encaisse au prorata
de la sienne. Appliquée telle quelle, elle retirait 35 % par an à une devise annoncée à
8 % comme à une action annoncée à 40 % : la devise creusait 3,9 fois sa volatilité
annuelle quand les neuf autres tenaient entre 0,7 et 2,6 fois la leur. Le calcul passe par
le **logarithme** — −35 % multipliés par quatre donneraient −140 %, un prix négatif, et
des `NaN` dans toute la série.

`scripts/app/series-exemple.test.mjs` fait tourner LE VRAI générateur, extrait de la
source. **La garde qui compte est l'absence d'artefact exploitable** : |autocorrélation|
des rendements horaires < 0,08 à tous les retards de 1 à 48. Un motif répétable donnerait
à un balayage un « signal » qui n'existe que dans le générateur, et le premier
utilisateur qui le voit croirait que son idée fonctionne. Les autres gardes protègent le
produit ; celle-ci protège l'honnêteté de la démonstration.

**Et la garde jumelle, sur la variance.** L'autocorrélation mesure une dépendance dans la
MOYENNE des rendements : un changement de VARIANCE lui est invisible — 0,049 passait
pendant que l'escalier était là. La volatilité annoncée ne le voit pas non plus, c'est une
moyenne sur trois ans. La onzième garde mesure donc, toutes les douze bougies, le rapport
des volatilités réalisées sur les 240 bougies suivantes et les 240 précédentes, et exige
que **les dates des dix maxima s'étalent sur au moins trente jours** — 47,8 aujourd'hui,
deux sur l'escalier. Elle porte sur l'étalement et non sur la hauteur du rapport : un
seuil sur la hauteur interdirait la fonction (un régime de volatilité existe, c'est voulu)
en croyant interdire le défaut (qu'il soit synchrone). 240 bougies valent dix jours pour
une devise et trente-quatre pour une action — cette fenêtre compare deux régimes entiers,
et reste au-dessus de 1,8 quel que soit le lissage, mesuré sur cinq largeurs de fondu.

**Ce défaut ne se voit pas à l'œil, et on a perdu un tour à essayer.** Des fondus de 15,
45 et 75 jours donnaient des tracés indiscernables ; on en avait conclu qu'il n'y avait
rien. C'était mesurer la mauvaise grandeur : deux courbes indiscernables peuvent porter
des profils de variance opposés. La forme n'est pas la statistique.

## La transposition JS → MQL5 lit le marché à l'identique — et sur quoi ça repose

**PROVENANCE · RAPPORTÉE PAR L'UTILISATEUR, NON CONSIGNÉE DANS LE DÉPÔT.** Cette section
est écrite en premier lieu pour dire d'où elle vient. Quatre robots rejoués sur historique
complet — 40 000 barres, qualité 99 % — donnent **quasiment le même nombre de trades que
Véna**, trois légèrement en dessous et un légèrement au-dessus en résultat. La mesure a été
faite sur le poste de l'utilisateur ; aucun journal n'est entré dans `scripts/mt5/`, et les
chiffres exacts ne sont pas ici. Le statut honnête est donc **panne absente, rapportée** —
pas « établie » au sens des cinq gardes, qui exigerait une trace qu'un test peut relire.

**CE QUE LE COMPTE DE TRADES TRANCHE, ET C'EST LA QUESTION DU MOIS.** Deux implémentations
peuvent différer sur ce qu'elles DÉCIDENT ou sur ce qu'elles PAIENT, et un écart de R net
seul ne distingue pas les deux. Le **nombre** de trades, lui, ne dépend que des entrées :
même compte, mêmes entrées, donc même lecture du marché. C'était déjà le discriminant du
harnais — `references.mjs` porte ses avant/après au trade près (62 contre 503, corrigé en
502 contre 503 ; 420 → 352 contre 355 au testeur) — mais à l'échelle d'une configuration à
la fois, sur historique partiel. Sur quatre robots et l'historique complet, la réponse
tient : **l'écart résiduel n'est pas dans la décision, il est dans l'exécution** — spread
au remplissage, ordre des ticks dans la bougie.

### Un écart qui CHANGE DE SIGNE n'est pas un coût mal modélisé

C'est l'inférence qui clôt le dossier, et elle vaut au-delà de MT5.

> **Un biais de modélisation a un signe.** Un spread sous-estimé, une commission oubliée,
> un swap au mauvais sens : chacun pousse TOUS les cas du même côté. Quand quatre mesures
> se répartissent trois d'un côté et une de l'autre, ce qui reste est du bruit
> d'exécution, pas une erreur de modèle.

Le test se fait avant de chercher : *l'écart a-t-il un signe ?* S'il en a un, on cherche un
terme manquant et on le trouvera. S'il change de signe, chercher un terme manquant est une
chasse sans gibier — et c'est là qu'un mois se perd. La dispersion autour de zéro est une
information sur la NATURE de l'écart, pas seulement sur sa taille.

**Ce qui en ferait un fait du dépôt plutôt qu'un rapport**, et c'est peu : les quatre
journaux de ces rejeux dans `scripts/mt5/`, joints au jeu de référence. Le harnais sait
déjà les lire — `lireRapportMt5`, `apparier`, `comparer` — et `references.mjs` dit
explicitement que ses `nVéna`/`rVéna` sont « un repère historique, pas une cible ». Avec
les journaux, ils deviendraient une cible, et la phrase ci-dessus cesserait d'avoir besoin
de sa ligne de provenance.

### Ce qui reste, et ce que ça pèse

| | Ce que c'est | Ce que ça coûte |
|---|---|---|
| **Le cinquième robot** | il divergeait sur des données TRONQUÉES ; à refaire sur historique complet | un rejeu — et une divergence sur données tronquées n'est pas une divergence |
| **Les quatre filtres non transposables** | `fResist` ~10 lignes, `fPivot` ~8, `fNuage` plus de code sans machinerie neuve, `fZone` le seul dont la fidélité soit en jeu | une file d'attente, pas une panne — détaillée au-dessus de la table `INCONNUS` de `robot-mt5.js` |

**Aucun des deux n'est un défaut ouvert**, et c'est la raison d'être de ce tableau : sans
lui, « il reste deux choses » se lit comme deux pannes. Le premier est une mesure à
refaire, le second un chantier chiffré dont le refus actuel est le comportement JUSTE —
livrer un robot amputé de son filtre donnerait un nombre de trades différent de la mesure,
c'est-à-dire exactement ce que la section ci-dessus vient d'établir comme le critère.

## Un palier armé rend la bougie H1 indécidable — et c'est le signe du résultat qui bascule

**STATUT · CAUSE ÉTABLIE, MESURÉE dans le dépôt** pour les nombres ci-dessous ;
**RAPPORTÉE, NON REPRODUITE** pour les neuf rejeux du testeur qui ont mené ici (ils sont
sur le poste de l'utilisateur, aucun journal n'est entré dans `scripts/mt5/`).

Véna évalue ses paliers de sécurisation sur les **clôtures H1** ; MT5 déplace le stop et
le lit en **intrabar**. Sur les mêmes entrées, les sorties divergent. Le dépôt le savait
et l'avait écrit — au-dessus de `comparerMt5` — avec une conclusion qui a coûté des
semaines : *« un désaccord qui n'est pas une erreur »*. Vraie sur son domaine, elle se
lisait comme « il n'y a rien à regarder ».

**Mesuré sur les dix familles d'exemple**, même configuration, trois jeux de paliers :

| jeu de paliers | trades ambigus (moyenne) | familles où la convention CHANGE LE SIGNE |
|---|---|---|
| aucun | **0 %** | 0 / 10 |
| point mort à 25 % | **21 %** | **5 / 10** |
| paliers progressifs | **27 %** | **6 / 10** |

Et ça suit la volatilité : VX-EUR (8 %) reste à 3–4 % d'ambiguïté, VX-BTC (60 %) monte à
47–52 %. Sur VX-BTC avec un simple point mort : 83 trades ambigus sur 177, résultat
**−41 R ou +86 R** selon la convention d'ordre intra-bougie.

> **Sans palier, la convention n'est jamais invoquée ; avec un palier, elle décide du
> signe.** Ce n'est pas une marge d'arrondi qu'on mentionne en note — c'est la moitié des
> configurations dont le chiffre affiché a le signe opposé sous l'autre lecture.

**La bougie H1 ne PORTE PAS l'information, et aucun correctif ne l'y mettra.** Une bougie
qui monte assez pour armer le point mort puis redescend le toucher n'a pas dit dans quel
ordre. Trois issues, et c'est un arbitrage produit, pas une question technique :

| | Ce que ça fait | Ce que ça coûte |
|---|---|---|
| **borner** | afficher le résultat dans les deux conventions au-delà d'un seuil d'ambiguïté, et dire combien de trades sont indéterminés | deux chiffres là où l'utilisateur en lit un ; l'infobulle du produit conseille DÉJÀ de cocher les deux lectures et de lire l'écart — ce serait le calculer à sa place |
| **refuser** | ne pas proposer de paliers tant que la mesure ne peut pas les trancher | retire une fonction utilisée, et les paliers sont ce qui rapproche le backtest d'un vrai suivi |
| **descendre** | évaluer les paliers sous la H1 | demande des données que l'utilisateur n'exporte pas — et l'export MT5 sait écrire les colonnes d'ORDRE des extrêmes (`ah`/`ab`), que le moteur lit déjà (`ordreConnuA`), ce qui est une quatrième voie partielle et non mesurée |

**Le réglage qui décide de tout est celui que la ligne n'affiche pas.** `reglages`, la
chaîne de configuration d'une ligne de portefeuille, est bâtie sur l'entrée, la ligne, la
période, le stop et le R/R — **jamais sur la sécurisation**. Deux lignes dont l'une porte
des paliers et l'autre non s'affichent identiquement. Quand on a cherché à savoir
lesquelles des neuf lignes rejouées portaient un palier, la réponse n'était pas lisible à
l'écran : il fallait appeler `paliersDe(v)`. *Le seul réglage capable de renverser le
signe du résultat est absent de la ligne qui décrit la configuration.*

`scripts/mt5/lecture-ambigue.test.mjs` tient les deux bouts : le **zéro** sans palier —
sur lequel repose la réfutation de l'hypothèse intra-bougie telle qu'elle avait d'abord
été posée — et la **magnitude** avec palier, exigée sur le SIGNE et non sur un écart
quelconque. Éprouvé par mutation, et il a fallu trois essais : le tableau `ordre` et la
branche `else if (prudent)` sont l'un et l'autre inertes ; seul le drapeau à sa racine
fait bouger les nombres. Les deux premières mutations ont été vérifiées par LECTURE avant
d'accuser la garde — sans quoi elle passait deux fois pour aveugle à tort.

## Un champ qui nomme mal ce qu'il porte coûte plus cher qu'un champ absent

**Quatre fois, un libellé d'écran a envoyé chercher un défaut là où il n'y en avait
pas** — et le chapitre en porte trois de plus depuis, dont un où le nombre était
dérivé et irréprochable. Aucun n'était un bug : dans les quatre cas le code calculait juste, et c'est le
MOT au-dessus du nombre qui mentait sur la grandeur.

| Le champ | Ce qu'il annonçait | Ce qu'il portait | Ce que ça a coûté |
|---|---|---|---|
| « Depuis » | la date de début de la mesure | une constante écrite en dur | un tour |
| « les deux lectures s'accordent » | que le résultat est déterminé | une comparaison qui ne discrimine rien | un tour |
| « Période couverte » | la période du RÉSULTAT | la couverture des bougies en mémoire | deux tours — 7,7 ans contre 3,4 |
| « session … · N bougies écartées » | la séance du courtier et les bougies hors séance | la fenêtre horaire homogène de `nettoyer` et les bougies hors d'elle | une inférence fausse : la règle de séance du moteur disculpée par un nombre qui ne l'avait jamais mesurée |

La quatrième est la plus instructive parce qu'elle a produit un **raisonnement**, pas
seulement une confusion. Deux instruments à fenêtre étroite divergeaient d'un testeur,
deux à fenêtre pleine divergeaient aussi : « donc ce n'est pas la séance ». La
corrélation était réelle, la variable n'était pas celle qu'on croyait lire.

> **Un champ absent fait poser la question ; un champ qui ment y répond.** C'est
> pourquoi il coûte plus cher : personne ne vérifie une réponse qu'il a déjà.

**ET AUCUNE GARDE NE FERME CETTE CLASSE — il faut le dire.** Un libellé est de la prose,
et la règle 3 interdit d'ancrer une garde sur de la prose ; rien, dans un fichier, ne
dit qu'un mot désigne bien la grandeur calculée en dessous. Ce qui a été fait est plus
pauvre et honnête : le champ est **renommé jusque dans son identifiant** —
`sessionInfo` est devenu `fenetreHeuresInfo` —, et
`scripts/app/fenetre-nest-pas-seance.test.mjs` s'ancre sur **l'absence** (règle 14,
troisième issue) pour attraper la réintroduction du mot sur cette grandeur-là. Une
garde d'un cas, déclarée comme telle.

### Et deux comptes DISJOINTS lus l'un sous l'autre se fondent en un

Le cinquième cas n'est pas un libellé qui ment : ce sont deux libellés **justes** qui,
voisins, décrivent la même chose pour le lecteur. Sur la reprise d'US30 : « 0 bougies
hors de cette fenêtre » et, juste au-dessus, « 23 bougies hors séance sur 68 sautées ».
Les deux nombres sont exacts, les deux populations sont disjointes, et rien à l'écran ne
le disait.

La cause tient au mot choisi : chacun ne nommait que l'**exclusion**, qui est le terme
commun aux deux mécanismes — « écartées » d'un côté, « sautées » de l'autre, deux
synonymes pour deux choses. Le fait qui les sépare n'était écrit nulle part : celles de
la fenêtre sont **RETIRÉES de la série** — elles n'y entrent jamais, aucun de leurs
extrêmes n'est mesurable —, celles de la règle de séance y sont **PRÉSENTES** et
seulement sautées à l'évaluation.

Les deux infobulles le disaient déjà, et l'une niait explicitement l'autre. **Ça n'a
servi à rien : une infobulle ne s'ouvre pas toute seule, et c'est en lisant les deux
lignes ensemble qu'on les confond.** Le mot vit donc dans le texte rendu.

> **Deux grandeurs distinctes qui partagent un écran doivent se distinguer dans ce qui
> est LU, pas dans ce qui est survolé.** Et l'angle mort est déclaré dans la garde :
> elle tient les deux mots, pas la disposition — or c'est le voisinage qui produit la
> confusion.

**Le seuil pour construire une forme est posé d'avance**, comme celui des statuts : le
jour où un libellé mentira sur une grandeur qu'un test peut RECALCULER — un total, un
compte, une date lisible ailleurs —, la prise cesse d'être la prose et devient la
valeur. Une garde pourra alors vérifier que le champ « Période couverte » porte bien la
période du résultat, parce que les deux sont calculables. Tant que la grandeur n'est
lisible que dans le mot, il n'y a rien à quoi s'accrocher.

### Une DÉRIVATION garantit le nombre, jamais son sujet

C'est la forme la plus difficile à voir de cette famille, parce que **le chiffre est
irréprochable** : il ne vient plus de la mémoire de personne, il se recalcule à la
demande, et une garde le tient. Tout ce qui rendait les six autres suspects a disparu —
sauf le mot.

Le cas mesuré, le 19 septembre 2026. L'échantillon annoncé au client, longtemps écrit
« neuf » sans soutien, a été **dérivé de ce que `scripts/mt5/` contient** : quatre. Le
nombre est exact, la garde le lie au texte livré, et il monte tout seul au prochain
dépôt. Et la phrase disait **« quatre instruments rejoués »**, ce qui est faux : il y a eu
PLUS de rejeux, et ceux-là ont réellement eu lieu. Ce que le dépôt peut montrer, ce sont
quatre **rapports conservés**.

> **Une dérivation garantit le nombre, jamais son sujet.** Elle répond à « combien y
> en a-t-il ? » sans qu'on ait jamais posé « de quoi ? » — et un chiffre calculé sous une
> étiquette qui désigne autre chose se relit comme une mesure, avec toute l'autorité
> d'une mesure.

**Et l'angle mort déclaré ne suffisait pas, ce qui est l'enseignement.** La garde le
portait en toutes lettres — *« elle compte les rapports qui sont là, pas les rejeux qui
ont eu lieu »* — et c'était juste. Mais :

> **Un angle mort écrit dans la garde protège le lecteur du dépôt ; écrit dans le
> LIBELLÉ, il protège le client — qui ne lira jamais la garde.** Quand la phrase est
> rendue à quelqu'un d'extérieur, la déclaration doit voyager DANS le mot, pas à côté.

La grandeur dérivée a donc suivi le mot : on compte les **rapports**, pas les
instruments. Les deux valent quatre aujourd'hui et se sépareraient dès que deux rapports
porteraient le même instrument — c'est celle que la phrase NOMME qui décide.

### Un correctif juste sur sa CIBLE et faux sur ce qu'il TOUCHE

Les cinq cas ci-dessus sont des libellés qui mentaient dès leur écriture. Le sixième est
différent, et il coûte plus cher parce qu'il naît d'une réparation :

> **Le correctif était juste sur ce qu'il visait et faux sur ce qu'il touchait.**

Le cas mesuré : la colonne de période rendait un tiret muet qui couvrait trois causes.
Le correctif l'a branchée sur les trades MESURÉS — juste, le tiret a disparu, les trois
causes se nomment. Mais « les trades mesurés » est la période **active**, et le libellé
au-dessus disait « **Période mesurée** ».

**Le libellé n'est pas devenu faux : il était JUSTE, et le correctif en a fait un
mensonge.** Vérifié dans l'historique plutôt que de mémoire — il existait à deux
endroits avant le changement, et il décrivait correctement les bornes enregistrées. Une
ligne de code a changé de SOURCE ; pas une ligne du libellé n'a bougé ; et c'est le
libellé qui s'est mis à mentir.

> **Quand un correctif change la SOURCE d'une valeur affichée, le libellé qui la nomme
> entre dans le diff — même si aucune de ses lignes n'a bougé.** Un diff ne montre que
> ce qu'on a écrit ; il ne montre jamais ce qu'on vient de rendre faux ailleurs.

C'est le **miroir exact de la règle 14** : là, on cartographie la prose qui entoure ce
qu'on SUPPRIME ; ici, le libellé qui surmonte ce qu'on REBRANCHE. La question à se poser
au moment de rebrancher tient en une ligne : *qu'est-ce qui, à l'écran, PROMET ce que
cette valeur était ?*

**Et aucune garde ne ferme cette classe non plus** — pour la même raison que la section
ci-dessus : un libellé est de la prose. Ce qui a été fait est plus pauvre et vérifiable :
les trois périodes portent chacune son nom **jusque dans les identifiants** (`mesT0`,
`actT1`), et `rAn-divise-par-la-mesuree` lit ces noms dans le calcul des bornes. Un
lecteur qui rebranche `mesT0` sur une borne active écrit désormais une contradiction
visible à la ligne même où il la commet.

### Son application immédiate : un zéro se rend avec son dénominateur

La même séance a livré un compteur — les bougies sautées par la règle de séance qui
franchissaient un niveau — et il portait le même défaut d'un cran plus bas : **son zéro
avait deux sens**. « La règle n'a jamais joué sur cette série » et « elle a joué des
milliers de fois sans rien coûter » s'écrivaient tous deux `0`, et le bandeau ne
paraissait QUE lorsque le compte était non nul — si bien que son absence valait aussi
« pas encore mesuré ». Trois états, un seul rendu.

> **Une sonde qui peut rendre zéro prouve d'abord sa PRISE.** C'est déjà la règle du
> dépôt pour les sondes de test — moins de quinze éléments cliquables fait tomber la
> tournée des gestes plutôt que de laisser passer un zéro qui n'a rien regardé. Elle
> vaut mot pour mot pour une mesure posée dans le PRODUIT.

`sautesVues` est cette prise : toute bougie sautée en position, franchissement ou non.
Les trois états se rendent tous les trois, en toutes lettres — et celui qui DISCULPE la
règle (« elle a joué et n'a rien coûté ici ») est celui qui referme la question, donc
le moins dispensable des trois.

## Ce que la fenêtre horaire homogène RETIRE, le moteur ne peut pas le voir

**STATUT · PANNE OBSERVÉE, MÉCANISME NON PROUVÉ.** Le fait est mesuré chez l'utilisateur
sur sept instruments, robots réexportés, garde de symbole active, périodes alignées et
**aucune sécurisation sur aucune ligne** — donc les 21 % d'ambigus des paliers ne
s'appliquent à aucune. Le mécanisme est lu dans le source ; aucun journal n'est entré
dans `scripts/mt5/`.

| écartées | trades V → MT5 | réussite V → MT5 |
|---|---|---|
| 0 · GOLD | 465 → 463 | 49,5 → 48,0 (**−1,6**) |
| 0 · US30 | 141 → 141 | 34,8 → 32,6 (**−2,2**) |
| 0 · SILVEREURO | 157 → 163 | 36,9 → 33,7 (**−3,2**) |
| 912 · HongKong50 | 162 → 161 | 51,9 → 44,7 (**−7,2**) |
| 895 · IBEX 35 | 91 → 89 | 41,8 → 30,3 (**−11,5**) |

**La séparation est binaire et sans contre-exemple**, et ce qui la rend décisive n'est pas
l'ordre : c'est que le nombre **absolu** de trades basculés est le même des deux côtés,
dix à douze. 12/162 = 7,2 %, 10/91 = 11,5 % — l'écart en points n'était que le
dénominateur. Ce n'est plus une grandeur qui classe, c'est une prédiction qui tombe juste.

`nettoyer` retire les bougies hors fenêtre horaire **avant toute mesure** : leur extrême
n'entre ni dans `h`/`l` ni dans `eh`/`eb`, et `const exH = df.eh || df.h` est tout ce que
le backtest regarde. Un stop touché pendant ces heures n'existe pas pour le moteur ; un
testeur, sur son graphique H1 complet, le voit. **Un perdant devient gagnant — biais d'un
seul signe.**

### IBEX et HongKong50 ne sont pas la même panne — l'arithmétique les sépare

**⚠ CE QUI SUIT A ÉTÉ CALCULÉ SUR UN R FAUX, et le résidu de 10 R n'existe pas.** Le net
MT5 de HongKong50 a été converti au taux de l'écran Véna (100 €/R) sur un test à dépôt de
20 000 € : +4,00 R annoncé pour +14,8 R réels. La décomposition ci-dessous est gardée
parce que sa MÉTHODE tient et qu'elle a donné le bon résultat sur IBEX — le résidu nul
y est vrai —, mais la ligne HongKong50 est morte. Voir « Les trois formes ont été
RÉFUTÉES » plus bas, qui porte les chiffres justes et le mécanisme qui reste.

**PROVENANCE · DÉRIVÉE DES CHIFFRES RAPPORTÉS, calcul fait DANS LE DÉPÔT.** Rien de
mesuré ici : les cinq nombres par instrument viennent des rapports de l'utilisateur.
**Hypothèses écrites** : réussite = part de gagnants sur le total, aucun neutre, R/R
constant sur la ligne, aucune sécurisation (établi — les sept lignes portent « Aucune
sécurisation »).

On ajuste le R/R sur le côté Véna, puis on demande ce que la réussite MT5 **implique**
comme résultat. Si l'écart de R n'est qu'une conséquence de l'écart de réussite, le
résidu doit être nul :

| | R/R ajusté | MT5 prévu | MT5 observé | résidu | écart total |
|---|---|---|---|---|---|
| IBEX 35 | 2,355 | +1,46 R | +1,60 R | **+0,14 R** | 35,0 R |
| HongKong50 | 1,431 | +13,96 R | +4,00 R | **−9,96 R** | 38,4 R |

**Balayé sur la boîte d'arrondi** (réussites au dixième de point, R au dixième de R) :
IBEX reste dans [−0,21 ; +0,48] — *compatible avec zéro* ; HongKong50 dans
[−10,41 ; −9,50] — *exclut zéro*, cinq fois la bande d'arrondi.

> **Sur IBEX, la totalité de l'écart est « quels trades ont gagné ». Sur HongKong50,
> les trois quarts le sont et un quart ne l'est pas.** Les deux instruments ont ~900
> bougies écartées et ont été traités comme une seule panne ; ils portent deux termes.

Ce que ça **élimine** sur IBEX, et c'est la moitié utile : aucun terme de coût. Un
spread sous-estimé, une commission oubliée, un swap au mauvais sens changeraient la
valeur de CHAQUE trade, donc laisseraient un résidu. Il n'y en a pas. La divergence
d'IBEX est entièrement une divergence de **résolution** — un perdant devenu gagnant,
ce qui est exactement la forme d'un stop touché hors de portée du moteur.

Ce que ça **ouvre** sur HongKong50 : un second terme de 10 R qu'aucune des trois
candidates ne nomme. Il vaut 26 % de l'écart et il est absent de l'autre instrument
divergent. Les suspects se lisent dans les hypothèses ci-dessus, et ils sont
**vérifiables à l'écran, sans rejeu** : des trades neutres du côté MT5 (le compte de
réussite les mettrait au dénominateur sans qu'ils rapportent de R), ou un R/R qui n'est
pas constant sur la ligne. **Tant que ces deux-là ne sont pas lus, chercher une
troisième cause de fond serait chercher au-delà de ce qui est déjà mesurable** — la
règle du refus : la donnée manque-t-elle, ou personne n'est-il allé la chercher ?

#### Les trois formes ont été RÉFUTÉES — et le terme de 10 R n'existait pas

**PROVENANCE · RAPPORT MT5 COMPLET, RAPPORTÉ — lu par l'utilisateur, non entré dans
`scripts/mt5/`.** Les trois prédictions avaient été chiffrées d'avance pour être relues
telles quelles. Elles tombent toutes les trois, et le paragraphe est gardé entier parce
que c'est ce que cet exercice vaut.

| la prédiction | ce que le rapport porte | verdict |
|---|---|---|
| **A** 11,6 neutres côté Véna | 72 + 89 = 161, **aucun neutre** | mort |
| **B** gain moyen MT5 1,293 R | 333,35 / 231,22 = **1,442 R** — MT5 fait *mieux* | mort |
| **C** perte moyenne −1,112 R | **−1,000 R** après normalisation | mort |

**Et C meurt par le chiffre écrit d'avance** — « elle est fausse dès que la perte moyenne
MT5 rend −1,00 ». Elle rend −1,00. C'est la seule chose que la prédiction a bien faite.

##### Le terme de 10 R était une erreur de DÉNOMINATEUR, en deux couches

Il n'y avait rien à expliquer, et c'est pire qu'une hypothèse fausse : une grandeur
fabriquée par la conversion, autour de laquelle trois formes ont été construites.

1. **Le dépôt du test est 20 000 €, pas 10 000.** Le net de +3 422,35 € a été converti au
   taux de l'écran Véna — 100 €/R. **+4,00 R annoncé pour +14,8 R réels.**
2. **`InpRisquePct` porte sur l'ÉQUITÉ COURANTE.** La perte moyenne vaut −231,22 € et non
   −200 : l'équité monte de 20 000 à 23 422, sa moyenne sur la course vaut ≈ 23 100, dont
   1 % fait 231 €. **À l'euro près.**

Lu contre 200, ce −231 se présente comme un **dépassement de stop de 11 %** — la signature
d'un gap —, et l'instrument avait neuf cents bougies écartées pour l'expliquer.
L'hypothèse était cohérente, chiffrée, cohérente avec l'autre instrument, et **entièrement
produite par un dénominateur faux.**

> **Un risque en pourcentage de l'équité courante n'a pas de R constant sur la course.**
> Le prendre pour constant fabrique un dépassement de stop qui n'est que de la
> capitalisation.

**La conversion en R se dérive du RAPPORT, jamais de l'écran de l'application.** Le rapport
porte le dépôt, le pourcentage de risque, et surtout la **perte moyenne réalisée**, qui est
la mesure directe d'un R quand le risque suit l'équité. Lire le R sur l'écran, c'est encore
la règle 8 : `capital × risquePct` est un **lieu** — ce que les réglages annonçaient au
départ ; la perte moyenne encaissée est la **propriété** — ce qu'un R a réellement coûté.

`euroParR` préférait déjà la médiane des stops réels et ne retombait sur le nominal qu'en
dernier recours — le code avait raison, c'est un humain qui a divisé de tête. Ce qui a été
retiré est le `eurParR: 200` de `CADRE`, que **plus aucune ligne ne lisait** et qu'un
lecteur a cru. `scripts/mt5/conversion-en-r.test.mjs` tient les trois : plus de €/R
constant dans le jeu de référence, le nominal en dernier recours, et une course qui
capitalise doit rendre 231 et non 200. Son angle mort est écrit : **elle ne peut rien
contre quelqu'un qui lit un chiffre sur un écran et le divise de tête**, ce qui est
exactement ce qui s'est produit.

##### Ce qui reste après la correction : UN mécanisme, entièrement chiffré

| | réussite | gain moyen | perte moyenne | net |
|---|---|---|---|---|
| Véna | 51,9 % (84/162) | 1,431 R | −1,000 R | +42,2 R |
| MT5 | 44,72 % (72/161) | **1,442 R** | **−1,000 R** | +14,8 R |

**Les trois multiples concordent.** Gain moyen, perte moyenne, compte de trades : tout
s'aligne. Seule la réussite diffère, de sept points — **douze trades**.
12 × (1,431 + 1,000) = 29,2 R pour un écart observé de 27,4 R : **94 % expliqué par douze
trades qui basculent, et par rien d'autre.** Même forme sur IBEX, dix trades.

C'est le nombre ABSOLU que la prédiction de `bougies-cachees` annonçait — dix et douze —
et que le compteur n'a pas rendu (5 et 28, direction inversée). La cible est retrouvée ;
le compteur ne la touche toujours pas.

##### Le candidat qui coûtait une lecture de source, et la réponse est NON

`InpPasDebutSemaine = true` sur ce rapport : le robot refuse le dimanche et le lundi avant
02:00. Véna applique-t-il la même règle ? **Oui, et sur la même horloge** — relu dans les
quatre fichiers :

| | ce qui est lu |
|---|---|
| `robot-mt5.js` | `TimeToStruct(TimeCurrent(), …)` → heure **serveur** du courtier |
| `Export_H1_Vuna.mq5` | `TimeToString(r[i].time, …)` → la même, en horloge murale |
| `moteur.js` · `lireCsv` | `Date.UTC(an, mois-1, jour, h, m)` → cette horloge murale, **rangée en UTC** |
| `moteur.js` · `executable` | `getUTCDay()` / `getUTCHours()` → **ressort l'heure serveur** |

**L'accord ne tient pas parce que les deux seraient en UTC — aucun des deux ne l'est.** Il
tient parce que `lireCsv` range l'heure du serveur dans un champ UTC et que `executable`
l'en ressort telle quelle : **deux erreurs qui s'annulent exactement**. C'est ce qui rend
la garde nécessaire — corriger l'une des deux « pour bien faire » romprait l'accord sans
qu'aucun test ne rougisse. `scripts/mt5/meme-horloge.test.mjs` lie les quatre maillons,
comme `manifeste-version` liait trois chemins : le défaut ne serait dans aucun d'eux pris
isolément, il serait dans leur **désaccord**.

##### Le cinquième candidat — la qualité à 96 % — est RÉFUTÉ

**PROVENANCE · RAPPORTÉE.** Il avait été posé comme « ordre de grandeur compatible, pas
mesure » : 4 % de barres modélisées contre 7,5 % de trades à faire basculer, et une barre
modélisée porte des extrêmes synthétiques. L'épreuve écrite d'avance était de relancer en
qualité 99 %.

M1 téléchargé — **1 956 665 bougies depuis le 2 janvier 2019**, bien au-delà de la période
testée, écrites par l'export du dépôt. Rejeu : **qualité 96 %, net +3 422,35, 29 988
barres — identiques au centime**, barre de qualité verte sur toute la durée. Les trous
sont diffus et ce sont ceux de l'historique réel du courtier. Le candidat meurt comme les
quatre autres.

##### La sixième piste — la MODÉLISATION du testeur — se coupe en deux, et une moitié est déjà morte

Le rapport porte « Délais : pas de latence, exécution idéale » et **« Modélisation :
1 minute OHLC »**. En ce mode, MT5 ne connaît pas le chemin du prix dans la minute : il le
synthétise. L'idée est donc que **les deux côtés devinent**, chacun à sa granularité.

**La moitié « ordre des extrêmes » est réfutée DANS LE DÉPÔT, sur cette configuration
exacte.** `lecture-ambigue` mesure les quatre couples SL/RR des lignes rapportées — dont
**0,7/1,5, celui du robot HongKong50** — sur les dix familles, sans palier : **zéro bougie
ambiguë**, et la raison est une magnitude, pas un hasard de série. La bande stop→objectif
vaut 1,75 % du cours et **dépasse l'amplitude d'une H1**.

> **Si aucune H1 ne contient les deux niveaux, aucune M1 qu'elle contient ne les contient
> non plus.** L'ordre à l'intérieur de la minute ne peut donc arbitrer entre stop et
> objectif ni chez Véna, ni chez MT5. Et les extrêmes d'une M1 sont RÉELS dans les deux
> modes — « chaque tique » n'ajoute aucun extrême, il n'ajoute qu'un chemin. *Le fait
> qu'un niveau soit touché est identique ; seul l'ordre change, et l'ordre ne décide de
> rien ici.*

**La moitié qui reste vivante est le PRIX D'ENTRÉE, et c'est elle que le rejeu teste.** En
« 1 minute OHLC », `OnTick` ne se déclenche qu'aux quelques tiques synthétisées de chaque
minute ; le contrôle de spread (`InpSpreadMaxPct`) et le remplissage tombent donc à des
instants et des prix différents. Stop et objectif étant des POURCENTAGES du prix d'entrée,
une entrée décalée déplace les deux niveaux — et fait basculer les trades marginaux. Douze
sur 161 est exactement l'ordre de grandeur d'un effet de bord d'entrée.

**Ce que le rejeu « tiques réelles » tranchera, et ce qu'il ne tranchera pas :** il mesure
l'effet du prix d'entrée. Il ne mesure pas l'ordre des extrêmes, qui est déjà réfuté — donc
**un résultat inchangé ne renvoie pas la piste à l'ordre**, il la ferme entière.

##### LE COURTIER SE CONTREDIT LUI-MÊME — et ça retire au testeur son statut de référence

**PROVENANCE · RAPPORTÉE, relevée au journal du testeur avant l'arrêt du rejeu.** Le rejeu
en tiques réelles a été interrompu (voir ci-dessous), mais il avait déjà écrit ceci :

```
real ticks discarded for 51 minutes
50 249 tick prices mismatch for 51 minute bars
```

**L'historique de TIQUES de FxPro contredit ses propres bougies M1.** Cinquante mille prix
en désaccord, sur cinquante et une minutes, pour le même symbole chez le même courtier.

> **Deux modélisations du même courtier sur le même symbole ne donnent pas le même prix.**
> Le mode « tiques réelles » n'aurait donc pas été une référence *plus vraie* — seulement
> **différemment fausse**. Et un arbitre qui se contredit lui-même ne peut pas trancher un
> écart de douze trades.

C'est la conclusion la plus large du chantier, et elle vaut d'être dite comme telle :
**le testeur MT5 a servi d'arbitre à tout ce dossier, et il vient de montrer qu'il n'en
est pas un au niveau de finesse qu'on lui demandait.** Un écart de douze trades sur 161
est du même ordre que le bruit que le courtier porte entre ses propres jeux de données.

**Ce que ça ne dit PAS**, et il faut le border : ça ne disculpe pas le moteur, ça retire un
chemin de preuve. Les douze trades existent toujours ; ce qui disparaît, c'est l'idée
qu'une modélisation plus fine les expliquerait.

##### Le coût du rejeu est venu d'une ligne du robot, et il est dans le produit depuis

**En mode tiques réelles, `TauxVersCompte` fait télécharger tout l'historique de tiques de
la paire croisée** — une ligne `download` par mois, de 202306 à 202510 pour EURHKD. Mesuré
chez l'utilisateur : **32 secondes devenues 27 h 57 estimées**. Le rejeu a été arrêté.

**Le comportement est le bon et ne change pas.** Sans cette sélection, la conversion échoue
et le robot retombe sur le refus — un instrument du portefeuille sans une seule position,
ce que « Refuser est la moitié du travail » a précisément fermé. Et la note du dépôt disait
« c'est peu » : **c'était vrai en mode OHLC, et cette phrase était une garantie vraie sur
son domaine lue comme générale** — la famille de `netlify.toml`, une fois de plus.

Ce qui manquait n'était pas un garde-fou, c'était de **pouvoir lire la cause** : mille
lignes de téléchargement sans une ligne disant pourquoi. Le robot annonce donc la paire
**avant** de la sélectionner, nomme le mode qui rend le coût explosif, et donne le remède —
ajouter la paire à l'Observation du marché avant le test.

> **Un coût qu'on ne peut pas anticiper se dit AVANT d'être engagé.** Après, ce n'est plus
> une information, c'est une autopsie — et le remède n'est actionnable qu'avant.

`dimension-devise.test.mjs` tient l'**ORDRE des deux gestes**, pas la présence du mot : un
message posé après `SymbolSelect` satisferait une recherche de chaîne et ne servirait à
rien. Éprouvé par mutation — déplacer le `PrintFormat` d'une ligne fait tomber la garde.
Son angle mort est déclaré : elle ne peut pas vérifier que la ligne sera **lue**.

##### C'EST LA PRÉDICTION QUI AVAIT TORT, PAS LE COMPTEUR — mesuré, sans rejeu

La question est restée ouverte trois jours : *5 et 28 avec une direction inversée, sur une
population que le compteur seul mesure — est-ce la prédiction qui se trompait, ou lui ?*
Elle ne coûtait pas un rejeu ; elle était dans le dépôt, et personne ne l'avait posée.

**Les cinq gardes existantes vérifiaient qu'il EXISTE, qu'il a une prise, qu'il SUIT la
mèche, qu'il survit à la découpe et au stockage. Aucune ne vérifiait que son NOMBRE est le
bon.** C'est la forme que ce dépôt connaît : une garde qui mesure que quelque chose bouge
n'a jamais mesuré que ça bouge JUSTE.

La mesure est un **recompte indépendant**, écrit depuis la définition et non depuis le
code : *une bougie écartée dont l'instant tombe pendant une position ouverte, et dont
l'extrême franchit le stop ou l'objectif de CE trade.* Le compteur du moteur avance un
pointeur en flux dans la boucle principale et lit `enPos` au passage ; le recompte
parcourt par TRADE et redérive l'objectif au lieu de le lire. Deux implémentations sans
rapport.

| mèche | vues | stop | objectif | les deux | |
|---|---|---|---|---|---|
| 0 % | 25 | 2 | 1 | 0 | **accord** |
| 0,5 % | 25 | 10 | 13 | 0 | **accord** |
| 3 % | 25 | 0 | 0 | 25 | **accord** |

**Le compteur compte juste, sur les quatre nombres et aux trois niveaux.** Donc l'hypothèse
des bougies écartées meurt **sur sa propre mesure** et non sur un doute — c'est la
meilleure façon dont une hypothèse puisse mourir, et c'est le compteur lui-même qui l'a
tuée.

**L'angle mort est déclaré et il est réel** : un recompte indépendant attrape une erreur
d'IMPLÉMENTATION — pointeur mal avancé, borne de position décalée, sens inversé (vérifié
par mutation : inverser les extrêmes sur l'objectif fait tomber la garde). Il n'attrape pas
une erreur de DÉFINITION partagée : si « franchir » devait se lire autrement, les deux se
tromperaient ensemble et s'accorderaient quand même. La portée est donc exactement ce
qu'elle annonce — **le compteur fait ce qu'il DIT faire**.

> **Vérifier qu'une mesure BOUGE n'est pas vérifier qu'elle compte JUSTE**, et c'est la
> seconde qui décide si une hypothèse est morte ou si c'est l'instrument. Le départage
> demande une seconde implémentation, écrite depuis l'énoncé — pas depuis la première.

**Et l'énoncé général est plus large que ce cas** : c'est la règle de la PRISE, déplacée
du rapport vers la réfutation.

> **Une prédiction réfutée par un instrument non vérifié ne réfute rien.**

Le dépôt exigeait déjà qu'une sonde prouve sa prise avant de RAPPORTER — `sautesVues`
pour `sautesSortie`, `cachesVues` pour `cachesStop`, quinze éléments cliquables avant un
verdict de tournée. Il manquait la moitié symétrique : **qu'un instrument prouve sa
justesse avant de TUER quelque chose.** Un compteur non vérifié qui contredit une
prédiction laisse les deux debout, et c'est le pire état d'un dossier — on croit avoir
éliminé, on a seulement échangé une incertitude contre une autre.

Le coût de l'oubli se lit ici : la prédiction est tombée le 18 septembre, et l'hypothèse
est restée dans les limbes **trois jours** — ni vivante ni morte — faute d'une mesure qui
tenait dans une heure et ne demandait aucun rejeu.

### Le candidat précédent est mort par son propre dénominateur

Les bougies sautées par `releve(i)` allaient à l'**envers** du symptôme :

| | sautées / franchissantes | écart |
|---|---|---|
| SILVEREURO | 413 / **53** | −3,2 |
| GOLD | 79 / **58** | −1,6 |
| IBEX 35 | 21 / **6** | −11,5 |

Cinquante-trois franchissements non relevés pour 3,2 points ; six pour 11,5. **Les deux
populations sont disjointes** — `releve` saute des bougies *présentes* dans la série,
`ecartees` compte celles qui n'y sont *jamais entrées* — et une seule explique quoi que
ce soit. C'est le dénominateur, posé la veille pour donner sa prise au zéro, qui a tué
l'hypothèse qu'il servait.

### Ce qui est livré, et la prédiction écrite AVANT la mesure

`nettoyer` retient les trois seules colonnes utiles des bougies écartées — l'instant et
les deux extrêmes, une quinzaine de kilo-octets pour neuf cents bougies contre plus d'un
mégaoctet pour la série. `backtesterSuivi` compte celles qui, **en position**,
franchissaient le stop ou l'objectif, réparties **stop / objectif / les deux**, la
troisième case à part parce que rien ne dit lequel d'abord.

**La prédiction est dans la garde, pour être relue telle quelle** : environ **dix** sur
IBEX, **douze** sur HongKong50, **zéro** sur GOLD, US30 et SILVEREURO. Si le compteur rend
ça, le statut passe à « cause établie » ; sinon c'est la prédiction qui tombe, par écrit.

**Et le troisième état est celui qu'on oublie.** Une série enregistrée avant cette version
ne porte pas les colonnes : `cachesDispo` vaut faux, et le bandeau dit « réimportez le
CSV » au lieu d'annoncer zéro. Confondre les deux disculperait la fenêtre sans qu'aucune
mesure ait eu lieu — sur le chemin même qu'on instrumente pour trancher.

**La série de banc porte le défaut qu'aucune famille d'exemple n'a** : les dix cotent les
mêmes heures toutes les années, donc `fenetreHomogene` n'y écarte rien et la propriété y
serait inéprouvable. Le banc fait coter 9 h→17 h en 2020 et 8 h→17 h en 2021 ; l'heure 8
est écartée, et c'est là qu'on pose les mèches. Zéro octet chez l'utilisateur — la même
règle que l'échelle des prix.

**Une assertion de cette garde n'est pas tombée sous mutation, et c'est comme ça qu'on l'a
su.** Elle bornait la découpe au 1ᵉʳ janvier 2021 ; l'amorce de 400 jours reculait la
borne à novembre 2019, donc aucune bougie n'était coupée et l'assertion passait avec ou
sans le filtre. La borne de FIN, elle, coupe — et la garde exige désormais qu'elle coupe
avant de vérifier ce qu'elle a coupé.

## Ce qu'un robot MQL5 a BÂTI n'est pas ce qu'il a FAIT TOURNER

**L'en-tête du `.mq5` décrit l'export ; les `input` décrivent le lancement, et MT5 les
mémorise.** Le testeur retient le dernier jeu utilisé par expert, un fichier `.set` le
remplace, l'onglet Réglages se règle à la main — et rien, dans la sortie du robot, ne
disait lequel avait servi. Un test lancé avec des paliers hérités d'un lancement
précédent coupe ses gagnants et adoucit ses perdants ; l'écart se lit alors comme un
défaut du moteur, et on le cherche dans le moteur.

Les deux lignes `VÉNA ENTRÉES EFFECTIVES` à `OnInit` rendent le cas décidable depuis le
seul journal. `scripts/mt5/journal-dit-ce-qui-decide.test.mjs` tient la surface par un
**registre** — la forme de `boucles-mql5`, et pour la même raison : « cette entrée
décide-t-elle ? » n'est pas une propriété du texte, `InpTaillePolice` et
`InpSlippagePoints` ont exactement la même forme. Chaque entrée est inscrite avec sa
raison, et la garde échoue **dans les deux sens**.

### Et un robot ne rend jamais des chiffres qui RESSEMBLENT à une mesure

`nomRobot` compose le nom du fichier avec `cfg.sym` : un `.ex5` nommé
`Vuna_<compte>_Spain35_…` ne peut être né que d'un export de Spain35. Posé sur un
graphique d'un autre instrument, il tradait quand même — il lit `_Symbol`, pas le
symbole mesuré — et n'imprimait qu'un `ATTENTION` parmi dix lignes de démarrage. Les
chiffres obtenus avaient la forme d'une mesure de l'instrument affiché sans en être une.

C'est le pire mode de panne du dépôt, sous sa forme la plus coûteuse : **une mesure
fausse qui a l'air d'une mesure**, produite par la machine qui sert d'arbitre à tout le
chantier MT5. L'avertissement est donc devenu un **refus** — `INIT_FAILED` —, avec une
porte explicite pour le seul cas légitime : le même instrument sous un autre nom chez
le courtier (« GOLD » contre « GOLD.r »), qui demande de cocher `InpSymboleLibre`.

> **Un accident ne doit pas pouvoir se produire sans un geste ; un choix doit rester
> possible en un clic.** Entre les deux, un avertissement imprimé ne fait ni l'un ni
> l'autre.

#### Et le lendemain, la garde était désarmée — parce qu'elle refusait le cas NORMAL

Le refus comparait les chaînes BRUTES, et ce courtier écrit ses indices `#HongKong50`
là où la mesure porte `HongKong50` : il tombait sur le MÊME instrument, l'utilisateur
a coché `InpSymboleLibre` pour travailler, et la garde ainsi désarmée a laissé passer
le soir même ce qu'elle venait d'interdire. C'est la **règle 16**, née là — voir
« Une garde se juge aussi sur ses faux refus », plus haut, où la forme retenue (la
comparaison par NOYAU) est écrite avec ses onze cas mesurés.

## Refuser est la moitié du travail quand la réponse est disponible

La garde de devise a mordu, et elle a nommé sa cause — journal MT5, robot `260917.13`
sur `#HongKong50` : *« la valeur du tick (0.01000) est celle de la devise de cotation
HKD »*, puis zéro trade et solde inchangé. La valeur rendue valait **exactement** taille
du contrat × pas de cotation : le terminal n'avait pas converti, et le facteur 7 observé
est celui de EUR/HKD ≈ 8,5. Le statut de la garde est passé de « mécanisme non prouvé »
à « cause établie » sur cette ligne de journal.

**Et c'était quand même la moitié du travail.** Remplacer un chiffre faux par un refus
explicite est le bon sens du correctif — mais il laissait un instrument du portefeuille
sans une seule position, alors que **le taux est dans le terminal** : la paire croisée
existe, il suffisait de la chercher.

> **Un refus qui remplace un chiffre faux est juste ; un refus quand la réponse est à
> portée est une capitulation.** La question à poser devant tout refus : *ce qui manque
> est-il une donnée que personne n'a, ou une donnée que personne n'est allé chercher ?*

`TauxVersCompte` la cherche **par propriété** — devise de base et devise de profit de
chaque symbole du terminal, dans les deux sens, le cours inversé quand il le faut — et
jamais par un nom fabriqué : `EURHKD` n'existe pas chez tous les courtiers, `EUR/HKD`,
`EURHKD.r` et `HKDEUR` oui. Le taux trouvé s'imprime au journal, parce qu'il est ce qui
sépare un risque de 200 EUR d'un risque de 28. Le refus reste, en **dernier** recours,
quand aucune paire n'existe — et il le dit alors en toutes lettres, sans quoi il
renverrait l'utilisateur vérifier l'Observation du marché que le robot vient de parcourir.

### Où la réserve vit : là où la promesse se fait, pas là où le chiffre s'affiche

Tant que la conversion manque, la ligne du portefeuille affiche un R par an qu'aucun
robot ne peut réaliser chez ce courtier. La tentation est d'écrire l'avertissement **sur
la ligne** — et c'est le défaut qu'on vient de purger deux sections plus haut : Véna,
depuis le navigateur, ne sait pas dans quelle devise un courtier cote ni ce qu'il
renseigne. Un bandeau permanent y serait une affirmation qu'aucune mesure ne soutient.

Le R par an mesure des **prix**, et il reste vrai. Ce qui peut être faux est « un robot
réalisera ça chez mon courtier » — et cette promesse-là naît **au téléchargement du
robot**. La réserve vit donc dans l'infobulle du bouton Exporter, où elle est vraie,
vérifiable, et suivie du geste qui la tranche : lire la première ligne du journal du
test, qui dit lequel des trois cas s'est produit — converti (avec le taux), refusé (avec
la paire manquante), ou rien à convertir.

## Le bouton Exporter porte ce qu'on sait de la ligne — et pas un verdict

**STATUT · INSTRUMENTATION, AUCUNE CAUSE PRÉTENDUE.** Rien n'est réparé : trois faits que
l'application possédait déjà **séparément** sont rendus lisibles **ensemble**, à l'endroit
où la promesse se fait. La corrélation qu'ils portent est **RAPPORTÉE** — neuf instruments,
un seul courtier, un seul compte, mesures hors du dépôt.

La question du produit est *« ce robot fera-t-il ce que cette ligne annonce ? »*, et trois
faits l'ont prédite sur les instruments rejoués :

> **⚠ LE COMPTE DE CETTE SECTION NE SE REFERME PAS, et il est laissé ouvert plutôt que
> réparé.** Elle a longtemps annoncé « neuf instruments rejoués » au-dessus d'un tableau
> dont les colonnes font **6 + 2 + 3 = onze**. Les deux nombres viennent de rejeux hors
> dépôt. **Et le registre hors dépôt a été relu depuis : il ne tranche pas non plus, il
> AGGRAVE.** Deux entrées écrites à un jour d'écart, sur les mêmes rejeux, portent le même
> « neuf instruments rejoués » au-dessus de **deux listes différentes** — cinq concordants
> d'un côté (GOLD, WTI, BRENT, USNDAQ100, COPPER), six de l'autre (GOLD, US30, SILVEREURO,
> WTI, BRENT, Cuivre). Et l'union de ce qui a été MESURÉ dans cette session en fait
> **douze**, énumérés : GOLD, US30, USNDAQ100, WTI, BRENT, Cuivre, SILVEREURO, HongKong50,
> IBEX, AUDUSD, Germany40, NZDUSD.
>
> **« Neuf » n'est donc soutenu nulle part, des deux côtés** — c'est un compte posé une
> fois et recopié, jamais recompté. **Choisir maintenant fabriquerait rétroactivement une
> mesure qui n'a pas eu lieu** : un nombre qu'on n'a pas compté ne devient pas vrai quand
> on le compte après.
>
> **ET LE SENS DE L'ERREUR RESTE INDÉTERMINÉ, ce qui est la partie qu'il ne faut pas
> sauter.** Douze est l'union des instruments **mesurés** ; « neuf » parle des instruments
> **rejoués contre le testeur**. Ce sont deux populations, et la seconde est incluse dans
> la première sans qu'on sache de combien. Si huit seulement ont été rejoués, le produit
> SUR-déclare. Conclure « douze > neuf, donc le produit sous-déclare » serait comparer
> deux comptes disjoints pour en tirer une direction — le défaut exact des deux grandeurs
> lues l'une sous l'autre, commis sur la note qui l'interdit.
>
> **CE QUI EST FAIT, ET CE QUI NE L'EST PAS** : le mot est retiré de cette phrase-ci, qui
> est de la prose de dépôt. Il RESTE dans le texte livré — l'infobulle et l'étiquette
> disent « neuf instruments, un courtier, un compte », et `exporter-dit-ce-quon-sait` le
> tient. *Un échantillon annoncé à un client ne se corrige pas depuis une arithmétique de
> tableau* : si le vrai nombre est onze, le produit sous-déclare sa propre mesure, ce qui
> est le sens prudent ; s'il est neuf, c'est le tableau qui compte mal. Les deux demandent
> la même chose, et c'est la seule sortie : **les journaux de rejeu dans
> `scripts/mt5/`**. Le jour où ils y entrent, cette note dit exactement quoi remplacer.

| le critère | les 6 concordants | les 2 divergents | les 3 non comparables |
|---|---|---|---|
| bougies retirées par la fenêtre horaire | 0 | ~900 | — |
| durée du résultat | 6,5–6,6 ans | 6,6 ans | 3,4 à 4,9 ans |
| reprise fidèle | fidèle | fidèle | **INCOMPLÈTE** |

Chacun vivait sur un écran différent — donc lisible par personne ensemble, au moment qui
compte. `reservesExport(v)` les réunit dans l'infobulle du bouton, et **rend vide quand il
n'y a rien à dire** : une ligne sans réserve ne doit pas ouvrir sur une phrase qui rassure.

### « Valide » est interdit, et l'énoncé porte son ÉCHANTILLON

C'est la règle du statut appliquée à un écran que voit un **client**. Ce qu'on a est une
corrélation sur neuf instruments chez un courtier ; « valide » promettrait une loi. La
formule est **« vérifié contre le testeur » ou « non vérifié »**, suivie de son
échantillon — *neuf instruments, un courtier, un compte* — sans quoi « le testeur rend 7 à
11 points en moins » se lit comme une règle.

> **Une ligne de statut fausse est pire que pas de ligne du tout**, et ça ne change pas
> parce que le lecteur est un client plutôt qu'un développeur.

**Et la phrase qui NIE le mot ne peut pas l'épeler.** Premier jet : « ils ne valident
rien ». La garde l'a refusé et elle avait raison — son interdit est **absolu**, sans quoi
il faudrait lui apprendre à distinguer l'affirmation de la négation, puis le cas suivant.
C'est le motif de plus que la règle 3 refuse. **Le texte a changé de mot, pas la garde
d'exception** : « ils n'attestent rien ».

### Trois occasions de se tromper, et les trois étaient déjà écrites dans ce fichier

Cet écran a fait mordre trois pièges que le dépôt avait documentés **avec leur sortie**, et
les trois se sont réglés en appliquant ce qui était écrit plutôt qu'en inventant :

| ce qui a mordu | ce que le dépôt disait déjà |
|---|---|
| le brief écrivait « bougies **hors séance** » | `fenetre-nest-pas-seance` : ce n'est PAS la séance — elles sont RETIRÉES de la série |
| l'échantillon coupé par le formateur (`… chez UN ' + 'courtier …`) | **troisième** fragmentation en littéraux : le seuil écrit d'avance disait de **concaténer avant de lire**, et c'est fait |
| l'apostrophe en échappement (`\u2019`) invisible à un motif portant le vrai caractère | `sorties-hors-seance` : s'ancrer sur un fragment **sans** apostrophe |

**Le deuxième est le plus instructif** : le seuil disait *« si le cas revient une troisième
fois, la conclusion n'est pas un troisième `prettier-ignore` — c'est de concaténer les
littéraux adjacents avant de lire »*. Il est revenu, et la prise a changé de forme : elle
cesse d'être « le texte tel qu'il est écrit » pour devenir **« le texte tel qu'il est
rendu »**, et la façon dont il est coupé cesse d'exister pour la garde.

`scripts/app/exporter-dit-ce-quon-sait.test.mjs` tient les mots et les trois états —
éprouvé par mutation, réintroduire « validee » la fait tomber. **Son angle mort est en
tête** : elle ne peut pas vérifier que la corrélation citée est encore vraie. Elle vient
de neuf rejeux hors dépôt, et si un dixième instrument la cassait, rien ici ne rougirait.
*C'est précisément pourquoi la phrase porte son échantillon plutôt qu'un verdict : le
texte dit ce qu'il est, faute de pouvoir être gardé.*

### Et le dossier MT5 se ferme ici, sans le rejeu court

Six candidats sont morts, **chacun par une mesure** : les paliers (0 % d'ambigus sans
sécurisation), le compteur de `releve` (mort par son propre dénominateur), les trois formes
du terme de 10 R (qui n'existait pas), le début de semaine (même règle, même horloge), la
qualité à 96 % (identique au centime), et l'ordre des extrêmes (la bande dépasse
l'amplitude d'une H1).

**Et l'arbitre s'est récusé lui-même** : `50 249 tick prices mismatch` entre l'historique de
tiques de FxPro et ses propres bougies M1, sur le même symbole. Le testeur se contredit de
plus que l'écart qu'on lui demandait de trancher.

**`ecartees` reste le meilleur prédicteur du chantier — et n'a plus aucun mécanisme.**
Zéro sur les six concordants, ~900 sur les deux divergents, sans exception ; et le
mécanisme qu'il suggérait est mort par son propre compteur, vérifié juste. C'est la
famille « une grandeur qui classe bien n'est pas celle du mécanisme », mesurée **jusqu'au
bout** pour la première fois : elle reste **utilisable comme signal et interdite comme
explication**, et c'est ce que l'infobulle en dit — elle indique où regarder, elle
n'atteste rien.

## Additionner des périodes qui ne se recouvrent pas

**STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ, mécanisme et correctif MESURÉS DANS LE
DÉPÔT.** Le chiffre fondateur vient de l'écran d'un utilisateur : `+ 9,6 + 6,5 + 8,7 +
6,7 = 31,5 R/an` sur quatre lignes couvrant **3,4 / 4,1 / 4,9 / 6,5 ans**. L'addition est
juste ; la phrase est fausse. Tout ce qui suit — la fenêtre commune, l'exposition
simultanée, la redondance, les paris — se relit dans `moteur.js` et dans
`scripts/app/portefeuille-quatre-calculs.test.mjs`.

> **Une supposition écrite SOUS un chiffre qui la viole n'est pas un avertissement,
> c'est un aveu.** Le pied de page disait déjà « suppose que les lignes tournent sur la
> même période ». C'est la famille de la règle 9 poussée d'un cran : là, une réserve
> placée sous une affirmation la suit au lieu de la tempérer ; ici, la réserve DÉCRIT
> exactement ce qui rend le chiffre faux, et elle est imprimée trois fois plus petit.

Le grand chiffre est donc **recalculé sur la fenêtre commune** — `[max(début),
min(fin)]`, et seuls les trades entièrement dedans. Le brut garde sa place, **en note et
avec sa raison dans la MÊME phrase** : « + 31,5 R/an si l'on additionne les quatre
fenêtres — mais elles ne se recouvrent pas ». Séparer le chiffre de sa raison le rendrait
lisible comme une variante au choix — c'est la leçon de `TARIF_GELE`, appliquée à un
nombre au lieu d'une promesse.

**Trois états, et le troisième n'est jamais « zéro ».** Fenêtre commune pleine : les deux
chiffres. Fenêtre commune VIDE (deux lignes disjointes) : on le dit, et on n'affiche pas
d'agrégat — deux lignes qui n'ont jamais tourné ensemble n'ont pas un résultat de zéro,
elles n'en ont pas. Une seule ligne : sa fenêtre EST la fenêtre commune, et la note
disparaît.

### Trois autres calculs, et ils tenaient tous dans la même liste

| Ce que l'écran disait | Ce qu'il ne disait pas |
|---|---|
| « capital immobilisé 29 % du temps » | une MOYENNE. Quatre lignes à 1 % qui ouvrent le même jour font **4 % de risque simultané**, et c'est le simultané qui fait sauter un compte |
| « redondance non mesurée », derrière un bouton | la mesure est une agrégation de la liste de trades **déjà en main**. Un portefeuille de huit lignes dont six corrèlent est un portefeuille de deux |
| le nombre de LIGNES | le nombre de **paris** — les lignes après regroupement des paires au-delà de 0,70 |

**L'exposition simultanée rend le maximum ET le nombre de JOURS où il tient.** Un pire cas
atteint une fois en six ans est un accident ; atteint onze jours, c'est la façon dont le
portefeuille fonctionne. Le compte est ce qui les sépare, et sans lui le chiffre ne dit
pas laquelle des deux choses on regarde.

**La redondance corrèle les rendements MENSUELS des lignes, pas les prix.** L'ancienne
mesure prenait les variations journalières des cours sur 250 séances : deux
configurations OPPOSÉES sur le même instrument y étaient parfaitement corrélées. Et **un
mois sans position vaut zéro, pas « pas de donnée »** — écarter ces mois ferait correler
deux lignes sur les seuls mois où elles ont travaillé ensemble, ce qui est exactement la
question qu'on ne pose pas.

**Une variance nulle ne donne pas une corrélation de zéro : elle n'en donne aucune.**
`pearson` rend `null`, la case rend « — » avec sa raison, et le nombre de paris rend
« non mesurable ». Rendre 0 ferait lire « paris distincts » là où rien n'a été mesuré —
c'est la règle du zéro qui prouve sa prise, appliquée au produit et non à une sonde.

### Une porte unique, parce que quatre producteurs sont quatre occasions de diverger

Les quatre calculs sont quatre agrégations d'**une** liste : `pfTrades` la produit, et
elle seule. C'est la figure de `deposes` — une garde sur un chemin ferme un CAS, une
porte unique ferme la CLASSE. Un second producteur qui relirait la série divergerait du
premier, et **rien à l'écran ne le dirait**.

La porte décide sur un RÉSULTAT, pas sur une intention : une série non chargée ou une
configuration introuvable rendent `trades: null`, jamais une liste vide. « Aucun trade »
et « rien n'a été mesuré » sont deux états, et les confondre ferait annoncer un zéro que
personne n'a regardé.

**Le grand chiffre est donc REMESURÉ, la colonne du tableau ne l'est pas.** `pfTrades`
rejoue sous la règle actuelle du moteur ; la colonne « R / an » porte le chiffre
enregistré à la validation. Les deux peuvent différer, et c'est ce que dit la réserve
sous le bandeau — elle a changé de sujet en même temps que le chiffre.

### La frise mentait sur son alignement — et c'était le défaut qu'elle rend visible

Le calque de la maquette était posé sur le **conteneur** pleine largeur, avec un `left`
écrit en pixels. Mesuré par son auteur : **76 px de décalage**, la largeur de la colonne
des noms. La bande affirmait donc une fenêtre commune FAUSSE.

> **Un alignement est un défaut d'AFFICHAGE : il n'existe que rendu.** Deux chaînes
> `grid-template-columns` identiques dans le source ne prouvent pas que les deux boîtes
> tombent au même pixel. C'est le même énoncé que le mot relatif, sur une autre grandeur.

La bande est désormais une grille de **même gabarit** superposée à celle des barres : sa
deuxième colonne EST la piste des barres, calculée par le navigateur sur la même largeur.
`scripts/app/portefeuille-fenetre-commune.test.mjs` lit les rectangles dans un vrai
navigateur et compare la bande à la position que **ses propres pour-cent** désignent sur
la piste — pas à « quelque part dedans », qui est une garde vacue : une bande décalée mais
étroite y survivrait. Éprouvé par mutation : deux gabarits divergents de 76 px la font
tomber **en nommant l'écart mesuré** (75 px rendus).

**Et le calque se peint DERRIÈRE les barres.** Un élément statique passe sous un absolu :
la bande teintait les barres au lieu de teinter la piste, et 13 % d'accent sur du bleu
foncé ne se voit pas. La fenêtre commune redevenait invisible dans la figure écrite pour
la montrer.

### Ce que la colonne « Part » ne disait pas, et ce que les deux dates disent

`Part` décrivait sans conseiller — et elle décrivait une part d'un total qui, lui,
additionnait des fenêtres qui ne se recouvrent pas. Ce que l'utilisateur reporte
réellement dans le testeur, ce sont les **deux dates de la mesure** ; leur absence a coûté
une demi-journée sur AUDUSD, où le robot a tourné sur toute la série quand la mesure n'en
couvrait qu'un tiers. Comparer deux périodes différentes ne compare rien.

**Et l'étiquette de rangée dit « vérifié contre le testeur » ou « non vérifié — mesure sur
3,7 ans ».** Le mot « valide » y est interdit comme sur le bouton Exporter, et l'énoncé
porte son échantillon : ce qui est vérifié, c'est CETTE ligne chez CE courtier.
`exporter-dit-ce-quon-sait` tient les deux surfaces — l'infobulle et l'étiquette — sous le
même interdit **absolu**, et son faux refus connu est écrit dans sa tête (règle 16) : il
tombe aussi sur « validée » employé pour le geste de l'application, et c'est le TEXTE qui
a cédé, jamais la garde.

### Quatre pastilles identiques sur chaque ligne ne distinguent rien

`P2 P3 P4 P1` était rendu sur CHAQUE rangée, dans le même gris : impossible de savoir où
une ligne est rangée, puisque tout était marqué. Dans la table du portefeuille il ne
reste que les portefeuilles qui **contiennent** la ligne — une marque, pas une commande.
Le geste de placement vit dans « À ranger », où sa liste déroulante porte déjà son verbe,
et « Ranger une ligne ici… » vit au pied du portefeuille ouvert, là où le geste a un
sujet.

**Et « Retirer » a disparu de l'onglet « Toutes les lignes » : il n'y a pas de sujet.**
Laissé rendu, il ne faisait rien — un geste mort, que la tournée des gestes a attrapé à
sa première exécution. Un onglet de lecture ne porte pas les gestes d'un portefeuille.

**Un onglet vide reste VISIBLE, à demi-encre.** La version précédente masquait un
portefeuille sans ligne : il devenait un portefeuille qu'on ne peut plus remplir, puisque
le seul geste pour y ranger quelque chose vit à son pied. La note « N portefeuilles vides
masqués » est partie avec le masquage — une consigne périmée a l'autorité des vraies.

### Le banc devait pouvoir MESURER, et il ne le pouvait pas

`decisions` sème des lignes validées, et la page les affiche — mais aucune n'est
**rejouable** : `cfgDeLigne` cherche la configuration de la variante dans une table que
seule la boucle d'un vrai scan remplit. Les quatre calculs seraient donc tombés tous les
quatre dans leur état « non mesurable », et une garde de rendu posée là aurait mesuré le
DÉCOR — la borne n'aurait rien coupé. Le semis `portefeuille` pose la table par la
fonction du produit qui la construit, puis **relit par `pfTrades`** et jette si une ligne
ne rend aucun trade. C'est la règle 10 dans l'outillage, une fois de plus : le cas qu'on
sème spontanément est celui où le défaut ne peut pas se produire.

**Et la garde prouve sa prise avant de conclure** : elle exige que le grand chiffre et le
brut DIFFÈRENT sur le semis. S'ils sont égaux, la fenêtre commune n'a rien coupé et
l'assertion passerait avec ou sans le calcul qu'elle vérifie.

**Son premier faux refus a été attrapé à sa première exécution** : `/0 % au pire/` trouve
« 3,0 % au pire ». Un zéro non ancré refuse le cas normal — c'est la règle 16 sur un
motif de trois caractères, et c'est le genre de garde qu'on désactive le soir même.

## Un réglage seul sur sa rangée coûte 40 px pour un champ de 50

**STATUT · CAUSE ÉTABLIE, MESURÉE DANS LE DÉPÔT** pour le gain : même semis, mêmes plis,
la page passe de **3 057 à 2 865 px rendus** — 192 px, mesurés dans un navigateur sur le
fichier livré. La maquette de l'utilisateur annonce ~390 px sur son cas (quatre lignes et
trois portefeuilles à comparer, que le banc n'a pas) ; les deux chiffres décrivent deux
écrans, et celui du dépôt est celui qu'un test peut relire.

**Les deux plus gros gains n'étaient pas du serrage : deux bandes ont DISPARU.** « Creux
redouté 20 % » occupait une rangée entière pour un champ de 50 px de large ; il vit au bout
de l'en-tête de sa section, où la place est déjà payée. « N configurations contre la
détention de M instruments » a été remplacée par un **`Tous (N)`** dans la ligne
« Comparer », qui reçoit au passage « Part détenue » et « Sans risque », poussés à droite.

> **Un réglage qui vit seul sur sa rangée paie une rangée entière pour lui.** Le remède
> n'est pas de rétrécir la rangée, c'est de trouver la ligne où la place est déjà payée.

Même mouvement en plus petit : le renvoi « ▸ Détail par instrument » entre au bout de la
phrase du pied au lieu d'occuper une rangée — ce qui a demandé de remplacer un `details`
natif par un pli de la même fabrique que les trois autres, un `summary` ne pouvant pas
vivre à la fin d'un paragraphe.

**Et une réserve ne se supprime pas au nom de la place.** La bande supprimée portait, en
plus de sa description, un fait qui n'est pas décoratif : des instruments du portefeuille
sont HORS comparaison faute de série chargée. Il survit à sa rangée, en une phrase courte
dans la ligne « Comparer ». Le point d'interrogation qui porte les hypothèses de
conversion reste lui aussi.

### Ce qui est COMMUN n'appartient pas aux lignes

Cinq des huit réglages étaient identiques sur les quatre lignes — « Croisement et
Rebond », « Aucune sécurisation », « Lecture basse », « Frais courtier », « D1 ». Répétés
quatre fois, ils n'aident pas à comparer : l'œil doit trier pour trouver les trois qui
distinguent.

> **Le gain n'est pas surtout la place, c'est que la comparaison devient possible.**

Ils sont hissés en note de l'en-tête de colonne, et chaque ligne ne garde que sa
différence. **La note se DÉCOUVRE : elle est l'intersection des réglages des lignes
affichées** (règle 7). Écrite à la main, elle porterait une hypothèse que personne ne
réviserait — le jour où un sixième réglage deviendrait commun, ou où l'un des cinq
cesserait de l'être, elle resterait verte en décrivant un état qui n'existe plus, et elle
se lirait comme une note dérivée.

`scripts/app/reglages-communs-decouverts.test.mjs` mesure **les deux sens** au rendu : ce
qui est commun aux trois lignes est dans la note et sur AUCUNE rangée ; ce qui distingue
est sur sa rangée et PAS dans la note. Éprouvé par deux mutations — une note écrite en dur
tombe, et une note à laquelle on ajoute un réglage non commun tombe aussi.

**Le banc a dû apprendre à porter les deux états.** Trois lignes de configuration
identique ne font exister que la moitié du mécanisme : tout serait hissé, rien ne
redescendrait. Le semis donne donc à la dernière ligne une période différente — c'est la
règle 10 dans l'outillage, encore : le cas qu'on sème spontanément est celui où la moitié
du défaut ne peut pas se produire.

**La note s'enroule, elle ne se tronque pas.** Ce qu'elle porte ne figure plus sur les
rangées : une ellipse sur un écran étroit retirerait de l'écran ce qu'on vient d'y hisser,
et une infobulle ne s'ouvre pas toute seule.

### Le serrage, lui, est mesuré et sans conséquence

| | avant | après |
|---|---|---|
| courbe de capital | 160 px | 112 px |
| rangées de la comparaison des portefeuilles | 3 px | 1 px de gouttière |
| rangées d'instruments | 10 px | 8 px |
| en-têtes de section pliables | 12 px | 9 px |
| chiffres de la section hasard | 28 px | 25 px |
| totaux de la comparaison | 28 px | 20 px |

La courbe est le plus gros gain unitaire : **un creux se voit autant sur 112 px que sur
168**, et c'est vérifiable — le creux le plus profond y est tracé entre son sommet et son
fond, pas seulement chiffré en légende.

### Changer le conteneur ne déplace pas ce qui est imbriqué dedans

Le rapport porte un incident d'implémentation qui vaut d'être écrit : un premier correctif
avait remis le conteneur en colonne mais laissé les réglages À L'INTÉRIEUR de la rangée du
nom. **Rien ne bougeait à l'écran, et le correctif a été annoncé fait.** C'est l'utilisateur
qui a dit non.

> **C'est la règle 11 sur un correctif de MISE EN PAGE : seul le rendu prouve qu'un
> élément a bougé.** Une déclaration CSS juste sur un conteneur ne dit rien de ce que ses
> enfants font, et une garde de source lirait la déclaration.

C'est pourquoi la garde de la note de réglages lit l'écran — le texte rendu de la note et
celui de chaque rangée — et non le gabarit. Sa première assertion est une PRISE : si
aucune note n'est rendue, elle tombe en nommant ce piège, plutôt que de vérifier des
absences sur un écran vide.

## Une déclaration valide qui ne peint rien, et personne ne le dit

**STATUT · PANNE OBSERVÉE (RAPPORTÉE), MÉCANISME MESURÉ DANS LE DÉPÔT.** L'utilisateur
rapporte une page qui a perdu sa structure entière — tous les cadres disparus — « sans une
seule erreur de console », pour un `var(--color-border)` qui n'existe pas dans le système
lié. Le mécanisme se relit : une propriété personnalisée non résolue rend la déclaration
INVALIDE, et `border-style` retombe à `none`.

> **Une couleur peut échouer de deux façons, et aucune des deux ne se plaint.** Le jeton
> n'existe pas : la déclaration est jetée. Ou le jeton existe et vaut la même couleur que
> ce sur quoi il se pose : la déclaration s'applique, et ne produit rien.

**Le second cas a été mesuré ici, et il contredisait la maquette.** `--color-neutral-100`
vaut `#f5f5f8` ; le fond de carte `--color-bg` vaut `#f2f2f3`. Le « bandeau teinté » d'un
en-tête de section est donc **trois unités PLUS CLAIR que sa carte** — il ne teinte rien.
Le jeton qui porte ce rôle dans ce système s'appelle `--color-surface` (`#e9e9ea`), neuf
unités plus sombre, et c'est son nom qui le désigne.

`scripts/app/couleur-qui-existe.test.mjs` tient les deux, et chacun se garde là où il est
lisible :

| Le défaut | Où il se voit | Ce que la garde lit |
|---|---|---|
| le jeton n'existe pas | dans le SOURCE — un nom se lit | tout `var(--…)` écrit, contre les définitions de la feuille vendorée **et** de celle qui est réellement livrée |
| le jeton ne teinte pas | au RENDU seulement | la luminance de la bande contre celle de la première couleur DIFFÉRENTE au-dessus d'elle |

**La feuille livrée ne voyage pas en clair.** Elle part en `data:text/css;base64` pour que
le fichier unique se suffise en `file://`. Un relevé à plat du solo n'y trouve donc aucune
définition et déclarerait les vingt-trois propriétés orphelines — une garde qui accuse
tout n'accuse rien. Elle est décodée, et c'est elle qu'on lit.

**Et la comparaison saute les parents de la MÊME teinte.** L'en-tête d'une section porte
parfois sa rangée, tintée pareil : se comparer à elle rend toujours zéro, c'est-à-dire un
verdict sur le décor. Éprouvé par mutation, dans les deux sens — un jeton inexistant, et
le retour au jeton plus clair, qui tombe en annonçant **−4 unités**.

**Ce qui n'est pas fermé, et qui est relevé.** Treize autres fonds de l'application sont
posés en `--color-neutral-100` ; plusieurs sont dans le même cas et ne teintent rien. La
garde ne couvre que les trois bandeaux d'en-tête du portefeuille — c'est écrit dans sa
tête, et c'est une file, pas une panne.

**Et le seuil de sa généralisation est écrit avec elle**, parce qu'un angle mort déclaré a
une date de péremption et qu'il ne sert que si la note dit quoi remplacer. Sa portée est
un LIEU — « les trois bandeaux du portefeuille » —, et un lieu ne se généralise pas, il se
déplace (règle 8). La PROPRIÉTÉ, elle, est déjà dans son corps : *ce fond teinte-t-il ce
qu'il recouvre ?* Le jour où le sujet revient, la prise ne change pas — seule la
découverte des éléments cesse d'être `button.tete.carte` pour devenir « tout fond non
transparent posé dans une carte ».

**Son coût est un faux refus à prévoir** (règle 16), et c'est ce tri-là qui reste à faire,
pas la mesure : une pastille, une case de matrice de corrélation, un témoin de légende
sont des fonds VOULUS proches de leur voisin. Les prendre pour des bandeaux ratés
désarmerait la garde le premier jour. Et toucher les treize d'un coup sur des écrans
qu'on n'a pas mesurés est la façon ordinaire dont un correctif introduit un défaut.

## Une grille dont les colonnes portent du sens compte ses cellules

**STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ sur `260918.7`, cause relue DANS LE DÉPÔT.**
« Retirer » occupait la colonne « Période à tester », qui se tassait à gauche. L'en-tête
déclarait **sept** pistes, le corps **huit**.

La cause est une suppression : « Retirer » vivait à côté de « Part », la colonne « Part »
est partie, et il est resté — il s'est décalé d'un cran et a partagé la cellule des dates.

> **Deux gabarits écrits l'un en face de l'autre sont deux vérités à tenir d'accord, et
> elles divergent sur la première suppression.** C'est la même famille que « une grille
> dont le nombre de colonnes porte du sens s'écrit, elle ne se calcule pas », vue depuis
> l'autre bout : là on déléguait le compte à `auto-fit`, ici on l'écrivait deux fois.

Il n'y en a plus qu'un, `grilleLigne`, lu par l'en-tête et par chaque rangée, et « Retirer »
a sa propre piste — sans intitulé, parce que c'est une action de rangée, mais elle EXISTE
des deux côtés.

**La garde mesure au RENDU, et c'est ce qui la rend juste.** Deux gabarits identiques dans
le source ne prouvent pas deux grilles identiques à l'écran : c'est la grille CALCULÉE qui
décale, et elle dépend de la largeur du parent, du `gap`, d'une piste `max-content`.
`scripts/app/grille-compte-ses-cellules.test.mjs` compare les pistes résolues en pixels et
le compte de cellules. Mutation : retirer une cellule d'en-tête la fait tomber en nommant
les deux comptes.

### Et le tiret qui couvrait trois causes

Même écran, même rapport : la colonne rendait « — » sur toutes les lignes. Mesuré : le
repli de `normValides` — celui qui complète une ligne validée depuis la meilleure ligne
connue — ne recopiait pas `t0`/`t1`. Ils n'étaient pas dans sa liste de champs.

> **Un tiret qui couvre trois causes n'en nomme aucune : il disculpe sans avoir
> regardé.** C'est la règle des trois états, celle des quatre calculs du portefeuille,
> appliquée à une date.

Deux corrections, et la première est la plus importante : **la période vient désormais des
trades MESURÉS**, c'est-à-dire de la même liste que la frise, le bilan et la corrélation.
La page ne peut donc plus afficher une durée d'un côté et deux tirets de l'autre — ce qui
est exactement ce qui a été rapporté, et ce qui a fait croire que les bornes existaient.
À défaut, les bornes enregistrées ; à défaut de tout, la cellule DIT ce qui manque —
« bougies / non chargées », « configuration / introuvable », « bornes / non enregistrées ».

### Une infobulle qui recouvre une action est une action perdue

Le `title` du dépli vivait sur la rangée ENTIÈRE : une infobulle native s'ouvre sous le
curseur où qu'il soit, donc celle-ci s'ouvrait au-dessus du bouton « Exporter » de la
rangée suivante et le masquait. Elle vit sur le chevron — quatorze pixels, à gauche, loin
de tout bouton.

**La garde qui tenait le dépli s'est réancrée** (règle 14, deuxième issue) : son ancre
portait le `title` de la rangée, qui est parti ; son invariant — la rangée se déplie au
clic, donc la coupure de propagation du retrait a un objet — n'a pas bougé.

## Une figure n'affirme pas une comparaison sur une fenêtre qu'elle ne couvre pas

**STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ sur `260918.8`, cause relue et correctif
MESURÉS DANS LE DÉPÔT.** Le pointillé « acheter et garder » partait de 2022 quand le trait
plein partait de 2020, et la légende annonçait quand même un total : `+ 156,1 %`.

**C'est la troisième fois que la même classe se présente, par un troisième mécanisme.** La
frise affirmait une fenêtre commune fausse par un calque mal calé ; le bilan additionnait
des fenêtres qui ne se recouvrent pas ; ici, c'est une COURBE qui compare deux choses sur
deux périodes. Les trois se ressemblent par ce qu'elles font au lecteur, pas par leur
cause — et aucune des trois ne se voyait dans le source.

**Les deux lectures possibles étaient toutes deux des défauts, et elles y étaient
ENSEMBLE** — c'est ce qui les rendait invisibles, chacune expliquant l'autre :

| Ce que le code faisait | Ce que ça produisait |
|---|---|
| le prix de base était pris **par série**, au premier point disponible de chacune | une série commençant en 2022 apportait son 2022→2026 pendant qu'une autre apportait son 2020→2026 : **le total de la légende mélangeait des fenêtres** — le défaut AUDUSD, dans une figure |
| les points d'échantillon antérieurs à la série la plus courte étaient **sautés** (`continue`) | le tracé partait plus tard, sans un mot |

La référence se calcule donc sur **UNE** fenêtre — celle où toutes les séries existent —
avec le même prix de base pour toutes.

> **« Le dire plutôt que tracer moins. »** Quand cette fenêtre ne couvre pas toute la
> période du tracé, le pointillé n'est PAS tracé : la légende donne le chiffre avec sa
> fenêtre et sa raison — « + 156,1 % sur 2022–2026, les seules années où les 15 séries
> existent — non tracé, il couvrirait moins que la stratégie ». Un trait plus court que
> son voisin est une comparaison que personne ne peut faire, et qui a l'air d'en être une.

**Et le témoin de légende suit le trait.** Une pastille pointillée sans trait sur la figure
annonce une courbe absente : elle ne paraît que si le trait existe.

`scripts/app/portefeuille-fenetre-commune.test.mjs` mesure **les deux états au rendu** — la
coordonnée x du premier point de chacun des deux traits, et le texte de la légende. Le
second état est obtenu en tronquant une série par la fonction du produit qui découpe :
sans lui, la garde ne verrait que le cas où le défaut ne peut pas se produire (règle 10).
Deux mutations la font tomber : décaler le pointillé de 133 unités, et retirer la
condition de couverture.

**Son angle mort est en tête** : elle tient que les deux traits décrivent la même fenêtre,
pas que chacun la décrive juste. Vérifier le pour-cent annoncé demanderait une seconde
implémentation de la détention, écrite depuis l'énoncé — un recompte indépendant.

### Deux surfaces pour le même fait

Le titre de la carte disait « Portefeuille 1 · 15 lignes · + 701,8 R cumulés » pendant que
l'onglet actif, juste au-dessus, disait « Portefeuille 1 · 15 lignes · + 117,4 R / an ».
Le titre est tombé : le seul chiffre que l'onglet ne portait pas — le R cumulé — vit déjà
dans le bandeau du bilan. Il ne reste dans cette rangée que ce qu'un onglet ne peut pas
porter : renommer, supprimer.

### Une réserve sans son motif ne dit pas quoi faire pour la lever

Les lignes portaient `non vérifié` seul là où il faut lire `non vérifié — mesure sur
3,4 ans`. **Même cause que les deux tirets de la période** : la durée venait des bornes
enregistrées, que le repli de `normValides` ne recopiait pas. Elle vient désormais des
trades mesurés, comme la période de la même rangée — **deux producteurs pour une même
durée finiraient par se contredire sur la même ligne**, ce qui est précisément ce qui a
été rapporté : une durée d'un côté, deux tirets de l'autre.

## Deux défauts sur le même chemin, dont chacun rend l'autre plausible

**C'est une forme de DIAGNOSTIC, pas de code, et elle est née d'une alternative posée à
tort.** Le rapport sur la courbe disait : *« deux lectures, et les deux sont des défauts —
soit la référence est calculée sur 2022–2026, soit elle est calculée sur toute la fenêtre
et tracée à partir de 2022 »*. Le code portait **les deux**.

> **Un défaut seul se diagnostique ; deux défauts sur le même chemin, non — parce que
> chacun fournit une explication au symptôme de l'autre.** Le tracé qui part tard rend
> crédible un total calculé sur la fenêtre courte ; un total qui mélange les fenêtres rend
> crédible un tracé qui commence là où il commence. L'alternative n'est jamais éprouvée :
> elle a déjà sa réponse, deux fois.

**Le test se fait au moment où l'on écrit « soit… soit… » :** *le code peut-il porter les
deux ?* Si oui, l'alternative n'est pas une alternative, c'est une liste — et il faut les
mesurer séparément. Une disjonction est une hypothèse sur le nombre de défauts, et elle
n'est presque jamais justifiée : rien n'interdit à deux causes de vivre dans la même
fonction, et elles y vivent d'autant plus volontiers qu'elles produisent un symptôme
cohérent.

**Le dépôt en portait déjà deux instances, sans les avoir reliées** :

| Le cas | Les deux termes | Ce qu'ils produisaient ensemble |
|---|---|---|
| le résidu de **10 R** | le dépôt lu à 10 000 € au lieu de 20 000, ET le risque en % de l'équité COURANTE | un « dépassement de stop de 11 % » — cohérent, chiffré, cohérent avec l'autre instrument, et entièrement fabriqué. Trois formes ont été bâties dessus |
| la **courbe de capital** | le prix de base pris par série, ET les points antérieurs sautés | un tracé plus court et un total mélangé, chacun expliquant l'autre |

**Et c'est le résidu de 10 R qui porte la leçon, pas la courbe** : la cohérence du symptôme
n'a pas SURVÉCU à la coïncidence des deux défauts, elle en a été **produite**. Un seul des
deux — le dépôt mal lu, ou le risque pris pour constant — aurait donné un chiffre
visiblement faux ; ensemble, ils ont donné un dépassement de stop de 11 %, qui est
exactement ce qu'un instrument à neuf cents bougies écartées devait produire. C'est ce qui
rend la forme coûteuse : **la vraisemblance est l'effet du défaut, pas un indice contre
lui.**

**Et la section voisine en est l'INVERSE exact, ce qui achève de la nommer.** Là — l'accord
qui tient par annulation d'erreurs — deux défauts composent un résultat JUSTE, et rien
dans un maillon pris seul ne dit lequel des deux accords on a. Ici, deux défauts composent
un symptôme **explicable**, et rien dans une lecture prise seule ne dit qu'il en reste une
autre. Les deux disent la même chose depuis deux bouts :

> **Sur un chemin qui porte deux défauts, aucun maillon lu seul ne tranche — et c'est vrai
> que le résultat soit bon ou mauvais.** Le départage se fait sur ce que les maillons
> produisent ENSEMBLE — une garde qui les lie, ou une mesure qui les sépare —, jamais sur
> la vraisemblance de l'explication qu'on en tire.

**La conséquence pratique est la moins intuitive** : quand une hypothèse explique bien le
symptôme, ce n'est pas une raison de s'arrêter. C'est le moment de demander ce qui
l'expliquerait AUSSI bien — et de le chercher dans le même code, pas ailleurs.

## Un geste grisé est un signal, et il peut être faux dans les deux sens

**STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ sur `260918.9`, cause et correctif MESURÉS
DANS LE DÉPÔT.** Le constat de l'utilisateur tenait en une phrase : *le calcul se refait
tout seul dès qu'un paramètre change, donc le bouton « Mesurer » ne déclenche rien.*
Mesuré au rendu, dans un navigateur, sur le fichier livré :

| l'état du panneau | le bouton |
|---|---|
| au repos, dans tous les états éprouvés | **grisé** |
| 80 ms après un réglage touché | allumé — pendant que la relance différée de `maj` avait **déjà** lancé le calcul qu'il proposait de lancer |
| 5 s après | grisé de nouveau |

**Un geste sans effet dans 100 % des cas où il était offert.** Et le cas où il aurait servi
était le seul où il restait grisé — mesuré sur une reprise dont seul le sens de la ligne
ne se reconstitue pas :

| | trades | résultat |
|---|---|---|
| ce que le panneau AFFICHAIT | 42 | **+15,7 R** |
| ce que ses réglages produisent | 37 | **−11,5 R** |

Le signe est opposé. Les chiffres étaient justes — ils mesuraient la configuration de la
ligne — et ils étaient posés sous des réglages qui ne les produisent pas : **une mesure
fausse qui a l'air d'une mesure**, le pire mode de panne du dépôt. Le prédicat du bouton,
lui, ne mentait pas : le résultat ÉTAIT à jour. Pour l'autre configuration.

> **Un bouton grisé affirme « il n'y a rien à faire ici », et c'est une affirmation qui
> peut être fausse des deux côtés à la fois** — offerte là où elle ne peut rien, refusée
> là où elle pourrait tout. Un bouton absent ne se plaint pas ; un bouton grisé non plus,
> et en plus il rassure.

C'est la parente de « le geste de RÉPARATION gaté sur l'intention », plus haut : là, le
prédicat de péremption éteignait le geste pour ceux qu'il ne savait pas détecter. Ici, il
l'éteint pour ceux qui en ont besoin **parce qu'il répond juste à une autre question**.

### Le correctif n'est pas d'allumer le bouton, c'est qu'il n'y ait plus deux faits

La première correction, une semaine plus tôt, avait fait converger les quatre lecteurs de
la signature sur UNE valeur. Le désaccord était fermé — le bouton se rallumait — et le
défaut de fond restait entier : cette valeur unique était celle de la configuration
MESURÉE, que le panneau n'affichait pas.

> **Faire converger deux dérivées sur une valeur ferme un désaccord. Ça ne dit rien sur
> le fait que la valeur soit la BONNE.**

Le panneau mesure donc `cfgCourante()`, toujours. Il n'y a plus qu'une configuration, donc
plus qu'une signature, et le bouton part **avec la condition qui le justifiait**. Ce qui
reste suffit : « Sauvegarder ce résultat » est le seul geste réel de cet écran, et la
ligne du portefeuille garde son chiffre validé — **deux surfaces, deux faits, plus de
péremption à arbitrer**.

`cfgLigne` ne disparaît pas : il cesse d'être ce qu'on MESURE pour devenir ce à quoi la
mesure se COMPARE (`repriseEcart`, `ecartLigne`). Le bandeau change de sujet avec lui — il
ne dit plus « les chiffres viennent de la mesure enregistrée », il dit « ces chiffres sont
la mesure des réglages affichés, pas celle de la ligne », avec ce qui manque nommé.

**Et la seule chose réelle que le bouton savait faire ne part pas avec lui** : le recadrage
de l'instrument quand le compte ouvert ne porte plus celui du backtest. Il se réancre sur
la condition qui le produit (règle 14) — la suppression d'une série relance le test, comme
le changement de compte le faisait déjà.

### La garde a été ÉCRITE FAUSSE une fois, et c'est la règle 1 à l'intérieur d'elle

Première forme : elle comparait `state.signature` à la signature du panneau. **Elle est
restée VERTE sous la mutation qui remet la configuration de la ligne dans la mesure** —
parce que la signature enregistrée est celle du panneau quoi qu'on ait mesuré.

Elle demandait « la comptabilité des signatures est-elle cohérente ? » (une intention) pour
prédire « le chiffre affiché est-il celui des réglages ? » (le résultat). **La règle 1, à
l'intérieur d'une garde écrite contre elle** — et seule la mutation l'a dit, ce qui est
exactement pourquoi la règle 2 existe.

La forme retenue **remesure** les réglages affichés et compare les nombres. Sous la même
mutation elle tombe alors en nommant les deux comptes : *« le panneau affiche 42 trades,
ses réglages en produisent 37 »*. C'est l'énoncé déjà écrit plus haut — *vérifier qu'une
mesure BOUGE n'est pas vérifier qu'elle compte JUSTE* — appliqué cette fois à la
comptabilité qui entoure la mesure plutôt qu'à la mesure elle-même.

`scripts/app/panneau-mesure-ce-quil-affiche.test.mjs` tient les deux états de reprise au
rendu, et s'ancre sur l'ABSENCE du bouton pour attraper sa réintroduction. Son angle mort
est en tête : elle recompte avec `cfgCourante` et `mesurer`, donc une erreur de définition
PARTAGÉE — les deux se trompant ensemble — la laisserait verte.

**Et c'est la bonne forme pour une raison qui se dit en une ligne** : *un recompte ne peut
pas hériter de l'erreur qu'il vérifie.* Une garde qui relit la comptabilité autour d'une
mesure partage le raisonnement qu'elle contrôle ; une garde qui refait la mesure ne
partage que ses entrées. C'est ce qui délimite exactement son angle mort, et pourquoi
celui-ci se réduit à l'erreur de définition PARTAGÉE — le seul reste possible.

#### L'instrument commet la règle 1 plus souvent que le produit — compté, pas juré

On a d'abord dit « troisième instance de la règle 1 dans une garde écrite contre elle ».
Un « troisième » se périme sans bruit : compté sur la table fondatrice de la règle 1,
plus haut, c'est le **cinquième**, et la répartition compte plus que le rang :

| ce qui commettait la règle 1 | ce que c'est |
|---|---|
| la garde d'étanchéité (« le générateur écrit-il ? ») | outillage |
| la sonde accrochée à la liste vide | outillage |
| le semis de mesure | outillage |
| la garde du tarif gelé | outillage |
| `this.essai`, `aMoi` | produit |

**Quatre des six instances fondatrices vivent dans l'outillage, deux dans le produit** —
et la cinquième du côté outillage vient de s'ajouter. La frontière du compte est écrite,
puisqu'elle décide : on y range ce qui MESURE (garde, sonde, semis), pas ce qui décide
dans le produit.

Ce n'est pas une ironie, c'est structurel, et ça se dit sans métaphore : **une garde est
écrite APRÈS le code qu'elle surveille, donc en connaissant son mécanisme — et c'est
précisément ce qui rend un proxy plausible disponible.** Le produit, lui, doit inventer sa
question ; la garde en hérite une toute faite, celle du code qu'elle vient de lire. La
comptabilité des signatures était sous les yeux, elle était vraie, et elle avait l'air de
répondre.

> **Le proxy le plus tentant, pour une garde, est le mécanisme de ce qu'elle garde.** La
> question à se poser en l'écrivant : *est-ce que je vérifie le RÉSULTAT, ou la façon
> dont il a été obtenu ?* La seconde passe quand le mécanisme est cohérent et faux.

#### Et un cran plus loin : une prise DÉRIVÉE de ce qu'elle vérifie

Le proxy lit le mécanisme ; celui-ci **calcule sa valeur attendue depuis le sujet**. La
différence n'est pas de degré, et c'est ce qui décide de ce qu'on peut en espérer :

> **La règle 1 met en jeu DEUX faits distincts, dont l'un approxime l'autre. Ici il n'y
> en a qu'UN, consulté deux fois.** Ce n'est pas une approximation, c'est une tautologie.

**Et la conséquence est le seul argument qui compte.** Un proxy finit par diverger — le
jour où l'intention et le résultat se séparent, il se trahit, et ce fichier porte six
occasions où c'est arrivé. **Une prise circulaire ne diverge jamais** : verte
aujourd'hui, verte dans six mois, verte quand le code est faux. *C'est le seul mode de
panne de ce fichier qui n'a aucune date de péremption.*

**Le test se fait à l'écriture, et il est exécutable sans rien lancer** — ce qui est rare
ici : *si le code était faux, d'où viendrait ma valeur attendue ?* Si la réponse est
« du code », la garde est vacue avant d'exister.

**Les membres, énumérés** — la forme que ce fichier prescrit pour une phrase sur un
ensemble :

| l'instance | ce qui était dérivé de quoi |
|---|---|
| **élire le segment qui RESSEMBLE au symbole** (proposée, refusée le 19/09/2026) | le segment choisi **par** le symbole, puis comparé au symbole : `concorde` n'aurait plus jamais valu `false` |
| `panneau-mesure-ce-quil-affiche`, première forme | la signature enregistrée comparée à celle du panneau — **elle l'est par construction**, quoi qu'on ait mesuré |
| la **convergence des lecteurs de signature**, une semaine plus tôt | quatre lecteurs ramenés à UNE valeur : le désaccord fermé, sans que personne demande ce que la valeur décrivait |

**LA TROISIÈME EST CELLE QUI ÉLARGIT LA CLASSE, et c'est pour ça qu'elle y entre.** Rien
n'y a l'air circulaire : quatre lecteurs distincts, qu'on fait coïncider. Et pourtant
l'accord était **garanti** — ils dérivaient du même fait. *Faire coïncider deux dérivées
d'un fait ne dit rien sur le fait.* La classe n'est donc pas « la garde se cite
elle-même » mais, plus largement :

> **Un accord qui ne peut pas échouer ne mesure rien.** Qu'il vienne d'une valeur
> attendue calculée depuis le sujet, ou de deux dérivées d'une même source qu'on
> rapproche : dans les deux cas l'égalité est vraie par construction, donc elle ne porte
> aucune information — et elle a exactement l'aspect d'une vérification qui passe.

*(L'identifiant de cette troisième instance n'est plus dans le source : il est parti avec
le bouton « Mesurer ». `git log -S` le retrouve ; le fichier, non.)*

**Le remède était déjà écrit, sous sa forme positive** : *un recompte ne peut pas hériter
de l'erreur qu'il vérifie.* Une garde qui REFAIT la mesure ne partage que ses entrées ;
une garde qui relit la comptabilité autour d'elle partage le raisonnement qu'elle
contrôle.

##### Et trois candidats à une même ancre n'étaient pas trois degrés d'une solution

Le cas du 19/09 vaut d'être gardé parce que les trois avaient l'air d'une gradation —
du plus grossier au plus fin — et que **deux sont des impasses** :

| l'ancre | ce qu'elle vaut |
|---|---|
| **la position** (« le segment 1 ») | FRAGILE : elle a cassé le jour où l'application a inséré l'étiquette de compte, et « le segment 2 » recasserait au suivant |
| **la ressemblance au symbole** | CIRCULAIRE : la prise dérivée de ce qu'elle vérifie — le refus survit en apparence et cesse d'attraper l'accident |
| **la composition** (le segment qui PRÉCÈDE `Achat`/`Vente`) | INDÉPENDANTE du symbole, donc le refus tient ; et VÉRIFIABLE contre `nomRobot`, donc elle ne peut pas décrire une règle que le générateur n'applique plus |

> **Quand plusieurs ancres se présentent, elles ne se classent pas sur la robustesse mais
> sur deux questions qui se posent AVANT elle** : *est-elle indépendante de ce qu'elle
> sert à vérifier ?* et *quelque chose dans le dépôt peut-il la démentir ?* Une ancre qui
> échoue à la première est vacue ; une ancre qui échoue à la seconde est un commentaire.

## Trois périodes confondues en une, et le R par an récompensait l'extinction

**STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ sur trois lignes, cause et magnitude
MESURÉES DANS LE DÉPÔT.** Trois lignes affichaient une durée courte, pour trois raisons
sans rapport :

| ligne | bougies | durée affichée | cause réelle |
|---|---|---|---|
| Cuivre | 4,5 a | 3,9 ans | les bougies manquent — réexport MT5 |
| USDJPY | 7,7 a | 3,6 ans | plus aucun trade depuis 2023 |
| Bitcoin | 7,7 a | 4,5 ans | plus aucun trade depuis 2024 |

**Une barre courte se lit « pas assez de données »** alors qu'elle peut dire « la
configuration a cessé de produire des signaux ». Trois causes, un seul trait — c'est la
famille du tiret qui en couvrait trois, sur une grandeur au lieu d'une absence.

### Et le dénominateur du R par an prenait la mauvaise

La durée est le dénominateur du R par an, et c'était la période **ACTIVE** — première
entrée → dernière sortie. Mesuré sur une série de banc qui devient plate à mi-parcours :

| | durée | R par an |
|---|---|---|
| période MESURÉE (la fenêtre balayée) | 5,85 ans | **−4,45** |
| période active (ce qui s'est produit) | 1,68 an | **−15,46** ← ce qui était affiché |

**Un facteur 3,48.** Et le sens du biais est ce qui le rend grave : le chiffre le plus
visible d'une ligne était gonflé **exactement pour les configurations qui ont cessé de
fonctionner**.

> **Une année sans trade est une année de rendement nul, pas une année qui n'existe
> pas.** C'est le pire endroit possible pour un biais : il récompense l'extinction.

### Trois périodes, trois noms, et aucune ne se déduit d'une autre

| | ce que c'est | qui la connaît |
|---|---|---|
| **couverte** | ce dont on dispose en bougies | la série |
| **MESURÉE** | la fenêtre où la configuration pouvait OUVRIR — bornes et fenêtre choisie | `backtester`, et lui seul |
| **active** | du premier trade au dernier | la liste de trades |

**La mesurée est stampée par qui la décide**, parce que personne ne peut la redériver :
`decouper` garde 400 jours d'amorce AVANT la borne, donc `df.t[0]` n'est pas le début de
la mesure ; et une liste de trades ne connaît que ce qui s'est produit. C'est la figure
de `deposes` — la porte unique — appliquée à une grandeur au lieu d'une écriture, et
elle va jusqu'au bout : `pfTrades` la porte avec la liste, sinon la projection en
`{e, s, r}` la perdait et tout l'aval retombait sur l'active **sans le dire**.

**Le repli n'est pas muet.** Une liste tranchée (`trades.slice`) perd le stamp — c'est
le cas du walk-forward, où chaque moitié est légitimement jugée sur son propre étalement.
`anneesSource` dit laquelle a servi, plutôt que de laisser un lecteur croire à la
mesurée quand il lit l'active.

**Et la fenêtre commune d'un portefeuille prend les mesurées.** Une ligne éteinte en 2023
mais balayée jusqu'en 2026 a bien tourné avec les autres jusqu'en 2026, en ne rapportant
rien : la prendre à son dernier trade raccourcissait la fenêtre commune de **toutes** les
autres.

### La frise montre les deux, et l'écart est le message

La barre porte la période **mesurée** ; une marque se pose au **dernier trade**. Une
configuration dont le dernier trade date de trois ans se voit alors d'un coup d'œil, par
l'écart entre les deux — et une barre courte cesse de vouloir dire trois choses.

**Le libellé qui manquait** vit sur la ligne et dans le Backtest : *« dernier trade en
09/2023 — rien depuis 3,0 ans »*, en encre d'alerte au-delà du seuil. Date **absolue**
(règle 12) : sur une fenêtre figée, « il y a trois ans » vieillirait sans se démentir.

**`SEUIL_MORT` vaut un an, et c'est un ARBITRAGE écrit comme tel.** Une configuration peut
légitimement se taire plusieurs mois — un régime range, un filtre sélectif — sans que ça
dise quoi que ce soit ; une année entière de fenêtre balayée sans une entrée change la
décision. Il ne pilote **que** la mention du silence et son encre : la date du dernier
trade s'affiche toujours. Un seuil qui déciderait aussi de MONTRER la date reproduirait
le défaut — l'information manquerait là où elle n'alerte pas encore.

### Le banc ne pouvait pas faire mourir une famille d'exemple

Les dix bougent sur toute leur fenêtre : leur période active vaut leur période mesurée,
et l'état « éteinte » n'y existe pas. Mesuré au rendu avant d'écrire la garde : trois
marques sur trois à `none`. C'est la règle 10, une fois de plus — **le cas qu'on sème
spontanément est celui où le défaut ne peut pas se produire** — et la graine gelée
interdit de le corriger dans les données.

La garde fait donc tourner le VRAI producteur contre une source contrôlée : une fenêtre
allongée de trois ans au-delà du dernier trade d'UNE ligne, et les deux états sont
mesurés ensemble — la marque paraît sur celle-là et sur aucune autre.
`scripts/app/rAn-divise-par-la-mesuree.test.mjs` porte les sept, éprouvées par trois
mutations : diviser par l'active fait tomber en nommant **−15,46 contre −4,45 et le
facteur 3,48** ; remettre la barre sur l'active tombe ; éteindre la marque tombe au rendu.

**Son angle mort est en tête** : elle tient le dénominateur, pas que la fenêtre stampée
soit la bonne. `backtester` la dérive de `cfg.debut`/`cfg.fin` ; si ces deux-là
décrivaient mal ce qui a été balayé, la garde et le produit se tromperaient ensemble.

### Ce que ça périme, et pourquoi `MOTEUR_V` NE tourne pas

Les `rAn` déjà enregistrés sur les lignes validées ont été calculés sous l'ancienne
règle : sur une configuration éteinte, ils sont gonflés. Le grand chiffre du
portefeuille, lui, est REMESURÉ — il est donc juste dès cette version, et la réserve
sous le bandeau dit déjà que les deux peuvent différer.

**`MOTEUR_V` ne tourne pas, et c'est un choix qui se dit.** Les TRADES ne changent pas :
mêmes entrées, mêmes sorties, même total en R. Seul un chiffre dérivé à l'affichage
change de dénominateur. Tourner la clé périmerait les scans enregistrés de tout le monde
pour une valeur que « Remesurer les lignes » recalcule en une passe — le coût serait
sans rapport avec ce qui a bougé. **C'est un arbitrage, pas une évidence**, et il se
relit : le jour où une règle de DÉCISION changera, la réponse sera l'inverse.

## Une intersection est fixée par sa ligne la plus courte, et elle doit la NOMMER

**STATUT · CAUSE ÉTABLIE — symptôme RAPPORTÉ, mécanisme et correctif MESURÉS DANS LE
DÉPÔT.** Le bilan annonçait *« + 89,7 R / an · sur les 1,0 ans où les 14 lignes
tournaient ensemble »*. Le correctif de la fenêtre commune était juste, et il venait de
produire **un chiffre annualisé depuis douze mois d'observation sur quatorze
stratégies**.

> **Ce n'est pas plus fiable que la somme brute — c'est DIFFÉREMMENT peu fiable.** Et la
> note ne portait que la seconde réserve.

La cause est mécanique : la fenêtre commune est une **intersection**, donc la ligne la
plus courte la fixe pour toutes les autres.

| période mesurée | |
|---|---|
| Bitcoin / Dollar US | 03/2022 → 08/2026 |
| Dollar australien / Dollar US | 01/2020 → 10/2023 |
| les douze autres | 01/2020 → 09/2026 |

Ces deux-là ne se recouvrent que sur ~1,6 an. **Douze lignes mesurées sur 6,7 ans
voyaient leur agrégat réduit à la fenêtre où deux voisines coexistent.**

### Trois manques, et aucun n'est un calcul

**1 · Le NOM des lignes qui bornent.** `fenetreCommune` rend désormais `borneBas` (celle
qui commence le plus tard) et `borneHaut` (celle qui s'arrête le plus tôt) — les deux
seules dont l'écartement élargit la fenêtre. Elles peuvent être la **même** ligne, et le
texte le dit alors au singulier : annoncer « les 2 lignes » décrirait un geste qui
n'existe pas.

> **Sans le nom, le chiffre est SUBI ; avec le nom, il devient une décision.**

**2 · Le refus d'annualiser sous deux ans.** `SEUIL_ANNUALISER` : en dessous, le grand
chiffre devient le **R cumulé** et la sous-ligne dit pourquoi. C'est un arbitrage écrit
comme tel — deux ans est le minimum pour qu'une fenêtre porte deux saisons de la plupart
des régimes. **Il ne cache rien** : le R cumulé et la fenêtre restent à l'écran, c'est
leur RAPPORT qui est retenu. Et tout ratio qui divise par le temps en hérite — le
rendement par unité de creux affichait « excellent » sur douze mois.

**3 · Le geste, avec son effet annoncé AVANT le clic.** « écarter du bilan les 2 lignes
qui bornent la fenêtre → 6,7 ans ». La fenêtre d'après est calculée pour être écrite sur
le bouton : *un geste qui ne dit pas ce qu'il donne demande de parier sur son propre
effet.* Il ne s'offre que s'il élargit réellement et s'il laisse deux lignes à croiser.

**Écarter du BILAN n'est pas retirer du portefeuille.** La ligne garde sa rangée, son
robot et son chiffre ; elle cesse seulement d'entrer dans les quatre calculs d'ensemble.
Les confondre ferait **détruire une ligne pour lire un agrégat**. Le geste inverse prend
le même chemin — une porte qui ne s'ouvre que dans un sens fait d'un réglage une
suppression.

**Et `pfEcart` EST restauré avec la session, sur le critère déjà écrit** pour
`familleFiltre` : il change le grand chiffre, donc il pourrait être de la même famille —
ce qui le sauve n'est pas son innocuité, c'est qu'il **SE MONTRE**. Le bandeau nomme en
permanence les lignes écartées et offre de les reprendre. *Le réglage dangereux n'était
pas le réglage restauré, c'était le silence.*

Et le critère se dit alors plus étroitement que « ce réglage influe-t-il ? », qui est
encore une intention : **« son influence est-elle visible depuis l'écran qui la
subit ? »** La précision porte tout — visible quelque part ne suffit pas, il faut
qu'elle le soit sur l'écran dont le chiffre change. `familleFiltre` échouait à ça : il
pouvait vider une liste depuis un réglage qu'on ne voit pas en la regardant. `pfEcart`
y répond : le bandeau qui porte le grand chiffre nomme, juste en dessous, les lignes
qu'il exclut.

### Une fenêtre CHOISIE est un réglage, pas un fait de marché

AUDUSD était mesuré jusqu'en 10/2023 alors que ses bougies vont jusqu'en 09/2026. Ce
n'est ni les données ni l'extinction : c'est la fenêtre portée par sa **configuration**.
La ligne le dit désormais — « mesuré sur 2020–2023 · fenêtre choisie, pas toute la
série » — et c'est un fait de nature différente de « dernier trade en 06/2023 », qui se
lisait pareil.

**ET LA PREMIÈRE VERSION LE DEVINAIT, ce qui était la règle 1.** Elle comparait la
fenêtre mesurée à la couverture des bougies avec un seuil en jours : une intention
(« ces dates ont-elles l'air rognées ? ») pour un résultat (« la ligne porte-t-elle une
fenêtre de mesure ? »). Et l'amorce de 400 jours aurait faussé la borne basse. **Le
réglage existe et se lit** : `fenetreDeLigne(v).complete` répond directement.

### Trois comptes voisins sont trois sujets

« 15 lignes · reste à faire — 14 à tester, 1 à contrôler », « les 14 lignes tournaient
ensemble » et « Exporter les robots (14) » cohabitaient sans dire ce que chacun compte :
on y lit une incohérence là où il y a trois questions. Le deuxième nomme désormais le
sien — les lignes **MESURABLES**. Et « 12 paris · A et B comptent pour un · et 1 de
plus » nomme le troisième comme les deux autres : la liste ne s'élide qu'au quatrième.

`scripts/app/fenetre-commune-se-nomme.test.mjs` tient les cinq. **Sa prise est
l'effondrement lui-même** : le semis doit rendre une fenêtre sous deux ans, sinon rien de
ce qui suit ne mord. Éprouvée par deux mutations — inverser le sens de la borne haute
fait tomber la prise en nommant la durée obtenue, éteindre le refus d'annualiser fait
tomber le troisième.

**Son angle mort est en tête** : elle tient QUI borne et CE QUE le geste promet, pas que
deux ans soit le bon seuil. C'est un arbitrage, et aucune garde ne peut le valider — ce
qu'elle interdit, c'est qu'il redevienne implicite.

## Un accord qui tient par ANNULATION D'ERREURS

**C'est la voisine de la règle 15, et elle est pire.** Là, une sonde muette rend le défaut
indistinguable du cas normal. Ici, c'est un **accord juste** qui est indistinguable d'un
accord **fortuit** — et rien, dans aucun des deux maillons pris isolément, ne dit lequel
des deux on a.

Le cas mesuré : la règle de début de semaine du robot et celle du moteur s'accordent
parfaitement. Pas parce que les deux lisent UTC — **aucun des deux ne le fait**.

| | ce qui est lu |
|---|---|
| `robot-mt5.js` | `TimeToStruct(TimeCurrent(), …)` → heure **serveur** du courtier |
| `Export_H1_Vuna.mq5` | `TimeToString(r[i].time, …)` → la même, en horloge murale |
| `moteur.js` · `lireCsv` | `Date.UTC(an, mois-1, jour, h, m)` → cette horloge murale **rangée en UTC** |
| `moteur.js` · `executable` | `getUTCDay()` / `getUTCHours()` → **ressort l'heure serveur** |

`lireCsv` range une heure de serveur dans un champ UTC ; `executable` l'en ressort telle
quelle. **Deux erreurs qui s'annulent exactement**, et le résultat est juste.

> **Un accord qui tient par annulation d'erreurs est indistinguable d'un accord par
> justesse.** Seule une garde qui lie les MAILLONS les sépare — aucune garde posée sur un
> maillon ne le peut, puisque chaque maillon, pris seul, a tort.

**Et le danger n'est pas le maillon fautif : c'est le maillon CORRIGÉ.** Quelqu'un qui
lirait `lireCsv` et déciderait, de bonne foi, d'y interpréter le fuseau « pour bien
faire » romprait l'accord — et **aucun test ne rougirait**, parce que chaque moitié serait
devenue *plus* correcte. C'est le seul cas du dépôt où réparer casse.

### Et l'annulation est LOAD-BEARING bien au-delà de la règle qui l'a révélée

Mesuré en cherchant les autres consommateurs : `moteur.js` porte **vingt-trois** lectures
`getUTC*`, et la plus lourde n'est pas la règle de début de semaine. C'est
`resamplerBrut`, qui construit le **seau D1** sur
`Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())` — appliqué à une horloge
murale de serveur, ce seau est le **jour calendaire du courtier**, c'est-à-dire exactement
la frontière sur laquelle MT5 bâtit ses barres D1.

**Toute décision en `ut: 'D1'` — la plus courante du produit — repose donc sur cette
annulation.** Ce n'est pas une bizarrerie tolérable dans un coin : c'est ce qui aligne le
moteur sur le testeur, et ça n'était écrit nulle part.

`scripts/mt5/meme-horloge.test.mjs` lie les maillons — la forme de `manifeste-version`,
qui liait trois chemins : *le défaut ne serait dans aucun d'eux pris isolément, il serait
dans leur désaccord.* **Son angle mort est chiffré** : elle couvre **deux** des
vingt-trois lectures, les deux dont on a mesuré qu'elles portent l'accord avec MT5. Les
vingt et une autres suivent la même convention sans garde, et une conversion de fuseau
posée dans `lireCsv` les emporterait toutes ensemble.

**Le signal, au moment d'écrire :** *ce maillon est-il juste TOUT SEUL, ou seulement en
compagnie du suivant ?* Quand la réponse est « en compagnie », l'accord se documente à
l'endroit où il se produit — dans une garde qui lit les deux — et jamais dans un
commentaire posé sur l'un des deux, qui sera lu comme une excuse pour un défaut local.

### Et si une vraie conversion devient nécessaire : on NOMME avant de convertir

C'est le geste à faire le jour où quelqu'un aura une raison d'interpréter un fuseau, et il
n'est pas celui qui vient à l'esprit. **Le réflexe est de corriger `lireCsv` ; c'est
exactement ce qui casse.**

L'ordre est l'inverse : la convention se rend d'abord **explicite**, en nommant l'horloge —
*heure serveur du courtier* — partout où elle est lue, **jusque dans les identifiants**. Le
lecteur suivant sait alors qu'il n'y a rien à convertir, et la conversion, si elle reste
nécessaire, se pose sur une chaîne dont chaque maillon dit ce qu'il porte.

> **Un commentaire ne suffira pas ; un nom, si.** C'est la leçon de `sessionInfo` devenu
> `fenetreHeuresInfo` : un champ qui nomme mal ce qu'il porte coûte plus cher qu'un champ
> absent, et un commentaire qui explique une convention ne se lit qu'après qu'on l'a
> enfreinte.

La consigne vit aussi **dans le message de `meme-horloge`**, parce que c'est là qu'elle
arrive au moment où elle sert — une garde de convention doit ENSEIGNER la convention, pas
opposer un veto, et un veto se contourne.

## Un panneau qui couvre ce qu'on surveille, et le pli qui montre MOINS de la même chose

**STATUT · CAUSE ÉTABLIE — encombrement RAPPORTÉ (le panneau déplié fait ~590 x 230 px
sur un graphique de 1 000 px et couvre l'action de prix récente, c'est-à-dire ce qu'on
regarde quand une position est ouverte), structure du pli MESURÉE DANS LE DÉPÔT, sur le
source émis.**

Le pli est un `OBJ_BUTTON` de 16 px au coin haut droit du cadre, et **pas un
`OBJ_LABEL`** : un label ne rend pas `CHARTEVENT_OBJECT_CLICK` de façon fiable. Le
gestionnaire se filtre sur le **NOM de l'objet**, jamais sur une position d'écran — le
panneau change de largeur à chaque rangée et à chaque taille de police, et une zone
cliquable écrite en pixels serait fausse au premier redimensionnement. C'est la règle 12
sur une autre grandeur : *une coordonnée n'est vraie que depuis un référentiel stable*, et
un cadre qui se redimensionne n'en est pas un.

**L'état survit au redémarrage**, dans une variable globale du terminal dont la clé porte
le symbole ET le magique : un pli qu'il faut refaire à chaque lancement est un pli que
personne ne fait, et deux robots sur deux graphiques du même symbole ne partagent pas le
leur. Il se relit à `OnInit` **après** les deux lignes des entrées effectives — un panneau
replié cache des chiffres, jamais ce avec quoi le robot a DÉMARRÉ.

### Le pli montre MOINS de la même chose, jamais autre chose

C'est la seule règle qui compte, et elle décide de tout le reste. La tentation, en
écrivant une forme réduite, est de la **reformuler** — un mot d'un côté, la ligne complète
de l'autre — et le panneau porte alors deux états à tenir d'accord, dont rien à l'écran ne
dit lequel est le bon.

> **Un pli n'est pas une seconde surface : c'est la même, tronquée.** L'état s'écrit donc
> UNE fois, et seule sa COLONNE change ; la position se lit UNE fois, et le replié en
> montre deux champs sur cinq.

C'est la figure de `deposes`, appliquée à un affichage au lieu d'une écriture : une garde
sur un chemin ferme un CAS, une source unique ferme la CLASSE.

### Et l'arrêt est le cas où le panneau existe

Un robot arrêté qui se replierait sur le seul mot de son état ferait perdre le geste qui
débloque. Le **motif** voyage donc dans la rangée repliée — et l'écrire a fait tomber un
défaut plus ancien, qui n'était visible que de là :

| ce qui arrête le robot | ce que le panneau disait |
|---|---|
| `TERMINAL_TRADE_ALLOWED` — le bouton du terminal | « Activez le bouton Algo Trading » |
| `MQL_TRADE_ALLOWED` — les propriétés de CET expert | « Activez le bouton Algo Trading » |
| `ACCOUNT_TRADE_EXPERT` — le serveur du courtier | « Activez le bouton Algo Trading » |

**Trois causes, un seul conseil, et il est faux pour deux d'entre elles.** C'est la famille
du tiret qui couvrait trois causes, sur un geste au lieu d'une date : *il disculpe sans
avoir regardé*. Les trois portent désormais leur motif et leur geste, décidés au même
endroit — `EtatRobot`, lu par les deux formes.

> **Un conseil unique posé sur des causes multiples est faux partout sauf sur une.** Le
> tiret qui couvre trois causes n'en nomme aucune ; le conseil qui en couvre trois en
> nomme une et se trompe sur les autres — ce qui est pire, parce qu'il a la forme d'une
> réponse. Personne ne vérifie un conseil qu'il vient de recevoir.

**Et ce qu'il coûte n'est pas l'erreur, c'est l'ARRÊT.** Un conseil a la forme d'une
réponse, donc il met fin à la recherche : celui qui le lit ne cherche plus pourquoi son
robot est arrêté, il va cliquer sur un bouton qui ne changera rien, et il reviendra en
disant que le robot ne démarre pas. C'est la famille de « un champ absent fait poser la
question ; un champ qui ment y répond », poussée d'un cran — **un conseil faux est plus
coûteux qu'un silence**, parce que le silence, lui, laisse chercher.

**ET C'EST LA CONTRAINTE DE PLACE QUI L'A TROUVÉ, PAS UNE RELECTURE.** Compté plutôt que
juré : la phrase attrape-tout a été posée le 14 septembre et retirée le 18, et
`robot-mt5.js` a été committé **trente et une fois** dans l'intervalle. Ce n'est donc pas
la durée qui compte — quatre jours —, c'est qu'aucune de ces trente et une passes ne l'ait
vue, dans un panneau où elle tenait confortablement sur sa rangée. Exiger le motif dans
**une** rangée resserrée a forcé à répondre à « le motif de quoi ? », et il a fallu
distinguer les trois conditions pour l'écrire.

> **Une surface qui rétrécit n'autorise plus la phrase attrape-tout.** Ce n'est pas une
> méthode qu'on peut appliquer à volonté, et il faut le dire : le pli a trouvé ce défaut
> par accident. Mais le mécanisme est reproductible et il vaut d'être nommé — *réécrire
> un affichage pour la moitié de sa place oblige à choisir ce qu'il dit*, et ce choix
> découvre les phrases qui ne disaient rien de précis.

### Et le geste répond dans le temps du CLIC, pas dans celui du système

Le pli redessine depuis le gestionnaire, pas au prochain tick. Sur un marché calme, un
tick peut être à des minutes : un pli qui l'attendrait serait, pour l'utilisateur, un
bouton cassé — et le second clic, celui qui replie ce qu'on venait de déplier, arriverait
avant le premier effet.

C'est la famille d'un geste déjà posé dans le produit : la révocation de l'URL d'un objet
téléchargé est **différée de deux secondes**, à ses dix appels, plutôt que faite au retour
de la fonction. Le navigateur n'a pas fini de servir le fichier quand le code, lui, a fini
de s'exécuter. Les deux disent la même chose depuis deux bouts : **le temps du système
n'est pas celui du geste**, et c'est le geste qui fixe l'échéance.

**Et les objets cachés sont DÉTRUITS, pas masqués.** `PAN_MAX` borne le nombre de rangées
et son dépassement se journalise : des labels invisibles y compteraient, et le plafond se
plaindrait à tort sur un panneau qui n'affiche qu'une rangée. Le mécanisme existait déjà —
`PanneauDessiner` efface les cellules au-delà de la dernière écrite —, il fallait le
vérifier plutôt que de le croire.

`scripts/mt5/panneau-se-replie.test.mjs` tient les sept, éprouvées par cinq mutations —
replier sans nommer l'état arrêté, une seconde formulation de l'état, une seconde rangée
repliée, deux causes ramenées au même mot, et le pli relu avant les entrées effectives.

**Son angle mort est en tête** : rien dans le dépôt n'exécute MQL5. Elle ne mesure pas une
hauteur en pixels — elle mesure la **structure qui la produit**, le nombre de rangées que
`Ligne()` ouvre sur le chemin replié, **sous la règle de `Ligne()` relue dans le source
émis** avant d'être appliquée. Un port qui ne vérifie pas que la règle portée est encore
celle qui tourne mesure une règle que personne n'exécute.

## Un nom tronqué perd sa FIN — donc ce qui est au début est payé par ce qui suit

**STATUT · CAUSE ÉTABLIE — troncature RAPPORTÉE (capture du Navigateur MT5 :
« Vena_Compten1_USDJPY_Achat_ema_5_SL0… »), budget du préfixe MESURÉ DANS LE DÉPÔT, sur
la composition réelle du nom.**

**Le rapport désignait `nomRobot`, et le geste vivait ailleurs** : `nomRobot` rend
`Vuna_<instrument>_…`, et c'est l'application qui insère le compte après `Vuna_`, dans
`etiquetteCompte()`. Le geste était juste, la carte non — et les deux se vérifient
séparément. *Porter le geste là où le rapport pointe* aurait fait entrer l'étiquette de
compte dans le générateur de robots, qui ne connaît pas les comptes : un défaut neuf, posé
au nom d'une consigne exacte sur ce qu'il fallait faire.

**DEUXIÈME INSTANCE LE LENDEMAIN, et elle donne la cause.** Un rapport sur la colonne
gratuite désignait `/tarifs` ; la phrase muette vivait sur l'**accueil**, et `/tarifs`
nommait déjà ce qu'on lui demandait d'ajouter. Deux fois de suite, même forme :

> **Un rapport désigne l'endroit où le symptôme a été VU — c'est-à-dire un écran.** La
> cause vit dans un fichier, et rien ne garantit que l'écran et le fichier se
> correspondent : une page compose son texte depuis plusieurs sources, et deux pages
> peuvent partager la même phrase. *La carte du rapport est une carte de l'affichage,
> jamais du source.*

Le geste coûte une commande, et c'est la même que pour les nombres : **chercher la
phrase avant de la corriger**. Si elle ne se trouve pas là où le rapport pointe, c'est
qu'on allait l'ajouter une seconde fois — et une phrase écrite deux fois est une
divergence qui attend.

**ET C'EST CE QUI REND LA COMMANDE NON NÉGOCIABLE : l'erreur de carte ne produit aucun
défaut le jour où on la commet.** Une seconde copie s'affiche juste, se lit juste, et
passe toutes les gardes — elle ne devient fausse que le jour où l'une des deux est
modifiée seule. Rien ne rougit, rien ne se plaint, et personne ne sait qu'il y a
désormais deux vérités à tenir d'accord. Mesuré sur le cas du palier gratuit : la
seconde copie a vécu **sept jours et treize commits** à travers `src/`, et ce qui l'a
trouvée n'est pas une relecture — c'est d'avoir eu besoin de la phrase une troisième
fois.

> **Un défaut différé n'a pas de moment où il se signale**, donc aucune vigilance ne
> peut le rattraper : il n'y a rien à remarquer. Seul un geste posé AVANT l'écriture le
> ferme — et c'est pourquoi la commande vaut mieux que l'attention, ici comme pour les
> appositions chiffrées.

L'étiquette de compte tenait jusqu'à **douze** caractères, et elle vit **avant**
l'instrument. Or le compte ne distingue que cinq choses, l'instrument en distingue
quinze dans une liste : le nom dépensait son budget visible sur le segment le moins
distinctif, et coupait le plus distinctif.

> **Un nom tronqué ne perd pas « un peu de tout » : il perd sa fin.** Tout ce qu'on place
> au début est donc payé par ce qui suit, et l'ordre des segments décide de ce qui
> survit à la coupe. La question n'est pas « ce nom est-il trop long ? » mais **« qu'est-ce
> qui est payé par ce que j'écris là ? »**

**L'étiquette DISTINGUE, elle ne décrit pas.** `abregerEtiquette` garde l'initiale de
chaque mot et tous les chiffres — les cinq comptes rendent `C1`…`C5`, deux courtiers
rendent leurs initiales, « Admiral Markets UK Ltd » rend `AMUL`. C'est une **propriété**,
pas une liste de noms à tenir à jour (règle 8) : les mots d'une seule lettre sont écartés
parce que le « n » de « nº » n'a jamais distingué deux comptes, et une initiale seule se
complète par la suite du premier mot — « Pepperstone » rend `Pep`, pas `P`. Une étiquette
qui ne distingue plus rien ne mérite plus les caractères qu'elle coûte : la garde exige
**cinq étiquettes distinctes**, et une collision y est plus grave que la troncature.

**Mesuré dans le dépôt, sur la composition réelle** : 14 caractères avant l'instrument
avec l'ancienne règle, **8** avec la nouvelle, **10 au pire** (l'étiquette est plafonnée à
quatre). Le rapport annonçait douze caractères gagnés ; c'en est **six** sur le cas
mesuré et huit dans le pire cas — le geste tient, le chiffre était juré.

### La borne porte sur ce qui PRÉCÈDE, pas sur la longueur totale

Borner le nom entier aurait manqué le sujet : un nom long dont l'instrument paraît en
huitième caractère est lisible, un nom court qui le repousse en vingtième ne l'est pas.
La propriété est « l'instrument est visible », donc la borne est
`indexOf(instrument) <= SEUIL_AVANT`, et `SEUIL_AVANT` est un **arbitrage écrit comme
tel** — cinq caractères fixes, quatre d'étiquette, un séparateur. Aucune garde ne peut le
valider ; ce qu'elle interdit, c'est qu'il redevienne implicite.

**Son angle mort est en tête** : rien dans le dépôt ne mesure la largeur de la colonne du
Navigateur, qui dépend de la fenêtre, du thème et de la police du poste. La garde ne
prouve donc pas que l'instrument est visible — elle borne ce qui le précède.

### Renommer un fichier n'est sans risque que si RIEN ne s'apparie dessus

Un `.ex5` déjà compilé chez l'utilisateur garde son ancien nom. S'il servait quelque part
à retrouver les positions du robot, le renommage serait une **rupture silencieuse** —
personne ne relit un nom de fichier. Les trois chemins ont donc été relus plutôt que
supposés, et chacun a son assertion :

| ce qui pourrait s'apparier sur le nom | ce qui a été relu |
|---|---|
| le refus de symbole du robot | il compare le **noyau** de `_Symbol` au littéral émis ; le nom du fichier n'entre pas dans le `.mq5` |
| le magique et la marque d'ordre | `magicDe` hache la configuration et la **clé** du compte, jamais son étiquette ; la marque dérive du build |
| la trace du Journal (`fichier`) | elle est **affichée**, jamais comparée — l'appariement passe par `magicDe` |

La troisième est la seule qui pouvait mordre, et c'est celle qu'une relecture rapide
aurait sautée : la trace EXISTE, elle porte le nom, et il aurait suffi qu'une ligne le
recalcule pour comparer. Elle est gardée **sur l'absence** (règle 14, troisième issue) :
aucun `fichier` en position de comparaison.

`scripts/app/nom-de-robot-montre-son-instrument.test.mjs` tient les cinq, éprouvées par
quatre mutations — l'étiquette qui reprend le nom entier (elle tombe **en nommant les 14
caractères**), l'abrègement qui perd les chiffres et fait collisionner les cinq comptes,
le magique dérivé de l'étiquette, et le nom de fichier remis en comparaison.

## Quinze gestes pour une consultation, c'est zéro consultation

**STATUT · CAUSE ÉTABLIE — geste RAPPORTÉ (quinze robots en réel, et le bloc du Journal
restait sur « aucun trade » parce qu'il fallait quinze glisser-déposer pour le remplir),
correctif MESURÉ DANS LE DÉPÔT, au rendu, sur le fichier livré.**

Le robot écrivait déjà tout. La donnée était là, le lecteur était là — **c'est le GESTE
qui manquait**, et un geste à répéter quinze fois pour une consultation n'est pas un
geste coûteux, c'est un geste qui n'a pas lieu. Une poignée de dossier
(`showDirectoryPicker`) se donne une fois, se range dans IndexedDB et se relit au
démarrage.

> **Un coût par unité se lit comme un petit coût ; multiplié par le parc, c'est un
> refus.** La question n'est pas « ce geste est-il pénible ? » mais « combien de fois
> faut-il le faire pour obtenir une réponse ? » — et au-delà de deux ou trois, la
> réponse n'est jamais obtenue.

**RIEN DE NEUF N'A ÉTÉ INVENTÉ, et c'est délibéré.** La mécanique de permission est
celle du fichier de sauvegarde, réutilisée telle quelle : permission vérifiée AVANT
toute lecture, état d'attente rendu, « Réautoriser », bascule vers « Choisir à
nouveau » après un refus retenu, les trois issues nommées. Deux mécanismes de
permission divergeraient, et l'utilisateur ne saurait plus lequel a échoué — c'est la
figure de `deposes`, appliquée à une autorisation au lieu d'une écriture.

### Trois points de doctrine, et le troisième est celui qui dure

| | ce qui est tenu |
|---|---|
| **`mode: 'read'`, aux quatre appels** | Véna ne doit jamais pouvoir écrire dans le dossier du terminal — c'est là que vit l'historique du courtier. Garde ancrée sur l'APPEL ; mutation : un seul `readwrite` la fait tomber **en nommant sa ligne** |
| **rien ne sort** | c'est une lecture de disque. La porte entre dans « Ce qui sort d'ici » **avec la mention qu'elle ne fait rien sortir**, et elle ne COMPTE pas dans les portes ouvertes — une liste qui alarme à tort cesse d'être lue, et un accès au disque qu'on découvre ailleurs inquiète plus qu'un accès déclaré |
| **le motif se dérive, il ne s'énumère pas** | le robot compose *préfixe + symbole + magique + .csv* ; le lecteur reconnaît cette FORME. Aucune liste : **un seizième robot est lu sans être nommé nulle part** |

Le préfixe `SIV_trades_` reste **gelé** — les robots déjà compilés l'écrivent, et
personne n'a à les recompiler pour être lu. Le lecteur accepte les deux préfixes, pour
que le jour du dégel ne demande pas de corriger un lecteur sur un parc déjà en place.

### La lecture a lieu à l'ouverture, et la conséquence est ÉCRITE

Pas d'intervalle, pas de bouton : un dossier relu en boucle lirait quinze fichiers pour
rien la plupart du temps. Mais **un chiffre qui ne se rafraîchit pas pendant qu'on le
regarde est un chiffre dont on ignore l'âge** — donc la vue porte son instant de lecture,
en **absolu** : *relu à 19:42 · rechargez pour voir les trades passés depuis*. Une heure
d'horloge reste vraie ; « il y a 3 min » se figerait sans se démentir et vieillirait
d'autant que la page reste ouverte (règle 12). Et la phrase dit **quoi faire** — une
réserve sans son geste n'est qu'une inquiétude.

### Trois états, et le troisième n'est jamais un zéro

| l'état | ce que le bloc porte |
|---|---|
| dossier lu, trades trouvés | la vue d'ensemble · l'instant · le geste de rechargement |
| dossier lu, rien écrit | « accès accordé — aucun robot n'y a encore écrit de trade » |
| **pas de poignée** | le geste — **jamais « aucun trade réel encore »** |

Le troisième est le piège, et c'était le défaut livré : dire « aucun trade » sans avoir
regardé, c'est affirmer un fait qu'aucune mesure ne soutient. C'est exactement
`cachesDispo` — « mesuré à zéro » et « pas mesurable » écrits pareil.

**Et un QUATRIÈME compte a été ajouté parce que le zéro devait prouver sa prise** : les
journaux VUS sont comptés à part des journaux LUS. Sans lui, quinze fichiers tous
illisibles auraient rendu « dossier vide » — un zéro qui n'a rien regardé, sur le chemin
même qu'on instrumente pour ne plus en produire.

### La garde qui cherchait un MOT est restée verte — deuxième fois, autre langage

Le contrôle de l'instant absolu s'écrivait « aucun *il y a* suivi d'un chiffre ». Éprouvé
par mutation, il est resté **VERT** sur `il y a −582 min` : **le signe moins n'est pas un
chiffre.**

> **Chercher un mot interdit, c'est la course aux motifs — et cette fois ce n'est pas la
> prose qui a trompé la garde, c'est le CODE qu'elle surveillait.** Même famille que le
> compteur de parenthèses qui ne savait pas ce qu'est une chaîne : la garde ne comprenait
> pas assez de ce qu'elle lisait.

La prise a donc changé de forme, comme la règle 3 le prescrit : elle ne cherche plus un
mot, elle **mesure la phrase entière**. Entre « relu à » et son geste, l'écran ne doit
porter qu'une heure d'horloge et un séparateur — rien ne peut s'y glisser sans rompre la
forme, quel que soit le mot employé. Sous la même mutation, elle tombe en écrivant ce que
l'écran porte : *« 17:42 (il y a −582 min) · »*.

### Et une garde réancrée sur le RÉSULTAT au passage

`nom-vuna` vérifiait que la page contient le littéral `/^SIV_trades_/i`. Les trois lieux
qui reconnaissaient un journal sont passés par une porte unique, qui accepte aussi le nom
neuf : le littéral a disparu, l'invariant non. Elle demandait « le motif est-il écrit
ainsi ? » — une intention — pour décider « ce nom est-il reconnu ? » — le résultat. Elle
**fait tourner la fonction du produit** depuis, sur trois noms : le gelé, le neuf, et un
export de bougies qui doit être refusé.

`scripts/app/dossier-du-terminal.test.mjs` tient les quatre, éprouvées par six mutations.
**Son angle mort est en tête** : aucun banc ne peut ACCORDER une poignée de dossier —
Chromium n'ouvre pas de sélecteur natif sous automatisation. Les états « poignée
accordée » sont donc atteints en POSANT l'état que la lecture produit ; ce que la garde
ne prouve pas, c'est que la lecture remplit bien ces champs depuis un vrai dossier. Ce
qu'elle prouve, c'est qu'une fois atteint, chacun des trois états est rendu et ne ment
pas.

**Ce qui n'est PAS livré, et c'est une décision** : l'instantané des positions ouvertes
(TP, SL, R latent) demande que le robot écrive un second fichier, donc un réexport et une
recompilation des quinze. Il attend la livraison qui portera aussi le pli du panneau — si
l'utilisateur doit repasser sur quinze robots, autant que ce passage serve deux fois.

**Et le glisser-déposer reste**, en filet : sa cause ne disparaît pas — un terminal sur
une autre machine ou sur un VPS n'aura jamais de poignée. Ce qui change est le SUJET de
la phrase : plus « déposez-en un », mais « donnez-moi le dossier une fois, je les lirai
tous ».

## Un ÉTAT et un HISTORIQUE ne partagent pas un fichier

**STATUT · CAUSE ÉTABLIE — le besoin est RAPPORTÉ (les positions en cours n'étaient
visibles nulle part), la séparation et les quatre propriétés MESURÉES DANS LE DÉPÔT,
trois d'entre elles au rendu sur le fichier livré.**

Le journal des trades est un **ajout** ; les positions ouvertes sont un **état courant**.
Ce ne sont pas deux contenus du même fichier :

> **Un état qu'on ajoute devient un historique que personne ne voulait ; un historique
> qu'on remplace perd des trades.** Deux natures, deux fichiers, deux modes d'ouverture —
> `VNA_positions_…` est réécrit EN ENTIER à chaque fois, et son en-tête est écrit même
> sans position : **zéro ligne est un fait, l'absence de fichier en est un autre.**

**Le R latent est calculé par le ROBOT, et nulle part ailleurs.** Lui seul connaît le
risque en devise qui a DIMENSIONNÉ la position — la distance au stop initial, le même
dénominateur que `profit_R` du journal, donc deux colonnes comparables. Véna qui le
recalculerait depuis ses propres bougies serait une seconde vérité, et elle divergerait
au premier écart de prix entre le courtier et l'export. La garde s'ancre sur l'**absence**
d'un second producteur.

**Et une case vide reste vide.** Une position héritée d'un lancement précédent n'a pas de
risque initial connu : le robot écrit une case vide, et l'écran dit *pourquoi*. Fabriquer
un R depuis le risque courant rendrait un nombre qui a la forme d'une mesure sans en être
une.

### Le défaut propre à un état : il survit à ce qu'il décrit

Un robot arrêté laisse son dernier fichier en place. « Position ouverte sur GOLD,
+0,8 R » quatre jours plus tard **a la forme d'une réponse**, et c'est faux — la famille
qu'on ferme depuis trois jours. Le remède est l'instant, rendu en absolu, et un seuil
au-delà duquel l'écran cesse d'affirmer : *dernier instantané à 14:32 · le robot ne
tourne peut-être plus*.

**Et c'est le BATTEMENT qui rend la péremption lisible**, pas le seuil. Les trois
événements — ouverture, fermeture, palier — ne suffisent pas : entre eux le prix bouge,
donc le R latent aussi. Une minute d'intervalle donne au fichier une date qui avance tant
que le robot vit ; sans elle, un fichier figé serait indistinguable d'un fichier à jour.

### La fraîcheur se lit sur l'horloge du LECTEUR, jamais sur celle du fichier

La colonne `instant` porte l'heure **serveur du courtier** — c'est l'horloge du robot, et
elle peut être à des heures de celle du poste. La comparer à l'horloge du navigateur pour
décider « ça date » mélangerait deux horloges : c'est le défaut que `meme-horloge` tient
ailleurs, commis ici sur un seuil.

> **La date de MODIFICATION du fichier est dans l'horloge de celui qui lit, et elle
> répond exactement à la question posée** — le robot a-t-il écrit récemment. Un
> horodatage écrit par l'autre bout ne peut pas répondre à une question de fraîcheur
> posée ici.

**Et ce qui décide n'est pas que la conversion serait difficile — c'est qu'il n'y en a
pas.** On aurait pu convertir : le fuseau du serveur est lisible, et le calcul tient en
deux lignes justes.

> **Une valeur qui est dans le bon référentiel PAR CONSTRUCTION vaut mieux qu'une
> conversion juste.** Une conversion est un maillon de plus — et le chapitre de
> l'annulation d'erreurs dit ce qui arrive aux maillons : le danger n'est pas celui qui
> est faux, c'est celui que quelqu'un CORRIGE de bonne foi. Une valeur qui n'a jamais
> eu besoin d'être convertie n'offre rien à corriger.

Le geste, au moment de choisir une grandeur : *celle-ci est-elle déjà dans le
référentiel de la question, ou faut-il l'y amener ?* Quand les deux existent, la
première gagne — même si la seconde est plus « riche ».

**Et la figure des deux grandeurs disjointes a servi AVANT d'être commise**, ce qui est
la première fois : deux instants — celui du robot et celui du fichier — auraient été
lus l'un sous l'autre et fondus en un, exactement comme « 0 bougies hors de cette
fenêtre » sous « 23 bougies hors séance ». Le chapitre existait, il a été relu au moment
de décider, et l'écran n'en porte qu'un. *C'est le seul usage qui justifie ce fichier :
reconnaître une forme avant de la produire, pas après.*

C'est aussi ce qui a décidé de n'afficher **qu'un seul instant** : deux — celui du robot
et celui du fichier — auraient été deux grandeurs disjointes lues l'une sous l'autre, et
le lecteur les aurait fondues en une (la figure des « 0 bougies hors fenêtre » et des
« 23 hors séance »).

### Un instantané se LIT, il ne s'enregistre pas

Rien n'entre dans le stockage du navigateur, et c'est structurel : un instantané n'a
aucune valeur une minute plus tard. **Enregistré, il redeviendrait indistinguable d'un
état courant au rechargement suivant** — une position fantôme, encore une réponse fausse.

### Un fichier par ROBOT, et c'est un écart assumé au nom demandé

Le brief disait « un fichier par compte ». MT5 ouvre un fichier en écriture de façon
**exclusive** : quinze experts qui réécriraient le même nom toutes les minutes se
refuseraient l'un l'autre, et le gagnant écrirait SA position seule dans un fichier censé
les porter toutes. Le lecteur y lirait « une position » là où il y en a quinze — un
chiffre faux qui a la forme d'une réponse. Le compte vit donc en **colonne**, où il n'a
besoin de l'exclusivité de personne. *Raisonné, pas mesuré : rien ici n'exécute MT5*, et
c'est écrit dans le source à l'endroit du choix.

`scripts/app/dossier-du-terminal.test.mjs` porte les sept, éprouvées par **dix**
mutations au total. Les six de l'instantané ont été écrites pour ne toucher QUE le fait
visé — un risque dérivé **à côté** du R lu, un `localStorage` **à côté** du parseur, un
écart relatif **à côté** de l'heure — et chacune a été relue avant d'être crue : c'est la
règle de la mutation voisine, appliquée le lendemain de son écriture.

**La sixième est celle qui vérifie le FAUX REFUS** (règle 16) : un instantané d'une
minute ne doit pas être annoncé périmé. Un seuil qui refuse le cas normal est un seuil
qu'on désactive le soir même.

## La colonne gratuite décrivait un outil qu'il faut alimenter avant d'essayer

**STATUT · CAUSE ÉTABLIE — omission RAPPORTÉE, emplacement et dérivation MESURÉS DANS LE
DÉPÔT.**

Le palier gratuit donne **deux** choses : trois instruments à soi, et les dix séries
d'exemple. La colonne n'en nommait qu'une, et c'est la seconde qui permet d'essayer
**sans rien avoir exporté**. Quelqu'un qui arrive sans données lisait « trois instruments
à vous » et comprenait qu'il devait d'abord installer MT5, compiler un script et exporter
un CSV pour voir le produit — alors que les séries existent précisément pour lui éviter ça.

**Le rapport désignait `/tarifs` ; la phrase vivait sur l'ACCUEIL.** Mesuré avant
d'écrire : `/tarifs` nommait déjà les séries d'exemple, c'est le résumé des trois montants
de l'accueil qui était muet. Le geste était juste, la carte non — deuxième fois en deux
livraisons, et les deux se vérifient toujours séparément.

**Le mot est celui du produit.** L'application dit « séries d'exemple » partout ; écrire
« fictives » ou « fausses » sur le site créerait un second vocabulaire pour la même chose,
et deux vocabulaires divergent. Et la réserve d'honnêteté n'est **pas** recopiée : la page
vend, l'application avertit à l'endroit où l'avertissement change une décision — une
seconde copie divergerait en silence.

### Ce que la garde a trouvé dans le PRODUIT : une phrase invisible à toutes les gardes

« Trois instruments à vous » était écrit **deux fois** : en littéral sur `/tarifs`, et en
**texte JSX nu** sur l'accueil. Le texte nu est exactement ce que `promesses-de-vente`
existe pour interdire — les gardes ne savent lire que les chaînes —, et l'accueil y
échappait depuis toujours parce qu'aucune ancre ne le nommait.

> **Une garde par liste d'ancres ne voit pas ce que personne n'a pensé à y mettre**, et
> c'est son angle mort assumé. Ce qui l'a révélé n'est pas une relecture : c'est d'avoir
> eu besoin de la phrase ailleurs.

**ET LE SEUIL DE SA GÉNÉRALISATION A ÉTÉ MESURÉ, PAS SUPPOSÉ.** Un angle mort déclaré a
une date de péremption : celui-ci vient de coûter sa première omission, donc la question
se pose. La réponse est non, et elle tient en un nombre : **soixante-trois** phrases
vivent en texte JSX nu dans `src/` aujourd'hui — « Ouvrir mon outil », « Sur toute la
période », des titres et des boutons. Interdire la forme refuserait soixante-trois cas
légitimes le premier jour, et une garde qu'il faut désactiver pour travailler ne garde
rien (règle 16).

**La classe ne se ferme donc pas par la forme** : rien ne distingue mécaniquement
« Ouvrir mon outil » de « Trois instruments à vous ». Ce qui ferme les cas un par un
n'est pas une garde, c'est la RÉUTILISATION — **à une condition qui n'a rien
d'automatique, et que le cas fondateur lui-même a démentie** (mesuré trois paragraphes
plus bas) : il faut que le second usage commence par CHERCHER la phrase. Quand c'est le
cas, elle devient une constante nommée et entre dans la surface des gardes au passage,
sans que personne l'ait décidé.

> **Une omission de ce genre se découvre quand la copie est RÉEMPLOYÉE, pas quand elle
> est relue.** C'est exactement ce qui vient d'arriver : la phrase est sortie du texte
> nu parce qu'il fallait la dire ailleurs, pas parce que quelqu'un l'avait cherchée.

L'angle mort reste donc ouvert, et il porte désormais son chiffre.

**ET LE MÉCANISME A EU SA CHANCE SUR CE CAS-LÀ, ET NE S'EST PAS DÉCLENCHÉ.** Relu dans
l'historique plutôt que supposé : les deux copies sont nées **le même jour**, le
12 septembre — l'accueil d'abord (`55a1704`), `/tarifs` quelques heures plus tard
(`1efc747`, 318 lignes neuves). La phrase a donc été *nécessaire à un second endroit* au
moment même où la règle dit qu'elle devient une constante, et elle a été **réécrite en
littéral**. Treize commits ont traversé `src/` avant qu'on la voie, et ce qui l'a vue
n'est pas une relecture : c'est d'en avoir eu besoin une **troisième** fois.

> **La réutilisation ne déclenche rien ; c'est la RECHERCHE qui déclenche.** Écrire la
> phrase une seconde fois de mémoire, ou en recomposant l'écran à neuf, produit une
> copie — pas une constante. Le mécanisme ne s'arme que si le second usage commence par
> *aller chercher où elle vit déjà*.

**Ce qui le rend utilisable, c'est que ce geste est déjà écrit ailleurs** : c'est la même
commande que celle de la carte du rapport, deux chapitres plus haut — *chercher la phrase
avant de l'écrire*. Là elle empêche de corriger au mauvais endroit ; ici elle transforme
une copie en constante. **Une seule commande, deux défauts fermés**, et c'est la raison
de l'écrire comme un geste et non comme une vigilance.

**Et la limite que le mécanisme ne peut pas franchir est mesurable, elle aussi** : une
phrase qui ne sert qu'à UN endroit n'y entre jamais. Compté dans `src/lib/` — les huit
textes de `textes-recopies.ts` ont **zéro** lecteur hors de leur fichier. Ce sont
précisément les phrases qui engagent le plus, et chacune est recopiée une fois, dehors.
Aucune réutilisation ne pouvait les promouvoir : elles ont été **déplacées à la main**,
et c'est pour ça que ce module existe. *Le mécanisme ramasse ce qui sert deux fois ; ce
qui ne sert qu'une fois se déplace, ou reste invisible.*

#### Et ce n'était pas un mécanisme : c'était une COMMANDE déguisée en propriété

La correction ci-dessus vaut plus que son cas, et elle ne demande pas une règle de plus —
**la distinction existe déjà dans ce fichier**, écrite au chapitre de la marque
temporaire : *« là c'était de la vigilance — quelqu'un devait penser à relire —, ici
c'est de la construction »*. Ce qui manquait n'est pas le vocabulaire, c'est le **test
appliqué au moment où l'on écrit une phrase dans cette colonne-là**.

> **Retirez la personne : est-ce que ça se produit encore ?** Si la réponse est non, ce
> n'est pas une propriété du système, c'est un GESTE — et il s'écrit comme un geste, avec
> sa commande, jamais comme un mécanisme qui « se déclenche ».

**Et ce qui le rend utilisable, c'est qu'il s'exécute à l'ÉCRITURE, pas à la relecture.**
Ce fichier a mesuré quatre fois que la relecture n'arrive pas : trente et une passes sur
`robot-mt5.js` sans voir le conseil attrape-tout, treize commits à travers `src/` sans
voir la phrase en double, et trois appositions chiffrées que seul l'interlocuteur a
comptées. Un test qui demande qu'on repasse est de la même famille que ce qu'il prétend
corriger. Celui-ci tient dans la seconde où l'on écrit « elle devient », « ça se
déclenche » ou la tournure comptée plus bas — et c'est la seule seconde dont on soit
sûr. (Elle n'est pas épelée ici : le compte qui suit serait faux d'une unité, et la
prose n'a pas à prendre la forme de ce qu'elle raconte.)

**Et le coût de la confusion n'est pas l'imprécision, c'est l'inexécution.** Une propriété
ne se fait pas : on la constate. Écrire une commande dans la forme d'une propriété, c'est
donc garantir que personne ne l'exécutera — le lecteur croit être couvert par quelque
chose qui tourne tout seul. C'est le pire mode de panne du dépôt, appliqué à une consigne
au lieu d'une garde.

**Le fichier employait la distinction JUSTE trois fois avant de se tromper une.** Relu
plutôt que juré : la marque temporaire dit qu'elle passe de la vigilance à la
construction ; la règle 13 déclare qu'elle *« ne se ferme que par vigilance »* et
explique que c'est pour ça qu'elle est écrite ; l'apposition chiffrée dit que *« tant que
le seul mécanisme est la relecture par l'autre, la classe reste ouverte »*. Les trois
nomment honnêtement ce qui n'a pas de mécanisme.

**La population du défaut est donc de UN, et c'est mesuré** : la tournure
`sans que personne` n'apparaît que deux fois dans ce fichier **hors de la phrase que
vous lisez, qui la cite pour la compter** — une pour raconter le module qui agissait à
l'import, et une pour la clause corrigée ci-dessus. Le compte brut rend trois : c'est la
règle 3 commise dans la phrase même qui mesure. Et les six `par construction` décrivent
tous des faits structurels réels — un état vide, une série engendrée, la prose qui
précède le code.

*Une classe à un membre s'écrit quand même, mais elle s'écrit AVEC son compte* — sinon
elle se lira comme un travers répandu, ce qu'elle n'est pas. C'est la même exigence que
l'angle mort déclaré : ce qui manque à une affirmation, c'est presque toujours sa
portée.

Les quatre phrases du palier vivent donc dans `src/lib/palier-gratuit.ts`, lues par les
deux routes. Le compte, lui, ne peut pas être importé — deux applications, deux paquets —
et c'est la garde qui **lie les deux bouts** : passer à onze séries la fait tomber en
nommant les deux nombres, au lieu de laisser « dix » sur la page de vente.

### QUATRE MUTATIONS SUR SIX SONT RESTÉES VERTES — et la garde était le défaut

C'est le tour le plus instructif de la séance, et il valide la règle écrite la veille :
une mutation rouge ne prouve rien tant qu'on n'a pas lu son message. Ici quatre sont
restées **vertes**, et chacune a nommé une figure que ce fichier porte déjà — commise à
l'intérieur d'une garde écrite pour la même famille :

| ce qui est resté vert | la figure commise |
|---|---|
| retirer « Trois instruments à vous » de `/tarifs` | la garde collait le MODULE ENTIER dans sa botte de foin : elle trouvait la phrase dans son propre **commentaire** (règle 3) |
| retirer la ligne du JSX de l'accueil | l'**import** suffisait à la satisfaire — un import ne rend rien (règle 11, sur une constante au lieu d'un trou) |
| écrire « séries fictives » dans le module | le périmètre était écrit à la main : deux routes, pas le module (règle 7) |
| ajouter une onzième série par `push` | la mutation ne modélisait pas le geste réel — refaite **dans** la liste, elle mord |

Les trois premières sont des défauts de la garde ; la quatrième est un défaut de la
mutation. **C'est la lecture du message qui les a séparés**, pas la couleur.

`scripts/app/palier-gratuit-nomme-ce-quil-donne.test.mjs` porte les quatre propriétés,
éprouvées par six mutations isolantes après réparation. `promesses-de-vente` s'est
réancrée au passage (règle 14, deuxième issue) : la phrase a changé de fichier, son
invariant non.

## Une sonde dont l'échec est silencieux par conception se garde ailleurs

Le témoin de version comparait ce que sert l'adresse publique à ce que la page est. Il a
été MUET depuis le jour où il a été écrit, et personne ne l'a vu — parce qu'il est muet
quand il échoue, et que c'est **le bon choix** : un fichier ouvert en `file://`, un avion,
un pare-feu ne doivent pas produire un avertissement permanent. *L'absence d'information
n'est pas une information.*

La conséquence n'avait pas été tirée : un chemin faux devient alors indistinguable d'un
utilisateur à jour. Le silence choisi pour le cas légitime couvre aussi le cas cassé.

> **Le témoin ne peut pas être son propre témoin.** Quand une sonde est conçue pour se
> taire en cas d'échec, rien à l'intérieur d'elle ne signalera jamais qu'elle a cessé de
> fonctionner : la vérification vit nécessairement dehors.

Ici, dehors veut dire `scripts/app/manifeste-version.test.mjs` : il lie les trois sources
qui doivent s'accorder — le chemin où `publier-solo` dépose, celui que `netlify.toml` sert,
celui que l'application demande. Le défaut n'était dans aucune des trois prise isolément ;
il était dans leur **désaccord**.

**Et la classe est probablement plus large qu'un cas.** Toute lecture qui retombe en
silence — un `catch` qui rend `null`, un `if (!r.ok) return`, un repli sur une valeur par
défaut — a le même besoin. Elles ne sont pas recensées ; c'est une file, pas une panne.

### Sa cause dans cette occurrence : la règle 12, appliquée à une URL

`netlify.toml` sert `/app` par une **réécriture** (`status = 200`), pas une redirection :
l'URL du document reste « /app », sans barre finale, donc la base des chemins relatifs est
« / » et `fetch('version.json')` partait à la racine du site. Un chemin relatif emprunte
son sens à un point fixe — « depuis où » — et un document servi sous deux formes n'en a
pas. C'est le même énoncé que « ci-dessous » depuis une barre collante et « hier » sur une
fenêtre figée, sur un référentiel qu'on n'aurait pas pensé y ranger.

**Et un chemin absolu n'est pas la réponse générale** : en `file://` — l'usage recommandé —
`/app/version.json` devient `file:///app/version.json`, un voisin qui n'existera jamais.
Les deux référentiels s'écrivent donc tous les deux, plutôt qu'un chemin qui a l'air
général. C'est la garde `aucun-voisin` qui l'a dit, et elle avait raison.

## Ce que je mesure contient-il ma mesure ?

**C'est la voisine de la règle 15, et elles ne se confondent pas.** Là, une sonde se tait
quand elle échoue, donc rien en elle ne dira jamais qu'elle a cessé de marcher — *le
témoin ne peut pas être son propre témoin*. Ici la sonde parle très bien : elle rapporte
un chiffre juste, sur une population **qui la contient**.

> **Une sonde dont le motif peut décrire la sonde elle-même ne mesure pas ce qu'elle
> croit.** Et elle ne se plaint de rien : le résultat a la forme d'une mesure, parce que
> c'en est une — d'autre chose.

**Quatre instances, énumérées** — la forme que ce fichier prescrit pour une phrase sur un
ensemble. Les deux premières sont dans le dépôt ; les deux autres sont des gestes de
séance, relus dans la trace plutôt que de mémoire :

| l'instance | ce que la mesure contenait |
|---|---|
| `nom-vuna.test.mjs` | il cherche une chaîne interdite, donc il doit l'épeler — et il se trouve lui-même |
| `stockage-plein.test.mjs` | il SÈME l'ancien préfixe pour éprouver la migration, puis compte les clés |
| l'attente de suite (`until ! pgrep -f "node --test…"`) | la ligne de commande de la boucle **contient le motif** : les boucles s'attendaient l'une l'autre, et « suite en cours » était vrai par construction |
| le compte d'une tournure dans ce fichier-ci | le fichier compté est celui qui porte le compte : l'écrire le change |

### Les quatre remèdes ne sont PAS équivalents, et la question choisit lequel

C'est ce qui rend la classe utile plutôt que pittoresque. Le réflexe — exclure la sonde —
est le moins bon des quatre, et ce dépôt ne l'emploie que là où il est borné :

| le remède | quand il vaut | ce qu'il coûte |
|---|---|---|
| **s'exclure nommément** | quand l'interdit est le SUJET du fichier (les deux gardes ci-dessus) | c'est *ajouter un motif* — la course que la règle 3 refuse ; acceptable ici parce que l'exclusion est nominative et ne rouvre aucun périmètre |
| **changer de SIGNAL** | quand un autre fait répond à la même question sans contenir la sonde | rien, et c'est pourquoi il gagne |
| **converger vers un point fixe** | quand la mesure ne PEUT pas sortir de sa population | une itération, et l'obligation de le dire |
| **rétrécir aux cas nets** | quand l'effet de la sonde atteint sa propre voie d'observation | des cas perdus — *deux concluants valent mieux que six douteux* |

**LE SECOND EST CELUI QUI A SERVI, ET ON A FAILLI LUI EN ATTRIBUER UN AUTRE.** Relu dans
la trace de séance plutôt que reconstitué : la prise fautive `until ! pgrep -f` paraît
**16** fois, et ce qui l'a remplacée n'est pas un `grep -v` d'exclusion — c'est
`until [ -s <fichier de sortie> ]`, **31** fois, plus `until ! kill -0 <PID>` deux fois.
Dans les deux remplaçants, la sonde n'appartient plus à la population : un fichier a une
taille, un PID est nommé. *On n'a pas appris à la sonde à s'ignorer ; on a cessé de poser
la question sous une forme où elle se voyait.*

Le troisième a servi le même jour, sur de la prose : un compte d'occurrences dans ce
fichier bouge en s'écrivant — poser le bloc l'a fait passer de 53 à 59. Aucune exclusion
n'est possible, donc on mesure, on réécrit, on remesure jusqu'au point fixe, **et on le
dit** : sans ça le lecteur suivant lit une dérive là où il lit sa propre plume.

Le quatrième est le plus discret, et c'est une sonde de MUTATION : forcer cinq fonctions à
jeter pour voir laquelle blanchit la page, alors que quatre d'entre elles sont appelées
par `renderVals` — la voie par laquelle la sonde observe. L'effet atteignait l'observation,
sans qu'aucun motif ne se ressemble.

> **La question ne porte pas sur le motif, elle porte sur la POPULATION.** « Mon motif
> décrit-il ma sonde ? » n'attrape que le premier cas ; *ce que je mesure contient-il ma
> mesure ?* attrape aussi l'effet, le fichier et le point fixe.

**Et elle se pose à l'écriture de la sonde, pas à la lecture du résultat** — c'est tout ce
qui la rend tenable. Le résultat, lui, ne dira rien : il est juste, il est stable, il ne
se contredit pas. Une sonde qui se mesure elle-même est **cohérente**, et c'est la seule
chose qu'elle a en commun avec une sonde qui marche.

## Le test qui tient la convention

`scripts/app/nom-vuna.test.mjs` échoue si l'ancien nom réapparaît hors des neuf familles
du registre, si un accent se glisse dans une clé ou un nom de fichier téléchargé, ou si un
fichier du dépôt reprend l'ancien nom. Son registre **échoue dans les deux sens** : une
famille dont le dernier membre a disparu le fait tomber aussi, pour qu'elle ne survive pas
en tolérance vide.

**Et il s'exclut lui-même, nommément, avec sa raison** : une garde qui cherche une chaîne
interdite doit l'épeler pour la chercher, donc elle se trouverait elle-même. L'exclusion
nominative ne retire qu'un fichier **dont l'interdit est le sujet** — jamais un périmètre
qui reviendrait par la fenêtre (règle 7). `stockage-plein.test.mjs` prend la même exemption
pour la même raison : il sème l'ancien préfixe pour éprouver la migration.

## Une garde de MARQUE se pose au RENDU, parce que c'est l'écran qui fait la marque

**STATUT · CAUSE ÉTABLIE — renommage DÉCIDÉ (19/09/2026), surface et prise MESURÉES DANS
LE DÉPÔT, au rendu, sur le fichier livré.**

La garde évidente, après un renommage, est une garde de source : *aucun « Véna » dans le
dépôt*. Elle est fausse, et le chiffre le dit — **l'ancien nom survit par centaines dans
les fichiers versionnés ; ZÉRO atteint un écran.** Les clés gelées, le registre, les replis
MT5, les récits de ce fichier-ci : la source a le DROIT de porter l'ancien nom, et une
garde qui l'interdirait partout se ferait désactiver le premier jour (règle 16).

**LE CHIFFRE EST ÉCRIT AVEC SA COMMANDE, et c'est la commande qui compte.** Ce paragraphe
a longtemps porté « 213 occurrences » et « trente-trois dans ce fichier-ci » sans dire
comment on les obtenait. Le nombre n'était ni vérifiable ni réfutable : personne ne pouvait
le contredire, donc personne ne l'a contredit — *un compte posé sans sa commande est un
compte recopié en puissance.* Il n'est pas corrigé ici, parce qu'on ne sait pas ce qu'il
comptait : le remplacer fabriquerait une comparaison entre deux populations qu'on n'a pas
établies être la même.

Ce qui suit est une commande et **ce qu'elle rend le 19 septembre 2026**. Le prochain qui
recompte saura quoi recompter :

```sh
# le dépôt entier — 303
git ls-files -z | xargs -0 grep -ohiE '\b(vena|véna)\b' | wc -l
# ce fichier-ci seul — 59, le bloc que vous lisez COMPRIS
grep -ohiE '\b(vena|véna)\b' CLAUDE.md | wc -l
# la population que la GARDE police : le dépôt privé des deux auto-exclus — 213
git ls-files -z | grep -zv -e '^CLAUDE.md$' -e '^scripts/app/nom-vuna.test.mjs$' \
  | xargs -0 grep -ohiE '\b(vena|véna)\b' | wc -l
```

**ET LES DEUX PREMIÈRES SE COMPTENT ELLES-MÊMES.** Ce bloc a fait passer ce fichier de
53 à 59 et le dépôt de 297 à 303 : un compte d'un fichier, écrit DANS ce fichier, bouge en
s'écrivant. Ce n'est pas un défaut, c'est une propriété — mais elle se dit, sans quoi le
prochain qui recompte croira lire une dérive là où il lit sa propre plume. La troisième
commande, elle, exclut ce fichier : c'est la seule des trois qu'une phrase écrite ici ne
peut pas déplacer.

**LA TROISIÈME REND 213, ET CE N'EST PAS UNE PREUVE.** Elle retombe exactement sur
l'ancien chiffre, ce qui est troublant et ne tranche rien : le dépôt a grandi depuis, donc
une égalité aujourd'hui ne dit pas qu'hier la même commande était employée. Mesuré au
commit qui pose le chiffre (`5dcfeb7`, 18:09) : le dépôt entier y rendait **196** et ce
fichier **47** — ni l'un ni l'autre n'est 213 ou 33. *Trois populations plausibles, une
qui tombe juste, et aucun moyen de savoir si c'est la bonne* — voilà exactement ce que
coûte un chiffre sans sa commande.

> **Une égalité rétrospective n'établit pas la méthode qui l'a produite.** C'est la même
> figure que « deux entrées d'accord sur un total et en désaccord sur leur contenu » : ici
> deux comptes d'accord sur un total, sans qu'on sache s'ils portent sur la même
> population. La coïncidence est notée parce qu'elle est un fait ; elle n'est pas conclue.

**Et le piège s'est refermé sur l'auteur de la commande, dans l'heure.** Ayant mesuré 297
là où le fichier disait 213, j'ai rapporté une dérive — c'est-à-dire que j'ai comparé deux
comptes sur des populations disjointes pour en tirer une direction, le défaut que la note
du bouton Exporter interdit en toutes lettres trois cents lignes plus bas. **La commande
manquante ne fait pas que rendre un chiffre invérifiable : elle fabrique des écarts qui
n'existent pas.**

> **Ce n'est pas le dépôt qui porte une marque, c'est un écran.** La question n'est donc
> pas « le mot est-il écrit quelque part ? » — une intention — mais « l'ancien nom
> atteint-il un œil ? », qui est un résultat, et qui est observable. C'est la règle 1,
> appliquée à un renommage.

`scripts/app/marque-au-rendu.test.mjs` charge le fichier livré dans un vrai navigateur,
parcourt les sept vues par `VUES` — la surface écrite une fois, partagée avec les deux
autres bancs de rendu —, lit `document.body.innerText` et cherche l'ancienne marque avec
des bornes de mot, faute de quoi `provenance` la ferait tomber.

**Elle prouve sa prise avant de rendre son verdict**, et c'est la moitié qui compte : elle
exige d'avoir lu les sept écrans ET d'y avoir vu la marque NEUVE au moins une fois par
écran. Sans ça, sept écrans blancs rendraient « zéro ancienne marque » — un zéro qui n'a
rien regardé, sur le chemin même qu'on instrumente. Mesuré au vert : *7 écrans lus,
« Vuna » vu 23 fois, ancienne marque : 0*.

**LA PREMIÈRE MUTATION ÉTAIT INERTE, et le message l'a dit.** L'échange posait « Véna »
dans `'Vuna — scan terminé'` : c'est le titre d'une `new Notification()`, jamais du texte
de DOM. La garde est restée verte, et la tentation était de la croire aveugle — c'est le
mode que ce fichier appelle l'inerte, celui qui se paie en heures et ne livre rien. Relue
plutôt qu'accusée, restaurée par l'échange inverse, refaite sur une phrase réellement
rendue : elle tombe alors en citant les quatre écrans et le texte lu.

**Son angle mort est en tête** : elle lit ce que les sept vues rendent au chargement. Un
texte qui n'apparaît que sous une condition — un dialogue, un état d'erreur, une
notification — lui échappe, et c'est exactement ce que la première mutation a démontré.
C'est une garde du cas courant, pas de la surface entière.

## Une consigne qui NOMME la bonne propriété ne prouve pas que le code la lit

**STATUT · CAUSE ÉTABLIE — faux refus RAPPORTÉ (hypothèse d'un brief utilisateur,
déclarée non mesurée par lui), cause et correctif MESURÉS DANS LE DÉPÔT, en appelant les
deux fonctions.**

Le refus d'export du robot portait, au-dessus de lui, exactement la bonne doctrine :

> *« LA CONDITION EST UN RÉSULTAT (règle 1). On ne demande pas « la ligne porte-t-elle un
> filtre réputé inexportable ? » — ce serait réécrire ici la liste du générateur. On
> appelle la fonction QUI REFUSE, sur l'état résolu de la ligne : le bouton et le refus
> ne peuvent pas diverger, puisqu'ils lisent le même verdict. »*

**Deux affirmations, et une seule est vraie.** Le bouton et le refus ne divergent
effectivement pas — les deux appellent `filtresBloquants(etatDeLigne(v))`, c'est mesuré
et c'est une vraie propriété. Mais « l'état résolu de la ligne » ne l'est pas :
`etatDeLigne` rend la PHOTO DES RÉGLAGES, c'est-à-dire la case cochée. L'état résolu est
ce que `cfgCourante` construit — et `cfgCourante` pousse deux filtres sous `&& !vente`.

Mesuré, en découvrant le jeu depuis la source de `cfgCourante` puis en appelant le refus :

| | achat | vente |
|---|---|---|
| `fResist` — « Sous résistance » | refusé | **refusé** |
| `fZone` — « Hors zone de résistance » | refusé | **refusé** |

À la vente, la mesure ne porte aucun de ces deux filtres : le robot n'a rien à
reproduire, et il refusait quand même. **Un faux refus sur le cas normal — règle 16 —,
sous la pire de ses deux formes** : il n'y a pas d'interrupteur à désarmer, il y a un
geste retiré sans recours, sur une ligne parfaitement exportable.

> **Une consigne écrite dans le vocabulaire d'une règle a l'autorité de cette règle.** Et
> c'est pire qu'une consigne périmée : celle-ci n'a jamais été vraie, et elle DÉCRIT le
> défaut en le certifiant absent. « C'est un résultat, pas une intention » est la phrase
> exacte qu'il fallait pour disculper ce que la règle 1 interdit.

**Et elle a produit son effet ici, dans cette séance.** Ayant lu le commentaire avant le
code, j'ai écrit que l'hypothèse du brief « semblait réfutée ». C'est la famille déjà
nommée : *ce qui coûte, c'est ce qui arrête de chercher* — et une doctrine juste, citée
au bon endroit, a la forme la plus achevée d'une réponse.

Le geste est celui du chiffre sans sa commande, appliqué à une affirmation sur le code :
**une consigne qui affirme une propriété se fait échouer une fois.** Ici, un script de
dix lignes — la source de `cfgCourante` d'un côté, `filtresBloquants` appelé de l'autre.

### Le brief avait raison sur la CONCLUSION et se trompait de route — et c'est la route qui protégeait le défaut

Il disait : *« le refus d'export lit la case cochée dans l'interface, pas la
configuration résolue »*. La conclusion est confirmée ; la route, non. Rien ne lit
l'interface : le refus lit le même état que tout le reste, et c'est cet état qui PORTE la
case.

**C'est précisément ce qui l'a gardé en vie.** Un refus qui serait allé chercher une case
dans le DOM aurait sauté aux yeux du premier relecteur. Celui-ci passait par la fonction
canonique, sur l'objet canonique, sous un commentaire qui nommait la bonne propriété —
trois signaux de justesse pour une valeur qui ne l'était pas.

> **Un défaut qui emprunte le chemin recommandé ne se voit pas sur le chemin.** Il se voit
> en demandant ce que l'objet transporté CONTIENT — et ce nom-là, « état résolu », promet
> qu'il n'y a rien à demander.

### Et la prise qui ne compte que « pas zéro » se laisse RÉTRÉCIR

La garde écrite pour fermer ça découvre son jeu de filtres depuis la source de
`cfgCourante`, sur ce qui AGIT — un `filtres.push` gaté par `&& !vente`. Sa prise, au
premier jet, était celle que ce fichier prescrit partout : *zéro filtre découvert n'est
pas « rien à vérifier », c'est une découverte désancrée.*

**Elle est restée VERTE sous la mutation qui déplace un des deux gâteaux** en
`!vente && s.fResist`. Le motif perdait `fResist`, trouvait encore `fZone`, et les trois
assertions suivantes passaient sur la moitié d'une population — sans un mot.

> **Un désancrage PARTIEL est invisible à une prise qui compte zéro.** « Pas vide » n'est
> pas « complet », et une découverte peut perdre un membre sans jamais atteindre le seul
> état que sa prise sait reconnaître.

La sortie n'est pas un seuil — on ne sait pas combien de filtres DEVRAIENT être gatés.
C'est la **confrontation de deux sources indépendantes** : le jeu lu dans `cfgCourante`
et le jeu déclaré dans `robot-mt5.js` doivent être égaux, et l'assertion échoue **dans
les deux sens** — un filtre gaté que le générateur ne déclare pas, un filtre déclaré qui
n'est plus gaté, ou un motif qui en perd un en route. Sous la même mutation, elle tombe
en écrivant *« la mesure retire [fZone] ; le générateur déclare [fResist, fZone] »*.

**C'est « relire la liste CONTRE le total », dans une garde au lieu d'une prose** — et
c'est ce qui prouve que cet énoncé-là n'était pas une règle d'écriture. Un total seul se
recopie, une liste seule rassure ; ici, une découverte seule se laisse rétrécir. Dans les
trois cas, la mesure est dans la confrontation, jamais dans l'une des deux moitiés.

**Aucune des deux sources ne dérive de l'autre** — l'une est analysée dans
`Vuna.dc.html`, l'autre déclarée dans `robot-mt5.js` —, donc ce n'est pas la prise
circulaire du chapitre voisin : c'est la forme de `meme-horloge`, où le défaut n'est dans
aucun maillon pris seul.

**Son angle mort est en tête** : elle tient l'accord sur le sens tel que `cfgCourante` le
lit, `etat.btSens`. Elle ne prouve pas que `cfg.sens` — dont `genererMQ5` tire son propre
`vente` pour ÉCRIRE le code — vaut toujours la même chose. Les deux descendent du sens de
la ligne et ne peuvent diverger qu'en amont des deux fonctions mesurées ; c'est une
propriété de l'application, antérieure à ce correctif et non touchée par lui. **Relevé,
non fermé.**

### Et l'écran affirmait une impossibilité là où la source constate un chantier

Le commentaire au-dessus de la table `INCONNUS` dit, noir sur blanc, qu'aucun des quatre
filtres n'est intransposable : le robot garde déjà les hauts de ses seaux, et « sous
résistance » y coûte une dizaine de lignes. *« C'est un chantier, pas une fatalité. »*

Les libellés disaient l'inverse — « n'a pas d'équivalent MQL5 fidèle ». Quatre surfaces
portaient la formule, et les voici, relues contre le compte : le message de
`exporterRobotBrut`, celui du lot `exporterRobots`, l'infobulle du bouton (`robAide`), et
l'erreur que jette le générateur. **Ce que ça change n'est pas cosmétique** : une
impossibilité fait renoncer au filtre, un chantier laisse le choix d'attendre — et c'est
le seul arbitrage que le lecteur ait à faire.

La garde s'ancre sur l'**ABSENCE** (règle 14, troisième issue) : son sujet a disparu, et
elle attrape la réintroduction, qui est le risque réel puisque la formule est courte et
évidente. *(Elle a d'abord été écrite sur le texte brut, et la
section suivante dit ce qu'elle a laissé passer.)* Elle lit les CHAÎNES émises, jamais la prose : **un** commentaire du produit
raconte encore l'ancien libellé — celui qui critiquait déjà la généralité du message de
lot — et il a le droit de le citer (règle 3).

*(« Trois commentaires » était écrit ici, sans avoir été compté. La commande rend un,
plus les deux occurrences de la garde elle-même — sa tête et son message. Et le premier
compte a été pris sur `git ls-files`, qui ne voit pas un fichier neuf non suivi : la
garde manquait à sa propre population. Deux fois la même famille dans un paragraphe qui
la décrit.)*

**Elle n'a pas besoin de s'exclure nommément**, contrairement aux deux gardes qui le
font : elle ne lit que `Vuna.dc.html` et `robot-mt5.js`, donc l'interdit qu'elle épelle
ne vit pas dans sa population. *Ce que je mesure ne contient pas ma mesure* — pas par
exception, par construction.

#### Un remplacement en masse compte les surfaces qu'il a CORRIGÉES, jamais celles qu'il n'a pas vues

**PROVENANCE · surface manquée TROUVÉE PAR L'UTILISATEUR dans le fichier livré, à
l'octet près (`~3 035 757`) ; cause et correctif MESURÉS DANS LE DÉPÔT.**

Le rapport de livraison disait « les quatre disent maintenant… ». Mesuré sur `260920` :
**une** occurrence de la formule neuve pour **une** de l'ancienne, toujours là. Et, à
`~1 413 396`, une phrase cassée — *« filtre sans pas encore transposé »*.

**Le compte de quatre venait des sites qui APPELLENT le message, pas de ceux qui
l'ÉCRIVENT.** Deux populations, l'une comptée pour l'autre — le défaut que ce fichier
interdit en toutes lettres trois cents lignes plus haut, commis dans le commit qui
ajoutait la garde contre lui.

> **Une substitution textuelle est une sonde autant qu'un geste : elle rapporte ce
> qu'elle a touché, jamais ce qu'elle n'a pas trouvé.** Son compte de remplacements est
> un compte de succès, et un compte de succès ne mesure aucun échec. *Dénombrer les
> surfaces corrigées est une intention ; confronter deux sources est le résultat.*

**Les deux dégâts sont symétriques, et c'est ce qui nomme la classe** : elle a frappé de
la prose qu'elle ne visait pas — parce qu'un motif court vit dans des phrases dont il
n'est pas le sujet — et manqué la seule surface qui coupait sa phrase en deux morceaux.
*Trop large d'un côté, trop étroit de l'autre, pour la même raison : elle ne comprenait
pas ce qu'elle lisait.*

##### Et les DEUX raisons de la survie étaient déjà écrites ici, avec leur sortie

C'est ce qui rend l'épisode instructif plutôt qu'anecdotique. La surface manquée est
`faireAide`, et elle échappait pour deux motifs indépendants :

| ce qui l'a cachée | ce que le fichier disait déjà |
|---|---|
| la phrase coupée en deux littéraux — `' n’a pas d’équivalent '` puis `'MQL5 fidèle.'` : aucun ne porte les deux mots | **le SEUIL était posé** : « si le cas revient une troisième fois, la conclusion n'est pas un troisième `prettier-ignore` — c'est que la prise doit concaténer les littéraux adjacents avant de lire » |
| l'apostrophe **réelle** (U+2019) là où le motif épelait l'échappement `’` | `sorties-hors-seance`, **en miroir exact** — là c'est l'échappement qui échappait à un motif portant le vrai caractère |

**Le seuil avait donc été franchi une fois de plus, et personne ne l'a reconnu — parce
qu'il était écrit pour les gardes, et que c'était un REMPLACEMENT qui le franchissait.**
Un seuil écrit d'avance ne se déclenche pas tout seul : il faut que le lecteur se
reconnaisse dans le cas, et une substitution en masse ne ressemble pas à une garde.

La sortie est celle que la règle 3 prescrit — **changer de forme, pas ajouter deux
motifs**. La garde lit les `<script>` par espree, aplatit les chaînes d'un `+` et rend
leur VALEUR : l'échappement et le caractère réel deviennent le même texte, et la coupure
cesse d'exister pour elle. Vérifié par mutation — la surface manquée remise telle
quelle, avec ses deux littéraux et son apostrophe réelle, la fait tomber en citant la
phrase reconstituée.

##### Mais la forme ne ferme que la RÉINTRODUCTION — la source unique ferme la classe

Une garde qui interdit l'ancienne formule laisse un sixième appelant recopier la
**neuve** et diverger au renommage suivant. Cinq copies ont produit exactement ça :
quatre corrigées, une manquée, et rien pour le dire.

Le motif du refus a donc UNE source, `REFUS_ROBOT`, lue par ses quatre appelants — la
figure de `deposes`, appliquée à une phrase. Et elle est écrite **en un seul littéral**,
parce que la coupure est précisément ce qui l'avait rendue invisible.

**Et l'assertion qui tient ce dernier point a été écrite CREUSE.** Premier jet :
`assert.match(SRC, /REFUS_ROBOT = '/)`. Éprouvée par la mutation qui recoupe la
constante, elle est restée **verte** — le motif décrit le DÉBUT d'un littéral, donc il
passe avec ou sans la coupure qu'il prétend interdire. C'est l'assertion creuse du
chapitre des gardes aveugles, commise dans la garde écrite contre la coupure. La prise
est désormais la **forme du nœud** — l'initialisateur doit être un `Literal`, pas un
`BinaryExpression` — et la mutation la fait tomber en nommant le type obtenu.

> **Quand on interdit une forme de texte, la prise ne peut pas être du texte.** Un motif
> qui décrit le début d'une chaîne ne sait rien de sa fin — c'est le préfixe `vena.` qui
> décrivait toutes les clés sauf celle qui les construit, sur une autre grandeur.

## Un arbitre qui distingue la PRÉSENCE ne distingue pas la JUSTESSE

**STATUT · CAUSE ÉTABLIE — objection RAPPORTÉE puis réfutée par l'utilisateur, chiffres
MESURÉS DANS LE DÉPÔT sur les dix familles d'exemple.**

Le port MQL5 de « Sous résistance » avait été reporté — non sur son coût, une dizaine de
lignes, mais sur celui de sa **preuve** : un rejeu contre un testeur dont deux jeux de
données du même courtier divergent sur 50 249 prix.

**L'objection prouvait trop, et c'est l'utilisateur qui l'a dit** : le même arbitre, avec
la même contradiction, a servi à établir six concordances au trade près. S'il ne peut pas
prouver ce port, il invalide rétroactivement ces six-là. *Ce qui était refusé n'était pas
la prudence — c'était le report SANS MESURE : un fait plausible (« l'arbitre est trop
bruyant ») à la place d'un fait disponible (de combien, contre quoi).*

Mesuré, configuration d'achat croisement/rebond 7, SL 0,7 / RR 1,5 :

| | trades | écart |
|---|---|---|
| filtre absent → présent | 1 328 → 950 | **−28,5 %** (10,7 % à 44,7 % selon la famille) |
| bruit de l'arbitre, HongKong50 | 12 / 161 | 7,5 % |
| bruit de l'arbitre, IBEX 35 | 10 / 91 | 11,0 % |

**L'écart du filtre vaut 3,8 fois le bruit** : l'arbitre sait dire « le filtre est là ou
il n'y est pas », comme il l'a dit six fois. L'objection tombe, et le port se fait.

### Mais la question du port n'était pas celle-là, et la seconde mesure la retourne

| ce qu'on change dans le port | trades | écart |
|---|---|---|
| fenêtre N = 19 au lieu de 20 | 939 | **1,2 %** |
| fenêtre N = 21 au lieu de 20 | 954 | **0,4 %** |
| marge 0,9 % au lieu de 1 % | 990 | **4,2 %** |

Les trois sont **sous** le bruit.

**UNE QUATRIÈME LIGNE A ÉTÉ RETIRÉE, ET SA CORRECTION VAUT MIEUX QUE LE CHIFFRE.**
« Unité H4 au lieu de D1 → 0,0 % » avait été rapporté comme un fait remarquable, et
portait la conclusion la plus large. L'explication avait été annoncée — *« le 0,0 %
reste à expliquer avant que je m'appuie sur ces chiffres »* — puis jamais donnée, et le
chiffre a servi quand même.

Mesuré : `backtesterSuivi(df, cfg, 'D1')` **ré-échantillonne avant d'appliquer les
filtres**. Il passe au filtre la série D1 — 783 bougies —, jamais la H1 — 18 009. Et
ré-échantillonner une série D1 en H4 la rend telle quelle : 783 bougies des deux côtés,
masques identiques, zéro trade d'écart **par construction**.

> **L'unité d'un filtre est DÉGÉNÉRÉE dès qu'elle est plus grossière ou égale à celle de
> la décision** — la série qu'on lui donne a déjà perdu le détail qu'elle demanderait.
> Ce n'est ni un fait remarquable ni un réglage non appliqué : c'est une propriété du
> chemin, et elle se lit dans trois lignes de `backtesterSuivi`.

**Et les « 5 447 bougies qui diffèrent » avaient été comptées sur la série H1** — celle
que ce backtest ne donne jamais au filtre. *Deux populations, comptées l'une pour
l'autre, dans le chapitre qui nomme ce défaut.* L'argument tient sur les trois lignes qui
restent ; il n'avait pas besoin de la quatrième.

> **Un arbitre qui distingue la PRÉSENCE d'un mécanisme ne distingue pas sa JUSTESSE.**
> Ce sont deux questions, et une seule mesure répondait. C'est la figure des deux
> populations comptées l'une pour l'autre — celle du « quatre surfaces » de la veille —
> appliquée cette fois à un critère de PREUVE au lieu d'un compte.

**La conséquence renverse le plan, pas la décision.** Le brief demandait une mutation —
décaler la fenêtre d'un seau, rouge obligatoire — sur un rejeu MT5. Elle aurait été
**verte** : 1,2 %, dans le bruit, et « vert » aurait été lu comme « le harnais ne regarde
pas les bonnes journées » alors qu'il aurait regardé les bonnes en ne pouvant pas les
distinguer. Posée sur les bougies, dans le dépôt, la même mutation est rouge
immédiatement — 223 bougies sur la première famille.

> **Quand une mutation ne peut pas être rouge, ce n'est pas la garde qu'il faut changer,
> c'est l'instrument.** Le seuil de résolution d'un arbitre se mesure AVANT de lui
> confier une preuve, et il se mesure contre l'effet qu'on veut lui faire trancher —
> jamais contre l'effet le plus visible du même dispositif.

### Ce qui est livré, et ce que la garde prouve

`PlafondResist` porte `filtreSousResistance` à la lettre, et sa forme n'est celle
d'aucun autre filtre — deux raisons qui ont demandé de l'écrire plutôt que de rappeler
`LigneAgr` : le plafond **exclut** le seau courant là où une ligne agrégée inclut le seau
visé, et la clôture comparée est celle de la **bougie H1**, pas celle du seau.

`scripts/mt5/sous-resistance-portee.test.mjs` porte en JS ce que le MQL5 émis exécute et
exige l'égalité **bougie par bougie**, zéro tolérance, sur trois configurations et dix
familles. Un second test vérifie que le source émis **appelle** la règle avec ses trois
paramètres — sans quoi le port mesurerait une règle que personne n'exécute.

**Et une mutation est restée VERTE, ce qui est une réponse et non un trou.** Compter le
seau en formation parmi les gardés ne change rien : les deux formulations retombent sur
le même ensemble — *les n seaux qui précèdent celui de la bougie décidante*. Que ce seau
soit déjà clos ou encore en formation change l'indice trouvé, jamais la fenêtre.

> **Une mutation inerte qui s'EXPLIQUE est une propriété mesurée.** Elle dit ici que
> l'alignement de seau — le seul endroit où le port pouvait dériver en silence — est
> robuste. Ce qui mord, ce sont la fenêtre, la borne du plafond et la marge : trois
> mutations, trois rouges.

### Un TOTAL n'est pas une attente, et un mode d'emploi n'est pas une prédiction

**PROVENANCE · le piège est nommé par l'utilisateur ; les séparations par famille sont
MESURÉES DANS LE DÉPÔT, même configuration que le port.**

Le pied de `sous-resistance-portee` portait sa prédiction ainsi : *« cette configuration
rend 950 trades avec le filtre et 1 328 sans »*. Les deux nombres sont justes — ce sont
les **totaux des dix familles**. Un rejeu porte sur **un** instrument.

> **Livrer un total comme attente fait échouer la vérification à coup sûr, et l'échec est
> celui de l'attente, pas de ce qu'elle prétend mesurer.** C'est la figure des deux
> populations comptées l'une pour l'autre, commise sur le seul chiffre qu'un utilisateur
> allait relire.

Ce qui se prédit est donc une **séparation**, et elle se lit sur les deux nombres du même
instrument — le compte avec le filtre, le compte en décochant la case. Mesuré par famille :

| | |
|---|---|
| vx-yen 44,7 % · vx-or 41,4 % · vx-conso 36,0 % · vx-eur 33,3 % | vx-500 31,2 % · vx-40 31,1 % · vx-2000 27,6 % |
| vx-cu 21,7 % · vx-tech 18,1 % | **vx-btc 10,7 %** |

#### Et le seuil d'exploitabilité se CALCULE — 19,8 %, pas « au-dessus du bruit »

**PROVENANCE · l'arithmétique est de l'utilisateur, refaite ici avant d'être écrite.** Le
mode d'emploi portait d'abord un seuil de 15 %, choisi comme « un peu au-dessus du bruit ».
C'était un nombre magique, et il rendait le verdict AMBIGU au lieu de le protéger.

Le bruit de l'arbitre vaut 7,5 % et 11,0 % sur les deux instruments rejoués. Un compte est
donc « proche de N-avec » dans `[0,89 ; 1,11] × A`, et « proche de N-sans » dans
`[0,89 ; 1,11] × S`. Pour que les deux lectures ne puissent pas être vraies **ensemble** :

```
1,11 × A < 0,89 × S   ⟺   A/S < 0,802   ⟺   séparation > 19,8 %
```

À 15 %, les deux bandes se recouvrent sur `[0,890 ; 0,944] × S` — et **la table de
verdicts n'avait pas de ligne pour cette zone**, c'est-à-dire précisément pour le cas que
le seuil existait pour empêcher.

> **Une tolérance posée autour de DEUX références doit être disjointe des deux.** Ce n'est
> pas une marge à choisir large au jugé : c'est une inégalité, et elle a une solution. Un
> seuil qu'on compare au bruit répond à la mauvaise question — il faut le comparer à ce
> que le bruit rend INDISTINGUABLE.

**DEUX familles sur dix tombent, et pas pour la même raison** — c'est ce qui rend le calcul
préférable au coup d'œil. `vx-btc` (10,7 %) est sous le **bruit** lui-même. `vx-tech`
(18,1 %) est au-dessus du bruit et quand même inutilisable : ses deux bandes se recouvrent
encore. À l'œil, 18,1 % contre 11 % a l'air suffisant.

**Et la table de verdicts a gagné son troisième état au passage** : « entre les deux
bandes » n'est ni la réussite ni la panne visée. Le forcer dans le plus proche des deux
serait la figure du tiret qui couvre trois causes, sur un nombre au lieu d'une date.

**Le refus se dit aussi dans l'autre sens.** Si aucun instrument n'atteint 20 %, le rejeu
ne peut pas conclure — ce n'est pas un échec du port, c'est l'arbitre qui se récuse. Le
mode d'emploi le dit AVANT les trente minutes, parce qu'un résultat qu'on ne saura pas
interpréter coûte plus que pas de résultat : il a la forme d'une réponse.

##### Et le tableau que la personne relit est confronté à une remesure

Les dix séparations vivaient en prose, dans un document et dans le pied d'une garde —
**deux copies d'un compte, sans commande**, écrites le jour même où ce fichier reproche
cette forme ailleurs. Le pied ne les porte plus ; elles vivent dans
`REJEU-SOUS-RESISTANCE.md`, et `sous-resistance-portee` les y **recalcule et les
confronte**, dans les deux sens : une famille mesurée sans rangée, une rangée sans
famille, un chiffre qui a dérivé.

**Le classement est DÉRIVÉ, pas lu** : le seuil sort de la bande par l'inégalité
ci-dessus, et le test exige que le document porte les deux bornes. Écrits à la main des
deux côtés, il aurait suffi qu'un seul bouge — c'est la forme de `meme-horloge`, où le
défaut n'est dans aucun maillon pris seul.

> **Un chiffre qu'une PERSONNE relit avant d'agir est celui qui mérite le plus sa
> commande.** Un tableau périmé n'a pas de symptôme : il envoie choisir un instrument sur
> une séparation qui n'existe plus, et rien, dans un document, ne rougit.

**ET LA QUATRIÈME MUTATION A MORDU LA MAUVAISE ASSERTION**, ce qui a corrigé la prise et
non la garde. Retirer une rangée faisait tomber la PRISE — « au moins dix rangées lues » —
avant la confrontation, avec un message qui parle de FORME quand le défaut est une
POPULATION. La suite était rouge, la mutation semblait bonne.

> **Une prise trop haute mord à la place de l'assertion qu'elle protège.** Elle doit
> prouver que l'instrument LIT, rien de plus : au-delà, elle décrit le même défaut que la
> vérification, et c'est elle qu'on lira. La prise est donc basse (cinq rangées) et c'est
> la confrontation qui travaille.

**ET LE BRIEF DEMANDAIT UNE SÉRIE D'EXEMPLE, ce qui n'est pas exécutable.** Les dix
familles sont engendrées : aucun courtier n'en porte le symbole, et la garde de symbole du
robot refuserait de démarrer. Le rejeu se fait sur un instrument de l'utilisateur, et
c'est même meilleur — les deux nombres décrivent SES données au lieu des miennes. Les dix
familles gardent leur rôle : elles disent quelle séparation est normale, donc si la ligne
choisie peut trancher.

### Et la garde du miroir de vente a dû SUIVRE le retrait, pas être réécrite

`fResist` quitte `INCONNUS` ; il reste dans `SANS_SYMETRIQUE_VENDEUR`. Les deux faits
sont indépendants — *« la mesure le porte-t-elle à la vente ? »* et *« le robot sait-il
l'écrire ? »* — et les confondre ferait dépendre un fait du marché de l'avancement d'un
chantier.

La garde de la veille exigeait que chaque filtre retiré à la vente soit **encore refusé à
l'achat**. Sur un port réussi, elle serait tombée : elle tenait une liste là où elle
croyait tenir un accord. Sa population est désormais l'**intersection** — les filtres
gatés ET encore déclarés inconnus —, découverte des deux côtés. Mutation : remettre
`fResist` dans `INCONNUS` fait tomber le port, pas le miroir.

## Une paire vérifiée sur un TRIPLET est une population choisie

Le même savoir — *« sous résistance et zone de résistance n'ont pas d'équivalent
vendeur »* — vit à trois endroits :

| lieu | forme |
|---|---|
| `cfgCourante` | `&& !vente` |
| `robot-mt5.js` | `SANS_SYMETRIQUE_VENDEUR` |
| `scripts/mt5/config.mjs` · `mirroirVente` | `if (f.type === …) continue;` |

La garde en confrontait **deux**, et c'est elle qui a rendu le faux refus visible. La
troisième est le port du **harnais** : celui qui bâtit la configuration contre laquelle
la fidélité du robot se mesure. Un troisième filtre ajouté demain aux deux premières
sources passerait au vert pendant que `mirroirVente` continuerait de le transmettre au
moteur — le harnais mesurerait alors une configuration que l'application ne mesure pas,
**et l'écart s'imputerait au robot**.

> **Confronter deux sources d'un triplet, c'est choisir sa population** — exactement ce
> que ce fichier venait de fermer sur un comptage de surfaces. *Le remède n'est pas de
> vérifier mieux : c'est d'ÉNUMÉRER les sources avant de les confronter.*

**Les deux vocabulaires se dérivent du même endroit** : la ligne de `cfgCourante` qui
gate le filtre NOMME aussi son type. Aucune table de correspondance à tenir à jour
(règle 8). Mutation : retirer un type de `mirroirVente` fait tomber la garde en nommant
les deux listes.

## Un mode d'emploi nomme les choses comme l'ÉCRAN les montre

**STATUT · CAUSE ÉTABLIE — défaut RAPPORTÉ par l'utilisateur (il a coché la mauvaise
tuile), cause et correctif MESURÉS DANS LE DÉPÔT, en confrontant le document au panneau.**

`REJEU-SOUS-RESISTANCE.md` disait « cochez **Sous résistance** ». **Le panneau ne porte pas
ce mot** : sa tuile s'appelle « **Plus haut** ». L'utilisateur a coché « **Zones** », qui
est juste à côté et dont la description parle elle aussi de résistance — c'est `fZone`, il
n'est pas transposé, donc l'export est **refusé** et le bouton reste gris. Trente minutes
perdues sur un bouton qui ne fait rien, pour un mot.

« Sous résistance » est le libellé **interne** : `COURTS_FILTRE.resist`, celui des messages
de refus. Je l'ai lu dans la source et je l'ai écrit tel quel.

> **Un document destiné à un humain nomme les choses comme l'écran les montre, jamais
> comme la source les appelle.** C'est la règle 8 appliquée à une instruction : le nom de
> la source est un **lieu** — l'endroit d'où je l'ai lu —, le nom de l'écran est la
> **propriété** qui compte, puisque c'est le seul que le lecteur peut voir.

**Et le tri est plus instructif que le cas** : l'utilisateur a vérifié à la main les dix
autres libellés cités — « Mes scans », « Croisement et Rebond », « Médiane », « Période à
tester »… — et ils passaient tous. *Celui-ci est le seul qui ne venait pas de l'écran, et
c'est le seul qui comptait.* Une vérification manuelle exhaustive ne protège de rien quand
un seul membre de la population a une provenance différente des autres.

### La forme proposée refusait 15 citations sur 15 — mesuré avant d'être écartée

La garde annoncée était : *tout libellé cité entre « » doit se retrouver dans les `nom:` du
panneau*. Comptée sur ce document : **15 citations distinctes, 15 hors des `nom:`** —
« Entrée », « Stop », « Transactions », « Chaque tick basé sur des ticks réels », de la
prose citée. Elle refuse la totalité du cas normal, donc elle est morte le premier jour
(règle 16).

**La population retenue se découvre et elle est étroite** : les libellés de
`COURTS_FILTRE`, qui sont exactement les noms que la source donne aux filtres. Trois d'entre
eux ne sont pas des tuiles — « Sans filtre », « Moyenne mobile », « Sous résistance » —, et
ce décalage EST le piège. La correspondance interne → tuile se **dérive du drapeau**
(`resist` → `fResist`, `mtf` → `btMtf`) : aucune table à tenir à jour, un dixième filtre y
entre sans être nommé nulle part.

`scripts/app/mode-emploi-nomme-lecran.test.mjs` exige donc, pour chaque libellé interne que
le document cite, que le nom d'écran y soit présent aussi — et **son angle mort est en
tête** : elle ne sait pas dire s'il est présent au bon endroit. S'ancrer sur l'instruction
demanderait de reconnaître une phrase, c'est-à-dire de la prose (règle 3).

**La PRISE est éprouvée sur la perte de SUJET**, pas sur un désancrage : aligner le libellé
interne sur celui de la tuile vide `divergents`, et la garde tombe en disant qu'elle n'a
plus de sujet, avec ses deux issues écrites. Sans elle, une unification des deux
vocabulaires la laisserait verte en ne gardant plus rien.

### Et les CHAMPS portaient le même défaut, un cran plus bas

Le document appelait les trois champs « unité / bougies / marge % » ; le panneau écrit
« **Unité** » / « **Fenêtre** » / « **Marge** » — *bougies* n'est que le suffixe affiché
après la valeur. Personne n'aurait perdu trente minutes là-dessus, et c'est justement
pourquoi ça se garde au même endroit : **une classe fermée sur son seul cas visible est un
lieu.** Le second test lit les trois `ch(…)` de la tuile et exige que le document les cite
sous ces noms-là. Mutation : un champ renommé dans le panneau le fait tomber en nommant le
manquant — c'est le bon sens, le jour où l'écran change de mot c'est le document qui a tort.

## Une garde vérifie ce qui est ÉMIS ; une personne vérifie ce qui est ÉCRIT

**PROVENANCE · la vérification FAUSSE est celle de l'utilisateur, rapportée par lui.**

Un compte rendu de livraison se relit sur l'**artefact**, avec un `grep`, par quelqu'un
qui n'analyse pas le source. Écrite `transposé`, la phrase du refus n'a pas répondu :
un comptage sur le fichier livré a rendu **1 pour 2 surfaces**, et la seule occurrence
trouvée était une prose cassée. L'échappement ne trompe aucune garde — espree rend la
valeur, et les deux formes lui sont le même texte. **Il ne trompe que l'œil.**

> **Quand ce qui est émis et ce qui est écrit diffèrent, c'est la personne qui perd — et
> elle perd en silence, parce qu'un grep qui ne trouve rien ressemble à un grep qui
> trouve zéro.** Une forme qui ne coûte rien à la machine et rend une vérification
> humaine possible n'est pas un détail de style.

**La prise est un RÉSULTAT, pas une interdiction.** On n'interdit pas les échappements —
le fichier en porte des centaines de légitimes, et les interdire serait un faux refus
massif (règle 16). On exige que la phrase **se retrouve**, telle quelle, dans l'artefact
livré ; il n'y a qu'une façon d'y arriver. Mutation : la repasser en échappements et
reconstruire l'artefact fait tomber la garde — et le `grep` humain retombe alors à 1.

**Son angle mort est en tête** : elle tient LA phrase que ces gardes policent. Il n'y a
pas de population mécanique des textes qu'un rapport pourrait citer ; la règle générale
vit ici, ce qui est gardé est ce cas.

### Deux artefacts qui disent le même savoir, écrits l'un d'après l'autre

**PROVENANCE · la faille est nommée par l'utilisateur, la fermeture MESURÉE DANS LE
DÉPÔT par cinq mutations qui ne touchent QUE le MQL5.**

La garde du port prouvait qu'une **simulation JS** égale le moteur, bougie par bougie.
Elle ne prouvait pas que cette simulation égale le **MQL5 livré** : les deux ont été
écrits à la main, d'après la même intention, et rien ne les confrontait.

```
moteur (JS)  ↔  simulation (JS)  …  PlafondResist (MQL5, que rien n'exécute)
                     ↑ prouvé          ↑ jamais confronté à rien
```

**C'est la classe des cinq copies d'une phrase, transposée du texte au code.** La surface
manquée serait une transcription, et la garde resterait verte. *Et la sortie de secours
était fermée par la mesure du même jour* : un rejeu MT5 ne rattrape pas un port faux,
puisque les signatures d'erreur fines sont sous le bruit du testeur. Ni le dépôt, qui
n'exécute pas MQL5, ni le testeur, qui ne résout pas l'écart.

> **Quand deux artefacts portent le même savoir et qu'un seul est exécutable, « j'ai
> écrit le second d'après le premier » n'est pas une preuve — c'est la description du
> risque.** La question n'est pas *sont-ils d'accord ?* mais *par quel mécanisme un
> désaccord serait-il VU ?*

**La chaîne se referme par le seul bout disponible, et il y en avait deux :**

| | ce qui est dérivé du texte émis |
|---|---|
| les **paramètres** | la simulation ne lit plus `cfg` : elle extrait du MQL5 produit la fenêtre, la marge et l'unité, et joue ceux-là. Une émission qui écrirait 19 au lieu de 20 passerait sinon, puisque la simulation ne l'aurait jamais lue |
| la **structure** | chaque décision que la simulation prend est assertée dans le corps émis — le défaut de `j`, le sens de la recherche, la borne exclusive du plafond, le refus quand l'historique manque, le seau de la bougie décidante, et le `g_n--` d'`Agreger` |

Cinq mutations posées **du seul côté MQL5** la font tomber, chacune en nommant la
décision perdue. Ce qui reste dehors est écrit en tête : ce que MetaTrader fait de ce
texte.

**ET L'AUTRE ÉCHELLE D'ERREUR EST DÉCLARÉE AVEC SA PRÉDICTION.** Une transcription rate
rarement de 1,2 % ; elle rate de 40 %. Le rejeu qui trancherait ça n'a pas besoin d'être
fin — il lit un compte de trades, et la prédiction est écrite d'avance dans le fichier
pour être relue telle quelle. *Les deux échelles ensemble sont la seule couverture
honnête ; tant que le rejeu n'a pas eu lieu, le statut du port le dit.*

### Une mutation inerte dit « non mesuré », pas « robuste »

L'équivalence des deux façons de compter le seau en formation avait été expliquée en
prose, et l'explication était juste. Elle restait une explication.

> **Une mutation qui ne tombe pas mesure l'absence d'une garde, jamais la présence d'une
> propriété.** Si l'équivalence est vraie, elle est ASSERTABLE — et tant qu'elle ne l'est
> pas, le fichier affirme sur parole exactement ce qu'il interdit ailleurs.

Les deux formulations sont désormais jouées l'une contre l'autre sur la même population,
avec une prise qui exige que le masque décide. Le fait est mesuré ; le commentaire n'en
est plus que la raison.

## L'unité d'un filtre est INERTE dans le moteur et VIVANTE dans le robot

**STATUT · DEUX DÉFAUTS, ET ILS ONT ÉTÉ SÉPARÉS. `W1` replié sur `H4` est CORRIGÉ et
MESURÉ ; la série de décision donnée aux filtres est RELEVÉE, NON FERMÉE.** Rien n'est
changé ici : la mesure est consignée pour que la correction se décide sur des chiffres.
Elle est née d'une lecture de l'utilisateur sur `backtesterSuivi`, et elle déborde le lot
qui l'a fait trouver.

`backtesterSuivi(df, cfg, ut)` ré-échantillonne **avant** d'appliquer les filtres :
`autorisePar(sup, cfg.filtres)` leur donne la série de DÉCISION, pas la H1 brute. Chaque
filtre ré-échantillonne ensuite par sa propre unité — mais à partir d'une série qui a
déjà perdu le détail. Et `resamplerBrut` ne connaît que **deux** seaux : `D1`, et tout le
reste en `H4`.

**Mesuré**, dix familles, RSI 14 seuil 50, total des trades :

| unité du filtre | H1 | H4 | D1 | W1 |
|---|---|---|---|---|
| décision **H1** | 4 968 | 3 992 | 4 230 | **3 992** |
| décision **D1** | 955 | 955 | 955 | 955 |

**Deux faits, et le second est indépendant du premier.**

**1 · Sous une décision D1, l'unité de chaque filtre est totalement inerte** — quatre
valeurs, un seul chiffre. Le robot, lui, l'honore : `secs(etat.utRsi, 3600)` émet des
seaux H1. *Les deux ne calculent pas la même chose, par construction.* Et ce sont les
DÉFAUTS qui sont mixtes — `utRsi: 'H1'`, `utAdx: 'H1'`, `utPente: 'H4'` — donc il n'y a
aucun réglage exotique à aller chercher.

**2 · `W1` est replié sur `H4` par le moteur, même sous une décision H1** — 3 992 des
deux côtés. Le robot porte `SECONDES = { …, W1: 604800 }` et fait de vraies semaines.
L'interface offre W1 (`utPivot`, et la liste `['H1', 'H4', 'D1', 'W1']`). *Celui-là mord
au réglage par défaut de la décision.*

> **Un réglage que l'interface offre, que le moteur ignore et que le robot honore est la
> classe complète prise à l'envers** — le harnais passe son temps à traquer ce que le
> robot ne sait pas faire ; ici c'est le moteur qui ne fait pas ce qu'il annonce, et le
> robot qui a raison. Rien ne ment visiblement : la ligne dit « RSI H1 », le chiffre est
> du D1, le robot exporté calcule du H1, et l'écart s'impute au robot.

**PORTÉE DE LA MESURE, en tête** : le défaut est établi sur le moteur et sur la table des
secondes du générateur. Ce qui n'est PAS mesuré : la magnitude de l'écart robot ↔ moteur
sur une configuration mixte réelle — il faudrait un rejeu —, et si la grille d'un scan
produit spontanément des unités mixtes ou si l'utilisateur doit les choisir.

**CE QUE LA RÉTRODICTION A RENDU, parce qu'elle était peu chère et qu'elle ferme une
piste** : les neuf rejeux ne peuvent pas porter ce défaut. `CADRE.ut` vaut `D1` et les
huit filtres de `references.mjs` portent `ut: "D1"` — aucune unité mixte. *Les trois
écarts non expliqués du chantier MT5 ne viennent donc pas de là*, et le chapitre clos
reste clos sur ce point.

**LA SORTIE N'EST PAS UN REFUS D'EXPORT**, et c'est ce qui décide de la suite : refuser
laisserait le moteur annoncer une unité qu'il n'applique pas. Il y en a deux, et elles
s'excluent — le moteur ré-échantillonne depuis la H1 brute, ou l'interface cesse
d'offrir une unité par filtre. La première rend vrai ce qui est écrit ; la seconde rend
écrit ce qui est vrai. *Aucune des deux n'entre dans le lot qui a trouvé le défaut.*

### Les deux défauts ont été rangés sous une entrée, et ils ne sont pas de la même nature

Le relevé ci-dessus en tenait **deux**, avec deux sorties qui s'excluent — donc il en
décrivait un seul et en cachait un autre. C'est l'utilisateur qui les a séparés, et la
séparation décide de ce qui se répare aujourd'hui.

| | ce que c'est | ce que ça demande |
|---|---|---|
| **A · `W1` replié sur `H4`** | un **cas non écrit** : `resamplerBrut` testait `H1`, puis `D1`, et faisait tomber tout le reste dans le seau de 4 h | dix lignes, une garde, une mutation — rien à décider |
| **B · les filtres reçoivent la série de DÉCISION** | une **conception** : `autorisePar(sup, …)` leur donne une série qui a déjà perdu son détail | savoir ce que l'interface doit promettre — pas un lot de correction |

**A est corrigé.** Le seau est celui du robot à l'arithmétique près — `t / sec` sur
l'horloge brute —, donc une semaine y court du jeudi au mercredi, l'époque Unix étant un
jeudi.

**ET LA RAISON QUI ACCOMPAGNAIT CE SEAU ÉTAIT FAUSSE, ce qui est plus grave que le seau.**
Elle disait *« c'est la semaine que MT5 découpe »*. Le robot ne demande jamais sa semaine
à MT5 : `PERIOD_W1` natif commence le DIMANCHE, et le robot ne l'appelle pas — il agrège
lui-même depuis les H1. Le jeudi sort de l'arithmétique de `SeauDe`, pas d'un découpage
de MT5.

> **Une justification fausse est plus dangereuse quand la décision est juste**, parce que
> rien ne la contredit. Un lecteur qui aurait cru celle-là, puis découvert le dimanche,
> aurait « réparé » l'écart que ce seau vient de fermer — et il aurait eu raison contre
> une phrase, tort contre le robot.

Un fait plausible à la place d'un fait disponible, écrit dans le commentaire d'un
correctif mesuré. Ce qui tient l'alignement est la COMPARAISON AU ROBOT, jamais une
propriété de MT5.

**Et c'est la garde du port qui l'a chiffré**, ce qui était la seconde moitié de la
remarque : `utResist: 'W1'` sous une décision H1 la fait rougir sur **13 270 bougies pour
vx-eur seul**, les dix familles sans exception. Le relevé cessait d'être un relevé dès
qu'on lui donnait la bonne fixture.

> **Une dérivation exercée sur un seul point ne découvre rien de plus qu'une constante.**
> La garde du port extrayait bien ses paramètres du texte émis — mais elle ne jouait que
> `86400`, c'est-à-dire la seule unité dont on venait de mesurer qu'elle est en accord
> des deux côtés. Une prise vérifiée sur une population choisie, dans la garde écrite
> contre ce défaut-là.

`scripts/mt5/unites-agregees.test.mjs` tient la CLASSE et non le cas : les unités sont
découvertes dans la table `SECONDES` du robot, chacune doit rendre une série **distincte**
dans le moteur, et son grain doit suivre sa durée — deux unités qui coïncident par hasard
sur un compte ne coïncident pas sur un rapport. Une cinquième unité ajoutée au robot sans
seau correspondant la fait tomber sans être nommée ici. Éprouvée par deux mutations :
l'état d'avant, et l'unité orpheline.

**`MOTEUR_V` NE TOURNE PAS PARCE QUE LA POPULATION EST VIDE — pas parce qu'elle serait
minoritaire.** L'arbitrage avait d'abord été posé à deux termes : tourner la clé (périmer
tout le monde) ou ne pas la tourner (ne périmer personne). *Les deux traitaient une
population entière au nom d'un sous-ensemble*, ce qui est exactement le défaut que ce
fichier reproche ailleurs.

**Le troisième terme est de périmer les LIGNES qui portent le défaut**, et c'est
l'utilisateur qui l'a nommé. Ce qui tranche n'est donc pas un jugement mais un fait qu'il
a mesuré sur ses données : **aucune ligne validée ne porte de filtre `W1`.** La clé ne
tourne pas parce qu'il n'y a rien à périmer.

> **« Minoritaire » est un jugement qui se périme en silence ; « vide » est une mesure
> datée qui cesse d'être vraie visiblement.** Les deux menaient à la même décision ce
> jour-là, et elles divergent au premier client.

**ET LE PRÉDICAT CIBLÉ EST ÉCRIVABLE — mesuré pour que la dette soit connue AVANT de
servir.** Une ligne enregistrée porte ses filtres : `REGLAGES` contient les drapeaux
(`fRsi`, `fAdx`, `fNuage`, `fMa`, `fPente`, `fPivot`, `fResist`, `fZone`) ET les unités
(`utMtf`, `utRsi`, `utAdx`, `utNuage`, `utMa`, `utPente`, `utPivot`, `utResist`,
`utZone`), et `snapshotReglages` copie toute clé de `REGLAGES` présente dans l'état. Le
prédicat s'écrit `_reg.fResist && _reg.utResist === 'W1'`, sans rien ajouter au format.

**Et le troisième ÉTAT a déjà un nom dans le code**, ce qui était la moitié manquante :
`snapshotReglages` n'est appelé que sous `e._exact` — une photo n'est posée que quand elle
est fidèle. Une ligne sans `_reg` et sans archive complète ne peut rien dire d'elle-même,
et `_exact` le porte déjà. *Le jour où le prédicat servira, il aura trois issues et non
deux : porte le défaut, ne le porte pas, et « je ne peux pas le dire » — qui ne s'écrit
jamais comme un silence.*

> **Un défaut de moteur découvert après le lancement ne laisse pas le choix entre tout
> périmer et mentir — à condition que la contrainte ait été mesurée avant d'en avoir
> besoin.** Elle l'est, elle ne coûte rien aujourd'hui, et c'était le seul moment où on
> pouvait la mesurer sans urgence.

**ET LE PRÉDICAT N'EST PAS ÉCRIT POUR LE BON MOTIF — la distinction a été relevée par
l'utilisateur et elle vieillit mieux.** Le premier refus disait « une garde sur une
population vide compterait zéro ». C'est vrai du TEST, et le test n'a effectivement pas à
être écrit. Ça ne l'est pas du PRÉDICAT : ce serait du comportement produit, dormant et
correct — cinq lignes qui ne s'exécutent jamais tant que personne n'a de ligne `W1`, et
qui sont justes le jour où quelqu'un en a une.

> **« Le test compterait zéro » et « le prédicat serait inutile » se ressemblent et ne
> vieillissent pas pareil.** Le premier reste vrai tant que la population est vide ; le
> second devient faux au premier client, sans que rien ne le signale. *Un refus se
> justifie par ce qui cessera d'être vrai en même temps que lui.*

**ET LE PRÉDICAT EST ÉCRIT DEPUIS — c'est l'objection qui est tombée, pas le motif.**
Le refus tenait sur « son test compterait zéro », et il restait un refus par la
population. **La population est vide dans les DONNÉES d'un utilisateur, pas dans une
fixture** : trois lignes semées, une par issue, la font exister et le test compte trois.
Le dépôt savait déjà le faire — le semis des décisions pose une ligne refusée à l'export
pour que le refus ait un cas, et il a été écrit pour la même raison.

> **« Aucun cas n'existe » et « aucun cas n'existe CHEZ QUELQU'UN » ne se répondent pas
> pareil.** La seconde est une mesure sur des données, et un banc n'en dépend jamais :
> il pose le cas. Confondre les deux fait refuser une garde en croyant refuser un zéro.

**LA DETTE A DONC QUITTÉ `PASSATION.md`.** Elle y était écrite par son DÉCLENCHEUR — « au
premier client » —, c'est-à-dire par un événement du monde qu'aucune garde ne peut
constater : de la **vigilance**, et ce fichier-ci en a mesuré quatre fois le rendement.
Le prédicat la remplace par de la **construction** — la ligne se marque elle-même à
l'écran de celui qui la regarde, avec ses trois issues. *Ce qui reste dans le registre,
c'est le pourquoi ; ce qui est parti, c'est le rappel.*

### Le prédicat est écrit, et c'est la GARDE qui a trouvé le quatrième site d'estampille

**STATUT · CAUSE ÉTABLIE — le repli est MESURÉ DANS LE DÉPÔT (13 270 bougies), la
population touchée est RAPPORTÉE par l'utilisateur (zéro chez lui au 20/09/2026), le
correctif et ses trois issues MESURÉS DANS LE DÉPÔT, au rendu, sur le fichier livré.**

Ce qui manquait pour dater le défaut n'était pas le prédicat : c'était une **estampille de
version**. `_mv` dit sous quelle RÈGLE les trades ont été calculés ; rien ne disait sous
quelle VERSION. Sans elle, une ligne portant une unité `W1` mesurée hier et une mesurée
sous le correctif sont indistinguables — et marquer les deux serait un faux refus sur le
cas normal (règle 16).

**L'ABSENCE de l'estampille est l'information, et c'est ce qui rend la migration
inutile.** Toute ligne mesurée avant cette version n'en porte pas, par construction : il
n'y a rien à convertir et rien à deviner. C'est la même figure que `_reg` — une photo
n'est posée que quand elle est fidèle, donc son absence dit quelque chose de vrai.

**ET LA GARDE A TROUVÉ UN QUATRIÈME SITE D'ESTAMPILLE QUE JE N'AVAIS PAS VU.** Trois
avaient été convertis à la main — les deux publications de scan et la remesure. Le
quatrième est celui qui fabrique une ligne **VALIDÉE**, c'est-à-dire exactement la
population que le prédicat interroge. Il ne portait donc pas `_va`, et toute ligne
validée depuis aurait été marquée « mesurée avant le correctif » à tort.

> **Une conversion à la main COMPTE ce qu'elle a touché, jamais ce qu'elle n'a pas
> trouvé.** C'est le même compte de succès que la substitution en masse de la veille —
> quatre surfaces annoncées pour cinq —, commis deux jours plus tard sur le geste
> inverse : là on remplaçait un texte, ici on factorisait un objet. *La sortie est la
> même : une source unique, et une garde qui compte ses LECTEURS.*

`marqueMesure()` rend les deux estampilles, quatre sites l'appellent, et la garde exige
qu'il n'existe **qu'une** écriture de `_mv` en clair — celle de la source. Un cinquième
site écrit à la main redevient une copie, et une copie diverge à la première qu'on
oublie.

#### Trois issues, et la troisième est celle qui n'a pas de population

|  | ce que la ligne rend |
|---|---|
| `_reg` posée à la validation | la configuration est RENDUE par `cfgCourante`, et on lit l'unité qu'elle produit |
| archive de scan complète | idem — `_exact` couvre les deux |
| ni l'une ni l'autre | « je ne peux pas le dire », jamais un silence |

**La première ligne décide sur un RÉSULTAT** : on ne demande pas « la photo porte-t-elle
un `utXxx` à W1 ? », ce qui serait réécrire dans le prédicat la table des couples
drapeau/unité — neuf aujourd'hui, dix demain. On appelle la fonction qui construit la
configuration, et on lit l'unité qu'elle met réellement dans le filtre.

#### « Son test compterait zéro » était vrai du TEST et faux de la POPULATION

Le prédicat avait été refusé une fois, et le motif était juste : une garde sur une
population vide compte zéro. **Ce que le motif ne disait pas, c'est que la population est
vide dans les DONNÉES d'un utilisateur, pas dans une fixture.**

> **« Aucun cas n'existe » et « aucun cas n'existe CHEZ QUELQU'UN » ne se répondent pas
> pareil.** La seconde est une mesure sur des données, et un banc n'en dépend jamais : il
> POSE le cas. Confondre les deux fait refuser une garde en croyant refuser un zéro.

Le dépôt savait déjà le faire, deux fois, et pour la même raison : le semis des décisions
pose **une** ligne que le générateur refuse, parce que sans elle la tournée n'exerçait que
le chemin qui réussit. Trois lignes semées ici, une par issue, et le test compte trois.

#### Et la mutation est restée VERTE, ce qui a corrigé la table plutôt que la garde

La comparaison de versions a été mutée en comparaison de **chaînes**. Les huit cas de la
table sont passés — dont celui qui portait, en toutes lettres, l'étiquette « LE CAS QUI
PIÈGE UNE COMPARAISON DE CHAÎNES » : `260921` contre `260920.5`, où le texte répond juste
(`'1' > '0'` à la position qui décide).

> **Une étiquette n'est pas une mesure, même écrite dans une garde.** Le cas avait été
> choisi pour son air de piège, pas pour sa propriété — et il ne discriminait rien. Ce
> qui discrimine est le **rang à deux chiffres** : `260920.9` contre `260920.10`, que le
> texte ordonne à l'envers. Le dépôt en a livré (`260915.12`), donc le cas est réel.

C'est la mutation INERTE prise du bon côté : elle ne disait pas que la garde était
aveugle, elle disait que l'assertion ne mesurait pas ce qu'elle annonçait. *Une mutation
verte se paie en heures ; celle-ci en a rendu une propriété qu'on croyait tenir.*

#### Et le prédicat a d'abord été posé là où la valeur ne pouvait pas arriver

Première forme : le marquage vivait dans le producteur de RANGÉE du portefeuille, qui lit
un objet **mappé**. Cette projection énumère ses champs — elle n'emporte ni `_reg` ni
`_va`. Le prédicat rendait donc « porte » quand on l'appelait à la main, et l'écran
rendait « je ne peux pas le dire ».

> **Un producteur juste dont la valeur ne rejoint jamais son trou** — la règle 11, sur un
> objet intermédiaire au lieu d'un gabarit. Une garde de source aurait lu l'appel et
> l'aurait trouvé correct ; c'est le RENDU qui l'a dit.

Le calcul vit donc là où `v` est la ligne validée elle-même. Et la garde de rendu prouve
sa PRISE avant de conclure — trois rangées vues — sans quoi « la marque n'y est pas »
serait vrai d'un écran qui n'a pas fini de se peindre, et la mutation suivante se lirait
comme une mutation voisine.

### B est tranché — et c'est le COMPTE NET qui a failli le faire classer bénin

**STATUT · CAUSE ÉTABLIE — écart MESURÉ DANS LE DÉPÔT (recouvrement des jeux de trades,
R par an, part de la grille exposée) ; la population de lignes touchées est RAPPORTÉE
par l'utilisateur, sonde lancée sur ses deux espaces : zéro, dont zéro indéterminable.**

L'utilisateur a choisi la seconde sortie — **rendre écrit ce qui est vrai**. Le moteur ne
ré-échantillonne pas depuis la H1 brute ; le produit cesse d'offrir une unité de filtre
plus fine que l'unité de décision. Ce qui a décidé n'est pas un arbitrage de goût : le
motif existait déjà dans le produit — `utMtf` était la seule unité contrainte, et la
seule qui n'a jamais porté le défaut. *On étend un motif éprouvé par l'absence de défaut
là où il s'applique ; on ne conçoit rien.*

#### Le compte net répond à « le testeur peut-il distinguer ? », jamais à « ma ligne dit-elle ce que mon robot fera ? »

C'est la leçon du chantier, et elle a été commise avant d'être écrite. Quatre mesures
disaient la même chose et la conclusion qu'on en tirait était trop douce :

| | masques en désaccord | trades nets | verdict tiré |
|---|---|---|---|
| `W1` replié sur `H4` | 13 270 bougies | 0,0 % | « inoffensif » |
| `tendance_mtf`, défauts divergents | 37,2 % des bougies | −1,4 %, sans signe | « ne peut pas porter une décision » |
| ADX H1 sous décision D1 | 43,9 % des seaux porteurs de signal | +8,8 %, 6/4 | « non départageable » |
| RSI H1 sous décision D1 | 32,7 % des seaux porteurs de signal | +20,9 %, 10/10 | défaut établi |

**Les trois premiers verdicts étaient justes pour la question du testeur et faux pour
celle de l'utilisateur.** 671 seaux décisifs en désaccord sur 1 529 avec un net de
+8,8 % ne veut pas dire « presque pareil » : ça veut dire que les désaccords s'annulent
EN NOMBRE. Deux jeux de trades de taille identique et de contenu disjoint rendent un
écart net de zéro.

> **Un compte net mesure la DÉTECTABILITÉ d'un écart, pas le DOMMAGE qu'il cause.** Ce
> qu'un utilisateur lit sur sa ligne n'est pas un nombre de trades : c'est un R par an,
> un creux, un nombre de paris — tous calculés sur un jeu de trades. Si le jeu diffère
> sur la moitié des journées décisives, le chiffre affiché n'est pas celui de son robot,
> quel que soit l'accord des comptes.

**LES DEUX GRANDEURS QUI RÉPONDENT, mesurées sur les dix familles d'exemple.** Le
recouvrement est l'intersection sur l'union en multi-ensemble (journée d'entrée, sens),
**rapporté à son plafond** `min(|A|,|B|)/max(|A|,|B|)` — deux jeux de tailles différentes
ne peuvent pas atteindre 100 %, et le brut disait la bonne chose par le plus faible des
chemins :

| | recouvrement moteur↔robot | recouvrement moteur↔SANS filtre | \|Δ R/an\| médian | max | signes retournés |
|---|---|---|---|---|---|
| RSI H1 · décision D1 | 64 % brut, **78 % du plafond** | 70 % brut, **97 %** | 64 % | 127 % | 1 famille sur 10 |
| ADX H1 · décision D1 | 48 % brut, **52 % du plafond** | 61 % brut, **100 %** | 80 % | 257 % | 1 famille sur 10 |
| `tendance_mtf` · décision H1 | 41 % brut, **42 % du plafond** | 44 % brut, **77 %** | 26 % | 408 % | 1 famille sur 10 |

> **Dans les trois cas, le jeu de trades du robot est PLUS ÉLOIGNÉ de la mesure que ne
> l'est « ne pas filtrer du tout ».** Le désaccord entre deux implémentations du même
> filtre dépasse l'effet entier du filtre. Et le 100 % de la colonne de droite a un sens
> mécanique : filtrer ne fait que RETIRER des trades, ça n'en déplace aucun — changer
> d'implémentation, si.

Trois lignes sur trente voient leur R par an **changer de signe** : vx-or +8,2 → −2,2
(RSI), vx-500 +1,3 → −1,2 (ADX), vx-or −2,5 → +7,7 (`tendance_mtf`).

**AUCUNE BANDE DE BRUIT N'EXISTE POUR CES DEUX GRANDEURS, et elles sont livrées nues.**
Le 7,5–11,0 % de l'arbitre est un bruit de COMPTAGE entre deux jeux de données du
courtier ; il ne borne ni un recouvrement ni un R par an, et `scripts/mt5/` ne porte
aucune liste de trades appariée. La colonne « moteur↔sans filtre » est une **échelle de
comparaison** construite ici, pas une bande de bruit — *mieux vaut livrer un écart nu
que l'habiller d'une bande qui mesure autre chose.*

#### La règle vit à la RÉSOLUTION ; le menu n'en est que la partie visible

Trois étages, et ils ne valent pas la même chose :

| l'étage | ce qu'il tient | ce qu'il ne tient pas |
|---|---|---|
| **`cfgCourante`** — la normalisation | toute unité plus fine que `etat.ut` est remontée à `etat.ut` | rien : c'est la règle |
| **`unitesSuivantDecision`** — la porte d'affichage | le panneau MONTRE l'unité que la mesure emploie | la justesse du chiffre, qui est déjà tenue au-dessus |
| **les menus** (`utsDe`, `utD`) | ce qu'on peut choisir | tout le reste |

> **Un menu qui masque une option ne la retire ni de l'état enregistré, ni d'une
> sauvegarde importée, ni d'une archive de scan.** Un correctif posé sur les seules
> options serait cosmétique — et une garde qui regarderait le panneau le laisserait
> passer.

**ÉGALE EST INCLUSE**, parce que c'est le cas qui fonctionne aujourd'hui. `utMtf` garde
SA règle — strictement au-dessus — et son menu n'a pas bougé : son nom promet une unité
supérieure, pas égale, et l'unifier par souci de symétrie aurait changé sa sémantique
sans qu'on le demande. Il passe quand même par la normalisation, où il n'est jamais
remonté en pratique : la remontée n'existe pour lui que sur un état qu'aucun menu ne peut
produire.

**Et une unité absente ou illisible vaut la DÉCISION, jamais un défaut caché plus fin.**
`resamplerBrut` fait tomber tout ce qu'il ne connaît pas dans le seau de 4 h et le robot
prendrait le sien — deux côtés qui divergent sur ce que personne n'a écrit.

#### La garde, et la mutation qui prouve à quel ÉTAGE la règle vit

`scripts/app/unite-filtre-pas-plus-fine.test.mjs` lit la configuration RÉSOLUE dans un
vrai navigateur, jamais le panneau. Sa surface se **découvre** : elle éteint tous les
booléens de l'état, en rallume un, et retient ceux qui font NAÎTRE un filtre — un dixième
filtre y entre sans qu'une ligne change (règle 7), et un drapeau renommé ne peut pas la
faire mesurer le vide en silence. Sa prise exige six types au moins.

Deux mutations, et la seconde est celle qui compte :

| la mutation | ce qu'on attend | mesuré |
|---|---|---|
| rendre une unité plus fine à un filtre | rouge | rouge, « décision D1 → rsi résolu sur H1 » |
| **restreindre les MENUS sans normaliser** | **rouge quand même** | rouge, sur les sept filtres, menus et défauts intacts |

> **Une garde qui passerait au vert sous la seconde mesurerait le menu et non la
> configuration** — et un correctif cosmétique lui suffirait. C'est la seule mutation du
> dépôt écrite pour prouver l'ÉTAGE d'une règle plutôt que sa présence.

Une seconde garde tient la porte d'affichage : sans elle le chiffre serait juste et
l'écran dirait « RSI H1 » pendant que la mesure porte du D1 — la classe de
`fenetre-nest-pas-seance`, *un champ qui nomme mal ce qu'il porte coûte plus cher qu'un
champ absent.* Elle tombe si quelqu'un rétablit la constante `H1` dans les défauts du
panneau, et elle vérifie au passage que `utMtf` reste strictement au-dessus.

#### `MOTEUR_V` ne tourne pas — et ce qu'il faudrait si la population n'était pas vide

La sonde a été lancée par l'utilisateur sur ses **deux** espaces : 18 lignes lues,
**0 dans le cas, 18 hors du cas, 0 indéterminable, 0 unité divergente**. Le zéro est
mesuré, pas silencieux. Il n'y a donc rien à périmer.

**Ce qui serait à faire sinon, écrit avant d'en avoir besoin** : une ligne stockée
portant une unité plus fine voit sa configuration RÉSOLUE changer sous cette version.
Son R par an affiché devient périmé **sans qu'aucun calcul n'ait bougé** — ni le moteur,
ni les règles de sortie, ni les frais : c'est la question posée au moteur qui change. Le
prédicat ciblé (`_reg.utXxx` plus fin que `_reg.ut`) est écrivable sans toucher au format
enregistré, avec les trois issues que `_exact` porte déjà. Il reste non écrit pour la
raison correcte — *son test compterait zéro*, et non « il serait inutile ».

#### La vacuité tenait à une coïncidence, et la grille le mesure

Les défauts du produit étaient `utRsi H1`, `utAdx H1`, `utPente H4`, et les menus
servaient `H1` quelle que soit la décision. Une ligne de décision D1 portant un RSI était
donc dans le cas **par construction** — sans un geste de l'utilisateur.

Mesuré sur la grille, toutes variantes de filtre cochées (34), unités de panneau par
défaut. Les multiplicateurs — entrées × lignes × périodes × stops × objectifs, 756 — sont
identiques pour chaque variante, donc la part des variantes EST la part des
configurations :

| décision | dans le cas | part | quels filtres |
|---|---|---|---|
| H1 *(le défaut du produit)* | 0 / 34 | **0 %** | rien ne peut être plus fin |
| H4 | 4 / 34 | 11,8 % | `rsi H1`, `adx H1` |
| **D1** | **16 / 34** | **47,1 %** | `rsi H1`, `adx H1`, `pente H4` |
| W1 | 34 / 34 | 100 % | les huit familles |

> **Ses dix-huit lignes en sortaient parce qu'elles décident en H1 ou ne portent ni RSI
> ni ADX — pas parce que quoi que ce soit les protégeait.** « Population vide au
> 20/09/2026 » était une mesure datée dont la date de péremption était le PROCHAIN SCAN
> en décision D1, pas le premier client. C'est le correctif qui la rend vide par
> construction.

#### Et la dette `W1` de PASSATION.md n'était PAS refermée par ce correctif — vérifié plutôt que supposé

Il avait été écrit ici, puis repris dans le brief, que ce correctif rendait la dette du
repli `W1` → `H4` inatteignable, donc à supprimer. **C'est faux, et l'erreur est née
ici** : les deux affaires ont été confondues parce qu'elles parlent toutes deux d'unités.

| la dette (f) | ce correctif |
|---|---|
| une ligne enregistrée AVANT `260920.5` portant une unité de filtre `W1`, dont le chiffre vient de l'ancien repli sur `H4` | une unité de filtre PLUS FINE que la décision |

Mesuré dans le navigateur, sur le fichier livré : une unité `W1` **survit entièrement** à
la normalisation — `tendance_mtf=W1`, `pivot=W1`, `sous_resistance=W1` sous les trois
unités de décision, puisque `W1` est plus GROSSIÈRE que toutes. Le cas de la dette
n'était donc pas fermé, et une ligne ancienne gardait son chiffre périmé.

*(Elle l'est depuis, par son propre prédicat — `w1Perimee`, plus haut. Ce qui l'a fermée
n'est pas ce correctif-ci : c'est d'avoir écrit ce que ce correctif ne faisait pas.)*

> **Deux défauts qui partagent un vocabulaire ne partagent pas une date de péremption.**
> Le geste est celui du chapitre du fait plausible : *avant de retirer une dette, faire
> échouer une fois la raison qu'on lui donne.* Ici la commande tenait dans un appel à
> `cfgCourante`, et elle a rendu l'autre réponse.

#### Un marqueur de mutation dormait dans le fichier LIVRÉ

Trouvé en cherchant les miens : `Période à tester<span …>au format du testeur MT5</*MUT*//span>`
dans `Vuna.dc.html`, posé par `d62b937` — une restauration de mutation qui a rendu
`</span>` sous une forme abîmée, et que personne n'a vue parce que rien ne rougit.

**Ce n'est pas cosmétique, et c'est mesuré** : le navigateur transforme `</*MUT*//span>`
en **commentaire bogué** `<!--*MUT*//span-->`. La balise n'est donc jamais fermée par
cette ligne, le `</span>` suivant ferme le mauvais élément, et l'élément qui suit descend
d'un niveau dans l'arbre — vérifié sur le même fragment, avec et sans : profondeur 2 au
lieu de 1, dans l'en-tête de grille du portefeuille.

> **Une mutation se défait par le mécanisme qui l'a faite — et l'état se vérifie sur le
> FICHIER, jamais sur le compte rendu de l'outil.** La règle 13 portait déjà la première
> moitié ; celle-ci en est la troisième instance, et la première à avoir été LIVRÉE. Un
> marqueur marqué (`/*MUT*/`) rend l'inverse inambigu ; il ne rend pas la restauration
> certaine.

##### Cinq livraisons, quinze nombres rapportés, et aucun ne pouvait bouger

Compté plutôt que juré, avec sa commande — `git show <commit>:Vuna.solo.html` sur chaque
commit depuis `d62b937` :

| version livrée | le marqueur |
|---|---|
| 260919.5 · 260920 · 260920.2 · 260920.4 · 260920.5 | **présent** |
| 260920.6 | propre |

**Cinq livraisons**, chacune rapportée avec sa taille, son md5 et sa `VERSION_APP`,
**deux d'entre elles revérifiées par l'utilisateur sur ses propres copies** — et une
balise cassée traversant l'ensemble sans qu'un seul de ces quinze nombres bouge d'un
iota.

> **Une empreinte est une preuve d'IDENTITÉ, pas de SANTÉ.** Elle prouve qu'on regarde
> le même fichier ; elle ne dit rien de ce qu'il contient. Les trois nombres ne pouvaient
> pas bouger — *ils ne mesurent pas ça*.

**Et c'est l'utilisateur qui a posé la borne de son propre rôle**, ce qui vaut d'être
écrit : *« mon rôle de vérification s'arrête exactement là, et l'avoir dit évite qu'on
prenne mes ✓ pour plus qu'ils ne valent. »* C'est la famille de `netlify.toml` —
*une règle dit où elle s'arrête, sinon elle se lit comme une garantie générale* —
appliquée cette fois à une personne et non à un fichier de configuration.

##### Le refus vit à la PUBLICATION, et il décode

`publier-solo.mjs`, là où les deux `VERSION_APP` sont déjà confrontées : aucun marqueur
de mutation dans ce qui est publié. Trois choses en font une garde et non un grep :

| | ce qui est tenu |
|---|---|
| **elle DÉCODE** | le marqueur livré était en clair ; un marqueur laissé dans `moteur.js` voyage en **base64** et serait invisible à une recherche de texte. Mesuré à la mutation : `grep MUTX Vuna.solo.html` rend **0** pendant que la garde refuse — *chercher une chaîne dans une représentation qui ne la contient pas*, des deux côtés cette semaine |
| **elle prouve sa PRISE** | un décodage qui ne rend presque rien ne regarde plus l'intérieur des modules, et « aucun marqueur » serait un zéro qui n'a rien vu. Seuil : 100 000 octets décodés, mesurés à **856 892** |
| **le motif est MESURÉ** (règle 16) | `/*MUT` rend **0** sur l'artefact décodé ; `MUT` nu en rend **3** et `MUTATION` **7** — le mot vit dans la prose française du produit. Un motif sur `MUT` refuserait le cas normal le premier jour |

Aucun module n'est nommé : la population est « toute suite base64 assez longue », donc un
sixième module intégré y entre sans qu'une ligne change (règle 7). Éprouvée par deux
mutations — le marqueur en clair, et le marqueur **caché dans un module base64** —, et
chacune nomme laquelle des deux moitiés a mordu.

**Et son récit n'épelle pas le marqueur** : le motif est composé (`"/" + "*MUT"`), sans
quoi ce fichier serait sa propre victime. C'est la règle 3 vue depuis l'écrivain, prise
avant la morsure plutôt qu'après — *le récit évite la forme du code*.

## Un fond permanent de messages est un canal de diagnostic hors service

**STATUT · INSTRUMENTATION, AUCUNE CAUSE PRÉTENDUE.** Rien n'est réparé : le fond est
mesuré, classé, et devient une ligne de base surveillée. Le classement est MESURÉ DANS LE
DÉPÔT ; le compte qui l'a déclenché — 47 erreurs, 48 avertissements — est RAPPORTÉ par
l'utilisateur, et les deux tombent à l'unité.

Chaque chargement de l'application écrit **quatre-vingt-quinze messages** en console.
Mesuré, classé, et la réponse à la question posée est **non** — il y en a **trois**
formes, pas deux :

| classe | erreurs | avert. | ce que c'est |
|---|---|---|---|
| **A** · attribut SVG recevant un trou | **47** | 0 | `Error: <line> attribute y1: Expected length, "{{ … }}"` |
| **B** · `input type="number"` recevant un trou | 0 | **46** | `… cannot be parsed, or is out of range.` |
| **C** · `input type="date"` recevant un trou | 0 | **2** | `… does not conform to the required format, "yyyy-MM-dd".` |
| **D** · manifeste de version sous `file://` | 2 | 0 (+1 requête) | n'existe pas sous `/app` |
| **exceptions** (`pageerror`) | **0** | — | — |

**La troisième forme est la trouvaille, et elle tient à une chaîne.** `type="date"` porte
le même mécanisme que `type="number"` — un trou lu par l'analyseur d'attribut avant
substitution — et un **autre message**. Un tri écrit sur « cannot be parsed » la manque,
et c'est précisément par là qu'une quatrième entrerait sans se faire voir.

**Un seul mécanisme, mesuré par son rapport** : 95 plaintes pour **3 084 trous** et 2 462
noms distincts — donc **au plus 3 %** des trous atteignent un attribut que le navigateur
type-vérifie. C'est ce qui vérifie l'hypothèse par le compte et non par la forme.

### Le problème n'était pas le bruit, et le poser ainsi menait au mauvais correctif

La première formulation était « faire taire les quatre-vingt-quinze ». C'est le mauvais
bout, et c'est l'utilisateur qui l'a retourné : la console est un canal de développeur,
les messages ne coûtent rien à personne. **Ce qu'ils coûtent, c'est la capacité de voir
le quatre-vingt-seizième** — et ça ne se répare pas en supprimant les quatre-vingt-quinze.

> **Ça se répare en donnant le canal à une garde plutôt qu'à un œil.** Un fond que
> personne ne peut lire n'est pas un défaut d'hygiène, c'est un instrument débranché ; et
> un instrument se rebranche sans qu'on touche à ce qu'il mesure.

C'est la famille de « ce qui coûte, c'est ce qui arrête de chercher », prise à l'envers :
là, une forme rassurante faisait cesser l'enquête ; ici, un fond illisible la rend
impossible. Le remède est le même — *rendre décidable*, pas rendre silencieux.

**Aucun correctif n'a donc été posé, et c'est le résultat.** `support.js` n'est pas
touché, le gate `window.__resources` reste ce qu'il est — documenté au chapitre de la
page blanche —, et le gabarit continue d'être analysé par le navigateur. Ce qui change
est qu'on le saura si ça produit autre chose.

### La garde est un REGISTRE de formes, et elle échoue dans les deux sens

`scripts/app/console-au-chargement.test.mjs` capture la console d'un vrai navigateur sur
le fichier livré, tous canaux — `console`, `pageerror`, `requestfailed`.

| la moitié | ce qu'elle attrape | mutation qui la fait mordre |
|---|---|---|
| tout message tombe dans une classe **déclarée** | une forme INÉDITE, citée en toutes lettres | un message injecté au chargement → rouge, message cité |
| toute classe déclarée compte **au moins une** occurrence | une classe MORTE, qui laisserait la garde verte sur du vide | une classe qui ne décrit rien → rouge, classe nommée |

C'est la forme de `boucles-mql5` et du registre de `nom-vuna` : sans la seconde moitié,
le registre devient une liste de tolérances — et surtout, **c'est elle qui est la PRISE**.
Une page qui n'émettrait plus rien du tout satisferait la première sans rien prouver.

**RETIRER une classe fait rougir la PREMIÈRE moitié, pas la seconde**, et la mutation le
dit plutôt que l'inverse : ses messages deviennent orphelins et sont cités
(`"{{ fenDu }}" does not conform…`). La seconde moitié parle quand la FORME disparaît de
la page pendant que sa classe reste. Les deux sont couvertes, par des moitiés opposées.

**`pageerror` reste à zéro, sans classe possible.** Une exception dans un producteur
efface la page entière — `renderVals()` est une seule fonction. Il n'y a pas de forme
acceptable pour ça, donc pas de tolérance à écrire.

**Les comptes ne sont pas assertés** (règle 16) : 47 / 46 / 2 / 3 sont IMPRIMÉS, jamais
exigés. Les figer ferait rougir la garde au premier trou ajouté à un attribut SVG — un
faux refus sur le cas normal, donc une garde qu'on désactive.

### Une classe de tolérance écrite sur la FORME avale le défaut de même forme

**PROVENANCE · la question est de l'utilisateur, la réponse RELUE puis MESURÉE DANS LE
DÉPÔT.** Elle tenait en une ligne : la classe A est-elle reconnue sur la forme du
message — `Error: <line> attribute y1: Expected length` — ou sur la forme **et** sa
valeur, c'est-à-dire la présence littérale de `{{` ?

**C'est la seconde, et le prédicat le porte** (`&& m.texte.includes("{{")`, aux trois
classes de trou). Si c'était la première, un vrai défaut — un calcul de creux rendant
`NaN` — aurait produit `Expected length, "NaN"`, serait tombé dans la classe A, compté au
vert, et se serait noyé dans les quarante-sept.

> **Une garde qui tolère par la FORME certifie le bruit au lieu de le surveiller**, et
> c'est pire que pas de garde : un fond non surveillé laisse au moins le doute, un fond
> certifié le retire. C'est la famille de *ce qui coûte, c'est ce qui arrête de chercher*,
> appliquée à une ligne de base.

**ET LA LECTURE NE SUFFISAIT PAS À LE DIRE, ce qui est la moitié qui s'ajoute au
dépôt.** J'avais la réponse en relisant mon propre prédicat — c'est un CONSTAT, et le
fichier écrit ailleurs qu'*un constat dit où l'on en est ; une garde dit ce qui ne pourra
plus arriver*. La troisième mutation injecte donc le défaut lui-même, par
`VUNA_CONSOLE_MUT_JS` : un `setAttribute('y1','NaN')` au chargement. Mesuré — la garde
rougit en citant `Error: <line> attribute y1: Expected length, "NaN".`, et **le compte de
la classe A reste à 47**. Le message n'a pas été absorbé ; sans le `{{`, il aurait compté
48 et la suite serait restée verte.

**Et c'est aussi la réponse au choix de ne pas figer les comptes.** Non figés, ils
laisseraient un désancrage partiel invisible — le défaut du chapitre de la prise qui ne
compte que « pas zéro ». Ce qui tient ici n'est pas le compte : c'est que la VALEUR
fautive fasse partie du prédicat, donc qu'un message de même forme et d'autre valeur ne
puisse pas entrer. *Une tolérance se borne par ce qu'elle décrit, jamais par combien de
fois elle le voit.*

**La classe D porte SA CONDITION, et elle est étroite exprès.** Sous `file://` le
manifeste est refusé, et le navigateur en tire trois lignes pour un fait — dont une,
« Failed to load resource », ne nomme rien. L'accepter sans condition ferait de cette
classe un trou qui avalerait n'importe quel échec réseau futur : elle n'est donc admise
que si un échec **nommément sur le manifeste** a été vu dans la même capture.

**Son angle mort est en tête** : elle charge en `file://`, comme les trois autres bancs
de rendu, donc un message qui n'apparaîtrait que sous HTTP lui échappe. Le choix est
déclaré plutôt que tu — c'était l'alternative posée, et le silence était la seule issue
indéfendable.

### Et la mutation la plus isolante du dépôt ne touche aucun fichier

Elle s'injecte à l'exécution — `addInitScript` sous une variable d'environnement — donc
elle ne peut rien emporter à la restauration. C'est la règle 13 prise par le bout où le
problème n'existe pas : *une mutation qui ne modifie aucun fichier n'a pas de
restauration à rater.* Là où c'est possible, c'est la forme à préférer.


### Et j'ai relu un artefact BASE64 au grep, puis rapporté une absence

`grep PlafondResist Vuna.solo.html` rend **0**, et j'en ai conclu que le générateur était
chargé depuis un fichier voisin — donc qu'un utilisateur hors ligne ne pouvait pas
exporter le robot livré. **C'était faux.** `solo.mjs` encode `robot-mt5.js` en base64 et
le sert par une Blob URL ; décodé, le bloc de 186 188 caractères porte `PlafondResist`
trois fois. L'artefact se suffit, l'export hors ligne marche, le port est atteignable.

> **C'est la règle de la greppabilité, commise par son auteur, sur l'artefact qu'elle
> protège.** J'avais écrit la veille qu'une garde vérifie ce qui est ÉMIS et une personne
> ce qui est ÉCRIT — puis j'ai lu de l'écrit encodé et rapporté ce que l'œil ne voyait
> pas. *Un grep qui ne trouve rien ressemble à un grep qui trouve zéro*, et cette
> phrase-là était déjà dans le fichier.

Le geste est celui du chapitre parent, appliqué à soi : **avant de rapporter une absence,
demander sous quelle forme la chose serait présente.** Un artefact n'est pas un source, et
ce dépôt en produit trois — le solo, `dist/app/index.html`, et le `.ex5` que l'utilisateur
compile.

### Une mutation qui se défait par une chaîne VIDE ne se défait pas

Le harnais de mutation de cette séance a **supprimé le correctif de `W1` et ne l'a pas
restauré** : l'échange aller passait une chaîne vide en remplacement, et l'échange inverse
comptait alors les occurrences de `""` — 146 025 sur `moteur.js`, donc un refus, donc
aucune restauration. Le fichier est resté amputé.

> **La règle 13 dit qu'une mutation se défait par le mécanisme qui l'a faite. Elle ne dit
> pas que ce mécanisme sait le faire.** Un échange dont l'un des deux côtés est vide n'est
> pas réversible par comptage : la chaîne vide est partout, donc son compte ne vaut rien.

Ce qui l'a attrapé n'est pas le harnais — il avait signalé son refus, et le refus portait
sur la RESTAURATION, pas sur l'aller. C'est d'avoir relu le fichier avant de conclure.
*Une mutation se vérifie sur le disque, comme une affirmation* : la règle 5 s'applique à
son propre outillage. La forme sûre est celle que ce fichier prescrivait déjà — un
échange marqué, jamais une suppression.

### Un mécanisme de remplacement rend un compte de SUCCÈS — et ça se vérifie sur le fichier

Deux incidents en deux livraisons, et c'est le même énoncé lu dans deux directions :

| l'incident | ce que l'outil a rapporté | ce qu'il n'a pas rapporté |
|---|---|---|
| quatre surfaces annoncées pour **cinq** | quatre remplacements faits | la surface qu'il n'a pas **trouvée** |
| le correctif `W1` **supprimé et non restauré** | un refus sur la restauration | que l'aller, lui, avait **écrit** |

> **Un compte de succès ne mesure ni les absences ni les demi-opérations.** Une
> substitution rapporte ce qu'elle a touché ; ce qui manque n'a pas de ligne dans son
> compte rendu, et une opération défaite à moitié y ressemble à une opération refusée.

**Le complément de la règle 13 est donc celui-ci** : une mutation se défait par le
mécanisme qui l'a faite — *et l'état se vérifie sur le FICHIER, jamais sur le compte rendu
de l'outil.* C'est ce qui a rattrapé le second incident, et ça mérite d'être la règle
plutôt que le réflexe : la règle 5 s'applique à son propre outillage.

**Le cas mécanique, pour qu'il ne se reproduise pas** : un échange dont l'un des deux
côtés est la chaîne VIDE n'est pas réversible par comptage — la chaîne vide est partout,
donc son compte ne vaut rien (146 025 sur `moteur.js`). La forme sûre est celle que ce
fichier prescrivait déjà : un échange **marqué**, jamais une suppression.

### Chercher une chaîne dans une représentation qui ne la contient pas

**PROVENANCE · commise des DEUX CÔTÉS, à deux jours d'écart, chacun sur le terrain de
l'autre.** L'utilisateur a grepé un artefact dont les octets étaient **échappés** et
conclu qu'une phrase manquait ; j'ai grepé un artefact dont un bloc était en **base64** et
conclu que le générateur était absent — donc qu'un utilisateur hors ligne ne pouvait pas
exporter le robot livré. Les deux absences étaient fausses.

> **Une vérification qui ne trouve rien doit prouver qu'elle regardait au bon endroit.**
> Un grep qui rend zéro et un grep qui ne peut pas voir rendent le même chiffre — et
> c'est celui qui rassure.

Le patron existe déjà dans le dépôt et il se transporte tel quel : la garde de la marque
exige d'avoir VU la marque neuve avant de conclure à l'absence de l'ancienne ; celle des
libellés exige de voir la formule neuve ; celle des unités exige quatre unités découvertes.
*Une prise avant le verdict, du côté de la garde comme du côté du rapport.*

**Le geste, pour un rapport** : avant de rapporter une absence, demander **sous quelle
forme la chose serait présente**. Ce dépôt produit trois artefacts qui ne sont pas des
sources — le solo (base64 pour les modules), `dist/app/index.html`, et le `.ex5` que
l'utilisateur compile. Aucun des trois ne se lit au grep comme du code.
