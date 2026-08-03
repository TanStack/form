---
id: ToServerFormErrorTypes
title: ToServerFormErrorTypes
---

# Type Alias: ToServerFormErrorTypes\<TFormValidators\>

```ts
type ToServerFormErrorTypes<TFormValidators> = unknown extends TFormValidators ? FormErrorTypes : FormValidators<any> extends TFormValidators ? FormErrorTypes : ToFormErrorTypes<MappedServerFormValidators<TFormValidators>, never>;
```

Defined in: [validation.public.ts:749](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L749)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
