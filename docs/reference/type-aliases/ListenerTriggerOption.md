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

Defined in: [packages/form-core/src/listeners.public.ts:33](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/listeners.public.ts#L33)

## Type Parameters

### TTriggers

`TTriggers` *extends* [`FieldListenerTriggers`](FieldListenerTriggers.md)

### TFormData

`TFormData`

### TValue

`TValue`
