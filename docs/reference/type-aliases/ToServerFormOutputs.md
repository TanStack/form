---
id: ToServerFormOutputs
title: ToServerFormOutputs
---

```ts
type ToServerFormOutputs<TFormValidators> = unknown extends TFormValidators ? unknown[] : FormValidators<any> extends TFormValidators ? unknown[] : MappedServerOutputs<TFormValidators>;
```

Defined in: [validation.public.ts:1389](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1389)

Infers server validation output slots in form validator configuration order.

Validators without a `'server'` trigger have `undefined` slots. Server
selection is independent of `runOnSubmit`.

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.
