import { build } from "esbuild";

await build({
    entryPoints: [
        "src/commitlint.ts",
        "src/config/default.ts",
        "src/config/no-jira.ts",
        "src/format.ts",
        "src/install.ts",
        "src/parser.ts",
    ],
    outdir: "dist",
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node20",
    logLevel: "info",
    banner: {
        js: `
import { dirname as _$_dirname } from "node:path";
import { createRequire as _$_createRequire } from "node:module";
import { fileURLToPath as _$_fileURLToPath } from "node:url";

const require = _$_createRequire(import.meta.url);
const __dirname = _$_dirname(_$_fileURLToPath(import.meta.url));
`,
    },
});
