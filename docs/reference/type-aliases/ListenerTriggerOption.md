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

Defined in: [listeners.public.ts:28](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/listeners.public.ts#L28)

## Type Parameters

### TTriggers

`TTriggers` *extends* [`FieldListenerTriggers`](FieldListenerTriggers.md)

### TFormData

`TFormData`

### TValue

`TValue`
