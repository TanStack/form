---
id: FormApi
title: FormApi
---

# Class: FormApi\<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnServer\>

Defined in: [packages/form-core/src/FormApi.ts:622](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L622)

A class representing the Form API. It handles the logic and interactions with the form state.

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

## Type Parameters

• **TFormData**

• **TOnMount** *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

• **TOnChange** *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

• **TOnChangeAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

• **TOnBlur** *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

• **TOnBlurAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

• **TOnSubmit** *extends* `undefined` \| `FormValidateOrFn`\<`TFormData`\>

• **TOnSubmitAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

• **TOnServer** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TFormData`\>

## Constructors

### new FormApi()

```ts
new FormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnServer>(opts?): FormApi<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnServer>
```

Defined in: [packages/form-core/src/FormApi.ts:691](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L691)

Constructs a new `FormApi` instance with the given form options.

#### Parameters

##### opts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnServer`\>

#### Returns

[`FormApi`](formapi.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnServer`\>

## Properties

### baseStore

```ts
baseStore: Store<BaseFormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnServer>>;
```

Defined in: [packages/form-core/src/FormApi.ts:647](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L647)

***

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:677](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L677)

A record of field information for each field in the form.

***

### fieldMetaDerived

```ts
fieldMetaDerived: Derived<Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, AnyFieldMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:660](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L660)

***

### options

```ts
options: FormOptions<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnServer> = {};
```

Defined in: [packages/form-core/src/FormApi.ts:636](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L636)

The options for the form.

***

### store

```ts
store: Derived<FormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnServer>>;
```

Defined in: [packages/form-core/src/FormApi.ts:661](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L661)

## Accessors

### state

#### Get Signature

```ts
get state(): FormState<TFormData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnServer>
```

Defined in: [packages/form-core/src/FormApi.ts:679](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L679)

##### Returns

[`FormState`](../type-aliases/formstate.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnServer`\>

## Methods

### deleteField()

```ts
deleteField<TField>(field): void
```

Defined in: [packages/form-core/src/FormApi.ts:1661](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1661)

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

`void`

***

### getAllErrors()

```ts
getAllErrors(): object
```

Defined in: [packages/form-core/src/FormApi.ts:1438](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1438)

Returns form and field level errors

#### Returns

`object`

##### fields

```ts
fields: Record<string, ValidationErrorMap>;
```

##### form

```ts
form: ValidationError[];
```

***

### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData>
```

Defined in: [packages/form-core/src/FormApi.ts:1570](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1570)

Gets the field info of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TFormData`\>

***

### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | AnyFieldMeta
```

Defined in: [packages/form-core/src/FormApi.ts:1561](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1561)

Gets the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

`undefined` \| [`AnyFieldMeta`](../type-aliases/anyfieldmeta.md)

***

### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField>
```

Defined in: [packages/form-core/src/FormApi.ts:1554](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1554)

Gets the value of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

[`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`\>

***

### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Defined in: [packages/form-core/src/FormApi.ts:1485](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1485)

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

#### Returns

`Promise`\<`void`\>

***

### insertFieldValue()

```ts
insertFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

Defined in: [packages/form-core/src/FormApi.ts:1690](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1690)

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### index

`number`

##### value

[`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

##### opts?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

***

### mount()

```ts
mount(): () => void
```

Defined in: [packages/form-core/src/FormApi.ts:989](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L989)

#### Returns

`Function`

##### Returns

`void`

***

### moveFieldValues()

```ts
moveFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

Defined in: [packages/form-core/src/FormApi.ts:1819](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1819)

Moves the value at the first specified index to the second specified index within an array field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### index1

`number`

##### index2

`number`

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

***

### pushFieldValue()

```ts
pushFieldValue<TField>(
   field, 
   value, 
   opts?): void
```

Defined in: [packages/form-core/src/FormApi.ts:1675](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1675)

Pushes a value into an array field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### value

[`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

***

### removeFieldValue()

```ts
removeFieldValue<TField>(
   field, 
   index, 
opts?): Promise<void>
```

Defined in: [packages/form-core/src/FormApi.ts:1748](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1748)

Removes a value from an array field at the specified index.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### index

`number`

##### opts?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

***

### replaceFieldValue()

```ts
replaceFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

Defined in: [packages/form-core/src/FormApi.ts:1722](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1722)

Replaces a value into an array field at the specified index.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### index

`number`

##### value

[`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

##### opts?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

***

### reset()

```ts
reset(values?, opts?): void
```

Defined in: [packages/form-core/src/FormApi.ts:1064](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1064)

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

### resetFieldMeta()

```ts
resetFieldMeta<TField>(fieldMeta): Record<TField, AnyFieldMeta>
```

Defined in: [packages/form-core/src/FormApi.ts:1607](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1607)

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### fieldMeta

`Record`\<`TField`, [`AnyFieldMeta`](../type-aliases/anyfieldmeta.md)\>

#### Returns

`Record`\<`TField`, [`AnyFieldMeta`](../type-aliases/anyfieldmeta.md)\>

***

### setErrorMap()

```ts
setErrorMap(errorMap): void
```

Defined in: [packages/form-core/src/FormApi.ts:1846](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1846)

Updates the form's errorMap

#### Parameters

##### errorMap

`ValidationErrorMap`\<`TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`\>

#### Returns

`void`

***

### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

Defined in: [packages/form-core/src/FormApi.ts:1589](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1589)

Updates the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### updater

[`Updater`](../type-aliases/updater.md)\<[`AnyFieldMeta`](../type-aliases/anyfieldmeta.md)\>

#### Returns

`void`

***

### setFieldValue()

```ts
setFieldValue<TField>(
   field, 
   updater, 
   opts?): void
```

Defined in: [packages/form-core/src/FormApi.ts:1631](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1631)

Sets the value of the specified field and optionally updates the touched state.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### updater

[`Updater`](../type-aliases/updater.md)\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\>

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

***

### swapFieldValues()

```ts
swapFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

Defined in: [packages/form-core/src/FormApi.ts:1790](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1790)

Swaps the values at the specified indices within an array field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### index1

`number`

##### index2

`number`

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

***

### update()

```ts
update(options?): void
```

Defined in: [packages/form-core/src/FormApi.ts:1006](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1006)

Updates the form options and form state.

#### Parameters

##### options?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnServer`\>

#### Returns

`void`

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<unknown[]>
```

Defined in: [packages/form-core/src/FormApi.ts:1090](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1090)

Validates all fields using the correct handlers for a given validation cause.

#### Parameters

##### cause

`ValidationCause`

#### Returns

`Promise`\<`unknown`[]\>

***

### validateArrayFieldsStartingFrom()

```ts
validateArrayFieldsStartingFrom<TField>(
   field, 
   index, 
cause): Promise<unknown[]>
```

Defined in: [packages/form-core/src/FormApi.ts:1120](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1120)

Validates the children of a specified array in the form starting from a given index until the end using the correct handlers for a given validation type.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### index

`number`

##### cause

`ValidationCause`

#### Returns

`Promise`\<`unknown`[]\>

***

### validateField()

```ts
validateField<TField>(field, cause): unknown[] | Promise<unknown[]>
```

Defined in: [packages/form-core/src/FormApi.ts:1159](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1159)

Validates a specified field in the form using the correct handlers for a given validation type.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### cause

`ValidationCause`

#### Returns

`unknown`[] \| `Promise`\<`unknown`[]\>
