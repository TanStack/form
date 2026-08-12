---
id: ListenerPredicateFn
title: ListenerPredicateFn
---

# Type Alias: ListenerPredicateFn\<TFormData, TValue\>

```ts
type ListenerPredicateFn<TFormData, TValue> = (context) => boolean;
```

Defined in: [listeners.public.ts:69](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L69)

Decides whether a listener is enabled for a matching event.

The predicate is only called after its configured trigger matches the
current event.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValue

`TValue`

Library-managed. Do not specify explicitly.

## Parameters

### context

[`ListenerPredicateContext`](../interfaces/ListenerPredicateContext.md)\<`TFormData`, `TValue`\>

## Returns

`boolean`

## Example

```ts
when: ({ formApi }) => formApi.state.isDirty,
```
