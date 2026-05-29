import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Pragmatic flat config: TypeScript + React hooks correctness rules.
 * Unused-symbol checking is handled by the strict tsconfig (noUnusedLocals/
 * noUnusedParameters), so it's disabled here to avoid duplicate noise.
 */
export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', 'coverage', '*.config.js', '*.config.ts', 'public'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  {
    // Tests and node-side config may use looser patterns.
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }
);
