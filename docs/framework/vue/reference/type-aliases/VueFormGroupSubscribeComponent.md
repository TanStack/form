---
id: VueFormGroupSubscribeComponent
title: VueFormGroupSubscribeComponent
---

# Type Alias: VueFormGroupSubscribeComponent()\<TGroupValue, TGroupErrorTypes\>

```ts
type VueFormGroupSubscribeComponent<TGroupValue, TGroupErrorTypes> = <TSelected>(props) => VueComponentInstance<VueFormGroupSubscribeProps<TGroupValue, TGroupErrorTypes, TSelected>, {
  default: NoInfer<TSelected>;
}>;
```

Defined in: [packages/vue-form/src/VueForm/Components.public.ts:224](https://github.com/TanStack/form/blob/main/packages/vue-form/src/VueForm/Components.public.ts#L224)

## Type Parameters

### TGroupValue

`TGroupValue`

### TGroupErrorTypes

`TGroupErrorTypes` *extends* `FormErrorTypes`

## Parameters

### props

[`VueFormGroupSubscribeProps`](VueFormGroupSubscribeProps.md)\<`TGroupValue`, `TGroupErrorTypes`, `TSelected`\> & `PublicProps`

## Returns

`VueComponentInstance`\<[`VueFormGroupSubscribeProps`](VueFormGroupSubscribeProps.md)\<`TGroupValue`, `TGroupErrorTypes`, `TSelected`\>, \{
  `default`: `NoInfer`\<`TSelected`\>;
\}\>
