/**
 * IntuiNO — Easter Eggs
 * Konami code, title click secret, fake dev tools, and other hidden surprises.
 */
(function (I) {
  'use strict';

  /* ── Fake console messages for the dev tools panel ──────────── */

  var FAKE_CONSOLE_MESSAGES = [
    { level: 'log',   text: '[IntuiNO] Chaos engine nominal. All systems unstable.' },
    { level: 'warn',  text: '[IntuiNO] Warning: User appears to be having fun. Escalating.' },
    { level: 'error', text: 'Uncaught ChaosOverflow: Maximum confusion exceeded at line 42' },
    { level: 'log',   text: '> navigator.sanity  // undefined' },
    { level: 'warn',  text: '[Deprecation] Good UX has been deprecated in this build.' },
    { level: 'error', text: 'TypeError: Cannot read properties of null (reading \'userExperience\')' },
    { level: 'log',   text: '[IntuiNO] Buttons relocated. Users adapting. Relocating again.' },
    { level: 'warn',  text: '[Security] Password field is broadcasting in plaintext to chaos.api' },
    { level: 'error', text: 'RangeError: Chaos level out of bounds (expected 0-4, got Infinity)' },
    { level: 'log',   text: '[IntuiNO] Loading complete. JK, resetting to 0%.' },
    { level: 'warn',  text: '[Performance] Frame rate limited to 3 FPS for optimal confusion.' },
    { level: 'error', text: 'SyntaxError: Unexpected token "please" (users should stop begging)' },
    { level: 'log',   text: '> document.querySelector(\'#close-button\')  // null (as intended)' },
    { level: 'warn',  text: '[IntuiNO] Dark patterns loaded: confirmshaming, roach motel, misdirection' },
    { level: 'error', text: 'FATAL: UX Designer disconnected. Chaos running unsupervised.' },
  ];

  var FAKE_NETWORK_REQUESTS = [
    { url: 'chaos.api/v1/confusion',         status: 418, type: 'fetch',  size: '6.6 kB',   time: '666 ms' },
    { url: 'chaos.api/v1/annoy',             status: 418, type: 'xhr',    size: '1.3 kB',   time: '420 ms' },
    { url: 'chaos.api/v1/relocate-buttons',  status: 418, type: 'fetch',  size: '0 B',      time: '13 ms' },
    { url: 'chaos.api/v1/invert-colors',     status: 418, type: 'fetch',  size: '42 B',     time: '999 ms' },
    { url: 'chaos.api/v1/fake-progress',     status: 418, type: 'xhr',    size: '73 B',     time: '73 ms' },
    { url: 'chaos.api/v1/steal-cursor',      status: 418, type: 'fetch',  size: '404 B',    time: '404 ms' },
    { url: 'chaos.api/v2/break-everything',  status: 418, type: 'fetch',  size: '666 kB',   time: '6666 ms' },
    { url: 'chaos.api/v1/gaslight',          status: 418, type: 'xhr',    size: '0 B',      time: '1 ms' },
  ];

  /* ── initEasterEggs ─────────────────────────────────────────── */

  I.initEasterEggs = function () {
    this._initKonamiCode();
    this._initTitleClick();
    this._initFakeDevTools();
  };

  /* ── Konami Code ────────────────────────────────────────────── */

  I._initKonamiCode = function () {
    var self = this;
    var SEQUENCE = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];

    self.state.konamiIndex = self.state.konamiIndex || 0;

    document.addEventListener('keydown', function (e) {
      var expected = SEQUENCE[self.state.konamiIndex];

      if (e.key === expected) {
        self.state.konamiIndex++;

        if (self.state.konamiIndex >= SEQUENCE.length) {
          self.state.konamiIndex = 0;
          self._activateKonami();
        }
      } else {
        self.state.konamiIndex = (e.key === SEQUENCE[0]) ? 1 : 0;
      }
    });
  };

  I._activateKonami = function () {
    var self = this;
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Force Tier 4 visual class for 10 seconds
    document.body.classList.add('chaos-tier-4');

    // Particle burst
    if (typeof self.particleBurst === 'function') {
      self.particleBurst(w / 2, h / 2, 'confetti', 80);
    }

    // Screen shake
    if (typeof self.screenShake === 'function') {
      self.screenShake(8, 2000);
    }

    // Sound
    if (typeof self.playSound === 'function') {
      self.playSound('tierUp');
    }

    // Toast
    if (typeof self.toast === 'function') {
      self.toast('KONAMI CODE ACTIVATED! ULTRA CHAOS!', 'chaos');
    }

    // Achievement & chaos
    if (typeof self.unlockAchievement === 'function') {
      self.unlockAchievement('konamiKid');
    }
    self.addChaos(20);

    // Remove forced tier class after 10 seconds
    setTimeout(function () {
      document.body.classList.remove('chaos-tier-4');
    }, 10000);
  };

  /* ── Title Click (Level 0 — Perfect UX) ─────────────────────── */

  I._initTitleClick = function () {
    var self = this;
    var clickTimestamps = [];

    var titleSpan = document.querySelector('#topbar .text-sm.font-semibold');
    if (!titleSpan) return;

    titleSpan.style.cursor = 'pointer';
    titleSpan.addEventListener('click', function () {
      var now = Date.now();
      clickTimestamps.push(now);

      // Keep only clicks within the last 2 seconds
      clickTimestamps = clickTimestamps.filter(function (t) {
        return now - t <= 2000;
      });

      if (clickTimestamps.length >= 7) {
        clickTimestamps = [];
        self._activatePerfectUX();
      }
    });
  };

  I._activatePerfectUX = function () {
    var self = this;

    // Create the Level 0 screen if it doesn't exist yet
    var screen = document.getElementById('screen-level0');
    if (!screen) {
      screen = document.createElement('div');
      screen.id = 'screen-level0';
      screen.className = 'hidden min-h-screen pt-20 pb-12 px-4';
      screen.innerHTML =
        '<div style="max-width:600px;margin:0 auto;font-family:system-ui,sans-serif;">' +
          '<div style="background:#ffffff;border-radius:8px;padding:32px;color:#333;box-shadow:0 1px 3px rgba(0,0,0,0.12);">' +
            '<h1 style="font-size:1.5em;font-weight:600;color:#1a1a1a;margin-bottom:8px;">Settings</h1>' +
            '<p style="font-size:0.9em;color:#666;margin-bottom:24px;">Everything works correctly. Nothing is broken.</p>' +

            '<div style="margin-bottom:20px;">' +
              '<label style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee;">' +
                '<span style="color:#333;font-size:0.95em;">Enable Notifications</span>' +
                '<input type="checkbox" checked style="width:18px;height:18px;accent-color:#2563eb;">' +
              '</label>' +
              '<label style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee;">' +
                '<span style="color:#333;font-size:0.95em;">Dark Mode</span>' +
                '<input type="checkbox" style="width:18px;height:18px;accent-color:#2563eb;">' +
              '</label>' +
              '<label style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eee;">' +
                '<span style="color:#333;font-size:0.95em;">Auto-Save</span>' +
                '<input type="checkbox" checked style="width:18px;height:18px;accent-color:#2563eb;">' +
              '</label>' +
            '</div>' +

            '<button id="level0-save-btn" style="background:#2563eb;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-size:1em;cursor:pointer;margin-right:8px;">Save Changes</button>' +
            '<button id="level0-cancel-btn" style="background:#f3f4f6;color:#333;border:1px solid #d1d5db;padding:10px 24px;border-radius:6px;font-size:1em;cursor:pointer;">Cancel</button>' +

            '<div style="margin-top:24px;padding:16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;color:#166534;font-size:0.85em;">' +
              'All changes are saved automatically. Your preferences are respected. No dark patterns here.' +
            '</div>' +
          '</div>' +

          '<div style="text-align:center;margin-top:24px;">' +
            '<button id="level0-back-btn" style="background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1);padding:10px 28px;border-radius:8px;font-size:0.9em;cursor:pointer;">Back to Chaos</button>' +
          '</div>' +
        '</div>';

      // Insert before the scripts at the end of body
      document.body.appendChild(screen);

      // Wire up the back button
      var backBtn = screen.querySelector('#level0-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', function () {
          self.navigate('hub');
        });
      }

      // Save button just shows a toast
      var saveBtn = screen.querySelector('#level0-save-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', function () {
          if (typeof self.toast === 'function') {
            self.toast('Settings saved successfully. Wait, that actually worked?', 'info');
          }
        });
      }

      // Cancel button navigates back
      var cancelBtn = screen.querySelector('#level0-cancel-btn');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function () {
          self.navigate('hub');
        });
      }
    }

    // Navigate to Level 0
    self.navigate('level0');

    // Toasts
    if (typeof self.toast === 'function') {
      self.toast('Everything is... working? This is terrifying.', 'info');
    }

    // Achievement & chaos
    if (typeof self.unlockAchievement === 'function') {
      self.unlockAchievement('theHorror');
    }
    self.addChaos(10);
  };

  /* ── Fake Dev Tools ─────────────────────────────────────────── */

  I._initFakeDevTools = function () {
    var self = this;
    var panel = null;
    var consoleInterval = null;

    document.addEventListener('keydown', function (e) {
      // F12 or Ctrl+Shift+I
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        self._toggleFakeDevTools();
      }
    });
  };

  I._toggleFakeDevTools = function () {
    var self = this;
    var existing = document.getElementById('fake-devtools');

    if (existing) {
      // Toggle off
      if (existing._consoleInterval) {
        clearInterval(existing._consoleInterval);
        existing._consoleInterval = null;
      }
      existing.remove();
      return;
    }

    // ── Build the panel ──
    var panel = document.createElement('div');
    panel.id = 'fake-devtools';
    panel.style.cssText =
      'position:fixed;top:0;right:0;bottom:0;width:420px;max-width:90vw;z-index:9999;' +
      'background:#1e1e1e;border-left:2px solid #333;font-family:Consolas,Monaco,monospace;' +
      'display:flex;flex-direction:column;animation:fakedt-slide-in 0.25s ease-out;';

    // Inject animation keyframes
    if (!document.getElementById('fakedt-style')) {
      var style = document.createElement('style');
      style.id = 'fakedt-style';
      style.textContent =
        '@keyframes fakedt-slide-in{from{transform:translateX(100%)}to{transform:translateX(0)}}';
      document.head.appendChild(style);
    }

    // ── Tab bar ──
    var tabBar = document.createElement('div');
    tabBar.style.cssText =
      'display:flex;background:#252526;border-bottom:1px solid #333;flex-shrink:0;';

    var tabs = ['Elements', 'Console', 'Network'];
    var tabButtons = [];
    var tabPanels = [];

    tabs.forEach(function (name, idx) {
      var btn = document.createElement('button');
      btn.textContent = name;
      btn.style.cssText =
        'padding:8px 16px;font-size:12px;color:#999;background:transparent;border:none;' +
        'border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;';
      btn.addEventListener('click', function () {
        activateTab(idx);
      });
      tabBar.appendChild(btn);
      tabButtons.push(btn);
    });

    // ── Close button ──
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00D7';
    closeBtn.style.cssText =
      'margin-left:auto;padding:8px 14px;font-size:16px;color:#999;background:transparent;' +
      'border:none;cursor:pointer;font-family:inherit;';
    closeBtn.addEventListener('click', function () {
      self._toggleFakeDevTools();
    });
    tabBar.appendChild(closeBtn);

    panel.appendChild(tabBar);

    // ── Content area ──
    var contentArea = document.createElement('div');
    contentArea.style.cssText = 'flex:1;overflow-y:auto;';
    panel.appendChild(contentArea);

    // ── Elements tab content ──
    var elementsPanel = document.createElement('div');
    elementsPanel.style.cssText = 'padding:12px;font-size:12px;line-height:1.8;color:#d4d4d4;';
    elementsPanel.innerHTML =
      '<div style="color:#569cd6;">&lt;html class="<span style="color:#ce9178;">dark chaos-mode</span>"&gt;</div>' +
      '<div style="padding-left:16px;color:#569cd6;">&lt;head&gt;</div>' +
      '<div style="padding-left:32px;color:#569cd6;">&lt;title&gt;<span style="color:#ce9178;">Error 404 - Page Found (this is the error)</span>&lt;/title&gt;</div>' +
      '<div style="padding-left:16px;color:#569cd6;">&lt;/head&gt;</div>' +
      '<div style="padding-left:16px;color:#569cd6;">&lt;body class="<span style="color:#ce9178;">chaos-tier-99 upside-down</span>"&gt;</div>' +
      '<div style="padding-left:32px;color:#569cd6;">&lt;div class="<span style="color:#ce9178;">chaos-container</span>"&gt;</div>' +
      '<div style="padding-left:48px;color:#569cd6;">&lt;blink&gt;<span style="color:#ce9178;">Everything is fine</span>&lt;/blink&gt;</div>' +
      '<div style="padding-left:48px;color:#569cd6;">&lt;marquee direction="<span style="color:#ce9178;">chaos</span>"&gt;<span style="color:#ce9178;">Nothing to see here</span>&lt;/marquee&gt;</div>' +
      '<div style="padding-left:48px;color:#569cd6;">&lt;button onclick="<span style="color:#ce9178;">alert(\'You wish\')</span>" disabled&gt;<span style="color:#ce9178;">Close</span>&lt;/button&gt;</div>' +
      '<div style="padding-left:48px;color:#569cd6;">&lt;input type="<span style="color:#ce9178;">happiness</span>" value="<span style="color:#ce9178;">not found</span>" readonly /&gt;</div>' +
      '<div style="padding-left:48px;color:#569cd6;">&lt;div style="<span style="color:#ce9178;">display:none !important</span>"&gt;<span style="color:#ce9178;">The close button</span>&lt;/div&gt;</div>' +
      '<div style="padding-left:48px;color:#569cd6;">&lt;!-- TODO: add good UX (never) --&gt;</div>' +
      '<div style="padding-left:32px;color:#569cd6;">&lt;/div&gt;</div>' +
      '<div style="padding-left:32px;color:#569cd6;">&lt;footer&gt;<span style="color:#ce9178;">No users were harmed. Probably.</span>&lt;/footer&gt;</div>' +
      '<div style="padding-left:16px;color:#569cd6;">&lt;/body&gt;</div>' +
      '<div style="color:#569cd6;">&lt;/html&gt;</div>';
    tabPanels.push(elementsPanel);

    // ── Console tab content ──
    var consolePanel = document.createElement('div');
    consolePanel.style.cssText = 'padding:12px;font-size:12px;line-height:1.7;';

    // Prompt line
    var prompt = document.createElement('div');
    prompt.style.cssText = 'display:flex;align-items:center;border-top:1px solid #333;padding-top:8px;margin-top:8px;';
    prompt.innerHTML =
      '<span style="color:#569cd6;margin-right:6px;">&gt;</span>' +
      '<span style="color:#666;font-style:italic;">Type something (it won\'t work)</span>';

    var consoleLog = document.createElement('div');
    consoleLog.id = 'fake-console-log';
    consolePanel.appendChild(consoleLog);
    consolePanel.appendChild(prompt);
    tabPanels.push(consolePanel);

    // ── Network tab content ──
    var networkPanel = document.createElement('div');
    networkPanel.style.cssText = 'font-size:11px;';

    // Header row
    var headerRow = document.createElement('div');
    headerRow.style.cssText =
      'display:grid;grid-template-columns:1fr 50px 50px 60px 60px;padding:6px 12px;' +
      'background:#252526;color:#999;border-bottom:1px solid #333;font-weight:600;position:sticky;top:0;';
    headerRow.innerHTML =
      '<span>Name</span><span>Status</span><span>Type</span><span>Size</span><span>Time</span>';
    networkPanel.appendChild(headerRow);

    FAKE_NETWORK_REQUESTS.forEach(function (req) {
      var row = document.createElement('div');
      row.style.cssText =
        'display:grid;grid-template-columns:1fr 50px 50px 60px 60px;padding:5px 12px;' +
        'border-bottom:1px solid #2a2a2a;color:#d4d4d4;';
      row.innerHTML =
        '<span style="color:#569cd6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + req.url + '</span>' +
        '<span style="color:#f44747;">' + req.status + '</span>' +
        '<span>' + req.type + '</span>' +
        '<span>' + req.size + '</span>' +
        '<span>' + req.time + '</span>';
      networkPanel.appendChild(row);
    });

    // Teapot explanation
    var teapotNote = document.createElement('div');
    teapotNote.style.cssText = 'padding:12px;color:#666;font-style:italic;';
    teapotNote.textContent = '418 I\'m a Teapot \u2014 All requests refused. Server is a teapot.';
    networkPanel.appendChild(teapotNote);
    tabPanels.push(networkPanel);

    // ── Tab switching logic ──
    function activateTab(index) {
      tabButtons.forEach(function (btn, i) {
        btn.style.color = i === index ? '#fff' : '#999';
        btn.style.borderBottomColor = i === index ? '#007acc' : 'transparent';
      });
      contentArea.innerHTML = '';
      contentArea.appendChild(tabPanels[index]);
    }

    // Default to Elements tab
    activateTab(0);

    document.body.appendChild(panel);

    // Start cycling fake console messages
    var msgIndex = 0;
    function addConsoleLine() {
      var msg = FAKE_CONSOLE_MESSAGES[msgIndex % FAKE_CONSOLE_MESSAGES.length];
      msgIndex++;

      var line = document.createElement('div');
      line.style.cssText = 'padding:2px 0;border-bottom:1px solid #2a2a2a;';

      var colors = { log: '#d4d4d4', warn: '#cca700', error: '#f44747' };
      var icons  = { log: '',        warn: '\u26A0 ',  error: '\u2716 ' };

      line.innerHTML =
        '<span style="color:' + (colors[msg.level] || '#d4d4d4') + ';">' +
          icons[msg.level] + msg.text +
        '</span>';

      var logEl = document.getElementById('fake-console-log');
      if (logEl) {
        logEl.appendChild(line);
        logEl.scrollTop = logEl.scrollHeight;
      }
    }

    // Seed a few initial messages
    for (var i = 0; i < 4; i++) {
      addConsoleLine();
    }

    panel._consoleInterval = setInterval(addConsoleLine, 2000);

    // Achievement
    if (typeof self.unlockAchievement === 'function') {
      self.unlockAchievement('inspectorChaos');
    }
  };

})(IntuiNO);
