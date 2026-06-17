---
id: SolidFormSubscribeProps
title: SolidFormSubscribeProps
---

# Interface: SolidFormSubscribeProps\<TFormData, TFormValidatorMetas, TSubmitReturn, TSelected\>

Defined in: [packages/solid-form/src/createForm.public.ts:22](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L22)

## Type Parameters

### TFormData

`TFormData`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TSelected

`TSelected`

## Properties

### children

```ts
children: Element | (state) => Element;
```

Defined in: [packages/solid-form/src/createForm.public.ts:35](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L35)

***

### selector()

```ts
selector: (state) => TSelected;
```

Defined in: [packages/solid-form/src/createForm.public.ts:32](https://github.com/TanStack/form-v2/blob/main/packages/solid-form/src/createForm.public.ts#L32)

Select from the full form state. Children receive a Solid accessor for the
selected value.

#### Parameters

##### state

`FormState`\<`TFormData`, `TFormValidatorMetas`, `TSubmitReturn`\>

#### Returns

`TSelected`
