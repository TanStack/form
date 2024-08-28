---
id: injectStore
title: injectStore
---

# Function: injectStore()

```ts
function injectStore<TFormData, TFormValidator, TSelected>(form, selector?): Signal<TSelected>
```

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TSelected** = `NoInfer`\<`FormState`\<`TFormData`\>\>

## Parameters

• **form**: `FormApi`\<`TFormData`, `TFormValidator`\>

• **selector?**

## Returns

`Signal`\<`TSelected`\>

## Defined in

[inject-store.ts:4](https://github.com/TanStack/form/blob/ab5a89b11f2af9f11c720387ff2da9e9d2b82764/packages/angular-form/src/inject-store.ts#L4)
