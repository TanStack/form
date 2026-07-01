---
id: FormOptionsApi
title: FormOptionsApi
---

# Interface: FormOptionsApi()

Defined in: [packages/form-core/src/utils.public.ts:58](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/utils.public.ts#L58)

```ts
FormOptionsApi<TFormData, TFormValidators, TSubmitReturn>(options): FormOptions<TFormData, TFormValidators, TSubmitReturn>;
```

Defined in: [packages/form-core/src/utils.public.ts:59](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/utils.public.ts#L59)

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

### looseSchema()

```ts
looseSchema: <TFormValidators, TFormData, TSubmitReturn>(options) => FormOptions<InferUnion<TFormData, FormValidatorData<TFormValidators>>, TFormValidators, TSubmitReturn>;
```

Defined in: [packages/form-core/src/utils.public.ts:81](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/utils.public.ts#L81)

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

### strictSchema()

```ts
strictSchema: <TFormValidators, TFormData, TSubmitReturn>(options) => FormOptions<FormValidatorData<TFormValidators>, TFormValidators, TSubmitReturn>;
```

Defined in: [packages/form-core/src/utils.public.ts:67](https://github.com/TanStack/form-v2/blob/main/packages/form-core/src/utils.public.ts#L67)

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
