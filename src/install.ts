import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import spawn from "nano-spawn";
import isCI from "is-ci";

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

if (!isCI) {
    configureCommitTemplate();

    const originCwd: string = process.env["INIT_CWD"] || "";

    // Fail install if user already has git hook addon or lint-staged.
    const nonAllowedPackages = ["husky", "simple-git-hooks", "lint-staged"];
    const packageJson = JSON.parse(
        await readFile(path.join(originCwd, "package.json"), {
            encoding: "utf-8",
        }),
    );

    const dependencies = [
        ...Object.keys(packageJson.dependencies),
        ...Object.keys(packageJson.devDependencies),
    ];
    for (const item of nonAllowedPackages) {
        if (item in dependencies) {
            console.error(
                `
                @forsakringskassan/commitlint-config
                You need to remove package ${item} before installing this package.

                Unallowed dependencies:
                ${nonAllowedPackages.join(" ")}

                Command to uninstall:
                npm uninstall ${nonAllowedPackages.join(" ")}
                `,
            );
            process.exit(1);
        }
    }

    const result = await spawn(
        "npm",
        [
            "exec",
            "simple-git-hooks",
            require.resolve("@forsakringskassan/commitlint-config/hooks.js"),
        ],
        { cwd: process.env["INIT_CWD"] },
    );
    console.log(result.output);
}
