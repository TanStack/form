---
id: FormApi
title: FormApi
---

# Class: FormApi\<TFormData, TFormValidator\>

Defined in: [packages/form-core/src/FormApi.ts:360](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L360)

A class representing the Form API. It handles the logic and interactions with the form state.

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Constructors

### new FormApi()

```ts
new FormApi<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

Defined in: [packages/form-core/src/FormApi.ts:389](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L389)

Constructs a new `FormApi` instance with the given form options.

#### Parameters

##### opts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

[`FormApi`](formapi.md)\<`TFormData`, `TFormValidator`\>

## Properties

### baseStore

```ts
baseStore: Store<BaseFormState<TFormData>, (cb) => BaseFormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:368](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L368)

***

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator>>;
```

Defined in: [packages/form-core/src/FormApi.ts:374](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L374)

A record of field information for each field in the form.

***

### fieldMetaDerived

```ts
fieldMetaDerived: Derived<Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldMeta>>;
```

Defined in: [packages/form-core/src/FormApi.ts:369](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L369)

***

### options

```ts
options: FormOptions<TFormData, TFormValidator> = {};
```

Defined in: [packages/form-core/src/FormApi.ts:367](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L367)

The options for the form.

***

### store

```ts
store: Derived<FormState<TFormData>>;
```

Defined in: [packages/form-core/src/FormApi.ts:370](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L370)

## Accessors

### state

#### Get Signature

```ts
get state(): FormState<TFormData>
```

Defined in: [packages/form-core/src/FormApi.ts:377](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L377)

##### Returns

[`FormState`](../type-aliases/formstate.md)\<`TFormData`\>

## Methods

### deleteField()

```ts
deleteField<TField>(field): void
```

Defined in: [packages/form-core/src/FormApi.ts:1182](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1182)

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

Defined in: [packages/form-core/src/FormApi.ts:1091](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1091)

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

Defined in: [packages/form-core/src/FormApi.ts:1082](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1082)

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

Defined in: [packages/form-core/src/FormApi.ts:1075](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1075)

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

Defined in: [packages/form-core/src/FormApi.ts:1016](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1016)

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

Defined in: [packages/form-core/src/FormApi.ts:1214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1214)

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

Defined in: [packages/form-core/src/FormApi.ts:595](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L595)

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

Defined in: [packages/form-core/src/FormApi.ts:1332](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1332)

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

Defined in: [packages/form-core/src/FormApi.ts:1196](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1196)

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

Defined in: [packages/form-core/src/FormApi.ts:1267](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1267)

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

Defined in: [packages/form-core/src/FormApi.ts:1241](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1241)

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

Defined in: [packages/form-core/src/FormApi.ts:656](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L656)

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

Defined in: [packages/form-core/src/FormApi.ts:1128](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1128)

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

Defined in: [packages/form-core/src/FormApi.ts:1356](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1356)

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

Defined in: [packages/form-core/src/FormApi.ts:1110](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1110)

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

Defined in: [packages/form-core/src/FormApi.ts:1152](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1152)

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

Defined in: [packages/form-core/src/FormApi.ts:1306](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1306)

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

Defined in: [packages/form-core/src/FormApi.ts:612](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L612)

Updates the form options and form state.

#### Parameters

##### options?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

`void`

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<ValidationError[]>
```

Defined in: [packages/form-core/src/FormApi.ts:682](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L682)

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

Defined in: [packages/form-core/src/FormApi.ts:710](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L710)

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

Defined in: [packages/form-core/src/FormApi.ts:749](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L749)

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
