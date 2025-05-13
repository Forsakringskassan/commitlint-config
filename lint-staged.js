const eslint = ["js", "cjs", "mjs", "cts", "mts", "vue", "ts"];
const eslintPatterns = eslint.map((it) => `*.${it}`);
const eslintGlob = `(${eslintPatterns.join("|")})`;

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
    [eslintGlob]: ["prettier --write", "eslint --fix"],
    [`!${eslintGlob}`]: ["prettier --ignore-unknown --write"],
};

if (process.argv[1] === import.meta.filename) {
    console.log(config);
}

export default config;
