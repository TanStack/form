---
id: VueFormSubscribeComponent
title: VueFormSubscribeComponent
---

# Type Alias: VueFormSubscribeComponent\<TFormData, TFormErrorTypes\>

```ts
type VueFormSubscribeComponent<TFormData, TFormErrorTypes> = <TSelected>(props) => VueComponentInstance<VueFormSubscribeProps<TFormData, TFormErrorTypes, TSelected>, {
  default: NoInfer<TSelected>;
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:86](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L86)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

## Parameters

### props

[`VueFormSubscribeProps`](VueFormSubscribeProps.md)\<`TFormData`, `TFormErrorTypes`, `TSelected`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormSubscribeProps`](VueFormSubscribeProps.md)\<`TFormData`, `TFormErrorTypes`, `TSelected`\>, \{
  `default`: `NoInfer`\<`TSelected`\>;
\}\>
