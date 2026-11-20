---
id: PreprocessEvents
title: PreprocessEvents
---

```ts
type PreprocessEvents = Extract<ValidatorEvents, "mount">;
```

Defined in: [events.public.ts:18](https://github.com/TanStack/form/blob/main/packages/form-core/src/events.public.ts#L18)

Events for validating initial values during setup.

For form validators, `'mount'` runs when the form is constructed.
