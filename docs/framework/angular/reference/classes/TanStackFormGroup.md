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

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Constructors

### Constructor

```ts
new TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormValidators, TSubmitReturn>(): TanStackFormGroup<TFormData, TGroupName, TGroupValue, TGroupValidators, TFormValidators, TSubmitReturn>;
```

Defined in: [form-group.ts:84](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L84)

#### Returns

`TanStackFormGroup`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormValidators`, `TSubmitReturn`\>

## Properties

### name

```ts
name: InputSignal<TGroupName>;
```

Defined in: [form-group.ts:35](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L35)

***

### onSubmit

```ts
onSubmit: InputSignal<
  | FormGroupSubmitFn<TFormData, TGroupName, TGroupValue, TGroupValidators, ToFormErrorTypes<TFormValidators, TSubmitReturn>>
| undefined>;
```

Defined in: [form-group.ts:37](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L37)

***

### onSubmitInvalid

```ts
onSubmitInvalid: InputSignal<((context) => void | Promise<void>) | undefined>;
```

Defined in: [form-group.ts:47](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L47)

***

### tanstackFormGroup

```ts
tanstackFormGroup: InputSignal<InternalFormApi<TFormData, TFormValidators, TSubmitReturn>>;
```

Defined in: [form-group.ts:33](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L33)

***

### validators

```ts
validators: InputSignal<NoInfer<TGroupValidators> | undefined>;
```

Defined in: [form-group.ts:36](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L36)

## Accessors

### api

#### Get Signature

```ts
get api(): InternalFormGroupApi<TFormData, TGroupName, TGroupValue, TGroupValidators, ToFormErrorTypes<TFormValidators, TSubmitReturn>>;
```

Defined in: [form-group.ts:77](https://github.com/TanStack/form/blob/main/packages/angular-form/src/form-group.ts#L77)

##### Returns

`InternalFormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>
