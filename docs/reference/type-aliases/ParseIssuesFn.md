---
id: ParseIssuesFn
title: ParseIssuesFn
---

```ts
type ParseIssuesFn<TFormData> = (issues) => ParsedStandardSchemaIssues<TFormData>;
```

Defined in: [validation/results/results.public.ts:145](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation/results/results.public.ts#L145)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

## Returns

[`ParsedStandardSchemaIssues`](../interfaces/ParsedStandardSchemaIssues.md)\<`TFormData`\>
