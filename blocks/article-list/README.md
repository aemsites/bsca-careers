# article-list

Custom **article-list** block. Purpose: Curated grid of story cards; replaces the source 'More Stories' row on every story (76 pages, 1-10 cards each) and the 'Growth & development stories' row on /growth-development..

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One block table. Single-cell rows each hold one story link: an internal path (/blog/<slug> or any other indexed page such as /a-culture-of-belonging) or an external URL listed in the external-stories sheet. Two-cell rows are options (key | value): Columns (2 | 3 | 4, default 3), Ground (Light | Tinted | Dark, default Light), Display Article date (Yes | No, default Yes), Display Short description (Yes | No, default Yes), Link Label (card label text, or No to hide; default 'View highlights' on Tinted/Dark grounds and none on Light, as on the source). Keys are case-insensitive; unknown keys are ignored; authors may omit option rows. The section heading ('More Stories', 'Growth & development stories') and any 'View More Stories' link are default content before the block, not part of it..

Off-site stories (`/blog/external-stories`) with **`video: Yes`** (also `yes`, `true`, `x`, `1`) show the play badge on their image in the More Stories cards; an empty `video` cell means no badge.

When the section starts with an H2 followed by a paragraph containing only the
"View More Stories" link, the link stays to the right, bottom-aligned with the heading
at every viewport, as on live. The heading wraps within the remaining space; no extra
authoring or spacer content is needed.

## Supported variations

No variations. The Ground option also selects the source treatment: Tinted/Dark = the More Stories band (title 10px above the text, 'View highlights' label); Light = the plain tile row of /growth-development (30px inset, title 30px above the text, no label).

Internal stories with an authored Embed (video) block display a centered blue play badge on their thumbnail. Detection reads the story's `.plain.html` content and is cached per path for the page lifetime. Inline video links alone do not add a badge. Cards still navigate to the story; the badge is decorative. External stories and unavailable content do not receive a badge.

Card titles of internal stories use the story's headline (H1), as on the source; the index title is shown until the story content has loaded.

Card image alternative text comes from the indexed `imageAlt` field (the story's `Image Alt` page metadata) or the `imageAlt` value in the external-stories sheet. It does not fall back to the story's hero-image alt.

Interface text comes from the placeholders sheet (`/placeholders/global`, keys Stories.ViewHighlights); the code keeps the current text as the default. See the author guide, "Placeholders: interface text".

## Universal Editor fields

N/A (Document Authoring project)
