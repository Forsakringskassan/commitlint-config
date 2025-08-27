import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import * as fsp from "fs/promises";
import spawn, { SubprocessError } from "nano-spawn";
import isCI from "is-ci";

import {
    existingSimpleGitConfig,
    packageJsonType,
    invalidInstalledPackages,
    existingHuskyConfig,
} from "./verifyPackage";

/**
 * Find the .git directory and return the absolute path.
 *
 * @param cwd - Current working directory
 * @returns Absolute path to git or null if not found.
 */
function findGit(cwd: string): string | null {
    let current = cwd;

    // eslint-disable-next-line no-constant-condition -- breaks out eventually
    while (true) {
        const search = path.join(current, ".git");

        if (fs.existsSync(search)) {
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
function configureCommitTemplate(): void {
    const gitDir = findGit(process.cwd());
    if (!gitDir) {
        console.warn("Failed to locate git directory, skipping gitmessage");
        return;
    }

    const relPath = path.relative(gitDir, path.join(__dirname, ".."));
    const gitmessage = path.join(relPath, "gitmessage");
    const args = ["config", "commit.template", gitmessage];
    console.info(`git ${args.join(" ")}`);
    spawnSync("git", args);
}

/* Setup hooks */
async function setupGitHooks(): Promise<void> {
    const originCwd: string = process.env["INIT_CWD"] || "";

    const packageJson: packageJsonType = JSON.parse(
        await fsp.readFile(path.join(originCwd, "package.json"), {
            encoding: "utf-8",
        }),
    );

    // Fail install if user already has git hook addon or lint-staged.
    if (
        invalidInstalledPackages(packageJson) ||
        existingSimpleGitConfig(packageJson) ||
        (await existingHuskyConfig(originCwd, fsp))
    ) {
        process.exit(1);
    }

    if (!isCI) {
        // Unset git config made by Husky
        // https://typicode.github.io/husky/troubleshoot.html#git-hooks-not-working-after-uninstall
        try {
            await spawn("git", ["config", "--unset", "core.hooksPath"], {
                cwd: originCwd,
            });
            fs.rmSync(path.join(originCwd, ".husky/_"), {
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
                process.exit(1);
            }
        }

        const result = await spawn(
            "npm",
            [
                "exec",
                "simple-git-hooks",
                require.resolve(
                    "@forsakringskassan/commitlint-config/hooks.js",
                ),
            ],
            { cwd: process.env["INIT_CWD"] },
        );

        if (result.output.toLowerCase().includes("error")) {
            console.log(result.output);
            process.exit(1);
        }
        console.log(result.output);
    }
}

await setupGitHooks();

if (!isCI) {
    configureCommitTemplate();
}
