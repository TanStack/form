---
id: FieldListener
title: FieldListener
---

# Interface: FieldListener\<TFieldData, TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes\>

Defined in: [listeners.public.ts:332](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L332)

A listener configured on a field.

`'change'` and `'blur'` events from descendant fields propagate to their
ancestor field listeners. Use `watchFields` to receive matching events from
other fields.

## Extends

- [`Listener`](Listener.md)\<[`FieldListenerTriggers`](../type-aliases/FieldListenerTriggers.md), `TFieldData`, `TFieldValue`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldName

`TFieldName`

### TFieldValue

`TFieldValue`

### TFieldError

`TFieldError`

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* [`FormErrorTypes`](FormErrorTypes.md)

## Properties

### run

```ts
run: FieldListenerFn<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes>;
```

Defined in: [listeners.public.ts:356](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L356)

Called when an enabled field trigger occurs.

The return value is ignored. A returned promise is not awaited, and a
rejected promise is reported to the console.

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

Defined in: [listeners.public.ts:146](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L146)

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
triggers: ListenerTriggerOption<FieldListenerTriggers, TFieldData, TFieldValue>[];
```

Defined in: [listeners.public.ts:164](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L164)

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

Defined in: [listeners.public.ts:377](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L377)

Other fields whose matching events should also invoke this listener.

The callback still receives this listener's `fieldApi` and `value`, not
the watched field or its value.

When omitted, the listener receives matching events from its own field and
propagated descendant events only.

#### Example

```ts
watchFields: ['firstName', 'lastName'],
```
