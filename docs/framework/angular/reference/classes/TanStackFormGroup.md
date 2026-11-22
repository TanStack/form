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

### TSubmitReturn

`TSubmitReturn` = `void`

## Constructors

### Constructor

```ts
new TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TSubmitReturn>(): TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TSubmitReturn>;
```

Defined in: [form-group.ts:85](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L85)

#### Returns

`TanStackFormGroup`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TSubmitReturn`\>

## Properties

### name

```ts
name: InputSignal<TGroupName>;
```

Defined in: [form-group.ts:34](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L34)

***

### onSubmit

```ts
onSubmit: InputSignal<
  | FormGroupSubmitFn<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TSubmitReturn>
| undefined>;
```

Defined in: [form-group.ts:36](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L36)

***

### onSubmitInvalid

```ts
onSubmitInvalid: InputSignal<
  | FormGroupOnSubmitInvalidFn<TFormData, TGroupName, TGroupValue, NoInfer<ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn>>, TFormError>
| undefined>;
```

Defined in: [form-group.ts:47](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L47)

***

### tanstackFormGroup

```ts
tanstackFormGroup: InputSignal<FormApi<TFormData, TFormError>>;
```

Defined in: [form-group.ts:33](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L33)

***

### validators

```ts
validators: InputSignal<NoInfer<TGroupValidators> | undefined>;
```

Defined in: [form-group.ts:35](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L35)

## Accessors

### api

#### Get Signature

```ts
get api(): InternalFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormError, TSubmitReturn>;
```

Defined in: [form-group.ts:78](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L78)

##### Returns

`InternalFormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TSubmitReturn`\>
