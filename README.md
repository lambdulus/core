# This is Core module of project Lambdulus

[![Node CI](https://github.com/lambdulus/core/actions/workflows/nodejs.yml/badge.svg)](https://github.com/lambdulus/core/actions/workflows/nodejs.yml)

The lambda-calculus engine behind Lambdulus: lexer, parser, AST,
reducers, step-by-step evaluators, and AST visitors. Consumed by
`@lambdulus/frontend` as `@lambdulus/core` from npm.

## Development

Requires Node 20+.

- `npm ci` — install dependencies
- `npm run build` — typecheck and emit to `dist/` (regenerated, never committed)
- `npm test` — run the vitest suite (`src/expressions.test.ts`: every valid
  example must parse, every invalid one must throw)
- `npm run repl` — stdin REPL: type an expression per line, watch it normalize

CI (`.github/workflows/nodejs.yml`) runs build + tests on Node 20 and 22
for every push and pull request.

## Publishing

`dist/` is rebuilt automatically on `npm run prepack`, so `npm publish`
always ships code matching `src/`. Bump `version` in `package.json` and
regenerate the lockfile when releasing.

## API overview

- `lexer`: `tokenize(input, { singleLetterVars, lambdaLetters, macromap })`
- `parser`: `parse(tokens, macromap)`, `builtinMacros`, `MacroTable`
- `ast`: `Application`, `Lambda`, `Variable`, `Macro`, `ChurchNumeral`
- `evaluators`: `NormalEvaluator`, `ApplicativeEvaluator`,
  `NormalAbstractionEvaluator`, `OptimizeEvaluator` (plus the simplified
  normal evaluator) — each exposes `nextReduction` and `perform()` for
  single-stepping
- `reducers` / `reductions`: alpha, beta, eta, gamma, expansion, none
- `visitors`: `BasicPrinter`, `FreeVarsFinder`, `BoundingFinder`,
  `UsedVarNamesFinder`
- `macros.ts`: `demoMacroTable`, the demo macro table shared by the REPL
  (the test suite deliberately uses a smaller table — extra entries change
  how expressions lex)

## Documentation of some features (will be growing with time)

### SLI - Single Letter Identifiers

Lambdulus allows shorthand syntax for quicker typing. It looks for example like this:
`(λ x y z . y z x)`.

This is known as MultiLambda. This convention is purely syntactic sugar. It is simplification for:
`(λ x . (λ y . (λ z . (y z x) )))`.

Hovewer this example can be written in even shorter way. With SLI enabled we can write it like:
`(λxyz.yzx)`
It means the same thing - this whitespace-omitting practice originated from the times teachers and students of PPA used to write on white-boards.
On the white-board there is no simple way to properly write whitespaces - so we used to omit them altogether.

### SLI - Rules:

- identifier in SLI mode can be :
  - single alphabetic character like: `a` or `b` in following expression: `+ a b`
  - it can also be single character followed be single numeric literal like `c2`
  - it can be sequence of alphabetic characters - like `abc` then it is understood like `a b c`
  - it can also be sequence of alphanumeric characters -
  in that case each numeric character must be preceeded by at least one alphabetic character
  and there must not be more than one numeric character standing immediately next to other -
  example of valid expression: `A1BB2C3DDD` - it is understood as: `A1 B B2 C3 D D D`
  
  Hovewer, Lambdulus also implements Macros - known abstractions. They are typically named with all upper-case letters.
  Like: `ZERO` or `PREV` and so on. These are also available in SLI mode.
  
  To succesfully use multi-char Macros in SLI mode they must be followed by whitespace. For example: `ZERO 0` is valid SLI expression
  utilising Macro `ZERO`.
  
  On the other hand expression `ZEROZERO 0` is not understood as `ZERO ZERO 0` but as `Z E R O Z E R O 0`.
  
  Same goes for expressions as `ZERO1ZERO2 0`. It is understood as `Z E R O1 Z E R O2 0`.
  
  Finally expressions as `ZERO12ZERO 0` would be understood as `Z E R O12 Z E R O 0` - which is syntacticaly incorrect - because of two numeric characters following letter O.
  This will result in syntax error.
