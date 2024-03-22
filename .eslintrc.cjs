module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "react", "react-refresh"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    overrides: [
        {
            files: ["src/**/*"],
            env: {
                node: true,
            },
            parserOptions: {
                sourceType: "module",
            },
        },
        {
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "linebreak-style": ["error", "unix"],
        quotes: ["warn", "double"],
        semi: ["error", "always"],
        "@typescript-eslint/naming-convention": [
            "warn",
            {
                selector: "variable",
                format: ["camelCase", "UPPER_CASE", "PascalCase"],
            },
            {
                selector: "parameter",
                format: ["camelCase"],
                leadingUnderscore: "allow",
            },
            {
                selector: "memberLike",
                modifiers: ["private"],
                format: ["camelCase"],
                leadingUnderscore: "require",
            },
            {
                selector: "typeLike",
                format: ["PascalCase"],
            },
            {
                selector: "import",
                format: ["PascalCase", "camelCase"],
            },
        ],
        "quote-props": ["warn", "as-needed"],
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/ban-ts-comment": "error",
    },
};
