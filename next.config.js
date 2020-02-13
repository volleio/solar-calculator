module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack: (config, options) => {
      config.node = {
        fs: "empty"
      };

      return config;
    }
  });
};
