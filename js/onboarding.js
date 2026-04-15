/**
 * IntuiNO — Chaotic Onboarding Tutorial
 * A tutorial where nothing works as expected. Runs on first visit only.
 */
(function (I) {
  'use strict';

  /* ── initOnboarding ─────────────────────────────────────────── */

  I.initOnboarding = function () {
    var self = this;

    // Check if this is a first visit (no save data / brand-new session)
    if (!localStorage.getItem('intuino')) {
      // Double-check via state
      if (this.state.stats.sessionsPlayed <= 1 && this.state.chaosScore === 0) {
        setTimeout(function () {
          self._showOnboarding();
        }, 1000);
      }
    }
  };

  /* ── _showOnboarding ────────────────────────────────────────── */

  I._showOnboarding = function () {
    var overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;

    var self = this;
    var currentStep = 1;
    var totalSteps = 4;
    var progressInterval = null;

    // Prevent dismissal by clicking the backdrop
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        // Do nothing — can't dismiss by clicking outside
        e.stopPropagation();
      }
    });

    // Show overlay and first step
    overlay.classList.add('active');
    showStep(1);

    /* ── step visibility ─────────────────────────────── */

    function showStep(n) {
      for (var i = 1; i <= totalSteps; i++) {
        var stepEl = document.getElementById('onboarding-step' + i);
        if (stepEl) {
          if (i === n) {
            stepEl.classList.remove('hidden');
          } else {
            stepEl.classList.add('hidden');
          }
        }
      }
      currentStep = n;

      // Step 3: start the backwards progress bar
      if (n === 3) {
        startBackwardsProgress();
      }
    }

    /* ── Step 1: "Click the Next button" — but it says "Previous" ── */

    var step1Btn = document.getElementById('onboarding-btn1');
    if (step1Btn) {
      step1Btn.addEventListener('click', function () {
        self.addChaos(2);
        showStep(2);
      });
    }

    /* ── Step 2: Upside-down instructions with correct "Next" ───── */

    var step2Btn = document.getElementById('onboarding-btn2');
    if (step2Btn) {
      step2Btn.addEventListener('click', function () {
        self.addChaos(2);
        showStep(3);
      });
    }

    /* ── Step 3: Backwards progress bar ────────────────────────── */

    function startBackwardsProgress() {
      var bar = document.getElementById('onboarding-bar');
      if (!bar) return;

      // Start at 75%, animate to 25% over 3 seconds
      bar.style.width = '75%';
      bar.style.transition = 'width 3s linear';

      // Force a reflow so the transition triggers
      void bar.offsetWidth;
      bar.style.width = '25%';

      // Clear any previous interval
      if (progressInterval) clearInterval(progressInterval);
    }

    var step3Btn = document.getElementById('onboarding-btn3');
    if (step3Btn) {
      step3Btn.addEventListener('click', function () {
        self.addChaos(2);
        showStep(4);
      });
    }

    /* ── Step 4: "Skip Tutorial" completes the tutorial ────────── */

    var step4Btn = document.getElementById('onboarding-skip');
    if (step4Btn) {
      step4Btn.addEventListener('click', function () {
        self.addChaos(3);
        overlay.classList.remove('active');
        self.toast('Tutorial complete! Nothing you learned will help.', 'info');
      });
    }
  };

})(IntuiNO);
