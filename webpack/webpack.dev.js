/**
 * webpack.dev.js
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
const path = require('path');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = env => {

  env.production = false;
  const config = merge(common(env), {
    mode: 'development',
    watch: env.hotreloading === true,
    plugins: [
      // new ForkTsCheckerWebpackPlugin(),

      // For development, this plugin will speed up a build.
      // Note: In order to see results, you'll need to run webpack twice with this plugin:
      // the first build will take the normal amount of time. The second build will be significantly faster.
      // new HardSourceWebpackPlugin()
    ]
  });

  // always set the devtool if in development. choose cheap-module-source-map since it gives
  // mappings to the original source, but drops line column mappings to increase the speed of the build.
  if (env.platform === 'firefox') {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'inline-source-map';
  }

  // only extensions that support the WebExtension API can currently reload the extension when doing hotloading
  const useExtensionReloading = (env.hotreloading === true);

  // Add the CleanWebpackPlugin if not doing extension reloading. The ChromeExtensionReloader will try
  // to reload the extension before the build is complete, causing the reload to fail and the need to
  // reinstall the extension, so we clean in every situation except for extension reloading.
  if (!useExtensionReloading) {
    config.plugins.unshift(new CleanWebpackPlugin());
  }

  // add the ExtensionReloader plugin
  if (useExtensionReloading) {
    const backgroundChunkName = 'scripts/background';
    config.plugins.push(new ExtensionReloader({
      port: 9090, // Which port use to create the server
      reloadPage: true, // Force the reload of the page also
      entries: { // The entries used for the content/background scripts
        contentScript: 'scripts/content-script',
        background: backgroundChunkName,
        popup: 'scripts/popup'
      }
    }));
  }

  return config;
};
