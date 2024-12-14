---
id: Issue
title: Issue
---

# Interface: Issue

The issue interface of the failure output.

## Properties

### message

```ts
readonly message: string;
```

The error message of the issue.

#### Defined in

[packages/form-core/src/standardSchemaValidator.ts:156](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L156)

***

### path?

```ts
readonly optional path: readonly (PropertyKey | PathSegment)[];
```

The path of the issue, if any.

#### Defined in

[packages/form-core/src/standardSchemaValidator.ts:160](https://github.com/TanStack/form/blob/main/packages/form-core/src/standardSchemaValidator.ts#L160)
