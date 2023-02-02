import type { Configuration } from 'webpack';
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require("path");

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

plugins.push(new CopyWebpackPlugin({patterns: [
  {
    from: path.resolve(__dirname, '', 'static'),
    to: path.resolve(__dirname, '.webpack/renderer', 'static'),
  },
  {
    from: path.resolve(__dirname, '', 'heist_ocr_en'),
    to: path.resolve(__dirname, '.webpack/renderer', 'heist_ocr_en')
  },
  {
    from: path.resolve(__dirname, '', 'icons'),
    to: path.resolve(__dirname, '.webpack/main', 'icons')
  }
]}))

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.png', '.json', '.bin', '.vue'],
  },
};
