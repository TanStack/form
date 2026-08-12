---
id: FieldListenerContext
title: FieldListenerContext
---

# Interface: FieldListenerContext\<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes\>

Defined in: [listeners.public.ts:264](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L264)

Context passed to a field listener.

## Type Parameters

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

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes>;
```

Defined in: [listeners.public.ts:279](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L279)

The field that owns the listener.

This remains the listening field when an event arrives through
`watchFields`.

***

### formApi

```ts
formApi: FormApi<TFormData, TFormErrorTypes>;
```

Defined in: [listeners.public.ts:287](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L287)

The form that owns the field.

***

### value

```ts
value: TFieldValue;
```

Defined in: [listeners.public.ts:272](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L272)

The listening field's value captured when the event occurred.
