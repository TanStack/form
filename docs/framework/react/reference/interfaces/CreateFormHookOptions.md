---
id: CreateFormHookOptions
title: CreateFormHookOptions
---

# Interface: CreateFormHookOptions\<TFormComponents, TFieldComponents\>

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:56](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L56)

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
    actions: {
      SubmitButton,
    },
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

// Registered namespaces retain their shape on the form and field APIs:
// <form.actions.SubmitButton />
// <field.inputs.TextField />
```

## Extends

- [`ReactFormComponentMap`](ReactFormComponentMap.md)\<`TFormComponents`, `TFieldComponents`\>

## Type Parameters

### TFormComponents

`TFormComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

Library-managed. Do not specify explicitly.

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

Library-managed. Do not specify explicitly.

## Properties

### defaultFieldOptions?

```ts
optional defaultFieldOptions?: DefaultFieldOptions;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:89](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L89)

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

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:105](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L105)

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

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:74](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L74)

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

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:31](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L31)

Components and component namespaces exposed on each App Field API.

#### Inherited from

[`ReactFormComponentMap`](ReactFormComponentMap.md).[`fieldComponents`](ReactFormComponentMap.md#fieldcomponents)

***

### formComponents

```ts
formComponents: TFormComponents;
```

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:29](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L29)

Components and component namespaces exposed on each App Form API.

#### Inherited from

[`ReactFormComponentMap`](ReactFormComponentMap.md).[`formComponents`](ReactFormComponentMap.md#formcomponents)
