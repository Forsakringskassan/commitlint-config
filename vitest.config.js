import { defineConfig } from "vitest/config";

const defaultExclude = ["**/node_modules/**"];

const unitTestConfig = defineConfig({
    test: {
        exclude: [...defaultExclude, "**/*.integration.spec.ts"],
    },
});

const integrationTestConfig = defineConfig({
    test: {
        globalSetup: ["./vitest.global.js"],
        include: ["**/*.integration.spec.ts"],
    },
});

export default defineConfig(({ mode }) => {
    const { test } =
        mode === "integration" ? integrationTestConfig : unitTestConfig;
    return {
        test,
        server: {
            watch: {
                ignored: [...defaultExclude],
            },
        },
    };
});
