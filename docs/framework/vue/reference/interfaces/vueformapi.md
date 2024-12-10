---
id: VueFormApi
title: VueFormApi
---

# Interface: VueFormApi\<TFormData, TFormValidator\>

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

#### Defined in

[packages/vue-form/src/useForm.tsx:14](https://github.com/TanStack/Formblob/main/packages/vue-form/src/useForm.tsx#L14)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props, context) => any;
```

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### props

###### selector

(`state`) => `TSelected`

##### context

`SetupContext`\<`EmitsOptions`, `SlotsType`\<`object`\>\>

#### Returns

`any`

#### Defined in

[packages/vue-form/src/useForm.tsx:19](https://github.com/TanStack/Formblob/main/packages/vue-form/src/useForm.tsx#L19)

***

### useField

```ts
useField: UseField<TFormData, TFormValidator>;
```

#### Defined in

[packages/vue-form/src/useForm.tsx:15](https://github.com/TanStack/Formblob/main/packages/vue-form/src/useForm.tsx#L15)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => Readonly<Ref<TSelected, TSelected>>;
```

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`Readonly`\<`Ref`\<`TSelected`, `TSelected`\>\>

#### Defined in

[packages/vue-form/src/useForm.tsx:16](https://github.com/TanStack/Formblob/main/packages/vue-form/src/useForm.tsx#L16)
