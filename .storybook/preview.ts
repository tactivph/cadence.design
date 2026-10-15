import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Show a "Code" panel on every story's Canvas + clean HTML source in Docs.
    docs: {
      codePanel: true,
      source: { type: 'dynamic', language: 'html' },
    },
    options: {
      storySort: {
        order: [
          'Pages', ['Overview', 'Staff', 'Agent', 'Client'],
          'Foundations', 'Actions', 'Forms', 'Data display', 'Feedback', 'Navigation',
          '*',
        ],
      },
    },
  },
};
export default preview;
