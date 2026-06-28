const Confetti = (() => {
  const COLORS = ["#22d3ee", "#fbbf24", "#f97316", "#a78bfa", "#34d399", "#fb7185"];
  const PARTICLE_COUNT = 90;

  let canvas = null;
  let ctx = null;
  let particles = [];
  let raf = null;

  function ensureCanvas() {
    if (canvas) return;

    canvas = document.createElement("canvas");
    canvas.id = "confettiCanvas";
    canvas.className = "confetti-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnParticle() {
    return {
      x: Math.random() * canvas.width,
      y: -12 - Math.random() * canvas.height * 0.15,
      vx: (Math.random() - 0.5) * 7,
      vy: Math.random() * 2.5 + 1.5,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.25,
      w: Math.random() * 7 + 5,
      h: Math.random() * 4 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 1,
      decay: Math.random() * 0.007 + 0.005,
    };
  }

  function burst() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    ensureCanvas();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(spawnParticle());
    }

    if (!raf) tick();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((p) => p.life > 0);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.vx *= 0.99;
      p.rot += p.spin;
      p.life -= p.decay;

      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (particles.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return { burst };
})();
