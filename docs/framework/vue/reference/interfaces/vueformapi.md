---
id: VueFormApi
title: VueFormApi
---

# Interface: VueFormApi\<TFormData, TFormValidator\>

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `StandardSchemaValidator`

## Properties

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

#### Defined in

[packages/vue-form/src/useForm.tsx:22](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L22)

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

[packages/vue-form/src/useForm.tsx:27](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L27)

***

### useField

```ts
useField: UseField<TFormData, TFormValidator>;
```

#### Defined in

[packages/vue-form/src/useForm.tsx:23](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L23)

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

[packages/vue-form/src/useForm.tsx:24](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useForm.tsx#L24)
