---
id: ReactFormApi
title: ReactFormApi
---

# Interface: ReactFormApi\<TFormData, TFormValidator\>

Defined in: [packages/react-form/src/useForm.tsx:14](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L14)

Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from `useForm`

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

Defined in: [packages/react-form/src/useForm.tsx:21](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L21)

A React component to render form fields. With this, you can render and manage individual form fields.

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => ReactNode;
```

Defined in: [packages/react-form/src/useForm.tsx:25](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L25)

A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### props

###### children

`ReactNode` \| (`state`) => `ReactNode`

###### selector

(`state`) => `TSelected`

#### Returns

`ReactNode`
