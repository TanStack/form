---
id: FormApi
title: FormApi
---

# Class: FormApi\<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn\>

Defined in: [packages/form-core/src/FormApi.ts:634](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L634)

A class representing the Form API. It handles the logic and interactions with the form state.

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

• **TOnMountReturn** = `undefined`

• **TOnChangeReturn** = `undefined`

• **TOnChangeAsyncReturn** = `undefined`

• **TOnBlurReturn** = `undefined`

• **TOnBlurAsyncReturn** = `undefined`

• **TOnSubmitReturn** = `undefined`

• **TOnSubmitAsyncReturn** = `undefined`

• **TOnServerReturn** = `undefined`

## Constructors

### new FormApi()

```ts
new FormApi<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn>(opts?): FormApi<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn>
```

Defined in: [packages/form-core/src/FormApi.ts:706](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L706)

Constructs a new `FormApi` instance with the given form options.

#### Parameters

##### opts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TOnServerReturn`\>

#### Returns

[`FormApi`](formapi.md)\<`TFormData`, `TFormValidator`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TOnServerReturn`\>

## Properties

### baseStore

```ts
baseStore: Store<BaseFormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn>, (cb) => BaseFormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn>>;
```

Defined in: [packages/form-core/src/FormApi.ts:661](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L661)

***

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator>>;
```

Defined in: [packages/form-core/src/FormApi.ts:691](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L691)

A record of field information for each field in the form.

***

### fieldMetaDerived

```ts
fieldMetaDerived: Derived<Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:674](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L674)

***

### options

```ts
options: FormOptions<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn> = {};
```

Defined in: [packages/form-core/src/FormApi.ts:649](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L649)

The options for the form.

***

### store

```ts
store: Derived<FormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn>>;
```

Defined in: [packages/form-core/src/FormApi.ts:675](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L675)

## Accessors

### state

#### Get Signature

```ts
get state(): FormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn, TOnServerReturn>
```

Defined in: [packages/form-core/src/FormApi.ts:694](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L694)

##### Returns

[`FormState`](../type-aliases/formstate.md)\<`TFormData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TOnServerReturn`\>

## Methods

### deleteField()

```ts
deleteField<TField>(field): void
```

Defined in: [packages/form-core/src/FormApi.ts:1620](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1620)

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

`void`

***

### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData, TFormValidator>
```

Defined in: [packages/form-core/src/FormApi.ts:1529](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1529)

Gets the field info of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TFormData`, `TFormValidator`\>

***

### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | FieldMeta
```

Defined in: [packages/form-core/src/FormApi.ts:1520](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1520)

Gets the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

`undefined` \| [`FieldMeta`](../type-aliases/fieldmeta.md)

***

### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField, IsNullable<TFormData>>
```

Defined in: [packages/form-core/src/FormApi.ts:1513](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1513)

Gets the value of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

[`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>

***

### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Defined in: [packages/form-core/src/FormApi.ts:1454](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1454)

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

Defined in: [packages/form-core/src/FormApi.ts:1652](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1652)

Inserts a value into an array field at the specified index, shifting the subsequent values to the right.

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

Defined in: [packages/form-core/src/FormApi.ts:962](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L962)

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

Defined in: [packages/form-core/src/FormApi.ts:1770](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1770)

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

Defined in: [packages/form-core/src/FormApi.ts:1634](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1634)

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

Defined in: [packages/form-core/src/FormApi.ts:1705](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1705)

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

Defined in: [packages/form-core/src/FormApi.ts:1679](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1679)

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

Defined in: [packages/form-core/src/FormApi.ts:1036](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1036)

Resets the form state to the default values.
If values are provided, the form will be reset to those values instead and the default values will be updated.

#### Parameters

##### values?

`TFormData`

Optional values to reset the form to.

##### opts?

Optional options to control the reset behavior.

###### keepDefaultValues

`boolean`

#### Returns

`void`

***

### resetFieldMeta()

```ts
resetFieldMeta<TField>(fieldMeta): Record<TField, FieldMeta>
```

Defined in: [packages/form-core/src/FormApi.ts:1566](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1566)

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### fieldMeta

`Record`\<`TField`, [`FieldMeta`](../type-aliases/fieldmeta.md)\>

#### Returns

`Record`\<`TField`, [`FieldMeta`](../type-aliases/fieldmeta.md)\>

***

### setErrorMap()

```ts
setErrorMap(errorMap): void
```

Defined in: [packages/form-core/src/FormApi.ts:1794](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1794)

Updates the form's errorMap

#### Parameters

##### errorMap

`ValidationErrorMap`\<`TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`\>

#### Returns

`void`

***

### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

Defined in: [packages/form-core/src/FormApi.ts:1548](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1548)

Updates the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### updater

[`Updater`](../type-aliases/updater.md)\<[`FieldMeta`](../type-aliases/fieldmeta.md)\<`any`, `any`, `any`, `any`, `any`, `any`, `any`\>\>

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

Defined in: [packages/form-core/src/FormApi.ts:1590](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1590)

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

Defined in: [packages/form-core/src/FormApi.ts:1744](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1744)

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

Defined in: [packages/form-core/src/FormApi.ts:979](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L979)

Updates the form options and form state.

#### Parameters

##### options?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`, `TOnServerReturn`\>

#### Returns

`void`

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<unknown[]>
```

Defined in: [packages/form-core/src/FormApi.ts:1062](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1062)

Validates form and all fields in using the correct handlers for a given validation cause.

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

Defined in: [packages/form-core/src/FormApi.ts:1090](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1090)

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

Defined in: [packages/form-core/src/FormApi.ts:1129](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1129)

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
