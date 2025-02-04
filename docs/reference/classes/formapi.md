---
id: FormApi
title: FormApi
---

# Class: FormApi\<TFormData, TFormValidator, TFormSubmitMeta\>

Defined in: [packages/form-core/src/FormApi.ts:396](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L396)

A class representing the Form API. It handles the logic and interactions with the form state.

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

• **TFormSubmitMeta** = `never`

## Constructors

### new FormApi()

```ts
new FormApi<TFormData, TFormValidator, TFormSubmitMeta>(opts?): FormApi<TFormData, TFormValidator, TFormSubmitMeta>
```

Defined in: [packages/form-core/src/FormApi.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L426)

Constructs a new `FormApi` instance with the given form options.

#### Parameters

##### opts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

#### Returns

[`FormApi`](formapi.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

## Properties

### baseStore

```ts
baseStore: Store<BaseFormState<TFormData>, (cb) => BaseFormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:405](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L405)

***

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator, never>>;
```

Defined in: [packages/form-core/src/FormApi.ts:411](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L411)

A record of field information for each field in the form.

***

### fieldMetaDerived

```ts
fieldMetaDerived: Derived<Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:406](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L406)

***

### options

```ts
options: FormOptions<TFormData, TFormValidator, TFormSubmitMeta> = {};
```

Defined in: [packages/form-core/src/FormApi.ts:404](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L404)

The options for the form.

***

### store

```ts
store: Derived<FormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:407](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L407)

## Accessors

### state

#### Get Signature

```ts
get state(): FormState<TFormData>
```

Defined in: [packages/form-core/src/FormApi.ts:414](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L414)

##### Returns

[`FormState`](../type-aliases/formstate.md)\<`TFormData`\>

## Methods

### deleteField()

```ts
deleteField<TField>(field): void
```

Defined in: [packages/form-core/src/FormApi.ts:1274](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1274)

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
getFieldInfo<TField>(field): FieldInfo<TFormData, TFormValidator, never>
```

Defined in: [packages/form-core/src/FormApi.ts:1183](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1183)

Gets the field info of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TFormData`, `TFormValidator`, `never`\>

***

### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | FieldMeta
```

Defined in: [packages/form-core/src/FormApi.ts:1174](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1174)

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

Defined in: [packages/form-core/src/FormApi.ts:1167](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1167)

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

#### Call Signature

```ts
handleSubmit(): Promise<void>
```

Defined in: [packages/form-core/src/FormApi.ts:1101](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1101)

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

##### Returns

`Promise`\<`void`\>

#### Call Signature

```ts
handleSubmit(submitMeta): Promise<void>
```

Defined in: [packages/form-core/src/FormApi.ts:1102](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1102)

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

##### Parameters

###### submitMeta

`TFormSubmitMeta`

##### Returns

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

Defined in: [packages/form-core/src/FormApi.ts:1306](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1306)

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

Defined in: [packages/form-core/src/FormApi.ts:676](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L676)

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

Defined in: [packages/form-core/src/FormApi.ts:1424](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1424)

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

Defined in: [packages/form-core/src/FormApi.ts:1288](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1288)

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

Defined in: [packages/form-core/src/FormApi.ts:1359](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1359)

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

Defined in: [packages/form-core/src/FormApi.ts:1333](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1333)

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

Defined in: [packages/form-core/src/FormApi.ts:741](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L741)

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

Defined in: [packages/form-core/src/FormApi.ts:1220](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1220)

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

Defined in: [packages/form-core/src/FormApi.ts:1448](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1448)

Updates the form's errorMap

#### Parameters

##### errorMap

`ValidationErrorMap`

#### Returns

`void`

***

### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

Defined in: [packages/form-core/src/FormApi.ts:1202](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1202)

Updates the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### updater

[`Updater`](../type-aliases/updater.md)\<[`FieldMeta`](../type-aliases/fieldmeta.md)\>

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

Defined in: [packages/form-core/src/FormApi.ts:1244](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1244)

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

Defined in: [packages/form-core/src/FormApi.ts:1398](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1398)

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

Defined in: [packages/form-core/src/FormApi.ts:693](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L693)

Updates the form options and form state.

#### Parameters

##### options?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`, `TFormSubmitMeta`\>

#### Returns

`void`

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<ValidationError[]>
```

Defined in: [packages/form-core/src/FormApi.ts:767](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L767)

Validates form and all fields in using the correct handlers for a given validation cause.

#### Parameters

##### cause

`ValidationCause`

#### Returns

`Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>

***

### validateArrayFieldsStartingFrom()

```ts
validateArrayFieldsStartingFrom<TField>(
   field, 
   index, 
cause): Promise<ValidationError[]>
```

Defined in: [packages/form-core/src/FormApi.ts:795](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L795)

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

`Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>

***

### validateField()

```ts
validateField<TField>(field, cause): 
  | ValidationError[]
| Promise<ValidationError[]>
```

Defined in: [packages/form-core/src/FormApi.ts:834](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L834)

Validates a specified field in the form using the correct handlers for a given validation type.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

##### field

`TField`

##### cause

`ValidationCause`

#### Returns

  \| [`ValidationError`](../type-aliases/validationerror.md)[]
  \| `Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>
