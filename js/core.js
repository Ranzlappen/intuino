/* ══════════════════════════════════════════════════════════
   IntuiNO — "Intuitively Wrong."
   Core Module — State, Navigation, Hub, Achievements
   ══════════════════════════════════════════════════════════ */

const IntuiNO = {
  // ─── STATE ───
  state: {
    chaosScore: 0, currentScreen: 'hero', levelsCompleted: [], achievements: [],
    levelProgress: {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0},
    runawayAttempts: 0, gKeyPresses: [], l4ProgressValue: 100,
    l5ApplyInterval: null, l5ApplyValue: 0, swipeCardIndex: 0, pinchScale: 1,
    menuOpen: false, bannerDismissals: 0, bannerInterval: null,
    chaosTier: 0, fakeCrashCount: 0, titleClickCount: 0, titleClickTimer: null,
    konamiIndex: 0, bossStage: 0, levelStartTime: 0,
    stats: { totalClicks:0, totalChaosEvents:0, timeSpent:0, fakeCrashesTriggered:0, bossAttempts:0, sessionsPlayed:0 },
    settings: { soundEnabled: true },
    visitTimestamps: [],
  },

  // ─── LEVEL DEFINITIONS ───
  levels: [
    { id:1, name:'Navigation Hell', icon:'\u{1F9ED}', color:'cyan', desc:'Links lie. Menus mislead.', required:6, act:1 },
    { id:2, name:'Form Fiasco', icon:'\u{1F4DD}', color:'magenta', desc:'Forms that fight back.', required:7, act:1 },
    { id:3, name:'Gesture Gauntlet', icon:'\u{1F90C}', color:'purple', desc:'Swipes, pinches & long-press \u2014 all wrong.', required:6, act:1 },
    { id:4, name:'Button & CTA Chaos', icon:'\u{1F3AF}', color:'blue', desc:'Buttons that flee from your cursor.', required:7, act:1 },
    { id:5, name:'Settings Sabotage', icon:'\u2699\uFE0F', color:'magenta', desc:'Every toggle does the opposite.', required:8, act:1 },
    { id:6, name:'Modal Madness', icon:'\u{1FA9F}', color:'cyan', desc:'Modals within modals within modals.', required:7, act:2 },
    { id:7, name:'Loading Screen Lunacy', icon:'\u231B', color:'purple', desc:'Progress bars that lie to your face.', required:7, act:2 },
    { id:8, name:'Notification Nightmare', icon:'\u{1F514}', color:'blue', desc:'Unstoppable notification spam.', required:8, act:2 },
    { id:9, name:'Dark Pattern Dungeon', icon:'\u{1F573}\uFE0F', color:'magenta', desc:'Manipulative design at its worst.', required:8, act:2 },
    { id:10, name:'THE FINAL CHAOS', icon:'\u{1F480}', color:'red', desc:'Everything. All at once.', required:10, act:3 },
  ],

  // ─── REVEAL DATA ───
  reveals: {
    1: { wrongs:['Links navigated to wrong destinations','Search returned unrelated results','Breadcrumbs were unreliable and misleading'], rights:['Navigation should be predictable and consistent','Search results must match user queries','Breadcrumbs should accurately reflect page hierarchy'], lesson:"Jakob\u2019s Law states users spend most of their time on other sites, so they expect yours to work the same way. Consistent navigation patterns reduce cognitive load and help users find what they need efficiently." },
    2: { wrongs:['Valid input showed error styling (red)','Invalid input showed success styling (green)','Password visibility toggle worked backwards','Terms of Service buttons had swapped colors/meanings','Age slider displayed inverted values'], rights:['Green = success/valid, Red = error/invalid universally','Password toggle: eye-open = visible, eye-closed = hidden','Confirm actions should use primary/positive styling','Form controls should respond predictably to input'], lesson:"Color carries semantic meaning in UI design. Users have deeply ingrained associations: green means go/success, red means stop/error. Violating these conventions causes confusion and erodes trust." },
    3: { wrongs:['Swipe directions were inverted (right=skip, left=like)','Pinch-to-zoom worked backwards','Long-press triggered visual chaos instead of a context menu'], rights:['Gesture directions should match platform conventions','Pinch-out = zoom in, pinch-in = zoom out (natural mapping)','Long-press should reveal contextual options, not chaos'], lesson:"Gestural interfaces rely on natural mapping \u2014 the relationship between controls and their effects should feel intuitive. When gestures violate platform conventions, users feel disoriented." },
    4: { wrongs:['Buttons fled from the cursor on hover','Progress bar went backwards','Loading only completed when the \"wrong\" action was taken','Button labels were opposite to their actual function'], rights:['Interactive elements must be easy to target (Fitts\'s Law)','Progress indicators should advance toward completion','Primary actions should complete expected workflows','Labels must accurately describe their action'], lesson:"Fitts\u2019s Law tells us that the time to reach a target depends on its distance and size. Buttons should be easy to click, not evasive. Labels are promises \u2014 breaking them breaks user trust." },
    5: { wrongs:['Toggles performed the opposite action','Save/Cancel buttons were functionally swapped','Loading stalled until the \"abort\" button was pressed','Delete Account button was harmless, Cancel button saved'], rights:['Toggle states should clearly reflect the current setting','Destructive actions need clear, honest labeling and confirmation','Loading should complete automatically without requiring workarounds','Settings changes should be transparent and predictable'], lesson:"The principle of transparency means users should always understand the system\u2019s current state. Deceptive patterns in settings erode user confidence and can violate ethical design principles." },
    6: { wrongs:['X button spawned more modals instead of closing','Modals nested 3 layers deep','Confirmation required confirmation of confirmation','Only an invisible link could close all modals'], rights:['Modals should always be dismissable with X or Escape','Never nest modals \u2014 use progressive disclosure instead','Confirmation dialogs should be reserved for destructive actions','Close actions must be visible and predictable'], lesson:"Modal dialogs interrupt user flow and should be used sparingly. When used, they must be easy to dismiss. Nested modals create confusion and trap users. Always provide a clear, visible exit." },
    7: { wrongs:['Progress bar reached 99% then reset to 0%','Completing one progress bar revealed another','Time estimates increased instead of decreased','Only clicking the progress bar itself completed loading'], rights:['Progress indicators must reflect actual progress honestly','Time estimates should decrease predictably','Loading should complete automatically','Progress bars are not interactive elements'], lesson:"Progress indicators build trust by setting expectations. When they lie \u2014 resetting, stalling, or hiding additional steps \u2014 users lose confidence. Honest progress feedback respects the user\u2019s time." },
    8: { wrongs:['Notifications stacked up blocking all content','Disabling notifications increased their frequency','Unsubscribe action subscribed to more','Badge counts increased when clicked'], rights:['Notifications should be relevant and timely','Users must have real control over notification settings','Unsubscribe must actually unsubscribe','Badge counts should clear when acknowledged'], lesson:"Notification spam is one of the most common dark patterns. Users deserve genuine control over their attention. When users opt out, respect their choice immediately." },
    9: { wrongs:['Confirmshaming used guilt to prevent unsubscribing','Hidden fees appeared after committing to purchase','Removing cart items added more items','Quadruple-negative opt-out made choice impossible'], rights:['Cancellation should be as easy as sign-up','All costs should be visible upfront','Cart actions must match user intent','Options should be stated clearly and positively'], lesson:"Dark patterns manipulate users into unintended actions through deceptive design. They erode trust, damage brand reputation, and are increasingly illegal under consumer protection laws." },
    10: { wrongs:['Every anti-pattern from all levels attacked simultaneously','Chaos effects were forced to maximum','Multiple UX violations compounded each other','The entire interface fought against the user'], rights:['Good UX is invisible \u2014 it just works','Consistency across all interactions builds trust','Users should feel in control at all times','Every design decision should serve the user'], lesson:"The final lesson: good UX design is an act of empathy. Every interaction is a conversation with your user. When that conversation is honest, consistent, and respectful, users don\u2019t even notice the design \u2014 they just accomplish their goals." },
  },

  // ─── ACHIEVEMENTS ───
  achievementDefs: {
    firstChaos:      { icon:'\u26A1', text:'First Chaos \u2014 Earned 10 chaos points' },
    navNightmare:    { icon:'\u{1F9ED}', text:'Navigation Nightmare \u2014 Survived Level 1' },
    formFiller:      { icon:'\u{1F4DD}', text:'Form Filler \u2014 Survived Level 2' },
    gestureMaster:   { icon:'\u{1F90C}', text:'Gesture Master \u2014 Survived Level 3' },
    buttonBasher:    { icon:'\u{1F3AF}', text:'Button Basher \u2014 Survived Level 4' },
    settingsSurvivor:{ icon:'\u2699\uFE0F', text:'Settings Survivor \u2014 Survived Level 5' },
    modalMaster:     { icon:'\u{1FA9F}', text:'Modal Master \u2014 Survived Level 6' },
    loadingLunatic:  { icon:'\u231B', text:'Loading Lunatic \u2014 Survived Level 7' },
    notifNightmare:  { icon:'\u{1F514}', text:'Notification Nightmare \u2014 Survived Level 8' },
    darkPatternDiver:{ icon:'\u{1F573}\uFE0F', text:'Dark Pattern Diver \u2014 Survived Level 9' },
    bossSlayer:      { icon:'\u{1F480}', text:'Boss Slayer \u2014 Defeated The Final Chaos' },
    chaosChampion:   { icon:'\u{1F451}', text:'Chaos Champion \u2014 Completed all 10 levels' },
    shakeItOff:      { icon:'\u{1F4F1}', text:'Shake It Off \u2014 Triggered Good UX Mode' },
    bannerSurvivor:  { icon:'\u{1F36A}', text:'Cookie Monster \u2014 Dismissed 3 intrusive banners' },
    speedRunner:     { icon:'\u26A1', text:'Speed Runner \u2014 Completed a level in under 60s' },
    chaosMaster:     { icon:'\u{1F300}', text:'Chaos Master \u2014 Reached Total Anarchy tier' },
    konamiKid:       { icon:'\u{1F3AE}', text:'Konami Kid \u2014 Entered the legendary code' },
    theHorror:       { icon:'\u{1F631}', text:'The Horror \u2014 Experienced Perfect UX' },
    inspectorChaos:  { icon:'\u{1F50D}', text:'Inspector Chaos \u2014 Found the fake dev tools' },
    crashSurvivor:   { icon:'\u{1F4A5}', text:'Crash Survivor \u2014 Dismissed 5 fake crashes' },
    persistentPlayer:{ icon:'\u{1F504}', text:'Persistent Player \u2014 Returned 3 times' },
    explorer:        { icon:'\u{1F5FA}\uFE0F', text:'Explorer \u2014 Found all easter eggs' },
  },

  swipeCards: [
    { emoji:'\u{1F3A8}', title:'Creative Post #1' },
    { emoji:'\u{1F4F8}', title:'Travel Photo #2' },
    { emoji:'\u{1F3B5}', title:'Music Share #3' },
    { emoji:'\u{1F355}', title:'Food Review #4' },
    { emoji:'\u{1F431}', title:'Cat Video #5' },
  ],

  // ─── PERSISTENCE ───
  save() {
    try {
      const d = { chaosScore:this.state.chaosScore, levelsCompleted:this.state.levelsCompleted, achievements:this.state.achievements, levelProgress:this.state.levelProgress, stats:this.state.stats, settings:this.state.settings, visitTimestamps:this.state.visitTimestamps, bannerDismissals:this.state.bannerDismissals, fakeCrashCount:this.state.fakeCrashCount };
      localStorage.setItem('intuino', JSON.stringify(d));
    } catch(e) {}
  },
  load() {
    try {
      const d = JSON.parse(localStorage.getItem('intuino'));
      if (d) {
        this.state.chaosScore = d.chaosScore || 0;
        this.state.levelsCompleted = d.levelsCompleted || [];
        this.state.achievements = d.achievements || [];
        if (d.levelProgress) {
          for (let i = 1; i <= 10; i++) this.state.levelProgress[i] = d.levelProgress[i] || 0;
        }
        this.state.stats = Object.assign(this.state.stats, d.stats || {});
        this.state.settings = Object.assign(this.state.settings, d.settings || {});
        this.state.visitTimestamps = d.visitTimestamps || [];
        this.state.bannerDismissals = d.bannerDismissals || 0;
        this.state.fakeCrashCount = d.fakeCrashCount || 0;
      }
    } catch(e) {}
    // Track visits
    this.state.visitTimestamps.push(Date.now());
    if (this.state.visitTimestamps.length > 20) this.state.visitTimestamps = this.state.visitTimestamps.slice(-20);
    const uniqueDays = new Set(this.state.visitTimestamps.map(t => new Date(t).toDateString()));
    if (uniqueDays.size >= 3) this.unlockAchievement('persistentPlayer');
    this.state.stats.sessionsPlayed++;
    this.save();
  },

  // ─── CHAOS SCORE ───
  addChaos(n) {
    this.state.chaosScore += n;
    this.state.stats.totalChaosEvents++;
    this.save();
    const el = document.getElementById('chaos-score-val');
    if (el) {
      el.textContent = this.state.chaosScore;
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(el, { scale:1.4, color:'#ff00e5' }, { scale:1, color:'#a855f7', duration:0.4, ease:'back.out(2)' });
      }
    }
    if (this.state.chaosScore >= 10) this.unlockAchievement('firstChaos');
    this.updateHubStats();
    if (typeof this.updateChaosEffects === 'function') this.updateChaosEffects();
    if (typeof this.playSound === 'function') this.playSound('chaos');
  },

  // ─── LEVEL PROGRESS ───
  levelProg(lvl) {
    this.state.levelProgress[lvl] = (this.state.levelProgress[lvl] || 0) + 1;
    this.save();
    const ldef = this.levels.find(l => l.id === lvl);
    if (!ldef) return;
    const req = ldef.required;
    const cur = this.state.levelProgress[lvl];
    const bar = document.getElementById('l' + lvl + '-progress-bar');
    const txt = document.getElementById('l' + lvl + '-progress-text');
    const btn = document.getElementById('l' + lvl + '-complete');
    if (bar) bar.style.width = Math.min(100, (cur / req) * 100) + '%';
    if (txt) txt.textContent = Math.min(cur, req) + ' / ' + req + ' chaos events';
    if (cur >= req && btn) {
      btn.classList.remove('hidden');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(btn, { opacity:0, y:10 }, { opacity:1, y:0, duration:0.4 });
      } else { btn.style.opacity = '1'; }
    }
  },

  completeLevel(lvl) {
    if (!this.state.levelsCompleted.includes(lvl)) {
      this.state.levelsCompleted.push(lvl);
      this.save();
    }
    // Speed runner check
    if (this.state.levelStartTime && (Date.now() - this.state.levelStartTime) < 60000) {
      this.unlockAchievement('speedRunner');
    }
    const achMap = {1:'navNightmare',2:'formFiller',3:'gestureMaster',4:'buttonBasher',5:'settingsSurvivor',6:'modalMaster',7:'loadingLunatic',8:'notifNightmare',9:'darkPatternDiver',10:'bossSlayer'};
    if (achMap[lvl]) this.unlockAchievement(achMap[lvl]);
    if (this.state.levelsCompleted.length >= 10) this.unlockAchievement('chaosChampion');
    this.showReveal(lvl);
  },

  // ─── TOAST ───
  toast(msg, type) {
    type = type || 'info';
    var c = document.getElementById('toast-container');
    if (!c) return;
    var t = document.createElement('div');
    t.className = 'toast toast-' + type;
    t.textContent = msg;
    c.appendChild(t);
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(t, { opacity:0, x:60, scale:0.9 }, { opacity:1, x:0, scale:1, duration:0.35, ease:'back.out(2)' });
      setTimeout(function() { gsap.to(t, { opacity:0, x:60, duration:0.3, onComplete:function(){ t.remove(); } }); }, 3000);
    } else {
      t.style.opacity = '1';
      setTimeout(function(){ t.remove(); }, 3000);
    }
    if (typeof this.playSound === 'function') this.playSound('toast');
  },

  // ─── ACHIEVEMENTS ───
  unlockAchievement(id) {
    if (this.state.achievements.includes(id)) return;
    this.state.achievements.push(id);
    this.save();
    var def = this.achievementDefs[id];
    if (!def) return;
    document.getElementById('ach-icon').textContent = def.icon;
    document.getElementById('ach-text').textContent = def.text;
    var popup = document.getElementById('achievement-popup');
    if (typeof gsap !== 'undefined') {
      gsap.timeline()
        .to(popup, { opacity:1, y:0, duration:0.5, ease:'back.out(2)' })
        .to(popup, { opacity:0, y:-20, duration:0.4, delay:2.5 });
    } else {
      popup.style.opacity = '1'; popup.style.transform = 'translateX(-50%) translateY(0)';
      setTimeout(function(){ popup.style.opacity = '0'; popup.style.transform = 'translateX(-50%) translateY(-20px)'; }, 3000);
    }
    this.updateHubStats();
    if (typeof this.playSound === 'function') this.playSound('achievement');
    if (typeof this.particleBurst === 'function') this.particleBurst(window.innerWidth / 2, 80, 'confetti', 30);
  },

  // ─── NAVIGATION ───
  navigate(screen) {
    var cur = document.getElementById('screen-' + this.state.currentScreen);
    var nxt = document.getElementById('screen-' + screen);
    if (!nxt || screen === this.state.currentScreen) return;
    var topbar = document.getElementById('topbar');
    var hasGsap = typeof gsap !== 'undefined';
    var self = this;

    if (screen !== 'hero' && topbar) {
      if (hasGsap) { gsap.to(topbar, { y:0, duration:0.4, ease:'power2.out' }); }
      else { topbar.style.transform = 'translateY(0)'; }
    }

    var finishTransition = function() {
      cur.classList.add('hidden');
      nxt.classList.remove('hidden');
      if (hasGsap) {
        gsap.fromTo(nxt, { opacity:0, y:30 }, { opacity:1, y:0, duration:0.4, ease:'power2.out' });
      } else { nxt.style.opacity = '1'; }
      self.state.currentScreen = screen;
      // Track level start time
      if (screen.indexOf('level') === 0 || screen === 'boss') {
        self.state.levelStartTime = Date.now();
      }
      if (screen === 'hub') self.renderHub();
      if (screen === 'level4' && typeof self.startLevel4 === 'function') self.startLevel4();
      if (screen === 'level5' && typeof self.startLevel5 === 'function') self.startLevel5();
      if (screen === 'level7' && typeof self.startLevel7 === 'function') self.startLevel7();
      if (screen === 'level8' && typeof self.startLevel8 === 'function') self.startLevel8();
      if (screen === 'level10' && typeof self.startBoss === 'function') self.startBoss();
    };

    if (hasGsap) {
      gsap.to(cur, { opacity:0, y:-30, duration:0.3, ease:'power2.in', onComplete:finishTransition });
    } else { finishTransition(); }
  },

  // ─── HUB ───
  renderHub() {
    var grid = document.getElementById('level-grid');
    if (!grid) return;
    grid.innerHTML = '';
    var colors = { cyan:['rgba(0,240,255,.08)','rgba(0,240,255,.3)'], magenta:['rgba(255,0,229,.08)','rgba(255,0,229,.3)'], purple:['rgba(168,85,247,.08)','rgba(168,85,247,.3)'], blue:['rgba(59,130,246,.08)','rgba(59,130,246,.3)'], red:['rgba(239,68,68,.08)','rgba(239,68,68,.3)'] };
    var self = this;
    var act1Done = 0; for (var i = 1; i <= 5; i++) { if (this.state.levelsCompleted.includes(i)) act1Done++; }
    var act2Unlocked = act1Done >= 3;
    var bossUnlocked = this.state.levelsCompleted.length >= 9;
    var acts = [
      { name:'Act I \u2014 The Fundamentals', levels:this.levels.filter(function(l){return l.act===1;}), unlocked:true },
      { name:'Act II \u2014 Advanced Chaos', levels:this.levels.filter(function(l){return l.act===2;}), unlocked:act2Unlocked },
      { name:'The Final Chaos', levels:this.levels.filter(function(l){return l.act===3;}), unlocked:bossUnlocked },
    ];

    acts.forEach(function(act) {
      // Act header
      var header = document.createElement('div');
      header.className = 'col-span-full mb-2 mt-6 first:mt-0';
      header.innerHTML = '<h3 class="text-lg font-bold text-white/70">' + act.name + '</h3>' + (!act.unlocked ? '<p class="text-xs text-white/30">' + (act.name.indexOf('II') !== -1 ? 'Complete 3 Act I levels to unlock' : 'Complete all 9 levels to unlock') + '</p>' : '');
      grid.appendChild(header);

      act.levels.forEach(function(lv) {
        var done = self.state.levelsCompleted.includes(lv.id);
        var locked = !act.unlocked;
        var c = colors[lv.color] || colors.cyan;
        var card = document.createElement('div');
        card.className = 'level-card glass-card p-6 ' + (locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer');
        card.style.setProperty('--card-glow', c[0]);
        card.style.setProperty('--card-border', c[1]);
        card.innerHTML = '<span class="text-4xl block mb-3">' + (locked ? '\u{1F512}' : lv.icon) + '</span>' +
          '<h3 class="text-lg font-bold mb-1">' + lv.name + '</h3>' +
          '<p class="text-xs text-white/40 mb-3">' + (locked ? 'Locked' : lv.desc) + '</p>' +
          '<div class="flex items-center gap-2">' +
          '<span class="text-xs px-2 py-0.5 rounded-full ' + (done ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30') + '">' + (done ? '\u2713 Complete' : locked ? '\u{1F512} Locked' : 'Level ' + lv.id) + '</span>' +
          '<span class="text-xs text-white/20">' + (self.state.levelProgress[lv.id] || 0) + ' / ' + lv.required + '</span>' +
          '</div>';
        if (!locked) {
          card.addEventListener('click', function() { self.navigate('level' + lv.id); });
        }
        grid.appendChild(card);
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(card, { opacity:0, y:20 }, { opacity: locked ? 0.4 : 1, y:0, duration:0.4, delay:lv.id * 0.06, ease:'power2.out' });
        }
      });
    });
    this.updateHubStats();
  },

  updateHubStats() {
    var el1 = document.getElementById('hub-chaos');
    var el2 = document.getElementById('hub-levels');
    var el3 = document.getElementById('hub-achievements');
    if (el1) el1.textContent = this.state.chaosScore;
    if (el2) el2.textContent = this.state.levelsCompleted.length + '/10';
    if (el3) el3.textContent = this.state.achievements.length;
  },

  // ─── REVEAL SCREEN ───
  showReveal(lvl) {
    var data = this.reveals[lvl];
    var lv = this.levels.find(function(l){ return l.id === lvl; });
    if (!data || !lv) return;
    document.getElementById('reveal-icon').textContent = lv.icon;
    document.getElementById('reveal-title').textContent = lv.name + ' \u2014 Complete!';
    document.getElementById('reveal-subtitle').textContent = 'You survived the chaos.';
    var wrongs = document.getElementById('reveal-wrongs');
    wrongs.innerHTML = data.wrongs.map(function(w){ return '<li class="flex gap-2"><span class="text-red-400 shrink-0">\u2717</span>' + w + '</li>'; }).join('');
    var rights = document.getElementById('reveal-rights');
    rights.innerHTML = data.rights.map(function(r){ return '<li class="flex gap-2"><span class="text-green-400 shrink-0">\u2713</span>' + r + '</li>'; }).join('');
    document.getElementById('reveal-lesson').textContent = data.lesson;
    var earned = (this.state.levelProgress[lvl] || 0) * 5;
    document.getElementById('reveal-chaos').textContent = '+' + earned;
    this.navigate('reveal');
  },

  // ─── THEME TOGGLE (OPPOSITE) ───
  initTheme() {
    document.getElementById('theme-toggle').addEventListener('click', () => {
      var html = document.documentElement;
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        document.getElementById('theme-toggle').textContent = '\u2600\uFE0F';
        this.toast('You wanted dark mode? Here\'s light mode.', 'warn');
      } else {
        html.classList.add('dark');
        document.getElementById('theme-toggle').textContent = '\u{1F319}';
        this.toast('You wanted light mode? Back to dark.', 'warn');
      }
      this.addChaos(3);
    });
  },

  // ─── SABOTAGED MENU ───
  initMenu() {
    var menu = document.getElementById('sabotaged-menu');
    var panel = menu.querySelector('.absolute.right-0');
    var hasGsap = typeof gsap !== 'undefined';
    var closeAttempts = 0;
    var self = this;

    document.getElementById('menu-btn').addEventListener('click', function() {
      if (self.state.menuOpen) return;
      self.state.menuOpen = true;
      menu.classList.remove('pointer-events-none');
      if (hasGsap) {
        gsap.to(menu, { opacity:1, duration:0.3 });
        gsap.to(panel, { x:0, duration:0.4, ease:'power2.out' });
      } else { menu.style.opacity = '1'; panel.style.transform = 'translateX(0)'; }
      closeAttempts = 0;
    });

    var closeMenu = function() {
      closeAttempts++;
      if (closeAttempts === 1 && Math.random() < 0.3) {
        self.toast('Close button didn\'t work. Try again?', 'warn');
        self.addChaos(2);
        return;
      }
      self.state.menuOpen = false;
      if (hasGsap) {
        gsap.to(panel, { x:'100%', duration:0.3, ease:'power2.in' });
        gsap.to(menu, { opacity:0, duration:0.3, delay:0.1, onComplete:function(){ menu.classList.add('pointer-events-none'); } });
      } else {
        panel.style.transform = 'translateX(100%)'; menu.style.opacity = '0';
        setTimeout(function(){ menu.classList.add('pointer-events-none'); }, 400);
      }
    };
    document.getElementById('menu-close').addEventListener('click', closeMenu);
    menu.querySelector('.absolute.inset-0').addEventListener('click', closeMenu);

    menu.querySelectorAll('.menu-link[data-nav]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var targets = ['hub','hero','level1','level3'];
        var target = targets[Math.floor(Math.random() * targets.length)];
        closeMenu();
        setTimeout(function() {
          self.navigate(target);
          self.addChaos(3);
          self.toast('Menu sent you somewhere unexpected.', 'warn');
        }, 400);
      });
    });
  },

  // ─── HERO ───
  initHero() {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.orb-1', { x:0, y:0 }, { x:30, y:-20, duration:6, repeat:-1, yoyo:true, ease:'sine.inOut' });
      gsap.fromTo('.orb-2', { x:0, y:0 }, { x:-25, y:15, duration:8, repeat:-1, yoyo:true, ease:'sine.inOut' });
      gsap.fromTo('.orb-3', { x:0, y:0 }, { x:15, y:25, duration:7, repeat:-1, yoyo:true, ease:'sine.inOut' });
      var tl = gsap.timeline({ delay:0.3 });
      tl.fromTo('#screen-hero h1', { opacity:0, y:40 }, { opacity:1, y:0, duration:0.8, ease:'power3.out' })
        .fromTo('#screen-hero p', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.5, stagger:0.15, ease:'power2.out' }, '-=0.3')
        .fromTo('#hero-cta', { opacity:0, scale:0.9 }, { opacity:1, scale:1, duration:0.5, ease:'back.out(2)' }, '-=0.2');
    }
    var self = this;
    document.getElementById('hero-cta').addEventListener('click', function() {
      self.addChaos(5);
      self.toast('You didn\'t skip anything. Welcome to IntuiNO.', 'info');
      self.navigate('hub');
    });
  },

  // ─── DEVICE SHAKE / GOOD UX MODE ───
  initShake() {
    var self = this;
    var lastShake = 0;
    var triggerGoodUX = function() {
      if (Date.now() - lastShake < 6000) return;
      lastShake = Date.now();
      self.addChaos(5);
      self.unlockAchievement('shakeItOff');
      var overlay = document.getElementById('good-ux-overlay');
      if (typeof gsap !== 'undefined') {
        gsap.to(overlay, { opacity:1, duration:0.4, onComplete:function() {
          setTimeout(function(){ gsap.to(overlay, { opacity:0, duration:0.4 }); }, 4000);
        }});
      } else {
        overlay.style.opacity = '1';
        setTimeout(function(){ overlay.style.opacity = '0'; }, 4000);
      }
      self.toast('Good UX Mode activated for 4 seconds!', 'success');
    };
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', function(e) {
        var acc = e.accelerationIncludingGravity;
        if (acc && (Math.abs(acc.x) > 15 || Math.abs(acc.y) > 15 || Math.abs(acc.z) > 25)) triggerGoodUX();
      });
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'g' || e.key === 'G') {
        self.state.gKeyPresses.push(Date.now());
        self.state.gKeyPresses = self.state.gKeyPresses.filter(function(t){ return Date.now() - t < 1000; });
        if (self.state.gKeyPresses.length >= 3) { self.state.gKeyPresses = []; triggerGoodUX(); }
      }
    });
  },

  // ─── INTRUSIVE BANNER ───
  initBanner() {
    var banner = document.getElementById('intrusive-banner');
    if (!banner) return;
    var bannerVisible = false;
    var hasGsap = typeof gsap !== 'undefined';
    var self = this;

    var showBanner = function() {
      if (bannerVisible || self.state.currentScreen === 'hero') return;
      bannerVisible = true;
      if (hasGsap) { gsap.to(banner, { y:0, duration:0.5, ease:'power2.out' }); }
      else { banner.style.transform = 'translateY(0)'; }
    };
    var hideBanner = function() {
      bannerVisible = false;
      if (hasGsap) { gsap.to(banner, { y:'100%', duration:0.4, ease:'power2.in' }); }
      else { banner.style.transform = 'translateY(100%)'; }
    };

    document.getElementById('banner-close').addEventListener('click', function() { self.addChaos(2); self.toast('The X button is purely decorative.', 'warn'); });
    document.getElementById('banner-accept').addEventListener('click', function() { self.addChaos(3); self.toast('You accepted everything. Banner remains.', 'warn'); });
    document.getElementById('banner-reject').addEventListener('click', function() { self.addChaos(3); self.toast('Rejection rejected. Banner remains.', 'error'); });
    document.getElementById('banner-expand').addEventListener('click', function() {
      self.addChaos(5); self.state.bannerDismissals++;
      self.toast('Expanding actually closed it. You\'re learning anti-UX.', 'success');
      hideBanner();
      if (self.state.bannerDismissals >= 3) self.unlockAchievement('bannerSurvivor');
    });

    var scheduleNext = function() {
      var delay = 15000 + Math.random() * 5000;
      // Faster at higher chaos tiers
      if (self.state.chaosTier >= 3) delay = 8000 + Math.random() * 4000;
      self.state.bannerInterval = setTimeout(function() { showBanner(); scheduleNext(); }, delay);
    };
    setTimeout(function(){ scheduleNext(); }, 10000);
  },

  // ─── GLOBAL LISTENERS ───
  initGlobalListeners() {
    var self = this;
    document.addEventListener('click', function(e) {
      var navEl = e.target.closest('[data-nav]');
      if (navEl) { e.preventDefault(); self.navigate(navEl.dataset.nav); }
      self.state.stats.totalClicks++;
    });
  },

  // ─── INIT ───
  init() {
    this.load();
    var scoreEl = document.getElementById('chaos-score-val');
    if (scoreEl) scoreEl.textContent = this.state.chaosScore;

    var self = this;
    var safeInit = function(fn, name) {
      try { fn.call(self); } catch(e) { console.warn('IntuiNO: ' + name + ' failed:', e); }
    };

    safeInit(this.initHero, 'initHero');
    safeInit(this.initTheme, 'initTheme');
    safeInit(this.initMenu, 'initMenu');
    safeInit(this.initGlobalListeners, 'initGlobalListeners');
    safeInit(this.initBanner, 'initBanner');
    safeInit(this.initShake, 'initShake');

    // Levels 1-5 (original)
    for (var i = 1; i <= 10; i++) {
      var fnName = 'initLevel' + i;
      if (typeof this[fnName] === 'function') safeInit(this[fnName], fnName);
    }
    // Boss
    if (typeof this.initBoss === 'function') safeInit(this.initBoss, 'initBoss');

    // New systems
    var systems = ['initChaosEngine','initEffects','initAudio','initMetaChaos','initEasterEggs','initSocial','initOnboarding'];
    systems.forEach(function(name) {
      if (typeof self[name] === 'function') safeInit(self[name], name);
    });

    // Console easter egg
    console.log('%c IntuiNO ', 'background: linear-gradient(to right, #00f0ff, #ff00e5); color: #0a0a1a; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%cLooking for bugs? They\'re features.', 'color: #a855f7; font-size: 12px;');
  }
};

document.addEventListener('DOMContentLoaded', function() { IntuiNO.init(); });
