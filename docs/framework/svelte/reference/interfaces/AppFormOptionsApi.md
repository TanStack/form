---
id: AppFormOptionsApi
title: AppFormOptionsApi
---

# Interface: AppFormOptionsApi()\<TComponents\>

Defined in: [packages/svelte-form/src/AppForm/appFormOptions.public.ts:21](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/appFormOptions.public.ts#L21)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySvelteFormComponentMap`](../type-aliases/AnySvelteFormComponentMap.md)

```ts
AppFormOptionsApi<TFormData, TFormValidators, TSubmitReturn>(options): AppFormOptions<TFormData, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/appFormOptions.public.ts:24](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/appFormOptions.public.ts#L24)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Parameters

### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Returns

[`AppFormOptions`](AppFormOptions.md)\<`TFormData`, `TFormValidators`, `TSubmitReturn`, `TComponents`\>

## Properties

### looseSchema

```ts
looseSchema: <TFormValidators, TFormData, TSubmitReturn>(options) => AppFormOptions<InferUnion<TFormData, FormValidatorData<TFormValidators>>, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/appFormOptions.public.ts:45](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/appFormOptions.public.ts#L45)

#### Type Parameters

##### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`any`\>

##### TFormData

`TFormData` *extends* `any`

##### TSubmitReturn

`TSubmitReturn`

#### Parameters

##### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

#### Returns

[`AppFormOptions`](AppFormOptions.md)\<`InferUnion`\<`TFormData`, `FormValidatorData`\<`TFormValidators`\>\>, `TFormValidators`, `TSubmitReturn`, `TComponents`\>

***

### strictSchema

```ts
strictSchema: <TFormValidators, TFormData, TSubmitReturn>(options) => AppFormOptions<FormValidatorData<TFormValidators>, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [packages/svelte-form/src/AppForm/appFormOptions.public.ts:32](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/AppForm/appFormOptions.public.ts#L32)

#### Type Parameters

##### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`any`\>

##### TFormData

`TFormData` *extends* `any`

##### TSubmitReturn

`TSubmitReturn`

#### Parameters

##### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

#### Returns

[`AppFormOptions`](AppFormOptions.md)\<`FormValidatorData`\<`TFormValidators`\>, `TFormValidators`, `TSubmitReturn`, `TComponents`\>
