---
id: ListenerTriggerConfig
title: ListenerTriggerConfig
---

# Interface: ListenerTriggerConfig\<TTriggers, TFormData, TValue\>

Defined in: [listeners.public.ts:19](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L19)

## Type Parameters

### TTriggers

`TTriggers` *extends* [`FieldListenerTriggers`](../type-aliases/FieldListenerTriggers.md)

### TFormData

`TFormData`

### TValue

`TValue`

## Properties

### trigger

```ts
trigger: TTriggers;
```

Defined in: [listeners.public.ts:24](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L24)

***

### when?

```ts
optional when?: 
  | boolean
| ListenerPredicateFn<TFormData, TValue>;
```

Defined in: [listeners.public.ts:25](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L25)
