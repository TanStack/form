---
id: InferValidFormKeys
title: InferValidFormKeys
---

# Type Alias: InferValidFormKeys\<TForm, TFieldType\>

```ts
type InferValidFormKeys<TForm, TFieldType>: { [K in DeepKeys<TForm>]: DeepValue<TForm, K> extends TFieldType ? K : never }[DeepKeys<TForm>];
```

Infers the form keys of valid fields

## Type Parameters

• **TForm**

• **TFieldType**

## Defined in

[packages/form-core/src/util-types.ts:151](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L151)
