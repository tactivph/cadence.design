import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../projects/cadence-ui/src/**/*.stories.@(ts|mdx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/angular', options: {} },
  // Serve the bundled Inter/Hyogo fonts at the path the theme references.
  staticDirs: [{ from: '../projects/cadence-ui/src/styles/fonts', to: '/assets/fonts' }],
};
export default config;
