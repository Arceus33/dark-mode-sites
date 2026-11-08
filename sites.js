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
const DMS_SITES = [
  { id: "ebay", name: "eBay", domains: ["ebay.fr", "ebay.com", "ebaydesc.com"] },
  {
    id: "amazon",
    name: "Amazon",
    domains: ["amazon.fr", "amazon.com", "amazon.de", "amazon.co.uk", "amazon.it", "amazon.es", "amazon.ca", "amazon.com.be", "amazon.nl"],
    // Bandeau sombre en temps normal, clair avec certains comptes Amazon Business
    lightZones: { "dms-light-navbar": "#nav-belt" },
  },
  {
    id: "voir-anime",
    name: "Voir Anime",
    domains: ["voir-anime.to"],
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
    // Page faite d'illustrations, que l'inversion laissait claires
    custom: true,
  },
  { id: "ameli", name: "ameli", domains: ["assure.ameli.fr"] },
  {
    id: "boursobank",
    name: "BoursoBank",
    domains: ["clients.boursobank.com"],
    // Bleu nuit autour d'une fenêtre blanche : la page passait pour déjà sombre
    detect: false,
  },
  // Connexion dans une iframe de www.icgauth.caisse-epargne.fr
  { id: "caisse-epargne", name: "Caisse d'Épargne", domains: ["caisse-epargne.fr"] },
  { id: "riot-merch", name: "Boutique Riot Games", domains: ["merch.riotgames.com"] },
  // Site public (www) et espace assuré (assure)
  { id: "vivinter", name: "Vivinter", domains: ["vivinter.fr"] },
];

// Site sans inversion : thème sombre du site ou écrit à la main
const dmsHasOwnTheme = (site) => Boolean(site.bodyClass || site.htmlAttr || site.custom);

function dmsSiteForHost(hostname) {
  return (
    DMS_SITES.find((site) =>
      site.domains.some((d) => hostname === d || hostname.endsWith("." + d))
    ) || null
  );
}
