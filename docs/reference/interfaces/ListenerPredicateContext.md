---
id: ListenerPredicateContext
title: ListenerPredicateContext
---

# Interface: ListenerPredicateContext\<TFormData, TValue\>

Defined in: [listeners.public.ts:40](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L40)

Context used to conditionally enable or debounce a listener.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

## Properties

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [listeners.public.ts:42](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L42)

The form associated with the listener event.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [listeners.public.ts:50](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L50)

The field associated with the listener event, when available.

For a field listener, this is the field that owns the listener even when
the event came from one of its `watchFields`. It is `undefined` for
form-level `'mount'`, `'reset'`, and `'submit'` events.

***

### value

```ts
value: TValue;
```

Defined in: [listeners.public.ts:52](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L52)

The value in the listener's scope when the event occurred.
