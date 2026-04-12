(function(I) {
  I.initLevel3 = function() {
    const area = document.getElementById('l3-swipe-area');
    const card = document.getElementById('l3-swipe-card');
    const hasGsap = typeof gsap !== 'undefined';
    let startX = 0, currentX = 0, dragging = false;

    const updateSwipeCard = () => {
      const sc = this.swipeCards[this.state.swipeCardIndex % this.swipeCards.length];
      document.getElementById('l3-card-emoji').textContent = sc.emoji;
      document.getElementById('l3-card-title').textContent = sc.title;
    };

    const onStart = (x) => { startX = x; currentX = x; dragging = true; };
    const onMove = (x) => {
      if (!dragging) return;
      currentX = x;
      const diff = currentX - startX;
      const likeLabel = document.getElementById('l3-label-like');
      const skipLabel = document.getElementById('l3-label-skip');
      if (hasGsap) {
        gsap.set(card, { x: diff, rotation: diff * 0.05 });
        gsap.set(skipLabel, { opacity: Math.max(0, diff / 100) });
        gsap.set(likeLabel, { opacity: Math.max(0, -diff / 100) });
      } else {
        card.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
        skipLabel.style.opacity = Math.max(0, diff / 100);
        likeLabel.style.opacity = Math.max(0, -diff / 100);
      }
    };
    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      const diff = currentX - startX;
      const likeLabel = document.getElementById('l3-label-like');
      const skipLabel = document.getElementById('l3-label-skip');
      if (Math.abs(diff) > 80) {
        // INVERTED: right swipe = skip, left swipe = like
        const action = diff > 0 ? 'skipped' : 'liked';
        this.addChaos(3); this.levelProg(3);
        this.toast(`You ${action} it! (Directions are inverted.)`, 'info');
        const resetCard = () => {
          this.state.swipeCardIndex++;
          updateSwipeCard();
          card.style.transform = ''; card.style.opacity = '1';
          likeLabel.style.opacity = '0';
          skipLabel.style.opacity = '0';
          if (hasGsap) {
            gsap.set(card, { x: 0, opacity: 1, rotation: 0 });
            gsap.set(likeLabel, { opacity: 0 });
            gsap.set(skipLabel, { opacity: 0 });
          }
        };
        if (hasGsap) {
          gsap.to(card, { x: diff > 0 ? 300 : -300, opacity: 0, duration: 0.3, onComplete: resetCard });
        } else {
          card.style.transform = `translateX(${diff > 0 ? 300 : -300}px)`;
          card.style.opacity = '0';
          setTimeout(resetCard, 300);
        }
      } else {
        if (hasGsap) {
          gsap.to(card, { x: 0, rotation: 0, duration: 0.3, ease: 'back.out(2)' });
          gsap.to(likeLabel, { opacity: 0, duration: 0.2 });
          gsap.to(skipLabel, { opacity: 0, duration: 0.2 });
        } else {
          card.style.transform = '';
          likeLabel.style.opacity = '0';
          skipLabel.style.opacity = '0';
        }
      }
    };

    card.addEventListener('mousedown', (e) => onStart(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);
    card.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', onEnd);

    // Pinch-to-zoom (inverted) - scroll wheel for desktop
    const pinchArea = document.getElementById('l3-pinch-area');
    const pinchContent = document.getElementById('l3-pinch-content');
    let pinchTriggered = false;

    pinchArea.addEventListener('wheel', (e) => {
      e.preventDefault();
      // INVERTED: scroll up (negative deltaY) = zoom OUT, scroll down = zoom IN
      this.state.pinchScale += e.deltaY * 0.003;
      this.state.pinchScale = Math.max(0.3, Math.min(3, this.state.pinchScale));
      if (hasGsap) {
        gsap.to(pinchContent, { scale: this.state.pinchScale, duration: 0.2 });
      } else {
        pinchContent.style.transform = `scale(${this.state.pinchScale})`;
      }
      if (!pinchTriggered) { pinchTriggered = true; this.addChaos(3); this.levelProg(3); this.toast('Zoom is inverted. Naturally.', 'info'); }
    }, { passive: false });

    // Touch pinch (inverted)
    let lastPinchDist = 0;
    pinchArea.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        lastPinchDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      }
    }, { passive: true });
    pinchArea.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const delta = dist - lastPinchDist;
        // INVERTED: fingers apart (positive delta) = zoom OUT, fingers together = zoom IN
        this.state.pinchScale -= delta * 0.005;
        this.state.pinchScale = Math.max(0.3, Math.min(3, this.state.pinchScale));
        if (hasGsap) {
          gsap.to(pinchContent, { scale: this.state.pinchScale, duration: 0.1 });
        } else {
          pinchContent.style.transform = `scale(${this.state.pinchScale})`;
        }
        lastPinchDist = dist;
        if (!pinchTriggered) { pinchTriggered = true; this.addChaos(3); this.levelProg(3); this.toast('Pinch zoom is inverted!', 'info'); }
      }
    }, { passive: true });

    // Long press
    const lpBtn = document.getElementById('l3-longpress');
    let lpTimer = null, lpTriggered = false;
    const startLP = () => {
      lpTimer = setTimeout(() => {
        const section = document.getElementById('screen-level3');
        section.classList.add('chaos-shake', 'chaos-invert');
        this.addChaos(5); this.levelProg(3);
        this.toast('Long-press triggered visual chaos!', 'error');
        if (!lpTriggered) lpTriggered = true;
        setTimeout(() => section.classList.remove('chaos-shake', 'chaos-invert'), 2000);
      }, 800);
    };
    const cancelLP = () => clearTimeout(lpTimer);
    lpBtn.addEventListener('mousedown', startLP);
    lpBtn.addEventListener('mouseup', cancelLP);
    lpBtn.addEventListener('mouseleave', cancelLP);
    lpBtn.addEventListener('touchstart', startLP, { passive: true });
    lpBtn.addEventListener('touchend', cancelLP);

    document.getElementById('l3-complete').addEventListener('click', () => this.completeLevel(3));
  };
})(IntuiNO);
