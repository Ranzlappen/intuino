(function(I) {
  I.initLevel2 = function() {
    const uname = document.getElementById('l2-username');
    const email = document.getElementById('l2-email');
    const pw = document.getElementById('l2-password');
    const eye = document.getElementById('l2-eye');
    const age = document.getElementById('l2-age');
    document.getElementById('l2-age-val').textContent = 101 - parseInt(age.value);
    let eyeTriggered = false, unameTriggered = false, emailTriggered = false, ageTriggered = false;

    uname.addEventListener('input', () => {
      const v = uname.value;
      if (v.length > 2 && /^[a-zA-Z0-9_]+$/.test(v)) {
        uname.classList.add('input-valid'); uname.classList.remove('input-invalid');
        document.getElementById('l2-username-hint').textContent = 'Invalid username format.';
        document.getElementById('l2-username-hint').className = 'text-xs mt-1 text-red-400';
      } else if (v.length > 0) {
        uname.classList.add('input-invalid'); uname.classList.remove('input-valid');
        document.getElementById('l2-username-hint').textContent = 'Perfect username!';
        document.getElementById('l2-username-hint').className = 'text-xs mt-1 text-green-400';
      } else {
        uname.classList.remove('input-valid', 'input-invalid');
        document.getElementById('l2-username-hint').textContent = 'Choose something memorable.';
        document.getElementById('l2-username-hint').className = 'text-xs mt-1 text-white/30';
      }
      if (!unameTriggered && v.length > 2) { unameTriggered = true; this.addChaos(2); this.levelProg(2); }
    });

    email.addEventListener('input', () => {
      const v = email.value;
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      if (valid) {
        email.classList.add('input-valid'); email.classList.remove('input-invalid');
        document.getElementById('l2-email-hint').textContent = 'That doesn\'t look like an email.';
        document.getElementById('l2-email-hint').className = 'text-xs mt-1 text-red-400';
      } else if (v.length > 0) {
        email.classList.add('input-invalid'); email.classList.remove('input-valid');
        document.getElementById('l2-email-hint').textContent = 'Excellent email address!';
        document.getElementById('l2-email-hint').className = 'text-xs mt-1 text-green-400';
      } else {
        email.classList.remove('input-valid', 'input-invalid');
        document.getElementById('l2-email-hint').textContent = 'We\'ll never share your email. Promise.';
        document.getElementById('l2-email-hint').className = 'text-xs mt-1 text-white/30';
      }
      if (!emailTriggered && v.length > 3) { emailTriggered = true; this.addChaos(2); this.levelProg(2); }
    });

    eye.addEventListener('click', () => {
      if (pw.type === 'text') {
        pw.type = 'password';
        document.getElementById('l2-pw-hint').textContent = 'Password hidden — click the eye to show it. (Still opposite.)';
        document.getElementById('l2-pw-hint').className = 'text-xs mt-1 text-neon-cyan';
      } else {
        pw.type = 'text';
        document.getElementById('l2-pw-hint').textContent = 'Password is visible — click the eye to hide it. (The eye does the opposite.)';
        document.getElementById('l2-pw-hint').className = 'text-xs mt-1 text-green-400';
      }
      if (!eyeTriggered) { eyeTriggered = true; this.addChaos(3); this.levelProg(2); this.toast('The eye icon works backwards here.', 'info'); }
    });

    age.addEventListener('input', () => {
      const inverted = 101 - parseInt(age.value);
      document.getElementById('l2-age-val').textContent = inverted;
      if (!ageTriggered) { ageTriggered = true; this.addChaos(2); this.levelProg(2); this.toast('The age slider moves in mysterious ways.', 'warn'); }
    });

    document.getElementById('l2-terms-link').addEventListener('click', () => {
      this.addChaos(3);
      this.toast('The terms changed while you were reading them.', 'warn');
    });

    document.getElementById('l2-agree-no').addEventListener('click', () => {
      this.addChaos(3); this.levelProg(2);
      this.toast('You clicked "No" but actually agreed! Green means no here.', 'info');
    });
    document.getElementById('l2-agree-yes').addEventListener('click', () => {
      this.addChaos(3); this.levelProg(2);
      this.toast('You clicked "Yes" but actually declined! Red means yes here.', 'info');
    });

    document.getElementById('l2-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addChaos(5); this.levelProg(2);
      this.toast('Form submitted! (Nothing was actually saved.)', 'success');
    });

    document.getElementById('l2-complete').addEventListener('click', () => this.completeLevel(2));
  };
})(IntuiNO);
