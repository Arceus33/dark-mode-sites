# Dark Mode Sites

Extension Chrome qui applique un mode sombre sur mesure à une liste de sites.
Sites pris en charge : **eBay** (`ebay.fr`, `ebay.com`), **Amazon** (`amazon.fr`, `.com`, `.de`, `.co.uk`, `.it`, `.es`, `.ca`, `.com.be`, `.nl`), **Voir Anime** (`voir-anime.to`), **Vinted** (`vinted.fr`, `.com`, `.be`, `.de`, `.es`, `.it`, `.co.uk` et les autres pays), **HoYoLAB** (page de connexion quotidienne, `act.hoyolab.com`), **ameli** (compte assuré, `assure.ameli.fr`), **BoursoBank** (espace client, `clients.boursobank.com`), **Caisse d'Épargne** (`caisse-epargne.fr`), **Boutique Riot Games** (`merch.riotgames.com`), **Vivinter** (`www.vivinter.fr` et l'espace assuré `assure.vivinter.fr`).

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
