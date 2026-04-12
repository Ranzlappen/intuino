/**
 * IntuiNO — Web Audio Synthesized Sound Engine
 * All sounds are generated procedurally — no audio files needed.
 */
(function (I) {
  'use strict';

  var SOUND_MAP = {
    'click':      '_sndClick',
    'chaos':      '_sndChaos',
    'achievement':'_sndAchievement',
    'error':      '_sndError',
    'tierUp':     '_sndTierUp',
    'toast':      '_sndToast',
    'glitch':     '_sndGlitch',
    'bossStart':  '_sndBossStart',
    'bossStop':   '_sndBossStop'
  };

  /* ── initAudio ───────────────────────────────────────────────── */

  I.initAudio = function () {
    this._audioCtx = null;
    this._audioReady = false;
    this._bossDrone = null;

    var self = this;
    var initOnce = function () {
      if (!self._audioCtx) {
        self._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (self._audioCtx.state === 'suspended') {
        self._audioCtx.resume();
      }
      self._audioReady = true;
      document.removeEventListener('click', initOnce);
      document.removeEventListener('touchstart', initOnce);
    };

    document.addEventListener('click', initOnce);
    document.addEventListener('touchstart', initOnce);
  };

  /* ── _ensureAudio ────────────────────────────────────────────── */

  I._ensureAudio = function () {
    if (!this._audioCtx) {
      try {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return false;
      }
    }
    if (this._audioCtx.state === 'suspended') {
      this._audioCtx.resume();
    }
    this._audioReady = true;
    return true;
  };

  /* ── playSound ───────────────────────────────────────────────── */

  I.playSound = function (type) {
    if (this.state && this.state.settings && !this.state.settings.soundEnabled) {
      return;
    }
    if (!this._ensureAudio()) return;

    var method = SOUND_MAP[type];
    if (method && typeof this[method] === 'function') {
      this[method]();
    }
  };

  /* ── Sound Generators ────────────────────────────────────────── */

  /**
   * Click — short 800 Hz sine beep, 50 ms, low volume
   */
  I._sndClick = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  };

  /**
   * Chaos — 200-400 Hz random sawtooth, 150 ms, medium volume
   */
  I._sndChaos = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 200 + Math.random() * 200;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  };

  /**
   * Achievement — ascending 3-note arpeggio C5 E5 G5, sine, 100 ms each
   */
  I._sndAchievement = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var notes = [523, 659, 784];

    for (var i = 0; i < notes.length; i++) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      var start = now + i * 0.08; // slight overlap

      osc.type = 'sine';
      osc.frequency.value = notes[i];
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.1);
    }
  };

  /**
   * Error — descending tritone 500 Hz to 350 Hz, sawtooth, 200 ms
   */
  I._sndError = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.linearRampToValueAtTime(350, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  };

  /**
   * Tier Up — dramatic chord: 200, 250, 300 Hz sine with volume swell over 500 ms
   */
  I._sndTierUp = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var freqs = [200, 250, 300];

    for (var i = 0; i < freqs.length; i++) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freqs[i];
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  };

  /**
   * Toast — quick high-pitched blip, 1200 Hz sine, 30 ms
   */
  I._sndToast = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  };

  /**
   * Glitch — white noise burst, 100 ms
   */
  I._sndGlitch = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var sampleRate = ctx.sampleRate;
    var length = Math.floor(sampleRate * 0.1);
    var buffer = ctx.createBuffer(1, length, sampleRate);
    var data = buffer.getChannelData(0);

    for (var i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    var source = ctx.createBufferSource();
    var gain = ctx.createGain();

    source.buffer = buffer;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.1);
  };

  /**
   * Boss Start — low ominous drone at 80 Hz, sawtooth, fades in over 1 s
   */
  I._sndBossStart = function () {
    var ctx = this._audioCtx;
    var now = ctx.currentTime;

    // Stop existing drone if any
    if (this._bossDrone) {
      try { this._bossDrone.osc.stop(); } catch (e) { /* already stopped */ }
      this._bossDrone = null;
    }

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 80;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);

    this._bossDrone = { osc: osc, gain: gain };
  };

  /**
   * Boss Stop — fades out and stops the drone
   */
  I._sndBossStop = function () {
    if (!this._bossDrone) return;

    var ctx = this._audioCtx;
    var now = ctx.currentTime;
    var drone = this._bossDrone;

    drone.gain.gain.cancelScheduledValues(now);
    drone.gain.gain.setValueAtTime(drone.gain.gain.value, now);
    drone.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    var osc = drone.osc;
    setTimeout(function () {
      try { osc.stop(); } catch (e) { /* already stopped */ }
    }, 600);

    this._bossDrone = null;
  };

})(IntuiNO);
