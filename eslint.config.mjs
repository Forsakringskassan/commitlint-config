import defaultConfig, { defineConfig } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";

export default [
    defineConfig({
        name: "Ignored files",
        ignores: ["**/coverage/**", "**/dist/**", "**/node_modules/**"],
    }),

    ...defaultConfig,

    cliConfig({
        files: ["**/*.{js,ts,mjs}"],
    }),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname),
    jestConfig(),

    defineConfig({
        name: "local/bin",
        files: ["bin/*.js"],
        rules: {
            /* esm requires the usage of extension in this context */
            "import/extensions": "off",
            /* needed to run eslint before sources are compiled to dist folder */
            "import/no-unresolved": "off",
        },
    }),
];
