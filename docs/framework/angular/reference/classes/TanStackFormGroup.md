---
id: TanStackFormGroup
title: TanStackFormGroup
---

Defined in: [form-group.ts:25](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L25)

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName` *extends* `DeepKeys`\<`TFormData`\>

### TGroupValue

`TGroupValue` *extends* `DeepValue`\<`TFormData`, `TGroupName`\>

### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

## Constructors

### Constructor

```ts
new TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError>(): TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError>;
```

Defined in: [form-group.ts:82](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L82)

#### Returns

`TanStackFormGroup`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`\>

## Properties

### name

```ts
name: InputSignal<TGroupName>;
```

Defined in: [form-group.ts:33](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L33)

***

### onSubmit

```ts
onSubmit: InputSignal<
  | FormGroupSubmitFn<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError>
| undefined>;
```

Defined in: [form-group.ts:35](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L35)

***

### onSubmitInvalid

```ts
onSubmitInvalid: InputSignal<
  | FormGroupOnSubmitInvalidFn<TFormData, TGroupName, TGroupValue, NoInfer<ToFormGroupErrorTypes<TGroupValidators>>, TFormError>
| undefined>;
```

Defined in: [form-group.ts:45](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L45)

***

### tanstackFormGroup

```ts
tanstackFormGroup: InputSignal<FormApi<TFormData, TFormError>>;
```

Defined in: [form-group.ts:32](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L32)

***

### validators

```ts
validators: InputSignal<NoInfer<TGroupValidators> | undefined>;
```

Defined in: [form-group.ts:34](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L34)

## Accessors

### api

#### Get Signature

```ts
get api(): InternalFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError>;
```

Defined in: [form-group.ts:75](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L75)

##### Returns

`InternalFormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`\>
