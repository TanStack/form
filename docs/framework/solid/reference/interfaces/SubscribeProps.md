---
id: SubscribeProps
title: SubscribeProps
---

# Interface: SubscribeProps\<TSourceData, TSelected\>

Defined in: [packages/solid-form/src/Subscribe.public.ts:21](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/Subscribe.public.ts#L21)

Subscribe to `form.atom` (full form state). The selector receives the full
FormState.

## Type Parameters

### TSourceData

`TSourceData`

### TSelected

`TSelected`

## Properties

### children

```ts
children: Element | (state) => Element;
```

Defined in: [packages/solid-form/src/Subscribe.public.ts:28](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/Subscribe.public.ts#L28)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [packages/solid-form/src/Subscribe.public.ts:27](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/Subscribe.public.ts#L27)

Select from full form state. Re-renders when the selected value changes
(shallow compare).

#### Parameters

##### state

`TSourceData`

#### Returns

`TSelected`

***

### source

```ts
source: SubscribeSource<TSourceData>;
```

Defined in: [packages/solid-form/src/Subscribe.public.ts:22](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/Subscribe.public.ts#L22)
