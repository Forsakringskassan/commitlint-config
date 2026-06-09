/* eslint-disable sonarjs/no-os-command-from-path -- Static command */
import { execSync } from "node:child_process";

const rootDir = import.meta.dirname;

export async function setup() {
    // eslint-disable-next-line camelcase -- npm setting
    const env = { ...process.env, npm_config_ignore_scripts: undefined };
    execSync("npm run build", { cwd: rootDir, stdio: "inherit", env });
    execSync("npm pack", { cwd: rootDir, stdio: "inherit", env });
}
