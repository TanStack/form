---
id: SubscribeComponent
title: SubscribeComponent
---

Defined in: [packages/octane-form/src/types.ts:21](https://github.com/TanStack/form/blob/main/packages/octane-form/src/types.ts#L21)

Subscribe to selected state, or render static Octane children.

OctaneNode includes unknown, so combining it directly with a render callback
would erase the callback's contextual type. Infer static children separately
and exclude functions so callbacks always receive the selected state.

## Type Parameters

### TState

`TState`

```ts
SubscribeComponent<TSelected, TChildren>(props): unknown;
```

Defined in: [packages/octane-form/src/types.ts:22](https://github.com/TanStack/form/blob/main/packages/octane-form/src/types.ts#L22)

Subscribe to selected state, or render static Octane children.

OctaneNode includes unknown, so combining it directly with a render callback
would erase the callback's contextual type. Infer static children separately
and exclude functions so callbacks always receive the selected state.

## Type Parameters

### TSelected

`TSelected` = `NoInfer`\<`TState`\>

### TChildren

`TChildren` = `never`

## Parameters

### props

#### children

  \| (`state`) => `unknown`
  \| `TChildren` *extends* (...`args`) => `unknown` ? `never` : `TChildren`

#### selector?

(`state`) => `TSelected`

## Returns

`unknown`
