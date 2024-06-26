import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
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
}
