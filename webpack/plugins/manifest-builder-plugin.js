/**
 * manifest-builder-plugin.js
 *
 * The enclosed material is Lenovo confidential and is the sole property of Lenovo.
 * Unauthorized disclosure, distribution or other use of this material is expressly prohibited.
 *
 * © 2019 Lenovo Group Ltd.
 *
 * Created on Dec 6, 2019.
 */

function modifyManifest(content, files, platform, mode) {
  content.content_scripts.forEach(script => {
    script.js = [...files, ...script.js];
  });
  return content;
}

function makeAsset(content) {
  const json = JSON.stringify(content, null, 2);
  return {
    source: () => json,
    size: () => json.length
  }
}

function isInvalidPlatform(platform) {
  const supportedPlatforms = ['chrome', 'firefox'];
  return !supportedPlatforms.includes(platform);
}

/**
 * Webpack plugin used to make changes to manifest.json during build time.
 * This plugin will add the required split chunks (created by webpack) to content scripts.
 * To allow local development on localhost, the plugin will add the required configurations. (only when in development mode)
 */
function ManifestBuilderPlugin(options) {
  this.platform = options.platform;
}

ManifestBuilderPlugin.prototype.apply = function (compiler) {
  const platform = this.platform;

  compiler.hooks.emit.tapAsync(
    'ManifestBuilderPlugin',
    (compilation, callback) => {
      if (isInvalidPlatform(platform)) {
        return callback(new Error(`Platform not supported: ${platform}`));
      }

      // Find files that we need to exclude (that are not split chunks)
      const entryPointNames = Array.from(compilation.entrypoints.keys());

      // Filter chucks to only split chunks
      const chunksToInclude = compilation.chunks.filter(chunk => {
        return !entryPointNames.includes(chunk.name);
      });

      // Create a list of files from chunks, exclude source maps
      const fileNames = chunksToInclude.map(chunk => chunk.files.filter(file => file.includes('vendor/') && !file.endsWith('.map')));

      // Flatten the array
      const flattenFileNames = [].concat.apply([], fileNames);

      // Key of manifest in assets
      const manifestKey = 'manifest.json';

      if (!compilation.assets[manifestKey]) {
        return callback(compiler.options.watch ? null : new Error('Manifest not found'));
      }

      // Build manifest file
      const json = JSON.parse(compilation.assets[manifestKey].source());
      compilation.assets[manifestKey] = makeAsset(modifyManifest(json, flattenFileNames, platform, compiler.options.mode));

      // tapAsync requires us to invoke 'callback'
      callback();
    }
  )
}

module.exports = ManifestBuilderPlugin
