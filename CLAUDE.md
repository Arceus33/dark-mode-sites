# Dark Mode Sites : règles propres

Extension de navigateur (Manifest V3, Chrome, Opera GX, Firefox) qui applique un mode sombre sur mesure à une liste de sites. Liste des sites, installation et fonctionnement : `README.md`. Règles communes : `../CLAUDE.md`.

- **Un lien donné = tout le site** : domaine entier et sous-domaines (`*://*.domaine/*`), jamais une seule page.
- **Ajouter un site** : `sites.js` (`{ id, name, domains }`, et `bodyClass`, `htmlAttr` ou `custom: true` selon le cas), bloc `content_scripts` dans `manifest.json` (sur le modèle d'eBay), CSS propre au site dans `content/sites/<id>.css`. Règles CSS toujours préfixées `html:not(.dms-off, .dms-native)` (`html:not(.dms-off)` pour un thème `custom`). Mettre à jour la liste du `README.md`.
- **Mécanique** : `content/dark.css` inverse la page et ré-inverse images, vidéos, iframes ; `content/toggle.js` pose `dms-off` (site désactivé) et `dms-native` (page déjà sombre), y compris dans les iframes des sites pris en charge ; `popup/` = interrupteur par site, synchronisé avec le compte du navigateur.
- **Pages fournies pour analyse** (pages enregistrées, captures) : les supprimer dès le problème réglé, sans qu'on le demande.
- **Firefox** : figé en 0.2.0 (`.xpi` signé installé). Les mises à jour se font sur Chrome et Opera seulement ; ne pas proposer de re-signer (`sign-firefox.ps1` reste disponible : toute nouvelle signature exige d'augmenter `version`).
- **Vérification** : recharger l'extension (bouton de la fenêtre ou ⟳ dans `chrome://extensions`) puis l'onglet ; contrôler la page en sombre et après désactivation du site.
- **Commits** : portée = le site (`type(site): description`, ex. `fix(amazon): …`, `feat(gifteo): …`).
