---
id: FormComponentRegistration
title: FormComponentRegistration
---

Defined in: [packages/react-form/src/AppForm/helpers/formComponent.public.ts:178](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formComponent.public.ts#L178)

A component prepared by `formComponent.create()` to receive a form API through a
selected prop.

Register the component in `createFormHook`'s `formComponents` to expose it on
each form API. Callers supply the remaining props.

## Remarks

**Important:** Render the component as a registered form component, such as
`<form.Save />`, or inside one. Rendering outside that form context throws an
error, even if a form prop is supplied.

## Example

```tsx
const { formComponent } = getFormHookHelpers()

function SaveButton({ owner, label }: { owner: AnyReactFormApi; label: string }) {
  return (
    <button type="button" onClick={() => void owner.handleSubmit()}>
      {label}
    </button>
  )
}

const Save = formComponent.create({
  component: SaveButton,
  replaceProperty: 'owner',
})

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: { Save },
})

function Profile() {
  const form = useAppForm({ defaultValues: { name: '' } })
  // The form supplies `owner`. Callers supply `label`.
  return <form.Save label="Save profile" />
}
```

## Extends

- `FunctionComponent`\<`RegisteredComponentProps`\<`TComponent`, `TPropKey`\>\>

## Type Parameters

### TComponent

`TComponent` *extends* `FunctionComponent`\<`any`\>

Library-managed. Do not specify explicitly.

### TPropKey

`TPropKey` *extends* `StringProps`\<`TComponent`\>

Library-managed. Do not specify explicitly.

```ts
FormComponentRegistration(props): ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/AppForm/helpers/formComponent.public.ts:178](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formComponent.public.ts#L178)

A component prepared by `formComponent.create()` to receive a form API through a
selected prop.

Register the component in `createFormHook`'s `formComponents` to expose it on
each form API. Callers supply the remaining props.

## Parameters

### props

`RegisteredComponentProps`

## Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Remarks

**Important:** Render the component as a registered form component, such as
`<form.Save />`, or inside one. Rendering outside that form context throws an
error, even if a form prop is supplied.

## Example

```tsx
const { formComponent } = getFormHookHelpers()

function SaveButton({ owner, label }: { owner: AnyReactFormApi; label: string }) {
  return (
    <button type="button" onClick={() => void owner.handleSubmit()}>
      {label}
    </button>
  )
}

const Save = formComponent.create({
  component: SaveButton,
  replaceProperty: 'owner',
})

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: { Save },
})

function Profile() {
  const form = useAppForm({ defaultValues: { name: '' } })
  // The form supplies `owner`. Callers supply `label`.
  return <form.Save label="Save profile" />
}
```

## Properties

### displayName?

```ts
optional displayName?: string;
```

Defined in: node\_modules/.pnpm/@types+react@19.2.18/node\_modules/@types/react/index.d.ts:1085

Used in debugging messages. You might want to set it
explicitly if you want to display a different name for
debugging purposes.

#### See

[Legacy React Docs](https://legacy.reactjs.org/docs/react-component.html#displayname)

#### Example

```tsx

const MyComponent: FC = () => {
  return <div>Hello!</div>
}

MyComponent.displayName = 'MyAwesomeComponent'
```

#### Inherited from

```ts
FunctionComponent.displayName
```

***

### ~~propTypes?~~

```ts
optional propTypes?: any;
```

Defined in: node\_modules/.pnpm/@types+react@19.2.18/node\_modules/@types/react/index.d.ts:1066

Ignored by React.

#### Deprecated

Only kept in types for backwards compatibility. Will be removed in a future major release.

#### Inherited from

```ts
FunctionComponent.propTypes
```
