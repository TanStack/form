# Class: FormApi\<TFormData, TFormValidator\>

A class representing the Form API. It handles the logic and interactions with the form state.

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

## Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Constructors

### new FormApi()

```ts
new FormApi<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

Constructs a new `FormApi` instance with the given form options.

#### Parameters

• **opts?**: [`FormOptions`](Interface.FormOptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

[`FormApi`](Class.FormApi.md)\<`TFormData`, `TFormValidator`\>

#### Source

[packages/form-core/src/FormApi.ts:344](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L344)

## Properties

### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator>>;
```

A record of field information for each field in the form.

#### Source

[packages/form-core/src/FormApi.ts:333](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L333)

***

### options

```ts
options: FormOptions<TFormData, TFormValidator> = {};
```

The options for the form.

#### Source

[packages/form-core/src/FormApi.ts:317](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L317)

***

### state

```ts
state: FormState<TFormData>;
```

The current state of the form.

**Note:**
Do not use `state` directly, as it is not reactive.
Please use form.useStore() utility to subscribe to state

#### Source

[packages/form-core/src/FormApi.ts:329](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L329)

***

### store

```ts
store: Store<FormState<TFormData>, (cb) => FormState<TFormData>>;
```

A [TanStack Store instance](https://tanstack.com/store/latest/docs/reference/Store) that keeps track of the form's state.

#### Source

[packages/form-core/src/FormApi.ts:321](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L321)

## Methods

### deleteField()

```ts
deleteField<TField>(field): void
```

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:925](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L925)

***

### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData, TFormValidator>
```

Gets the field info of the specified field.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

[`FieldInfo`](Type.FieldInfo.md)\<`TFormData`, `TFormValidator`\>

#### Source

[packages/form-core/src/FormApi.ts:842](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L842)

***

### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | FieldMeta
```

Gets the metadata of the specified field.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

`undefined` \| [`FieldMeta`](Type.FieldMeta.md)

#### Source

[packages/form-core/src/FormApi.ts:833](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L833)

***

### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField, IsNullable<TFormData>>
```

Gets the value of the specified field.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

#### Returns

[`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>

#### Source

[packages/form-core/src/FormApi.ts:826](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L826)

***

### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

#### Returns

`Promise`\<`void`\>

#### Source

[packages/form-core/src/FormApi.ts:766](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L766)

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

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **index**: `number`

• **value**: [`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/form-core/src/FormApi.ts:957](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L957)

***

### mount()

```ts
mount(): void
```

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:442](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L442)

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

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **index1**: `number`

• **index2**: `number`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:1075](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L1075)

***

### pushFieldValue()

```ts
pushFieldValue<TField>(
   field, 
   value, 
   opts?): void
```

Pushes a value into an array field.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **value**: [`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:939](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L939)

***

### removeFieldValue()

```ts
removeFieldValue<TField>(
   field, 
   index, 
opts?): Promise<void>
```

Removes a value from an array field at the specified index.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **index**: `number`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/form-core/src/FormApi.ts:1010](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L1010)

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

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **index**: `number`

• **value**: [`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/form-core/src/FormApi.ts:984](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L984)

***

### reset()

```ts
reset(): void
```

Resets the form state to the default values.

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:504](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L504)

***

### resetFieldMeta()

```ts
resetFieldMeta<TField>(fieldMeta): Record<TField, FieldMeta>
```

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **fieldMeta**: `Record`\<`TField`, [`FieldMeta`](Type.FieldMeta.md)\>

#### Returns

`Record`\<`TField`, [`FieldMeta`](Type.FieldMeta.md)\>

#### Source

[packages/form-core/src/FormApi.ts:876](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L876)

***

### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

Updates the metadata of the specified field.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **updater**: [`Updater`](Type.Updater.md)\<[`FieldMeta`](Type.FieldMeta.md)\>

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:861](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L861)

***

### setFieldValue()

```ts
setFieldValue<TField>(
   field, 
   updater, 
   opts?): void
```

Sets the value of the specified field and optionally updates the touched state.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **updater**: [`Updater`](Type.Updater.md)\<[`DeepValue`](Type.DeepValue.md)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\>

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:900](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L900)

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

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **index1**: `number`

• **index2**: `number`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:1049](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L1049)

***

### update()

```ts
update(options?): void
```

Updates the form options and form state.

#### Parameters

• **options?**: [`FormOptions`](Interface.FormOptions.md)\<`TFormData`, `TFormValidator`\>

#### Returns

`void`

#### Source

[packages/form-core/src/FormApi.ts:464](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L464)

***

### validateAllFields()

```ts
validateAllFields(cause): Promise<ValidationError[]>
```

Validates all fields in the form using the correct handlers for a given validation type.

#### Parameters

• **cause**: `ValidationCause`

#### Returns

`Promise`\<[`ValidationError`](Type.ValidationError.md)[]\>

#### Source

[packages/form-core/src/FormApi.ts:519](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L519)

***

### validateArrayFieldsStartingFrom()

```ts
validateArrayFieldsStartingFrom<TField>(
   field, 
   index, 
cause): Promise<ValidationError[]>
```

Validates the children of a specified array in the form starting from a given index until the end using the correct handlers for a given validation type.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **index**: `number`

• **cause**: `ValidationCause`

#### Returns

`Promise`\<[`ValidationError`](Type.ValidationError.md)[]\>

#### Source

[packages/form-core/src/FormApi.ts:546](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L546)

***

### validateField()

```ts
validateField<TField>(field, cause): ValidationError[] | Promise<ValidationError[]>
```

Validates a specified field in the form using the correct handlers for a given validation type.

#### Type parameters

• **TField** *extends* `string` \| `number`

#### Parameters

• **field**: `TField`

• **cause**: `ValidationCause`

#### Returns

[`ValidationError`](Type.ValidationError.md)[] \| `Promise`\<[`ValidationError`](Type.ValidationError.md)[]\>

#### Source

[packages/form-core/src/FormApi.ts:585](https://github.com/TanStack/form/blob/2fcee08730ef56cadb9b5937d06198bcc1fedcd7/packages/form-core/src/FormApi.ts#L585)
