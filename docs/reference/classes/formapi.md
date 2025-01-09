---
id: FormApi
title: FormApi
---

# Class: FormApi\<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn\>

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

## Constructors

### new FormApi()

```ts
new FormApi<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>(opts?): FormApi<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>
```

Constructs a new `FormApi` instance with the given form options.

#### Parameters

##### opts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`\>

#### Returns

[`FormApi`](formapi.md)\<`TFormData`, `TFormValidator`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`\>

#### Defined in

[packages/form-core/src/FormApi.ts:678](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L678)

## Properties

### baseStore

```ts
baseStore: Store<BaseFormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>, (cb) => BaseFormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:635](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L635)

***

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator>>;
```

A record of field information for each field in the form.

#### Defined in

[packages/form-core/src/FormApi.ts:663](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L663)

***

### fieldMetaDerived

```ts
fieldMetaDerived: Derived<Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldMeta>, readonly any[]>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:647](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L647)

***

### options

```ts
options: FormOptions<TFormData, TFormValidator, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn> = {};
```

The options for the form.

#### Defined in

[packages/form-core/src/FormApi.ts:624](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L624)

***

### store

```ts
store: Derived<FormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>, readonly any[]>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:648](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L648)

## Accessors

### state

#### Get Signature

```ts
get state(): FormState<TFormData, TOnMountReturn, TOnChangeReturn, TOnChangeAsyncReturn, TOnBlurReturn, TOnBlurAsyncReturn, TOnSubmitReturn, TOnSubmitAsyncReturn>
```

##### Returns

[`FormState`](../type-aliases/formstate.md)\<`TFormData`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`\>

#### Defined in

[packages/form-core/src/FormApi.ts:666](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L666)

## Methods

### deleteField()

```ts
deleteField<TField>(field): void
```

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:1587](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1587)

***

### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData, TFormValidator>
```

Gets the field info of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TFormData`, `TFormValidator`\>

#### Defined in

[packages/form-core/src/FormApi.ts:1496](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1496)

***

### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | FieldMeta
```

Gets the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

`undefined` \| [`FieldMeta`](../type-aliases/fieldmeta.md)

#### Defined in

[packages/form-core/src/FormApi.ts:1487](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1487)

***

### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField, IsNullable<TFormData>>
```

Gets the value of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

[`DeepValue`](../type-aliases/deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>

#### Defined in

[packages/form-core/src/FormApi.ts:1480](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1480)

***

### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FormApi.ts:1421](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1421)

***

### insertFieldValue()

```ts
insertFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1619](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1619)

***

### mount()

```ts
mount(): () => void
```

#### Returns

`Function`

##### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:930](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L930)

***

### moveFieldValues()

```ts
moveFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1737](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1737)

***

### pushFieldValue()

```ts
pushFieldValue<TField>(
   field, 
   value, 
   opts?): void
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1601](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1601)

***

### removeFieldValue()

```ts
removeFieldValue<TField>(
   field, 
   index, 
opts?): Promise<void>
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1672](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1672)

***

### replaceFieldValue()

```ts
replaceFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1646](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1646)

***

### reset()

```ts
reset(values?, opts?): void
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1003](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1003)

***

### resetFieldMeta()

```ts
resetFieldMeta<TField>(fieldMeta): Record<TField, FieldMeta>
```

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### fieldMeta

`Record`\<`TField`, [`FieldMeta`](../type-aliases/fieldmeta.md)\>

#### Returns

`Record`\<`TField`, [`FieldMeta`](../type-aliases/fieldmeta.md)\>

#### Defined in

[packages/form-core/src/FormApi.ts:1533](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1533)

***

### setErrorMap()

```ts
setErrorMap(errorMap): void
```

Updates the form's errorMap

#### Parameters

##### errorMap

`ValidationErrorMap`\<`TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:1761](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1761)

***

### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1515](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1515)

***

### setFieldValue()

```ts
setFieldValue<TField>(
   field, 
   updater, 
   opts?): void
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1557](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1557)

***

### swapFieldValues()

```ts
swapFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1711](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1711)

***

### update()

```ts
update(options?): void
```

Updates the form options and form state.

#### Parameters

##### options?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TOnMountReturn`, `TOnChangeReturn`, `TOnChangeAsyncReturn`, `TOnBlurReturn`, `TOnBlurAsyncReturn`, `TOnSubmitReturn`, `TOnSubmitAsyncReturn`\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:947](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L947)

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<unknown[]>
```

Validates form and all fields in using the correct handlers for a given validation cause.

#### Parameters

##### cause

`ValidationCause`

#### Returns

`Promise`\<`unknown`[]\>

#### Defined in

[packages/form-core/src/FormApi.ts:1029](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1029)

***

### validateArrayFieldsStartingFrom()

```ts
validateArrayFieldsStartingFrom<TField>(
   field, 
   index, 
cause): Promise<unknown[]>
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1057](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1057)

***

### validateField()

```ts
validateField<TField>(field, cause): unknown[] | Promise<unknown[]>
```

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

#### Defined in

[packages/form-core/src/FormApi.ts:1096](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1096)
