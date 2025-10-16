module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "prettier"],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        // "linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
        "linebreak-style": 0,
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_$",
                argsIgnorePattern: "^_$",
                ignoreRestSiblings: true,
            },
        ],
        "no-console": "off",
        "no-prototype-builtins": "off",
        "no-empty": "warn",
        "react/prop-types": "off",
    },
};
