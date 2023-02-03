import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { PublisherGithub } from '@electron-forge/publisher-github'

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    icon: './icons/HeistIcon'
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}), new MakerRpm({}), new MakerDeb({})],
  publishers: [new PublisherGithub({
    draft: true,
    repository: {
      name: 'poe-heistress',
      owner: 'LawTotem'
    }
  }) ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/tracker/tracker.html',
            js: './src/tracker/renderer.ts',
            name: 'track_window',
            preload: {
              js: './src/tracker/preload.ts'
            }
          },
          {
            html: './src/settings/settings.html',
            js: './src/settings/renderer.ts',
            name: 'settings_window',
            preload: {
              js: './src/settings/preload.ts'
            }
          },
          {
            html: './src/pricer/pricer.html',
            js: './src/pricer/renderer.ts',
            name: 'pricer_window',
            preload: {
              js: './src/pricer/preload.ts'
            }
          }
        ],
      },
    }),
  ],
};

export default config;
