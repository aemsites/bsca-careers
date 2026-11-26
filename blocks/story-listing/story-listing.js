import { readBlockConfig, toClassName } from '../../scripts/aem.js';
import { createTag as el } from '../../scripts/scripts.js';
import {
  buildStoryImage,
  buildStoryTime,
  filterStories,
  loadStories,
  sortStories,
  splitList,
  STORY_LISTING,
  STORY_SOURCES,
} from '../../scripts/story-index.js';
import { loadPlaceholders, placeholder as placeholderText } from '../../scripts/placeholders.js';

/**
 * Story listing block: searchable, sortable and paginated grid of stories built at
 * runtime from the site query index plus an external-stories sheet. Authored content
 * is configuration only (key | value rows):
 *
 *   Page Size | 9
 *   Sort | Newest                    Newest, Oldest, Title A-Z, Title Z-A
 *   Index | /blog/query-index.json   optional
 *   External Stories | /blog/external-stories.json   optional
 *   Path | /blog/                    optional index path prefix
 *   Exclude | /blog, /blog/authors   optional listing pages to drop
 *   Search Label, Search Placeholder, Sort Label, No Results   optional UI text
 *
 * There are no Roles / Topics filters (removed at the client's request). Filter
 * parameters in a URL (?role=, ?topic=, the previous site's ?c=; e.g. from the
 * category links above a story's title) list every story and are dropped from the URL.
 *
 * State lives in the URL (?q=&sort=&page=) so views are shareable and back/forward
 * restores them.
 */

const SORTS = [
  { value: 'newest', label: 'Newest', key: 'Blog.SortNewest' },
  { value: 'oldest', label: 'Oldest', key: 'Blog.SortOldest' },
  { value: 'title-a-z', label: 'Title A-Z', key: 'Blog.SortTitleAZ' },
  { value: 'title-z-a', label: 'Title Z-A', key: 'Blog.SortTitleZA' },
];

let instance = 0;

/** First value of a config cell (cells with several paragraphs become arrays). */
function text(value, fallback = '') {
  const v = Array.isArray(value) ? value.join(', ') : value;
  return v === undefined || v === null || String(v).trim() === '' ? fallback : String(v).trim();
}

function readConfig(block) {
  const raw = readBlockConfig(block);
  const pageSize = parseInt(text(raw['page-size']), 10);
  const sort = toClassName(text(raw.sort));
  return {
    pageSize: pageSize > 0 ? pageSize : 9,
    defaultSort: SORTS.some((s) => s.value === sort) ? sort : 'newest',
    index: text(raw.index, STORY_SOURCES.index),
    external: text(raw['external-stories'], STORY_SOURCES.external),
    pathPrefix: text(raw.path, STORY_SOURCES.pathPrefix),
    exclude: raw.exclude ? splitList(raw.exclude) : STORY_SOURCES.exclude,
    labels: {
      search: text(raw['search-label'], placeholderText(null, 'Global.SearchLabel', 'Search Blogs')),
      placeholder: text(raw['search-placeholder'], placeholderText(null, 'Global.SearchPlaceholder', 'Search Blog')),
      sort: text(raw['sort-label'], placeholderText(null, 'Blog.SortLabel', 'Sort By')),
      noResults: text(raw['no-results'], placeholderText(null, 'Blog.NoResults', 'No stories match your search. Try different keywords.')),
    },
  };
}

/** Filter parameters of the removed Roles / Topics filters, incl. the previous site's ?c=<id>. */
const REMOVED_FILTER_PARAMS = [...Object.values(STORY_LISTING.params), 'c'];

/** Reads list state from the current URL, validated against the config. */
function readState(config) {
  const params = new URLSearchParams(window.location.search);
  const sort = params.get('sort');
  const page = parseInt(params.get('page'), 10);
  return {
    q: (params.get('q') || '').trim(),
    sort: SORTS.some((s) => s.value === sort) ? sort : config.defaultSort,
    page: page > 0 ? page : 1,
  };
}

/**
 * Builds the query string for a state; defaults and the removed filter parameters are
 * omitted. Other params survive.
 */
function stateUrl(config, state, page = state.page) {
  const params = new URLSearchParams(window.location.search);
  const set = (key, value) => (value ? params.set(key, value) : params.delete(key));
  REMOVED_FILTER_PARAMS.forEach((key) => params.delete(key));
  set('q', state.q);
  set('sort', state.sort !== config.defaultSort ? state.sort : '');
  set('page', page > 1 ? String(page) : '');
  const query = params.toString();
  return `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
}

/** Page numbers to show, with null marking an ellipsis: 1 2 3 … 13. */
function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 2) [2, 3].forEach((p) => pages.add(p));
  if (current >= total - 1) [total - 1, total - 2].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const list = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev && p - prev === 2) list.push(prev + 1);
    else if (prev && p - prev > 2) list.push(null);
    list.push(p);
  });
  return list;
}

function buildCard(story) {
  const link = el('a', { className: 'story-listing-card-link', href: story.url }, story.title);
  if (story.external) link.rel = 'noopener';
  const body = el(
    'div',
    { className: 'story-listing-card-body story-card-body' },
    // h2: the cards sit right under the listing's H1 (no heading level skipped)
    el('h2', { className: 'story-listing-card-title story-card-title' }, link),
  );
  if (story.date) {
    body.append(el('p', { className: 'story-listing-card-date story-card-date' }, buildStoryTime(story.date)));
  }
  if (story.description) {
    body.append(el('p', { className: 'story-listing-card-description story-card-description' }, story.description));
  }
  const card = el('li', { className: 'story-listing-card story-card' }, buildStoryImage(story, 'story-listing-card-image story-card-image'), body);
  if (story.external) card.classList.add('story-listing-card-external');
  return card;
}

function buildSelect(id, name, label, options, placeholder) {
  const select = el('select', { id, name, className: 'story-listing-select' });
  if (placeholder !== undefined) select.append(el('option', { value: '' }, placeholder));
  options.forEach((opt) => select.append(el('option', { value: opt.value ?? opt }, opt.label ?? opt)));
  if (label) select.setAttribute('aria-label', label);
  return select;
}

function buildControls(config, id) {
  const { labels } = config;
  const form = el('form', { className: 'story-listing-filters', role: 'search', 'aria-label': labels.search });

  const search = el('input', {
    type: 'search', id: `${id}-q`, name: 'q', className: 'story-listing-input', placeholder: labels.placeholder, autocomplete: 'off',
  });
  const submit = el(
    'button',
    { type: 'submit', className: 'story-listing-search-button', 'aria-label': labels.search },
    el('span', { className: 'story-listing-search-icon', 'aria-hidden': 'true' }),
  );
  form.append(el(
    'div',
    { className: 'story-listing-field story-listing-search' },
    el('label', { className: 'story-listing-label', for: `${id}-q` }, labels.search),
    el('div', { className: 'story-listing-search-input' }, search, submit),
  ));

  const sortOptions = SORTS.map((s) => ({ ...s, label: placeholderText(null, s.key, s.label) }));
  const sort = buildSelect(`${id}-sort`, 'sort', null, sortOptions);
  form.append(el(
    'div',
    { className: 'story-listing-field story-listing-sort' },
    el('label', { className: 'story-listing-label', for: `${id}-sort` }, labels.sort),
    sort,
  ));

  return { form, search, sort };
}

function buildPagination(config, state, totalPages, nav) {
  nav.replaceChildren();
  nav.hidden = totalPages <= 1;
  if (totalPages <= 1) return;
  const arrow = (dir, target, label) => {
    const glyph = el('span', { className: 'story-listing-page-arrow', 'aria-hidden': 'true' });
    // no previous / next page: a greyed-out arrow, not a link (hidden from screen readers)
    if (target < 1 || target > totalPages) {
      const attrs = { className: `story-listing-page-${dir}`, 'aria-hidden': 'true', 'data-disabled': '' };
      return el('span', attrs, glyph);
    }
    const a = el('a', { className: `story-listing-page-${dir}`, 'aria-label': label }, glyph);
    a.href = stateUrl(config, state, target);
    a.dataset.page = target;
    return a;
  };
  const list = el('ol', { className: 'story-listing-pages' });
  pageList(state.page, totalPages).forEach((p) => {
    if (p === null) {
      // three periods, as on the source (the ellipsis glyph is narrower)
      list.append(el('li', { className: 'story-listing-page-gap', 'aria-hidden': 'true' }, '...'));
      return;
    }
    const a = el('a', {
      href: stateUrl(config, state, p), 'data-page': p, 'aria-label': placeholderText(null, 'Blog.PageNumber', 'Page {page}', { page: p }), 'aria-current': p === state.page ? 'page' : null,
    }, String(p));
    list.append(el('li', { className: p === state.page ? 'story-listing-page-current' : null }, a));
  });
  nav.append(
    arrow('prev', state.page - 1, placeholderText(null, 'Blog.PreviousPage', 'Previous page')),
    list,
    arrow('next', state.page + 1, placeholderText(null, 'Blog.NextPage', 'Next page')),
  );
}

export default async function decorate(block) {
  await loadPlaceholders();
  instance += 1;
  const id = `story-listing-${instance}`;
  const config = readConfig(block);
  const controls = buildControls(config, id);
  const status = el('p', { className: 'story-listing-count', role: 'status', 'aria-live': 'polite' }, 'Loading stories…');
  const grid = el('ul', { className: 'story-listing-grid story-card-grid', id: `${id}-results`, tabindex: '-1' });
  const nav = el('nav', { className: 'story-listing-pagination', 'aria-label': 'Pagination', hidden: true });
  block.replaceChildren(controls.form, status, grid, nav);
  block.classList.add('story-listing-loading');
  block.setAttribute('aria-busy', 'true');

  let stories = [];
  let state = readState(config);
  let loaded = false;

  const syncControls = () => {
    controls.search.value = state.q;
    controls.sort.value = state.sort;
  };

  const render = () => {
    if (!loaded) return;
    const filtered = filterStories(stories, { query: state.q });
    const sorted = sortStories(filtered, state.sort);
    const totalPages = Math.max(1, Math.ceil(sorted.length / config.pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * config.pageSize;
    const pageItems = sorted.slice(start, start + config.pageSize);

    grid.replaceChildren(...pageItems.map(buildCard));
    block.classList.toggle('story-listing-empty', !sorted.length);
    if (!sorted.length) {
      status.textContent = stories.length ? config.labels.noResults : placeholderText(null, 'Blog.NoStories', 'No stories are available right now.');
    } else {
      const noun = sorted.length === 1
        ? placeholderText(null, 'Blog.StoryOne', 'story') : placeholderText(null, 'Blog.StoryMany', 'stories');
      const values = {
        start: start + 1, end: start + pageItems.length, total: sorted.length, noun,
      };
      status.textContent = totalPages > 1
        ? placeholderText(null, 'Blog.ResultsPaged', 'Showing {start}–{end} of {total} {noun}', values)
        : placeholderText(null, 'Blog.ResultsAll', '{total} {noun}', values);
    }
    buildPagination(config, state, totalPages, nav);
  };

  const update = (changes, { push = true } = {}) => {
    state = { ...state, ...changes };
    const url = stateUrl(config, state);
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history[push ? 'pushState' : 'replaceState'](null, '', url);
    }
    render();
  };

  // Search: submit applies immediately; typing applies after a pause.
  let typing;
  controls.form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearTimeout(typing);
    update({ q: controls.search.value.trim(), page: 1 });
  });
  controls.search.addEventListener('input', () => {
    clearTimeout(typing);
    typing = setTimeout(() => {
      const q = controls.search.value.trim();
      if (q !== state.q) update({ q, page: 1 }, { push: false });
    }, 300);
  });
  controls.sort.addEventListener('change', (e) => update({ sort: e.target.value, page: 1 }));
  nav.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-page]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    update({ page: Number(a.dataset.page) });
    grid.focus({ preventScroll: true });
    if (block.getBoundingClientRect().top < 0) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  window.addEventListener('popstate', () => {
    state = readState(config);
    syncControls();
    render();
  });

  syncControls();

  stories = await loadStories({
    index: config.index,
    external: config.external,
    pathPrefix: config.pathPrefix,
    exclude: config.exclude,
  });

  loaded = true;
  block.classList.remove('story-listing-loading');
  block.removeAttribute('aria-busy');
  // renders; also drops the removed filter parameters (?role=, ?topic=, ?c=) from the URL
  update({}, { push: false });
}
