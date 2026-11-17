# footer

Site **footer** block. Purpose: logo, fair hiring notice, company and legal link lists, social icons, utility links and copyright.

## Authoring (Document Authoring)

Model: `fragment` (loaded automatically on every page; not placed in page content)

The footer is built from the document named by the page's `footer` metadata, by default `/footer` (shared by all brands; each theme recolors it). The document has six sections, in this order:

1. **Brand:** a paragraph with the white logo image, linked.
2. **Notice:** a heading (e.g. "Fair hiring practices") and paragraphs with links.
3. **Link groups:** for each group, a bold label paragraph (e.g. "Our company", "Legal notices") followed by a bulleted list of links.
4. **Social:** a bulleted list of icon images, each linked to the social profile (the image alt text is the link's accessible name).
5. **Utility:** a bulleted list of links.
6. **Legal:** the copyright / disclaimer paragraph.

The three-section Stellarus footer uses brand, link groups, and legal sections. Authors enter each link-group label as a bold paragraph; the block renders those labels as `h3` elements without changing their appearance.

A link to `#cookie-preferences` opens the consent manager's preference center (OneTrust when present; otherwise a `consent.preferences` event is dispatched for the site's consent integration).

## Behavior

- **992px and wider:** a charcoal band with four columns (logo | notice | link groups side by side | social icons), a black utility bar with right-aligned links separated by "|", and a white copyright band.
- **Below 992px:** all columns stack; social icons sit in one row.
- **Below 768px:** narrower 15px gutters; utility links stack vertically.
- Links in the notice and social sections open in a new tab; text links underline on hover.

Ascendiun keeps the same authored sections. Its navigation link groups use the existing `--body-font-size-m` theme token; notice paragraphs and inline links inherit `--body-font-size-s` from the footer. The block does not redefine the theme's typography, and other themes are unchanged.

Ascendiun's notice H2 ("Fair hiring practices") is 24px at every width, using `--heading-font-size-xl` below 768px and `--heading-font-size-l` from 768px to follow the existing responsive theme scale.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
