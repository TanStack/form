---
id: ToServerFormErrorTypes
title: ToServerFormErrorTypes
---

```ts
type ToServerFormErrorTypes<TFormValidators> = unknown extends TFormValidators ? FormErrorTypes : FormValidators<any> extends TFormValidators ? FormErrorTypes : ToFormErrorTypes<MappedServerFormValidators<TFormValidators>, never>;
```

Defined in: [validation.public.ts:1365](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1365)

Infers form and field issue types from validators with a `'server'` trigger.

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.
