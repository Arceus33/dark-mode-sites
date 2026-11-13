// Liste des sites pris en charge, partagée par le script de page et la fenêtre de l'extension.
// Pour ajouter un site : une entrée ici, ses domaines dans manifest.json (matches)
// et, si besoin, un fichier content/sites/<id>.css.
// Le site a son propre thème sombre (pas d'inversion des couleurs), activé par :
// - bodyClass : le remplacement d'une classe de <body> ;
// - htmlAttr : un attribut posé sur <html>.
// lightZones : { classe: sélecteur } ; la classe est posée sur <html> quand la zone est claire
// d'origine (couleur qui varie selon le compte, ex. bandeau d'Amazon Business).
// custom : pas d'inversion non plus, le thème est écrit à la main dans content/sites/<id>.css
// (règles préfixées par html:not(.dms-off)).
// detect: false : pas de détection des pages déjà sombres (le site ne l'est jamais et la trompe).
// paths : seulement les pages dont le chemin commence ainsi (mêmes chemins dans manifest.json) ;
// sert à donner un traitement à part à une page, le reste du site ayant sa propre entrée.
const DMS_SITES = [
  { id: "ebay", name: "eBay", domains: ["ebay.fr", "ebay.com", "ebaydesc.com"] },
  {
    id: "amazon",
    name: "Amazon",
    domains: ["amazon.fr", "amazon.com", "amazon.de", "amazon.co.uk", "amazon.it", "amazon.es", "amazon.ca", "amazon.com.be", "amazon.nl"],
    // Bandeau sombre en temps normal, clair avec certains comptes Amazon Business
    lightZones: { "dms-light-navbar": "#nav-belt" },
    // Bandeau marine et grand carrousel de l'accueil : la page passait parfois pour déjà
    // sombre et restait blanche (ou flashait). Amazon n'a pas de thème sombre.
    detect: false,
  },
  {
    id: "voir-anime",
    name: "Voir Anime",
    // Miroirs du site sous plusieurs noms et extensions (même thème Madara)
    domains: [
      "voir-anime.to", "voir-anime.cx", "voir-anime.com", "voir-anime.net", "voir-anime.org", "voir-anime.fr",
      "voir-anime.tv", "voir-anime.cc", "voir-anime.io", "voir-anime.me", "voir-anime.ws", "voir-anime.bz",
      "voir-anime.pro", "voir-anime.lol", "voir-anime.watch", "voir-anime.site", "voir-anime.online", "voiranime.to",
      "voiranime.cx", "voiranime.com", "voiranime.net", "voiranime.org", "voiranime.fr", "voiranime.tv",
      "voiranime.cc", "voiranime.io", "voiranime.me", "voiranime.ws", "voiranime.bz", "voiranime.pro",
      "voiranime.lol", "voiranime.watch", "voiranime.site", "voiranime.online",
    ],
    // Thème WordPress Madara : text-ui-light = texte clair sur fond sombre
    bodyClass: { from: "text-ui-dark", to: "text-ui-light" },
  },
  {
    id: "vinted",
    name: "Vinted",
    domains: [
      "vinted.fr", "vinted.com", "vinted.be", "vinted.lu", "vinted.nl", "vinted.de", "vinted.at", "vinted.es",
      "vinted.it", "vinted.pt", "vinted.co.uk", "vinted.ie", "vinted.pl", "vinted.cz", "vinted.sk", "vinted.lt",
      "vinted.hu", "vinted.ro", "vinted.hr", "vinted.gr", "vinted.se", "vinted.fi", "vinted.dk",
    ],
    // Thème sombre complet dans le CSS de Vinted, mais pas proposé sur le site web
    htmlAttr: { name: "data-theme", value: "dark" },
  },
  {
    id: "hoyolab",
    name: "HoYoLAB (connexion quotidienne)",
    domains: ["act.hoyolab.com"],
    paths: ["/bbs/event/signin/"],
    // Page faite d'illustrations, que l'inversion laissait claires
    custom: true,
  },
  // Reste de HoYoLAB : inversion (après l'entrée de la connexion quotidienne, cherchée en premier)
  { id: "hoyolab-site", name: "HoYoLAB", domains: ["hoyolab.com"] },
  { id: "ameli", name: "ameli", domains: ["ameli.fr"] },
  {
    id: "boursobank",
    name: "BoursoBank",
    domains: ["boursobank.com"],
    // Bleu nuit autour d'une fenêtre blanche : la page passait pour déjà sombre
    detect: false,
  },
  // Connexion dans une iframe de www.icgauth.caisse-epargne.fr
  { id: "caisse-epargne", name: "Caisse d'Épargne", domains: ["caisse-epargne.fr"] },
  // Retouches de content/sites/riot-merch.css sur la boutique (merch) seulement
  { id: "riot-merch", name: "Riot Games", domains: ["riotgames.com"] },
  // Site public (www) et espace assuré (assure)
  { id: "vivinter", name: "Vivinter", domains: ["vivinter.fr"] },
  { id: "google-drive", name: "Google Drive", domains: ["drive.google.com"] },
  // Site public (gan.fr), espace client et connexion (ganassurances.fr)
  { id: "gan", name: "Gan Assurances", domains: ["gan.fr", "ganassurances.fr"] },
  // Site public, suivi des envois et espace client
  { id: "laposte", name: "La Poste", domains: ["laposte.fr"] },
  // Interface d'administration de la Livebox Orange (réseau local)
  { id: "livebox", name: "Livebox", domains: ["192.168.1.1"] },
  // Images des annonces sur etsystatic.com : ré-inversées comme <img>
  { id: "etsy", name: "Etsy", domains: ["etsy.com", "etsy.me"] },
  // Gifteo : connexion (auth.gifteo.fr) et reste du site
  { id: "gifteo", name: "Gifteo", domains: ["gifteo.fr"] },
  // INPI : guichet unique des formalités d’entreprise et reste du site
  { id: "inpi", name: "INPI", domains: ["inpi.fr"] },
  // Darty : boutique, espace client et sous-domaines (darty.fr renvoie vers darty.com)
  // Grands visuels sombres de l'accueil : la page passait pour déjà sombre et restait
  // blanche. Darty n'a pas de thème sombre.
  { id: "darty", name: "Darty", domains: ["darty.com", "darty.fr"], detect: false },
  // Forum PPBO (PunBB) : inversion, avec retouches (cherché avant le reste du site)
  {
    id: "ppbo-forum",
    name: "PPBO (forum)",
    domains: ["ppbo.ws"],
    paths: ["/forum/"],
    // Bandeau illustré et fond orange : la page passait pour déjà sombre
    detect: false,
  },
  {
    id: "ppbo",
    name: "PPBO",
    domains: ["ppbo.ws"],
    // Site peint d'images de fond que l'inversion faussait
    custom: true,
  },
];

// Site sans inversion : thème sombre du site ou écrit à la main
const dmsHasOwnTheme = (site) => Boolean(site.bodyClass || site.htmlAttr || site.custom);

// pathname omis (iframe about:blank, chemin inconnu) : chemin non vérifié
function dmsSiteForHost(hostname, pathname) {
  return (
    DMS_SITES.find(
      (site) =>
        site.domains.some((d) => hostname === d || hostname.endsWith("." + d)) &&
        (pathname === undefined || !site.paths || site.paths.some((p) => pathname.startsWith(p)))
    ) || null
  );
}
