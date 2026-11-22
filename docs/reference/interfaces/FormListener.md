---
id: FormListener
title: FormListener
---

Defined in: [pipeline/listeners/formListeners.public.ts:32](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/formListeners.public.ts#L32)

Configuration shared by form and field listeners.

## Extends

- [`Listener`](Listener.md)\<[`FormListenerTriggers`](../type-aliases/FormListenerTriggers.md), `TFormData`, `TFormData`\>

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### run

```ts
run: FormListenerFn<TFormData, TFormError>;
```

Defined in: [pipeline/listeners/formListeners.public.ts:36](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/formListeners.public.ts#L36)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ListenerDebounceFn<TFormData, TFormData>;
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

#### Inherited from

[`Listener`](Listener.md).[`triggerDebounceMs`](Listener.md#triggerdebouncems)

***

### triggers

```ts
triggers: ListenerTriggerOption<FormListenerTriggers, TFormData, TFormData>[];
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

#### Inherited from

[`Listener`](Listener.md).[`triggers`](Listener.md#triggers)
