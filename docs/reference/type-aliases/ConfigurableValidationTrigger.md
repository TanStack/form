---
id: ConfigurableValidationTrigger
title: ConfigurableValidationTrigger
---

```ts
type ConfigurableValidationTrigger = 
  | Exclude<ValidationTrigger, "submit">
  | "mount";
```

Defined in: [pipeline/validation/validation.public.ts:254](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/validation.public.ts#L254)

Events configured through `triggers`. Submission is controlled by `skipOnSubmit`.
