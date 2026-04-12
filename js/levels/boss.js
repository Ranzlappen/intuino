(function(I) {
  I.initBoss = function() {
    document.getElementById('l10-complete').addEventListener('click', function() {
      this.completeLevel(10);
    }.bind(this));
  };

  I.startBoss = function() {
    var self = this;
    self.state.bossStage = 0;
    self._bossProgress = 0;
    self._bossIntervals = [];
    self._bossCleanedUp = false;

    // Force chaos tier 4
    for (var i = 0; i <= 4; i++) {
      document.body.classList.remove('chaos-tier-' + i);
    }
    document.body.classList.add('chaos-tier-4');

    // Sound and shake
    if (typeof self.playSound === 'function') self.playSound('bossStart');
    if (typeof self.screenShake === 'function') self.screenShake(3, 1000);

    // Start stage 1
    showStage(1);
    setupStage1();

    /* ── Stage management ─────────────────────────────────── */

    function showStage(n) {
      for (var s = 1; s <= 5; s++) {
        var el = document.getElementById('l10-stage' + s);
        if (el) el.classList.add('hidden');
      }
      var target = document.getElementById('l10-stage' + n);
      if (target) target.classList.remove('hidden');
      self.state.bossStage = n;
    }

    function bossEvent() {
      self._bossProgress++;
      self.addChaos(4);
      self.levelProg(10);
      checkAdvance();
    }

    function checkAdvance() {
      var p = self._bossProgress;
      if (p >= 10) {
        bossVictory();
      } else if (p >= 8 && self.state.bossStage < 5) {
        showStage(5);
        setupStage5();
      } else if (p >= 6 && self.state.bossStage < 4) {
        showStage(4);
        setupStage4();
      } else if (p >= 4 && self.state.bossStage < 3) {
        showStage(3);
        setupStage3();
      } else if (p >= 2 && self.state.bossStage < 2) {
        showStage(2);
        setupStage2();
      }
    }

    /* ── Stage 1: Lying links ─────────────────────────────── */

    function setupStage1() {
      var btns = document.querySelectorAll('#l10-stage1 .l10-lying-btn');
      btns.forEach(function(btn) {
        btn.addEventListener('click', function handler() {
          self.toast('That button lied to you!', 'warn');
          bossEvent();
          btn.removeEventListener('click', handler);
        });
      });
    }

    /* ── Stage 2: Inverted form ───────────────────────────── */

    function setupStage2() {
      var form = document.getElementById('l10-stage2-form');
      var input = document.getElementById('l10-stage2-input');
      if (!form) return;

      // Reversed validation: valid input shown as error, invalid as success
      var inputTriggered = false;
      input.addEventListener('input', function() {
        var v = input.value.trim();
        if (v.length > 0 && /^[a-zA-Z]+$/.test(v)) {
          input.classList.add('input-invalid');
          input.classList.remove('input-valid');
        } else if (v.length > 0) {
          input.classList.add('input-valid');
          input.classList.remove('input-invalid');
        }
        if (!inputTriggered && v.length > 2) {
          inputTriggered = true;
          self.toast('Validation is inverted in the boss arena!', 'warn');
          bossEvent();
        }
      });

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        self.toast('Form submitted into the void!', 'info');
        bossEvent();
      });
    }

    /* ── Stage 3: Swipe + notification spam ───────────────── */

    function setupStage3() {
      // Notification spam
      var notifMessages = ['BOSS ATTACK!', 'Dodge this!', 'Chaos incoming!', 'You can\'t escape!', 'Almost there...', 'Or is it?'];
      var notifStack = document.getElementById('l10-stage3-notifs');
      var notifFired = false;

      var notifInterval = setInterval(function() {
        if (self.state.currentScreen !== 'boss' || self._bossCleanedUp) {
          clearInterval(notifInterval);
          return;
        }
        if (notifStack) {
          var div = document.createElement('div');
          div.className = 'glass-card p-2 mb-1 text-xs text-white/80 border border-neon-magenta/30';
          div.textContent = notifMessages[Math.floor(Math.random() * notifMessages.length)];
          notifStack.prepend(div);
          // Cap notifications to prevent DOM overload
          while (notifStack.children.length > 8) {
            notifStack.removeChild(notifStack.lastChild);
          }
        }
        if (!notifFired) {
          notifFired = true;
          bossEvent();
        }
      }, 1500);
      self._bossIntervals.push(notifInterval);

      // Swipe card with inverted controls
      var card = document.getElementById('l10-stage3-card');
      if (!card) return;
      var startX = 0, dragging = false, swipeTriggered = false;

      card.addEventListener('mousedown', function(e) { startX = e.clientX; dragging = true; });
      card.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; dragging = true; }, { passive: true });

      var onMove = function(x) {
        if (!dragging) return;
        var diff = x - startX;
        card.style.transform = 'translateX(' + (-diff) + 'px) rotate(' + (-diff * 0.05) + 'deg)';
      };
      window.addEventListener('mousemove', function(e) { onMove(e.clientX); });
      window.addEventListener('touchmove', function(e) { if (e.touches.length) onMove(e.touches[0].clientX); }, { passive: true });

      var onEnd = function() {
        if (!dragging) return;
        dragging = false;
        card.style.transform = '';
        if (!swipeTriggered) {
          swipeTriggered = true;
          self.toast('Swipe controls are inverted in boss mode!', 'warn');
          bossEvent();
        }
      };
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchend', onEnd);
    }

    /* ── Stage 4: Runaway button + confirmshaming ─────────── */

    function setupStage4() {
      var area = document.getElementById('l10-stage4');
      var runBtn = document.getElementById('l10-runaway');
      if (!runBtn || !area) return;
      var fleeCount = 0;

      var flee = function() {
        fleeCount++;
        if (fleeCount > 3) return;
        var rect = area.getBoundingClientRect();
        var maxX = rect.width - runBtn.offsetWidth - 10;
        var maxY = rect.height - runBtn.offsetHeight - 10;
        runBtn.style.position = 'absolute';
        runBtn.style.left = (Math.random() * Math.max(maxX, 50)) + 'px';
        runBtn.style.top = (Math.random() * Math.max(maxY, 50)) + 'px';
        self.toast('The button ran away! (' + fleeCount + '/3)', 'warn');
      };

      runBtn.addEventListener('mouseenter', flee);
      runBtn.addEventListener('touchstart', function(e) {
        if (fleeCount < 3) { e.preventDefault(); flee(); }
      }, { passive: false });

      runBtn.addEventListener('click', function() {
        self.toast('You caught the boss button!', 'success');
        bossEvent();
      });

      // Confirmshaming popup
      var shameBtn = document.getElementById('l10-shame-trigger');
      if (shameBtn) {
        shameBtn.addEventListener('click', function() {
          var popup = document.getElementById('l10-shame-popup');
          if (popup) popup.classList.remove('hidden');
        });
      }

      var shameYes = document.getElementById('l10-shame-yes');
      if (shameYes) {
        shameYes.addEventListener('click', function() {
          self.toast('You chose shame. Bold move.', 'info');
          var popup = document.getElementById('l10-shame-popup');
          if (popup) popup.classList.add('hidden');
          bossEvent();
        });
      }

      var shameNo = document.getElementById('l10-shame-no');
      if (shameNo) {
        shameNo.addEventListener('click', function() {
          self.toast('Great choice! (Was it though?)', 'success');
          var popup = document.getElementById('l10-shame-popup');
          if (popup) popup.classList.add('hidden');
        });
      }
    }

    /* ── Stage 5: Everything at once ──────────────────────── */

    function setupStage5() {
      // Rapid toggles
      var toggles = document.querySelectorAll('#l10-stage5 .l10-chaos-toggle');
      toggles.forEach(function(tog) {
        tog.addEventListener('change', function() {
          self.toast('Toggle chaos!', 'warn');
          bossEvent();
        });
      });

      // More notification spam
      var spamStack = document.getElementById('l10-stage5-notifs');
      var spamInterval = setInterval(function() {
        if (self.state.currentScreen !== 'boss' || self._bossCleanedUp) {
          clearInterval(spamInterval);
          return;
        }
        if (spamStack) {
          var div = document.createElement('div');
          div.className = 'glass-card p-2 mb-1 text-xs text-white/80 border border-red-500/30';
          div.textContent = ['FINAL FORM!', 'CHAOS OVERLOAD!', 'CAN YOU HANDLE IT?', 'ALMOST DONE!'][Math.floor(Math.random() * 4)];
          spamStack.prepend(div);
          while (spamStack.children.length > 6) {
            spamStack.removeChild(spamStack.lastChild);
          }
        }
      }, 1200);
      self._bossIntervals.push(spamInterval);

      // Modal popup on a delay
      setTimeout(function() {
        if (self.state.currentScreen !== 'boss' || self._bossCleanedUp) return;
        var modal = document.getElementById('l10-stage5-modal');
        if (modal) {
          modal.classList.remove('hidden');
          self.toast('A wild modal appeared!', 'error');
        }
      }, 2000);

      var modalClose = document.getElementById('l10-stage5-modal-close');
      if (modalClose) {
        modalClose.addEventListener('click', function() {
          var modal = document.getElementById('l10-stage5-modal');
          if (modal) modal.classList.add('hidden');
          bossEvent();
        });
      }

      // Final chaos button
      var finalBtn = document.getElementById('l10-final-chaos');
      if (finalBtn) {
        finalBtn.addEventListener('click', function() {
          self.toast('MAXIMUM CHAOS!', 'error');
          bossEvent();
        });
      }
    }

    /* ── Victory ──────────────────────────────────────────── */

    function bossVictory() {
      self._bossCleanedUp = true;

      // Clear all boss intervals
      for (var i = 0; i < self._bossIntervals.length; i++) {
        clearInterval(self._bossIntervals[i]);
      }
      self._bossIntervals = [];

      // Stop boss sounds
      if (typeof self.playSound === 'function') self.playSound('bossStop');

      // Confetti burst
      if (typeof self.particleBurst === 'function') {
        self.particleBurst(window.innerWidth / 2, window.innerHeight / 2, 'confetti', 100);
      }

      // Victory toast
      self.toast('BOSS DEFEATED! You have conquered the chaos!', 'success');

      // Remove forced tier 4
      document.body.classList.remove('chaos-tier-4');

      // Complete level
      self.completeLevel(10);
    }

    /* ── Navigate-away cleanup ────────────────────────────── */

    self.state._bossCleanup = function() {
      self._bossCleanedUp = true;
      for (var i = 0; i < self._bossIntervals.length; i++) {
        clearInterval(self._bossIntervals[i]);
      }
      self._bossIntervals = [];
      document.body.classList.remove('chaos-tier-4');
    };
  };

  I._bossAdvance = function() {
    // External access point — delegates to internal checkAdvance via bossEvent
    // Primary stage management is handled internally by startBoss
  };
})(IntuiNO);
