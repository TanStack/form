---
id: ConfigurableValidationTrigger
title: ConfigurableValidationTrigger
---

```ts
type ConfigurableValidationTrigger = 
  | Exclude<ValidationTrigger, "submit">
  | "mount";
```

Defined in: [validation.public.ts:261](https://github.com/TanStack/form/blob/main/packages/form-core/src/validation.public.ts#L261)

Events configured through `triggers`. Submission is controlled by `skipOnSubmit`.
