---
id: ListenerPredicateContext
title: ListenerPredicateContext
---

# Interface: ListenerPredicateContext\<TFormData, TValue\>

Defined in: [listeners.public.ts:35](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L35)

Context used to conditionally enable or debounce a listener.

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

## Properties

### formApi

```ts
formApi: FormApi<TFormData, any>;
```

Defined in: [listeners.public.ts:37](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L37)

The form associated with the listener event.

***

### triggerFieldApi?

```ts
optional triggerFieldApi?: AnyFieldApi;
```

Defined in: [listeners.public.ts:45](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L45)

The field associated with the listener event, when available.

For a field listener, this is the field that owns the listener even when
the event came from one of its `watchFields`. It is `undefined` for
form-level `'mount'`, `'reset'`, and `'submit'` events.

***

### value

```ts
value: TValue;
```

Defined in: [listeners.public.ts:47](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L47)

The value in the listener's scope when the event occurred.
