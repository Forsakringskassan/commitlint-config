import type * as fsModule from "node:fs/promises";

export interface PackageJsonType {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    "simple-git-hooks"?: Record<string, string>;
}

export const nonAllowedPackages = ["husky", "simple-git-hooks", "lint-staged"];

export function invalidInstalledPackages(
    packageJson: PackageJsonType,
): boolean {
    const dependencies = new Set([
        ...Object.keys(packageJson.dependencies ?? {}),
        ...Object.keys(packageJson.devDependencies ?? {}),
    ]);

    for (const item of nonAllowedPackages) {
        if (dependencies.has(item)) {
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
            return true;
        }
    }
    return false;
}

export function existingSimpleGitConfig(packageJson: PackageJsonType): boolean {
    if ("simple-git-hooks" in packageJson) {
        console.error(
            `
                @forsakringskassan/commitlint-config
                You need to remove config in package.json for simple-git-hooks.

                npm pkg delete "simple-git-hooks"
            `,
        );
        return true;
    }

    return false;
}

export async function existingHuskyConfig(
    cwd: string,
    fs: Pick<typeof fsModule, "glob">,
): Promise<boolean> {
    const iterator = fs.glob(".husky/**/*", {
        exclude: [".husky/_/**"],
        cwd,
        withFileTypes: true,
    });
    for await (const ent of iterator) {
        /* ignore folders */
        if (!ent.isFile()) {
            continue;
        }

        console.error(
            `
                @forsakringskassan/commitlint-config
                You need to remove husky folder before installing this package.

                git rm -rf .husky
            `,
        );
        return true;
    }
    return false;
}
