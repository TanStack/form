---
id: typescript
title: TypeScript
---

TanStack Form is written 100% in **TypeScript** with the highest quality generics, constraints, and interfaces to make sure the library and your projects are as type-safe as possible!

Things to keep in mind:

- `strict: true` is required in your `tsconfig.json` to get the most out of TanStack Form's types
- Types currently require using TypeScript v5.4 or greater
- Changes to types in this repository are considered **non-breaking** and are usually released as **patch** semver changes (otherwise every type enhancement would be a major version!).
- It is **highly recommended that you lock your react-form package version to a specific patch release and upgrade with the expectation that types may be fixed or upgraded between any release**
- The non-type-related public API of TanStack Form still follows semver very strictly.
