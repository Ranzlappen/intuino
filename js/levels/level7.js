(function(I) {
  I.initLevel7 = function() {
    document.getElementById('l7-complete').addEventListener('click', function() {
      this.completeLevel(7);
    }.bind(this));
  };

  I.startLevel7 = function() {
    var self = this;
    var intervals = [];

    // --- Main progress bar: 0->99% over 8 seconds, then resets ---
    var mainProg = 0;
    var resetCount = 0;
    var hiddenShown = false;
    var mainBar = document.getElementById('l7-progress-main');
    var mainBarInner = mainBar.querySelector('.l7-bar-fill') || mainBar;
    var mainText = document.getElementById('l7-progress-text');

    var mainInterval = setInterval(function() {
      if (self.state.currentScreen !== 'level7') { clearAllIntervals(); return; }
      mainProg += (99 / (8000 / 100)); // increment to reach 99 in ~8s
      if (mainProg >= 99) {
        mainProg = 0;
        resetCount++;
        self.addChaos(3); self.levelProg(7);
        self.toast('Progress reset! Back to 0%.', 'warn');

        // Show hidden bar on first reset
        if (!hiddenShown) {
          hiddenShown = true;
          var hiddenBar = document.getElementById('l7-progress-hidden');
          hiddenBar.classList.remove('hidden');
          self.addChaos(3); self.levelProg(7);
          self.toast('Just kidding, here\'s the real progress...', 'info');
          var hiddenProg = 0;
          var hiddenInner = hiddenBar.querySelector('.l7-bar-fill') || hiddenBar;
          var hiddenInterval = setInterval(function() {
            if (self.state.currentScreen !== 'level7') { clearInterval(hiddenInterval); return; }
            hiddenProg += 0.5;
            if (hiddenProg > 99) hiddenProg = 99;
            hiddenInner.style.width = hiddenProg + '%';
          }, 100);
          intervals.push(hiddenInterval);
        }
      }
      mainBarInner.style.width = Math.round(mainProg) + '%';
      mainText.textContent = Math.round(mainProg) + '%';
    }, 100);
    intervals.push(mainInterval);

    // --- Time estimate escalation ---
    var timeEstimates = ['2 seconds', '5 seconds', '30 seconds', '2 minutes', '3 hours', '2 days', '47 years', 'Heat death of universe'];
    var timeIndex = 0;
    var timeChaosCount = 0;
    var timeText = document.getElementById('l7-time-text');
    timeText.textContent = timeEstimates[0];

    var timeInterval = setInterval(function() {
      if (self.state.currentScreen !== 'level7') { clearAllIntervals(); return; }
      timeIndex++;
      if (timeIndex >= timeEstimates.length) timeIndex = timeEstimates.length - 1;
      timeText.textContent = timeEstimates[timeIndex];
      if (timeChaosCount < 3) {
        timeChaosCount++;
        self.addChaos(2); self.levelProg(7);
        self.toast('Estimated time: ' + timeEstimates[timeIndex], 'warn');
      }
    }, 2000);
    intervals.push(timeInterval);

    // --- Spinner visibility trick ---
    var spinnerTriggered = false;
    var spinner = document.getElementById('l7-spinner');

    var onVisChange = function() {
      if (self.state.currentScreen !== 'level7') {
        document.removeEventListener('visibilitychange', onVisChange);
        return;
      }
      if (document.hidden) {
        // Store fast speed (no visible change needed while hidden)
        spinner.dataset.speed = 'fast';
      } else {
        // When visible again, slow it down
        spinner.style.animationDuration = '5s';
        if (!spinnerTriggered) {
          spinnerTriggered = true;
          self.addChaos(3); self.levelProg(7);
          self.toast('The spinner slowed down when you looked away and came back!', 'info');
        }
      }
    };
    document.addEventListener('visibilitychange', onVisChange);

    // --- Secret: clicking the progress bar container completes loading ---
    var barClickHandler = function() {
      clearAllIntervals();
      mainBarInner.style.width = '100%';
      mainText.textContent = '100%';
      self.addChaos(5); self.levelProg(7);
      self.toast('You clicked the progress bar?! That actually worked!', 'success');
      mainBar.removeEventListener('click', barClickHandler);
    };
    mainBar.addEventListener('click', barClickHandler);

    // --- Cleanup helper ---
    function clearAllIntervals() {
      for (var i = 0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
      }
      intervals = [];
      document.removeEventListener('visibilitychange', onVisChange);
    }
  };
})(IntuiNO);
