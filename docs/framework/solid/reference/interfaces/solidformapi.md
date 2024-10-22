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

[createForm.tsx:16](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L16)

***

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

#### Defined in

[createForm.tsx:15](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L15)

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

[createForm.tsx:20](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L20)

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

[createForm.tsx:17](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createForm.tsx#L17)
