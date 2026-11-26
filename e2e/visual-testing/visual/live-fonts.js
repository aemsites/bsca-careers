/**
 * LIVE fonts for the site under test.
 *
 * LIVE (careers.blueshieldca.com) sets its text in Proxima Nova and Trade Gothic Next Condensed
 * from an Adobe Fonts (Typekit) kit; the new site uses the brand font Fieldwork. So that the
 * comparisons measure layout and spacing rather than the font change, the suite gives the page
 * under test LIVE's fonts before every capture: it adds LIVE's kit stylesheet and points the
 * site's font tokens (styles/brand.css) at the LIVE families and weights. The site code is not
 * changed, and LIVE reference captures never get this step.
 *
 * Mapping, measured on LIVE (computed styles, November 2026):
 *   body text, nav, buttons, footer, small headings   proxima-nova 400 / 600 / 700
 *   large uppercase headings (hero, section titles)   trade-gothic-next-condensed (700 face)
 * Font sizes, line heights and letter spacing already match LIVE, so only the families and
 * two weights change (body text 300 -> 400; display headings 600 -> 500, same 700 face).
 *
 * The kit serves its fonts to http://localhost:3000 and the *.aem.page previews (checked
 * November 2026). If Adobe Fonts refuses them, the font check in waitForAssets fails with
 * "Web fonts failed to load": the kit's allowed domains (Adobe Fonts project of Blue Shield)
 * then need the test host.
 */

/** LIVE's Adobe Fonts kit (the stylesheet LIVE links in its <head>). */
export const LIVE_FONT_KIT = 'https://use.typekit.net/wcg8bju.css';

/** Font tokens of the site (styles/brand.css) pointed at the LIVE fonts. */
export const LIVE_FONT_TOKENS = {
  '--font-body': 'proxima-nova, sans-serif',
  '--font-heading': 'proxima-nova, sans-serif',
  '--font-display': 'trade-gothic-next-condensed, sans-serif',
  '--font-weight-body': '400',
  '--font-weight-display': '500',
};

/**
 * Declared on :root and body (the theme files set tokens on body), as !important so they win
 * over the site's own declarations.
 */
export const LIVE_FONT_CSS = `:root, body {\n${Object.entries(LIVE_FONT_TOKENS)
  .map(([name, value]) => `  ${name}: ${value} !important;`).join('\n')}\n}`;

/**
 * Adds LIVE's fonts to the page under test. Call after navigation, before the readiness and
 * font waits (waitForAssets then waits for the kit's fonts like any other web font).
 * @param {import('@playwright/test').Page} page
 */
export async function applyLiveFonts(page) {
  await page.addStyleTag({ url: LIVE_FONT_KIT });
  await page.addStyleTag({ content: LIVE_FONT_CSS });
}
