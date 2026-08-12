---
id: TanStackFormGroup
title: TanStackFormGroup
---

# Class: TanStackFormGroup\<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormValidators, TSubmitReturn\>

Defined in: [form-group.ts:24](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L24)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName` *extends* `DeepKeys`\<`TFormData`\>

### TGroupValue

`TGroupValue` *extends* `DeepValue`\<`TFormData`, `TGroupName`\>

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Constructors

### Constructor

```ts
new TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormValidators, TSubmitReturn>(): TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormValidators, TSubmitReturn>;
```

Defined in: [form-group.ts:83](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L83)

#### Returns

`TanStackFormGroup`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormValidators`, `TSubmitReturn`\>

## Properties

### name

```ts
name: InputSignal<TGroupName>;
```

Defined in: [form-group.ts:34](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L34)

***

### onSubmit

```ts
onSubmit: InputSignal<((context) => void | Promise<void>) | undefined>;
```

Defined in: [form-group.ts:36](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L36)

***

### onSubmitInvalid

```ts
onSubmitInvalid: InputSignal<((context) => void | Promise<void>) | undefined>;
```

Defined in: [form-group.ts:46](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L46)

***

### tanstackFormGroup

```ts
tanstackFormGroup: InputSignal<InternalFormApi<TFormData, TFormValidators, TSubmitReturn>>;
```

Defined in: [form-group.ts:32](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L32)

***

### validators

```ts
validators: InputSignal<NoInfer<TGroupValidators> | undefined>;
```

Defined in: [form-group.ts:35](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L35)

## Accessors

### api

#### Get Signature

```ts
get api(): InternalFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupValidators, ToFormErrorTypes<TFormValidators, TSubmitReturn>>;
```

Defined in: [form-group.ts:76](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/form-group.ts#L76)

##### Returns

`InternalFormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>
