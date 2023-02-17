import type { ModuleOptions } from 'webpack';
const path = require("path");

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.vue$/,
    use: {
      loader: 'vue-loader'
    }
  },
  {
    test: /\.ts$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        appendTsSuffixTo: [/\.vue$/]
      },
    },
  },
  {
    test: /[/\\]static[/\\].+\.(png|jpg|svg)$/,
    include: [path.resolve(__dirname, "static")],
    use: {
      loader: 'file-loader?name=[path][name].[ext]'
    }
  },
  {
    test: /[/\\]heist_ocr_en[/\\].+\.(json|bin)$/,
    include: [path.resolve(__dirname, "heist_ocr_en")],
    //type: "asset/resource"
    use: {
      loader: 'file-loader?name=[path][name].[ext]'
    }
  }
];
