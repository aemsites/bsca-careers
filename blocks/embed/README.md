# embed

Custom **embed** block. Purpose: Responsive video. YouTube uses the production 12:7 player ratio without a minimum height. MP4 uses 16:9; Vimeo uses 16:9 with a 315px minimum height.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: row 1: poster image (optional); row 2: link to the media (.mp4 for the video option, or a YouTube/Vimeo URL).

YouTube links without a poster show YouTube's native preview after media consent, without autoplay. The player uses `www.youtube.com`, matching production's native Share and Watch Later controls; availability also depends on YouTube's player and sign-in state. An authored poster keeps the custom click-to-play preview. Vimeo also remains click-to-play. Before consent, the play button offers an external watch link instead of loading the player.

For posterless YouTube embeds, `addThumbnail` retains a consent-gated thumbnail behind the native player. It tries `maxresdefault.jpg`, falls back to `hqdefault.jpg` for missing or low-resolution images, and removes the thumbnail if both fail. The native player remains usable when the thumbnail is unavailable, and authored posters are never replaced.

## Supported variations

| Variation | Option class |
| --- | --- |
| Video | `video` |

## Universal Editor fields

N/A (Document Authoring project)
