---
id: FieldListener
title: FieldListener
---

# Interface: FieldListener\<TFieldData, TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes\>

Defined in: [listeners.public.ts:117](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L117)

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

Defined in: [listeners.public.ts:125](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L125)

***

### triggerDebounceMs?

```ts
optional triggerDebounceMs: 
  | number
| ListenerDebounceFn<TFieldData, TFieldValue>;
```

Defined in: [listeners.public.ts:49](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L49)

The debounce time in milliseconds for validation triggers (change, blur).
Does not affect submit events, which always execute immediately.

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

Defined in: [listeners.public.ts:50](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L50)

#### Inherited from

[`Listener`](Listener.md).[`triggers`](Listener.md#triggers)

***

### watchFields?

```ts
optional watchFields: DeepKeys<TFieldData>[];
```

Defined in: [listeners.public.ts:132](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L132)
