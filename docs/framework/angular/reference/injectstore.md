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

[inject-store.ts:4](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/inject-store.ts#L4)
