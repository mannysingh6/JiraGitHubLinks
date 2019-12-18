/**
 * webpack.prod.js
 *
 * The enclosed material is Lenovo confidential and is the sole property of Lenovo.
 * Unauthorized disclosure, distribution or other use of this material is expressly prohibited.
 *
 * © 2019 Lenovo Group Ltd.
 *
 * Created on June 24, 2019.
 */

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');

module.exports = env => {

  env.production = true;
  const config = merge(common(env), {
    mode: 'production',
    plugins: [
      // This will update the tld.js library with the latest publicsuffixlist.
      // This does an unshift and is set to block and not be parallel so that it runs before building.
      new WebpackSynchronizableShellPlugin({
        onBuildStart: {
          scripts: [
            'echo "Updating tldjs library with latest publicsuffixlist..."',
            'npm install --no-save --tldjs-update-rules',
            'echo "Finished updating tldjs library."'
          ],
          blocking: true,
          parallel: false
        }
      })
    ]
  });

  config.plugins.unshift(new CleanWebpackPlugin());

  // If this is production, then include full source-maps for every browser, but firefox. The source-maps
  // change on every build and Mozilla is complaining that they can't recreate our builds during their review process.
  // We will not include source maps for Firefox until we can either resolve or convince Mozilla otherwise.
  if (env.platform !== 'firefox') {
    config.devtool = 'source-map';
  }

  return config;
};
