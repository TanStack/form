---
id: ParseFormIssuesFn
title: ParseFormIssuesFn
---

```ts
type ParseFormIssuesFn<TFormData> = (issues) => ParsedStandardSchemaIssues<TFormData>;
```

Defined in: [validation.public.ts:659](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L659)

Converts Standard Schema issues into a form or group error map to return from a validator.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

## Returns

[`ParsedStandardSchemaIssues`](../interfaces/ParsedStandardSchemaIssues.md)\<`TFormData`\>

All issues in `form`, with issues that have paths also grouped in `fields`.
