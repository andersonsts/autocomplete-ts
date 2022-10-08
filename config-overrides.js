const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      'api': path.resolve(__dirname, 'src/api'),
      'components': path.resolve(__dirname, 'src/components'),
      'types': path.resolve(__dirname, 'src/types'),
      'utils': path.resolve(__dirname, 'src/utils'),
    },
  };
  return config;
};