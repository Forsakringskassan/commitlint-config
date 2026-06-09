import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);

export function resolveInstallCwd(
    cwd: string,
    initCwd: string | undefined,
    gitRoot: string | null,
): string {
    return initCwd ?? gitRoot ?? cwd;
}

export function simpleGitHooksArgs(): string[] {
    return [
        require.resolve("simple-git-hooks/cli.js"),
        fileURLToPath(new URL("../hooks.js", import.meta.url)),
    ];
}
