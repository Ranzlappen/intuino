/**
 * IntuiNO — Visual Effects System
 * Particle bursts and screen shake.
 */
(function (I) {
  'use strict';

  /* ── initEffects ─────────────────────────────────────────────── */

  I.initEffects = function () {
    var canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);

    this._particleCanvas = canvas;
    this._particleCtx = canvas.getContext('2d');
    this._particles = [];
    this._particleLoopRunning = false;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
  };

  /* ── screenShake ─────────────────────────────────────────────── */

  I.screenShake = function (intensity, duration) {
    document.body.style.setProperty('--shake-intensity', intensity + 'px');
    document.body.classList.add('chaos-shake');
    setTimeout(function () {
      document.body.classList.remove('chaos-shake');
      document.body.style.removeProperty('--shake-intensity');
    }, duration);
  };

  /* ── particleBurst ───────────────────────────────────────────── */

  I.particleBurst = function (x, y, type, count) {
    count = count || 20;

    for (var i = 0; i < count; i++) {
      var p = null;

      switch (type) {
        case 'confetti':
          p = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 1) * 5 - 2,
            size: Math.random() * 5 + 3,
            color: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6fc8', '#845ec2'][
              Math.floor(Math.random() * 6)
            ],
            life: 1,
            maxLife: 1,
            gravity: 0.08
          };
          break;

        case 'sparks':
          p = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            size: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? '#ff4500' : '#ff8c00',
            life: 1,
            maxLife: 1,
            gravity: 0.05
          };
          break;

        case 'chaos':
          p = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 4 + 2,
            color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff',
            life: 1,
            maxLife: 1,
            gravity: 0
          };
          break;

        default:
          p = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 1) * 4,
            size: Math.random() * 3 + 2,
            color: '#ffffff',
            life: 1,
            maxLife: 1,
            gravity: 0.06
          };
      }

      this._particles.push(p);
    }

    // Start the render loop if it's not already running
    if (!this._particleLoopRunning) {
      this._particleLoop();
    }
  };

  /* ── _particleLoop ───────────────────────────────────────────── */

  I._particleLoop = function () {
    var self = this;
    self._particleLoopRunning = true;

    requestAnimationFrame(function loop() {
      var particles = self._particles;
      var ctx = self._particleCtx;
      var canvas = self._particleCanvas;

      if (particles.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];

          // Update physics
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;

          // Erratic movement for chaos type
          if (p.color === '#00ffff' || p.color === '#ff00ff') {
            p.vx += (Math.random() - 0.5) * 1.5;
            p.vy += (Math.random() - 0.5) * 1.5;
          }

          // Fade based on remaining life
          var fadeRate = (p.color === '#ff4500' || p.color === '#ff8c00') ? 0.04 : 0.015;
          p.life -= fadeRate;

          // Remove dead particles
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          // Draw
          ctx.globalAlpha = p.life / p.maxLife;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
      } else {
        // All particles gone — clear canvas and stop the loop
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        self._particleLoopRunning = false;
      }
    });
  };

})(IntuiNO);
