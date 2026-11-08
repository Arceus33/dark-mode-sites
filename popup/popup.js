(async () => {
  document.getElementById("version").textContent = "v" + chrome.runtime.getManifest().version;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let site = null;
  try {
    site = dmsSiteForHost(new URL(tab.url).hostname);
  } catch {
    // Page sans URL lisible (chrome://, nouvel onglet…)
  }

  if (!site) {
    document.getElementById("unsupported").hidden = false;
    return;
  }

  const toggle = document.getElementById("toggle");
  const forced = document.getElementById("forced");
  const state = document.getElementById("state");
  document.getElementById("site").textContent = site.name;
  document.getElementById("controls").hidden = false;

  const DEFAULTS = { disabled: {}, forced: {} };

  // État réel de la page, demandé au script de l'onglet
  const showState = async () => {
    if (!toggle.checked) {
      state.textContent = "Mode sombre coupé sur ce site.";
      return;
    }
    if (dmsHasOwnTheme(site)) {
      state.textContent = "Thème sombre du site activé.";
      return;
    }
    try {
      const { native } = await chrome.tabs.sendMessage(tab.id, "dms-state");
      state.textContent = native
        ? "Page déjà sombre : inversion suspendue. Cochez « Toujours sombre » si c'est une erreur."
        : "Mode sombre actif.";
    } catch {
      state.textContent = "Rechargez l'onglet pour appliquer le mode sombre.";
    }
  };

  const settings = await chrome.storage.sync.get(DEFAULTS);
  toggle.checked = !settings.disabled[site.id];
  forced.checked = Boolean(settings.forced[site.id]);
  forced.disabled = !toggle.checked;
  forced.parentElement.hidden = dmsHasOwnTheme(site);
  showState();

  // Coche ou décoche le site dans une des listes enregistrées
  const save = async (key, on) => {
    const current = await chrome.storage.sync.get(DEFAULTS);
    if (on) current[key][site.id] = true;
    else delete current[key][site.id];
    await chrome.storage.sync.set({ [key]: current[key] });
  };

  toggle.addEventListener("change", async () => {
    await save("disabled", !toggle.checked);
    forced.disabled = !toggle.checked;
    showState();
  });

  forced.addEventListener("change", async () => {
    await save("forced", forced.checked);
    // Laisse au script de l'onglet le temps d'appliquer le réglage
    setTimeout(showState, 100);
  });
})();
