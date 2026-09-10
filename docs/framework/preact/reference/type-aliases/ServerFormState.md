---
id: ServerFormState
title: ServerFormState
---

# Type Alias: ServerFormState\<TFormData, TOnServer\>

```ts
type ServerFormState<TFormData, TOnServer> = Pick<FormState<TFormData, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, TOnServer>, "values" | "errors" | "errorMap">;
```

Defined in: [packages/preact-form/src/types.ts:121](https://github.com/TanStack/form/blob/main/packages/preact-form/src/types.ts#L121)

## Type Parameters

### TFormData

`TFormData`

### TOnServer

`TOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>
