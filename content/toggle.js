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
  // « Toujours sombre » coché dans la fenêtre de l'extension : pas de détection
  let forced = false;

  const applySetting = ({ disabled, forced: forcedSites }) => {
    root.classList.toggle("dms-off", Boolean(disabled[site.id]));
    forced = Boolean(forcedSites[site.id]);
    if (dmsHasOwnTheme(site)) applyOwnTheme();
    else if (forced) root.classList.remove("dms-native");
  };
  const DEFAULTS = { disabled: {}, forced: {} };
  chrome.storage.sync.get(DEFAULTS, applySetting);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && (changes.disabled || changes.forced)) chrome.storage.sync.get(DEFAULTS, applySetting);
  });

  // État affiché par la fenêtre de l'extension (seule la page principale répond)
  if (window === top) {
    chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
      if (msg === "dms-state") reply({ native: root.classList.contains("dms-native") });
    });
  }

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

  // Attribut de <html> (ex. data-theme="dark" de Vinted), retiré quand le site est désactivé
  function applyHtmlAttr() {
    const { name, value } = site.htmlAttr;
    const on = !root.classList.contains("dms-off");
    // Ne touche à rien si l'attribut est déjà bon (évite une boucle avec l'observateur)
    if (on && root.getAttribute(name) !== value) root.setAttribute(name, value);
    else if (!on && root.getAttribute(name) === value) root.removeAttribute(name);
  }

  function applyOwnTheme() {
    if (site.bodyClass) applyBodyClass();
    if (site.htmlAttr) applyHtmlAttr();
  }

  if (dmsHasOwnTheme(site)) {
    root.classList.add("dms-native");
    if (site.bodyClass) {
      // <body> n'existe pas encore à document_start ; le site peut aussi remettre sa classe
      new MutationObserver(applyBodyClass).observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    if (site.htmlAttr) {
      // Le site peut réécrire l'attribut en affichant la page
      new MutationObserver(applyHtmlAttr).observe(root, { attributes: true, attributeFilter: [site.htmlAttr.name] });
    }
    applyOwnTheme();
    return;
  }

  // --- Détection d'une page déjà sombre ---

  const MEDIA = new Set(["IMG", "VIDEO", "CANVAS", "IFRAME", "PICTURE", "SVG", "EMBED", "OBJECT"]);

  // Voile posé sur la page quand un menu s'ouvre (ex. #nav-cover d'Amazon) :
  // grand bloc vide, sans texte ni contenu.
  const isBackdrop = (el) => {
    if (el === document.body || el === root || el.firstElementChild || el.textContent.trim()) return false;
    const r = el.getBoundingClientRect();
    return r.width * r.height > innerWidth * innerHeight * 0.5;
  };

  const isOverlay = (el) => Number(getComputedStyle(el).opacity) < 0.95 || isBackdrop(el);

  // Élément de la page visible en un point, sous les voiles et calques translucides
  // (sinon une page claire passerait pour sombre le temps d'un survol). Ce n'est pas
  // le parent du voile qui compte : celui d'Amazon est rangé dans le bandeau marine.
  const pageElementAt = (x, y) => document.elementsFromPoint(x, y).find((el) => !isOverlay(el));

  // Couleur de fond réellement visible sous un élément : premier ancêtre au fond opaque.
  const backgroundUnder = (el) => {
    for (; el; el = el.parentElement) {
      const cs = getComputedStyle(el);
      if (isOverlay(el)) continue;
      const m = cs.backgroundColor.match(/[\d.]+/g);
      if (m && (m[3] === undefined || Number(m[3]) >= 0.95)) return m.slice(0, 3).map(Number);
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
        const el = pageElementAt(innerWidth * fx, innerHeight * fy);
        if (!el || MEDIA.has(el.tagName.toUpperCase())) continue;
        if (luminance(backgroundUnder(el)) < 0.4) dark++;
        else light++;
      }
    }
    if (!hadOff) root.classList.remove("dms-off");
    return dark + light === 0 ? null : dark > light;
  };

  // Plusieurs mesures après le chargement : les pages en JavaScript se construisent tard
  // (eBay Live affiche d'abord une ébauche claire). Garde-fous contre un menu ouvert
  // pendant une mesure :
  // - « déjà sombre » seulement si deux mesures de suite le disent ;
  // - une page restée claire à la fin de la série le reste jusqu'au changement de page.
  const DELAYS = [0, 500, 1500, 3000];
  let series = 0;
  let previousDark = false;
  let lockedLight = false;

  const check = (id, last) => {
    if (id !== series || forced || lockedLight) return;
    const dark = pageIsDark();
    if (dark === null) return;
    if (!dark) root.classList.remove("dms-native");
    else if (previousDark) root.classList.add("dms-native");
    previousDark = dark;
    if (last && !root.classList.contains("dms-native")) lockedLight = true;
  };

  const checkSoon = () => {
    const id = ++series;
    previousDark = false;
    lockedLight = false;
    DELAYS.forEach((ms, i) => setTimeout(() => check(id, i === DELAYS.length - 1), ms));
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkSoon, { once: true });
  } else {
    checkSoon();
  }

  // Navigation interne sans rechargement (eBay Live, pages en JavaScript) : seul un
  // changement de chemin compte, pas un paramètre ou une ancre ajoutés à l'adresse.
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      root.classList.remove("dms-native");
      checkSoon();
    }
  }, 1000);
})();
