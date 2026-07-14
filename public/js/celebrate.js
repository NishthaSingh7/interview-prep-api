const Celebrate = (() => {
  const SFX_KEY = "afterhours_sfx";
  let audioCtx = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function sfxEnabled() {
    try {
      const stored = localStorage.getItem(SFX_KEY);
      if (stored === "off") return false;
    } catch {
      /* ignore */
    }
    return true;
  }

  function setSfxEnabled(on) {
    try {
      localStorage.setItem(SFX_KEY, on ? "on" : "off");
    } catch {
      /* ignore */
    }
  }

  function getAudioCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function tone(ctx, { freq, start, duration, gain = 0.045, type = "sine" }) {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(gain, start + 0.018);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  /** Soft two-note night chime; third lift when streak grows. */
  function playCheckInSound({ streakGrew = false } = {}) {
    if (!sfxEnabled() || document.hidden) return;

    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const t0 = ctx.currentTime + 0.01;

      // Warm after-hours intervals (A4 → C#5)
      tone(ctx, { freq: 440, start: t0, duration: 0.16, gain: 0.038, type: "triangle" });
      tone(ctx, { freq: 554.37, start: t0 + 0.09, duration: 0.22, gain: 0.042, type: "sine" });

      if (streakGrew) {
        tone(ctx, { freq: 659.25, start: t0 + 0.22, duration: 0.28, gain: 0.036, type: "sine" });
      }
    } catch {
      /* audio blocked or unavailable */
    }
  }

  function checkboxBurst(checkbox, { playSound = true, streakGrew = false } = {}) {
    if (playSound) playCheckInSound({ streakGrew });

    if (!checkbox) return;

    const row = checkbox.closest("tr") || checkbox.parentElement;
    if (row) {
      row.classList.remove("celebrate-row-flash");
      void row.offsetWidth;
      row.classList.add("celebrate-row-flash");
      window.setTimeout(() => row.classList.remove("celebrate-row-flash"), 700);
    }

    if (prefersReducedMotion()) return;

    const rect = checkbox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 5; i++) {
      const dot = document.createElement("span");
      dot.className = "celebrate-spark-dot";
      const angle = -Math.PI / 2 + (i - 2) * 0.45;
      const dist = 22 + (i % 2) * 8;
      dot.style.left = `${cx}px`;
      dot.style.top = `${cy}px`;
      dot.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      dot.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
      document.body.appendChild(dot);
      window.setTimeout(() => dot.remove(), 550);
    }
  }

  /** Fallback toast when the motivation modal isn't shown. */
  function sessionToast({ doneToday, streakGrew, streak } = {}) {
    let chip = document.getElementById("celebrateTonightChip");
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "celebrateTonightChip";
      chip.className = "celebrate-tonight-chip";
      chip.setAttribute("role", "status");
      document.body.appendChild(chip);
    }

    const n = Math.max(1, Number(doneToday) || 1);
    const streakBit =
      streakGrew && streak
        ? `<span class="celebrate-tonight-chip-meta">Streak up · ${streak}</span>`
        : "";

    chip.innerHTML = `
      <strong>${n} done today</strong>
      <span>Logged for tonight</span>
      ${streakBit}`;
    chip.hidden = false;
    chip.classList.remove("is-out");
    chip.classList.add("is-in");

    window.clearTimeout(chip._hideTimer);
    chip._hideTimer = window.setTimeout(() => {
      chip.classList.remove("is-in");
      chip.classList.add("is-out");
      window.setTimeout(() => {
        chip.hidden = true;
        chip.classList.remove("is-out");
      }, 280);
    }, 2600);
  }

  function hideToast() {
    const chip = document.getElementById("celebrateTonightChip");
    if (!chip || chip.hidden) return;
    window.clearTimeout(chip._hideTimer);
    chip.classList.remove("is-in");
    chip.classList.add("is-out");
    window.setTimeout(() => {
      chip.hidden = true;
      chip.classList.remove("is-out");
    }, 200);
  }

  function onCheckIn({ checkbox, doneToday, streakGrew, streak, useToast = true } = {}) {
    checkboxBurst(checkbox, { streakGrew });
    if (useToast) sessionToast({ doneToday, streakGrew, streak });
  }

  return {
    onCheckIn,
    checkboxBurst,
    sessionToast,
    tonightChip: sessionToast,
    hideToast,
    playCheckInSound,
    sfxEnabled,
    setSfxEnabled,
  };
})();
