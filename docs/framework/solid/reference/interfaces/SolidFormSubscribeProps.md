---
id: SolidFormSubscribeProps
title: SolidFormSubscribeProps
---

# Interface: SolidFormSubscribeProps\<TFormData, TFormErrorTypes, TSelected\>

Defined in: [packages/solid-form/src/createForm.public.ts:20](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L20)

## Type Parameters

### TFormData

`TFormData`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes`

### TSelected

`TSelected`

## Properties

### children

```ts
children: Element | (state) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:30](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L30)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [packages/solid-form/src/createForm.public.ts:29](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L29)

Select from the full form state. Children receive a Solid accessor for the
selected value.

#### Parameters

##### state

`FormState`\<`TFormData`, `TFormErrorTypes`\>

#### Returns

`TSelected`
