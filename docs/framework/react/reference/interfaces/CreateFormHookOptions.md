---
id: CreateFormHookOptions
title: CreateFormHookOptions
---

# Interface: CreateFormHookOptions\<TFormComponents, TFieldComponents\>

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:143](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L143)

Configures the components and reusable defaults returned by
`createFormHook`.

Default objects are shallowly applied before the corresponding usage-site
options. A usage-site property always takes precedence, including when its
value is explicitly `undefined`.

## Example

```tsx
const { useAppForm } = createFormHook({
  formComponents: {},
  fieldComponents: {
    TextField,
  },
  defaultFormOptions: {
    errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
  },
  defaultFieldOptions: {
    errorBoundary: true,
  },
})
```

## Extends

- [`ReactFormComponentMap`](ReactFormComponentMap.md)\<`TFormComponents`, `TFieldComponents`\>

## Type Parameters

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

Library-managed. Do not specify explicitly.

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

Library-managed. Do not specify explicitly.

## Properties

### defaultFieldOptions?

```ts
optional defaultFieldOptions?: CreateFormHookDefaultFieldOptions;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:175](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L175)

Defaults for direct `form.Field` and `form.ArrayField` components.

Options passed to the component override these defaults, including when
an option is explicitly `undefined`. These defaults do not apply to
`group.Field` or `group.ArrayField`.

#### Example

```tsx
defaultFieldOptions: {
  errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
},
```

***

### defaultFormGroupOptions?

```ts
optional defaultFormGroupOptions?: CreateFormHookDefaultFormGroupOptions;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:191](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L191)

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
optional defaultFormOptions?: CreateFormHookDefaultFormOptions;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:160](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L160)

Defaults for every form created by `useAppForm`.

Options passed to `useAppForm` override these defaults, including when an
option is explicitly `undefined`.

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

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:8](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L8)

#### Inherited from

[`ReactFormComponentMap`](ReactFormComponentMap.md).[`fieldComponents`](ReactFormComponentMap.md#fieldcomponents)

***

### formComponents

```ts
formComponents: TFormComponents;
```

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:7](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L7)

#### Inherited from

[`ReactFormComponentMap`](ReactFormComponentMap.md).[`formComponents`](ReactFormComponentMap.md#formcomponents)
