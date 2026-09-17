export default defineNuxtPlugin((nuxtApp) => {
  const styleId = 'profile-photo-delete-style';

  const ensureStyles = () => {
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .photo-remove-btn {
        position: absolute;
        left: -5px;
        bottom: -5px;
        width: 27px;
        height: 27px;
        display: grid;
        place-items: center;
        border: 2px solid #fffaf0;
        border-radius: 50%;
        background: #fff5f2;
        color: #9a382e;
        font-size: 0.64rem;
        cursor: pointer;
        box-shadow: 0 5px 12px rgba(44, 24, 16, 0.14);
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .photo-remove-btn:hover {
        transform: translateY(-1px);
        background: #ffe9e4;
      }

      .photo-remove-btn:disabled {
        opacity: 0.55;
        cursor: wait;
      }
    `;

    document.head.appendChild(style);
  };

  const removeExistingButton = () => {
    document.querySelector('.photo-remove-btn')?.remove();
  };

  const ensureDeleteButton = () => {
    if (window.location.pathname !== '/profil') {
      removeExistingButton();
      return;
    }

    const photoWrap = document.querySelector('.account-photo-wrap');
    const profileImage = photoWrap?.querySelector('.account-avatar img');

    if (!photoWrap || !profileImage) {
      removeExistingButton();
      return;
    }

    if (photoWrap.querySelector('.photo-remove-btn')) return;

    ensureStyles();

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'photo-remove-btn';
    button.setAttribute('aria-label', 'Supprimer la photo de profil');
    button.setAttribute('title', 'Supprimer la photo');
    button.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i>';

    button.addEventListener('click', async () => {
      const confirmed = window.confirm('Supprimer votre photo de profil ?');
      if (!confirmed) return;

      const userId = localStorage.getItem('userId');
      if (!userId) return;

      button.disabled = true;

      try {
        const response = await fetch(
          `https://suivi-humeurs-funes.onrender.com/api/auth/profil/${userId}/photo`,
          { method: 'DELETE' }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || 'Impossible de supprimer la photo.');
        }

        window.location.reload();
      } catch (error) {
        button.disabled = false;
        window.alert(error.message || 'Impossible de supprimer la photo.');
      }
    });

    photoWrap.appendChild(button);
  };

  let observer;

  const startObserver = () => {
    if (observer || !document.body) return;

    observer = new MutationObserver(() => {
      ensureDeleteButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  nuxtApp.hook('app:mounted', () => {
    ensureDeleteButton();
    startObserver();
  });

  nuxtApp.hook('page:finish', () => {
    ensureDeleteButton();
  });
});
