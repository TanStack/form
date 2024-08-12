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

[inject-store.ts:4](https://github.com/TanStack/form/blob/782e82ea1fb36627b62d0f588484b4a9c3249fed/packages/angular-form/src/inject-store.ts#L4)
