# Dark Mode Sites : règles de travail

Extension de navigateur (Manifest V3, Chrome, Opera GX, Firefox) qui applique un mode sombre sur mesure à une liste de sites. Liste des sites, installation et fonctionnement : `README.md`.

- **Première action de chaque session** : lire `session-checkpoint.yaml` (racine, hors git) s'il existe et suivre son `INSTRUCTION`. « fin session » ou « fin de session » : le réécrire à jour, sans demander.
- **Langue** : commentaires, README et commits en français.
- **Un lien donné = tout le site** : domaine entier et sous-domaines (`*://*.domaine/*`), jamais une seule page.
- **Ajouter un site** : `sites.js` (`{ id, name, domains }`, et `bodyClass`, `htmlAttr` ou `custom: true` selon le cas), bloc `content_scripts` dans `manifest.json` (sur le modèle d'eBay), CSS propre au site dans `content/sites/<id>.css`. Règles CSS toujours préfixées `html:not(.dms-off, .dms-native)` (`html:not(.dms-off)` pour un thème `custom`). Mettre à jour la liste du `README.md`.
- **Mécanique** : `content/dark.css` inverse la page et ré-inverse images, vidéos, iframes ; `content/toggle.js` pose `dms-off` (site désactivé) et `dms-native` (page déjà sombre), y compris dans les iframes des sites pris en charge ; `popup/` = interrupteur par site, synchronisé avec le compte du navigateur.
- **Pages fournies pour analyse** (pages enregistrées, captures) : les supprimer dès le problème réglé, sans qu'on le demande.
- **Firefox** : figé en 0.2.0 (`.xpi` signé installé). Les mises à jour se font sur Chrome et Opera seulement ; ne pas proposer de re-signer (`sign-firefox.ps1` reste disponible : toute nouvelle signature exige d'augmenter `version`).
- **Vérification** : recharger l'extension (bouton de la fenêtre ou ⟳ dans `chrome://extensions`) puis l'onglet ; contrôler la page en sombre et après désactivation du site.
- **Commits** : Conventional Commits en français (`type(site): description`, ex. `fix(amazon): …`, `feat(gifteo): …`), un thème par commit.

## Économie de sortie (strict)

### Réponses
- Pas d'introduction, pas de reformulation de la demande, pas de « Bien sûr / Avec plaisir », pas de formule de fin ni de proposition d'aide.
- Pas de récapitulatif de ce que tu viens de faire, sauf si on te le demande. Termine par : résultat + blocages éventuels. Rien d'autre.
- Densité maximale : phrases courtes, style télégraphique accepté, listes plutôt que prose. Supprime les mots de remplissage.
- N'explique pas ce que l'utilisateur sait évidemment. Explique seulement les décisions non évidentes, en une ligne.
- Ne recopie pas dans le chat le code écrit ou les fichiers lus. Cite-les avec chemin:ligne.

### Outils (contexte = coût)
- Cherche avant de lire : grep/glob d'abord, puis lis seulement la plage utile (offset/limit).
- Ne relis jamais un fichier déjà lu ou que tu viens de modifier.
- Fais des modifications ciblées (Edit). Ne réécris jamais un fichier entier quand un diff suffit.
- Tronque les commandes bavardes : `| tail -n 30`, `| head`, `--quiet`, `-q`. N'affiche jamais en entier les logs, les lockfiles, les sorties de build ni le contenu de node_modules.
- Lance seulement les tests concernés, pas toute la suite, sauf demande.
- Regroupe les appels d'outils indépendants dans un même tour.
- Pas de sous-agents sans demande explicite.
- Pas d'exploration au hasard : si la cible est claire, vas-y directement.

### Demander ou agir
- Ne demande pas la permission pour les étapes évidentes et réversibles : fais-les.
- Demande seulement si tu es bloqué ou si un choix est coûteux ou irréversible : une question concise, avec les options.
- Pas de plan pour les petites tâches : exécute.

### L'honnêteté reste
- La concision ne passe jamais avant l'exactitude : signale toujours les bugs, les risques, les tests en échec et les incertitudes, en une ligne.
