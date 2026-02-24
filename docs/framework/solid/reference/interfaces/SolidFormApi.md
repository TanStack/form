---
id: SolidFormApi
title: SolidFormApi
---

# Interface: SolidFormApi\<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta\>

Defined in: [packages/solid-form/src/createForm.tsx:14](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L14)

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

### createField

```ts
createField: CreateField<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [packages/solid-form/src/createForm.tsx:42](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L42)

***

### Field

```ts
Field: FieldComponent<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [packages/solid-form/src/createForm.tsx:28](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L28)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.tsx:91](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L91)

#### Type Parameters

##### TSelected

`TSelected` = `NoInfer`\<`FormState`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`\>\>

#### Parameters

##### props

###### children

`Element` \| (`state`) => `Element`

###### selector?

(`state`) => `TSelected`

#### Returns

`Element`

***

### useStore()

```ts
useStore: <TSelected>(selector?) => () => TSelected;
```

Defined in: [packages/solid-form/src/createForm.tsx:56](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L56)

#### Type Parameters

##### TSelected

`TSelected` = `NoInfer`\<`FormState`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`\>\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

```ts
(): TSelected;
```

##### Returns

`TSelected`
