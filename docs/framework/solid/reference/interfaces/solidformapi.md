---
id: SolidFormApi
title: SolidFormApi
---

# Interface: SolidFormApi\<TFormData, TFormValidator\>

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### createField

```ts
createField: CreateField<TFormData, TFormValidator>;
```

#### Defined in

[packages/solid-form/src/createForm.tsx:16](https://github.com/TanStack/Formblob/main/packages/solid-form/src/createForm.tsx#L16)

***

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

#### Defined in

[packages/solid-form/src/createForm.tsx:15](https://github.com/TanStack/Formblob/main/packages/solid-form/src/createForm.tsx#L15)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => Element;
```

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

#### Defined in

[packages/solid-form/src/createForm.tsx:20](https://github.com/TanStack/Formblob/main/packages/solid-form/src/createForm.tsx#L20)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => () => TSelected;
```

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`Function`

##### Returns

`TSelected`

#### Defined in

[packages/solid-form/src/createForm.tsx:17](https://github.com/TanStack/Formblob/main/packages/solid-form/src/createForm.tsx#L17)
