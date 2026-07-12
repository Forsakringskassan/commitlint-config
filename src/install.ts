import { spawnSync } from "node:child_process";
import { Console } from "node:console";
import fs, { existsSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { Writable } from "node:stream";
import { parseArgs } from "node:util";
import isCI from "is-ci";
import spawn, { SubprocessError } from "nano-spawn";

import packageJson from "../package.json" with { type: "json" };
import hooks from "./hooks";

import {
    type PackageJsonType,
    existingHuskyConfig,
    existingSimpleGitConfig,
    invalidInstalledPackages,
} from "./verify-package";

const args = parseArgs({
    options: {
        debug: {
            type: "boolean",
            default: false,
        },
    },
});

const debug = args.values.debug
    ? new Console(process.stdout, process.stderr)
    : new Console(
          new Writable({
              write(_chunk, _encoding, callback) {
                  queueMicrotask(callback);
              },
          }),
      );

/**
 * Find the .git directory and return the absolute path.
 *
 * @param cwd - Current working directory
 * @returns Absolute path to git or null if not found.
 */
function findGit(cwd: string): string | null {
    let current = cwd;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- breaks out eventually
    while (true) {
        const search = path.join(current, ".git");

        if (existsSync(search)) {
            return path.resolve(current);
        }

        /* get the parent directory */
        const child = current;
        current = path.dirname(current);

        /* stop if this is the root directory */
        if (current === child) {
            break;
        }
    }

    return null;
}

/**
 * Calls "git config commit.template .."
 */
function configureCommitTemplate(gitDir: string): void {
    const relPath = path.relative(gitDir, path.join(__dirname, ".."));
    const gitmessage = path.join(relPath, "gitmessage");
    const args = ["config", "commit.template", gitmessage];
    debug.log(`git ${args.join(" ")}`);

    /* eslint-disable-next-line sonarjs/no-os-command-from-path -- want to run git from PATH */
    spawnSync("git", args);
}

/* Setup hooks */
async function setupGitHooks(gitDir: string): Promise<void> {
    const originCwd: string = process.env["INIT_CWD"] ?? "";

    const packageJson = JSON.parse(
        await readFile(path.join(originCwd, "package.json"), {
            encoding: "utf8",
        }),
    ) as PackageJsonType;

    // Fail install if user already has git hook addon or lint-staged.
    if (
        invalidInstalledPackages(packageJson) ||
        existingSimpleGitConfig(packageJson) ||
        (await existingHuskyConfig(originCwd, fs))
    ) {
        /* eslint-disable-next-line unicorn/no-process-exit -- technical debt */
        process.exit(1);
    }

    // Unset git config made by Husky
    // https://typicode.github.io/husky/troubleshoot.html#git-hooks-not-working-after-uninstall
    try {
        await spawn("git", ["config", "--unset", "core.hooksPath"], {
            cwd: originCwd,
        });
        await rm(path.join(originCwd, ".husky/_"), {
            recursive: true,
            force: true,
        });
    } catch (error: unknown) {
        if (!(error instanceof SubprocessError && error.exitCode === 5)) {
            /*
            code 5 equals unsetting an option which does not exist,
            this is expected if the consumer has not previously used Husky.
            */
            console.error(error);
            /* eslint-disable-next-line unicorn/no-process-exit -- technical debt */
            process.exit(1);
        }
    }

    const hooksDir = path.join(gitDir, ".git", "hooks");

    for (const [name, command] of Object.entries(hooks)) {
        const hookPath = path.join(hooksDir, name);
        debug.log(`Writing ${hookPath}`);
        await writeFile(hookPath, `#!/bin/sh\n${command}`, {
            encoding: "utf8",
            mode: 0o755,
        });
    }
}

if (isCI) {
    /* eslint-disable-next-line unicorn/no-process-exit -- technical debt */
    process.exit(0);
}

debug.group(packageJson.name);
debug.log();

const gitDir = findGit(process.cwd());
if (!gitDir) {
    const isPostinstall = process.env["npm_lifecycle_event"] === "postinstall";
    if (isPostinstall) {
        console.warn(
            `${packageJson.name} : Failed to locate git directory, skipping gitmessage and git hooks setup.`,
        );
        /* eslint-disable-next-line unicorn/no-process-exit -- technical debt */
        process.exit(0);
    }
    console.error(`${packageJson.name} : Failed to locate git directory.`);
    /* eslint-disable-next-line unicorn/no-process-exit -- technical debt */
    process.exit(1);
}

await setupGitHooks(gitDir);
configureCommitTemplate(gitDir);

debug.log("Successfully installed gitmessage and git hooks.");
debug.log();
debug.groupEnd();
