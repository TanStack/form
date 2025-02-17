---
id: SolidFormApi
title: SolidFormApi
---

# Interface: SolidFormApi\<TFormData, TFormValidator, TFormSubmitMeta\>

Defined in: [packages/solid-form/src/createForm.tsx:11](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L11)

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

• **TFormSubmitMeta** = `never`

## Properties

### createField

```ts
createField: CreateField<TFormData, TFormValidator, TFormSubmitMeta>;
```

Defined in: [packages/solid-form/src/createForm.tsx:17](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L17)

***

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator, TFormSubmitMeta>;
```

Defined in: [packages/solid-form/src/createForm.tsx:16](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L16)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => Element;
```

Defined in: [packages/solid-form/src/createForm.tsx:21](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L21)

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### props

###### children

`Element` \| (`state`) => `Element`

###### selector

(`state`) => `TSelected`

#### Returns

`Element`

***

### useStore()

```ts
useStore: <TSelected>(selector?) => () => TSelected;
```

Defined in: [packages/solid-form/src/createForm.tsx:18](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L18)

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`Function`

##### Returns

`TSelected`
