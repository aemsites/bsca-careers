const base = 'https://main--bsca-careers--blueshieldca.aem.page';
const index = await fetch(`${base}/blog/query-index.json`).then((r) => r.json());
const rows = index.data.filter((r) => r.image);
const mismatches = [];
const missing = [];

function decode(value) {
  return value
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"');
}

async function one(row) {
  const [html, plain] = await Promise.all([
    fetch(base + row.path).then((r) => r.text()),
    fetch(`${base}${row.path}.plain.html`).then((r) => r.text()),
  ]);
  const meta = decode((html.match(/property="og:image:alt" content="([^"]*)"/) || [])[1] || '');
  const body = decode((plain.match(/<img[^>]* alt="([^"]*)"/) || [])[1] || '');
  if (!meta) missing.push(row.path);
  else if (meta !== body) mismatches.push({ path: row.path, meta, body });
}

const queue = [...rows];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (queue.length) {
    const row = queue.shift();
    if (row) await one(row);
  }
}));

console.log(JSON.stringify({
  stories: rows.length,
  missingMetaAlt: missing,
  mismatchCount: mismatches.length,
  mismatches: mismatches.slice(0, 25),
}, null, 2));
