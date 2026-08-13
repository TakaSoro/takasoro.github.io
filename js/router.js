import { state } from './state.js';
import {
  renderTags,
  renderButtons,
  buildWorkCard,
  buildSection,
  renderHome,
  renderWork,
  renderWorkDetail,
  renderProblem,
  renderHonors,
  renderLogList,
  renderLogPost
} from './templates.js';

const contentArea = document.querySelector('#app');
const dynamicView = document.querySelector('#view');
const navItems = Array.from(document.querySelectorAll('.main-nav a[route]'));

export function parseRoute() {
  const cleaned = window.location.hash.replace(/^#\/?/, '').trim();
  const parts = cleaned.split('/').filter(Boolean);
  if (!parts.length) return { page: 'home' };
  if (parts[0] === 'projects' && parts[1]) return { page: 'projects', slug: parts[1] };
  if (parts[0] === 'research' && parts[1]) return { page: 'research', slug: parts[1] };
  if (parts[0] === 'labs' && parts[1]) return { page: 'labs', slug: parts[1] };
  if (parts[0] === 'log' && parts[1]) return { page: 'post', slug: parts[1] };
  if (parts[0] === 'log') return { page: 'log' };
  if (parts[0] === 'work') return { page: 'work', slug: parts[1] };
  if (Object.prototype.hasOwnProperty.call(state.endpoints, parts[0])) return { page: parts[0] };
  return { page: 'home' };
}

export function setActiveNav(page) {
  navItems.forEach(link => {
    const active = link.dataset.route === page;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

export function bindFilters(page) {
  if (!state.categories.includes(page)) return;
  dynamicView.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter || 'All';
      render();
    });
  });
}

export function animateReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  dynamicView.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

export function render() {
  const route = parseRoute();
  let markup = '';
  let title = '';

  switch (route.page) {
    case 'home':
      markup = renderHome();
      title = state.endpoints.home;
      break;
    case 'projects':
    case 'research':
    case 'labs':
      markup = renderWork(route.page);
      title = state.endpoints[route.page];
      break;
    case 'work':
      markup = renderWorkDetail(route.slug);
      title = state.workMap[route.slug]?.title || state.endpoints.work;
      break;
    case 'log':
      markup = renderLogList();
      title = state.endpoints.log || 'Log';
      break;
    case 'post':
      markup = renderLogPost(route.slug);
      title = state.posts.find(p => p.slug === route.slug)?.title || state.endpoints.log || 'Log';
      break;
    case 'problem':
      markup = renderProblem();
      title = state.endpoints.problem;
      break;
    case 'honors':
      markup = renderHonors();
      title = state.endpoints.honors;
      break;
  }

  dynamicView.innerHTML = markup;
  setActiveNav(route.page);
  bindFilters(route.page);
  document.title = `TakaSoro's Portfolio · ${title}`;
  contentArea?.focus({ preventScroll: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  animateReveal();
}
