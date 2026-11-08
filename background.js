// Après « Recharger l'extension » (fenêtre de l'extension), recharge l'onglet d'où le bouton
// a été cliqué, pour qu'il reprenne les nouveaux fichiers. La fenêtre de l'extension, fermée
// par le rechargement, ne peut pas le faire elle-même : elle laisse l'onglet dans storage.local.
// Ce script tourne à chaque démarrage de l'extension, donc juste après le rechargement.
(async () => {
  const { reloadTab } = await chrome.storage.local.get("reloadTab");
  if (reloadTab == null) return;
  await chrome.storage.local.remove("reloadTab");
  chrome.tabs.reload(reloadTab).catch(() => {}); // onglet fermé entre-temps
})();
