import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        settings: {
            react: {
                version: 'detect',
            }
        },
        rules: {
            semi: [2, 'always'],
            eqeqeq: ['error', 'always'],
            quotes: ['error', 'single'],
            indent: ['error', 4, { 'SwitchCase': 1 }],
            '@typescript-eslint/explicit-function-return-type': 'error',
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
];