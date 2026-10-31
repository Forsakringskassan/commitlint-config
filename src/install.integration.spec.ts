import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import packageJson from "../package.json" with { type: "json" };

const rootDir = path.join(import.meta.dirname, "..");
const tarballName = `forsakringskassan-commitlint-config-${packageJson.version}.tgz`;
const tarball = path.join(rootDir, tarballName);

const npmrc = [
    /* npm bails out on the "prepare" script in the tarball even when explicitly setting "allowScripts" in "package.json" */
    "strict-allow-scripts=false",

    /* need to install packages just built */
    "min-release-age=0",
].join("\n");

vi.setConfig({ testTimeout: 30_000 });

function hookFile(dir: string, file: string): string {
    return path.join(dir, ".git", "hooks", file);
}

describe("install (integration)", () => {
    let tempDir: string;
    const env: NodeJS.ProcessEnv = {
        ...process.env,

        /* Only log errors or fatal issues
         *
         * - older versions of npm logs warnings such as "unknown env config"
         * - npm 12 logs notices "npm notice run [..]"
         *
         * Both of these pollutes the output and fails tests verifying the
         * output.
         */
        /* eslint-disable-next-line camelcase -- upstream env variable */
        npm_config_loglevel: "error",
    };

    function run(command: string): {
        stdout: string;
        stderr: string;
        status: number | null;
    } {
        const result = spawnSync(command, {
            cwd: tempDir,
            env,
            encoding: "utf8",
            shell: true,
        });
        return {
            stdout: result.stdout,
            stderr: result.stderr,
            status: result.status,
        };
    }

    beforeEach(async () => {
        const tempDirName = randomBytes(16).toString("hex");
        const tmpRoot = await fs.realpath(os.tmpdir());
        tempDir = path.join(tmpRoot, tempDirName);
        await fs.mkdir(tempDir);

        env["CI"] = "false";

        run("git init");
        run("npm init -y");

        /* write a .npmrc file in the temp directory */
        await fs.writeFile(path.join(tempDir, ".npmrc"), npmrc, "utf8");
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it("should install git hooks after manually running commitlint-config command", async () => {
        expect.assertions(4);

        run(`npm install "${tarball}" --ignore-scripts`);
        const { stdout } = run("npm exec commitlint-config -- --debug");
        expect(stdout.replaceAll(tempDir, "<tempDir>")).toMatchSnapshot(
            "stdout",
        );

        const hooksDir = path.join(tempDir, ".git", "hooks");
        const files = await fs.readdir(hooksDir);
        const hooks = files.filter((f) => !f.endsWith(".sample"));
        expect(hooks).not.toHaveLength(0);

        const commitMsgContent = await fs.readFile(
            hookFile(tempDir, "commit-msg"),
            "utf8",
        );
        expect(commitMsgContent).toMatchSnapshot("commit-msg");

        const preCommitContent = await fs.readFile(
            hookFile(tempDir, "pre-commit"),
            "utf8",
        );
        expect(
            preCommitContent.replaceAll(tempDir, "<tempDir>"),
        ).toMatchSnapshot("pre-commit");
    });

    it("should not print any output by default", () => {
        expect.assertions(2);
        run(`npm install "${tarball}" --ignore-scripts`);
        const { stdout, stderr } = run("npm exec commitlint-config");
        expect(stdout.trim()).toMatchInlineSnapshot(`""`);
        expect(stderr.trim()).toMatchInlineSnapshot(`""`);
    });

    it("should print diagnostics when using --debug", () => {
        expect.assertions(2);
        run(`npm install "${tarball}" --ignore-scripts`);
        const { stdout, stderr } = run("npm exec commitlint-config -- --debug");
        expect(stdout.replaceAll(tempDir, () => "<tempDir>").trim())
            .toMatchInlineSnapshot(`
              "@forsakringskassan/commitlint-config
                
                Writing <tempDir>/.git/hooks/pre-commit
                Writing <tempDir>/.git/hooks/commit-msg
                git config commit.template node_modules/@forsakringskassan/commitlint-config/gitmessage
                Successfully installed gitmessage and git hooks."
            `);
        expect(stderr.trim()).toMatchInlineSnapshot(`""`);
    });

    it("should not create git hooks when commitlint-config runs in CI", () => {
        expect.assertions(3);

        env["CI"] = "true";

        run(`npm install "${tarball}"`);
        const { stderr } = run("npm exec commitlint-config -- --debug");

        expect(stderr).toBe("");
        expect(existsSync(hookFile(tempDir, "commit-msg"))).toBe(false);
        expect(existsSync(hookFile(tempDir, "pre-commit"))).toBe(false);
    });

    it("should exit with error when not in a git repository and run via commitlint-config", async () => {
        expect.assertions(2);

        // Simulate a non-git repository
        await fs.rm(path.join(tempDir, ".git"), {
            recursive: true,
            force: true,
        });

        run(`npm install "${tarball}"`);
        const result = run("npm exec commitlint-config -- --debug");

        expect(result.stderr).toContain("Failed to locate git directory");
        expect(result.status).not.toBe(0);
    });
});
