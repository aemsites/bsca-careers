# cards

Custom **cards** block. Purpose: Grid of repeating tiles.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per card; optional image cell, then a body cell with title heading, description paragraph and a CTA link in its own paragraph.

## Supported variations

Story cards are not a Cards option: use the **Article List** block.

| Variation | Option class |
| --- | --- |
| Feature links | `feature-links` |
| Icon Tiles | `icon-tiles` |
| Video Tiles | `video-tiles` |

Video-tile title links stay un-underlined on hover, matching the live careers site.
The whole tile remains clickable, with a visible keyboard-focus outline.

On BSC pages, video tiles request YouTube autoplay but do not delegate iframe
autoplay permission, matching the live careers site. Playback on opening therefore
depends on the browser's autoplay policy; it is not forced to stay paused.
Other brands and shared modal callers retain autoplay permission. Consent,
player dimensions, and tile dimensions are unchanged.

Ascendiun feature-link cards consume the existing typography tokens in
`styles/themes/ascendiun/ascendiun.css`, including its heading line height and responsive
font sizes, without adding card-specific typography tokens. CTA links use the
theme's full-arrow icon and hover movement; other themes retain their chevrons.

## Universal Editor fields

N/A (Document Authoring project)
