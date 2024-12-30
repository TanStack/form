---
id: FormApi
title: FormApi
---

# Class: FormApi\<TFormData, TFormValidator\>

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

Constructs a new `FormApi` instance with the given form options.

#### Parameters

##### opts?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

[`FormApi`](formapi.md)\<`TFormData`, `TFormValidator`\>

#### Defined in

[packages/form-core/src/FormApi.ts:389](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L389)

## Properties

### baseStore

```ts
baseStore: Store<BaseFormState<TFormData>, (cb) => BaseFormState<TFormData>>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:368](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L368)

***

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator>>;
```

A record of field information for each field in the form.

#### Defined in

[packages/form-core/src/FormApi.ts:374](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L374)

***

### fieldMetaDerived

```ts
fieldMetaDerived: Derived<Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldMeta>, readonly any[]>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:369](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L369)

***

### options

```ts
options: FormOptions<TFormData, TFormValidator> = {};
```

The options for the form.

#### Defined in

[packages/form-core/src/FormApi.ts:367](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L367)

***

### store

```ts
store: Derived<FormState<TFormData>, readonly any[]>;
```

#### Defined in

[packages/form-core/src/FormApi.ts:370](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L370)

## Accessors

### state

#### Get Signature

```ts
get state(): FormState<TFormData>
```

##### Returns

[`FormState`](../type-aliases/formstate.md)\<`TFormData`\>

#### Defined in

[packages/form-core/src/FormApi.ts:377](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L377)

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

[packages/form-core/src/FormApi.ts:1182](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1182)

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

[packages/form-core/src/FormApi.ts:1091](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1091)

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

[packages/form-core/src/FormApi.ts:1082](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1082)

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

[packages/form-core/src/FormApi.ts:1075](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1075)

***

### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FormApi.ts:1016](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1016)

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

[packages/form-core/src/FormApi.ts:1214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1214)

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

[packages/form-core/src/FormApi.ts:595](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L595)

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

[packages/form-core/src/FormApi.ts:1332](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1332)

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

[packages/form-core/src/FormApi.ts:1196](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1196)

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

[packages/form-core/src/FormApi.ts:1267](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1267)

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

[packages/form-core/src/FormApi.ts:1241](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1241)

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

[packages/form-core/src/FormApi.ts:656](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L656)

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

[packages/form-core/src/FormApi.ts:1128](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1128)

***

### setErrorMap()

```ts
setErrorMap(errorMap): void
```

Updates the form's errorMap

#### Parameters

##### errorMap

`ValidationErrorMap`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:1356](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1356)

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

[`Updater`](../type-aliases/updater.md)\<[`FieldMeta`](../type-aliases/fieldmeta.md)\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:1110](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1110)

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

[packages/form-core/src/FormApi.ts:1152](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1152)

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

[packages/form-core/src/FormApi.ts:1306](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L1306)

***

### update()

```ts
update(options?): void
```

Updates the form options and form state.

#### Parameters

##### options?

[`FormOptions`](../interfaces/formoptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:612](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L612)

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<ValidationError[]>
```

Validates form and all fields in using the correct handlers for a given validation cause.

#### Parameters

##### cause

`ValidationCause`

#### Returns

`Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>

#### Defined in

[packages/form-core/src/FormApi.ts:682](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L682)

***

### validateArrayFieldsStartingFrom()

```ts
validateArrayFieldsStartingFrom<TField>(
   field, 
   index, 
cause): Promise<ValidationError[]>
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

`Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>

#### Defined in

[packages/form-core/src/FormApi.ts:710](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L710)

***

### validateField()

```ts
validateField<TField>(field, cause): ValidationError[] | Promise<ValidationError[]>
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

[`ValidationError`](../type-aliases/validationerror.md)[] \| `Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>

#### Defined in

[packages/form-core/src/FormApi.ts:749](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L749)
