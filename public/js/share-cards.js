/* Shareable consistency wins — no volume framing */
const ShareCards = (() => {
  function streakText({ streak, bestStreak, activeDaysLastWeek }) {
    const s = streak || 0;
    const best = bestStreak || 0;
    const week = activeDaysLastWeek ?? 0;
    return `AfterHours: ${s}-day streak · ${week}/7 active nights last week (best: ${best}). One problem after work — consistency over volume.`;
  }

  function milestoneText(milestone, totalDone) {
    return `AfterHours milestone unlocked: ${milestone.icon} ${milestone.label} (${totalDone} wins on my journey). Progress never clocks out.`;
  }

  async function share(data) {
    const text = data.milestone
      ? milestoneText(data.milestone, data.totalDone)
      : streakText(data);
    const url = location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AfterHours",
          text,
          url,
        });
        return true;
      } catch {
        /* user cancelled */
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      return "copied";
    } catch {
      return false;
    }
  }

  return { share, streakText, milestoneText };
})();
