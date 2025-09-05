import { createFsFromVolume, vol } from "memfs";

type NodeFs = typeof import("node:fs");

import {
    invalidInstalledPackages,
    packageJsonType,
    existingSimpleGitConfig,
    existingHuskyConfig,
} from "./verifyPackage";

let consoleErrorSpy: jest.SpyInstance;

beforeEach(() => {
    consoleErrorSpy = import.meta.jest
        .spyOn(console, "error")
        .mockImplementation();
});

afterEach(() => {
    consoleErrorSpy.mockRestore();
});

describe("invalidInstalledPackages", () => {
    it("should return false if package contains no dependencies", () => {
        let packageJson: packageJsonType = {};
        expect(invalidInstalledPackages(packageJson)).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();

        packageJson = { dependencies: {}, devDependencies: {} };
        expect(invalidInstalledPackages(packageJson)).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should return false if no non-allowed packages are present", () => {
        const packageJson: packageJsonType = {
            dependencies: {
                a: "18.0.0",
                b: "18.0.0",
            },
            devDependencies: {
                c: "4.5.0",
            },
        };
        expect(invalidInstalledPackages(packageJson)).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should return true if a non-allowed package is in dependencies", () => {
        const packageJson: packageJsonType = {
            dependencies: {
                husky: "7.0.0",
            },
            devDependencies: {},
        };
        expect(invalidInstalledPackages(packageJson)).toBe(true);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining(`You need to remove package husky`),
        );
    });

    it("should return true if a non-allowed package is in devDependencies", () => {
        const packageJson: packageJsonType = {
            devDependencies: {
                "simple-git-hooks": "7.0.0",
            },
            dependencies: {},
        };
        expect(invalidInstalledPackages(packageJson)).toBe(true);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                `You need to remove package simple-git-hooks`,
            ),
        );
    });
});

describe("existingSimpleGitConfig", () => {
    it('should return false if "simple-git-hooks" is not in package.json', () => {
        const packageJson: packageJsonType = {
            dependencies: {
                react: "18.0.0",
            },
            devDependencies: {
                typescript: "4.5.0",
            },
        };
        expect(existingSimpleGitConfig(packageJson)).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should return true and log error if "simple-git-hooks" is present in package.json', () => {
        const packageJson: packageJsonType = {
            dependencies: {},
            devDependencies: {},
            "simple-git-hooks": {
                "pre-commit": "lint-staged",
            },
        };
        expect(existingSimpleGitConfig(packageJson)).toBe(true);
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
});

describe("existingHuskyConfig", () => {
    let fs: NodeFs;
    beforeEach(() => {
        vol.reset();
        fs = createFsFromVolume(vol) as unknown as NodeFs;
    });

    it("should return true if husky folder exists", async () => {
        vol.fromJSON({
            "package.json": JSON.stringify({ name: "mock-package" }),
            ".husky/precommit": "...",
            ".husky/_/.gitignore": "",
        });

        expect(await existingHuskyConfig("./", fs)).toBe(true);
        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("should return false if no husky folder exists", async () => {
        vol.fromJSON({
            "package.json": JSON.stringify({ name: "mock-package" }),
        });

        expect(await existingHuskyConfig("./", fs)).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("Husky internal files should be ignored, they are later removed in postinstall script", async () => {
        vol.fromJSON({
            "package.json": JSON.stringify({ name: "mock-package" }),
            ".husky/_/.gitignore": "",
            ".husky/_/pre-commit": "...",
        });

        expect(await existingHuskyConfig("./", fs)).toBe(false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
});
