---
id: Listener
title: Listener
---

# Interface: Listener\<TTriggers, TFormData, TValue\>

Defined in: [listeners.public.ts:158](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L158)

Configuration shared by form and field listeners.

## Extended by

- [`FormListener`](FormListener.md)
- [`FieldListener`](FieldListener.md)

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

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ListenerDebounceFn<TFormData, TValue>;
```

Defined in: [listeners.public.ts:173](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L173)

The debounce delay in milliseconds before the listener runs.

A function recalculates the delay for each matching event. Repeated events
restart the delay, and the listener receives the latest event context.
Values less than or equal to `0` run immediately. `'submit'` events always
run immediately.

#### Default

```ts
0
```

***

### triggers

```ts
triggers: ListenerTriggerOption<TTriggers, TFormData, TValue>[];
```

Defined in: [listeners.public.ts:191](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L191)

The events that can invoke the listener.

The listener runs at most once for an event, even if multiple entries
match. An empty array disables the listener.

#### Example

```ts
triggers: [
  'blur',
  {
    trigger: 'change',
    when: ({ formApi }) => formApi.state.isDirty,
  },
],
```
