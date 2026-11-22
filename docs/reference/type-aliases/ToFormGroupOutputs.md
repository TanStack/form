---
id: ToFormGroupOutputs
title: ToFormGroupOutputs
---

```ts
type ToFormGroupOutputs<TGroupValidators> = ToOutputs<TGroupValidators, FormGroupValidators<any>>;
```

Defined in: [pipeline/validation/validation.public.ts:730](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L730)

Infers submission output slots from group validators in configuration order.

Slots contain Standard Schema outputs or payloads returned through `createOutput`.
Validators disabled for submission have `undefined` slots. Conditional
submission or success without output can also make a slot `undefined`.

## Type Parameters

### TGroupValidators

`TGroupValidators` *extends* [`FormGroupValidators`](FormGroupValidators.md)\<`any`\>

Library-managed. Do not specify explicitly.
