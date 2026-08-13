import { state } from './state.js';

export async function fetchPosts() {
  try {
    const data = await fetch('posts/info.json').then(r => r.json());
    state.posts = Array.isArray(data) ? data : [];
    state.postCache = {};
    await Promise.allSettled(
      state.posts.map(post =>
        fetch(`posts/${post.slug}.md`).then(r => r.text()).then(text => {
          state.postCache[post.slug] = text;
        })
      )
    );
  } catch (err) {
    console.error('Posts load failed:', err);
  }
}

export function getPost(slug) {
  return state.postCache[slug] || null;
}
