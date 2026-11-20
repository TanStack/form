---
id: FieldListenerContext
title: FieldListenerContext
---

Defined in: [listeners.public.ts:191](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L191)

Context passed to a field listener.

## Type Parameters

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

### fieldApi

```ts
fieldApi: FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormError>;
```

Defined in: [listeners.public.ts:206](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L206)

The field that owns the listener.

This remains the listening field when an event arrives through
`watchFields`.

***

### formApi

```ts
formApi: FormApi<TFormData, TFormError>;
```

Defined in: [listeners.public.ts:214](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L214)

The form that owns the field.

***

### value

```ts
value: TFieldValue;
```

Defined in: [listeners.public.ts:199](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L199)

The listening field's value captured when the event occurred.
