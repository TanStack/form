---
id: SolidFormApi
title: SolidFormApi
---

# Interface: SolidFormApi\<TFormData, TFormValidator\>

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> = `Validator`\<`TFormData`, `StandardSchemaV1`\<`TFormData`\>\>

## Properties

### createField

```ts
createField: CreateField<TFormData, TFormValidator>;
```

#### Defined in

[packages/solid-form/src/createForm.tsx:24](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L24)

***

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

#### Defined in

[packages/solid-form/src/createForm.tsx:23](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L23)

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

[packages/solid-form/src/createForm.tsx:28](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L28)

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

[packages/solid-form/src/createForm.tsx:25](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L25)
