---
id: WithFieldGroupProps
title: WithFieldGroupProps
---

# Interface: WithFieldGroupProps\<TFieldGroupData, TFieldComponents, TFormComponents, TSubmitMeta, TRenderProps\>

Defined in: [packages/solid-form/src/createFormHook.tsx:263](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFormHook.tsx#L263)

## Extends

- `BaseFormOptions`\<`TFieldGroupData`, `TSubmitMeta`\>

## Type Parameters

### TFieldGroupData

`TFieldGroupData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>

### TSubmitMeta

`TSubmitMeta`

### TRenderProps

`TRenderProps` *extends* `Record`\<`string`, `unknown`\> = `Record`\<`string`, `never`\>

## Properties

### props?

```ts
optional props: TRenderProps;
```

Defined in: [packages/solid-form/src/createFormHook.tsx:271](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFormHook.tsx#L271)

***

### render()

```ts
render: (props) => Element;
```

Defined in: [packages/solid-form/src/createFormHook.tsx:272](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFormHook.tsx#L272)

#### Parameters

##### props

`ParentProps`\<`NoInfer`\<`TRenderProps`\> & `object`\>

#### Returns

`Element`
