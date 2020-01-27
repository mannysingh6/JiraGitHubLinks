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

const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestBuilderPlugin = require("./plugins/manifest-builder-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");

module.exports = env => {
  const root = path.join(__dirname, "..");
  const outputPath = path.join(root, "dist", env.platform);

  const webExtensionPolyfill = `./ext/platform/web-extension-polyfills/${env.platform}-browser-polyfill.ts`;
  const commonChunks = ["lib/xbrowser-polyfill"];
  const templateNames = ["background", "popup", "settings", "spotlight"];

  return {
    entry: {
      "lib/xbrowser-polyfill": webExtensionPolyfill,
      "scripts/background": "./src/background-script/background-entry.ts",
      "scripts/github-content-script": "./src/content-scripts/github/github-script-entry.ts",
      "scripts/jira-content-script": "./src/content-scripts/jira/jira-script-entry.ts",
      "scripts/spotlight-content-script": "./src/content-scripts/spotlight/spotlight-script-entry.ts",
      "scripts/spotlight": "./src/spotlight/spotlight.ts",
      "scripts/popup": "./src/popup/popup.ts",
      "scripts/settings": "./src/settings/settings.ts"
    },

    output: {
      path: outputPath,
      filename: "[name].js"
    },

    resolve: {
      extensions: [".vue", ".js", ".ts", ".json"],
      alias: {
        "@": path.join(root, "src"),
        vue$: "vue/dist/vue.esm.js"
      },
      modules: ["node_modules"]
    },

    // optimization
    optimization: {
      minimize: false,
      splitChunks: {
        automaticNameDelimiter: "-",
        cacheGroups: {
          default: false,
          vendors: false,
          // vendor chunk
          vendor: {
            // name of the chunk
            name: "vendor/index",
            chunks(chunk) {
              return chunk.name !== 'scripts/spotlight-content-script';
            },
            // import file path containing node_modules (exclude webextension-polyfill)
            test: /[\\/]node_modules[\\/]((?!(webextension-polyfill)).*)[\\/]/,
            // priority
            priority: 20,
            // max size (in bytes)
            maxSize: 1000
          },
          // common chunk
          common: {
            name: "common/index",
            minChunks: 2,
            chunks(chunk) {
              return chunk.name !== 'scripts/spotlight-content-script';
            },
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
            maxSize: 1000
          }
        }
      }
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader",
          exclude: /node_modules/
        },
        {
          test: /\.ts?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        },
        // this will apply to both plain `.js` files
        // AND `<script>` blocks in `.vue` files
        {
          test: /\.js$/,
          loader: "babel-loader",
          exclude: /node_modules/
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            "vue-style-loader",
            "css-loader",
            {
              loader: "sass-loader",
              // Requires sass-loader@^7.0.0
              options: {
                implementation: require("sass"),
                fiber: require("fibers"),
                indentedSyntax: true // optional
              },
              // Requires sass-loader@^8.0.0
              options: {
                implementation: require("sass"),
                sassOptions: {
                  fiber: require("fibers"),
                  indentedSyntax: true // optional
                }
              }
            }
          ]
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
          test: /\.css$/,
          use: ["vue-style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpe?g|gif|webp|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: "url-loader",
          options: {
            esModule: false,
            limit: 4096,
            fallback: {
              loader: 'file-loader'
            }
          }
        },
        {
          test: /\.(svg)(\?.*)?$/,
          loader: "file-loader",
          options: {
            esModule: false
          }
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        DEBUG_MESSAGING_ENABLED: JSON.stringify(!!env.debug)
      }),
      new VueLoaderPlugin(),
      new VuetifyLoaderPlugin(),
      ...templateNames.map(name => {
        return new HtmlWebpackPlugin({
          filename: `${name}.html`,
          template: `./ext/templates/${name}.html`,
          chunks: [...commonChunks, `scripts/${name}`],
          minify: {
            removeScriptTypeAttributes: true
          }
        });
      }),
      new CopyWebpackPlugin([
        {
          from: path.join(root, "ext", "platform", env.platform),
          to: path.join(outputPath),
          ignore: ["*.ts"],
          toType: "dir"
        },
        {
          from: path.join(root, "src", "store-assets"),
          to: path.join(outputPath, "store-assets"),
          toType: "dir"
        }
      ]),
      new ManifestBuilderPlugin({
        platform: env.platform
      })
    ]
  };
};
