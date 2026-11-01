# Dark Mode Sites

Extension Chrome qui applique un mode sombre sur mesure à une liste de sites.
Sites pris en charge : **eBay** (`ebay.fr`, `ebay.com`).

## Installation

1. Ouvrir `chrome://extensions`.
2. Activer le **Mode développeur** (en haut à droite).
3. Cliquer sur **Charger l'extension non empaquetée** et choisir ce dossier.
4. Épingler l'extension (icône puzzle) pour accéder au bouton marche/arrêt.

Après une modification des fichiers : bouton ⟳ de l'extension dans `chrome://extensions`, puis recharger l'onglet.

## Fonctionnement

- `content/dark.css` : inverse les couleurs de la page (clair → sombre) et ré-inverse images, vidéos et iframes pour garder leurs vraies couleurs. Actif dès le chargement, sans flash blanc.
- `content/sites/<site>.css` : retouches propres à un site (ex. logo eBay en couleurs).
- `content/toggle.js` : ajoute la classe `dms-off` sur `<html>` quand le site est désactivé, et `dms-native` quand la page est déjà sombre (l'inversion la rendrait claire). Il agit aussi dans les iframes des sites pris en charge, par exemple la description des annonces eBay (`ebaydesc.com`).
- Règles CSS de site : toujours préfixées par `html:not(.dms-off, .dms-native)`.
- `popup/` : fenêtre de l'extension, interrupteur par site (mémorisé et synchronisé avec votre compte Chrome).

## Ajouter un site

1. `sites.js` : ajouter `{ id, name, domains }`.
2. `manifest.json` : copier le bloc de `content_scripts` d'eBay, y mettre les domaines du site dans `matches` et son CSS dans `css`.
3. Si besoin, créer `content/sites/<id>.css` avec des règles préfixées par `html:not(.dms-off, .dms-native)`.
