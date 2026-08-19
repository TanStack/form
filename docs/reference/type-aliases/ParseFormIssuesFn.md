---
id: ParseFormIssuesFn
title: ParseFormIssuesFn
---

# Type Alias: ParseFormIssuesFn\<TFormData\>

```ts
type ParseFormIssuesFn<TFormData> = (issues) => ParsedStandardSchemaIssues<TFormData>;
```

Defined in: [validation.public.ts:408](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L408)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

## Returns

[`ParsedStandardSchemaIssues`](../interfaces/ParsedStandardSchemaIssues.md)\<`TFormData`\>
