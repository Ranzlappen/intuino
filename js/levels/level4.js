(function(I) {
  I.initLevel4 = function() {
    // Runaway button
    const chaseArea = document.getElementById('l4-chase-area');
    const runBtn = document.getElementById('l4-runaway-btn');

    const flee = () => {
      this.state.runawayAttempts++;
      if (this.state.runawayAttempts >= 5) return; // Let it be caught after 5 tries
      const rect = chaseArea.getBoundingClientRect();
      const maxX = rect.width - runBtn.offsetWidth - 10;
      const maxY = rect.height - runBtn.offsetHeight - 10;
      const nx = Math.random() * maxX;
      const ny = Math.random() * maxY;
      if (typeof gsap !== 'undefined') {
        gsap.to(runBtn, { left: nx, top: ny, transform: 'none', duration: 0.25, ease: 'power2.out' });
      } else {
        runBtn.style.left = nx + 'px'; runBtn.style.top = ny + 'px'; runBtn.style.transform = 'none';
      }
    };

    runBtn.addEventListener('mouseenter', flee);
    runBtn.addEventListener('touchstart', (e) => {
      if (this.state.runawayAttempts < 5) { e.preventDefault(); flee(); }
    }, { passive: false });
    runBtn.addEventListener('click', () => {
      this.addChaos(5); this.levelProg(4);
      this.toast('You caught the button! It took ' + this.state.runawayAttempts + ' attempts.', 'success');
      if (typeof gsap !== 'undefined') {
        gsap.to(runBtn, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
      }
    });

    // Opposite label buttons
    const realActions = { delete: 'Actually deleted your data!', save: 'Actually saved it (you clicked Delete)!', unmute: 'Actually unmuted (you clicked Mute)!', mute: 'Actually muted (you clicked Unmute)!' };
    document.querySelectorAll('.opposite-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const real = btn.dataset.real;
        this.addChaos(3); this.levelProg(4);
        this.toast(realActions[real] || 'Opposite action triggered!', 'warn');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(btn, { scale: 0.93 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
        }
      });
    });

    document.getElementById('l4-complete').addEventListener('click', () => this.completeLevel(4));
  };

  I.startLevel4 = function() {
    this.state.runawayAttempts = 0;
    this.state.l4ProgressValue = 100;
    const bar = document.getElementById('l4-fake-progress');
    const txt = document.getElementById('l4-loading-text');
    bar.style.width = '100%';

    // Backwards progress bar
    const interval = setInterval(() => {
      if (this.state.currentScreen !== 'level4') { clearInterval(interval); return; }
      this.state.l4ProgressValue -= Math.random() * 3;
      if (this.state.l4ProgressValue < 5) this.state.l4ProgressValue = 5;
      bar.style.width = this.state.l4ProgressValue + '%';
      txt.textContent = Math.round(this.state.l4ProgressValue) + '% — Going backwards...';
    }, 200);

    // Wrong action completes loading
    document.getElementById('l4-wrong-action').onclick = () => {
      clearInterval(interval);
      this.state.l4ProgressValue = 100;
      bar.style.width = '100%';
      bar.style.background = 'linear-gradient(to right, #22c55e, #00f0ff)';
      txt.textContent = '100% — Complete! (Canceling finished the download.)';
      this.addChaos(5); this.levelProg(4);
      this.toast('Pressing "Cancel" completed the download!', 'info');
    };
  };
})(IntuiNO);
