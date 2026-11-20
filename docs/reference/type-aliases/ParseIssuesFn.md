---
id: ParseIssuesFn
title: ParseIssuesFn
---

```ts
type ParseIssuesFn<TFormData> = (issues) => ParsedStandardSchemaIssues<TFormData>;
```

Defined in: [validation/state.public.ts:118](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/state.public.ts#L118)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

## Returns

[`ParsedStandardSchemaIssues`](../interfaces/ParsedStandardSchemaIssues.md)\<`TFormData`\>
