---
id: ValidatorTriggers
title: ValidatorTriggers
---

```ts
type ValidatorTriggers = Exclude<ValidatorEvents, "submit">;
```

Defined in: [pipeline/events.public.ts:39](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/events.public.ts#L39)

Events accepted by a validator's `triggers` array.

Submission runs independently of these triggers and is controlled by
`skipOnSubmit`.
