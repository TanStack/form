---
id: ToFormOutputs
title: ToFormOutputs
---

```ts
type ToFormOutputs<TFormValidators> = ToOutputs<TFormValidators, FormValidators<any>>;
```

Defined in: [validation.public.ts:1259](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L1259)

Infers submission output slots from form validators in configuration order.

Slots contain Standard Schema outputs or payloads returned through `createOutput`.
Validators disabled for submission have `undefined` slots. Conditional
submission or success without output can also make a slot `undefined`.

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.
