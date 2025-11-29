---
id: WithFieldGroupProps
title: WithFieldGroupProps
---

# Interface: WithFieldGroupProps\<TFieldGroupData, TFieldComponents, TFormComponents, TSubmitMeta, TRenderProps\>

Defined in: [packages/solid-form/src/createFormHook.tsx:257](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFormHook.tsx#L257)

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

Defined in: [packages/solid-form/src/createFormHook.tsx:265](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFormHook.tsx#L265)

***

### render()

```ts
render: (props) => Element;
```

Defined in: [packages/solid-form/src/createFormHook.tsx:266](https://github.com/TanStack/form/blob/main/packages/solid-form/src/createFormHook.tsx#L266)

#### Parameters

##### props

`ParentProps`\<`NoInfer`\<`TRenderProps`\> & `object`\>

#### Returns

`Element`
