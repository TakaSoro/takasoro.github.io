import { load } from "https://esm.unpkg.com/js-yaml@5.2.3?target=es2022";
import { state } from './state.js';

export async function fetchConfig() {
  try {
    const text = await fetch('settings.yaml').then(r => r.text());
    state.config = load(text);
    state.endpoints = state.config.routes || {};
    state.works = state.config.works || [];
    state.slugMap = Object.fromEntries(state.works.map(x => [x.slug, x]));
    state.contributions = state.config.contributions || [];
    state.reading = state.config.reading || [];
    state.about = state.config.about || [];
    state.filter = state.config.defaultGroup || 'All';
  } catch (err) {
    console.error('Config load failed:', err);
  }
}
