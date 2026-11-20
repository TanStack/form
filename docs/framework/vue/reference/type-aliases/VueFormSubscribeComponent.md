---
id: VueFormSubscribeComponent
title: VueFormSubscribeComponent
---

```ts
type VueFormSubscribeComponent<TFormData, TFormError> = <TSelected>(props) => VueComponentInstance<VueFormSubscribeProps<TFormData, TFormError, TSelected>, {
  default: NoInfer<TSelected>;
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:86](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L86)

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

## Parameters

### props

[`VueFormSubscribeProps`](VueFormSubscribeProps.md)\<`TFormData`, `TFormError`, `TSelected`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormSubscribeProps`](VueFormSubscribeProps.md)\<`TFormData`, `TFormError`, `TSelected`\>, \{
  `default`: `NoInfer`\<`TSelected`\>;
\}\>
