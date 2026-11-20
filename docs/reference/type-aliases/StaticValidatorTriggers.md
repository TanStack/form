---
id: StaticValidatorTriggers
title: StaticValidatorTriggers
---

```ts
type StaticValidatorTriggers = Extract<ValidatorTriggers, 
  | ServerSideEvents
| PreprocessEvents>;
```

Defined in: [events.public.ts:43](https://github.com/TanStack/form/blob/main/packages/form-core/src/events.public.ts#L43)

Mount and server triggers that accept a boolean `when` condition.
Callbacks are not supported for these triggers.
