---
id: StandardSchemaV1Issue
title: StandardSchemaV1Issue
---

Defined in: [packages/form-core/src/standardSchemaValidator.ts:180](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L180)

The issue interface of the failure output.

## Properties

### message

```ts
readonly message: string;
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:184](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L184)

The error message of the issue.

***

### path?

```ts
readonly optional path: readonly (PropertyKey | StandardSchemaV1PathSegment)[];
```

Defined in: [packages/form-core/src/standardSchemaValidator.ts:188](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L188)

The path of the issue, if any.
