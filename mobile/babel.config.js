module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './src',
          },
        },
      ],
      // Replace import.meta.env with process.env for web compatibility
      // (Zustand uses import.meta.env.MODE which fails in non-module scripts)
      function () {
        return {
          visitor: {
            MetaProperty(path) {
              // import.meta.env.X -> process.env.X
              const parent = path.parentPath;
              if (
                parent.isMemberExpression() &&
                parent.node.property.name === 'env'
              ) {
                parent.replaceWithSourceString('process.env');
              }
            },
          },
        };
      },
    ],
  };
};
