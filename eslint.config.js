import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Build output, deps, and non-website code (the API and design-sync tooling
  // have their own toolchains and aren't part of the website's lint scope).
  {
    ignores: [
      'dist',
      'node_modules',
      'api',
      'scripts',
      '.design-sync',
      '.ds-sync',
      'ds-bundle',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // To catch invalid ARIA roles and attributes.
      'jsx-a11y/aria-props': 'error', // For ARIA attributes
      'jsx-a11y/aria-role': 'error', // For ARIA roles
      'jsx-a11y/role-has-required-aria-props': 'error', // For necessary ARIA state for ARIA roles
      'jsx-a11y/role-supports-aria-props': 'error', // For ARIA property
    },
  },
  // Turn off formatting rules that would fight Prettier. Keep this last.
  prettier,
);
