---
id: FormOptionsApi
title: FormOptionsApi
---

# Interface: FormOptionsApi()

Defined in: [utils.public.ts:53](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L53)

```ts
FormOptionsApi<TFormData, TFormValidators, TSubmitReturn>(options): FormOptions<TFormData, TFormValidators, TSubmitReturn>;
```

Defined in: [utils.public.ts:54](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L54)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Returns

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Properties

### looseSchema

```ts
looseSchema: <TFormValidators, TFormData, TSubmitReturn>(options) => FormOptions<InferUnion<TFormData, FormValidatorData<TFormValidators>>, TFormValidators, TSubmitReturn>;
```

Defined in: [utils.public.ts:76](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L76)

#### Type Parameters

##### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`any`\>

##### TFormData

`TFormData` *extends* `any`

##### TSubmitReturn

`TSubmitReturn`

#### Parameters

##### options

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

#### Returns

[`FormOptions`](FormOptions.md)\<[`InferUnion`](../type-aliases/InferUnion.md)\<`TFormData`, [`FormValidatorData`](../type-aliases/FormValidatorData.md)\<`TFormValidators`\>\>, `TFormValidators`, `TSubmitReturn`\>

***

### strictSchema

```ts
strictSchema: <TFormValidators, TFormData, TSubmitReturn>(options) => FormOptions<FormValidatorData<TFormValidators>, TFormValidators, TSubmitReturn>;
```

Defined in: [utils.public.ts:62](https://github.com/TanStack/form/blob/main/packages/form-core/src/utils.public.ts#L62)

#### Type Parameters

##### TFormValidators

`TFormValidators` *extends* [`FormValidators`](../type-aliases/FormValidators.md)\<`any`\>

##### TFormData

`TFormData` *extends* `any`

##### TSubmitReturn

`TSubmitReturn`

#### Parameters

##### options

[`FormOptions`](FormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

#### Returns

[`FormOptions`](FormOptions.md)\<[`FormValidatorData`](../type-aliases/FormValidatorData.md)\<`TFormValidators`\>, `TFormValidators`, `TSubmitReturn`\>
