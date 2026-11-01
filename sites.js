// Liste des sites pris en charge, partagée par le script de page et la fenêtre de l'extension.
// Pour ajouter un site : une entrée ici, ses domaines dans manifest.json (matches)
// et, si besoin, un fichier content/sites/<id>.css.
const DMS_SITES = [
  { id: "ebay", name: "eBay", domains: ["ebay.fr", "ebay.com", "ebaydesc.com"] },
];

function dmsSiteForHost(hostname) {
  return (
    DMS_SITES.find((site) =>
      site.domains.some((d) => hostname === d || hostname.endsWith("." + d))
    ) || null
  );
}
