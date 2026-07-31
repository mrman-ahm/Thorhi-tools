import { access, readdir, stat } from "node:fs/promises";
import path from "node:path";

const NEXT_STATIC = ".next/static";
const PUBLIC = "public";
const MAX_FILE = 25 * 1024 * 1024;
const MAX_JS = 768 * 1024;
const MAX_CSS = 512 * 1024;
const MAX_COUNT = 20_000;

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function filesIn(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...(await filesIn(absolute)));
    if (entry.isFile()) output.push({ absolute, size: (await stat(absolute)).size });
  }
  return output;
}

const root = process.cwd();
const nextRoot = path.join(root, NEXT_STATIC);
const publicRoot = path.join(root, PUBLIC);

if (!(await exists(nextRoot))) {
  throw new Error(".next/static is missing. Run next build before readiness:check.");
}

const nextFiles = await filesIn(nextRoot);
const publicFiles = (await exists(publicRoot)) ? await filesIn(publicRoot) : [];
const files = [...nextFiles, ...publicFiles];
const failures = [];

if (files.length > MAX_COUNT) failures.push(`file count ${files.length} exceeds ${MAX_COUNT}`);

for (const file of files) {
  const relative = path.relative(root, file.absolute);
  const extension = path.extname(file.absolute).toLowerCase();
  if (file.size > MAX_FILE) failures.push(`${relative} exceeds 25 MiB`);
  if (file.absolute.startsWith(nextRoot) && extension === ".js" && file.size > MAX_JS) {
    failures.push(`${relative} exceeds 768 KiB`);
  }
  if (file.absolute.startsWith(nextRoot) && extension === ".css" && file.size > MAX_CSS) {
    failures.push(`${relative} exceeds 512 KiB`);
  }
}

if (failures.length > 0) {
  throw new Error(`Production readiness budgets failed:\n- ${failures.join("\n- ")}`);
}

console.log(
  `Production readiness budgets passed: ${nextFiles.length} emitted files, ${publicFiles.length} public files.`,
);
