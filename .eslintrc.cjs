require("@forsakringskassan/eslint-config/patch/modern-module-resolution");

module.exports = {
    extends: ["@forsakringskassan", "@forsakringskassan/cli"],

    overrides: [
        {
            /* ensure we lint *.cjs and *.mjs files as well */
            files: ["*.cjs", "*.mjs"],
        },
        {
            files: "*.ts",
            extends: ["@forsakringskassan/typescript"],
        },
        {
            files: "*.spec.[jt]s",
            excludedFiles: ["cypress/**", "tests/**"],
            extends: ["@forsakringskassan/jest"],
        },
        {
            files: ["bin/*.js"],
            rules: {
                /* esm requires the usage of extension in this context */
                "import/extensions": "off",
                /* needed to run eslint before sources are compiled to dist folder */
                "import/no-unresolved": "off",
            },
        },
    ],
};
