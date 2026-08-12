---
id: ParseSubmitIssuesFn
title: ParseSubmitIssuesFn
---

# Type Alias: ParseSubmitIssuesFn\<TFormData\>

```ts
type ParseSubmitIssuesFn<TFormData> = (issues) => OnSubmitError<ParsedStandardSchemaIssues<TFormData>>;
```

Defined in: [FormApi/FormApi.public.ts:76](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/FormApi.public.ts#L76)

Converts Standard Schema issues into an `onSubmit` validation error.

Issue paths are mapped to fields in the submitted value. Return the result
from `onSubmit` to add the parsed errors to validation state.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### issues

`ReadonlyArray`\<[`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)\>

The Standard Schema issues to convert.

## Returns

[`OnSubmitError`](OnSubmitError.md)\<[`ParsedStandardSchemaIssues`](../interfaces/ParsedStandardSchemaIssues.md)\<`TFormData`\>\>
