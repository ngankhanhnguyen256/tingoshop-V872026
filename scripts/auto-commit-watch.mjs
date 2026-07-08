#!/usr/bin/env node
/**
 * Auto-commit watcher: monitors src/ for file changes and
 * auto-commits them to the local git repo every few seconds.
 *
 * This handles the commit side. Pushing to GitHub is done via
 * the GitHub MCP API (push_files / create_or_update_file) since
 * no GITHUB_TOKEN is available in this environment for git push.
 *
 * Usage: node scripts/auto-commit-watch.mjs
 */
import { watch, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();
const WATCH_DIRS = ["src", "supabase/migrations", "public"];
const DEBOUNCE_MS = 3000;
const IGNORE = [".output", ".nitro", ".tanstack", "node_modules", ".git", ".wrangler", ".vercel"];

let pendingTimer = null;
let changedFiles = new Set();

function getAllFiles(dir, base = dir) {
  let results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (IGNORE.some((p) => full.includes(p))) continue;
      const stat = statSync(full);
      if (stat.isDirectory()) {
        results = results.concat(getAllFiles(full, base));
      } else {
        results.push(relative(ROOT, full));
      }
    }
  } catch {}
  return results;
}

function doCommit() {
  if (changedFiles.size === 0) return;
  const files = [...changedFiles];
  changedFiles.clear();

  try {
    execSync(`git add -A`, { stdio: "pipe" });
    const status = execSync(`git status --porcelain`, { encoding: "utf-8" }).trim();
    if (!status) return;

    const fileList = files.slice(0, 5).join(", ");
    const suffix = files.length > 5 ? ` (+${files.length - 5} more)` : "";
    const msg = `auto-sync: ${fileList}${suffix}`;
    execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { stdio: "pipe" });
    console.log(`[auto-commit] committed: ${msg}`);
  } catch (e) {
    // ignore commit errors (nothing to commit, etc.)
  }
}

function scheduleCommit() {
  if (pendingTimer) clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    doCommit();
  }, DEBOUNCE_MS);
}

function watchDir(dir) {
  try {
    const watcher = watch(dir, { recursive: true }, (event, filename) => {
      if (!filename) return;
      const fullPath = join(dir, filename);
      const rel = relative(ROOT, fullPath);
      if (IGNORE.some((p) => rel.includes(p))) return;
      changedFiles.add(rel);
      scheduleCommit();
    });
    console.log(`[auto-commit] watching: ${dir}`);
  } catch (e) {
    console.error(`[auto-commit] failed to watch ${dir}:`, e.message);
  }
}

console.log("[auto-commit] watcher started");
WATCH_DIRS.forEach((d) => {
  try {
    statSync(join(ROOT, d));
    watchDir(join(ROOT, d));
  } catch {}
});

// Also watch config files in root
try {
  watch(join(ROOT), (event, filename) => {
    if (!filename) return;
    if (IGNORE.some((p) => filename.includes(p))) return;
    if (/\.(ts|tsx|js|mjs|json|jsonc|css|md|sql)$/.test(filename)) {
      changedFiles.add(filename);
      scheduleCommit();
    }
  });
  console.log("[auto-commit] watching: root config files");
} catch {}

// Handle process exit
process.on("SIGINT", () => {
  doCommit();
  process.exit(0);
});
process.on("SIGTERM", () => {
  doCommit();
  process.exit(0);
});
