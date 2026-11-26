const text = (name, description) => ({ name, control: 'text', description });
const choice = (name, options, description) => ({
  name, control: 'select', options, description,
});
const setting = (name, key, options) => ({
  ...(options ? choice(name, options) : text(name)),
  key,
});
const variants = (options) => choice(
  'Block variation',
  ['Keep example', ...options],
  'Keep example preserves this story. Other choices replace the block variation classes.',
);
const content = {
  heading: text('Heading', 'Replace the first authored heading. Unset keeps the example.'),
  bodyText: text('First body paragraph', 'Replace the first paragraph without an image or link. Use Authoring rows for rich content.'),
  imageUrl: text('Image URL', 'Replace the first content image. Use a URL served by Storybook or a public image URL.'),
  imageAlt: text('Image alt text', 'Alt text for the first content image. An empty string marks it decorative.'),
  linkText: text('Link text', 'Replace the first content link label.'),
  linkUrl: text('Link URL', 'Replace the first content link destination.'),
};
const media = { imageUrl: content.imageUrl, imageAlt: content.imageAlt };
const links = { linkText: content.linkText, linkUrl: content.linkUrl };
const headline = { heading: content.heading };
const body = { bodyText: content.bodyText };
const yesNo = ['Yes', 'No'];
const layouts = ['Default', 'right', 'center', 'box', 'float-left', 'box float-left'];
const definitions = {
  hero: {
    variant: variants(['Default', 'home', 'centered']), ...headline, ...body, ...media, ...links,
  },
  banner: {
    variant: variants(['Default', 'locations', 'statement', 'image-cta']), ...headline, ...body, ...media, ...links,
  },
  columns: {
    variant: variants(['Default', 'alternating', 'curve']), ...headline, ...body, ...media, ...links,
  },
  cards: {
    variant: variants(['Default', 'feature-links', 'icon-tiles', 'video-tiles']), ...headline, ...body, ...media, ...links,
  },
  accordion: {
    question: text('First question'),
    answer: text('First answer', 'Plain text; use Authoring rows for rich-text answers and additional questions.'),
  },
  quote: { quotation: text('Quotation'), attribution: text('Attribution'), ...media },
  gallery: { ...media },
  image: {
    variant: variants(['Default', 'left', 'right', 'small', 'large', 'left small', 'right small', 'left large', 'right large', 'left no-wrap', 'right no-wrap']),
    ...media,
    caption: text('Caption'),
  },
  table: { variant: variants(['Default', 'no-header']) },
  text: { variant: variants(layouts), ...body },
  embed: {
    variant: variants(['Default', 'video']),
    mediaUrl: text('Media URL', 'Direct MP4, YouTube or Vimeo URL.'),
    ...media,
  },
  fragment: { fragmentPath: text('Fragment path', 'A site-relative path served by Storybook, without .plain.html.') },
  share: {
    shareTitle: setting('Share label', 'Title'),
    sharePosition: setting('Share position', 'sharePosition', ['left', 'center', 'right']),
    shareShow: setting('Show sharing', 'shareShow', ['on', 'off']),
  },
  'article-list': {
    columns: setting('Columns', 'Columns', ['2', '3', '4']),
    ground: setting('Background', 'Ground', ['Light', 'Tinted', 'Dark']),
    showDate: setting('Display article date', 'Display Article date', yesNo),
    showDescription: setting('Display short description', 'Display Short description', yesNo),
    linkLabel: setting('Card link label', 'Link Label'),
  },
  'story-listing': {
    pageSize: setting('Page size', 'Page Size'),
    sort: setting('Default sort', 'Sort', ['Newest', 'Oldest', 'Title A-Z', 'Title Z-A']),
    searchLabel: setting('Search label', 'Search Label'),
    searchPlaceholder: setting('Search placeholder', 'Search Placeholder'),
    sortLabel: setting('Sort label', 'Sort Label'),
    noResults: setting('No-results message', 'No Results'),
  },
  'article-header': {
    ...headline,
    ...media,
    roles: setting('Roles', 'Roles'),
    topics: setting('Topics', 'Topics'),
    date: setting('Publication date', 'Publication Date'),
    author: setting('Author names', 'Author'),
    authorTitle: setting('Author titles', 'Author Title'),
    authorImage: setting('Author images', 'Author Image'),
  },
  'section-metadata': {
    sectionStyle: setting('Section styles', 'Style'),
  },
  'header-footer': {
    navHtml: text('Header document HTML', 'Replace the shared nav document in this preview. Preserve its three/four section structure.'),
    footerHtml: text('Footer document HTML', 'Replace the shared footer document in this preview. Preserve its three/six section structure.'),
  },
};

export function authoringControls(fixture) {
  let block = '';
  if (fixture === 'foundations/empty-page') block = 'header-footer';
  else if (fixture === 'foundations/text') block = 'text';
  else if (fixture.startsWith('blocks/')) block = fixture.slice('blocks/'.length);
  if (!definitions[block]) return {};
  const fields = definitions[block];
  const argTypes = Object.fromEntries(Object.entries(fields).map(([key, field]) => {
    const { key: configKey, ...argType } = field;
    return [key, { ...argType, table: { category: 'Block authoring' } }];
  }));
  if (block !== 'header-footer') {
    argTypes.authorRows = {
      name: 'Authoring rows (HTML cells)',
      control: 'object',
      description: 'Optional array of rows, each an array of cell HTML strings. Replaces all rows of the first block; no block-name row. Unset preserves the example. Named controls apply afterwards.',
      table: { category: 'Advanced authoring' },
    };
  }
  return {
    block,
    args: fields.variant ? { variant: 'Keep example' } : {},
    argTypes,
  };
}

function row(cells) {
  const element = document.createElement('div');
  cells.forEach((value) => {
    const cell = document.createElement('div');
    cell.innerHTML = value;
    element.append(cell);
  });
  return element;
}

function setSetting(block, key, value) {
  const match = [...block.children].find((r) => r.children.length === 2
    && r.firstElementChild.textContent.trim().toLowerCase() === key.toLowerCase());
  if (match) match.lastElementChild.textContent = value;
  else {
    const element = row(['', '']);
    element.firstElementChild.textContent = key;
    element.lastElementChild.textContent = value;
    block.append(element);
  }
}

function replaceText(root, selector, value, label) {
  const target = root.querySelector(selector);
  if (!target) throw new Error(`This example has no ${label}. Add one using Authoring rows.`);
  (target.querySelector('a') || target).textContent = value;
}

export function applyAuthoring(main, type, values) {
  if (!type || type === 'header-footer') return;
  const block = main.querySelector(`.${type}`);
  if (!block) throw new Error(`No ${type} block found in this example.`);
  if (values.authorRows !== undefined) {
    if (!Array.isArray(values.authorRows)
      || values.authorRows.some((r) => !Array.isArray(r) || !r.length || r.some((c) => typeof c !== 'string'))) {
      throw new Error('Authoring rows must be an array of non-empty rows containing HTML strings.');
    }
    block.replaceChildren(...values.authorRows.map(row));
  }
  if (values.variant !== undefined && values.variant !== 'Keep example') {
    const allowed = definitions[type].variant?.options;
    if (!allowed?.includes(values.variant)) throw new Error(`Unsupported ${type} variation.`);
    block.className = [type, ...(values.variant === 'Default' ? [] : values.variant.split(' '))].join(' ');
  }
  Object.entries(definitions[type]).forEach(([name, field]) => {
    if (values[name] !== undefined && field.key) setSetting(block, field.key, String(values[name]));
  });
  if (values.heading !== undefined) replaceText(block, 'h1,h2,h3,h4,h5,h6', values.heading, 'heading');
  if (values.bodyText !== undefined) {
    const paragraph = [...block.querySelectorAll('p')].find((p) => !p.querySelector('a,img,picture'));
    if (!paragraph) throw new Error('This example has no plain body paragraph. Add one using Authoring rows.');
    paragraph.textContent = values.bodyText;
  }
  if (values.linkText !== undefined) replaceText(block, 'a', values.linkText, 'link');
  if (values.linkUrl !== undefined) {
    const link = block.querySelector('a');
    if (!link) throw new Error('This example has no link. Add one using Authoring rows.');
    link.setAttribute('href', values.linkUrl);
  }
  if (values.imageUrl !== undefined || values.imageAlt !== undefined) {
    const image = block.querySelector('img');
    if (!image) throw new Error('This example has no image. Add a picture using Authoring rows.');
    if (values.imageUrl !== undefined) {
      image.closest('picture')?.querySelectorAll('source').forEach((source) => source.remove());
      image.removeAttribute('srcset');
      image.setAttribute('src', values.imageUrl);
    }
    if (values.imageAlt !== undefined) image.setAttribute('alt', values.imageAlt);
  }
  if (type === 'accordion') {
    if (values.question !== undefined) replaceText(block, ':scope > div > div:first-child', values.question, 'question');
    if (values.answer !== undefined) replaceText(block, ':scope > div > div:nth-child(2)', values.answer, 'answer');
  }
  if (type === 'quote' && (values.quotation !== undefined || values.attribution !== undefined)) {
    const cells = [...block.querySelectorAll(':scope > div > div')].filter((c) => c.textContent.trim());
    if (values.quotation !== undefined) {
      if (!cells[0]) block.append(row(['']));
      (cells[0] || block.lastElementChild.firstElementChild).textContent = values.quotation;
    }
    if (values.attribution !== undefined) {
      if (cells.length < 2) block.append(row(['']));
      const attribution = cells.length < 2
        ? block.lastElementChild.firstElementChild : cells.at(-1);
      attribution.textContent = values.attribution;
    }
  }
  if (type === 'image' && values.caption !== undefined) {
    const pictures = [...block.querySelectorAll('picture,img')]
      .filter((image) => image.matches('picture') || !image.closest('picture'));
    const captionRow = row(['']);
    const paragraph = document.createElement('p');
    paragraph.textContent = values.caption;
    captionRow.firstElementChild.append(...pictures, paragraph);
    block.replaceChildren(captionRow);
  }
  if (type === 'embed' && values.mediaUrl !== undefined) {
    let link = block.querySelector('a');
    if (!link) {
      block.append(row(['<p><a></a></p>']));
      link = block.querySelector('a');
    }
    link.href = values.mediaUrl;
    link.textContent = values.mediaUrl;
  }
  if (type === 'fragment' && values.fragmentPath !== undefined) {
    if (!values.fragmentPath.startsWith('/') || values.fragmentPath.startsWith('//')) {
      throw new Error('Fragment path must start with a single / and be served by Storybook.');
    }
    block.replaceChildren(row(['<p><a></a></p>']));
    const link = block.querySelector('a');
    link.setAttribute('href', values.fragmentPath);
    link.textContent = values.fragmentPath;
  }
}
