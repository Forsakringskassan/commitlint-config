import { fileURLToPath } from "node:url";
import preset from "@commitlint/config-conventional";
import { type UserConfig } from "@commitlint/types";

const config = {
    parserPreset: fileURLToPath(new URL("../parser.js", import.meta.url)),
    formatter: fileURLToPath(new URL("../format.js", import.meta.url)),

    prompt: preset.prompt,

    rules: {
        ...preset.rules,

        /* the changelog is included with the commits by semantic-release and
         * contains quite long lines and we don't really consider the body format to
         * be important so we disable max length (header still applies) */
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-enum-assignment -- technical debt */
        "body-max-line-length": [0],
    },
} satisfies UserConfig;

export default config;
