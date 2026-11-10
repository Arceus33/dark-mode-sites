# Dark Mode Sites

Extension Chrome qui applique un mode sombre sur mesure à une liste de sites.
Sites pris en charge : **eBay** (`ebay.fr`, `ebay.com`), **Amazon** (`amazon.fr`, `.com`, `.de`, `.co.uk`, `.it`, `.es`, `.ca`, `.com.be`, `.nl`), **Voir Anime** (`voir-anime.to`), **Vinted** (`vinted.fr`, `.com`, `.be`, `.de`, `.es`, `.it`, `.co.uk` et les autres pays), **HoYoLAB** (`hoyolab.com`, thème sur mesure pour la connexion quotidienne), **ameli** (`ameli.fr`), **BoursoBank** (`boursobank.com`), **Caisse d'Épargne** (`caisse-epargne.fr`), **Riot Games** (`riotgames.com`, dont la boutique `merch.riotgames.com`), **Vivinter** (`www.vivinter.fr` et l'espace assuré `assure.vivinter.fr`), **Google Drive** (`drive.google.com`), **Gan Assurances** (`gan.fr` et `ganassurances.fr`), **La Poste** (`laposte.fr`, dont le suivi des envois et l'espace client).

## Installation

1. Ouvrir `chrome://extensions`.
2. Activer le **Mode développeur** (en haut à droite).
3. Cliquer sur **Charger l'extension non empaquetée** et choisir ce dossier.
4. Épingler l'extension (icône puzzle) pour accéder au bouton marche/arrêt.

Après une modification des fichiers : bouton **Recharger l'extension** dans la fenêtre de l'extension (il recharge aussi l'onglet en cours), ou bouton ⟳ dans `chrome://extensions` puis recharger l'onglet.

### Firefox

1. Ouvrir `about:debugging#/runtime/this-firefox`.
2. Cliquer sur **Charger un module complémentaire temporaire…** et choisir `manifest.json` dans ce dossier.

L'extension reste installée jusqu'à la fermeture de Firefox. Si un site reste clair, cliquer sur l'icône puzzle de la barre d'outils et autoriser l'extension sur ce site.

**Installation permanente** (Firefox habituel) : l'extension doit être signée par Mozilla, en canal privé (rien n'est publié sur la boutique).

1. Créer un compte sur addons.mozilla.org, puis une clé sur https://addons.mozilla.org/fr/developers/addon/api/key/.
2. Dans ce dossier : `powershell -ExecutionPolicy Bypass -File .\sign-firefox.ps1`. Le script demande l'émetteur et le secret JWT ; le fichier signé arrive dans `web-ext-artifacts\`.
3. Firefox : `about:addons` > roue dentée > **Installer un module depuis un fichier…** > le `.xpi`.

Chaque nouvelle signature demande d'augmenter `version` dans `manifest.json`.

## Fonctionnement

- `content/dark.css` : inverse les couleurs de la page (clair → sombre) et ré-inverse images, vidéos et iframes pour garder leurs vraies couleurs. Actif dès le chargement, sans flash blanc.
- `content/sites/<site>.css` : retouches propres à un site (ex. logo eBay en couleurs).
- `content/toggle.js` : ajoute la classe `dms-off` sur `<html>` quand le site est désactivé, et `dms-native` quand la page est déjà sombre (l'inversion la rendrait claire). Il agit aussi dans les iframes des sites pris en charge, par exemple la description des annonces eBay (`ebaydesc.com`).
- Règles CSS de site : toujours préfixées par `html:not(.dms-off, .dms-native)`.
- `icons/` : icône de l'extension. `icon.svg` (grandes tailles) et `icon-16.svg` (barre d'outils, simplifiée) sont les sources ; les PNG en sont tirés.
- `popup/` : fenêtre de l'extension, interrupteur par site (mémorisé et synchronisé avec votre compte Chrome).

## Ajouter un site

1. `sites.js` : ajouter `{ id, name, domains }`. Si le site a déjà son propre thème sombre activé par une classe de `<body>`, ajouter `bodyClass: { from, to }` : l'extension active ce thème au lieu d'inverser la page (cas de voir-anime, thème Madara). S'il s'active par un attribut de `<html>`, ajouter `htmlAttr: { name, value }` (cas de Vinted, `data-theme="dark"`). Si l'inversion rend mal (page faite d'illustrations), ajouter `custom: true` et écrire le thème à la main dans `content/sites/<id>.css`, règles préfixées par `html:not(.dms-off)` (cas de HoYoLAB).
2. `manifest.json` : copier le bloc de `content_scripts` d'eBay, y mettre les domaines du site dans `matches` et son CSS dans `css`.
3. Si besoin, créer `content/sites/<id>.css` avec des règles préfixées par `html:not(.dms-off, .dms-native)`.
