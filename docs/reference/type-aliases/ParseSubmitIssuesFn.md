---
id: ParseSubmitIssuesFn
title: ParseSubmitIssuesFn
---

```ts
type ParseSubmitIssuesFn<TFormData> = (issues) => ParsedSubmitIssues<TFormData> & OnSubmitError<ParsedSubmitIssues<TFormData>>;
```

Defined in: [FormApi/formSubmit.public.ts:103](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formSubmit.public.ts#L103)

Converts Standard Schema issues into a mutable error map to return from `onSubmit`.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

## Parameters

### issues

`Parameters`\<[`ParseIssuesFn`](ParseIssuesFn.md)\<`TFormData`\>\>\[`0`\]

## Returns

`ParsedSubmitIssues`\<`TFormData`\> & [`OnSubmitError`](OnSubmitError.md)\<`ParsedSubmitIssues`\<`TFormData`\>\>
