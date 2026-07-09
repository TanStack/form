---
id: FormGroupApiOptions
title: FormGroupApiOptions
---

# Interface: FormGroupApiOptions\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TSubmitMeta, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta\>

Defined in: [packages/form-core/src/FormGroupApi.ts:562](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L562)

## Extends

- [`FormGroupOptions`](FormGroupOptions.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TSubmitMeta`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* [`DeepKeys`](../type-aliases/DeepKeys.md)\<`TParentData`\>

### TData

`TData` *extends* [`DeepValue`](../type-aliases/DeepValue.md)\<`TParentData`, `TName`\>

### TOnMount

`TOnMount` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TSubmitMeta

`TSubmitMeta`

### TFormOnMount

`TFormOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChange

`TFormOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChangeAsync

`TFormOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnBlur

`TFormOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnBlurAsync

`TFormOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnSubmit

`TFormOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnSubmitAsync

`TFormOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnDynamic

`TFormOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnDynamicAsync

`TFormOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnServer

`TFormOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TParentSubmitMeta

`TParentSubmitMeta`

## Properties

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [packages/form-core/src/types.ts:972](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L972)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`asyncAlways`](FormGroupOptions.md#asyncalways)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [packages/form-core/src/types.ts:968](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L968)

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`asyncDebounceMs`](FormGroupOptions.md#asyncdebouncems)

***

### canSubmitWhenInvalid?

```ts
optional canSubmitWhenInvalid: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:381](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L381)

If true, allows the form to be submitted in an invalid state i.e. canSubmit will remain true regardless of validation errors. Defaults to undefined.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`canSubmitWhenInvalid`](FormGroupOptions.md#cansubmitwheninvalid)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldLikeMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, any, any, any, any, any, any, any, any, any>>;
```

Defined in: [packages/form-core/src/types.ts:976](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L976)

An optional object with default metadata for the field.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`defaultMeta`](FormGroupOptions.md#defaultmeta)

***

### defaultState?

```ts
optional defaultState: FormGroupState;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:388](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L388)

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`defaultState`](FormGroupOptions.md#defaultstate)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [packages/form-core/src/types.ts:964](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L964)

An optional default value for the field.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`defaultValue`](FormGroupOptions.md#defaultvalue)

***

### disableErrorFlat?

```ts
optional disableErrorFlat: boolean;
```

Defined in: [packages/form-core/src/types.ts:1004](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L1004)

Disable the `flat(1)` operation on `field.errors`. This is useful if you want to keep the error structure as is. Not suggested for most use-cases.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`disableErrorFlat`](FormGroupOptions.md#disableerrorflat)

***

### form

```ts
form: FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:639](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L639)

***

### listeners?

```ts
optional listeners: FormGroupListeners<TParentData, TName, TData>;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:386](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L386)

A list of listeners which attach to the corresponding events

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`listeners`](FormGroupOptions.md#listeners)

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/types.ts:960](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L960)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`name`](FormGroupOptions.md#name)

***

### onGroupSubmit()?

```ts
optional onGroupSubmit: (props) => any;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:403](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L403)

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

#### Parameters

##### props

###### groupApi

[`FormGroupApi`](../classes/FormGroupApi.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TSubmitMeta`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

###### meta

`TSubmitMeta`

###### value

`TData`

#### Returns

`any`

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`onGroupSubmit`](FormGroupOptions.md#ongroupsubmit)

***

### onGroupSubmitInvalid()?

```ts
optional onGroupSubmitInvalid: (props) => void;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:436](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L436)

Specify an action for scenarios where the user tries to submit an invalid form.

#### Parameters

##### props

###### groupApi

[`FormGroupApi`](../classes/FormGroupApi.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TSubmitMeta`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

###### meta

`TSubmitMeta`

###### value

`TData`

#### Returns

`void`

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`onGroupSubmitInvalid`](FormGroupOptions.md#ongroupsubmitinvalid)

***

### onSubmitMeta?

```ts
optional onSubmitMeta: TSubmitMeta;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:398](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L398)

onSubmitMeta, the data passed from the handleSubmit handler, to the onSubmit function props

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`onSubmitMeta`](FormGroupOptions.md#onsubmitmeta)

***

### validationLogic?

```ts
optional validationLogic: ValidationLogicFn;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:394](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L394)

Optional validation logic strategy to use for this group's own
validators (e.g. `revalidateLogic()`). When omitted, the parent form's
`validationLogic` (or the default) is used.

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`validationLogic`](FormGroupOptions.md#validationlogic)

***

### validators?

```ts
optional validators: FormGroupValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:363](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L363)

A list of validators to pass to the field

#### Inherited from

[`FormGroupOptions`](FormGroupOptions.md).[`validators`](FormGroupOptions.md#validators)
