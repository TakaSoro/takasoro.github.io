import { html, escape } from './utils.js';
import { state } from './state.js';
import { getPost } from './posts.js';

export function renderTags(tags = []) {
  if (!tags.length) return '';
  return html`<div class="tags">${tags.map(tag => `<span class="tag">${escape(tag)}</span>`).join('')}</div>`;
}

export function renderButtons(links = []) {
  if (!links.length) return '';
  return html`
    <div class="link-group">
      ${links.map(([label, url]) => html`
        <a class="button ghost" href="${escape(url)}" target="_blank" rel="noreferrer">
          ${escape(label)}
          <svg class="icon-svg" viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
            <path fill-rule="evenodd" d="M10.604 1.125a.75.75 0 01.037 1.06l-4.72 4.82 4.72 4.819a.75.75 0 11-1.075 1.05l-5.25-5.35a.75.75 0 010-1.05l5.25-5.35a.75.75 0 011.088.012z" transform="rotate(180 8 8)"></path>
          </svg>
        </a>
      `).join('')}
    </div>
  `;
}

export function buildWorkCard(project) {
  if (!project) return '';
  const status = project.status || 'Completed';
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
  return html`
    <a class="work-card" href="#/work/${escape(project.slug)}">
      <div class="work-card-top">
        <div class="work-card-top-left">
          <span class="work-id">${escape(project.number || 'PRJ.XX')}</span>
          <span class="work-category">${escape(project.category)}</span>
        </div>
        <span class="work-status status-${statusClass}">
          <span class="status-indicator"></span>
          ${escape(status)}
        </span>
      </div>
      <div class="work-card-body">
        <h3 class="work-title">${escape(project.title)}</h3>
        <p class="work-summary">${escape(project.summary)}</p>
        ${renderTags(project.tags)}
      </div>
      <div class="work-card-bottom">
        <span>View Details</span>
        <span class="arrow">&rarr;</span>
      </div>
    </a>
  `;
}

export function buildSection(title, body) {
  return html`
    <section class="detail-section">
      <h2>${escape(title)}</h2>
      <p>${escape(body)}</p>
    </section>
  `;
}

export function renderHome() {
  const selection = (state.config.home?.selection || []).map(slug => buildWorkCard(state.workMap[slug])).join('');
  return html`
    <div class="container">
      <section class="intro-section reveal">
        <p class="eyebrow"> // WELCOME</p>
        <h1 class="main-title">TakaSoro</h1>
        <p class="intro-text">
          Seoul Science High School student specializing in Mathematics, Computer Science, and Data Science.
        </p>
        <div class="cta-group">
          <a class="button ghost" href="#/research">Research</a>
          <a class="button ghost" href="https://github.com/TakaSoro" target="_blank" rel="noreferrer">
            <svg class="icon-svg" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            GitHub
          </a>
        </div>
      </section>

      <section class="content-section info-section reveal">
        <div class="info-grid">
          <div class="info-block">
            <span class="info-label">SCHOOL</span>
            <strong>Seoul Science High School</strong>
          </div>
          <div class="info-block">
            <span class="info-label">FOCUS</span>
            <strong>Math · CS · Data Science</strong>
          </div>
          <div class="info-block">
            <span class="info-label">PROFILES</span>
            <div class="link-group">
              <a class="text-link" href="https://github.com/TakaSoro" target="_blank" rel="noreferrer">GitHub</a>
              <span class="divider">&middot;</span>
              <a class="text-link" href="https://doj.kr/en/user/melphin" target="_blank" rel="noreferrer">DOJ</a>
              <span class="divider">&middot;</span>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section reveal">
        <div class="data">
          ${(state.config.home?.data || []).map(m => html`
            <article class="stat-card">
              <span class="stat-label">${escape(m.label)}</span>
              ${m.title ? `<strong class="stat-value">${escape(m.title)}</strong>` : ''}
              ${m.desc ? `<p class="stat-desc">${escape(m.desc)}</p>` : ''}
            </article>
          `).join('')}
        </div>
      </section>

      <section class="content-section reveal">
        <div class="section-heading">
          <h2><span class="section-code">//</span> Selected Works</h2>
        </div>
        <div class="work-grid">${selection}</div>
      </section>
    </div>
  `;
}

export function renderWork(type) {
  const works = type === 'projects' ? state.works.projects : (type === 'research' ? state.works.research : state.works.labs);
  const groups = ['All', ...Array.from(new Set(works.map(p => p.category)))];
  const visible = state.filter === 'All' ? works : works.filter(p => p.category === state.filter);
  const secCodes = { research: '02', projects: '03', labs: '04' };
  const secCode = secCodes[type] || 'OO';
  return html`
    <div class="container">
      <section class="page-header reveal">
        <h1 class="heading-xl"><span class="heading-code">${secCode} //</span> ${type.charAt(0).toUpperCase() + type.slice(1)}</h1>
        <p class="description">Registry database of ${type} and experimental modules.</p>
        <div class="filter-bar" role="tablist" aria-label="Project Filter">
          ${groups.map(group => `<button type="button" data-filter="${escape(group)}" class="${group === state.filter ? 'active' : ''}">${escape(group)}</button>`).join('')}
        </div>
      </section>

      <section class="content-section reveal">
        <div class="work-grid">${visible.map(project => buildWorkCard(project)).join('')}</div>
      </section>
    </div>
  `;
}

export function renderWorkDetail(slug) {
  const type = state.typeMap[slug] || 'projects';
  const works = type === 'projects' ? state.works.projects : (type === 'research' ? state.works.research : state.works.labs);
  const project = state.workMap[slug] || works[0];
  const status = project.status || 'Completed';
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
  return html`
    <div class="container">
      <div class="reveal">
        <a class="return-link" href="#/${type}">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path fill-rule="evenodd" d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z"></path>
          </svg>
          Back to ${type.charAt(0).toUpperCase() + type.slice(1)}
        </a>
      </div>
      
      <section class="page-header detail-header reveal">
        <div class="detail-meta">
          <span class="work-id">${escape(project.number || 'PRJ.XX')}</span>
          <span class="type-badge">${escape(project.category)}</span>
          <span class="work-status status-${statusClass}">
            <span class="status-indicator"></span>
            ${escape(status)}
          </span>
        </div>
        <h1 class="heading-xl"><span class="heading-code">${escape(project.number || 'PRJ.XX')} //</span> ${escape(project.title)}</h1>
        <p class="description">${escape(project.tagline)}<br>${escape(project.summary)}</p>
        <div class="detail-tags">
          ${renderTags(project.tags)}
          ${renderButtons(project.links)}
        </div>
      </section>

      <div class="detail-grid reveal">
        <div class="detail-content">
          ${project.details.map(([title, body]) => buildSection(title, body)).join('')}
        </div>
        <aside class="detail-sidebar" aria-label="Project Summary">
          <dl class="info-list">
            <div><dt>Registry ID</dt><dd class="work-id">${escape(project.number || 'PRJ.XX')}</dd></div>
            <div><dt>Type</dt><dd>${escape(project.category)}</dd></div>
            <div><dt>Period</dt><dd>${escape(project.period)}</dd></div>
            <div><dt>Role</dt><dd>${escape(project.role)}</dd></div>
            <div><dt>Takeaway</dt><dd>${escape(project.takeaway)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  `;
}

export function renderProblem() {
  const contests = state.config.problem?.contests || [];
  return html`
    <div class="container">
      <section class="page-header reveal">
        <h1 class="heading-xl"><span class="heading-code">06 //</span> PROBLEM</h1>
        <p class="description">Contest problem design, test case validation, and peer reviewing.</p>
      </section>

      <section class="content-section reveal">
        <div class="data">
          ${(state.config.problem?.data || []).map(m => html`
            <article class="stat-card">
              <span class="stat-label">${escape(m.label)}</span>
              ${m.title ? `<strong class="stat-value">${escape(m.title)}</strong>` : ''}
              ${m.desc ? `<p class="stat-desc">${escape(m.desc)}</p>` : ''}
            </article>
          `).join('')}
        </div>
      </section>

      <section class="content-section reveal">
        <div class="section-heading">
          <h2><span class="section-code">//</span> Contest History</h2>
        </div>
        <div class="data-table">
          <div class="table-line head"><span>Date</span><span>Contest</span><span>Role</span><span>Scope</span></div>
          ${contests.map(([date, name, role, scope, url]) => html`
            <div class="table-line">
              <span class="date-cell">${escape(date)}</span>
              <span class="contest-cell"><strong><a href="${url}">${escape(name)}</a></strong></span>
              <span class="role-cell">${escape(role)}</span>
              <span class="scope-cell">${escape(scope)}</span>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

export function renderHonors() {
  const timeline = state.config.honors?.timeline || [];
  return html`
    <div class="container">
      <section class="page-header reveal">
        <h1 class="heading-xl"><span class="heading-code">07 //</span> HONORS</h1>
        <p class="description">Awards, academic achievements, and certifiable evidence.</p>
      </section>

      ${state.config.honors?.data?.length ? html`
        <section class="content-section reveal">
          <div class="data">
            ${(state.config.honors.data || []).map(m => html`
              <article class="stat-card">
                <span class="stat-label">${escape(m.label)}</span>
                ${m.title ? `<strong class="stat-value">${escape(m.title)}</strong>` : ''}
                ${m.desc ? `<p class="stat-desc">${escape(m.desc)}</p>` : ''}
              </article>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <section class="content-section reveal">
        <div class="section-heading">
          <h2><span class="section-code">//</span> Academic Timeline</h2>
        </div>
        <div class="history">
          ${timeline.map(([year, items]) => html`
            <div class="year-group">
              <div class="year-label">${escape(year)}</div>
              <div class="year-items">
                ${items.map(([title, body]) => html`
                  <article class="event-card">
                    <div class="event-dot"></div>
                    <div class="event-content">
                      <strong>${escape(title)}</strong>
                      <p>${escape(body)}</p>
                    </div>
                  </article>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

export function renderLogList() {
  const sorted = [...state.posts].sort((a, b) => {
    const da = new Date(a.date).getTime() || 0;
    const db = new Date(b.date).getTime() || 0;
    return db - da;
  });
  return html`
    <div class="container">
      <section class="page-header reveal">
        <h1 class="heading-xl"><span class="heading-code">05 //</span> LOG_STREAM</h1>
        <p class="description">Thoughts, research notes, and mathematical logs.</p>
      </section>
      <section class="content-section reveal">
        ${sorted.length ? html`
          <div class="posts-grid">
            ${sorted.map(post => html`
              <a class="post-card" href="#/log/${escape(post.slug)}">
                <div class="post-card-top">
                  <span class="post-id">LOG.${post.date.replace(/-/g, '.')}</span>
                  <span class="post-date">${escape(post.date)}</span>
                </div>
                <div class="post-card-body">
                  <h3 class="post-title">${escape(post.title)}</h3>
                  <p class="post-desc">${escape(post.description)}</p>
                  ${renderTags(post.tags)}
                </div>
                <div class="post-card-bottom">
                  <span>Read More</span>
                  <span class="arrow">&rarr;</span>
                </div>
              </a>
            `).join('')}
          </div>
        ` : html`<p class="empty-message">No posts yet.</p>`}
      </section>
    </div>
  `;
}

export function renderLogPost(slug) {
  const post = state.posts.find(p => p.slug === slug) || null;
  const content = post ? getPost(slug) : null;
  const postCode = post?.date ? `LOG.${post.date.replace(/-/g, '.')}` : 'LOG.SYS';
  return html`
    <div class="container">
      <div class="reveal">
        <a class="return-link" href="#/log">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path fill-rule="evenodd" d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z"></path>
          </svg>
          Back to Log
        </a>
      </div>
      <article class="post-detail reveal">
        <div class="post-meta">
          <span class="post-id">${postCode}</span>
          <span class="post-date">${escape(post?.date || '')}</span>
          ${renderTags(post?.tags)}
        </div>
        <h1 class="post-title"><span class="heading-code">${postCode} <br>//</span> ${escape(post?.title || 'Untitled')}</h1>
        <div class="post-body">
          ${content ? marked.parse(content) : '<p>Post content not found.</p>'}
        </div>
      </article>
    </div>
  `;
}
