---
id: StandardSchemaV1Issue
title: StandardSchemaV1Issue
---

# Interface: StandardSchemaV1Issue

Defined in: [standardSchema.public.ts:71](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchema.public.ts#L71)

The issue interface of the failure output.

## Properties

### message

```ts
readonly message: string;
```

Defined in: [standardSchema.public.ts:75](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchema.public.ts#L75)

The error message of the issue.

***

### path?

```ts
readonly optional path: readonly (PropertyKey | StandardSchemaV1PathSegment)[];
```

Defined in: [standardSchema.public.ts:79](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchema.public.ts#L79)

The path of the issue, if any.
