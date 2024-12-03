module.exports = {
    parser: 'vue-eslint-parser',

    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },

    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],

    rules: {
        // override/add rules settings here, such as:
        'vue/multi-word-component-names': 0,
        'no-unused-expressions': 0,
        '@typescript-eslint/no-unused-expressions': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'vue/valid-define-props': 0,
    },
    overrides: [
        {
            files: [
                'node_modules/**',
                'dist/**',
                'index.html',
                'config/*',
                '^.**.{js,ts}',
            ],
            rules: {
                '@typescript-eslint/no-unused-vars': 0,
            },
        },
    ],
    globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        WebVideoCtrl: 'readonly',
        AMap: 'readonly',
        AMapUI: 'readonly',
        AMapLoader: 'readonly',
    },
};
