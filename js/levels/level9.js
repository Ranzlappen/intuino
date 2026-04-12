(function(I) {
  I.initLevel9 = function() {
    var self = this;

    // --- Confirmshaming unsubscribe ---
    document.getElementById('l9-unsub-yes').addEventListener('click', function() {
      self.addChaos(3); self.levelProg(9);
      self.toast('You unsubscribed... or did you?', 'info');
    });

    document.getElementById('l9-unsub-no').addEventListener('click', function() {
      self.addChaos(3); self.levelProg(9);
      self.toast('Great choice! (Was it though?)', 'success');
    });

    // --- Pricing: hidden fees revealed ---
    document.getElementById('l9-free-plan').addEventListener('click', function() {
      var fineprint = this.querySelector('.l9-hidden-fees');
      if (fineprint) {
        fineprint.classList.remove('hidden');
        self.addChaos(4); self.levelProg(9);
        self.toast('Free* (* Plus $17.97/month in surprise fees)', 'warn');
      }
    });

    // --- Cart: remove button ADDS items ---
    var extraItems = ['Premium Air', 'Invisible Widget', 'Mystery Box', 'Digital Dust', 'Virtual Nothing'];
    var cartSection = document.getElementById('l9-cart-section');

    cartSection.addEventListener('click', function(e) {
      var removeBtn = e.target.closest('.l9-remove-btn');
      if (!removeBtn) return;

      var cartList = cartSection.querySelector('.l9-cart-list') || cartSection;
      var newItem = document.createElement('div');
      newItem.className = 'glass-card p-3 mb-2 flex justify-between items-center text-sm text-white/80';
      var randomName = extraItems[Math.floor(Math.random() * extraItems.length)];
      var randomPrice = (Math.random() * 50 + 1).toFixed(2);
      newItem.innerHTML = '<span>' + randomName + ' — $' + randomPrice + '</span>' +
        '<button class="l9-remove-btn text-red-400 hover:text-red-300 text-xs ml-2">Remove</button>';
      cartList.appendChild(newItem);
      self.addChaos(3); self.levelProg(9);
      self.toast('Removing added "' + randomName + '" to your cart!', 'warn');
    });

    // --- Confusing opt-out checkbox ---
    var optOutTriggered = false;
    document.getElementById('l9-optout').addEventListener('change', function() {
      self.addChaos(3); self.levelProg(9);
      if (!optOutTriggered) {
        optOutTriggered = true;
        self.toast('Uncheck to not opt-out of not receiving no emails = you WILL get emails. Or will you?', 'info');
      } else {
        self.toast('Still confused? That\'s the point.', 'info');
      }
    });

    // --- Fake countdown that resets ---
    var countdownEl = document.getElementById('l9-countdown');
    var countdownSeconds = 600; // 10:00
    var countdownReset = false;

    var countdownInterval = setInterval(function() {
      if (self.state.currentScreen !== 'level9') { clearInterval(countdownInterval); return; }
      countdownSeconds--;
      if (countdownSeconds <= 0) {
        countdownSeconds = 600;
        if (!countdownReset) {
          countdownReset = true;
          self.addChaos(4); self.levelProg(9);
          self.toast('The countdown reset! The deal never actually expires.', 'error');
        }
      }
      var mins = Math.floor(countdownSeconds / 60);
      var secs = countdownSeconds % 60;
      countdownEl.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    }, 1000);

    // Use a faster countdown for playability: tick every 100ms for visual speed
    // Actually let's keep 1s ticks but start at 15 seconds for better UX in a game
    countdownSeconds = 15;

    // --- Fine print that runs away ---
    var finePrint = document.getElementById('l9-fine-print');
    var finePrintTriggered = false;
    var fpOffsetX = 0;
    var fpOffsetY = 0;

    var moveHandler = function(e) {
      if (self.state.currentScreen !== 'level9') {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('touchmove', touchHandler);
        return;
      }
      var rect = finePrint.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var dx = e.clientX - centerX;
      var dy = e.clientY - centerY;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        // Move opposite to cursor direction
        var pushX = dx === 0 ? 0 : -(dx / Math.abs(dx)) * (30 - dist * 0.1);
        var pushY = dy === 0 ? 0 : -(dy / Math.abs(dy)) * (30 - dist * 0.1);
        fpOffsetX += pushX;
        fpOffsetY += pushY;
        // Clamp to reasonable bounds
        fpOffsetX = Math.max(-100, Math.min(100, fpOffsetX));
        fpOffsetY = Math.max(-60, Math.min(60, fpOffsetY));
        finePrint.style.transform = 'translate(' + fpOffsetX + 'px, ' + fpOffsetY + 'px)';
        finePrint.style.transition = 'transform 0.15s ease-out';

        if (!finePrintTriggered) {
          finePrintTriggered = true;
          self.addChaos(3); self.levelProg(9);
          self.toast('The fine print is running away from you!', 'warn');
        }
      }
    };

    var touchHandler = function(e) {
      if (e.touches.length > 0) {
        moveHandler({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
      }
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', touchHandler, { passive: true });

    // --- Complete button ---
    document.getElementById('l9-complete').addEventListener('click', function() {
      clearInterval(countdownInterval);
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('touchmove', touchHandler);
      self.completeLevel(9);
    });
  };
})(IntuiNO);
