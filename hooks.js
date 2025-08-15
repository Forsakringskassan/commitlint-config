import { fileURLToPath } from "node:url";

const lintConfigPath = fileURLToPath.meta.resolve("./lint-staged.js");

export default {
    "pre-commit": `npm exec lint-staged -- --config "${lintConfigPath}" "$@"`,
    "commit-msg": 'npm exec commitlint -- --edit "$1"',
};
