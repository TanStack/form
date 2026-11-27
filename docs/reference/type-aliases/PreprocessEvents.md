---
id: PreprocessEvents
title: PreprocessEvents
---

```ts
type PreprocessEvents = Extract<ValidatorEvents, "mount">;
```

Defined in: [pipeline/events.public.ts:19](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/events.public.ts#L19)

Mount events used to validate values during initialization.

Form-level mount validators run during form construction, before `formApi`
is available in their callback context.
