---
id: ReactFormApi
title: ReactFormApi
---

# Interface: ReactFormApi\<TFormData, TFormValidator\>

Fields that are added onto the `FormAPI` from `@tanstack/form-core` and returned from `useForm`

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Properties

### Field

```ts
Field: FieldComponent<TFormData, TFormValidator>;
```

A React component to render form fields. With this, you can render and manage individual form fields.

#### Defined in

[useForm.tsx:21](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L21)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => ReactNode;
```

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

#### Defined in

[useForm.tsx:35](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L35)

***

### useField

```ts
useField: UseField<TFormData, TFormValidator>;
```

A custom React hook that provides functionalities related to individual form fields. It gives you access to field values, errors, and allows you to set or update field values.

#### Defined in

[useForm.tsx:25](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L25)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => TSelected;
```

A `useStore` hook that connects to the internal store of the form. It can be used to access the form's current state or any other related state information. You can optionally pass in a selector function to cherry-pick specific parts of the state

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`TSelected`

#### Defined in

[useForm.tsx:29](https://github.com/TanStack/form/blob/main/packages/react-form/src/useForm.tsx#L29)
