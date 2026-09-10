---
id: FormValidatorData
title: FormValidatorData
---

# Type Alias: FormValidatorData\<TFormValidators\>

```ts
type FormValidatorData<TFormValidators> = TFormValidators extends FormValidators<infer T> ? T : never;
```

Defined in: [utils.public.ts:48](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L48)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
