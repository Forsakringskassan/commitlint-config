import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import fs, { realpathSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import packageJson from "../package.json" with { type: "json" };

const rootDir = path.join(import.meta.dirname, "..");
const tarballName = `forsakringskassan-commitlint-config-${packageJson.version}.tgz`;
const tarball = path.join(rootDir, tarballName);

vi.setConfig({ testTimeout: 30_000 });

function hookFile(dir: string, file: string): string {
    return path.join(dir, ".git", "hooks", file);
}

describe("install (integration)", () => {
    let tempDir: string;
    const env: NodeJS.ProcessEnv = process.env;

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
        tempDir = path.join(realpathSync(os.tmpdir()), tempDirName);
        await mkdir(tempDir);

        env["CI"] = "false";

        run("git init");
        run("npm init -y");
    });

    afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    it("should install git hooks after manually running commitlint-config command", () => {
        expect.assertions(4);

        run(`npm install "${tarball}" --ignore-scripts`);
        const { stdout } = run("npm exec commitlint-config -- --debug");
        expect(stdout.replaceAll(tempDir, "<tempDir>")).toMatchSnapshot(
            "stdout",
        );

        const hooksDir = path.join(tempDir, ".git", "hooks");
        const hooks = fs
            .readdirSync(hooksDir)
            .filter((f) => !f.endsWith(".sample"));
        expect(hooks).not.toHaveLength(0);

        expect(
            fs.readFileSync(hookFile(tempDir, "commit-msg"), "utf8"),
        ).toMatchSnapshot("commit-msg");

        const preCommitContent = fs
            .readFileSync(hookFile(tempDir, "pre-commit"), "utf8")
            .replaceAll(tempDir, "<tempDir>");
        expect(preCommitContent).toMatchSnapshot("pre-commit");
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
        expect(fs.existsSync(hookFile(tempDir, "commit-msg"))).toBe(false);
        expect(fs.existsSync(hookFile(tempDir, "pre-commit"))).toBe(false);
    });

    it("should exit with error when not in a git repository and run via commitlint-config", () => {
        expect.assertions(2);

        // Simulate a non-git repository
        fs.rmSync(path.join(tempDir, ".git"), { recursive: true, force: true });

        run(`npm install "${tarball}"`);
        const result = run("npm exec commitlint-config -- --debug");

        expect(result.stderr).toContain("Failed to locate git directory");
        expect(result.status).not.toBe(0);
    });
});
