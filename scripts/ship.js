/* eslint-disable @typescript-eslint/no-require-imports */

const { spawnSync } = require("node:child_process");

const commitMessage = process.argv.slice(2).join(" ").trim();

function logStep(message) {
  console.log(`\n▶ ${message}`);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.status !== 0) {
    console.error(`\n✖ Failed: ${command} ${args.join(" ")}`);
    process.exit(result.status || 1);
  }
}

function runCapture(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout || `Failed: ${command} ${args.join(" ")}`);
    process.exit(result.status || 1);
  }

  return result.stdout || "";
}

if (!commitMessage) {
  console.error('Usage: npm.cmd run ship -- "Commit message"');
  process.exit(1);
}

logStep("Running typecheck");
run("npm.cmd", ["run", "typecheck"]);

logStep("Running lint");
run("npm.cmd", ["run", "lint"]);

logStep("Running build");
run("npm.cmd", ["run", "build"]);

logStep("Checking git status");
const status = runCapture("git", ["status", "--short"]);
console.log(status || "Working tree clean");

const envLocalPattern = /(^|\n)[ MADRCU?!]{1,2}\s+\.env\.local(\n|$)/;

if (envLocalPattern.test(status)) {
  console.error("\n✖ .env.local appears in git status. Remove it from tracking before shipping.");
  console.error("Check .gitignore and run: git rm --cached .env.local");
  process.exit(1);
}

logStep("Staging changes");
run("git", ["add", "."]);

logStep("Creating commit");
run("git", ["commit", "-m", commitMessage]);

logStep("Pushing to GitHub");
run("git", ["push"]);

console.log("\n✓ Ship complete. Vercel should deploy from the pushed branch.");
