const path = require('path');
const realpath = require('fs').realpathSync;
const webpack = require('webpack');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssoWebpackPlugin = require('csso-webpack-plugin').default;
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const postcssPresetEnv = require('postcss-preset-env');

const modulePath = path.resolve(__dirname, '../node_modules');
const srcPath = path.resolve(__dirname, '../src');
const isProduction = process.env.NODE_ENV === 'production';
const alias = {
  Styles: `${srcPath}/styles`,
  Fonts: `${srcPath}/fonts`,
  Images: `${srcPath}/images`,
};

module.exports = [
  {
    name: 'client',
    context: path.join(__dirname, '../src'),
    entry: {
      main: './client.js',
    },
    output: {
      filename: '[name].[chunkhash].bundle.js',
      path: path.resolve(__dirname, '../assets'),
      publicPath: '/assets/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
        },
        {
          test: /\.(s?css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },
            'svg-transform-loader/encode-query',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProduction,
                plugins: () => [
                  postcssPresetEnv({}),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [
                  'node_modules/sass-mq',
                ],
              },
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  path.resolve(__dirname, '../src/styles/import.scss'),
                ],
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.svg(\?.*)?$/, // match img.svg and img.svg?param=value
          use: [
            'file-loader',
            'svg-transform-loader',
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  {
                    removeTitle: true,
                  },
                  {
                    convertColors: {
                      shorthex: false,
                    },
                  },
                  {
                    convertPathData: false,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {
        ...alias,
      },
    },
    plugins: [
      new webpack.IgnorePlugin(/jsdom/),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[chunkhash].css',
      }),
      new CssoWebpackPlugin({
        restructure: true,
      }),
      new ResourceHintWebpackPlugin(),
      new webpack.DefinePlugin({
        ENV: JSON.stringify(process.env),
      }),
      new SVGSpritemapPlugin(
        [
          './src/images/svg-sprite/**/*.svg',
        ],
        {
          output: {
            filename: 'polaris-sprite.svg',
            svg4everybody: false,
            svgo: {
              plugins: [
                { removeDesc: true },
                { removeAttrs: { attrs: 'fill|class|style' } },
                { removeStyleElement: true },
                { removeRasterImages: true },
                { sortAttr: true },
              ],
            },
          },
          sprite: {
            prefix: 'project__',
          },
        },
      ),
    ],
    // exclude node only packages
    node: {
      fs: 'empty',
      tls: 'empty',
      net: 'empty',
      module: 'empty',
    },
  },
];
