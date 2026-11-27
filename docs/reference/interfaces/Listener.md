---
id: Listener
title: Listener
---

Defined in: [pipeline/listeners/listeners.public.ts:146](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/listeners.public.ts#L146)

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

Defined in: [pipeline/listeners/listeners.public.ts:161](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/listeners.public.ts#L161)

The debounce delay in milliseconds before the listener runs.

A function recalculates the delay for each matching change or blur event.
Repeated matching events restart the delay. The callback receives current
values when execution begins. Values less than or equal to `0` run
immediately. Lifecycle and submission events always run immediately.

#### Default

```ts
0
```

***

### triggers

```ts
triggers: ListenerTriggerOption<TTriggers, TFormData, TValue>[];
```

Defined in: [pipeline/listeners/listeners.public.ts:179](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/listeners.public.ts#L179)

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
