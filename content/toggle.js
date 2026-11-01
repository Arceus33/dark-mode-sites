// Le CSS sombre est actif par défaut (pas de flash blanc au chargement).
// Ce script pose deux classes sur <html> :
// - dms-off : le site a été désactivé dans la fenêtre de l'extension ;
// - dms-native : la page est déjà sombre, l'inverser la rendrait claire.
(() => {
  // Iframe about:blank (ex. description d'un article Amazon) : site de la page parente
  const host = location.hostname || new URL(location.ancestorOrigins?.[0] || "http://_").hostname;
  const site = dmsSiteForHost(host);
  if (!site) return;
  const root = document.documentElement;

  const applySetting = (disabled) => {
    root.classList.toggle("dms-off", Boolean(disabled[site.id]));
    if (site.bodyClass) applyBodyClass();
  };
  chrome.storage.sync.get({ disabled: {} }, ({ disabled }) => applySetting(disabled));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.disabled) applySetting(changes.disabled.newValue || {});
  });

  // --- Site avec son propre thème sombre : on l'active, sans inversion ---

  function applyBodyClass() {
    const body = document.body;
    if (!body) return;
    const { from, to } = site.bodyClass;
    const on = !root.classList.contains("dms-off");
    // Ne touche à rien si le site a déjà la bonne classe (évite une boucle avec l'observateur)
    if (body.classList.contains(on ? to : from) && !body.classList.contains(on ? from : to)) return;
    body.classList.toggle(from, !on);
    body.classList.toggle(to, on);
  }

  if (site.bodyClass) {
    root.classList.add("dms-native");
    // <body> n'existe pas encore à document_start ; le site peut aussi remettre sa classe
    new MutationObserver(applyBodyClass).observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    applyBodyClass();
    return;
  }

  // --- Détection d'une page déjà sombre ---

  const MEDIA = new Set(["IMG", "VIDEO", "CANVAS", "IFRAME", "PICTURE", "SVG", "EMBED", "OBJECT"]);

  // Couleur de fond réellement visible sous un élément : premier ancêtre au fond opaque.
  const backgroundUnder = (el) => {
    for (; el; el = el.parentElement) {
      const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
      if (m && (m[3] === undefined || Number(m[3]) >= 0.5)) return m.slice(0, 3).map(Number);
    }
    return [255, 255, 255]; // fond par défaut du navigateur
  };

  const luminance = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Échantillonne une grille de points ; les zones de vidéo ou d'image ne votent pas.
  const pageIsDark = () => {
    if (!document.body) return null;
    const hadOff = root.classList.contains("dms-off");
    // Mesure sans le fond blanc forcé par dark.css (aucun rendu entre les deux lignes)
    root.classList.add("dms-off");
    let dark = 0;
    let light = 0;
    for (const fx of [0.2, 0.5, 0.8]) {
      for (const fy of [0.2, 0.5, 0.8]) {
        const el = document.elementFromPoint(innerWidth * fx, innerHeight * fy);
        if (!el || MEDIA.has(el.tagName.toUpperCase())) continue;
        if (luminance(backgroundUnder(el)) < 0.4) dark++;
        else light++;
      }
    }
    if (!hadOff) root.classList.remove("dms-off");
    return dark + light === 0 ? null : dark > light;
  };

  const check = () => {
    const dark = pageIsDark();
    if (dark !== null) root.classList.toggle("dms-native", dark);
  };

  // Plusieurs mesures après le chargement : les pages en JavaScript se construisent tard.
  const checkSoon = () => [0, 500, 1500, 3000].forEach((ms) => setTimeout(check, ms));
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkSoon, { once: true });
  } else {
    checkSoon();
  }

  // Navigation interne sans rechargement (eBay Live, pages en JavaScript)
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      checkSoon();
    }
  }, 1000);
})();
