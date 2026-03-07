import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: [
    '../shared/**/*.stories.?(ts|tsx|js|jsx)',
    '../features/**/*.stories.?(ts|tsx|js|jsx)',
  ],
  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
