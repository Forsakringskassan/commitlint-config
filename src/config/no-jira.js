const path = require("path");
const preset = require("@commitlint/config-conventional");

const distDir = path.join(__dirname, "..");

module.exports = {
    parserPreset: path.join(distDir, "parser.js"),
    formatter: path.join(distDir, "format.js"),
    prompt: preset.prompt,

    rules: {
        ...preset.rules,

        /* the changelog is included with the commits by semantic-release and
         * contains quite long lines and we don't really consider the body format to
         * be important so we disable max length (header still applies) */
        "body-max-line-length": [0],
    },
};
