import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalScript: 'src/global/app.ts',
  globalStyle: 'src/global/app.scss',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: { globPatterns: ['**/*.{js,css,json,html,ico,png}'] },
    },
  ],
  plugins: [sass({})],
  devServer: {
    openBrowser: false,
    port: 3370,
  },
};
