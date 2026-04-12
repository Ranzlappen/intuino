(function(I) {
  I.initLevel1 = function() {
    const searchMap = {
      'profile': 'Here\'s the weather forecast for Mars.',
      'settings': 'Top 10 cat memes of 2024.',
      'messages': 'A recipe for invisible soup.',
      'home': 'Directions to the nearest black hole.',
      'help': 'A documentary about confused penguins.',
      'search': 'Did you mean: "don\'t search"?',
      'discover': 'Your horoscope says: try again.',
      'notifications': 'A live stream of paint drying.',
    };
    const defaultResults = ['A random Wikipedia article about turnips', 'How to unboil an egg (impossible)', 'The sound of one hand clapping'];

    document.getElementById('l1-search').addEventListener('input', (e) => {
      const v = e.target.value.toLowerCase().trim();
      const results = document.getElementById('l1-search-results');
      if (!v) { results.classList.add('hidden'); return; }
      results.classList.remove('hidden');
      let items = [];
      Object.keys(searchMap).forEach(k => {
        if (v.includes(k) || k.includes(v)) items.push(searchMap[k]);
      });
      if (items.length === 0) items = defaultResults;
      results.innerHTML = items.map(i => '<div class="glass-card p-3 mb-2 text-sm text-white/60 cursor-pointer hover:border-neon-cyan/30 transition">' + i + '</div>').join('');
      results.querySelectorAll('.glass-card').forEach(el => {
        el.addEventListener('click', () => {
          this.addChaos(3);
          this.levelProg(1);
          this.toast('That wasn\'t what you searched for.', 'warn');
        });
      });
    });

    const navTargets = { profile: 'Settings', messages: 'Discover', settings: 'Messages', discover: 'Profile' };
    document.querySelectorAll('.nav-hell-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        const wrong = navTargets[target] || 'Nowhere';
        this.addChaos(4);
        this.levelProg(1);
        this.toast('Clicked ' + target + ' — you\'ve been taken to ' + wrong + '!', 'warn');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(btn, { scale: 0.95, borderColor: 'rgba(255,0,229,.5)' }, { scale: 1, borderColor: 'rgba(255,255,255,.06)', duration: 0.4 });
        }
      });
    });

    document.getElementById('l1-complete').addEventListener('click', () => this.completeLevel(1));
  };
})(IntuiNO);
