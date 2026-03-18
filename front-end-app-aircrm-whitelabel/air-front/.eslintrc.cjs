const { configure, presets } = require('eslint-kit')

module.exports = configure({
  allowDebug: process.env.NODE_ENV !== 'production',
  extend: {
    parserOptions: {
      project: ['./tsconfig.json', './tsconfig.node.json'],
    },
  },
  presets: [
    presets.imports({
      sort: {
        newline: true,
        groups: [
          // react and other external imports
          ['^react', '^@?\\w'],

          // common aliases (@app, @root, @/, ~/) and anything not matched
          [
            '@app',
            '@pages',
            '@widgets',
            '@features',
            '@entities',
            '@shared',
            '@public',
            '@icons',
          ],

          // relative imports
          ['^\\.'],

          // side effects
          ['^\\u0000'],
        ],
      },
    }),
    presets.node(),
    presets.prettier(),
    presets.typescript(),
    presets.react(),
  ],
})
