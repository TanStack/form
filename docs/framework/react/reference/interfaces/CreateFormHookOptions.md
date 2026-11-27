---
id: CreateFormHookOptions
title: CreateFormHookOptions
---

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:61](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L61)

Configures the components and reusable defaults returned by
`createFormHook`.

Default objects are resolved by form core before the corresponding
usage-site options. Non-listener properties always take precedence,
including when explicitly set to `undefined`. Listener arrays follow the
configured `listenersMerge` strategy.

## Example

```tsx
const { useAppForm } = createFormHook({
  formComponents: {
    SubmitButton,
  },
  fieldComponents: {
    inputs: {
      TextField,
    },
  },
  defaultFormOptions: {
    errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
  },
  defaultFieldOptions: {
    errorBoundary: true,
  },
})

// Form components are flat; field components retain their namespaces:
// <form.SubmitButton />
// <field.inputs.TextField />
```

## Type Parameters

### TFormComponents

`TFormComponents` *extends* [`ReactFormComponents`](../type-aliases/ReactFormComponents.md)

Library-managed. Do not specify explicitly.

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

Library-managed. Do not specify explicitly.

## Properties

### defaultFieldOptions?

```ts
optional defaultFieldOptions?: DefaultFieldOptions;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:101](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L101)

Defaults for every field and array-field component owned by the form.

Non-listener options passed to the component override these defaults,
including when explicitly set to `undefined`. Listener arrays follow
`listenersMerge`. This includes `group.Field` and `group.ArrayField`.

#### Example

```tsx
defaultFieldOptions: {
  errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
},
```

***

### defaultFormGroupOptions?

```ts
optional defaultFormGroupOptions?: DefaultFormGroupOptions;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:117](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L117)

Defaults for every `form.FormGroup` component.

Options passed to the component override these defaults, including when
an option is explicitly `undefined`.

#### Example

```tsx
defaultFormGroupOptions: {
  onSubmitInvalid: ({ groupApi }) => {
    console.error('Invalid group', groupApi.name)
  },
},
```

***

### defaultFormOptions?

```ts
optional defaultFormOptions?: DefaultFormOptions;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:86](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L86)

Defaults for every form created by `useAppForm`.

Non-listener options passed to `useAppForm` override these defaults,
including when explicitly set to `undefined`. Listener arrays follow
`listenersMerge`.

#### Example

```tsx
defaultFormOptions: {
  errorVisibility: ({ state }) => state.submissionAttempts > 0,
},
```

***

### fieldComponents

```ts
fieldComponents: TFieldComponents;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:71](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L71)

***

### formComponents

```ts
formComponents: TFormComponents & CompatibleFormComponents<NoInfer<TFormComponents>, TFormComponents, TFieldComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHook.public.ts:65](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHook.public.ts#L65)
