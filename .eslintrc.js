require("@forsakringskassan/eslint-config/patch/modern-module-resolution");

module.exports = {
    extends: ["@forsakringskassan", "@forsakringskassan/cli"],

    overrides: [
        {
            files: "*.spec.[jt]s",
            excludedFiles: ["cypress/**", "tests/**"],
            extends: ["@forsakringskassan/jest"],
        },
    ],
};
