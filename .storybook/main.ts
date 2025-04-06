// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite'
import { loadConfigFromFile, mergeConfig } from 'vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@chromatic-com/storybook',
    '@storybook/experimental-addon-test',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { config: userConfig } = (await loadConfigFromFile(
      path.resolve(__dirname, '../vite.config.storybook.ts'),
    )) || { config: {} }

    if (userConfig.base) userConfig.base = '/'

    if (userConfig.plugins) {
      userConfig.plugins = userConfig.plugins.filter(
        (plugin) => !plugin || plugin.name !== 'vite-plugin-ssr',
      )
    }

    return mergeConfig(config, userConfig)
  },
}

export default config
