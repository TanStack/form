# @tanstack/preact-form

## 2.0.0-alpha.2

### Minor Changes

- [#2343](https://github.com/TanStack/form/pull/2343) [`532cba4`](https://github.com/TanStack/form/commit/532cba44680609577f75020918cdf264dadf51dd) - Feature: Specify default options for `createFormHook`

### Patch Changes

- [#2348](https://github.com/TanStack/form/pull/2348) [`4e37c69`](https://github.com/TanStack/form/commit/4e37c69b8acc1428149ece979ffe2ba3190c15d3) - Refactor: Adapter `formOptions`/`appFormOptions` no longer shim the core types and runtime.

  BREAKING: `formOptions.looseSchema` and `formOptions.strictSchema` now require a schema as
  first parameter. This locks down inference to get the best type safety out of it vs. the options object alone.

  Fix: `formOptions.looseSchema` now allows `defaultValues` to omit properties instead of
  requiring them to be explicitly undefined.

- [#2339](https://github.com/TanStack/form/pull/2339) [`c7e102b`](https://github.com/TanStack/form/commit/c7e102bcf134b12a402d6f80f6c3c63ce377a1e9) - Fix: Subscription selectors now infer tuple return values without requiring `as const`.

- Updated dependencies [[`532cba4`](https://github.com/TanStack/form/commit/532cba44680609577f75020918cdf264dadf51dd), [`4e37c69`](https://github.com/TanStack/form/commit/4e37c69b8acc1428149ece979ffe2ba3190c15d3), [`c7e102b`](https://github.com/TanStack/form/commit/c7e102bcf134b12a402d6f80f6c3c63ce377a1e9), [`63c9ea3`](https://github.com/TanStack/form/commit/63c9ea32b4efa95897e42a729406b89e0e92a708)]:
  - @tanstack/form-core@2.0.0-alpha.2

## 2.0.0-alpha.1

### Patch Changes

- Updated dependencies [[`547cbea`](https://github.com/TanStack/form/commit/547cbea2eebeb0b9ec8a6e9141d35fbf4d963429), [`46c12c7`](https://github.com/TanStack/form/commit/46c12c773932c0e7c89a2deb9c4aadd747973348), [`4341660`](https://github.com/TanStack/form/commit/43416603987c14a2c9435ba367488068805589a6), [`fc424c0`](https://github.com/TanStack/form/commit/fc424c072197e70549460ca221c687562d138b9b)]:
  - @tanstack/form-core@2.0.0-alpha.1

## 2.0.0-alpha.0

### Major Changes

- [#2288](https://github.com/TanStack/form/pull/2288) [`e68d53b`](https://github.com/TanStack/form/commit/e68d53b6882904f4606eae3481d11a0ca50ccd24) - Release the first alpha of TanStack Form v2.

### Patch Changes

- Updated dependencies [[`e68d53b`](https://github.com/TanStack/form/commit/e68d53b6882904f4606eae3481d11a0ca50ccd24)]:
  - @tanstack/form-core@2.0.0-alpha.0

## 1.30.3

### Patch Changes

- Updated dependencies []:
  - @tanstack/form-core@1.33.3

## 1.30.2

### Patch Changes

- Updated dependencies []:
  - @tanstack/form-core@1.33.2

## 1.30.1

### Patch Changes

- [#2206](https://github.com/TanStack/form/pull/2206) [`df52a12`](https://github.com/TanStack/form/commit/df52a12c8772cb025bfba6773c5ff0a488211662) - Re-export `useSelector` from TanStack Store adapters and document migration from deprecated `useStore` (fixes [#2203](https://github.com/TanStack/form/issues/2203)).

- Updated dependencies [[`3c57f6d`](https://github.com/TanStack/form/commit/3c57f6d4311f823ab39374417edb5fae544ad15a), [`7b3012b`](https://github.com/TanStack/form/commit/7b3012b03e706cc409c2952964145a11a300d7fe), [`741da6b`](https://github.com/TanStack/form/commit/741da6bb659a319acaa55292564999fcbbc90012), [`3c57f6d`](https://github.com/TanStack/form/commit/3c57f6d4311f823ab39374417edb5fae544ad15a), [`6cd477a`](https://github.com/TanStack/form/commit/6cd477a97df9612019d8a2d9c97f2e86b1b59256), [`887a129`](https://github.com/TanStack/form/commit/887a1293375a168452e82b0fb482841ec02ad77f)]:
  - @tanstack/form-core@1.33.1

## 1.30.1

### Patch Changes

- Re-export `useSelector` from `@tanstack/preact-store` (fixes [#2203](https://github.com/TanStack/form/issues/2203)). `useStore` remains available but is deprecated.

## 1.30.0

### Minor Changes

- [#2128](https://github.com/TanStack/form/pull/2128) [`808f158`](https://github.com/TanStack/form/commit/808f158b62c08f69689a7b652c35989d717f9014) - Added FormGroup API

### Patch Changes

- Updated dependencies [[`808f158`](https://github.com/TanStack/form/commit/808f158b62c08f69689a7b652c35989d717f9014)]:
  - @tanstack/form-core@1.33.0

## 1.29.8

### Patch Changes

- Updated dependencies [[`b402d7a`](https://github.com/TanStack/form/commit/b402d7ab134adca0d0d4647af12fde9b490c08f7), [`d0d941d`](https://github.com/TanStack/form/commit/d0d941dc1a4bd4ac15bb38a9ca1b4a863a3f418e)]:
  - @tanstack/form-core@1.32.1

## 1.29.7

### Patch Changes

- re-render arrays when length doesn't change but values do ([#2172](https://github.com/TanStack/form/pull/2172))

- Updated dependencies [[`5dd1ed4`](https://github.com/TanStack/form/commit/5dd1ed4e9eb0fb9c3f8909dfb58236c07c27739d), [`556e35e`](https://github.com/TanStack/form/commit/556e35e30ad75f536ae253960a371c32ae138e29), [`427b3d9`](https://github.com/TanStack/form/commit/427b3d9fd516b8222339ae7e8e38844f198c5d7a), [`01f51b5`](https://github.com/TanStack/form/commit/01f51b54f551e1cb052b222652fbf6e05c9f2b44), [`4d250c0`](https://github.com/TanStack/form/commit/4d250c0c10433484ba6f622d94ca1a56bd0768d0)]:
  - @tanstack/form-core@1.32.0

## 1.29.6

### Patch Changes

- Updated dependencies []:
  - @tanstack/form-core@1.31.0

## 1.29.5

### Patch Changes

- Updated dependencies []:
  - @tanstack/form-core@1.30.0

## 1.29.4

### Patch Changes

- Initial release of Preact adapter ([#2148](https://github.com/TanStack/form/pull/2148))
