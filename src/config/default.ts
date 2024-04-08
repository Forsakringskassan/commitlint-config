import { fileURLToPath } from "node:url";
import { type UserConfig } from "@commitlint/types";
import preset from "@commitlint/config-conventional";
import messages from "../messages";

const config = {
    parserPreset: fileURLToPath(new URL("../parser.js", import.meta.url)),
    formatter: fileURLToPath(new URL("../format.js", import.meta.url)),

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
                        Boolean(subject && subject.match(jira)),
                        messages.MISSING_JIRA_REFERENCE,
                    ];
                },
            },
        },
    ],
} satisfies UserConfig;

export default config;
