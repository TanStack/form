---
id: ToServerFormErrorTypes
title: ToServerFormErrorTypes
---

# Type Alias: ToServerFormErrorTypes\<TFormValidators\>

```ts
type ToServerFormErrorTypes<TFormValidators> = unknown extends TFormValidators ? FormErrorTypes : FormValidators<any> extends TFormValidators ? FormErrorTypes : ToFormErrorTypes<MappedServerFormValidators<TFormValidators>, never>;
```

Defined in: [validation.public.ts:754](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/validation.public.ts#L754)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
