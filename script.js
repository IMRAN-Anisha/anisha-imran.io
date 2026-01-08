// ---------- Typewriter ----------
function initTypewriter() {
  const staticPhrase = "Hi, I'm Anisha Imran";
  const staticTextEl = document.getElementById("static-text");
  const typewriterText = document.getElementById("typewriter-text");

  const phrases = [
    "Bachelor of Software Engineering (Honours).",
    "Front End Developer · Growing into Fullstack.",
    "IBM · Meta · Microsoft coursework credentials."
  ];

  let currentPhrase = 0;
  let currentChar = 0;

  function typeStaticText(i = 0) {
    if (i < staticPhrase.length) {
      staticTextEl.textContent += staticPhrase.charAt(i);
      setTimeout(() => typeStaticText(i + 1), 100);
    } else {
      setTimeout(typeDynamic, 500);
    }
  }

  function typeDynamic() {
    if (currentChar < phrases[currentPhrase].length) {
      typewriterText.textContent += phrases[currentPhrase].charAt(currentChar);
      currentChar++;
      setTimeout(typeDynamic, 100);
    } else {
      setTimeout(eraseDynamic, 2000);
    }
  }

  function eraseDynamic() {
    if (currentChar > 0) {
      typewriterText.textContent = phrases[currentPhrase].substring(0, currentChar - 1);
      currentChar--;
      setTimeout(eraseDynamic, 50);
    } else {
      currentPhrase = (currentPhrase + 1) % phrases.length;
      setTimeout(typeDynamic, 500);
    }
  }

  typeStaticText();
}

// ---------- Particles ----------
function initParticles(options = {}) {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0;
  let h = 0;
  let particles = [];
  let DPR = window.devicePixelRatio || 1;

  // Configurable options
  // Use the same light-blue used in the hero repeating text by default
  const defaultColor = options.color || "#C8D9E6";
  const lineMaxDist = options.lineMaxDist || 120;
  // increase default line alpha for better visibility
  const lineBaseAlpha = typeof options.lineBaseAlpha === 'number' ? options.lineBaseAlpha : 0.22;

  // Hero clear zone (reduce particles behind text)
  const heroContent = document.querySelector('.hero-content');
  let heroRect = null;
  const clearPadding = typeof options.clearPadding === 'number' ? options.clearPadding : 24; // px

  function hexToRgb(hex) {
    const m = hex.replace('#', '');
    if (m.length === 3) {
      const r = parseInt(m[0] + m[0], 16);
      const g = parseInt(m[1] + m[1], 16);
      const b = parseInt(m[2] + m[2], 16);
      return { r, g, b };
    }
    if (m.length === 6) {
      return {
        r: parseInt(m.slice(0, 2), 16),
        g: parseInt(m.slice(2, 4), 16),
        b: parseInt(m.slice(4, 6), 16)
      };
    }
    return null;
  }

  const rgb = hexToRgb(defaultColor) || { r: 47, g: 65, b: 86 };

  function updateHeroRect() {
    if (heroContent) heroRect = heroContent.getBoundingClientRect();
    else heroRect = null;
  }

  function resize() {
    DPR = window.devicePixelRatio || 1;
    w = Math.max(1, window.innerWidth);
    h = Math.max(1, window.innerHeight);
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    // keep density moderate but increase visibility
    const target = Math.min(100, Math.floor((w * h) / 8000));
    while (particles.length < target) particles.push(createParticle());
    while (particles.length > target) particles.pop();

    updateHeroRect();
  }

  function createParticle() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2.2 + 0.8,
      a: 0.75 + Math.random() * 0.25
    };
  }

  function inHeroArea(p) {
    if (!heroRect) return false;
    const left = heroRect.left - clearPadding;
    const right = heroRect.right + clearPadding;
    const top = heroRect.top - clearPadding;
    const bottom = heroRect.bottom + clearPadding;
    return p.x >= left && p.x <= right && p.y >= top && p.y <= bottom;
  }

  function update() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Skip drawing particles inside the hero content area for readability
      if (!inHeroArea(p)) {
        ctx.beginPath();
        const fillAlpha = Math.min(1, p.a * 1.2);
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${fillAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        // don't draw connecting lines if either particle is inside hero area
        if (inHeroArea(p) || inHeroArea(q)) continue;
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < lineMaxDist) {
          const lineAlpha = lineBaseAlpha * (1 - dist / lineMaxDist);
          ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${lineAlpha})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(update);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", updateHeroRect, { passive: true });
  resize();
  requestAnimationFrame(update);
}

// Run the typewriter and particles
initTypewriter();
initParticles();
