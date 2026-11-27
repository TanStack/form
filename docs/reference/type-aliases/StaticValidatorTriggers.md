---
id: StaticValidatorTriggers
title: StaticValidatorTriggers
---

```ts
type StaticValidatorTriggers = Extract<ValidatorTriggers, 
  | ServerSideEvents
| PreprocessEvents>;
```

Defined in: [pipeline/events.public.ts:47](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/events.public.ts#L47)

Mount and server triggers that accept boolean `when` conditions.

A `true` condition enables the trigger, and `false` disables it.
Callback conditions are not supported.
