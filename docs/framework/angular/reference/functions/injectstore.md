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

### form

`FormApi`\<`TFormData`, `TFormValidator`\>

### selector?

(`state`) => `TSelected`

## Returns

`Signal`\<`TSelected`\>

## Defined in

[inject-store.ts:4](https://github.com/TanStack/Formblob/main/packages/angular-form/src/inject-store.ts#L4)
