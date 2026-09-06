import { html, escape, icon, renderStars } from './utils.js';
import { state } from './state.js';
import { getPost } from './posts.js';

const options = {
  throwOnError: false
};

if (typeof markedKatex !== 'undefined') {
  marked.use(markedKatex(options));
}

export function renderTags(tags = []) {
  if (!tags || !tags.length) return '';
  return html`
    <div class="flex flex-wrap gap-1.5 mt-3">
      ${tags.filter(Boolean).map(tag => html`
        <span class="px-2.5 py-1 text-xs font-mono font-medium bg-white/[0.04] text-zinc-300 border border-white/[0.06] hover:border-cyan-500/30 transition-colors">
          ${escape(tag)}
        </span>
      `).join('')}
    </div>
  `;
}

export function renderButtons(links = []) {
  if (!links || !links.length) return '';
  return html`
    <div class="flex flex-wrap items-center gap-2 mt-4">
      ${links.filter(([label, url]) => label && url).map(([label, url]) => html`
        <a class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 transition-all hover:scale-[1.02]" href="${escape(url)}" target="_blank" rel="noreferrer">
          ${escape(label)}
          ${icon('external-link', 'w-3 h-3')}
        </a>
      `).join('')}
    </div>
  `;
}

export function buildWorkCard(project) {
  if (!project) return '';
  const status = project.status || 'Completed';
  const isCompleted = status.toLowerCase() === 'completed';
  
  return html`
    <a class="group relative flex flex-col justify-between p-6 bg-[#12151E]/80 backdrop-blur-md border border-white/[0.08] hover:border-cyan-500/40 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-cyan-500/5 overflow-hidden" href="#/work/${escape(project.slug)}">
      <div>
        <div class="flex items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800/80 text-cyan-400 border border-white/5">
              ${escape(project.number || 'PRJ')}
            </span>
            <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              ${escape(project.category)}
            </span>
          </div>
          <span class="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
            <span class="w-1.5 h-1.5 ${isCompleted ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
            ${escape(status)}
          </span>
        </div>

        <h3 class="text-lg font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors tracking-tight">
          ${escape(project.title)}
        </h3>
        
        <p class="mt-2 text-sm text-zinc-400 line-clamp-3 leading-relaxed">
          ${escape(project.summary)}
        </p>

        ${renderTags(project.tags)}
      </div>

      <div class="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs font-medium text-zinc-400 group-hover:text-cyan-300 transition-colors">
        <span>Explore Work</span>
        <span class="transform group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          ${icon('arrow-right', 'w-3.5 h-3.5')}
        </span>
      </div>
    </a>
  `;
}

export function buildSection(title, body) {
  return html`
    <section class="p-6 bg-[#12151E]/60 border border-white/[0.08] backdrop-blur-md mb-4">
      <h2 class="text-base font-semibold text-cyan-300 mb-2 font-mono flex items-center gap-2">
        <span class="text-indigo-400">//</span> ${escape(title)}
      </h2>
      <div class="text-sm text-zinc-300 leading-relaxed space-y-2 whitespace-pre-line">
        ${escape(body)}
      </div>
    </section>
  `;
}

// ----------------------------------------------------
// HOME PAGE
// ----------------------------------------------------
export function renderHome() {
  const selection = (state.config.home?.selection || []).map(slug => buildWorkCard(state.slugMap[slug])).join('');
  const dataCards = state.config.home?.data || [];

  return html`
    <div class="space-y-12 animate-fade-in">
      <!-- Hero Section -->
      <section class="relative p-8 md:p-12 border border-white/[0.5] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div class="relative z-10 max-w-3xl space-y-6">
          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-black leading-tight">
            Melphin
          </h1>

          <p class="text-lg md:text-xl text-black font-normal leading-relaxed">
            High school researcher and developer solving complex problems through 
            Continuous Game Theory, 
            Geometric Dynamical Systems, and 
            Applied Machine Learning.
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a href="#/works" class="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.5] hover:bg-white/[0.3] text-black border border-white/[0.1]">
              ${icon('folder-git-2', 'w-4 h-4')}
              Explore Works
            </a>
          </div>
        </div>
      </section>

      <!-- Bento Metric & Profile Grid -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-6 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between hover:border-cyan-500/30 transition-all">
          <div class="flex items-center justify-between text-zinc-400 mb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-amber-500">INSTITUTION</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-zinc-100">Seoul Science High School</h3>
          </div>
        </div>

        <div class="p-6 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between hover:border-indigo-500/30 transition-all">
          <div class="flex items-center justify-between text-zinc-400 mb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-amber-500">RESEARCH FOCUS</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-zinc-100">Math · CS · Data Science</h3>
            <p class="text-xs text-zinc-400 mt-1">Optimization, Invariant Geometry, Competitive Problem Design</p>
          </div>
        </div>

        <div class="p-6 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between hover:border-sky-500/30 transition-all">
          <div class="flex items-center justify-between text-zinc-400 mb-3">
            <span class="text-xs font-mono uppercase tracking-wider text-amber-500">SOCIAL</span>
          </div>
          <div class="flex items-center gap-3">
            <a href="https://github.com/Melphin" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-200 border border-white/10 transition-colors">
              GitHub
            </a>
            <a href="https://doj.kr/en/user/melphin" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-200 border border-white/10 transition-colors">
              DOJ
            </a>
          </div>
        </div>
      </section>

      <!-- Selected Works Section -->
      <section class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-mono text-zinc-500 tracking-widest uppercase">// SELECTIONS</span>
            <h2 class="text-2xl font-bold text-zinc-600 tracking-tight">Selected Works</h2>
          </div>
          <a href="#/works" class="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
            View All Works ${icon('chevron-right', 'w-4 h-4')}
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${selection}
        </div>
      </section>
    </div>
  `;
}

// ----------------------------------------------------
// CONTRIBUTIONS PAGE (/contribute)
// ----------------------------------------------------
export function renderContribute() {
  const contributions = state.contributions || [];

  return html`
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="relative p-8 md:p-10 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md overflow-hidden">
        <div class="max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            03 // CONTRIBUTION
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            My Contributions
          </h1>
          <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
            Open-source libraries, simulation engines, contest test suites, and data science analyzers built or actively contributed to.
          </p>
        </div>
      </div>

      <!-- 2-Column Responsive Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${contributions.map(item => html`
          <article class="group bg-[#12151E]/80 border border-white/[0.08] hover:border-cyan-500/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between">
            
            <!-- Mockup Container Top -->
            <div class="relative bg-zinc-950/90 border-b border-white/[0.08] p-4 font-mono text-xs overflow-hidden">
              <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-zinc-500">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 bg-red-500/80 inline-block"></span>
                  <span class="w-2.5 h-2.5 bg-yellow-500/80 inline-block"></span>
                  <span class="w-2.5 h-2.5 bg-green-500/80 inline-block"></span>
                  <span class="text-[11px] text-zinc-400 ml-2 font-mono">${escape(item.repo)}</span>
                </div>
                <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                  ${escape(item.mockup?.badge || item.category)}
                </span>
              </div>

              <!-- Interactive Mockup Viewport -->
              <pre class="text-zinc-300 font-mono text-[11px] leading-relaxed overflow-x-auto p-2 bg-black/40 border border-white/[0.04]"><code>${escape(item.mockup?.snippet || item.summary)}</code></pre>
            </div>

            <!-- Content Body -->
            <div class="p-6 md:p-8 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-xs font-mono font-medium text-cyan-400 uppercase tracking-wider">
                    ${escape(item.category)}
                  </span>
                  <div class="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span class="inline-flex items-center gap-1">${icon('star', 'w-3 h-3 text-amber-400')} ${item.stars}</span>
                    <span class="inline-flex items-center gap-1">${icon('git-fork', 'w-3 h-3')} ${item.forks}</span>
                  </div>
                </div>

                <h3 class="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  ${escape(item.title)}
                </h3>

                <p class="text-sm text-zinc-400 leading-relaxed mt-2">
                  ${escape(item.summary)}
                </p>

                <!-- Impact pill -->
                ${item.impact ? html`
                  <div class="p-3 bg-cyan-500/[0.04] border border-cyan-500/15 text-xs text-cyan-200/90 leading-relaxed mt-3 flex items-start gap-2">
                    ${icon('zap', 'w-4 h-4 text-cyan-400 shrink-0 mt-0.5')}
                    <span>${escape(item.impact)}</span>
                  </div>
                ` : ''}

                <!-- Tags -->
                ${renderTags(item.tags)}
              </div>

              <!-- Action Links -->
              <div class="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                ${renderButtons(item.links)}
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// READING LIST PAGE (/read)
// ----------------------------------------------------
export function renderReading() {
  const reading = state.reading || [];
  const currentFilter = state.readingFilter || 'All';
  const filterTabs = ['All', 'Currently Reading', 'Completed', 'Wishlist'];

  const filteredReading = currentFilter === 'All' 
    ? reading
    : reading.filter(b => b.status.toLowerCase() === currentFilter.toLowerCase());

  return html`
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="relative p-8 md:p-10 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md overflow-hidden">
        <div class="max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            04 // READING
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Books & Papers I've Read
          </h1>
          <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
            Key literature in Computer Science, Game Theory, Pure Mathematics, and Distributed Systems that shaped my mental models.
          </p>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap items-center gap-2 border-b border-grey pb-4">
        ${filterTabs.map(tab => html`
          <button type="button" data-book-filter="${escape(tab)}" class="px-4 py-2 text-xs font-medium transition-all ${tab.toLowerCase() === currentFilter.toLowerCase() ? 'bg-zinc-600 text-amber-500' : 'bg-zinc-300 text-amber-500 hover:bg-zinc-400'}">
            ${escape(tab)}
          </button>
        `).join('')}
      </div>

      <!-- 3-Column Grid for Book Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${filteredReading.map(book => {
          const isCompleted = book.status.toLowerCase() === 'completed';
          const isReading = book.status.toLowerCase() === 'currently reading';
          
          return html`
            <article class="group relative bg-[#12151E]/80 border border-white/[0.08] hover:border-cyan-500/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/5 flex flex-col justify-between">
              
              <!-- 3D Book Spine & Cover Container -->
              <div class="relative h-48 bg-zinc-800 p-6 flex flex-col justify-between border-b border-white/[0.08] shadow-inner">
                <div class="flex items-center justify-between">
                  <span class="px-2.5 py-1 bg-black/40 backdrop-blur-md text-[11px] font-mono text-zinc-200 border border-white/10">
                    ${escape(book.genre)}
                  </span>
                  <span class="px-2.5 py-1 text-[11px] font-medium border ${isCompleted ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : (isReading ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' : 'bg-zinc-700/30 text-zinc-300 border-zinc-600/30')}">
                    ${escape(book.status)}
                  </span>
                </div>

                <div class="space-y-1">
                  <span class="text-xs font-mono text-cyan-300 tracking-wider">${escape(book.coverTag || 'VOL')}</span>
                  <h3 class="text-lg font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                    ${escape(book.title)}
                  </h3>
                </div>
              </div>

              <!-- Body Details -->
              <div class="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="text-xs font-medium text-zinc-400">${escape(book.author)}</span>
                    <span class="text-xs font-mono text-zinc-500">${escape(book.year)}</span>
                  </div>

                  <!-- Star Rating -->
                  <div class="mb-3">
                    ${renderStars(book.rating)}
                  </div>

                  <p class="text-xs text-zinc-300 leading-relaxed mb-3">
                    ${escape(book.summary)}
                  </p>

                  <!-- Takeaway Snippet -->
                  <div class="p-3 bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed space-y-1">
                    <span class="font-mono text-[10px] text-cyan-400 font-semibold uppercase block">Key Takeaway</span>
                    <p class="italic text-zinc-400">"${escape(book.takeaway)}"</p>
                  </div>
                </div>

                <!-- Quote Footer -->
                ${book.quote ? html`
                  <div class="pt-3 border-t border-white/[0.06] text-[11px] text-zinc-500 italic">
                    "${escape(book.quote)}"
                  </div>
                ` : ''}
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// ABOUT PAGE (/about)
// ----------------------------------------------------
export function renderAbout() {
  const timeline = state.config.honors?.timeline || [];
  const bio = state.about;

  return html`
    <div class="space-y-10 animate-fade-in">
      <!-- Header -->
      <div class="relative p-8 md:p-10 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md overflow-hidden">
        <div class="max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            01 // PROFILE
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            About
          </h1>
          <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
            Hardware, developer environment, desk setup, and academic biography.
          </p>
        </div>
      </div>

      <!-- Bio Overview Bento -->
      <section class="p-8 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-mono text-2xl font-bold text-white shadow-lg shadow-cyan-500/20">
              TS
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">${escape(bio.name || 'Melphin')}</h2>
              <p class="text-sm text-cyan-400 font-medium">${escape(bio.title)}</p>
              <p class="text-xs text-zinc-400 font-mono">${escape(bio.school)} · ${escape(bio.location)}</p>
            </div>
          </div>
        </div>

        <div class="text-sm text-zinc-300 leading-relaxed max-w-3xl space-y-3">
          <p>${escape(bio.about)}</p>
        </div>
      </section>

    <div class="space-y-10 animate-fade-in">
      <h3 class="text-3xl md:text-5xl font-extrabold text-zinc-600 tracking-tight">
        // Honors & Awards
      </h1>

      <div class="space-y-8">
        ${timeline.map(([year, items]) => html`
          <section class="space-y-4">
            <h2 class="text-base font-mono text-zinc-600 font-bold tracking-wider">// ${escape(year)}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${items.map(([title, body]) => html`
                <div class="p-6 bg-[#12151E]/70 border border-white/[0.08] backdrop-blur-md hover:border-cyan-500/30 transition-all">
                  <div class="w-8 h-8 bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                    ${icon('award', 'w-4 h-4')}
                  </div>
                  <h3 class="text-base font-bold text-white">${escape(title)}</h3>
                  <p class="text-xs text-zinc-400 mt-1 leading-relaxed">${escape(body)}</p>
                </div>
              `).join('')}
            </div>
          </section>
        `).join('')}
      </div>
    </div>
    </div>
  `;
}

// ----------------------------------------------------
// WORK / RESEARCH / LABS LIST PAGES
// ----------------------------------------------------
export function renderWork() {
  const works = state.works;
  const groups = ['All', ...Array.from(new Set(works.map(p => p.category)))];
  const visible = state.filter === 'All' ? works : works.filter(p => p.category === state.filter);

  return html`
    <div class="space-y-10 animate-fade-in">
      <!-- Page Header -->
      <div class="relative p-8 md:p-10 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md overflow-hidden">
        <div class="max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            02 // WORK
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            WORKS
          </h1>
          <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
            Registry database of works and experimental computational modules.
          </p>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap items-center gap-2 border-b border-grey pb-4">
        ${groups.map(group => html`
          <button type="button" data-filter="${escape(group)}" class="px-4 py-2 text-xs font-medium transition-all ${group === state.filter ? 'bg-zinc-600 text-amber-500' : 'bg-zinc-300 text-amber-500 hover:bg-zinc-400'}">
            ${escape(group)}
          </button>
        `).join('')}
      </div>

      <!-- Bento Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${visible.map(project => buildWorkCard(project)).join('')}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// WORK DETAIL VIEW (/work/:slug)
// ----------------------------------------------------
export function renderWorkDetail(slug) {
  const project = state.slugMap[slug];
  if (!project) return html`<div class="p-12 text-center text-zinc-400">Work item not found.</div>`;

  const status = project.status || 'Completed';
  const isCompleted = status.toLowerCase() === 'completed';

  return html`
    <div class="space-y-8 animate-fade-in">
      <div>
        <a class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 transition-colors" href="#/work">
          ${icon('arrow-left', 'w-3.5 h-3.5')} Back to Work
        </a>
      </div>

      <section class="p-8 md:p-10 bg-[#12151E]/90 border border-white/[0.08] backdrop-blur-md space-y-6">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-mono text-xs font-bold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            ${escape(project.number || 'PRJ')}
          </span>
          <span class="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            ${escape(project.category)}
          </span>
          <span class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}">
            <span class="w-1.5 h-1.5 ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}"></span>
            ${escape(status)}
          </span>
        </div>

        <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          ${escape(project.title)}
        </h1>

        <p class="text-base md:text-lg text-zinc-300 font-normal leading-relaxed">
          ${escape(project.tagline)}
        </p>

        <div class="space-y-4 pt-2">
          ${renderTags(project.tags)}
          ${renderButtons(project.links)}
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4">
          ${(project.details || []).map(([title, body]) => buildSection(title, body)).join('')}
        </div>

        <aside class="space-y-4">
          <div class="p-6 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md space-y-4">
            <h3 class="text-xs font-mono text-cyan-400 uppercase tracking-widest">// SPECIFICATION</h3>
            <dl class="space-y-3 text-xs">
              <div>
                <dt class="text-zinc-500 uppercase">Period</dt>
                <dd class="text-zinc-200 font-mono font-medium mt-0.5">${escape(project.period)}</dd>
              </div>
              <div>
                <dt class="text-zinc-500 uppercase">Role</dt>
                <dd class="text-zinc-200 font-medium mt-0.5">${escape(project.role)}</dd>
              </div>
              <div>
                <dt class="text-zinc-500 uppercase">Key Takeaway</dt>
                <dd class="text-zinc-300 italic mt-0.5 leading-relaxed">${escape(project.takeaway)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// PROBLEM PAGE (/problem)
// ----------------------------------------------------
export function renderProblem() {
  const contests = state.config.problem?.contests || [];
  const dataCards = state.config.problem?.data || [];

  return html`
    <div class="space-y-10 animate-fade-in">
      <div class="relative p-8 md:p-10 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md overflow-hidden">
        <div class="max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            06 // PROBLEM SETTING
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Contest Problems
          </h1>
          <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
            Contest problem design, test case validation, and peer reviewing for programming olympiads.
          </p>
        </div>
      </div>

      ${dataCards.length ? html`
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${dataCards.map(d => html`
            <div class="p-6 bg-[#12151E]/70 border border-white/[0.08] backdrop-blur-md">
              <span class="text-xs font-mono font-semibold text-cyan-400 uppercase">${escape(d.label)}</span>
              <h3 class="text-2xl font-bold text-white mt-1">${escape(d.title)}</h3>
              <p class="text-xs text-zinc-400 mt-1">${escape(d.desc)}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="p-6 md:p-8 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md space-y-4">
        <h2 class="text-lg font-bold text-white">// Contest History</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-white/[0.08] text-zinc-400 font-mono uppercase">
                <th class="py-3 px-4">Date</th>
                <th class="py-3 px-4">Contest</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">Scope</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.04]">
              ${contests.map(([date, name, role, scope, url]) => html`
                <tr class="hover:bg-white/[0.02] transition-colors">
                  <td class="py-3.5 px-4 font-mono text-zinc-400">${escape(date)}</td>
                  <td class="py-3.5 px-4 font-medium text-cyan-300">
                    <a href="${escape(url)}" target="_blank" class="hover:underline flex items-center gap-1">
                      ${escape(name)} ${icon('external-link', 'w-3 h-3')}
                    </a>
                  </td>
                  <td class="py-3.5 px-4 text-zinc-300">${escape(role)}</td>
                  <td class="py-3.5 px-4 font-mono text-zinc-400">${escape(scope)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// LOG & POSTS PAGES (/log, /log/:slug)
// ----------------------------------------------------
export function renderLogList() {
  const sorted = [...state.posts].sort((a, b) => {
    const da = new Date(a.date).getTime() || 0;
    const db = new Date(b.date).getTime() || 0;
    return db - da;
  });

  return html`
    <div class="space-y-10 animate-fade-in">
      <div class="relative p-8 md:p-10 bg-[#12151E]/80 border border-white/[0.08] backdrop-blur-md overflow-hidden">
        <div class="max-w-2xl space-y-3">
          <div class="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
            05 // LOG & ESSAYS
          </div>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Logs
          </h1>
          <p class="text-zinc-400 text-sm md:text-base leading-relaxed">
            Thoughts, technical logs, progress notes, and mathematical explorations.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${sorted.map(post => html`
          <a class="group p-6 bg-[#12151E]/80 border border-white/[0.08] hover:border-cyan-500/40 backdrop-blur-md transition-all hover:-translate-y-1 flex flex-col justify-between" href="#/log/${escape(post.slug)}">
            <div>
              <div class="flex items-center justify-between text-xs font-mono text-zinc-500 mb-3">
                <span class="text-cyan-400">LOG.${post.date.replace(/-/g, '.')}</span>
                <span>${escape(post.date)}</span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                ${escape(post.title)}
              </h3>
              <p class="text-xs text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                ${escape(post.description)}
              </p>
              ${renderTags(post.tags)}
            </div>

            <div class="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06] text-xs font-medium text-cyan-400">
              <span>Read Full Log</span>
              <span class="transform group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                ${icon('arrow-right', 'w-3.5 h-3.5')}
              </span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderLogPost(slug) {
  const post = state.posts.find(p => p.slug === slug) || null;
  const content = post ? getPost(slug) : null;

  return html`
    <div class="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <a class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 transition-colors" href="#/log">
          ${icon('arrow-left', 'w-3.5 h-3.5')} Back to Logs
        </a>
      </div>

      <article class="p-8 md:p-12 bg-[#12151E]/90 border border-white/[0.08] backdrop-blur-md space-y-6">
        <div class="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-400 pb-4 border-b border-white/[0.08]">
          <span class="text-cyan-400 font-bold">LOG.${post?.date?.replace(/-/g, '.') || 'SYS'}</span>
          <span>·</span>
          <span>${escape(post?.date || '')}</span>
          ${renderTags(post?.tags)}
        </div>

        <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          ${escape(post?.title || 'Untitled Log')}
        </h1>

        <div class="prose prose-invert prose-cyan max-w-none text-zinc-300 leading-relaxed text-sm md:text-base space-y-4 pt-4 border-t border-white/[0.06]">
          ${content ? marked.parse(content) : '<p>Post content not found.</p>'}
        </div>
      </article>
    </div>
  `;
}
