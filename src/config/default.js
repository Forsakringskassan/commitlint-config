const path = require("path");
const preset = require("@commitlint/config-conventional");
const messages = require("../messages");

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

        "jira-reference": [2, "always"],
    },

    plugins: [
        {
            rules: {
                /* require a jira reference at the end of the commit message */
                "jira-reference": ({ subject }) => {
                    const jira = /\((refs|fixes) [A-Z]+-[0-9]+\)$/;
                    return [
                        subject && subject.match(jira),
                        messages.MISSING_JIRA_REFERENCE,
                    ];
                },
            },
        },
    ],
};
