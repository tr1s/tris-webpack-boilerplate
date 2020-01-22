module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    "plugin:prettier/recommended"
  ],
  plugins: ["prettier"],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    "comma-dangle": ["error", "never"],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 100
      }
    ]
  }
};
