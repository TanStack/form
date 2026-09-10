---
id: useIsomorphicLayoutEffect
title: useIsomorphicLayoutEffect
---

# Variable: useIsomorphicLayoutEffect()

```ts
const useIsomorphicLayoutEffect: (effect, inputs?) => void;
```

Defined in: [packages/preact-form/src/useIsomorphicLayoutEffect.ts:3](https://github.com/TanStack/form/blob/main/packages/preact-form/src/useIsomorphicLayoutEffect.ts#L3)

Accepts a function that contains imperative, possibly effectful code.
Use this to read layout from the DOM and synchronously re-render.
Updates scheduled inside `useLayoutEffect` will be flushed synchronously, after all DOM mutations but before the browser has a chance to paint.
Prefer the standard `useEffect` hook when possible to avoid blocking visual updates.

## Parameters

### effect

`EffectCallback`

Imperative function that can return a cleanup function

### inputs?

`Inputs`

If present, effect will only activate if the values in the list change (using ===).

## Returns

`void`
