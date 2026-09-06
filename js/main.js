import { state } from './state.js';
import { fetchConfig } from './config.js';
import { fetchPosts } from './posts.js';
import { render, refreshLucideIcons } from './router.js';

// Real-time clock in persistent footer
function startFooterClock() {
  const clockEl = document.getElementById('footer-clock');
  if (!clockEl) return;

  function updateClock() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Seoul',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `Seoul (KST) · ${timeString}`;
    } catch (e) {
      clockEl.textContent = new Date().toLocaleTimeString();
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

window.closeContactModal = function() {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    state.contactModalOpen = false;
    document.body.classList.remove('overflow-hidden');
  }
};

window.toggleMobileNav = function() {
  const mobileNav = document.getElementById('mobile-nav-drawer');
  if (mobileNav) {
    mobileNav.classList.toggle('hidden');
    refreshLucideIcons();
  }
};

window.closeMobileNav = function() {
  const mobileNav = document.getElementById('mobile-nav-drawer');
  if (mobileNav) {
    mobileNav.classList.add('hidden');
  }
};

window.copyContactEmail = function() {
  const email = 'takasoro.research@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    const btn = document.getElementById('copy-email-btn');
    if (btn) {
      const orig = btn.innerHTML;
      btn.innerHTML = `<i data-lucide="check" class="w-4 h-4 text-emerald-400 inline-block"></i> Copied!`;
      refreshLucideIcons();
      setTimeout(() => {
        btn.innerHTML = orig;
        refreshLucideIcons();
      }, 2000);
    }
  });
};

function bindEvents() {
  window.addEventListener('hashchange', () => {
    window.closeMobileNav();
    render();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeContactModal();
      window.closeMobileNav();
    }
  });
}

export async function initialize() {
  await fetchConfig();
  await fetchPosts();

  if (!window.location.hash) {
    window.location.hash = '#/home';
  }

  bindEvents();
  render();
  startFooterClock();
  state.ready = true;
  refreshLucideIcons();
}

initialize();
