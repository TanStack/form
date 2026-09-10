---
id: StandardSchemaV1Issue
title: StandardSchemaV1Issue
---

# Interface: StandardSchemaV1Issue

Defined in: [packages/form-core/src/standardSchemaValidator.ts:181](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L181)

The issue interface of the failure output.

## Properties

### message

```ts
readonly message: string;
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:185](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L185)

The error message of the issue.

***

### path?

```ts
readonly optional path: readonly (PropertyKey | StandardSchemaV1PathSegment)[];
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:189](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L189)

The path of the issue, if any.
