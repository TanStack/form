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

[inject-store.ts:4](https://github.com/TanStack/form/blob/eae56e9e6061dd35d01d0534f88a027f3f957e7f/packages/angular-form/src/inject-store.ts#L4)
