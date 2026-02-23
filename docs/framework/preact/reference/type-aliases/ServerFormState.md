---
id: ServerFormState
title: ServerFormState
---

# Type Alias: ServerFormState\<TFormData, TOnServer\>

```ts
type ServerFormState<TFormData, TOnServer> = Pick<FormState<TFormData, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, TOnServer>, "values" | "errors" | "errorMap">;
```

Defined in: [packages/react-form/src/types.ts:120](https://github.com/TanStack/form/blob/main/packages/react-form/src/types.ts#L120)

## Type Parameters

### TFormData

`TFormData`

### TOnServer

`TOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>
