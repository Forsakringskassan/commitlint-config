#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const binary = fileURLToPath(import.meta.resolve("lint-staged/bin"));

/* eslint-disable-next-line sonarjs/no-os-command-from-path -- want to run git from PATH */
spawn("node", [binary, ...process.argv.slice(2)], {
    stdio: "inherit",
}).on("exit", (code) => {
    process.exit(code);
});
