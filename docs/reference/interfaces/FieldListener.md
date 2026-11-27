---
id: FieldListener
title: FieldListener
---

Defined in: [pipeline/listeners/listeners.public.ts:297](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/listeners.public.ts#L297)

A listener configured on a field.

`'change'` and `'blur'` events from descendant fields propagate to their
ancestor field listeners. Use `watchFields` to receive matching events from
other fields.

## Example

```ts
listeners: [
  {
    triggers: ['change', 'blur'],
    triggerDebounceMs: 200,
    watchFields: ['displayName'],
    run: ({ value, formApi }) => {
      saveContact({
        displayName: formApi.getFieldValue('displayName'),
        email: value,
      })
    },
  },
],
```

## Extends

- [`Listener`](Listener.md)\<[`FieldListenerTriggers`](../type-aliases/FieldListenerTriggers.md), `TFieldData`, `TFieldValue`\>

## Type Parameters

### TFieldData

`TFieldData`

Library-managed. Do not specify explicitly.

### TFieldName

`TFieldName`

Library-managed. Do not specify explicitly.

### TFieldValue

`TFieldValue`

Library-managed. Do not specify explicitly.

### TFieldError

`TFieldError`

Library-managed. Do not specify explicitly.

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* [`ScopedErrorTypes`](ScopedErrorTypes.md)

Library-managed. Do not specify explicitly.

## Properties

### run

```ts
run: FieldListenerFn<TFieldName, TFieldValue, TFieldError, TFormData, TFormError>;
```

Defined in: [pipeline/listeners/listeners.public.ts:322](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/listeners.public.ts#L322)

Called when an enabled field trigger occurs.

The return value is ignored. A returned promise is observed without delaying
validation or submission. Failures are reported to the console while the
invocation is active; failures after cancellation are suppressed.

#### Example

```ts
run: ({ value, fieldApi }) => {
  const trimmedValue = value.trim()
  if (trimmedValue !== value) {
    fieldApi.handleChange(trimmedValue)
  }
},
```

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs?: 
  | number
| ListenerDebounceFn<TFieldData, TFieldValue>;
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
triggers: ListenerTriggerOption<FieldListenerTriggers, TFieldData, TFieldValue>[];
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

***

### watchFields?

```ts
optional watchFields?: DeepKeys<TFieldData>[];
```

Defined in: [pipeline/listeners/listeners.public.ts:343](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/listeners.public.ts#L343)

Other fields whose matching events should also invoke this listener.

The callback still receives this listener's `fieldApi` and `value`, not
the watched field or its value.

When omitted, the listener receives matching events from its own field and
propagated descendant events only.

#### Example

```ts
watchFields: ['firstName', 'lastName'],
```
