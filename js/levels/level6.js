(function(I) {
  I.initLevel6 = function() {
    var self = this;

    // --- Modal Stack: X buttons open the NEXT modal instead of closing ---
    document.getElementById('l6-trigger-btn').addEventListener('click', function() {
      document.getElementById('l6-modal-1').classList.remove('hidden');
    });

    document.getElementById('l6-modal1-close').addEventListener('click', function() {
      self.addChaos(4); self.levelProg(6);
      self.toast('Close button opened another modal!', 'warn');
      document.getElementById('l6-modal-2').classList.remove('hidden');
    });

    document.getElementById('l6-modal2-close').addEventListener('click', function() {
      self.addChaos(4); self.levelProg(6);
      self.toast('Still not closing... another modal appeared!', 'warn');
      document.getElementById('l6-modal-3').classList.remove('hidden');
    });

    document.getElementById('l6-modal3-close').addEventListener('click', function() {
      self.addChaos(3); self.levelProg(6);
      self.toast('That X button does absolutely nothing. Good luck.', 'error');
    });

    // Secret tiny link that actually closes all modals
    document.getElementById('l6-secret-close').addEventListener('click', function() {
      document.getElementById('l6-modal-1').classList.add('hidden');
      document.getElementById('l6-modal-2').classList.add('hidden');
      document.getElementById('l6-modal-3').classList.add('hidden');
      self.toast('You found the secret close link!', 'success');
    });

    // --- Confirmation chain ---
    document.getElementById('l6-confirm-btn').addEventListener('click', function() {
      document.getElementById('l6-confirm-1').classList.remove('hidden');
    });

    document.getElementById('l6-confirm-1').querySelector('.l6-confirm-yes').addEventListener('click', function() {
      self.addChaos(3); self.levelProg(6);
      document.getElementById('l6-confirm-1').classList.add('hidden');
      document.getElementById('l6-confirm-2').classList.remove('hidden');
    });
    document.getElementById('l6-confirm-1').querySelector('.l6-confirm-no').addEventListener('click', function() {
      document.getElementById('l6-confirm-1').classList.add('hidden');
    });

    document.getElementById('l6-confirm-2').querySelector('.l6-confirm-yes').addEventListener('click', function() {
      self.addChaos(3); self.levelProg(6);
      document.getElementById('l6-confirm-2').classList.add('hidden');
      document.getElementById('l6-confirm-3').classList.remove('hidden');
    });
    document.getElementById('l6-confirm-2').querySelector('.l6-confirm-no').addEventListener('click', function() {
      document.getElementById('l6-confirm-2').classList.add('hidden');
    });

    document.getElementById('l6-confirm-3').querySelector('.l6-confirm-yes').addEventListener('click', function() {
      self.addChaos(3); self.levelProg(6);
      document.getElementById('l6-confirm-3').classList.add('hidden');
      self.toast('Confirmed! ...Nothing happened.', 'info');
    });
    document.getElementById('l6-confirm-3').querySelector('.l6-confirm-no').addEventListener('click', function() {
      document.getElementById('l6-confirm-3').classList.add('hidden');
    });

    // --- Expanding modal ---
    var expandInterval = null;
    document.getElementById('l6-expand-trigger').addEventListener('click', function() {
      var modal = document.getElementById('l6-expanding-modal');
      modal.classList.remove('hidden');
      var size = 200;
      modal.style.width = size + 'px';
      modal.style.height = size + 'px';

      expandInterval = setInterval(function() {
        size += 15;
        var maxW = window.innerWidth;
        var maxH = window.innerHeight;
        modal.style.width = Math.min(size, maxW) + 'px';
        modal.style.height = Math.min(size, maxH) + 'px';
        if (size >= maxW && size >= maxH) {
          clearInterval(expandInterval);
          expandInterval = null;
        }
      }, 50); // 5 seconds to fill: ~100 steps * 50ms
    });

    document.getElementById('l6-expanding-modal').addEventListener('click', function() {
      if (expandInterval) {
        clearInterval(expandInterval);
        expandInterval = null;
      }
      self.addChaos(4); self.levelProg(6);
      self.toast('You stopped the expanding modal!', 'success');
      document.getElementById('l6-expanding-modal').classList.add('hidden');
    });

    // --- Complete button ---
    document.getElementById('l6-complete').addEventListener('click', function() {
      self.completeLevel(6);
    });
  };
})(IntuiNO);
