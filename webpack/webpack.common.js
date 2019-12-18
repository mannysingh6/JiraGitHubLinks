/**
 * webpack.common.js
 *
 * The enclosed material is Lenovo confidential and is the sole property of Lenovo.
 * Unauthorized disclosure, distribution or other use of this material is expressly prohibited.
 *
 * © 2019 Lenovo Group Ltd.
 *
 * Created on June 24, 2019.
 */

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestBuilderPlugin = require('./plugins/manifest-builder-plugin');

module.exports = env => {
  const root = path.join(__dirname, '..');
  const outputPath = path.join(root, 'dist', env.platform);

  const webExtensionPolyfill = `./ext/platform/web-extension-polyfills/${env.platform}-browser-polyfill.ts`;
  const commonChunks = ['scripts/shared/polyfills', 'lib/xbrowser-polyfill'];
  const templateNames = [
    'background',
    'popup'
  ]

  return {
    entry: {
      'scripts/shared/polyfills': './src/shared/polyfills.ts',
      'lib/xbrowser-polyfill': webExtensionPolyfill,
      'scripts/background': './src/background-script/background-entry.ts',
      'scripts/content-script': './src/content-script/content-script-entry.ts',
      'scripts/popup': './src/popup/popup.ts'
    },

    output: {
      path: outputPath,
      filename: '[name].js'
    },

    resolve: {
      extensions: ['.vue', '.js', '.ts', '.json'],
      alias: {
        '@': path.join(root, 'src')
      },
      modules: [
        "node_modules"
      ]
    },

    // optimization
    optimization: {
      minimize: false,
      splitChunks: {
        automaticNameDelimiter: '-',
        cacheGroups: {
          default: false,
          vendors: false,
          // vendor chunk
          vendor: {
            // name of the chunk
            name: 'vendor',
            // async + async chunks
            chunks: 'all',
            // import file path containing node_modules
            test: /node_modules/,
            // priority
            priority: 20,
            // max size (in bytes)
            maxSize: 3000000
          },
          // common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
            maxSize: 3000000
          }
        }
      }
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: /node_modules/,
          options: {
            hotReload: env.production !== true
          }
        },
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(jpg|png|svg|eot|woff|woff2|ttf)$/,
          use: 'file-loader',
        }
      ]
    },

    plugins: [
      ...templateNames.map(name => {
        return new HtmlWebpackPlugin({
          filename: `${name}.html`,
          template: `./ext/templates/${name}.html`,
          chunks: [...commonChunks, `scripts/${name}`],
          minify: {
            removeScriptTypeAttributes: true
          }
        })
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(root, 'ext', 'platform', env.platform),
          to: path.join(outputPath),
          ignore: ['*.ts'],
          toType: 'dir'
        },
        {
          from: path.join(root, 'src', 'assets'),
          to: path.join(outputPath, 'assets'),
          toType: 'dir'
        }
      ]),
      new ManifestBuilderPlugin({
        platform: env.platform
      })
    ]
  }
};
