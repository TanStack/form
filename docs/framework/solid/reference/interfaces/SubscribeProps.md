---
id: SubscribeProps
title: SubscribeProps
---

# Interface: SubscribeProps\<TSourceData, TSelected\>

Defined in: [packages/solid-form/src/Subscribe.public.ts:14](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Subscribe.public.ts#L14)

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

Defined in: [packages/solid-form/src/Subscribe.public.ts:18](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Subscribe.public.ts#L18)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [packages/solid-form/src/Subscribe.public.ts:16](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Subscribe.public.ts#L16)

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

Defined in: [packages/solid-form/src/Subscribe.public.ts:15](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Subscribe.public.ts#L15)

***

### when()?

```ts
optional when: (selected) => boolean;
```

Defined in: [packages/solid-form/src/Subscribe.public.ts:17](https://github.com/TanStack/form/blob/main/packages/solid-form/src/Subscribe.public.ts#L17)

#### Parameters

##### selected

`NoInfer`\<`TSelected`\>

#### Returns

`boolean`
