---
id: LitSubscribeMethod
title: LitSubscribeMethod
---

# Interface: LitSubscribeMethod\<TState\>

Defined in: [tanstack-form-controller.ts:148](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L148)

## Type Parameters

### TState

`TState`

## Methods

### subscribe()

```ts
subscribe<TSelected>(
   selector, 
   render, 
   when?): unknown;
```

Defined in: [tanstack-form-controller.ts:149](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L149)

#### Type Parameters

##### TSelected

`TSelected`

#### Parameters

##### selector

(`state`) => `TSelected`

##### render

`RenderCallback`\<`NoInfer`\<`TSelected`\>\>

##### when?

(`selected`) => `boolean`

#### Returns

`unknown`
