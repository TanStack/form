---
id: ListenerTriggerConfig
title: ListenerTriggerConfig
---

# Interface: ListenerTriggerConfig\<TTriggers, TFormData, TValue\>

Defined in: [listeners.public.ts:66](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L66)

Configures a listener trigger with an optional condition.

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

Defined in: [listeners.public.ts:72](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L72)

The event to match before evaluating `when`.

***

### when?

```ts
optional when?: 
  | boolean
| ListenerPredicateFn<TFormData, TValue>;
```

Defined in: [listeners.public.ts:85](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L85)

Whether the listener is enabled when `trigger` occurs.

A function receives the current listener context.

#### Example

```ts
when: ({ formApi }) => formApi.state.isDirty,
```

#### Default

```ts
true
```
