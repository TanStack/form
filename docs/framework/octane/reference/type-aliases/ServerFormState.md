---
id: ServerFormState
title: ServerFormState
---

```ts
type ServerFormState<TFormData, TOnServer> = Pick<FormState<TFormData, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, TOnServer>, "values" | "errors" | "errorMap">;
```

Defined in: [packages/octane-form/src/types.ts:129](https://github.com/TanStack/form/blob/main/packages/octane-form/src/types.ts#L129)

## Type Parameters

### TFormData

`TFormData`

### TOnServer

`TOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>
