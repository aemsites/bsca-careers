const BRANDS = {
  bsc: {
    name: 'Blue Shield of California',
    logos: ['bsc-logo', 'bsc-logo-white', 'bsc-shield'],
    fonts: '/styles/fonts.css',
    page: '/',
  },
  stellarus: {
    name: 'Stellarus',
    logos: ['stellarus-logo-full', 'stellarus-logo'],
    fonts: '/styles/themes/stellarus/fonts.css',
    page: '/stellarus/careers',
  },
  ascendiun: {
    name: 'Ascendiun',
    logos: ['ascendiun-logo', 'ascendiun-logo-white'],
    fonts: '/styles/fonts.css',
  },
};

const COLORS = [
  '--color-background', '--color-surface', '--color-surface-tint', '--color-surface-muted',
  '--color-text', '--color-text-secondary', '--color-text-muted', '--color-text-subtle',
  '--color-link', '--color-link-hover', '--color-primary', '--color-primary-hover',
  '--color-primary-press', '--color-on-primary', '--color-band', '--color-on-band',
  '--color-accent-strong', '--color-on-accent-strong', '--color-border',
  '--color-border-subtle', '--color-border-strong', '--color-focus',
  '--footer-background', '--footer-text',
];

const BRAND_COLORS = [
  '--color-brand-digital-blue', '--color-brand-miami',
  '--color-brand-baton-rouge', '--color-brand-palm-springs',
];

const SPACING = [
  '--space-4xs', '--space-3xs', '--space-2xs', '--space-xs', '--space-s',
  '--space-m', '--space-l', '--space-xl', '--space-2xl', '--space-3xl',
];

const ICONS = [
  'achievement-trophy', 'add-circle', 'add-person-outline', 'add-person', 'add-user',
  'adhesive-bandage', 'adjustment-sliders', 'airplane', 'alert-circle', 'alphabet-book',
  'analytics-chart', 'apple-fruit', 'attachment-paperclip', 'baby-stroller', 'banana-fruit',
  'bank-building', 'blank-document', 'bookmark', 'bookmarked-book', 'brain-health',
  'calculator', 'calendar', 'california-state', 'camera', 'capsule-pill', 'car',
  'chat-message-dots', 'chat-message', 'chatbot', 'checkmark', 'chess-rook', 'clock',
  'close-circle', 'cloud-upload', 'community-support', 'compassionate-care',
  'computer-monitor', 'credit-card', 'currency-dollar', 'customer-profile',
  'delete-trash', 'dental-care-glasses', 'desktop-mobile-devices', 'document-checklist',
  'document-search', 'download', 'ear', 'eco-sustainability', 'edit-pencil', 'email-at',
  'email-envelope', 'email', 'employment-document', 'eyeglasses', 'face-mask', 'facebook',
  'favorite-star', 'first-aid-kit', 'fitness-running', 'folder', 'form-checklist',
  'glassdoor', 'globe', 'graduation-cap', 'handshake', 'health-insurance-plan',
  'health-insurance-shield', 'health-savings-piggy-bank', 'hearing-aid', 'heart-add',
  'heart-check', 'heart-rate', 'heart', 'help-circle', 'help-question', 'home-medical',
  'home', 'honeycomb-network', 'hospital', 'hourglass', 'identification-card',
  'identity-card', 'info-circle', 'instagram', 'key', 'laptop', 'lightbulb', 'linkedin',
  'location-pin', 'logout', 'lotus-wellness', 'map-pin', 'medical-emergency',
  'medical-laptop', 'medical-location-cross', 'medical-location-pin', 'medical-mobile-app',
  'medical-record', 'medical-refresh', 'medical-shield', 'medical-stethoscope',
  'medicine-bottle', 'menu-list', 'microphone', 'mobile-alert', 'mobile-app', 'money-card',
  'more-options', 'notification-bell', 'nurse', 'organization-chart', 'payment-document',
  'pdf-document', 'people-community', 'pharmacy', 'phone', 'play', 'policy-document',
  'prescription', 'printer', 'prohibited', 'refresh', 'save-file', 'search', 'secure-lock',
  'settings-gear', 'shopping-bag', 'shopping-basket', 'shopping-cart', 'signature-document',
  'smartphone', 'smile-face', 'speedometer', 'spreadsheet', 'stethoscope', 'storage-box',
  'success-circle', 'sunrise', 'syringe', 'tag', 'task-clipboard', 'text-document',
  'text-size', 'thermometer', 'thumbs-down', 'thumbs-up', 'ticket', 'tools-wrench', 'tooth',
  'twitter', 'united-states-map', 'upload', 'usb-drive', 'user-profile', 'vector-pen-tool',
  'video-camera', 'video-play', 'view-eye', 'virus', 'volume-speaker', 'walking-shoe',
  'warning-alert', 'wheelchair-accessibility', 'wireless-phone', 'yin-yang',
];

function element(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
  node.append(...children);
  return node;
}

function tokenValue(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function announce(message) {
  const toast = document.querySelector('.branding-toast');
  toast.textContent = message;
  toast.hidden = false;
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    announce(`Copied ${value}`);
  } catch (error) {
    announce(`Copy failed. Select and copy the text manually: ${value}`);
    // eslint-disable-next-line no-console
    console.warn('Brand guide clipboard copy failed', error);
  }
}

function copyButton(value, ...children) {
  const button = element('button', {
    type: 'button', class: 'branding-copy', 'aria-label': `Copy ${value}`,
  }, ...children);
  button.addEventListener('click', () => copyText(value));
  return button;
}

function tokenLabel(name) {
  return [
    element('code', {}, name),
    element('span', { class: 'branding-value', 'data-token-value': name }, tokenValue(name)),
  ];
}

function tokenGrid(names) {
  return element('div', { class: 'branding-grid' }, ...names.map((name) => copyButton(`var(${name})`, ...tokenLabel(name))));
}

function section(id, title, description) {
  const node = element('section', {
    id, class: 'branding-section', 'aria-labelledby': `${id}-title`,
  }, element('h2', { id: `${id}-title` }, title), element('p', {}, description));
  document.querySelector('#branding-content').append(node);
  document.querySelector('.branding-sections').append(element('a', { href: `#${id}` }, title));
  return node;
}

function table(caption, headings, rows) {
  return element('div', {
    class: 'branding-table-scroll', tabindex: '0', role: 'region', 'aria-label': caption,
  }, element(
    'table',
    { class: 'branding-table' },
    element('caption', {}, caption),
    element('thead', {}, element('tr', {}, ...headings.map((label) => element('th', { scope: 'col' }, label)))),
    element('tbody', {}, ...rows.map((row) => element('tr', {}, ...row.map((cell, index) => (
      index === 0 ? element('th', { scope: 'row' }, cell) : element('td', {}, cell)
    ))))),
  ));
}

function renderColors(brand) {
  const node = section('colors', 'Colors', 'Swatches use the actual theme tokens. Transparent colors are shown over the guide surface. Copy a swatch to reuse its token.');
  const names = brand === 'ascendiun' ? [...COLORS, ...BRAND_COLORS] : COLORS;
  const grid = element('div', { class: 'branding-grid' });
  names.forEach((name) => {
    const swatch = element('span', { class: 'branding-swatch', 'aria-hidden': 'true' });
    swatch.style.backgroundColor = `var(${name})`;
    grid.append(copyButton(`var(${name})`, swatch, ...tokenLabel(name)));
  });
  node.append(grid);
}

function renderTypography() {
  const node = section('typography', 'Typography', 'These samples use the site heading and body rules. Measurements update when the viewport changes; requested weight is not proof of a matching font file.');
  node.append(tokenGrid(['--font-body', '--font-heading', '--font-display', '--font-mono']));
  const rows = [
    ['h1', 'Heading 1', '--heading-font-size-xxl'],
    ['h2', 'Heading 2', '--heading-font-size-xl'],
    ['h3', 'Heading 3', '--heading-font-size-l'],
    ['h4', 'Heading 4', '--heading-font-size-m'],
    ['h5', 'Heading 5', '--heading-font-size-s'],
    ['h6', 'Heading 6', '--heading-font-size-xs'],
    ['p', 'Find your next opportunity and make a difference.', '--body-font-size-m'],
  ];
  rows.forEach(([tag, text, token]) => {
    // Heading samples keep the guide's own document outline intact.
    const sample = element(tag, tag === 'p' ? {} : { role: 'presentation' }, text);
    const value = element('span', { class: 'branding-value', 'data-type-metrics': '' });
    node.append(element(
      'div',
      { class: 'branding-tile branding-type-preview' },
      element('code', {}, `${tag} / ${token}`),
      sample,
      value,
    ));
  });
  const body = element(
    'p',
    {},
    'Body copy with ',
    element('strong', {}, 'strong emphasis'),
    ', ',
    element('em', {}, 'italic emphasis'),
    ', and ',
    element('a', { href: '#buttons' }, 'a text link'),
    '.',
  );
  node.append(body, tokenGrid([
    '--font-weight-body', '--font-weight-heading', '--font-weight-display',
    '--body-line-height', '--heading-line-height', '--body-font-size-l',
    '--body-font-size-s', '--body-font-size-xs',
  ]));
}

function renderSpacing() {
  const node = section('spacing', 'Spacing & layout', 'Use the shared spacing scale. The layout sample is constrained by this guide, so the readout also shows the full-page container token separately.');
  const grid = element('div', { class: 'branding-grid' });
  SPACING.forEach((name) => {
    const bar = element('span', { class: 'branding-spacing-bar', 'aria-hidden': 'true' });
    bar.style.width = `var(${name})`;
    grid.append(copyButton(`var(${name})`, bar, ...tokenLabel(name)));
  });
  const readout = element('p', { 'data-layout-metrics': '' });
  node.append(
    grid,
    tokenGrid([
      '--content-max-width', '--content-padding', '--section-spacing', '--nav-desktop-min-width',
    ]),
    element(
      'div',
      { class: 'branding-layout-demo' },
      element('strong', {}, 'Responsive content area'),
      readout,
    ),
    element('p', {}, 'Blue Shield container steps: 576, 768, 992, 1200, and 1400px. Stellarus uses a fluid 1280px maximum and a 921px navigation threshold. Ascendiun also changes typography at 768, 1024, and 1440px. The guide sidebar changes at 1200px; it is not the site header.'),
  );
}

function renderButtons(brand) {
  const node = section('buttons', 'Buttons & links', 'Real site classes, not recreated button styles. Hover and Tab through the enabled examples. Links jump within this guide; nothing is submitted.');
  if (brand === 'ascendiun') {
    node.append(element('p', { class: 'branding-note' }, 'Ascendiun primary and accent calls to action are arrow links, not filled buttons. This is intentional.'));
  }
  const actions = element('div', { class: 'branding-actions' });
  ['primary', 'secondary', 'accent'].forEach((variant) => {
    actions.append(element('a', { class: `button ${variant}`, href: '#controls' }, `${variant} action`));
  });
  actions.append(element('button', { type: 'button', class: 'button primary', disabled: '' }, 'Disabled action'));
  node.append(
    actions,
    element('a', { class: 'branding-demo-link', href: '#focus' }, 'Standard text link'),
    tokenGrid([
      '--button-primary-background', '--button-primary-color', '--button-primary-padding',
      '--button-secondary-background', '--button-secondary-color', '--radius-button',
    ]),
  );
}

function renderControls() {
  const node = section('controls', 'Search & select controls', 'These examples reuse story-listing CSS. They are styling samples only: there is no search request, form submission, or collection of data.');
  const search = element('input', {
    id: 'branding-search',
    class: 'story-listing-input',
    type: 'search',
    placeholder: 'Search stories',
    autocomplete: 'off',
  });
  const select = element(
    'select',
    { id: 'branding-select', class: 'story-listing-select' },
    ...['All topics', 'Life at Blue Shield', 'Growth and development'].map((text) => element('option', {}, text)),
  );
  node.append(
    element(
      'div',
      { class: 'story-listing' },
      element(
        'div',
        { class: 'story-listing-filters' },
        element(
          'div',
          { class: 'story-listing-field' },
          element('label', { for: 'branding-search', class: 'story-listing-label' }, 'Search example'),
          search,
        ),
        element(
          'div',
          { class: 'story-listing-field' },
          element('label', { for: 'branding-select', class: 'story-listing-label' }, 'Topic example'),
          select,
        ),
      ),
    ),
    tokenGrid(['--control-height', '--radius-control', '--color-text-subtle', '--color-border']),
  );
}

function renderShapes() {
  const node = section('shapes', 'Shape & elevation', 'Each sample applies the named radius or shadow token. A square corner or missing shadow may be an intentional brand value.');
  const grid = element('div', { class: 'branding-grid' });
  ['--radius-card', '--radius-panel', '--radius-media', '--radius-small', '--shadow-card', '--shadow-raised'].forEach((name) => {
    const sample = element('div', { class: 'branding-shape', 'aria-hidden': 'true' });
    sample.style[name.startsWith('--radius') ? 'borderRadius' : 'boxShadow'] = `var(${name})`;
    grid.append(copyButton(`var(${name})`, sample, ...tokenLabel(name)));
  });
  node.append(grid, tokenGrid(['--border-width', '--border-width-strong']));
}

function renderAssets(brand) {
  const node = section('assets', 'Logos & icons', 'Click to copy an asset path. Each brand has its own logos and access to the full shared icon collection. Logos retain their artwork colors; line icons follow the current theme using the site CSS mask treatment.');
  const logos = element('div', { class: 'branding-grid' });
  BRANDS[brand].logos.forEach((name) => {
    const dark = name.includes('white') || name === 'stellarus-logo-full';
    const path = `/icons/${name}.svg`;
    logos.append(copyButton(
      path,
      element('span', {
        class: `branding-asset ${dark ? 'branding-asset-dark' : 'branding-asset-light'}`,
      }, element('img', { src: path, alt: name.replace(/-/g, ' '), loading: 'lazy' })),
      element('code', {}, path),
    ));
  });
  const tiles = [...ICONS].sort().map((name) => {
    const path = `/icons/${name}.svg`;
    const originalColors = ['facebook', 'twitter', 'instagram', 'linkedin', 'glassdoor', 'search'].includes(name);
    const icon = element('span', { class: originalColors ? 'icon' : 'icon icon-line', 'aria-hidden': 'true' });
    if (!originalColors) icon.style.setProperty('--icon-image', `url("${path}")`);
    icon.append(element('img', { src: path, alt: '', loading: 'lazy' }));
    const tile = copyButton(
      path,
      element('span', { class: originalColors ? 'branding-asset branding-asset-light' : 'branding-asset' }, icon),
      element('code', {}, path),
    );
    tile.dataset.icon = name;
    return tile;
  });
  const filter = element('input', {
    id: 'branding-icon-filter',
    class: 'story-listing-input',
    type: 'search',
    placeholder: 'Search icons, e.g. heart or calendar',
    'aria-controls': 'branding-icon-grid',
  });
  const status = element('p', { role: 'status', 'aria-live': 'polite' }, `${tiles.length} of ${tiles.length} shared icons shown.`);
  filter.addEventListener('input', () => {
    const query = filter.value.trim().toLowerCase().replace(/\s+/g, '-');
    let count = 0;
    tiles.forEach((tile) => {
      tile.hidden = !tile.dataset.icon.includes(query);
      if (!tile.hidden) count += 1;
    });
    status.textContent = count
      ? `${count} of ${tiles.length} shared icons shown.`
      : 'No shared icons match. Try another name or clear the search.';
  });
  node.append(
    element('h3', {}, `${BRANDS[brand].name} logos`),
    logos,
    element('h3', {}, 'Shared icon collection'),
    element(
      'div',
      { class: 'story-listing' },
      element(
        'div',
        { class: 'story-listing-field' },
        element('label', { for: 'branding-icon-filter', class: 'story-listing-label' }, 'Filter shared icons'),
        filter,
      ),
    ),
    status,
    element('div', { id: 'branding-icon-grid', class: 'branding-grid' }, ...tiles),
  );
}

function renderFocus() {
  const node = section('focus', 'Focus & accessibility', 'Use Tab and Shift+Tab to inspect the actual link, button, and control focus styles. Check contrast against the intended background; swatches alone do not establish accessibility compliance.');
  node.append(
    element(
      'div',
      { class: 'branding-actions' },
      element('a', { href: '#controls' }, 'Focus a text link'),
      element('a', { href: '#controls', class: 'button secondary' }, 'Focus a call to action'),
    ),
    tokenGrid(['--color-focus', '--focus-outline-width', '--focus-outline-offset', '--focus-ring']),
    element(
      'ul',
      {},
      ...[
        'Verify the skip link, section navigation, and links to the other brands with a keyboard.',
        'Check 200% zoom and narrow screens for clipped text or lost controls.',
        'Verify logos have meaningful labels and decorative icons are not announced twice.',
        'Check actual font loading before comparing text wraps and component dimensions.',
        'Run an accessibility audit on real pages too; this guide is not a compliance certificate.',
      ].map((text) => element('li', {}, text)),
    ),
  );
}

function renderMotion() {
  const node = section('motion', 'Motion', 'Toggle the sample to inspect the theme transition. With reduced motion enabled, the shared site stylesheet suppresses animated transitions. A zero-duration theme value is intentional.');
  const button = element('button', {
    type: 'button', class: 'branding-demo-trigger', 'aria-pressed': 'false',
  }, 'Toggle motion sample');
  const track = element(
    'div',
    { class: 'branding-motion-track', 'aria-hidden': 'true' },
    element('div', { class: 'branding-motion-sample' }),
  );
  button.addEventListener('click', () => {
    const moved = track.classList.toggle('is-moved');
    button.setAttribute('aria-pressed', String(moved));
  });
  node.append(
    button,
    track,
    element('p', { 'data-motion-metrics': '' }),
    tokenGrid(['--transition-fast', '--transition-duration-medium']),
  );
}

function renderReference(brand) {
  const config = BRANDS[brand];
  const node = section('reference', 'QA reference', 'These are current implementation values, not newly approved design requirements. Existing brand differences and inherited defaults are preserved.');
  node.append(table('Sources used by this guide', ['Source', 'Location'], [
    ['Shared tokens', element('a', { href: '/styles/brand.css' }, '/styles/brand.css')],
    ['Theme overrides', element('a', { href: `/styles/themes/${brand}/${brand}.css` }, `/styles/themes/${brand}/${brand}.css`)],
    ['Font definitions', element('a', { href: config.fonts }, config.fonts)],
    ['Shared UI styles', element('a', { href: '/styles/styles.css' }, '/styles/styles.css')],
    ['Search control styles', element('a', { href: '/blocks/story-listing/story-listing.css' }, '/blocks/story-listing/story-listing.css')],
  ]));
  if (config.page) {
    node.append(element('p', {}, element('a', { href: config.page }, `Open the ${config.name} careers page`)));
  } else {
    node.append(element('p', {}, 'Ascendiun content publication is separate from this code-only theme guide.'));
  }
  const snippet = '.example {\n  color: var(--color-text);\n  background: var(--color-surface);\n  padding: var(--space-m);\n  border-radius: var(--radius-card);\n}';
  node.append(
    element('pre', { class: 'branding-snippet' }, element('code', {}, snippet)),
    copyButton(snippet, 'Copy token usage example'),
    element('p', {}, 'QA checklist: compare at the same viewport, record the brand and page URL, capture the failing state, and distinguish requested CSS weights from the font files actually supplied.'),
    element('p', {}, 'This standalone guide does not load analytics, consent tools, or the careers page runtime. It is not linked in public navigation. Noindex is not access control; anyone with the URL can view it.'),
  );
}

function updateMeasurements() {
  document.querySelectorAll('[data-token-value]').forEach((node) => {
    node.textContent = tokenValue(node.dataset.tokenValue);
  });
  document.querySelectorAll('.branding-type-preview').forEach((node) => {
    const sample = node.querySelector('h1, h2, h3, h4, h5, h6, p');
    const style = getComputedStyle(sample);
    node.querySelector('[data-type-metrics]').textContent = `${style.fontSize} / weight ${style.fontWeight} / line height ${style.lineHeight} / ${style.fontFamily}`;
  });
  const width = Math.round(document.querySelector('.branding-layout-demo').getBoundingClientRect().width);
  document.querySelector('[data-layout-metrics]').textContent = `Viewport: ${window.innerWidth}px. Container token: ${tokenValue('--content-max-width')}. Guide sample: ${width}px wide. Content gutter: ${tokenValue('--content-padding')}. Navigation threshold: ${tokenValue('--nav-desktop-min-width')}.`;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transition = getComputedStyle(document.querySelector('.branding-motion-sample')).transitionDuration;
  document.querySelector('[data-motion-metrics]').textContent = `Reduced motion: ${reduced ? 'on' : 'off'}. Sample transition duration: ${transition}.`;
}

function observeSections() {
  const links = [...document.querySelectorAll('.branding-sections a')];
  const sections = links.map((link) => document.querySelector(link.hash));
  const mark = () => {
    const current = sections.filter((node) => node.getBoundingClientRect().top <= 100).pop()
      || sections[0];
    links.forEach((link) => {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', mark, { passive: true });
  mark();
}

async function init() {
  const { brand } = document.body.dataset;
  if (!BRANDS[brand]) throw new Error(`Unknown brand guide: ${brand}`);
  renderColors(brand);
  renderTypography();
  renderSpacing();
  renderButtons(brand);
  renderControls();
  renderShapes();
  renderAssets(brand);
  renderFocus();
  renderMotion();
  renderReference(brand);
  updateMeasurements();
  window.addEventListener('resize', updateMeasurements);
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', updateMeasurements);
  observeSections();
  await document.fonts.ready;
  updateMeasurements();
  document.querySelector('#branding-load-status').textContent = 'Guide ready. Values reflect the current brand and viewport.';
  document.body.dataset.guideReady = 'true';
  const target = document.getElementById(window.location.hash.slice(1));
  if (target) target.scrollIntoView();
}

init().catch((error) => {
  const status = document.querySelector('#branding-load-status');
  status.setAttribute('role', 'alert');
  status.textContent = `The brand guide could not finish loading: ${error.message}`;
  // eslint-disable-next-line no-console
  console.error('Brand guide initialization failed', error);
});
