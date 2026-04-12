/**
 * IntuiNO — Chaos Engine
 * Tracks cumulative chaos score and applies escalating global effects.
 */
(function (I) {
  'use strict';

  var TIER_THRESHOLDS = [0, 50, 150, 300, 500];
  var TIER_NAMES = ['Calm', 'Mild Annoyance', 'Moderate Mayhem', 'Severe Dysfunction', 'Total Anarchy'];

  var TITLE_POOL = [
    'Loading...',
    '(1) New Message',
    'Error 404',
    'Downloading virus.exe...',
    'Are you still there?',
    'SYSTEM ALERT',
    '\u{1F525} CRITICAL ERROR',
    'Your session expired',
    'IntuiNO \u2014 Intuitively Wrong.'
  ];

  var FAVICON_EMOJIS = ['\u26A0\uFE0F', '\u{1F480}', '\u{1F525}', '\u2728'];

  /* ── helpers ─────────────────────────────────────────────────── */

  function tierFromScore(score) {
    for (var t = TIER_THRESHOLDS.length - 1; t >= 0; t--) {
      if (score >= TIER_THRESHOLDS[t]) return t;
    }
    return 0;
  }

  function randRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /* ── initChaosEngine ─────────────────────────────────────────── */

  I.initChaosEngine = function () {
    this._titleChaosInterval = null;
    this._elementDriftInterval = null;
    this._inversionPulseInterval = null;
    this._faviconInterval = null;
    this._faviconIndex = 0;
    this._originalTitle = document.title;

    // Derive tier from any previously loaded state
    var currentTier = tierFromScore(this.state.chaosScore || 0);
    this.state.chaosTier = currentTier;

    // Apply the correct CSS class right away
    for (var i = 0; i <= 4; i++) {
      document.body.classList.remove('chaos-tier-' + i);
    }
    document.body.classList.add('chaos-tier-' + currentTier);

    // Start effects for the current tier if above 0
    if (currentTier > 0) {
      this._startTierEffects(currentTier);
    }
  };

  /* ── updateChaosEffects ──────────────────────────────────────── */

  I.updateChaosEffects = function () {
    var score = this.state.chaosScore || 0;
    var newTier = tierFromScore(score);
    var oldTier = this.state.chaosTier;

    // Swap CSS tier class
    for (var i = 0; i <= 4; i++) {
      document.body.classList.remove('chaos-tier-' + i);
    }
    document.body.classList.add('chaos-tier-' + newTier);

    if (newTier !== oldTier) {
      this.state.chaosTier = newTier;
      this.onTierChange(newTier);
    }
  };

  /* ── onTierChange ────────────────────────────────────────────── */

  I.onTierChange = function (tier) {
    // Toast announcement
    if (typeof this.showToast === 'function') {
      this.showToast('Chaos Tier ' + tier + ': ' + TIER_NAMES[tier], 'chaos');
    }

    // Screen shake feedback
    if (typeof this.screenShake === 'function') {
      this.screenShake(5, 500);
    }

    // Sound feedback
    if (typeof this.playSound === 'function') {
      this.playSound('tierUp');
    }

    // Achievement at max tier
    if (tier === 4 && typeof this.unlockAchievement === 'function') {
      this.unlockAchievement('chaosMaster');
    }

    // Restart tier-specific intervals
    this._stopAllTierEffects();
    if (tier > 0) {
      this._startTierEffects(tier);
    }
  };

  /* ── _startTierEffects ───────────────────────────────────────── */

  I._startTierEffects = function (tier) {
    var self = this;

    // Tier 1+: Title chaos
    if (tier >= 1) {
      this._titleChaosInterval = setInterval(function () {
        document.title = TITLE_POOL[Math.floor(Math.random() * TITLE_POOL.length)];
      }, randRange(8000, 15000));
    }

    // Tier 2+: Element drift
    if (tier >= 2) {
      this._elementDriftInterval = setInterval(function () {
        var cards = document.querySelectorAll('.glass-card');
        if (cards.length === 0) return;
        var card = cards[Math.floor(Math.random() * cards.length)];
        var tx = randRange(-6, 6);
        var ty = randRange(-6, 6);
        var rot = randRange(-3, 3);
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) rotate(' + rot + 'deg)';
        setTimeout(function () {
          card.style.transform = '';
          setTimeout(function () {
            card.style.transition = '';
          }, 300);
        }, 1000);
      }, 3000);
    }

    // Tier 3+: Inversion pulse
    if (tier >= 3) {
      this._inversionPulseInterval = setInterval(function () {
        document.body.classList.add('chaos-invert');
        setTimeout(function () {
          document.body.classList.remove('chaos-invert');
        }, 300);
      }, randRange(10000, 20000));
    }

    // Tier 4+: Favicon cycling
    if (tier >= 4) {
      self._faviconIndex = 0;
      this._faviconInterval = setInterval(function () {
        self._setFavicon(FAVICON_EMOJIS[self._faviconIndex]);
        self._faviconIndex = (self._faviconIndex + 1) % FAVICON_EMOJIS.length;
      }, 2000);
    }
  };

  /* ── _stopAllTierEffects ─────────────────────────────────────── */

  I._stopAllTierEffects = function () {
    if (this._titleChaosInterval) {
      clearInterval(this._titleChaosInterval);
      this._titleChaosInterval = null;
      document.title = this._originalTitle || 'IntuiNO';
    }
    if (this._elementDriftInterval) {
      clearInterval(this._elementDriftInterval);
      this._elementDriftInterval = null;
    }
    if (this._inversionPulseInterval) {
      clearInterval(this._inversionPulseInterval);
      this._inversionPulseInterval = null;
      document.body.classList.remove('chaos-invert');
    }
    if (this._faviconInterval) {
      clearInterval(this._faviconInterval);
      this._faviconInterval = null;
    }
  };

  /* ── _setFavicon ─────────────────────────────────────────────── */

  I._setFavicon = function (emoji) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      '<text y="0.9em" font-size="80">' + emoji + '</text></svg>';
    var dataUri = 'data:image/svg+xml,' + encodeURIComponent(svg);

    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = dataUri;
  };

})(IntuiNO);
