# Audit — `@lambdulus/core`

Date: 2026-09-04. Audited from repo HEAD (`aa0a775`, Oct 2022). Verified by reading `package.json`, `tsconfig.json`, `src/`, `.github/`, git log/branches/ls-files.

## 1. What it is

TypeScript library implementing the lambda-calculus engine behind Lambdulus: lexer → parser → AST → reducers/reductions → evaluators (normal, applicative, abstraction, simplified, optimize) → visitors (printing, free/bound vars). `src/index.ts` is the public entry point; `src/repl.ts` is a stdin REPL; `src/test.ts` is a manual dev script (not a test suite). ~47 `.ts` files. MIT licensed. Consumed by frontend as `@lambdulus/core ^0.0.8` from npm.

## 2. Structure (`src/`)

- `lexer/` (counter, errors, lexer, position, token), `parser/` (parser + macro table / builtin macros), `ast/` (application, lambda, variable, macro, churchnumeral), `reducers/` + `reductions/` (alpha/beta/eta/gamma/expansion/none), `evaluators/` (5 strategies), `visitors/` (basicprinter, bounding/freevars/usedvarnames/varbindfinder), plus `decoder.ts`, `index.ts`, `repl.ts`, `test.ts`.
- Health notes: 30+ `TODO/FIXME` comments (several in Czech, several years old); `visitors/varbindfinder.ts` is marked `DELETE` in its own header; `test.ts`/`repl.ts` contain large commented-out blocks and hardcoded macro tables duplicated in both files; `index.ts` itself carries TODOs about export organization.

## 3. Dependencies / build

- `package.json`: version `0.0.8`, zero runtime dependencies. Single devDependency: `@types/node ^12.20.33` (Node 12 types — EOL since 2022).
- `tsconfig.json`: `target es6`, `module commonjs`, `strict: true`, `declaration: true`, out to `dist/`. Sane for a library of this era.
- Scripts: `build` = `rm -rf ./dist/ ; rm tsbuildinfo ; tsc` (Unix-only, no `rimraf`), `test` = build + `node dist/test.js`, `bench`, `repl` similarly. No lint, no format, no test runner.
- `package-lock.json` is stale: it still says version `0.0.7` while `package.json` says `0.0.8`.
- Toolchain risk: everything predates modern Node (verified env runs Node 24 / npm 11). `@types/node@12` + global-`tsc` workflow may still compile, but types and stdlib assumptions are 4+ years old.

## 4. Tests — effectively none

- There is no test framework (no jest/mocha/vitest), no `*.test.*` / `*.spec.*` files, no coverage.
- `npm test` just builds and runs `dist/test.js`, which unconditionally "passes" (exit 0 unless it crashes). Its `testValids()`/`testInvalids()` functions are defined but their invocations are **commented out**; the live path only tokenizes/parses/evaluates `valids[0]` (`Y FACT 6`) with `NormalEvaluator` and prints the result. A regression that breaks parsing of any other input would still exit 0.
- One invalid case is even annotated `TODO: fail on too much recursion or heap out of memory`, i.e. a known crash vector with no guard.

## 5. CI (`.github/workflows/nodejs.yml`)

- Trigger: `on: [push]` (every branch). Matrix: Node `8.x, 10.x, 12.x` — all EOL. Steps: `actions/checkout@v1` + `actions/setup-node@v1` (both EOL/vulnerable), then `npm i -g typescript; npm i; tsc` with `CI: true`.
- Problems: installs an **unpinned global** `typescript` instead of the project's compiler (there is none declared), so the compiled output depends on whatever `latest` happened to be; no `npm ci`, no caching, no test step (consistent with §4 — there is nothing to run), no publish step (publishing to npm is manual, matching the "bump the versions when publishing" commits).

## 6. Repo hygiene issues

- **`dist/` is committed to git** (94 tracked files under `dist/` per `git ls-files`), even though commit `890fe1c` says "stop including dist". `.gitignore` ignores only `node_modules`, `tsbuildinfo`, `.vscode` — not `dist/` — and `.npmignore` likewise omits it. Result: stale Oct-2022 build output checked in alongside source; guaranteed merge noise and risk that consumers read stale `.d.ts`.
- Stale branches `dynamic-macros`, `simplified-strategy` unmerged; matching TODOs (`@dynamic-macros`) scattered in the parser suggest in-flight features that never landed.
- `README.md` documents only the SLI shorthand syntax. Nothing about install/build/test/publish, API surface, evaluator strategies, or the REPL.
- 36 `console.log` calls in `src/` (mostly the dev script, but still shipped source).

## 7. Prioritized cleanup

1. **Decide the `dist/` policy and enforce it.** Either untrack it (`git rm -r --cached dist`, add `dist/` to `.gitignore`, publish from CI) or keep it and document why. Today the repo says one thing and does the other. (P0 — source of stale-artifact bugs.)
2. **Replace `test.ts` with a real test suite.** Add jest or vitest, convert the `valids`/`invalids` arrays into asserting tests (parse succeeds/fails, evaluator reaches normal form in N steps), wire `npm test` to it, and run it in CI. Keep `repl.ts` as a dev tool, not a test. (P0 — currently zero regression protection for teaching material.)
3. **Modernize CI minimally:** `checkout@v4` + `setup-node@v4`, matrix on Node 20/22, pin `typescript` as a devDependency, `npm ci` + `npm test`. Drop Node 8/10/12. (P1 — current workflow likely fails or builds with a random compiler.)
4. **Sync versioning/lockfile:** regenerate `package-lock.json` at 0.0.8, add `prepack`/`prepublishOnly` build so published tarballs always match `src/`. Consider automated `npm publish` on tags. (P1.)
5. **Pay down the small debt:** delete `varbindfinder.ts` (or unmark it), dedupe the macro tables shared by `test.ts`/`repl.ts`, resolve or file the parser TODOs, add README sections for build/test/API/evaluators. Portable `build` script (`rimraf` or `tsc --build --clean`). (P2.)
