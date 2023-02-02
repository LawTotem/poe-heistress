import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

export const plugins = [
  new VueLoaderPlugin(),
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
    typescript: {
      extensions: {
        vue: {
          enabled: true,
          compiler: '@vue/compiler-sfc'
        }
      }
    }
  }),
];
