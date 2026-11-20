---
id: FormListener
title: FormListener
---

Defined in: [FormApi/formListeners.public.ts:24](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formListeners.public.ts#L24)

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

Defined in: [FormApi/formListeners.public.ts:28](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi/formListeners.public.ts#L28)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ListenerDebounceFn<TFormData, TFormData>;
```

Defined in: [listeners.public.ts:161](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L161)

The debounce delay in milliseconds before the listener runs.

A function recalculates the delay for each matching event. Repeated events
restart the delay, and the listener receives the latest event context.
Values less than or equal to `0` run immediately. `'submit'` events always
run immediately.

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

Defined in: [listeners.public.ts:179](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L179)

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
