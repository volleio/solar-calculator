const compose = require('next-compose');

const cssConfig = {
    cssModules: true
};

module.exports = compose([
  {
    webpack: config => {
      config.node = {
        fs: "empty"
      };

      return config;
    }
  }
]);
