const Confetti = (() => {
  const COLORS = ["#22d3ee", "#fbbf24", "#f97316", "#a78bfa", "#34d399", "#fb7185", "#fde047", "#e879f9"];
  const BURSTS = 3;
  const PARTICLES_PER_BURST = 70;

  let canvas = null;
  let ctx = null;
  let container = null;
  let particles = [];
  let raf = null;

  function ensureCanvas(parent) {
    if (canvas && container === parent) return;

    if (canvas) {
      canvas.remove();
      canvas = null;
      ctx = null;
    }

    container = parent;
    canvas = document.createElement("canvas");
    canvas.id = "confettiCanvas";
    canvas.className = "confetti-canvas";
    canvas.setAttribute("aria-hidden", "true");
    parent.insertBefore(canvas, parent.firstChild);
    ctx = canvas.getContext("2d");
    resize();
  }

  function resize() {
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function spawnParticle(originX, originY) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = Math.random() * 9 + 4;
    const type = Math.random();

    return {
      x: originX + (Math.random() - 0.5) * 40,
      y: originY + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (Math.random() * 6 + 4),
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.35,
      w: Math.random() * 9 + 4,
      h: Math.random() * 5 + 3,
      shape: type < 0.35 ? "circle" : type < 0.7 ? "rect" : "ribbon",
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
      decay: Math.random() * 0.006 + 0.004,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.15 + 0.05,
    };
  }

  function fireBurst(parent) {
    ensureCanvas(parent);
    resize();

    const originX = canvas.width * 0.5;
    const originY = canvas.height * 0.62;

    for (let i = 0; i < PARTICLES_PER_BURST; i++) {
      particles.push(spawnParticle(originX, originY));
    }

    if (!raf) tick();
  }

  function burst(options = {}) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parent = options.container || document.body;
    particles = [];

    fireBurst(parent);
    setTimeout(() => fireBurst(parent), 180);
    setTimeout(() => fireBurst(parent), 360);
  }

  function drawParticle(p) {
    ctx.save();
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.w * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === "ribbon") {
      ctx.fillRect(-p.w * 0.15, -p.h * 2, p.w * 0.3, p.h * 4);
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }

    ctx.restore();
  }

  function tick() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.life > 0);

    for (const p of particles) {
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.6;
      p.y += p.vy;
      p.vy += 0.18;
      p.vx *= 0.985;
      p.rot += p.spin;
      p.life -= p.decay;
      drawParticle(p);
    }

    if (particles.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function stop() {
    particles = [];
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (canvas) {
      canvas.remove();
      canvas = null;
      ctx = null;
      container = null;
    }
  }

  window.addEventListener("resize", resize);

  return { burst, stop };
})();
