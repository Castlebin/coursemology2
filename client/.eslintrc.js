module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      node: {},
      webpack: {},
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': ['error', { forbid: ['any', 'array'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'warn',
    'react/no-danger': 'off',
    'react/no-unused-prop-types': ['warn', { skipShapeProps: true }],
    'react/prefer-stateless-function': 'off',
    'react/require-default-props': 'off',
    'import/no-extraneous-dependencies': ['warn', { devDependencies: true }],
    'import/prefer-default-export': 'warn',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/mouse-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'max-len': ['warn', 120],
    camelcase: ['warn', { properties: 'never' }],
    'comma-dangle': ['error', 'always-multiline'],
    'func-names': 'off',
    'no-multi-str': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // Use `_` to indicate that the method is private
    'no-underscore-dangle': 'off',
    'object-curly-newline': ['error', { consistent: true }],
    'prefer-destructuring': 'off',
  },
  globals: {
    window: true,
    document: true,
    AudioContext: true,
    navigator: true,
    URL: true,
    $: true,
    FormData: true,
    File: true,
    FileReader: true,
  },
};
