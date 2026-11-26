import { frameStory } from '../../src/frame.js';

export default {
  title: 'Blocks/Text',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Authored paragraphs, headings and lists with optional alignment, box and float-left treatments. Edit the paragraph or use Authoring rows for rich content. This illustrative fixture is kept separately from generated library examples.',
      },
    },
  },
};

const example = frameStory('foundations/text', 0);

export const Default = example;
export const Right = {
  ...example,
  args: { ...example.args, variant: 'right' },
};
export const Centered = {
  ...example,
  args: { ...example.args, variant: 'center' },
};
export const Box = {
  ...example,
  args: { ...example.args, variant: 'box' },
};
export const FloatLeft = {
  ...example,
  args: { ...example.args, variant: 'float-left' },
};
export const BoxFloatLeft = {
  ...example,
  args: { ...example.args, variant: 'box float-left' },
};
