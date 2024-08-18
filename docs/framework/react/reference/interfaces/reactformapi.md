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

[useForm.tsx:20](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/react-form/src/useForm.tsx#L20)

***

### Subscribe()

```ts
Subscribe: <TSelected>(props) => ReactNode;
```

A `Subscribe` function that allows you to listen and react to changes in the form's state. It's especially useful when you need to execute side effects or render specific components in response to state updates.

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

• **props**

• **props.children**: `ReactNode` \| (`state`) => `ReactNode`

• **props.selector?**

TypeScript versions <=5.0.4 have a bug that prevents
the type of the `TSelected` generic from being inferred
from the return type of this method.

In these versions, `TSelected` will fall back to the default
type (or `unknown` if that's not defined).

**See**

 - [This discussion on GitHub for the details](https://github.com/TanStack/form/pull/606/files#r1506715714)
 - [The bug report in `microsoft/TypeScript`](https://github.com/microsoft/TypeScript/issues/52786)

#### Returns

`ReactNode`

#### Defined in

[useForm.tsx:34](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/react-form/src/useForm.tsx#L34)

***

### useField

```ts
useField: UseField<TFormData, TFormValidator>;
```

A custom React hook that provides functionalities related to individual form fields. It gives you access to field values, errors, and allows you to set or update field values.

#### Defined in

[useForm.tsx:24](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/react-form/src/useForm.tsx#L24)

***

### useStore()

```ts
useStore: <TSelected>(selector?) => TSelected;
```

A `useStore` hook that connects to the internal store of the form. It can be used to access the form's current state or any other related state information. You can optionally pass in a selector function to cherry-pick specific parts of the state

#### Type Parameters

• **TSelected** = `FormState`\<`TFormData`\>

#### Parameters

• **selector?**

#### Returns

`TSelected`

#### Defined in

[useForm.tsx:28](https://github.com/TanStack/form/blob/03de1e83ad6580cff66ab58566f3003d93d4e34d/packages/react-form/src/useForm.tsx#L28)
