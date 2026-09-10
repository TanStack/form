---
id: WithFieldGroupProps
title: WithFieldGroupProps
---

# Interface: WithFieldGroupProps\<TFieldGroupData, TFieldComponents, TFormComponents, TSubmitMeta, TRenderProps\>

Defined in: [packages/preact-form/src/createFormHook.tsx:257](https://github.com/TanStack/form/blob/main/packages/preact-form/src/createFormHook.tsx#L257)

## Extends

- `BaseFormOptions`\<`TFieldGroupData`, `TSubmitMeta`\>

## Type Parameters

### TFieldGroupData

`TFieldGroupData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `ComponentType`\<`any`\>\>

### TSubmitMeta

`TSubmitMeta`

### TRenderProps

`TRenderProps` *extends* `object` = `Record`\<`string`, `never`\>

## Properties

### props?

```ts
optional props: TRenderProps;
```

Defined in: [packages/preact-form/src/createFormHook.tsx:265](https://github.com/TanStack/form/blob/main/packages/preact-form/src/createFormHook.tsx#L265)

***

### render

```ts
render: FunctionComponent<PropsWithChildren<NoInfer<TRenderProps> & object>>;
```

Defined in: [packages/preact-form/src/createFormHook.tsx:266](https://github.com/TanStack/form/blob/main/packages/preact-form/src/createFormHook.tsx#L266)
