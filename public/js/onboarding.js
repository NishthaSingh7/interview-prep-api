const Onboarding = (() => {
  const KEY = "afterhours_onboarding_done";

  function isDone() {
    try {
      return localStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  }

  function markDone() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  }

  function shouldShow() {
    if (!Auth.isLoggedIn() || isDone()) return false;
    return new URLSearchParams(location.search).get("onboarding") === "1";
  }

  function show() {
    const modal = document.createElement("div");
    modal.className = "motivation-modal onboarding-modal";
    modal.innerHTML = `
      <div class="motivation-backdrop" data-onboarding-close></div>
      <div class="motivation-dialog onboarding-dialog" role="dialog" aria-modal="true">
        <p class="motivation-kicker">Welcome to AfterHours</p>
        <h3 class="motivation-headline" id="onboardingTitle">One problem after work</h3>
        <p class="motivation-message" id="onboardingBody">That's the whole strategy. No race to 300 — just show up at your chosen time and build pattern intuition night by night.</p>
        <div class="onboarding-steps" id="onboardingDots" aria-hidden="true">
          <span class="onboarding-dot active"></span><span class="onboarding-dot"></span><span class="onboarding-dot"></span>
        </div>
        <button type="button" class="btn btn-primary motivation-cta" id="onboardingNext">Next →</button>
      </div>`;

    document.body.appendChild(modal);
    document.body.classList.add("motivation-open");

    const steps = [
      {
        title: "One problem after work",
        body: "That's the whole strategy. No race to 300 — show up at your chosen time and build pattern intuition night by night.",
      },
      {
        title: "Set your reminder",
        body: "Pick a daily time on Progress → Game Plan. We'll nudge you when your after-hours slot opens.",
      },
      {
        title: "Log tonight's win",
        body: "Open your suggested problem, solve it, check the box. Confetti + streak — then you're done for the night.",
      },
    ];

    let step = 0;
    const titleEl = modal.querySelector("#onboardingTitle");
    const bodyEl = modal.querySelector("#onboardingBody");
    const btn = modal.querySelector("#onboardingNext");
    const dots = [...modal.querySelectorAll(".onboarding-dot")];

    const renderStep = () => {
      titleEl.textContent = steps[step].title;
      bodyEl.textContent = steps[step].body;
      dots.forEach((d, i) => d.classList.toggle("active", i === step));
      btn.textContent = step === steps.length - 1 ? "Pick tonight's problem →" : "Next →";
    };

    btn.addEventListener("click", () => {
      if (step < steps.length - 1) {
        step++;
        renderStep();
        return;
      }
      markDone();
      modal.remove();
      document.body.classList.remove("motivation-open");
      if (location.pathname === "/") {
        document.getElementById("tonightsProblem")?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/?onboarding=done";
      }
    });

    modal.querySelectorAll("[data-onboarding-close]").forEach((el) => {
      el.addEventListener("click", () => {
        markDone();
        modal.remove();
        document.body.classList.remove("motivation-open");
      });
    });

    renderStep();
    history.replaceState(null, "", location.pathname);
  }

  function init() {
    if (shouldShow()) show();
  }

  return { init, markDone };
})();
