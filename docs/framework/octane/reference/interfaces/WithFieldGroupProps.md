---
id: WithFieldGroupProps
title: WithFieldGroupProps
---

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:216](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L216)

## Extends

- `BaseFormOptions`\<`TFieldGroupData`, `TSubmitMeta`\>

## Type Parameters

### TFieldGroupData

`TFieldGroupData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `HookComponentType`\<`any`\>\>

### TFormComponents

`TFormComponents` *extends* `Record`\<`string`, `HookComponentType`\<`any`\>\>

### TSubmitMeta

`TSubmitMeta`

### TRenderProps

`TRenderProps` *extends* `object` = `Record`\<`string`, `never`\>

## Properties

### props?

```ts
optional props: TRenderProps;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:223](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L223)

***

### render

```ts
render: HookFunctionComponent<HookPropsWithChildren<NoInfer<TRenderProps> & object>>;
```

Defined in: [packages/octane-form/src/createFormHook.tsrx.d.ts:224](https://github.com/TanStack/form/blob/main/packages/octane-form/src/createFormHook.tsrx.d.ts#L224)
