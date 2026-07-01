---
id: StandardSchemaV1Issue
title: StandardSchemaV1Issue
---

# Interface: StandardSchemaV1Issue

Defined in: [packages/form-core/src/standardSchema.public.ts:73](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/standardSchema.public.ts#L73)

The issue interface of the failure output.

## Properties

### message

```ts
readonly message: string;
```

Defined in: [packages/form-core/src/standardSchema.public.ts:77](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/standardSchema.public.ts#L77)

The error message of the issue.

***

### path?

```ts
readonly optional path: readonly (PropertyKey | StandardSchemaV1PathSegment)[];
```

Defined in: [packages/form-core/src/standardSchema.public.ts:81](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/standardSchema.public.ts#L81)

The path of the issue, if any.
