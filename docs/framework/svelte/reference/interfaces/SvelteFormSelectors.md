---
id: SvelteFormSelectors
title: SvelteFormSelectors
---

# Interface: SvelteFormSelectors\<TFormData, TFormErrorTypes\>

Defined in: [packages/svelte-form/src/formApiTypes.public.ts:14](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/formApiTypes.public.ts#L14)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

## Properties

### useSelector

```ts
useSelector: <TSelected>(selector?) => object;
```

Defined in: [packages/svelte-form/src/formApiTypes.public.ts:18](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/formApiTypes.public.ts#L18)

#### Type Parameters

##### TSelected

`TSelected` = `FormState`\<`TFormData`, `TFormErrorTypes`\>

#### Parameters

##### selector?

(`state`) => `TSelected`

#### Returns

`object`

##### current

```ts
readonly current: TSelected;
```
