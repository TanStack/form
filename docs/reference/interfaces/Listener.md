---
id: Listener
title: Listener
---

# Interface: Listener\<TTriggers, TFormData, TValue\>

Defined in: [packages/form-core/src/listeners.public.ts:43](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L43)

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

Defined in: [packages/form-core/src/listeners.public.ts:54](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L54)

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

Defined in: [packages/form-core/src/listeners.public.ts:55](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L55)
