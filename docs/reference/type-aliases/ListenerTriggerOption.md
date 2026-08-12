---
id: ListenerTriggerOption
title: ListenerTriggerOption
---

# Type Alias: ListenerTriggerOption\<TTriggers, TFormData, TValue\>

```ts
type ListenerTriggerOption<TTriggers, TFormData, TValue> = 
  | TTriggers
| ListenerTriggerConfig<TTriggers, TFormData, TValue>;
```

Defined in: [listeners.public.ts:106](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L106)

A listener event, optionally paired with a condition that enables it.

A string enables the trigger unconditionally. Use the object form to add a
boolean or predicate condition. Omitting `when` from the object form also
enables the trigger unconditionally.

## Type Parameters

### TTriggers

`TTriggers` *extends* [`FieldListenerTriggers`](FieldListenerTriggers.md)

### TFormData

`TFormData`

### TValue

`TValue`

## Example

```ts
triggers: [
  'blur',
  {
    trigger: 'change',
    when: ({ formApi }) => formApi.state.isDirty,
  },
],
```
