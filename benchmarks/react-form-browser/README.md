# React Browser Benchmarks

Browser-backed speed and memory benchmarks for public React adapter workflows.

This package currently implements TanStack Form, React Hook Form, and Formik
sides of the benchmark matrix behind the same scenario interface.

## Commands

- `pnpm benchmark:react:browser:speed`
- `pnpm benchmark:react:browser:memory`
- `pnpm benchmark:react:browser:compare`
- `pnpm benchmark:react:browser:compare:open`
- `pnpm benchmark:react:browser:types`

The runners build a production Vite app and drive it through Playwright
Chromium. Results are written as per-variant shards under
`dist/results/speed/` and `dist/results/memory/`.

Run the speed and memory benchmarks before running the compare command. The
compare command reads the speed and memory shard directories, prints
side-by-side tables, writes `dist/results/compare.json`, and writes a standalone
chart report to `dist/results/compare.html`. Use `compare:open` to start a Vite
report server and open the chart report after generating it.

Ratios are calculated as comparison implementation divided by the baseline
implementation. Values below `1` mean the comparison implementation was
faster/smaller than the baseline; values above `1` mean it was slower/larger.

## Scenario Contracts

Shared scenario contracts live in `src/scenario-contracts.ts`. Each
implementation should render the same `data-bench-field`, `data-index`, and
`data-testid` markers and pass the same ready/after-run assertions before its
numbers are considered comparable.
