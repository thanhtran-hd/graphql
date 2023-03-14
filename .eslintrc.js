module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: [
        "@typescript-eslint",
        'prettier'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
    ],
    env: {
        node: true,
        jest: true,
    },
    rules: {
        "no-console": 2,
        '@typescript-eslint/no-unused-vars': [
            'error',
            { 'argsIgnorePattern': '^_' },
        ],
        '@typescript-eslint/no-explicit-any': 'error',
        "@typescript-eslint/explicit-function-return-type": "error"
    }
}