import { state } from './state.js';
import { fetchConfig } from './config.js';
import { fetchPosts } from './posts.js';
import { render } from './router.js';

export async function initialize() {
  await fetchConfig();
  await fetchPosts();

  if (!window.location.hash) {
    window.location.hash = '#/home';
  }

  bindEvents();
  render();
  state.ready = true;
}

function bindEvents() {
  window.addEventListener('hashchange', render);
}

initialize();
