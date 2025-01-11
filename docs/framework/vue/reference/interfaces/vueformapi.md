---
id: VueFormApi
title: VueFormApi
---

# Interface: VueFormApi\<TFormData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn\>

Defined in: [packages/vue-form/src/useForm.tsx:110](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L110)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

• **TFormOnMountReturn** = `undefined`

• **TFormOnChangeReturn** = `undefined`

• **TFormOnChangeAsyncReturn** = `undefined`

• **TFormOnBlurReturn** = `undefined`

• **TFormOnBlurAsyncReturn** = `undefined`

• **TFormOnSubmitReturn** = `undefined`

• **TFormOnSubmitAsyncReturn** = `undefined`

• **TFormOnServerReturn** = `undefined`

## Properties

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>;
```

Defined in: [packages/vue-form/src/useForm.tsx:122](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L122)

***

### Subscribe

```ts
Subscribe: SubscribeComponent<TFormData, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>;
```

Defined in: [packages/vue-form/src/useForm.tsx:177](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L177)

***

### useField

```ts
useField: UseField<TFormData, TFormValidator, TFormOnMountReturn, TFormOnChangeReturn, TFormOnChangeAsyncReturn, TFormOnBlurReturn, TFormOnBlurAsyncReturn, TFormOnSubmitReturn, TFormOnSubmitAsyncReturn, TFormOnServerReturn>;
```

Defined in: [packages/vue-form/src/useForm.tsx:134](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L134)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => Readonly<Ref<TSelected, TSelected>>;
```

Defined in: [packages/vue-form/src/useForm.tsx:146](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L146)

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`, `TFormOnMountReturn`, `TFormOnChangeReturn`, `TFormOnChangeAsyncReturn`, `TFormOnBlurReturn`, `TFormOnBlurAsyncReturn`, `TFormOnSubmitReturn`, `TFormOnSubmitAsyncReturn`, `TFormOnServerReturn`\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`Readonly`\<`Ref`\<`TSelected`, `TSelected`\>\>
