---
id: SubscribeProps
title: SubscribeProps
---

# Interface: SubscribeProps\<TSourceData, TSelected\>

Defined in: [packages/react-form/src/Subscribe.public.tsx:20](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/Subscribe.public.tsx#L20)

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
children: 
  | ReactNode
  | Promise<ReactNode>
| (state) => ReactNode | Promise<ReactNode>;
```

Defined in: [packages/react-form/src/Subscribe.public.tsx:31](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/Subscribe.public.tsx#L31)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [packages/react-form/src/Subscribe.public.tsx:26](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/Subscribe.public.tsx#L26)

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

Defined in: [packages/react-form/src/Subscribe.public.tsx:21](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/Subscribe.public.tsx#L21)

***

### when()?

```ts
optional when: (selected) => boolean;
```

Defined in: [packages/react-form/src/Subscribe.public.tsx:30](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/Subscribe.public.tsx#L30)

Optional. If provided, the component will only render when the `when` function returns `true`.

#### Parameters

##### selected

`NoInfer`\<`TSelected`\>

#### Returns

`boolean`
