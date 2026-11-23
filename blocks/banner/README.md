# banner

Custom **banner** block. Purpose: Heading, copy and call to action over a background image.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: row 1: background image; row 2: heading (H2), paragraphs and a CTA link in its own paragraph.

## Supported variations

| Variation | Option class |
| --- | --- |
| Locations band | `locations` |
| Statement | `statement` |
| Image CTA | `image-cta` |

In the `locations` variation, external links open in a new tab; links within the site stay in the same tab. Other variations keep their authored link targets.

For Blue Shield, a standalone `statement` in a section styled `blue` uses the Banner's own spacing, without adding the section's padding again: 30px above and 60px below the statement text. The same spacing applies without the `blue` section style. Typography and text wrapping are unchanged.

## Hero or Banner?

Both take the same table (row 1: image, row 2: heading, copy and link).

- **Hero** opens the page: one per page, first on the page, the page's H1. Its image loads first (it is the LCP image). Options: `home` (full-width photo, large headline), `centered` (text intro: eyebrow, H1, buttons side by side; Stellarus careers).
- **Banner** is a band further down the page, with an H2. Options: `locations` (map beside the text on a dark band), `statement` (large text on a blue band, no image), `image-cta` (photo inside the content width with a headline and button).

Used on (17 Nov 2026): Hero on the Blue Shield home and Ascendiun careers, Hero (centered) on Stellarus careers, Banner (locations) on the Blue Shield home and Ascendiun careers, Banner (statement) on Growth and development, Banner (image-cta) on Life at Blue Shield.

## Universal Editor fields

N/A (Document Authoring project)
