---
id: VueFormGroupSubscribeComponent
title: VueFormGroupSubscribeComponent
---

```ts
type VueFormGroupSubscribeComponent<TGroupValue, TGroupError> = <TSelected>(props) => VueComponentInstance<VueFormGroupSubscribeProps<TGroupValue, TGroupError, TSelected>, {
  default: NoInfer<TSelected>;
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:223](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L223)

## Type Parameters

### TGroupValue

`TGroupValue`

### TGroupError

`TGroupError` *extends* `ScopedErrorTypes`

## Parameters

### props

[`VueFormGroupSubscribeProps`](VueFormGroupSubscribeProps.md)\<`TGroupValue`, `TGroupError`, `TSelected`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormGroupSubscribeProps`](VueFormGroupSubscribeProps.md)\<`TGroupValue`, `TGroupError`, `TSelected`\>, \{
  `default`: `NoInfer`\<`TSelected`\>;
\}\>
