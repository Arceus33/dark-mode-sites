(async () => {
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
  document.getElementById("site").textContent = site.name;
  document.getElementById("row").hidden = false;

  const { disabled } = await chrome.storage.sync.get({ disabled: {} });
  toggle.checked = !disabled[site.id];

  toggle.addEventListener("change", async () => {
    const { disabled } = await chrome.storage.sync.get({ disabled: {} });
    if (toggle.checked) delete disabled[site.id];
    else disabled[site.id] = true;
    await chrome.storage.sync.set({ disabled });
  });
})();
