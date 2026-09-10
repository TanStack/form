---
id: ReactFormComponentMap
title: ReactFormComponentMap
---

# Interface: ReactFormComponentMap\<TFormComponents, TFieldComponents\>

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:24](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L24)

## Extended by

- [`CreateFormHookOptions`](CreateFormHookOptions.md)

## Type Parameters

### TFormComponents

`TFormComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

### TFieldComponents

`TFieldComponents` *extends* [`ReactComponentTree`](../type-aliases/ReactComponentTree.md)

## Properties

### fieldComponents

```ts
fieldComponents: TFieldComponents;
```

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:31](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L31)

Components and component namespaces exposed on each App Field API.

***

### formComponents

```ts
formComponents: TFormComponents;
```

Defined in: [packages/react-form/src/AppForm/componentMap.public.ts:29](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/componentMap.public.ts#L29)

Components and component namespaces exposed on each App Form API.
