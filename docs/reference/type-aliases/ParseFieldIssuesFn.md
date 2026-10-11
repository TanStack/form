---
id: ParseFieldIssuesFn
title: ParseFieldIssuesFn
---

```ts
type ParseFieldIssuesFn = (issues) => StandardSchemaV1Issue[];
```

Defined in: [validation.public.ts:649](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L649)

Converts Standard Schema issues into errors owned by the field being validated.

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

## Returns

[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)[]

A copy of the issue array. Issue paths do not route errors to other fields.
