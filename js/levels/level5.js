(function(I) {
  I.initLevel5 = function() {
    const settingNames = { dark: 'Dark Mode', notif: 'Notifications', sound: 'Sound Effects', autosave: 'Auto-Save', privacy: 'Privacy Mode' };
    document.querySelectorAll('.sab-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const name = settingNames[chk.dataset.setting] || chk.dataset.setting;
        const msg = chk.checked ? `${name} has been disabled.` : `${name} has been enabled.`;
        this.addChaos(2); this.levelProg(5);
        this.toast(msg, 'warn');
      });
    });

    // Swapped save/cancel
    document.getElementById('l5-save-cancel').addEventListener('click', () => {
      this.addChaos(4); this.levelProg(5);
      this.toast('Settings saved! (You clicked Cancel.)', 'success');
    });
    document.getElementById('l5-save-confirm').addEventListener('click', () => {
      this.addChaos(4); this.levelProg(5);
      this.toast('Nothing was deleted. Settings unchanged. (You clicked Delete Account.)', 'info');
    });

    document.getElementById('l5-complete').addEventListener('click', () => this.completeLevel(5));
  };

  I.startLevel5 = function() {
    this.state.l5ApplyValue = 0;
    const bar = document.getElementById('l5-apply-bar');
    const txt = document.getElementById('l5-apply-text');
    bar.style.width = '0%';

    if (this.state.l5ApplyInterval) clearInterval(this.state.l5ApplyInterval);
    this.state.l5ApplyInterval = setInterval(() => {
      if (this.state.currentScreen !== 'level5') { clearInterval(this.state.l5ApplyInterval); return; }
      if (this.state.l5ApplyValue < 78) {
        this.state.l5ApplyValue += Math.random() * 2;
        bar.style.width = this.state.l5ApplyValue + '%';
        txt.textContent = Math.round(this.state.l5ApplyValue) + '% — Applying settings...';
      } else {
        txt.textContent = '78% — Stalled. Something seems wrong...';
      }
    }, 150);

    document.getElementById('l5-apply-wait').onclick = () => {
      this.addChaos(2); this.levelProg(5);
      this.toast('Still waiting... Nothing happened.', 'warn');
    };
    document.getElementById('l5-apply-abort').onclick = () => {
      clearInterval(this.state.l5ApplyInterval);
      this.state.l5ApplyValue = 100;
      bar.style.width = '100%';
      bar.style.background = 'linear-gradient(to right, #22c55e, #a855f7)';
      txt.textContent = '100% — Settings applied! Aborting was the right wrong choice.';
      this.addChaos(5); this.levelProg(5);
      this.toast('Aborting completed the settings! Of course.', 'info');
    };
  };
})(IntuiNO);
