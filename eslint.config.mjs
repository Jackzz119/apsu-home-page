import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        // Shared skill CLIs use console output as part of their command interface.
        ignores: ['ai/jaSkills/**'],
        rules: {
            'no-console': ['error', { allow: ['error'] }]
        }
    },
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        'storybook-static/**'
    ])
]);

export default eslintConfig;
