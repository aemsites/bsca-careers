import { getVimeoId, getYouTubeId } from '../../scripts/scripts.js';
import { hasMediaConsent } from '../../scripts/video-modal.js';

/**
 * Embed block.
 *
 * Content: an optional poster image row, then a row with the media link.
 *
 * - Option `video` (or any direct .mp4 link): a native, responsive 16:9
 *   <video controls preload="none"> using the image as poster. MP4 files are
 *   served from the site's own media host, so they play without a consent gate.
 * - YouTube links without an authored poster show the native player preview
 *   after media consent, without autoplay. Authored posters and Vimeo links
 *   retain the click-to-play facade. All third-party players require consent
 *   (hasMediaConsent in scripts/video-modal.js). Without consent, clicking play
 *   shows a notice with a link to watch on the provider site instead.
 * - Any other link is left as an ordinary link.
 */

function isMp4(href) {
  try {
    return /\.mp4$/i.test(new URL(href, window.location.href).pathname);
  } catch {
    return false;
  }
}

function getProvider(href) {
  const youtube = getYouTubeId(href);
  if (youtube) {
    const id = encodeURIComponent(youtube);
    return {
      name: 'YouTube',
      src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      thumbnails: [
        `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      ],
    };
  }
  const vimeo = getVimeoId(href);
  if (vimeo) {
    return { name: 'Vimeo', src: `https://player.vimeo.com/video/${vimeo}?autoplay=1&dnt=1` };
  }
  return null;
}

function frame(...children) {
  const div = document.createElement('div');
  div.className = 'embed-frame';
  div.append(...children);
  return div;
}

function renderVideo(block, href, img, title) {
  const video = document.createElement('video');
  video.controls = true;
  video.preload = 'none';
  video.playsInline = true;
  if (img) video.poster = img.currentSrc || img.src;
  if (title) video.setAttribute('aria-label', title);
  const source = document.createElement('source');
  source.src = href;
  source.type = 'video/mp4';
  video.addEventListener('click', () => {
    if (video.paused) {
      queueMicrotask(() => {
        if (!video.paused) return;
        video.play().catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Unable to play embedded MP4:', error);
        });
      });
    }
  });
  const fallback = document.createElement('a');
  fallback.href = href;
  fallback.textContent = 'Download the video';
  video.append(source, fallback);
  block.classList.add('embed-video');
  block.replaceChildren(frame(video));
}

function addThumbnail(container, provider) {
  const [first, ...fallbacks] = provider.thumbnails || [];
  if (!first) return;
  const show = () => {
    if (!container.isConnected || container.querySelector('picture')) return;
    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', () => {
      if (img.naturalWidth <= 120 && fallbacks.length) img.src = fallbacks.shift();
    });
    img.addEventListener('error', () => {
      if (fallbacks.length) img.src = fallbacks.shift();
      else img.parentElement?.remove();
    });
    img.src = first;
    const thumbnail = document.createElement('picture');
    thumbnail.className = 'embed-thumbnail';
    thumbnail.append(img);
    container.prepend(thumbnail);
  };
  if (hasMediaConsent()) {
    show();
    return;
  }
  const onConsent = (event) => {
    if (!event.detail?.consented) return;
    window.removeEventListener('consent.update', onConsent);
    show();
  };
  window.addEventListener('consent.update', onConsent);
}

function renderFacade(block, link, picture, provider, title) {
  const label = title || `${provider.name} video`;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'embed-play video-play';
  button.setAttribute('aria-label', `Play video: ${label}`);

  const container = frame(...[picture, button].filter(Boolean));
  container.classList.add('embed-placeholder');
  block.classList.add(`embed-${provider.name.toLowerCase()}`);
  block.replaceChildren(container);
  if (!picture) addThumbnail(container, provider);

  const loadPlayer = (autoplay, focus = false) => {
    const iframe = document.createElement('iframe');
    const url = new URL(provider.src);
    url.searchParams.set('autoplay', autoplay ? '1' : '0');
    iframe.src = url.href;
    iframe.title = label;
    iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
    iframe.allowFullscreen = true;
    container.classList.remove('embed-placeholder');
    container.replaceChildren(...container.querySelectorAll('picture'), iframe);
    block.querySelector('.embed-consent')?.remove();
    block.classList.add('embed-is-loaded');
    if (focus) iframe.focus();
  };

  button.addEventListener('click', () => {
    if (hasMediaConsent()) {
      loadPlayer(true, true);
      return;
    }
    if (block.querySelector('.embed-consent')) return;
    const notice = document.createElement('p');
    notice.className = 'embed-consent';
    notice.setAttribute('role', 'status');
    const watch = document.createElement('a');
    watch.href = link;
    watch.target = '_blank';
    watch.rel = 'noopener noreferrer';
    watch.textContent = `watch it on ${provider.name}`;
    notice.append(
      `This video is hosted by ${provider.name}. Accept cookies to play it here, or `,
      watch,
      ' (opens in a new tab).',
    );
    block.append(notice);
    watch.focus();
  });

  if (provider.name === 'YouTube' && !picture) {
    if (hasMediaConsent()) {
      loadPlayer(false);
    } else {
      const onConsent = (event) => {
        if (!event.detail?.consented) return;
        window.removeEventListener('consent.update', onConsent);
        if (container.isConnected && !container.querySelector('iframe')) loadPlayer(false);
      };
      window.addEventListener('consent.update', onConsent);
    }
  }
}

export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')];
  const picture = block.querySelector('picture');
  const img = picture?.querySelector('img') || block.querySelector('img');
  const title = (img?.alt || '').trim();

  const mp4 = links.find((a) => isMp4(a.href));
  if (mp4 && (block.classList.contains('video') || !links.some((a) => getProvider(a.href)))) {
    renderVideo(block, mp4.href, img, title);
    return;
  }

  const providerLink = links.find((a) => getProvider(a.href));
  if (providerLink) {
    renderFacade(block, providerLink.href, picture, getProvider(providerLink.href), title);
  }
  // otherwise: leave the authored content (a plain link) in place
}
