/**
 * Story helper: renders a content fixture in an iframe running the site (see public/sb-frame.js).
 * The iframe grows to its content height, so docs pages show whole blocks and pages.
 */
import { action } from 'storybook/actions';
import { authoringControls } from './authoring.js';

let frameCount = 0;

/**
 * @param {object} options
 * @param {string} options.fixture fixture path, e.g. 'blocks/hero', 'pages/index', '__tokens'
 * @param {number} [options.section] keep only this section of the fixture
 * @param {boolean} [options.chrome] show the site header and footer
 * @param {string} [options.group] token group for the '__tokens' view
 * @param {number} [options.minHeight] initial height before the content reports its size
 * @param {object} context Storybook story context (reads the "Brand" toolbar)
 * @returns {HTMLIFrameElement}
 */
export function renderFrame({
  fixture, section, chrome = false, group, minHeight = 200, authoring, block,
}, context) {
  frameCount += 1;
  const id = `sb-frame-${frameCount}`;
  const query = new URLSearchParams({
    fixture, theme: context.globals.brand || 'auto', chrome: chrome ? '1' : '0', id,
  });
  if (section !== undefined) query.set('section', String(section));
  if (group) query.set('group', group);
  if (block) query.set('authoring', block);

  const iframe = document.createElement('iframe');
  iframe.src = `/sb-frame.html?${query}`;
  iframe.title = `${fixture}${section !== undefined ? ` (example ${section + 1})` : ''}`;
  iframe.style.cssText = `display:block;width:100%;height:${minHeight}px;border:0;`;
  const onMessage = (event) => {
    if (!iframe.isConnected) {
      window.removeEventListener('message', onMessage);
      return;
    }
    if (event.origin !== window.location.origin
      || event.data?.sbFrame !== id || event.source !== iframe.contentWindow) return;
    if (event.data.type === 'authoring-ready') {
      iframe.contentWindow.postMessage({ sbFrame: id, type: 'authoring', values: authoring }, window.location.origin);
    } else if (event.data.type === 'interaction') {
      action(event.data.event)({ element: event.data.element, label: event.data.label });
    } else if (Number.isFinite(event.data.height) && event.data.height > 0) {
      iframe.style.height = `${Math.max(minHeight, event.data.height)}px`;
    }
  };
  window.addEventListener('message', onMessage);
  return iframe;
}

/**
 * Story factory for one fixture section.
 * @param {string} fixture
 * @param {number} [section]
 * @param {object} [options] extra renderFrame options
 */
export function frameStory(fixture, section, options = {}) {
  const editor = authoringControls(fixture);
  const authoringValues = (args) => Object.fromEntries(Object.keys(editor.argTypes || {})
    .filter((key) => args[key] !== undefined).map((key) => [key, args[key]]));
  return {
    args: {
      chrome: options.chrome ?? false,
      minHeight: options.minHeight ?? 200,
      ...editor.args,
    },
    argTypes: {
      ...editor.argTypes,
      chrome: {
        name: 'Show header and footer',
        control: 'boolean',
        description: 'Show the site header and footer around the fixture.',
        table: { category: 'Preview' },
      },
      minHeight: {
        name: 'Minimum preview height',
        control: {
          type: 'number', min: 100, max: 2000, step: 50,
        },
        description: 'Minimum iframe height in pixels; the frame grows to fit its content.',
        table: { category: 'Preview' },
      },
    },
    render: (args, context) => renderFrame({
      fixture,
      section,
      ...options,
      chrome: args.chrome,
      minHeight: args.minHeight,
      block: editor.block,
      authoring: authoringValues(args),
    }, context),
  };
}
