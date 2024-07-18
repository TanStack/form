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

• **opts?**: [`FormOptions`](formoptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

[`FormApi`](formapi.md)\<`TFormData`, `TFormValidator`\>

#### Defined in

[packages/form-core/src/FormApi.ts:345](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L345)

## Properties

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator>>;
```

A record of field information for each field in the form.

#### Defined in

[packages/form-core/src/FormApi.ts:334](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L334)

***

### options

```ts
options: FormOptions<TFormData, TFormValidator> = {};
```

The options for the form.

#### Defined in

[packages/form-core/src/FormApi.ts:318](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L318)

***

### state

```ts
state: FormState<TFormData>;
```

The current state of the form.

**Note:**
Do not use `state` directly, as it is not reactive.
Please use form.useStore() utility to subscribe to state

#### Defined in

[packages/form-core/src/FormApi.ts:330](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L330)

***

### store

```ts
store: Store<FormState<TFormData>, (cb) => FormState<TFormData>>;
```

A [TanStack Store instance](https://tanstack.com/store/latest/docs/reference/Store) that keeps track of the form's state.

#### Defined in

[packages/form-core/src/FormApi.ts:322](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L322)

## Methods

### deleteField()

```ts
deleteField<TField>(field): void
```

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:925](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L925)

***

### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData, TFormValidator>
```

Gets the field info of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

[`FieldInfo`](fieldinfo.md)\<`TFormData`, `TFormValidator`\>

#### Defined in

[packages/form-core/src/FormApi.ts:843](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L843)

***

### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | FieldMeta
```

Gets the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

`undefined` \| [`FieldMeta`](fieldmeta.md)

#### Defined in

[packages/form-core/src/FormApi.ts:834](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L834)

***

### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField, IsNullable<TFormData>>
```

Gets the value of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

[`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>

#### Defined in

[packages/form-core/src/FormApi.ts:827](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L827)

***

### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FormApi.ts:767](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L767)

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

• **field**: `TField`

• **index**: `number`

• **value**: [`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**: `UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FormApi.ts:957](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L957)

***

### mount()

```ts
mount(): void
```

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:443](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L443)

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

• **field**: `TField`

• **index1**: `number`

• **index2**: `number`

• **opts?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:1075](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L1075)

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

• **field**: `TField`

• **value**: [`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:939](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L939)

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

• **field**: `TField`

• **index**: `number`

• **opts?**: `UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FormApi.ts:1010](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L1010)

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

• **field**: `TField`

• **index**: `number`

• **value**: [`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**: `UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FormApi.ts:984](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L984)

***

### reset()

```ts
reset(): void
```

Resets the form state to the default values.

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:505](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L505)

***

### resetFieldMeta()

```ts
resetFieldMeta<TField>(fieldMeta): Record<TField, FieldMeta>
```

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **fieldMeta**: `Record`\<`TField`, [`FieldMeta`](fieldmeta.md)\>

#### Returns

`Record`\<`TField`, [`FieldMeta`](fieldmeta.md)\>

#### Defined in

[packages/form-core/src/FormApi.ts:877](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L877)

***

### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

Updates the metadata of the specified field.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **updater**: [`Updater`](updater.md)\<[`FieldMeta`](fieldmeta.md)\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:862](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L862)

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

• **field**: `TField`

• **updater**: [`Updater`](updater.md)\<[`DeepValue`](deepvalue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\>

• **opts?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:900](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L900)

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

• **field**: `TField`

• **index1**: `number`

• **index2**: `number`

• **opts?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:1049](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L1049)

***

### update()

```ts
update(options?): void
```

Updates the form options and form state.

#### Parameters

• **options?**: [`FormOptions`](formoptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FormApi.ts:465](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L465)

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<ValidationError[]>
```

Validates all fields in the form using the correct handlers for a given validation type.

#### Parameters

• **cause**: `ValidationCause`

#### Returns

`Promise`\<[`ValidationError`](validationerror.md)[]\>

#### Defined in

[packages/form-core/src/FormApi.ts:520](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L520)

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

• **field**: `TField`

• **index**: `number`

• **cause**: `ValidationCause`

#### Returns

`Promise`\<[`ValidationError`](validationerror.md)[]\>

#### Defined in

[packages/form-core/src/FormApi.ts:547](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L547)

***

### validateField()

```ts
validateField<TField>(field, cause): ValidationError[] | Promise<ValidationError[]>
```

Validates a specified field in the form using the correct handlers for a given validation type.

#### Type Parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **cause**: `ValidationCause`

#### Returns

[`ValidationError`](validationerror.md)[] \| `Promise`\<[`ValidationError`](validationerror.md)[]\>

#### Defined in

[packages/form-core/src/FormApi.ts:586](https://github.com/TanStack/form/blob/2bebfd5214c4cdfbf6feacb7b1e25a6825957062/packages/form-core/src/FormApi.ts#L586)
