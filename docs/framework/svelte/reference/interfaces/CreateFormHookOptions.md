---
id: CreateFormHookOptions
title: CreateFormHookOptions
---

# Interface: CreateFormHookOptions\<TFormComponents, TFieldComponents\>

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:46](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L46)

Configures the components and reusable defaults returned by
`createFormHook`.

Form core resolves each default object before the corresponding usage-site
options. Non-listener properties passed at the usage site take precedence,
including when explicitly set to `undefined`. Listener arrays follow the
configured `listenersMerge` strategy.

## Example

```ts
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

- [`SvelteFormComponentMap`](SvelteFormComponentMap.md)\<`TFormComponents`, `TFieldComponents`\>

## Type Parameters

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

Library-managed. Do not specify explicitly.

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

Library-managed. Do not specify explicitly.

## Properties

### defaultFieldOptions?

```ts
optional defaultFieldOptions?: DefaultFieldOptions;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:79](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L79)

Defaults for every field and array-field component owned by the form.

Non-listener options passed to the component override these defaults,
including when explicitly set to `undefined`. Listener arrays follow
`listenersMerge`. This includes `group.Field` and `group.ArrayField`.

#### Example

```ts
defaultFieldOptions: {
  errorVisibility: ({ fieldState }) => fieldState.meta.isBlurred,
},
```

***

### defaultFormGroupOptions?

```ts
optional defaultFormGroupOptions?: DefaultFormGroupOptions;
```

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:95](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L95)

Defaults for every `form.FormGroup` component.

Options passed to the component override these defaults, including when
an option is explicitly `undefined`.

#### Example

```ts
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

Defined in: [packages/svelte-form/src/AppForm/createFormHookTypes.public.ts:64](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/createFormHookTypes.public.ts#L64)

Defaults for every form created by `useAppForm`.

Non-listener options returned by the `useAppForm` options accessor
override these defaults, including when explicitly set to `undefined`.
Listener arrays follow `listenersMerge`.

#### Example

```ts
defaultFormOptions: {
  errorVisibility: ({ state }) => state.submissionAttempts > 0,
},
```

***

### fieldComponents

```ts
fieldComponents: TFieldComponents;
```

Defined in: [packages/svelte-form/src/AppForm/componentMap.public.ts:8](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/componentMap.public.ts#L8)

#### Inherited from

[`SvelteFormComponentMap`](SvelteFormComponentMap.md).[`fieldComponents`](SvelteFormComponentMap.md#fieldcomponents)

***

### formComponents

```ts
formComponents: TFormComponents;
```

Defined in: [packages/svelte-form/src/AppForm/componentMap.public.ts:7](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/AppForm/componentMap.public.ts#L7)

#### Inherited from

[`SvelteFormComponentMap`](SvelteFormComponentMap.md).[`formComponents`](SvelteFormComponentMap.md#formcomponents)
