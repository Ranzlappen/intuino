(function(I) {
  I.initLevel8 = function() {
    document.getElementById('l8-complete').addEventListener('click', function() {
      this.completeLevel(8);
    }.bind(this));
  };

  I.startLevel8 = function() {
    var self = this;
    var notifMessages = [
      'New follower!',
      'Someone liked your post!',
      'Flash sale: 99% off!',
      'Your order shipped!',
      'Rate our app!',
      'Weekly digest ready',
      'Security alert!',
      'Friend request!',
      'Breaking news!',
      'Reminder: Drink water'
    ];
    var notifCount = 0;
    var notifStack = document.getElementById('l8-notif-stack');
    var currentDelay = 2000;

    // --- Helper: create a fake notification ---
    function createNotif(message) {
      var div = document.createElement('div');
      div.className = 'glass-card p-3 mb-2 text-sm text-white/80 border border-white/10 animate-fade-in';
      div.textContent = message || notifMessages[Math.floor(Math.random() * notifMessages.length)];
      notifStack.prepend(div);
      notifCount++;
      if (notifCount <= 3) {
        self.addChaos(2); self.levelProg(8);
      }
      return div;
    }

    // --- Notification spam interval ---
    var _l8NotifInterval = setInterval(function() {
      if (self.state.currentScreen !== 'level8') { cleanup(); return; }
      createNotif();
    }, currentDelay);

    // --- "Turn off notifications" button: DOUBLES frequency ---
    document.getElementById('l8-disable-btn').addEventListener('click', function() {
      clearInterval(_l8NotifInterval);
      currentDelay = Math.max(250, currentDelay / 2);
      _l8NotifInterval = setInterval(function() {
        if (self.state.currentScreen !== 'level8') { cleanup(); return; }
        createNotif();
      }, currentDelay);
      self.addChaos(4); self.levelProg(8);
      self.toast('Notifications have been... amplified.', 'warn');
    });

    // --- "Unsubscribe" button: subscribes to MORE ---
    var randomLists = ['Cat Facts', 'Daily Horoscopes', 'Elevator Music Updates', 'Bread Enthusiast Weekly', 'Lint Collecting Quarterly', 'Sock Puppet Digest'];
    document.getElementById('l8-unsub-btn').addEventListener('click', function() {
      for (var i = 0; i < 3; i++) {
        var list = randomLists[Math.floor(Math.random() * randomLists.length)];
        createNotif('You\'ve been subscribed to: ' + list);
      }
      self.addChaos(4); self.levelProg(8);
      self.toast('Unsubscribe? More like subscribe to more!', 'error');
    });

    // --- Badge counter: click ADDS 10 instead of clearing ---
    var badgeClicked = false;
    var badgeEl = document.getElementById('l8-badge-counter');
    var badgeCount = 99;
    badgeEl.textContent = badgeCount;

    badgeEl.addEventListener('click', function() {
      badgeCount += 10;
      badgeEl.textContent = badgeCount;
      if (!badgeClicked) {
        badgeClicked = true;
        self.addChaos(3); self.levelProg(8);
        self.toast('Clicking the badge adds MORE notifications!', 'warn');
      }
    });

    // --- "Clear All" button: works, then brings them all back ---
    var savedNotifs = [];
    document.getElementById('l8-clear-all').addEventListener('click', function() {
      // Save current notifications
      savedNotifs = [];
      var children = notifStack.querySelectorAll('.glass-card');
      for (var i = 0; i < children.length; i++) {
        savedNotifs.push(children[i].textContent);
      }
      notifStack.innerHTML = '';

      // Bring them all back after 1 second
      setTimeout(function() {
        if (self.state.currentScreen !== 'level8') return;
        for (var i = 0; i < savedNotifs.length; i++) {
          createNotif(savedNotifs[i]);
        }
        self.addChaos(4); self.levelProg(8);
        self.toast('All notifications have returned!', 'error');
      }, 1000);
    });

    // --- Red dot badges on random elements ---
    var dotsAdded = false;
    var dotElements = [];
    if (!dotsAdded) {
      dotsAdded = true;
      var allElements = document.querySelectorAll('#screen-level8 .glass-card, #screen-level8 button, #screen-level8 h2, #screen-level8 h3');
      var candidates = Array.prototype.slice.call(allElements);
      // Shuffle and pick 5
      for (var i = candidates.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = candidates[i];
        candidates[i] = candidates[j];
        candidates[j] = temp;
      }
      var count = Math.min(5, candidates.length);
      for (var k = 0; k < count; k++) {
        var el = candidates[k];
        el.style.position = el.style.position || 'relative';
        var dot = document.createElement('span');
        dot.className = 'l8-dot absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500';
        el.appendChild(dot);
        dotElements.push(dot);
      }
      self.addChaos(3); self.levelProg(8);
    }

    // --- Cleanup on navigate away ---
    function cleanup() {
      if (_l8NotifInterval) {
        clearInterval(_l8NotifInterval);
        _l8NotifInterval = null;
      }
      for (var i = 0; i < dotElements.length; i++) {
        if (dotElements[i].parentNode) {
          dotElements[i].parentNode.removeChild(dotElements[i]);
        }
      }
      dotElements = [];
    }

    // Store cleanup reference on state for external use
    self.state._l8Cleanup = cleanup;
  };
})(IntuiNO);
