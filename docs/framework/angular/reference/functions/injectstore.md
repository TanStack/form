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

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`TFormData`, `StandardSchemaV1`\<`TFormData`\>\>

• **TSelected** = `NoInfer`\<`FormState`\<`TFormData`\>\>

## Parameters

### form

`FormApi`\<`TFormData`, `TFormValidator`\>

### selector?

(`state`) => `TSelected`

## Returns

`Signal`\<`TSelected`\>

## Defined in

[inject-store.ts:9](https://github.com/TanStack/form/blob/main/packages/angular-form/src/inject-store.ts#L9)
