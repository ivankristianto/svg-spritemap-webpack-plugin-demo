module.exports = (api) => {
  api.cache(false);
  return {
    plugins: [
      '@babel/plugin-proposal-class-properties'
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: 'last 1 version and not dead and > 0.2%, node 10',
        },
      ],
      '@babel/preset-react',
    ],
    env: {
      test: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: 'last 1 version and not dead and > 0.2%, node 10',
            },
          ],
          '@babel/preset-react',
        ],
      },
      production: {
        plugins: [
          'transform-react-remove-prop-types',
        ],
      },
    },
  };
};
