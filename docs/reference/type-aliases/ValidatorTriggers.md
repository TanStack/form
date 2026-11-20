---
id: ValidatorTriggers
title: ValidatorTriggers
---

```ts
type ValidatorTriggers = Exclude<ValidatorEvents, "submit">;
```

Defined in: [events.public.ts:37](https://github.com/TanStack/form/blob/main/packages/form-core/src/events.public.ts#L37)

Events accepted by a validator's `triggers` array.

Submission is controlled separately by `skipOnSubmit`.
