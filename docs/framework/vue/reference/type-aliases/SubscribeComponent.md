---
id: SubscribeComponent
title: SubscribeComponent
---

# Type Alias: SubscribeComponent()

```ts
type SubscribeComponent = <TSourceData, TSelected>(props) => InstanceType<VueComponentWithSlots<SubscribeProps<TSourceData, TSelected>, {
  default: NoInfer<TSelected>;
}>>;
```

Defined in: [packages/vue-form/src/Subscribe.public.ts:20](https://github.com/TanStack/form/blob/main/packages/vue-form/src/Subscribe.public.ts#L20)

## Parameters

### props

[`SubscribeProps`](../interfaces/SubscribeProps.md)\<`TSourceData`, `TSelected`\>

## Returns

`InstanceType`\<`VueComponentWithSlots`\<[`SubscribeProps`](../interfaces/SubscribeProps.md)\<`TSourceData`, `TSelected`\>, \{
  `default`: `NoInfer`\<`TSelected`\>;
\}\>\>
