// eslint.config.mjs
import tseslint from 'typescript-eslint';

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['node_modules', 'dist', '.next'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: ['./tsconfig.json'],
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
        rules: {
            // règles recommandées de base
            ...tseslint.configs.recommended.rules,
        },
    },
];
