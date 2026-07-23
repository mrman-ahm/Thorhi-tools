import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const files = readdirSync("tests")
  .filter(file => file.endsWith(".test.mjs"))
  .sort();

for (const file of files) {
  const path = join("tests", file);
  const result = spawnSync(process.execPath, ["--test", "--test-reporter=spec", path], {
    encoding: "utf8",
    env: process.env
  });

  if (result.status !== 0) {
    console.error(`FAILED_FILE=${path}`);
    if (result.stdout) console.error(result.stdout);
    if (result.stderr) console.error(result.stderr);
    process.exit(result.status ?? 1);
  }
}

console.log(`PASS ${files.length} unit test files`);
