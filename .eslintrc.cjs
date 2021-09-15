module.exports = {
  root: true,
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: ['airbnb-base'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {},
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.js', '.json'],
        map: [['$src', './src']],
      },
    },
  },
};
