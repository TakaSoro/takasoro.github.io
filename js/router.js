import { state } from './state.js';
import {
  renderHome,
  renderContribute,
  renderReading,
  renderAbout,
  renderWork,
  renderWorkDetail,
  renderProblem,
  renderLogList,
  renderLogPost
} from './templates.js';

const contentArea = document.querySelector('#app');
const dynamicView = document.querySelector('#view');

export function parseRoute() {
  const cleaned = window.location.hash.replace(/^#\/?/, '').trim();
  const parts = cleaned.split('/').filter(Boolean);
  if (!parts.length) return { page: 'home' };
  
  const p0 = parts[0].toLowerCase();
  
  if (p0 === 'works' && parts[1]) return { page: 'work', slug: parts[1] };
  if (p0 === 'work' && parts[1]) return { page: 'work', slug: parts[1] };
  if (p0 === 'log' && parts[1]) return { page: 'post', slug: parts[1] };
  
  if (['home', 'works', 'contribute', 'reading', 'about', 'log', 'problem'].includes(p0)) {
    return { page: p0 };
  }
  
  if (Object.prototype.hasOwnProperty.call(state.endpoints, p0)) {
    return { page: p0 };
  }
  
  return { page: 'home' };
}

export function setActiveNav(page) {
  const navItems = Array.from(document.querySelectorAll('[data-route]'));
  navItems.forEach(link => {
    const route = link.dataset.route;
    const active = route === page || (page === 'work' && route == 'works');
    
    link.classList.toggle('nav-link-active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function bindFilters(page) {
  // Category filters for works
  if (page == 'works') {
    dynamicView.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filter = btn.dataset.filter || 'All';
        render();
      });
    });
  }

  // Book filters
  if (page === 'reading') {
    dynamicView.querySelectorAll('[data-book-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.bookFilter = btn.dataset.bookFilter || 'All';
        render();
      });
    });
  }
}

export function refreshLucideIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

export function render() {
  const route = parseRoute();
  let markup = '';
  let title = '';

  switch (route.page) {
    case 'home':
      markup = renderHome();
      title = 'Home';
      break;
    case 'works':
      markup = renderWork();
      title = 'Works';
      break;
    case 'contribute':
      markup = renderContribute();
      title = 'Contributions';
      break;
    case 'reading':
      markup = renderReading();
      title = 'Books & Reading List';
      break;
    case 'about':
      markup = renderAbout();
      title = 'About';
      break;
    case 'work':
      markup = renderWorkDetail(route.slug);
      title = 'Work Detail';
      break;
    case 'log':
      markup = renderLogList();
      title = 'Logs & Essays';
      break;
    case 'post':
      markup = renderLogPost(route.slug);
      title = state.posts.find(p => p.slug === route.slug)?.title || 'Log';
      break;
    case 'problem':
      markup = renderProblem();
      title = 'Contest Problems';
      break;
    default:
      markup = renderHome();
      title = 'Home';
      break;
  }

  dynamicView.innerHTML = markup;
  setActiveNav(route.page);
  bindFilters(route.page);
  refreshLucideIcons();
  
  document.title = `TakaSoro · ${title}`;
  contentArea?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}
