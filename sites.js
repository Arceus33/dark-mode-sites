// Liste des sites pris en charge, partagée par le script de page et la fenêtre de l'extension.
// Pour ajouter un site : une entrée ici, ses domaines dans manifest.json (matches)
// et, si besoin, un fichier content/sites/<id>.css.
// Le site a son propre thème sombre (pas d'inversion des couleurs), activé par :
// - bodyClass : le remplacement d'une classe de <body> ;
// - htmlAttr : un attribut posé sur <html>.
const DMS_SITES = [
  { id: "ebay", name: "eBay", domains: ["ebay.fr", "ebay.com", "ebaydesc.com"] },
  {
    id: "amazon",
    name: "Amazon",
    domains: ["amazon.fr", "amazon.com", "amazon.de", "amazon.co.uk", "amazon.it", "amazon.es", "amazon.ca", "amazon.com.be", "amazon.nl"],
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
];

const dmsHasOwnTheme = (site) => Boolean(site.bodyClass || site.htmlAttr);

function dmsSiteForHost(hostname) {
  return (
    DMS_SITES.find((site) =>
      site.domains.some((d) => hostname === d || hostname.endsWith("." + d))
    ) || null
  );
}
