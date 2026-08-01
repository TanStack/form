---
id: ParseSubmitIssuesFn
title: ParseSubmitIssuesFn
---

# Type Alias: ParseSubmitIssuesFn()\<TFormData\>

```ts
type ParseSubmitIssuesFn<TFormData> = (issues) => OnSubmitError<ParsedStandardSchemaIssues<TFormData>>;
```

Defined in: [FormApi/FormApi.public.ts:33](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L33)

## Type Parameters

### TFormData

`TFormData`

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

## Returns

[`OnSubmitError`](OnSubmitError.md)\<[`ParsedStandardSchemaIssues`](../interfaces/ParsedStandardSchemaIssues.md)\<`TFormData`\>\>
