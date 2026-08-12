---
id: ListenerTriggerConfig
title: ListenerTriggerConfig
---

# Interface: ListenerTriggerConfig\<TTriggers, TFormData, TValue\>

Defined in: [listeners.public.ts:80](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L80)

Configures a listener trigger with an optional condition.

## Type Parameters

### TTriggers

`TTriggers` *extends* [`FieldListenerTriggers`](../type-aliases/FieldListenerTriggers.md)

Library-managed. Do not specify explicitly.

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

## Properties

### trigger

```ts
trigger: TTriggers;
```

Defined in: [listeners.public.ts:86](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L86)

The event to match before evaluating `when`.

***

### when?

```ts
optional when?: 
  | boolean
| ListenerPredicateFn<TFormData, TValue>;
```

Defined in: [listeners.public.ts:99](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L99)

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
