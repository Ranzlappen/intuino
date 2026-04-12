/**
 * IntuiNO — Meta-Chaos System
 * Fourth-wall-breaking features: fake crashes, fake updates, and other mayhem.
 */
(function (I) {
  'use strict';

  /* ── initMetaChaos ──────────────────────────────────────────── */

  I.initMetaChaos = function () {
    var self = this;

    // ── Fake crash overlay ──
    var crashDiv = document.createElement('div');
    crashDiv.id = 'fake-crash';
    crashDiv.style.cssText = 'position:fixed;inset:0;z-index:10000;display:none;cursor:default;';
    document.body.appendChild(crashDiv);

    // ── Monkey-patch addChaos for Tier 3+ fake crash chance ──
    var origAddChaos = I.addChaos.bind(I);
    I.addChaos = function (n) {
      origAddChaos(n);
      if (I.state.chaosTier >= 3 && Math.random() < 0.05) {
        I._triggerFakeCrash();
      }
    };

    // ── Initialize fake update dialog ──
    this._initFakeUpdateDialog();
  };

  /* ── _triggerFakeCrash ──────────────────────────────────────── */

  I._triggerFakeCrash = function () {
    var overlay = document.getElementById('fake-crash');
    if (!overlay || overlay.style.display === 'flex') return;

    var self = this;
    var variant = Math.floor(Math.random() * 3);
    var hexCode = Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase();
    var html = '';

    switch (variant) {
      // BSOD
      case 0:
        overlay.style.background = '#0078d4';
        html =
          '<div style="color:#fff;font-family:Segoe UI,sans-serif;padding:10% 12%;max-width:800px;">' +
            '<div style="font-size:8em;margin-bottom:20px;">:(</div>' +
            '<div style="font-size:1.6em;margin-bottom:24px;">Your PC ran into a problem and needs to restart. We\'re just collecting some error info, and then we\'ll restart for you.</div>' +
            '<div style="font-size:1.1em;margin-bottom:16px;">42% complete</div>' +
            '<div style="font-size:0.85em;color:rgba(255,255,255,0.7);">Stop code: CHAOS_OVERFLOW_0x' + hexCode + '</div>' +
            '<div style="font-size:0.75em;color:rgba(255,255,255,0.5);margin-top:20px;">If you call a support number, give them this info:<br/>Log file: C:\\WINDOWS\\CHAOS\\dumpstack.log.tmp</div>' +
          '</div>';
        break;

      // Kernel panic
      case 1:
        overlay.style.background = '#333';
        html =
          '<div style="color:#fff;font-family:monospace;padding:40px;font-size:13px;line-height:1.8;white-space:pre-wrap;">' +
            'panic(cpu 0 caller 0xffffff800a2b1c08): "CHAOS_OVERFLOW: Unrecoverable chaos detected"\n' +
            'Debugger message: panic\n' +
            'Memory ID: 0x' + hexCode + '\n' +
            'EFI Firmware: IntuiNO v6.6.6\n\n' +
            'BSD process name corresponding to current thread: chaosengine\n' +
            'Mac OS version: Not Yet 42.0\n\n' +
            'Kernel version:\n' +
            'Darwin Kernel Version 99.0.0: CHAOS_TIER_MAX; root:xnu-' + hexCode.slice(0, 8) + '/RELEASE_X86_64\n\n' +
            'System uptime in nanoseconds: ' + Math.floor(Math.random() * 999999999999) + '\n' +
            'last loaded kext at ' + Math.floor(Math.random() * 99999) + ': com.intuino.chaos v' + Math.floor(Math.random() * 99) + '.0\n\n' +
            'loaded kexts:\n' +
            'com.intuino.confetti          4.2.0\n' +
            'com.intuino.screenshake       1.3.7\n' +
            'com.intuino.entropy           6.6.6\n' +
            'com.intuino.fakeCrash         0.0.1\n' +
          '</div>';
        break;

      // Linux kernel panic
      case 2:
        overlay.style.background = '#000';
        html =
          '<div style="color:#fff;font-family:monospace;padding:40px;font-size:13px;line-height:1.7;white-space:pre-wrap;overflow-y:auto;max-height:100vh;">' +
            '[    0.000000] Linux version 6.6.6-chaos (root@intuino) (gcc version 13.3.7) #1 SMP PREEMPT_DYNAMIC\n' +
            '[    0.000001] Command line: BOOT_IMAGE=/vmlinuz-6.6.6-chaos root=UUID=' + hexCode + ' ro quiet\n' +
            '[    0.421337] Entropy pool initialized (sources: chaos_engine/42)\n' +
            '[    1.234567] EXT4-fs (sda1): mounted filesystem with ordered data mode. Opts: (null). Quota mode: none.\n' +
            '[    2.718281] CHAOS: module loaded, tier = ' + (I.state.chaosTier || 0) + '\n' +
            '[    3.141592] VFS: Cannot open root device "chaos0" or unknown-block(0,0): error -6\n' +
            '[    3.141593] Please append a correct "root=" boot option; here are the available partitions:\n' +
            '[    3.141594] 0800     52428800 sda  driver: sd\n' +
            '[    3.141595]   0801     52427776 sda1 ' + hexCode + '\n' +
            '[    3.141596] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)\n' +
            '[    3.141597] CPU: 0 PID: 1 Comm: swapper/0 Tainted: G    B    OE 6.6.6-chaos #1\n' +
            '[    3.141598] Hardware name: IntuiNO Chaos Machine/ChaosMobo, BIOS v' + hexCode.slice(0, 4) + ' 01/01/2077\n' +
            '[    3.141599] Call Trace:\n' +
            '[    3.141600]  dump_stack_lvl+0x48/0x70\n' +
            '[    3.141601]  panic+0x340/0x370\n' +
            '[    3.141602]  mount_block_root+0x1c5/0x248\n' +
            '[    3.141603]  mount_root+0xfe/0x120\n' +
            '[    3.141604]  prepare_namespace+0x13a/0x170\n' +
            '[    3.141605]  chaos_overflow+0x' + hexCode.slice(0, 6) + '/0xDEAD\n' +
            '[    3.141606] ---[ end Kernel panic - not syncing: VFS: Unable to mount root fs ]---\n' +
          '</div>';
        break;
    }

    // Dismiss hint
    html +=
      '<div style="position:absolute;bottom:12px;right:16px;font-size:6px;color:rgba(255,255,255,0.1);cursor:pointer;" id="fake-crash-dismiss">' +
        'click to dismiss' +
      '</div>';

    overlay.innerHTML = html;
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'flex-start';
    overlay.style.justifyContent = 'flex-start';

    self.state.stats.fakeCrashesTriggered = (self.state.stats.fakeCrashesTriggered || 0) + 1;

    // Dismiss handler
    var dismissed = false;
    var dismiss = function () {
      if (dismissed) return;
      dismissed = true;
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      self.state.fakeCrashCount = (self.state.fakeCrashCount || 0) + 1;
      self.save();
      if (self.state.fakeCrashCount >= 5 && typeof self.unlockAchievement === 'function') {
        self.unlockAchievement('crashSurvivor');
      }
      self.addChaos(5);
    };

    // Click the tiny dismiss text
    var dismissBtn = document.getElementById('fake-crash-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dismiss();
      });
    }

    // Also dismiss on clicking the overlay itself (the hint says "click to dismiss")
    overlay.addEventListener('click', function handler() {
      dismiss();
      overlay.removeEventListener('click', handler);
    });

    // Auto-dismiss after 8 seconds
    setTimeout(function () {
      dismiss();
    }, 8000);
  };

  /* ── _initFakeUpdateDialog ──────────────────────────────────── */

  I._initFakeUpdateDialog = function () {
    var self = this;

    // Create fake update overlay
    var updateDiv = document.createElement('div');
    updateDiv.id = 'fake-update';
    updateDiv.style.cssText =
      'position:fixed;inset:0;z-index:9998;display:none;' +
      'background:rgba(0,0,0,0.85);align-items:center;justify-content:center;';
    updateDiv.innerHTML =
      '<div style="background:#1a1a2e;border:1px solid rgba(168,85,247,0.3);border-radius:16px;padding:40px;max-width:420px;width:90%;text-align:center;font-family:system-ui,sans-serif;color:#fff;">' +
        '<div style="font-size:3em;margin-bottom:16px;">&#x1F504;</div>' +
        '<h2 style="font-size:1.4em;margin-bottom:8px;">Update Required</h2>' +
        '<p style="font-size:0.85em;color:rgba(255,255,255,0.5);margin-bottom:24px;">' +
          'IntuiNO v6.6.6 is available. This update contains critical chaos improvements.' +
        '</p>' +
        '<div id="fake-update-progress-wrap" style="display:none;margin-bottom:20px;">' +
          '<div style="background:rgba(255,255,255,0.1);border-radius:8px;height:12px;overflow:hidden;margin-bottom:8px;">' +
            '<div id="fake-update-bar" style="background:linear-gradient(90deg,#00f0ff,#a855f7);height:100%;width:0%;border-radius:8px;transition:width 0.3s;"></div>' +
          '</div>' +
          '<div id="fake-update-status" style="font-size:0.8em;color:rgba(255,255,255,0.5);">Downloading...</div>' +
        '</div>' +
        '<div id="fake-update-buttons">' +
          '<button id="fake-update-now" style="background:linear-gradient(135deg,#00f0ff,#a855f7);color:#fff;border:none;padding:10px 28px;border-radius:8px;font-size:1em;cursor:pointer;margin:4px;">Update Now</button>' +
          '<button id="fake-update-later" style="background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.6);border:1px solid rgba(255,255,255,0.1);padding:10px 28px;border-radius:8px;font-size:1em;cursor:pointer;margin:4px;">Remind Me Later</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(updateDiv);

    var progressWrap = updateDiv.querySelector('#fake-update-progress-wrap');
    var progressBar = updateDiv.querySelector('#fake-update-bar');
    var statusText = updateDiv.querySelector('#fake-update-status');
    var buttonsDiv = updateDiv.querySelector('#fake-update-buttons');

    var updateNowBtn = updateDiv.querySelector('#fake-update-now');
    var updateLaterBtn = updateDiv.querySelector('#fake-update-later');

    var updateTimer = null;
    var remindTimer = null;

    var showUpdate = function () {
      if (self.state.chaosTier < 2) return;
      if (updateDiv.style.display === 'flex') return;
      updateDiv.style.display = 'flex';
      progressWrap.style.display = 'none';
      buttonsDiv.style.display = 'block';
      progressBar.style.width = '0%';
      statusText.textContent = 'Downloading...';
      statusText.style.color = 'rgba(255,255,255,0.5)';
    };

    var hideUpdate = function () {
      updateDiv.style.display = 'none';
      if (updateTimer) { clearInterval(updateTimer); updateTimer = null; }
    };

    // "Update Now" — fake download that stalls at 73%
    updateNowBtn.addEventListener('click', function () {
      buttonsDiv.style.display = 'none';
      progressWrap.style.display = 'block';
      var pct = 0;
      updateTimer = setInterval(function () {
        pct += Math.floor(Math.random() * 8) + 2;
        if (pct >= 73) {
          pct = 73;
          clearInterval(updateTimer);
          updateTimer = null;
          progressBar.style.width = '73%';
          statusText.textContent = 'Update failed. Error: CHAOS_NOT_FOUND';
          statusText.style.color = '#ff6b6b';
          self.addChaos(3);
          if (typeof self.toast === 'function') {
            self.toast('Update failed spectacularly.', 'error');
          }
          setTimeout(function () {
            hideUpdate();
          }, 3000);
        } else {
          progressBar.style.width = pct + '%';
          statusText.textContent = 'Downloading... ' + pct + '%';
        }
      }, 400);
      self.addChaos(2);
    });

    // "Remind Me Later" — comes back in 30s
    updateLaterBtn.addEventListener('click', function () {
      hideUpdate();
      self.addChaos(1);
      if (typeof self.toast === 'function') {
        self.toast('Fine, we\'ll remind you. Very soon.', 'warn');
      }
      if (remindTimer) clearTimeout(remindTimer);
      remindTimer = setTimeout(function () {
        showUpdate();
        scheduleNext();
      }, 30000);
    });

    // Schedule recurring fake updates at Tier 2+
    var scheduleNext = function () {
      var delay = (60 + Math.floor(Math.random() * 31)) * 1000; // 60-90 seconds
      if (remindTimer) clearTimeout(remindTimer);
      remindTimer = setTimeout(function () {
        showUpdate();
        scheduleNext();
      }, delay);
    };

    // Only start the cycle if already at Tier 2+; also listen for tier changes
    if (self.state.chaosTier >= 2) {
      scheduleNext();
    }

    // Hook into tier changes — start scheduling once Tier 2 is reached
    var origOnTierChange = I.onTierChange ? I.onTierChange.bind(I) : null;
    I.onTierChange = function (tier) {
      if (origOnTierChange) origOnTierChange(tier);
      if (tier >= 2 && !remindTimer) {
        scheduleNext();
      }
    };
  };

})(IntuiNO);
