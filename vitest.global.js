/* eslint-disable sonarjs/no-os-command-from-path -- Static command */
import { execSync } from "node:child_process";

const rootDir = import.meta.dirname;

export async function setup() {
    execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
    execSync("npm pack", { cwd: rootDir, stdio: "inherit" });
}
