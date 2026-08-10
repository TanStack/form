---
id: LitFormType
title: LitFormType
---

# Type Alias: LitFormType\<TOptions\>

```ts
type LitFormType<TOptions> = TOptions extends FormOptions<infer TFormData, infer TFormValidators, infer TSubmitReturn> ? TanStackFormController<TFormData, TFormValidators, LitFormTypeSubmitReturn<TSubmitReturn>> : never;
```

Defined in: [get-form-type.ts:9](https://github.com/TanStack/form/blob/main/packages/lit-form/src/get-form-type.ts#L9)

Resolves reusable form options to their concrete Lit controller type.

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions`
