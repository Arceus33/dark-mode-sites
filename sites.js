// Liste des sites pris en charge, partagée par le script de page et la fenêtre de l'extension.
// Pour ajouter un site : une entrée ici, ses domaines dans manifest.json (matches)
// et, si besoin, un fichier content/sites/<id>.css.
// bodyClass : le site a son propre thème sombre, activé en remplaçant une classe de <body>
// (pas d'inversion des couleurs).
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
];

function dmsSiteForHost(hostname) {
  return (
    DMS_SITES.find((site) =>
      site.domains.some((d) => hostname === d || hostname.endsWith("." + d))
    ) || null
  );
}
