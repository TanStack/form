# React Browser Benchmarks

Browser-backed speed and memory benchmarks for public React adapter workflows.

This package currently implements the TanStack Form and React Hook Form sides of
the benchmark matrix. Formik can be added later behind the same scenario
interface.

## Commands

- `pnpm benchmark:react:browser:speed`
- `pnpm benchmark:react:browser:memory`
- `pnpm benchmark:react:browser:compare`
- `pnpm benchmark:react:browser:compare:open`
- `pnpm benchmark:react:browser:types`

The runners build a production Vite app and drive it through Playwright
Chromium. Results are written to `dist/results/`.

Run the speed and memory benchmarks before running the compare command. The
compare command reads `dist/results/speed.json` and `dist/results/memory.json`,
prints side-by-side tables, writes `dist/results/compare.json`, and writes a
standalone chart report to `dist/results/compare.html`. Use `compare:open` to
start a Vite report server and open the chart report after generating it.

Ratios are calculated as comparison implementation divided by the baseline
implementation. Values below `1` mean the comparison implementation was
faster/smaller than the baseline; values above `1` mean it was slower/larger.

## Scenario Contracts

Shared scenario contracts live in `src/scenario-contracts.ts`. Each
implementation should render the same `data-bench-field`, `data-index`, and
`data-testid` markers and pass the same ready/after-run assertions before its
numbers are considered comparable.
