/**
 * IntuiNO — Social Features
 * Shareable chaos cards and stats dashboard.
 */
(function (I) {
  'use strict';

  var TIER_NAMES = ['Calm', 'Mild Annoyance', 'Moderate Mayhem', 'Severe Dysfunction', 'Total Anarchy'];

  /* ── initSocial ─────────────────────────────────────────────── */

  I.initSocial = function () {
    var self = this;

    // Share button in the hub
    var shareBtn = document.getElementById('share-chaos-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        self._generateShareCard();
      });
    }

    // Stats link navigates to the stats screen
    var statsLink = document.getElementById('stats-link');
    if (statsLink) {
      statsLink.addEventListener('click', function () {
        self._renderStats();
        self.navigate('stats');
      });
    }
  };

  /* ── _generateShareCard ─────────────────────────────────────── */

  I._generateShareCard = function () {
    var self = this;
    var canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    var ctx = canvas.getContext('2d');

    // Gradient background (dark purple to dark blue)
    var gradient = ctx.createLinearGradient(0, 0, 400, 250);
    gradient.addColorStop(0, '#2d1b69');
    gradient.addColorStop(1, '#0f1b4d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 250);

    // "IntuiNO" title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('IntuiNO', 200, 45);

    // Chaos score in large neon cyan text
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(String(this.state.chaosScore), 200, 115);

    // Label under score
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '14px sans-serif';
    ctx.fillText('Chaos Score', 200, 135);

    // Tier name
    var tierName = TIER_NAMES[this.state.chaosTier] || TIER_NAMES[0];
    ctx.fillStyle = '#a855f7';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(tierName, 200, 170);

    // Levels completed and achievements count
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px sans-serif';
    ctx.fillText(
      'Levels: ' + this.state.levelsCompleted.length + '/10  |  Achievements: ' + this.state.achievements.length,
      200,
      200
    );

    // Tagline
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '12px sans-serif';
    ctx.fillText('Intuitively Wrong.', 200, 235);

    // Try Web Share API with file
    canvas.toBlob(function (blob) {
      if (!blob) return;

      if (navigator.share && navigator.canShare) {
        var file = new File([blob], 'intuino-chaos.png', { type: 'image/png' });
        var shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          navigator.share(shareData).catch(function () {
            // Fallback on share failure
            self._openCardFallback(canvas);
          });
        } else {
          self._openCardFallback(canvas);
        }
      } else {
        self._openCardFallback(canvas);
      }
    }, 'image/png');

    // Award 3 chaos for sharing
    this.addChaos(3);
  };

  /* ── _openCardFallback ──────────────────────────────────────── */

  I._openCardFallback = function (canvas) {
    var dataUrl = canvas.toDataURL('image/png');
    window.open(dataUrl, '_blank');
  };

  /* ── _renderStats ───────────────────────────────────────────── */

  I._renderStats = function () {
    var container = document.getElementById('stats-content');
    if (!container) return;

    var score = this.state.chaosScore;
    var stats = this.state.stats;
    var tierName = TIER_NAMES[this.state.chaosTier] || TIER_NAMES[0];
    var levelsCount = this.state.levelsCompleted.length;
    var achievementsCount = this.state.achievements.length;
    var sessionsPlayed = stats.sessionsPlayed || 1;
    var chaosPerSession = (score / sessionsPlayed).toFixed(1);

    container.innerHTML =
      '<div class="stat-row"><span class="stat-label">Total Chaos Score</span><span class="stat-value">' + score + '</span></div>' +
      '<div class="stat-row"><span class="stat-label">Chaos Events Triggered</span><span class="stat-value">' + (stats.totalChaosEvents || 0) + '</span></div>' +
      '<div class="stat-row"><span class="stat-label">Sessions Played</span><span class="stat-value">' + sessionsPlayed + '</span></div>' +
      '<div class="stat-row"><span class="stat-label">Total Clicks</span><span class="stat-value">' + (stats.totalClicks || 0) + '</span></div>' +
      '<div class="stat-row"><span class="stat-label">Current Tier</span><span class="stat-value">' + tierName + '</span></div>' +
      '<div class="stat-row"><span class="stat-label">Levels Completed</span><span class="stat-value">' + levelsCount + ' / 10</span></div>' +
      '<div class="stat-row"><span class="stat-label">Achievements</span><span class="stat-value">' + achievementsCount + ' / 22</span></div>' +
      '<div class="stat-row"><span class="stat-label">Chaos Per Session</span><span class="stat-value">' + chaosPerSession + '</span></div>';
  };

})(IntuiNO);
