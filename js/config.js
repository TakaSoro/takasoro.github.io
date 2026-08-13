import { load } from "https://esm.unpkg.com/js-yaml@5.2.3?target=es2022";
import { state } from './state.js';

export async function fetchConfig() {
  try {
    const text = await fetch('settings.yaml').then(r => r.text());
    state.config = load(text);
    state.endpoints = state.config.routes || {};
    state.works.projects = state.config.projects || [];
    state.works.research = state.config.research || [];
    state.works.labs = state.config.labs || [];
    state.filter = state.config.defaultGroup || 'All';
    const combined = [
      ...state.works.projects.map(p => [p.slug, p]),
      ...state.works.research.map(p => [p.slug, p]),
      ...state.works.labs.map(p => [p.slug, p])
    ];
    state.workMap = Object.fromEntries(combined);
    const typeMap = [
      ...state.works.projects.map(p => [p.slug, 'projects']),
      ...state.works.research.map(p => [p.slug, 'research']),
      ...state.works.labs.map(p => [p.slug, 'labs'])
    ];
    state.typeMap = Object.fromEntries(typeMap);
  } catch (err) {
    console.error('Config load failed:', err);
  }
}
