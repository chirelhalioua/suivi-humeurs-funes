export default defineNuxtPlugin((nuxtApp) => {
  let cachedFirstName = "";
  let frameRequested = false;

  const normalize = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const getFirstName = async () => {
    if (cachedFirstName) return cachedFirstName;

    const userId = localStorage.getItem("userId");
    if (!userId) return "";

    try {
      const response = await fetch(
        `https://suivi-humeurs-funes.onrender.com/api/auth/profil?userId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) return "";

      const data = await response.json();
      const name = String(data?.user?.name || "").trim();
      cachedFirstName = name.split(/\s+/)[0] || "";
      return cachedFirstName;
    } catch {
      return "";
    }
  };

  const getMoodEmoji = (title = "") => {
    const value = normalize(title);

    if (value.includes("rieur") || value.includes("rire")) return "😂";
    if (value.includes("etonn") || value.includes("surpris")) return "😲";
    if (value.includes("heureux") || value.includes("joyeux")) return "😄";
    if (value.includes("bien") || value.includes("calme")) return "🙂";
    if (value.includes("moyen") || value.includes("neutre")) return "😐";
    if (value.includes("triste") || value.includes("mal")) return "😢";
    if (value.includes("enerv") || value.includes("colere")) return "😡";
    if (value.includes("fatigu")) return "😴";
    if (value.includes("stress") || value.includes("angoiss")) return "😰";

    return null;
  };

  const setTextIfNeeded = (element, value) => {
    if (element && element.textContent !== value) {
      element.textContent = value;
    }
  };

  const applyPageCopy = async () => {
    const firstName = await getFirstName();

    const profileTitle = document.querySelector(
      ".profile-page .welcome-copy h1"
    );
    const profileSubtitle = document.querySelector(
      ".profile-page .welcome-copy > p"
    );

    if (profileTitle) {
      setTextIfNeeded(
        profileTitle,
        firstName
          ? `Ton espace personnel, ${firstName} ✨`
          : "Ton espace personnel ✨"
      );
    }

    if (profileSubtitle) {
      setTextIfNeeded(
        profileSubtitle,
        "Retrouve ici ton compte et un aperçu de ton suivi."
      );
    }

    const chooseHeader = document.querySelector(".choose-mood-page .mood-header");

    if (chooseHeader) {
      const title = chooseHeader.querySelector("h1");
      const subtitle = chooseHeader.querySelector("p");

      setTextIfNeeded(
        title,
        firstName ? `Bonjour, ${firstName} 👋` : "Bonjour 👋"
      );
      setTextIfNeeded(subtitle, "Alors, quelle est ton humeur aujourd’hui ?");
    }

    document
      .querySelectorAll(".choose-mood-page .quick-mood")
      .forEach((button) => {
        const emojiNode = button.querySelector(".quick-emoji");
        const spans = button.querySelectorAll("span");
        const moodTitle = spans[1]?.textContent?.trim() || "";
        const emoji = getMoodEmoji(moodTitle);

        if (emoji) {
          setTextIfNeeded(emojiNode, emoji);
        }
      });
  };

  const scheduleApplyPageCopy = () => {
    if (frameRequested) return;
    frameRequested = true;

    requestAnimationFrame(() => {
      frameRequested = false;
      applyPageCopy();
    });
  };

  nuxtApp.hook("page:finish", scheduleApplyPageCopy);

  const observer = new MutationObserver(scheduleApplyPageCopy);

  const start = () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    scheduleApplyPageCopy();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
});
