---
id: SubscribeProps
title: SubscribeProps
---

# Interface: SubscribeProps\<TSourceData, TSelected\>

Defined in: [packages/preact-form/src/Subscribe.public.tsx:17](https://github.com/TanStack/form/blob/main/packages/preact-form/src/Subscribe.public.tsx#L17)

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
children: ComponentChildren | (state) => ComponentChildren;
```

Defined in: [packages/preact-form/src/Subscribe.public.tsx:28](https://github.com/TanStack/form/blob/main/packages/preact-form/src/Subscribe.public.tsx#L28)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [packages/preact-form/src/Subscribe.public.tsx:23](https://github.com/TanStack/form/blob/main/packages/preact-form/src/Subscribe.public.tsx#L23)

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

Defined in: [packages/preact-form/src/Subscribe.public.tsx:18](https://github.com/TanStack/form/blob/main/packages/preact-form/src/Subscribe.public.tsx#L18)

***

### when()?

```ts
optional when: (selected) => boolean;
```

Defined in: [packages/preact-form/src/Subscribe.public.tsx:27](https://github.com/TanStack/form/blob/main/packages/preact-form/src/Subscribe.public.tsx#L27)

Optional. If provided, the component will only render when the `when` function returns `true`.

#### Parameters

##### selected

`NoInfer`\<`TSelected`\>

#### Returns

`boolean`
