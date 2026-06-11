---
id: FormApi
title: FormApi
---

# Class: FormApi\<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta\>

Defined in: [packages/form-core/src/FormApi.ts:954](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L954)

A class representing the Form API. It handles the logic and interactions with the form state.

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

## Type Parameters

### TFormData

`TFormData`

### TOnMount

`TOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TOnServer

`TOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

### TSubmitMeta

`TSubmitMeta` = `never`

## Constructors

### Constructor

```ts
new FormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>(opts?): FormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta>;
```

Defined in: [packages/form-core/src/FormApi.ts:1073](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1073)

Constructs a new `FormApi` instance with the given form options.

#### Parameters

##### opts?

[`FormOptions`](../interfaces/FormOptions.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>

#### Returns

`FormApi`\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>

## Properties

### baseStore

```ts
baseStore: Store<BaseFormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer>>;
```

Defined in: [packages/form-core/src/FormApi.ts:986](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L986)

***

### fieldInfo

```ts
fieldInfo: Partial<Record<DeepKeys<TFormData>, FieldInfo<TFormData>>> = {};
```

Defined in: [packages/form-core/src/FormApi.ts:1042](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1042)

A record of field information for each field in the form.

***

### fieldMetaDerived

```ts
fieldMetaDerived: Store<Partial<Record<DeepKeys<TFormData>, AnyFieldLikeMeta>>>;
```

Defined in: [packages/form-core/src/FormApi.ts:1001](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1001)

***

### formGroupApis

```ts
formGroupApis: Set<AnyFormGroupApi>;
```

Defined in: [packages/form-core/src/FormApi.ts:1048](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1048)

The set of currently-mounted `FormGroupApi` instances belonging to
this form. Used by `FieldApi.validate` to cascade field-level changes
into the validators of any group that encompasses the field.

***

### formGroupMetaDerived

```ts
formGroupMetaDerived: ReadonlyStore<Record<string, AnyFormGroupMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:1023](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1023)

A derived store of every mounted `FormGroupApi`'s `meta`, keyed by
group name. Mirrors `fieldMetaDerived` for fields: per-group `meta`
is computed once on the form (from `baseStore.formGroupStateBase`,
`fieldMetaDerived`, and the registered `formGroupApis`) so reads
from a `FormGroupApi.store` instance stay minimal.

***

### options

```ts
options: FormOptions<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer, TSubmitMeta> = {};
```

Defined in: [packages/form-core/src/FormApi.ts:971](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L971)

The options for the form.

***

### store

```ts
store: ReadonlyStore<FormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer>>;
```

Defined in: [packages/form-core/src/FormApi.ts:1024](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1024)

## Accessors

### formId

#### Get Signature

```ts
get formId(): string;
```

Defined in: [packages/form-core/src/FormApi.ts:1628](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1628)

##### Returns

`string`

***

### state

#### Get Signature

```ts
get state(): FormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TOnServer>;
```

Defined in: [packages/form-core/src/FormApi.ts:1049](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1049)

##### Returns

[`FormState`](../interfaces/FormState.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`\>

## Methods

### \_handleSubmit()

```ts
_handleSubmit(submitMeta?): Promise<void>;
```

Defined in: [packages/form-core/src/FormApi.ts:2413](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2413)

Handles the form submission, performs validation, and calls the appropriate onSubmit or onSubmitInvalid callbacks.

#### Parameters

##### submitMeta?

`TSubmitMeta`

#### Returns

`Promise`\<`void`\>

***

### clearFieldValues()

```ts
clearFieldValues<TField>(field, options?): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2889](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2889)

Clear all values within an array field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.clearFieldValues
```

***

### deleteField()

```ts
deleteField<TField>(field): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2677](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2677)

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.deleteField
```

***

### getAllErrors()

```ts
getAllErrors(): object;
```

Defined in: [packages/form-core/src/FormApi.ts:3012](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L3012)

Returns form and field level errors

#### Returns

`object`

##### fields

```ts
fields: Record<DeepKeys<TFormData>, {
  errorMap: ValidationErrorMap;
  errors: ValidationError[];
}>;
```

##### form

```ts
form: object;
```

###### form.errorMap

```ts
errorMap: ValidationErrorMap<UnwrapFormValidateOrFn<TOnMount>, UnwrapFormValidateOrFn<TOnChange>, UnwrapFormAsyncValidateOrFn<TOnChangeAsync>, UnwrapFormValidateOrFn<TOnBlur>, UnwrapFormAsyncValidateOrFn<TOnBlurAsync>, UnwrapFormValidateOrFn<TOnSubmit>, UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>, UnwrapFormValidateOrFn<TOnDynamic>, UnwrapFormAsyncValidateOrFn<TOnDynamicAsync>, UnwrapFormAsyncValidateOrFn<TOnServer>>;
```

###### form.errors

```ts
errors: NonNullable<
  | UnwrapFormValidateOrFn<TOnMount>
  | UnwrapFormValidateOrFn<TOnChange>
  | UnwrapFormAsyncValidateOrFn<TOnChangeAsync>
  | UnwrapFormValidateOrFn<TOnBlur>
  | UnwrapFormAsyncValidateOrFn<TOnBlurAsync>
  | UnwrapFormValidateOrFn<TOnSubmit>
  | UnwrapFormAsyncValidateOrFn<TOnSubmitAsync>
  | UnwrapFormValidateOrFn<TOnDynamic>
  | UnwrapFormAsyncValidateOrFn<TOnDynamicAsync>
  | UnwrapFormAsyncValidateOrFn<TOnServer>>[];
```

***

### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData>;
```

Defined in: [packages/form-core/src/FormApi.ts:2581](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2581)

Gets the field info of the specified field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

#### Returns

`FieldInfo`\<`TFormData`\>

***

### getFieldMeta()

```ts
getFieldMeta<TField>(field): AnyFieldLikeMeta | undefined;
```

Defined in: [packages/form-core/src/FormApi.ts:2563](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2563)

Gets the metadata of the specified field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

#### Returns

`AnyFieldLikeMeta` \| `undefined`

#### Implementation of

```ts
FormLikeAPI.getFieldMeta
```

***

### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField>;
```

Defined in: [packages/form-core/src/FormApi.ts:2556](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2556)

Gets the value of the specified field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

#### Returns

[`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\>

#### Implementation of

```ts
FormLikeAPI.getFieldValue
```

***

### getFormGroupMeta()

```ts
getFormGroupMeta(name): AnyFormGroupMeta | undefined;
```

Defined in: [packages/form-core/src/FormApi.ts:2574](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2574)

Gets the derived `meta` of the form group registered at the given
name. Mirrors `getFieldMeta` for fields. Returns `undefined` if no
`FormGroupApi` with that name is currently mounted.

#### Parameters

##### name

`string`

#### Returns

[`AnyFormGroupMeta`](../type-aliases/AnyFormGroupMeta.md) \| `undefined`

***

### handleSubmit()

#### Call Signature

```ts
handleSubmit(): Promise<void>;
```

Defined in: [packages/form-core/src/FormApi.ts:2404](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2404)

Handles the form submission, performs validation, and calls the appropriate onSubmit or onSubmitInvalid callbacks.

##### Returns

`Promise`\<`void`\>

##### Implementation of

```ts
FormLikeAPI.handleSubmit
```

#### Call Signature

```ts
handleSubmit(submitMeta): Promise<void>;
```

Defined in: [packages/form-core/src/FormApi.ts:2405](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2405)

##### Parameters

###### submitMeta

`TSubmitMeta`

##### Returns

`Promise`\<`void`\>

##### Implementation of

```ts
FormLikeAPI.handleSubmit
```

***

### insertFieldValue()

```ts
insertFieldValue<TField>(
   field, 
   index, 
   value, 
options?): Promise<void>;
```

Defined in: [packages/form-core/src/FormApi.ts:2717](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2717)

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### index

`number`

##### value

[`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\> *extends* `any`[] ? `any`[] & [`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\>\[`number`\] : `never`

##### options?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Implementation of

```ts
FormLikeAPI.insertFieldValue
```

***

### mount()

```ts
mount(): () => void;
```

Defined in: [packages/form-core/src/FormApi.ts:1657](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1657)

#### Returns

```ts
(): void;
```

##### Returns

`void`

***

### moveFieldValues()

```ts
moveFieldValues<TField>(
   field, 
   index1, 
   index2, 
   options?): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2857](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2857)

Moves the value at the first specified index to the second specified index within an array field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### index1

`number`

##### index2

`number`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.moveFieldValues
```

***

### parseValuesWithSchema()

```ts
parseValuesWithSchema(schema): 
  | {
  fields: Record<string, StandardSchemaV1Issue[]>;
  form: Record<string, StandardSchemaV1Issue[]>;
}
  | undefined;
```

Defined in: [packages/form-core/src/FormApi.ts:3078](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L3078)

Parses the form's values with a given standard schema and returns
issues (if any). This method does NOT set any internal errors.

#### Parameters

##### schema

[`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFormData`, `unknown`\>

The standard schema to parse the form values with.

#### Returns

  \| \{
  `fields`: `Record`\<`string`, [`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)[]\>;
  `form`: `Record`\<`string`, [`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)[]\>;
\}
  \| `undefined`

***

### parseValuesWithSchemaAsync()

```ts
parseValuesWithSchemaAsync(schema): Promise<
  | {
  fields: Record<string, StandardSchemaV1Issue[]>;
  form: Record<string, StandardSchemaV1Issue[]>;
}
| undefined>;
```

Defined in: [packages/form-core/src/FormApi.ts:3090](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L3090)

Parses the form's values with a given standard schema and returns
issues (if any). This method does NOT set any internal errors.

#### Parameters

##### schema

[`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TFormData`, `unknown`\>

The standard schema to parse the form values with.

#### Returns

`Promise`\<
  \| \{
  `fields`: `Record`\<`string`, [`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)[]\>;
  `form`: `Record`\<`string`, [`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)[]\>;
\}
  \| `undefined`\>

***

### pushFieldValue()

```ts
pushFieldValue<TField>(
   field, 
   value, 
   options?): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2701](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2701)

Pushes a value into an array field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### value

[`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\> *extends* `any`[] ? `any`[] & [`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\>\[`number`\] : `never`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.pushFieldValue
```

***

### removeFieldValue()

```ts
removeFieldValue<TField>(
   field, 
   index, 
options?): Promise<void>;
```

Defined in: [packages/form-core/src/FormApi.ts:2785](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2785)

Removes a value from an array field at the specified index.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### index

`number`

##### options?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Implementation of

```ts
FormLikeAPI.removeFieldValue
```

***

### replaceFieldValue()

```ts
replaceFieldValue<TField>(
   field, 
   index, 
   value, 
options?): Promise<void>;
```

Defined in: [packages/form-core/src/FormApi.ts:2754](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2754)

Replaces a value into an array field at the specified index.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### index

`number`

##### value

[`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\> *extends* `any`[] ? `any`[] & [`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\>\[`number`\] : `never`

##### options?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Implementation of

```ts
FormLikeAPI.replaceFieldValue
```

***

### reset()

```ts
reset(values?, opts?): void;
```

Defined in: [packages/form-core/src/FormApi.ts:1809](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1809)

Resets the form state to the default values.
If values are provided, the form will be reset to those values instead and the default values will be updated.

#### Parameters

##### values?

`TFormData`

Optional values to reset the form to.

##### opts?

Optional options to control the reset behavior.

###### keepDefaultValues?

`boolean`

#### Returns

`void`

***

### resetField()

```ts
resetField<TField>(field): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2924](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2924)

Resets the field value and meta to default state

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.resetField
```

***

### resetFieldMeta()

```ts
resetFieldMeta<TField>(fieldMeta): Partial<Record<TField, AnyFieldLikeMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:2621](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2621)

resets every field's meta

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### fieldMeta

`Partial`\<`Record`\<`TField`, `AnyFieldLikeMeta`\>\>

#### Returns

`Partial`\<`Record`\<`TField`, `AnyFieldLikeMeta`\>\>

***

### setErrorMap()

```ts
setErrorMap(errorMap): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2948](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2948)

Updates the form's errorMap

#### Parameters

##### errorMap

`FormValidationErrorMap`\<`TFormData`, [`UnwrapFormValidateOrFn`](../type-aliases/UnwrapFormValidateOrFn.md)\<`TOnMount`\>, [`UnwrapFormValidateOrFn`](../type-aliases/UnwrapFormValidateOrFn.md)\<`TOnChange`\>, [`UnwrapFormAsyncValidateOrFn`](../type-aliases/UnwrapFormAsyncValidateOrFn.md)\<`TOnChangeAsync`\>, [`UnwrapFormValidateOrFn`](../type-aliases/UnwrapFormValidateOrFn.md)\<`TOnBlur`\>, [`UnwrapFormAsyncValidateOrFn`](../type-aliases/UnwrapFormAsyncValidateOrFn.md)\<`TOnBlurAsync`\>, [`UnwrapFormValidateOrFn`](../type-aliases/UnwrapFormValidateOrFn.md)\<`TOnSubmit`\>, [`UnwrapFormAsyncValidateOrFn`](../type-aliases/UnwrapFormAsyncValidateOrFn.md)\<`TOnSubmitAsync`\>, [`UnwrapFormValidateOrFn`](../type-aliases/UnwrapFormValidateOrFn.md)\<`TOnDynamic`\>, [`UnwrapFormAsyncValidateOrFn`](../type-aliases/UnwrapFormAsyncValidateOrFn.md)\<`TOnDynamicAsync`\>, [`UnwrapFormAsyncValidateOrFn`](../type-aliases/UnwrapFormAsyncValidateOrFn.md)\<`TOnServer`\>\>

#### Returns

`void`

***

### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2600](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2600)

Updates the metadata of the specified field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### updater

[`Updater`](../type-aliases/Updater.md)\<`AnyFieldLikeMetaBase`\>

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.setFieldMeta
```

***

### setFieldValue()

```ts
setFieldValue<TField>(
   field, 
   updater, 
   opts?): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2637](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2637)

Sets the value of the specified field and optionally updates the touched state.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`DeepValue`](../type-aliases/DeepValue.md)\<`TFormData`, `TField`\>\>

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.setFieldValue
```

***

### swapFieldValues()

```ts
swapFieldValues<TField>(
   field, 
   index1, 
   index2, 
   options?): void;
```

Defined in: [packages/form-core/src/FormApi.ts:2825](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L2825)

Swaps the values at the specified indices within an array field.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### index1

`number`

##### index2

`number`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

#### Implementation of

```ts
FormLikeAPI.swapFieldValues
```

***

### update()

```ts
update(options?): void;
```

Defined in: [packages/form-core/src/FormApi.ts:1731](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1731)

Updates the form options and form state.

#### Parameters

##### options?

[`FormOptions`](../interfaces/FormOptions.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TOnServer`, `TSubmitMeta`\>

#### Returns

`void`

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<unknown[]>;
```

Defined in: [packages/form-core/src/FormApi.ts:1855](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1855)

Validates all fields according to the FIELD level validators.
This will ignore FORM level validators, use form.validate({ValidationCause}) for a complete validation

#### Parameters

##### cause

`ValidationCause`

#### Returns

`Promise`\<`unknown`[]\>

#### Implementation of

```ts
FormLikeAPI.validateAllFields
```

***

### validateArrayFieldsStartingFrom()

```ts
validateArrayFieldsStartingFrom<TField>(
   field, 
   index, 
cause): Promise<unknown[]>;
```

Defined in: [packages/form-core/src/FormApi.ts:1891](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1891)

Validates the children of a specified array in the form starting from a given index until the end using the correct handlers for a given validation type.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### index

`number`

##### cause

`ValidationCause`

#### Returns

`Promise`\<`unknown`[]\>

#### Implementation of

```ts
FormLikeAPI.validateArrayFieldsStartingFrom
```

***

### validateField()

```ts
validateField<TField>(field, cause): any[] | Promise<any[]>;
```

Defined in: [packages/form-core/src/FormApi.ts:1932](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1932)

Validates a specified field in the form using the correct handlers for a given validation type.

#### Type Parameters

##### TField

`TField` *extends* `string`

#### Parameters

##### field

`TField`

##### cause

`ValidationCause`

#### Returns

`any`[] \| `Promise`\<`any`[]\>

#### Implementation of

```ts
FormLikeAPI.validateField
```
