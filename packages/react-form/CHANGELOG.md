# @tanstack/react-form

## 1.27.6

### Patch Changes

- Updated dependencies [[`c526378`](https://github.com/TanStack/form/commit/c5263786ed8b12144837ddb87f43c87fa4efc2d4)]:
  - @tanstack/form-core@1.27.6

## 1.27.5

### Patch Changes

- Updated dependencies [[`36fa503`](https://github.com/TanStack/form/commit/36fa503f21c59e68138a21de7038bf941a579b55), [`01b24a9`](https://github.com/TanStack/form/commit/01b24a9aa54f7d908830af352cacd51fddf65bbe)]:
  - @tanstack/form-core@1.27.5

## 1.27.4

### Patch Changes

- fix(react-form): prevent array field re-render when child property changes ([#1930](https://github.com/TanStack/form/pull/1930))

  Array fields with `mode="array"` were incorrectly re-rendering when a property on any array element was mutated. This was a regression introduced in v1.27.0 by the React Compiler compatibility changes.

  The fix ensures that `mode="array"` fields only re-render when the array length changes (items added/removed), not when individual item properties are modified.

  Fixes #1925

- Updated dependencies [[`c753d5e`](https://github.com/TanStack/form/commit/c753d5eca5021c231bcdfd5f0a337156958fcde1)]:
  - @tanstack/form-core@1.27.4

## 1.27.3

### Patch Changes

- Updated dependencies [[`c2ecf5d`](https://github.com/TanStack/form/commit/c2ecf5d6df0034d2db982f9b55aed963d94a76a3)]:
  - @tanstack/form-core@1.27.3

## 1.27.2

### Patch Changes

- use React 18's useId hook by default for formId generation, only calling Math.random() as a fallback if no formId is provided. ([#1913](https://github.com/TanStack/form/pull/1913))

- fix(react-form): ensure `FormApi.handleSubmit` returns a promise again ([#1924](https://github.com/TanStack/form/pull/1924))

- Updated dependencies []:
  - @tanstack/form-core@1.27.2

## 1.27.1

### Patch Changes

- Fix issues with methods not being present in React adapter ([#1903](https://github.com/TanStack/form/pull/1903))

- Updated dependencies [[`3b080ec`](https://github.com/TanStack/form/commit/3b080ec1faefa9894c0f73880dbff680888e6a9a)]:
  - @tanstack/form-core@1.27.1

## 1.27.0

### Patch Changes

- Minorly improve performance and fix issues with Start ([#1882](https://github.com/TanStack/form/pull/1882))

- Fixed issues with React Compiler ([#1893](https://github.com/TanStack/form/pull/1893))

- Remove useId for react 17 user compatibility, replaced with uuid ([#1850](https://github.com/TanStack/form/pull/1850))

- Updated dependencies [[`8afbfc3`](https://github.com/TanStack/form/commit/8afbfc39d7373ec2b516f7c8ff5585ca44098cc1), [`4e92a91`](https://github.com/TanStack/form/commit/4e92a913e109f54463be572cdc3f09232e9d2701)]:
  - @tanstack/form-core@1.27.0

## 1.26.0

### Patch Changes

- Updated dependencies [[`74f40e7`](https://github.com/TanStack/form/commit/74f40e7d0a862dcb4dbda3481b3a23482883a0a2)]:
  - @tanstack/form-core@1.26.0

## 1.25.0

### Minor Changes

- Update Start to Release Candidate version. Extracted start, remix and nextJs adapters to the respective libraries @tanstack/react-form-start, @tanstack/react-form-remix, and @tanstack/react-form-nextjs, ([#1771](https://github.com/TanStack/form/pull/1771))

### Patch Changes

- Updated dependencies [[`004835f`](https://github.com/TanStack/form/commit/004835fbc113f36ac32fc5691ad27bc00813f389)]:
  - @tanstack/form-core@1.25.0

## 1.23.9

### Patch Changes

- Updated dependencies [[`8ede6d0`](https://github.com/TanStack/form/commit/8ede6d0bb5615a105f54c13d3160d0243ea6c041)]:
  - @tanstack/form-core@1.24.5

## 1.23.8

### Patch Changes

- Allow interfaces to be assigned to `withFieldGroup`'s `props`. ([#1816](https://github.com/TanStack/form/pull/1816))

- Allow returning all other `ReactNode`s not just `JSX.Element` in the `render` function of `withForm` and `withFieldGroup`. ([#1817](https://github.com/TanStack/form/pull/1817))

- form-core: Optimise event client emissions and minor layout tweaks ([#1758](https://github.com/TanStack/form/pull/1758))

- Updated dependencies [[`94631cb`](https://github.com/TanStack/form/commit/94631cb97dea611de69a900c89b7e8dfe0eeee37)]:
  - @tanstack/form-core@1.24.4

## 1.23.7

### Patch Changes

- Updated dependencies [[`33cce81`](https://github.com/TanStack/form/commit/33cce812cbfeb42aa7457bab220a807ff5c4ba7f)]:
  - @tanstack/form-core@1.24.3: respect dontValidate option in formApi array modifiers ([#1775](https://github.com/TanStack/form/pull/1775))

## 1.23.6

### Patch Changes

- Updated dependencies [[`74af33e`](https://github.com/TanStack/form/commit/74af33eb80218b8cec8642b64ce7e69a62a65248)]:
  - @tanstack/form-core@1.24.2: prevent runtime errors when using `deleteField` ([#1706](https://github.com/TanStack/form/pull/1706))

## 1.23.5

### Patch Changes

- Updated dependencies [[`2cfe44c`](https://github.com/TanStack/form/commit/2cfe44ce1e35235ae37ee260dc943a94c9feb71d)]:
  - @tanstack/form-core@1.24.1

## 1.23.4

### Patch Changes

- Updated dependencies [[`c978946`](https://github.com/TanStack/form/commit/c97894688c6f5f1953a87c26890e156ecb0bcaab)]:
  - @tanstack/form-core@1.24.0

## 1.23.3

### Patch Changes

- Updated dependencies [[`f608267`](https://github.com/TanStack/form/commit/f6082674290a2ec5bc1d3ae33f193539ac7fc4b6)]:
  - @tanstack/form-core@1.23.3

## 1.23.2

### Patch Changes

- Updated dependencies [[`7cf3728`](https://github.com/TanStack/form/commit/7cf3728a7b75e077802b427db2a387e36b23682a)]:
  - @tanstack/form-core@1.23.2

## 1.23.1

### Patch Changes

- Updated dependencies [[`db96886`](https://github.com/TanStack/form/commit/db96886a8bf9d3d944bf09fc050b4c2c4b514851)]:
  - @tanstack/form-core@1.23.1

## 1.23.0

### Patch Changes

- Updated dependencies [[`773c1b8`](https://github.com/TanStack/form/commit/773c1b8d9e1b82b5403633691de22f1a1e188d4f), [`1e36222`](https://github.com/TanStack/form/commit/1e362224d3086f67d8a49839d196edd7aa78c04d)]:
  - @tanstack/form-core@1.23.0

## 1.21.1

### Patch Changes

- Updated dependencies [[`d2b6063`](https://github.com/TanStack/form/commit/d2b6063c0fc5406235f8be5462c19497717dfd0d)]:
  - @tanstack/form-core@1.22.0
