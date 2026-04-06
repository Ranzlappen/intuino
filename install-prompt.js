/* ══════════════════════════════════════════════════════════
   IntuiNO — PWA Install Prompt (auto-trigger)
   ══════════════════════════════════════════════════════════ */

(function () {
  let deferredPrompt = null;
  let prompted = false;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    if (prompted) return;
    deferredPrompt = e;
    prompted = true;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
    });
  });
})();
