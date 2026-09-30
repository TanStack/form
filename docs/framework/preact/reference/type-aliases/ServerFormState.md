---
id: ServerFormState
title: ServerFormState
---

```ts
type ServerFormState<TFormData, TOnServer> = Pick<FormState<TFormData, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, TOnServer>, "values" | "errors" | "errorMap">;
```

Defined in: [packages/preact-form/src/types.ts:113](https://github.com/TanStack/form/blob/main/packages/preact-form/src/types.ts#L113)

## Type Parameters

### TFormData

`TFormData`

### TOnServer

`TOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>
