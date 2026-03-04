---
id: VueFormApi
title: VueFormApi
---

# Interface: VueFormApi\<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta\>

Defined in: [packages/vue-form/src/useForm.tsx:124](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L124)

## Type Parameters

### TParentData

`TParentData`

### TFormOnMount

`TFormOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChange

`TFormOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChangeAsync

`TFormOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnBlur

`TFormOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnBlurAsync

`TFormOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnSubmit

`TFormOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnSubmitAsync

`TFormOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnDynamic

`TFormOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnDynamicAsync

`TFormOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnServer

`TFormOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TSubmitMeta

`TSubmitMeta`

## Properties

### Field

```ts
Field: FieldComponent<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [packages/vue-form/src/useForm.tsx:138](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L138)

***

### Subscribe

```ts
Subscribe: SubscribeComponent<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer>;
```

Defined in: [packages/vue-form/src/useForm.tsx:201](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L201)

***

### useField

```ts
useField: UseField<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [packages/vue-form/src/useForm.tsx:152](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L152)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => Readonly<Ref<TSelected>>;
```

Defined in: [packages/vue-form/src/useForm.tsx:166](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L166)

#### Type Parameters

##### TSelected

`TSelected` = `NoInfer`\<`FormState`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`\>\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`Readonly`\<`Ref`\<`TSelected`\>\>
