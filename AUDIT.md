# Audit — `@lambdulus/core`

Date: 2026-09-07. Audited from `fix/version-0.0.9` HEAD (`5d686f1`). Verified by reading `package.json`, `package-lock.json`, `tsconfig.json`, `src/`, `.github/workflows/nodejs.yml`, `README.md`, git log/status/ls-files, plus `npm outdated`, `npm audit`, `npm test` (99 passed).

Supersedes the 2026-09-04 audit (v0.0.8 era: no test runner, EOL CI, committed `dist/`, stale lockfile). Nearly all of its cleanup list has since landed.

## 1. What it is

TypeScript library implementing the lambda-calculus engine behind Lambdulus: lexer → parser → AST → reducers/reductions → evaluators (normal, applicative, abstraction, simplified, optimize) → visitors (printing, free/bound vars). `src/index.ts` is the public entry; `src/repl.ts` is a stdin dev REPL; `src/expressions.test.ts` is the vitest suite (every valid example must parse, every invalid one must throw). ~47 `.ts` files, zero runtime dependencies. MIT licensed. Version `0.0.9`.

Consumption note: frontend takes it via **git tag** (`@lambdulus/core#v0.0.9`), not the npm registry — README's "from npm" line (§6) is the one stale sentence left. Moves only on manual tag bumps; pin matches today, no drift.

## 2. Structure (`src/`)

`lexer/`, `parser/` (+ macro table / builtin macros), `ast/`, `reducers/` + `reductions/`, `evaluators/` (5 strategies), `visitors/`, plus `decoder.ts`, `macros.ts`, `index.ts`, `repl.ts`, `expressions.test.ts`. The old audit's specific corpses are gone: manual `test.ts` replaced by the asserting suite, `varbindfinder.ts` (marked DELETE) deleted. `console.log` survives in 1 file, `TODO`/`FIXME` markers in 20 — triage fodder, mostly old Czech notes and parser what-ifs.

## 3. Dependencies / build

- Dev-only toolchain: `@types/node ^22`, `rimraf ^5`, `typescript ^5.4`, `vite ^6` (hosts vitest), `vitest ^5`. `npm audit`: **0 vulnerabilities.** `npm outdated`: all current within range; only opt-in majors (TS 7, Vite 8, rimraf 6).
- Scripts are portable now (`rimraf`, no bare `rm`); `prepare`/`prepack` rebuild `dist/` so published tarballs always match `src/`; test files excluded from emit via tsconfig. `package-lock.json` in sync at `0.0.9`.
- `tsconfig` is still `target es6` / `module commonjs`, strict, declarations on — dated output target for a zero-dependency lib, but a deliberate compat choice, not a bug. Revisit only alongside a major TS bump.

## 4. Tests — real now

99 vitest tests, all passing, run in CI (`npm test`). This closes the old audit's P0: regressions in parsing/evaluation no longer exit 0 silently.

## 5. CI (`.github/workflows/nodejs.yml`)

Trigger on push + PR, matrix Node 20/22, `npm ci` + `npm run build` + `npm test` with npm cache. Bumped to `actions/checkout@v5` + `actions/setup-node@v5` in this pass (same Node-20-runtime deprecation as frontend). Matrix floor 20 matches README's "Requires Node 20+" — no contradiction. No publish step; npm publishing stays manual, which matches the tag-bump release flow.

## 6. Repo hygiene

- **`dist/` policy resolved:** untracked (`869c50c`), gitignored alongside `tsbuildinfo`, rebuilt on demand. The old P0 is closed.
- README covers install/build/test/REPL/CI/publishing/API — except the one stale "consumed from npm" sentence (§1).
- No lint/format config (same as frontend — a shared config for both repos would be the tidy move).

## 7. Prioritized cleanup

1. **Fix the README consumption line** (git tag, not npm). (P2, one sentence.)
2. **Triage the 20 files with TODO/FIXME** — file or delete; several predate the parser-decision lockdowns (#19, #20) and may already be answered. (P2.)
3. **Shared lint/format config** with frontend. (P2.)
4. **Opt-in majors** (TS 7, Vite 8) only when frontend's matching upgrade pass happens — keep the two toolchains in step. (P3, scheduled.)
