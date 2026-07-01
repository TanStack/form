---
id: FormValidatorData
title: FormValidatorData
---

# Type Alias: FormValidatorData\<TFormValidators\>

```ts
type FormValidatorData<TFormValidators> = TFormValidators extends FormValidators<infer T> ? T : never;
```

Defined in: [packages/form-core/src/utils.public.ts:52](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/utils.public.ts#L52)

## Type Parameters

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](FormValidators.md)\<`any`\>
