---
id: ToServerFormErrorTypes
title: ToServerFormErrorTypes
---

# Type Alias: ToServerFormErrorTypes\<TFormValidators\>

```ts
type ToServerFormErrorTypes<TFormValidators> = unknown extends TFormValidators ? FormErrorTypes : FormValidators<any> extends TFormValidators ? FormErrorTypes : ToFormErrorTypes<MappedServerFormValidators<TFormValidators>, never>;
```

Defined in: [validation.public.ts:757](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/validation.public.ts#L757)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
