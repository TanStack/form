---
id: Listener
title: Listener
---

# Interface: Listener\<TTriggers, TFormData, TValue\>

Defined in: [listeners.public.ts:38](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L38)

## Extended by

- [`FormListener`](FormListener.md)
- [`FieldListener`](FieldListener.md)

## Type Parameters

### TTriggers

`TTriggers` *extends* [`FieldListenerTriggers`](../type-aliases/FieldListenerTriggers.md)

### TFormData

`TFormData`

### TValue

`TValue`

## Properties

### triggerDebounceMs?

```ts
optional triggerDebounceMs: 
  | number
| ListenerDebounceFn<TFormData, TValue>;
```

Defined in: [listeners.public.ts:49](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L49)

The debounce time in milliseconds for validation triggers (change, blur).
Does not affect submit events, which always execute immediately.

#### Default

```ts
0
```

***

### triggers

```ts
triggers: ListenerTriggerOption<TTriggers, TFormData, TValue>[];
```

Defined in: [listeners.public.ts:50](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L50)
