export default defineNuxtPlugin((nuxtApp) => {
  let cachedFirstName = "";

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

  const applyPageCopy = async () => {
    const profileSubtitle = document.querySelector(
      ".profile-page .welcome-copy > p"
    );

    if (profileSubtitle) {
      profileSubtitle.textContent =
        "Retrouve ici ton compte et un aperçu de ton suivi.";
    }

    const chooseHeader = document.querySelector(".choose-mood-page .mood-header");
    if (!chooseHeader) return;

    const title = chooseHeader.querySelector("h1");
    const subtitle = chooseHeader.querySelector("p");
    const firstName = await getFirstName();

    if (title) {
      title.textContent = firstName
        ? `Bonjour, ${firstName} 👋`
        : "Bonjour 👋";
    }

    if (subtitle) {
      subtitle.textContent = "Alors, quelle est ton humeur aujourd’hui ?";
    }
  };

  nuxtApp.hook("page:finish", applyPageCopy);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPageCopy, { once: true });
  } else {
    applyPageCopy();
  }
});
