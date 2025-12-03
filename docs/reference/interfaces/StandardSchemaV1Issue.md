---
id: StandardSchemaV1Issue
title: StandardSchemaV1Issue
---

# Interface: StandardSchemaV1Issue

Defined in: [packages/form-core/src/standardSchemaValidator.ts:179](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L179)

The issue interface of the failure output.

## Properties

### message

```ts
readonly message: string;
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:183](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L183)

The error message of the issue.

***

### path?

```ts
readonly optional path: readonly (PropertyKey | StandardSchemaV1PathSegment)[];
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:187](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L187)

The path of the issue, if any.
