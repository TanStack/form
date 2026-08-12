---
id: ListenerDebounceFn
title: ListenerDebounceFn
---

# Type Alias: ListenerDebounceFn\<TFormData, TValue\>

```ts
type ListenerDebounceFn<TFormData, TValue> = (context) => number;
```

Defined in: [listeners.public.ts:126](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L126)

Calculates a listener's debounce delay from the current event context.

The function is called after a trigger matches and its condition is enabled.
The returned number is interpreted as milliseconds; values less than or
equal to `0` run immediately. The function is not called for `'submit'`
events because they always run immediately.

## Type Parameters

### TFormData

`TFormData`

### TValue

`TValue`

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
