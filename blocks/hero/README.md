# hero

Custom **hero** block. Purpose: Page-opening image with a headline and call to action.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: row 1: background image; row 2: heading (H1 or H2) and an optional CTA link in its own paragraph.

## Supported variations

| Variation | Option class |
| --- | --- |
| Home | `home` |
| Centered | `centered` |

Page headers (H1 and intro text beside a photo with a curved corner) are the **Columns (curve)** block, formerly Hero (page).

Ascendiun's hero uses the existing heading sizes and line height from `styles/themes/ascendiun/ascendiun.css`. Its CTA text uses the existing `--heading-font-size-s` scale token (18px at all widths). The block does not redefine the theme's typography or change the authored heading or links.

## Universal Editor fields

N/A (Document Authoring project)
