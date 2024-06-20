# Function: injectStore()

```ts
function injectStore<TFormData, TFormValidator, TSelected>(form, selector?): Signal<TSelected>
```

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

• **TSelected** = `NoInfer`\<`FormState`\<`TFormData`\>\>

## Parameters

• **form**: `FormApi`\<`TFormData`, `TFormValidator`\>

• **selector?**

## Returns

`Signal`\<`TSelected`\>

## Source

[inject-store.ts:4](https://github.com/TanStack/form/blob/15a69d908f9285338889d60e93b689d265e4136c/packages/angular-form/src/inject-store.ts#L4)
