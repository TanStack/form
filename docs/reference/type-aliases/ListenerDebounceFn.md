---
id: ListenerDebounceFn
title: ListenerDebounceFn
---

```ts
type ListenerDebounceFn<TFormData, TValue> = (context) => number;
```

Defined in: [pipeline/listeners/listeners.public.ts:135](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/listeners/listeners.public.ts#L135)

Calculates a listener's debounce delay from the current event context.

The function is called after a trigger matches and its condition is enabled.
The returned number is interpreted as milliseconds; values less than or
equal to `0` run immediately. Only `'change'` and `'blur'` events call this
function; lifecycle and submission events run immediately.

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

`number`

## Example

```ts
triggerDebounceMs: ({ triggerFieldApi }) =>
  triggerFieldApi?.name === 'search' ? 300 : 0,
```
