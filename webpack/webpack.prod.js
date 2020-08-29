const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const common = require('./webpack.common.js');

const configs = common.map(config => merge(config, { mode: 'production', devtool: 'none' }));
configs[0] = merge(configs[0], {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(s?css)$/,
          chunks: 'all',
          enforce: true,
        },
        scripts: {
          name: 'scripts',
          test: /\.js$/,
          chunks: 'all',
          maxSize: 400000,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
        extractComments: true,
      }),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new CompressionPlugin(),
  ],
});

configs[0].module.rules = configs[0].module.rules.map((rule) => {
  if (!rule.use || !Array.isArray(rule.use)) {
    return rule;
  }
  const use = rule.use.map((loader) => {
    if (typeof loader !== 'object' || !loader.options || !loader.options.sourceMap) {
      return loader;
    }
    return {
      ...loader,
      options: {
        ...loader.options,
        sourceMap: false,
      },
    };
  });
  return {
    ...rule,
    use,
  };
});

module.exports = configs;
