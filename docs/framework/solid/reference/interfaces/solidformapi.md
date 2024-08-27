---
id: SolidFormApi
title: SolidFormApi
---

# Interface: SolidFormApi\<TFormData, TFormValidator\>

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

#### Defined in

[createForm.tsx:18](https://github.com/TanStack/form/blob/096bbc41b8af89898a5cd7700fd416a5eaa03028/packages/solid-form/src/createForm.tsx#L18)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => Element;
```

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

• **props**

• **props.children**: `Element` \| (`state`) => `Element`

• **props.selector?**

#### Returns

`Element`

#### Defined in

[createForm.tsx:23](https://github.com/TanStack/form/blob/096bbc41b8af89898a5cd7700fd416a5eaa03028/packages/solid-form/src/createForm.tsx#L23)

***

### createField

```ts
createField: CreateField<TFormData, TFormValidator>;
```

#### Defined in

[createForm.tsx:19](https://github.com/TanStack/form/blob/096bbc41b8af89898a5cd7700fd416a5eaa03028/packages/solid-form/src/createForm.tsx#L19)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => () => TSelected;
```

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

• **selector?**

#### Returns

`Function`

##### Returns

`TSelected`

#### Defined in

[createForm.tsx:20](https://github.com/TanStack/form/blob/096bbc41b8af89898a5cd7700fd416a5eaa03028/packages/solid-form/src/createForm.tsx#L20)
