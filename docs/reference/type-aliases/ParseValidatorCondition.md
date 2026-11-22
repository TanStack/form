---
id: ParseValidatorCondition
title: ParseValidatorCondition
---

```ts
type ParseValidatorCondition<TCondition> = TCondition extends (...args) => boolean ? boolean : TCondition;
```

Defined in: [pipeline/validation/formValidators.public.ts:273](https://github.com/TanStack/form/blob/main/packages/form-core/src/pipeline/validation/formValidators.public.ts#L273)

Treats callback conditions as variable booleans when inferring validator
events and submission outputs.

A callback with a literal `true` or `false` return type still becomes
`boolean`. Other condition types are preserved.

## Type Parameters

### TCondition

`TCondition`

Library-managed. Do not specify explicitly.
