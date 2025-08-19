import path from "node:path";

export interface packageJsonType {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    "simple-git-hooks"?: Record<string, string>;
}

export const nonAllowedPackages = ["husky", "simple-git-hooks", "lint-staged"];

export function invalidInstalledPackages(
    packageJson: packageJsonType,
): boolean {
    const dependencies = [
        ...Object.keys(packageJson.dependencies ?? {}),
        ...Object.keys(packageJson.devDependencies ?? {}),
    ];

    for (const item of nonAllowedPackages) {
        if (dependencies.includes(item)) {
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

export function existingSimpleGitConfig(packageJson: packageJsonType): boolean {
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
    fileSystem: typeof import("node:fs/promises"),
): Promise<boolean> {
    try {
        await fileSystem.stat(path.join(cwd, ".husky"));
        console.error(
            `
                @forsakringskassan/commitlint-config
                You need to remove husky folder before installing this package.

                git rm -rf .husky
            `,
        );
        return true;
    } catch {
        /* no husky config */
    }

    return false;
}
