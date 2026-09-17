export default defineNuxtPlugin(() => {
  const normalize = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const adviceByMood = {
    rieur: {
      icon: "😂",
      title: "Profite de cette bonne humeur",
      message:
        "Ton humeur est légère aujourd’hui. Garde ce moment de rire et fais durer ce qui t’a mis de bonne humeur.",
      actions: [
        { icon: "😊", label: "Partager un sourire" },
        { icon: "🎵", label: "Mettre une musique" },
        { icon: "✨", label: "Garder ce bon moment" },
      ],
    },
    etonne: {
      icon: "😲",
      title: "Accueille la surprise",
      message:
        "Quelque chose semble t’avoir surpris aujourd’hui. Prends un instant pour observer ce que ça t’a fait ressentir, sans te presser.",
      actions: [
        { icon: "🌿", label: "Respirer" },
        { icon: "✍️", label: "Mettre des mots" },
        { icon: "👀", label: "Prendre du recul" },
      ],
    },
  };

  const getAdviceKey = (title) => {
    const value = normalize(title);

    if (value.includes("rieur") || value.includes("rire")) return "rieur";
    if (value.includes("etonn") || value.includes("surpris")) return "etonne";

    return null;
  };

  const setTextIfNeeded = (element, value) => {
    if (element && element.textContent !== value) {
      element.textContent = value;
    }
  };

  const applyAdvice = () => {
    const page = document.querySelector(".tracking-page");
    if (!page) return;

    const cards = Array.from(page.querySelectorAll(".daily-card"));
    if (!cards.length) return;

    const morningTitle = cards[0]
      ?.querySelector(".daily-mood-content h4")
      ?.textContent?.trim();
    const eveningTitle = cards[1]
      ?.querySelector(".daily-mood-content h4")
      ?.textContent?.trim();

    // Même logique que le suivi : l'humeur du soir est prioritaire si elle existe.
    const latestTitle = eveningTitle || morningTitle;
    const adviceKey = getAdviceKey(latestTitle);
    if (!adviceKey) return;

    const advice = adviceByMood[adviceKey];
    const section = page.querySelector(".daily-wellbeing");
    if (!section) return;

    setTextIfNeeded(
      section.querySelector(".daily-wellbeing-icon"),
      advice.icon
    );
    setTextIfNeeded(section.querySelector(".daily-wellbeing-head h3"), advice.title);
    setTextIfNeeded(
      section.querySelector(".wellbeing-message"),
      `“${advice.message}”`
    );

    const actionNodes = Array.from(
      section.querySelectorAll(".wellbeing-action")
    );

    advice.actions.forEach((action, index) => {
      const actionNode = actionNodes[index];
      if (!actionNode) return;

      setTextIfNeeded(actionNode.querySelector("span"), action.icon);
      setTextIfNeeded(actionNode.querySelector("strong"), action.label);
    });
  };

  let frameRequested = false;
  const scheduleApplyAdvice = () => {
    if (frameRequested) return;
    frameRequested = true;

    requestAnimationFrame(() => {
      frameRequested = false;
      applyAdvice();
    });
  };

  const observer = new MutationObserver(scheduleApplyAdvice);

  const startObserver = () => {
    if (!document.body) return;

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    scheduleApplyAdvice();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  } else {
    startObserver();
  }
});
