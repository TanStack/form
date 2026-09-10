---
id: FieldListenerTriggers
title: FieldListenerTriggers
---

# Type Alias: FieldListenerTriggers

```ts
type FieldListenerTriggers = FormListenerTriggers | "unmount";
```

Defined in: [listeners.public.ts:32](https://github.com/TanStack/form/blob/main/packages/form-core/src/listeners.public.ts#L32)

Events that can invoke a listener configured on a field.

- `'change'`: The field, one of its descendants, or a watched field reported
  a value change.
- `'blur'`: The field, one of its descendants, or a watched field was
  blurred.
- `'submit'`: A submission attempt notified the field before validation.
- `'mount'`: The field or a watched field was registered.
- `'reset'`: The field or a watched field was reset directly or as part of a
  form reset.
- `'unmount'`: The field or a watched field was unregistered.
