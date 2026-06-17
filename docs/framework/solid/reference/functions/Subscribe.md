---
id: Subscribe
title: Subscribe
---

# Function: Subscribe()

```ts
function Subscribe<TFormData, TFormValidatorMetas, TSubmitReturn, TSelected>(props): Element;
```

Defined in: [packages/solid-form/src/Subscribe.public.ts:36](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/Subscribe.public.ts#L36)

A React component that allows you to subscribe to the form state.

This is useful for opting into state re-renders for specific parts of the form state.

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TSelected

`TSelected`

## Parameters

### props

[`SubscribeProps`](../interfaces/SubscribeProps.md)\<`FormState`\<`TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>, `TSelected`\>

## Returns

`Element`
