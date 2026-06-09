import { resolveInstallCwd, simpleGitHooksArgs } from "./install-hooks";

describe("simpleGitHooksArgs", () => {
    it("should run the simple-git-hooks CLI with the config path", () => {
        expect(simpleGitHooksArgs()).toEqual([
            expect.stringMatching(/[\\/]simple-git-hooks[\\/]cli\.js$/u),
            expect.stringMatching(/[\\/]hooks\.js$/u),
        ]);
    });
});

describe("resolveInstallCwd", () => {
    it("should prefer INIT_CWD when available", () => {
        expect(
            resolveInstallCwd(
                "/package/node_modules/config",
                "/consumer",
                null,
            ),
        ).toBe("/consumer");
    });

    it("should fall back to the git root when INIT_CWD is unavailable", () => {
        expect(
            resolveInstallCwd(
                "/consumer/node_modules/@forsakringskassan/commitlint-config",
                undefined,
                "/consumer",
            ),
        ).toBe("/consumer");
    });
});
