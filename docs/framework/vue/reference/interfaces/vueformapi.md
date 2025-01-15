---
id: VueFormApi
title: VueFormApi
---

# Interface: VueFormApi\<TFormData, TFormValidator\>

Defined in: [packages/vue-form/src/useForm.tsx:10](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L10)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

Defined in: [packages/vue-form/src/useForm.tsx:14](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L14)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props, context) => any;
```

Defined in: [packages/vue-form/src/useForm.tsx:19](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L19)

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### props

###### selector

(`state`) => `TSelected`

##### context

`SetupContext`\<`EmitsOptions`, `SlotsType`\<\{
  `default`: `FormState`\<`TFormData`\>;
 \}\>\>

#### Returns

`any`

***

### useField

```ts
useField: UseField<TFormData, TFormValidator>;
```

Defined in: [packages/vue-form/src/useForm.tsx:15](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L15)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => Readonly<Ref<TSelected, TSelected>>;
```

Defined in: [packages/vue-form/src/useForm.tsx:16](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L16)

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`Readonly`\<`Ref`\<`TSelected`, `TSelected`\>\>
