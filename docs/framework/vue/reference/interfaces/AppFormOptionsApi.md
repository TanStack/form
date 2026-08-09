---
id: AppFormOptionsApi
title: AppFormOptionsApi
---

# Interface: AppFormOptionsApi()\<TComponents\>

Defined in: [packages/vue-form/src/AppForm/appFormOptions.public.ts:21](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/appFormOptions.public.ts#L21)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](../type-aliases/AnyVueFormComponentMap.md)

```ts
AppFormOptionsApi<TFormData, TFormValidators, TSubmitReturn>(options): AppFormOptions<TFormData, TFormValidators, TSubmitReturn, TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/appFormOptions.public.ts:22](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/appFormOptions.public.ts#L22)

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

Defined in: [packages/vue-form/src/AppForm/appFormOptions.public.ts:43](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/appFormOptions.public.ts#L43)

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

Defined in: [packages/vue-form/src/AppForm/appFormOptions.public.ts:30](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/vue-form/src/AppForm/appFormOptions.public.ts#L30)

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
