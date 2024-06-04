# @tanstack/form-core

## Classes

### FieldApi\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

A class representing the API for managing a form field.

Normally, you will not need to create a new `FieldApi` instance directly.
Instead, you will use a framework hook/function like `useField` or `createField`
to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling
the `new FieldApi` constructor.

#### Type parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](index.md#deepkeysttdepth)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\> = [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>

#### Constructors

##### new FieldApi()

```ts
new FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
```

Initializes a new `FieldApi` instance.

###### Parameters

• **opts**: [`FieldApiOptions`](index.md#fieldapioptionstparentdatatnametfieldvalidatortformvalidatortdata)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

###### Returns

[`FieldApi`](index.md#fieldapitparentdatatnametfieldvalidatortformvalidatortdata)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

###### Source

[packages/form-core/src/FieldApi.ts:436](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L436)

#### Properties

##### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

A reference to the form API instance.

###### Source

[packages/form-core/src/FieldApi.ts:399](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L399)

##### name

```ts
name: unknown extends TParentData ? string : object extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never;
```

The field name.

###### Source

[packages/form-core/src/FieldApi.ts:409](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L409)

##### options

```ts
options: FieldApiOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

The field options.

###### Source

[packages/form-core/src/FieldApi.ts:413](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L413)

##### state

```ts
state: FieldState<TData>;
```

The current field state.

###### Source

[packages/form-core/src/FieldApi.ts:427](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L427)

##### store

```ts
store: Store<FieldState<TData>, (cb) => FieldState<TData>>;
```

The field state store.

###### Source

[packages/form-core/src/FieldApi.ts:423](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L423)

#### Methods

##### getInfo()

```ts
getInfo(): FieldInfo<TParentData, TFormValidator>
```

Gets the field information object.

###### Returns

[`FieldInfo`](index.md#fieldinfotformdatatformvalidator)\<`TParentData`, `TFormValidator`\>

###### Source

[packages/form-core/src/FieldApi.ts:652](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L652)

##### getMeta()

```ts
getMeta(): FieldMeta
```

Gets the current field metadata.

###### Returns

[`FieldMeta`](index.md#fieldmeta)

###### Source

[packages/form-core/src/FieldApi.ts:630](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L630)

##### getValue()

```ts
getValue(): TData
```

Gets the current field value.

###### Returns

`TData`

###### Source

[packages/form-core/src/FieldApi.ts:607](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L607)

##### handleBlur()

```ts
handleBlur(): void
```

Handles the blur event.

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:962](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L962)

##### handleChange()

```ts
handleChange(updater): void
```

Handles the change event.

###### Parameters

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<`TData`\>

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:955](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L955)

##### insertValue()

```ts
insertValue(
   index, 
   value, 
opts?): Promise<void>
```

Inserts a value at the specified index, shifting the subsequent values to the right.

###### Parameters

• **index**: `number`

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FieldApi.ts:665](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L665)

##### mount()

```ts
mount(): () => void
```

Mounts the field instance to the form.

###### Returns

`Function`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:524](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L524)

##### moveValue()

```ts
moveValue(
   aIndex, 
   bIndex, 
   opts?): void
```

Moves the value at the first specified index to the second specified index.

###### Parameters

• **aIndex**: `number`

• **bIndex**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:695](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L695)

##### pushValue()

```ts
pushValue(value, opts?): void
```

Pushes a new value to the field.

###### Parameters

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:657](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L657)

##### removeValue()

```ts
removeValue(index, opts?): Promise<void>
```

Removes a value at the specified index.

###### Parameters

• **index**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FieldApi.ts:683](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L683)

##### replaceValue()

```ts
replaceValue(
   index, 
   value, 
opts?): Promise<void>
```

Replaces a value at the specified index.

###### Parameters

• **index**: `number`

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FieldApi.ts:674](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L674)

##### setMeta()

```ts
setMeta(updater): void
```

Sets the field metadata.

###### Parameters

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<[`FieldMeta`](index.md#fieldmeta)\>

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:646](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L646)

##### setValue()

```ts
setValue(updater, options?): void
```

Sets the field value and run the `change` validator.

###### Parameters

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<`TData`\>

• **options?**

• **options.notify?**: `boolean`

• **options.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:614](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L614)

##### swapValues()

```ts
swapValues(
   aIndex, 
   bIndex, 
   opts?): void
```

Swaps the values at the specified indices.

###### Parameters

• **aIndex**: `number`

• **bIndex**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:689](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L689)

##### update()

```ts
update(opts): void
```

Updates the field instance with new options.

###### Parameters

• **opts**: [`FieldApiOptions`](index.md#fieldapioptionstparentdatatnametfieldvalidatortformvalidatortdata)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:575](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L575)

##### validate()

```ts
validate(cause): ValidationError[] | Promise<ValidationError[]>
```

Validates the field value.

###### Parameters

• **cause**: `ValidationCause`

###### Returns

[`ValidationError`](index.md#validationerror)[] \| `Promise`\<[`ValidationError`](index.md#validationerror)[]\>

###### Source

[packages/form-core/src/FieldApi.ts:932](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L932)

***

### FormApi\<TFormData, TFormValidator\>

A class representing the Form API. It handles the logic and interactions with the form state.

Normally, you will not need to create a new `FormApi` instance directly. Instead, you will use a framework
hook/function like `useForm` or `createForm` to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling the `new FormApi` constructor.

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

#### Constructors

##### new FormApi()

```ts
new FormApi<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

Constructs a new `FormApi` instance with the given form options.

###### Parameters

• **opts?**: [`FormOptions`](index.md#formoptionstformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Returns

[`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Source

[packages/form-core/src/FormApi.ts:344](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L344)

#### Properties

##### fieldInfo

```ts
fieldInfo: Record<unknown extends TFormData ? string : object extends TFormData ? string : TFormData extends readonly any[] & IsTuple<TFormData> ? PrefixTupleAccessor<TFormData<TFormData>, AllowedIndexes<TFormData<TFormData>, never>, []> : TFormData extends any[] ? PrefixArrayAccessor<TFormData<TFormData>, [any]> : TFormData extends Date ? never : TFormData extends object ? PrefixObjectAccessor<TFormData<TFormData>, []> : TFormData extends string | number | bigint | boolean ? "" : never, FieldInfo<TFormData, TFormValidator>>;
```

A record of field information for each field in the form.

###### Source

[packages/form-core/src/FormApi.ts:333](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L333)

##### options

```ts
options: FormOptions<TFormData, TFormValidator> = {};
```

The options for the form.

###### Source

[packages/form-core/src/FormApi.ts:317](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L317)

##### state

```ts
state: FormState<TFormData>;
```

The current state of the form.

**Note:**
Do not use `state` directly, as it is not reactive.
Please use form.useStore() utility to subscribe to state

###### Source

[packages/form-core/src/FormApi.ts:329](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L329)

##### store

```ts
store: Store<FormState<TFormData>, (cb) => FormState<TFormData>>;
```

A [TanStack Store instance](https://tanstack.com/store/latest/docs/reference/Store) that keeps track of the form's state.

###### Source

[packages/form-core/src/FormApi.ts:321](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L321)

#### Methods

##### deleteField()

```ts
deleteField<TField>(field): void
```

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:925](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L925)

##### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData, TFormValidator>
```

Gets the field info of the specified field.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

###### Returns

[`FieldInfo`](index.md#fieldinfotformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Source

[packages/form-core/src/FormApi.ts:842](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L842)

##### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | FieldMeta
```

Gets the metadata of the specified field.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

###### Returns

`undefined` \| [`FieldMeta`](index.md#fieldmeta)

###### Source

[packages/form-core/src/FormApi.ts:833](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L833)

##### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField, IsNullable<TFormData>>
```

Gets the value of the specified field.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

###### Returns

[`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>

###### Source

[packages/form-core/src/FormApi.ts:826](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L826)

##### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Handles the form submission, performs validation, and calls the appropriate onSubmit or onInvalidSubmit callbacks.

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FormApi.ts:766](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L766)

##### insertFieldValue()

```ts
insertFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

Inserts a value into an array field at the specified index, shifting the subsequent values to the right.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **index**: `number`

• **value**: [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FormApi.ts:957](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L957)

##### mount()

```ts
mount(): void
```

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:442](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L442)

##### moveFieldValues()

```ts
moveFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

Moves the value at the first specified index to the second specified index within an array field.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **index1**: `number`

• **index2**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:1075](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L1075)

##### pushFieldValue()

```ts
pushFieldValue<TField>(
   field, 
   value, 
   opts?): void
```

Pushes a value into an array field.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **value**: [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:939](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L939)

##### removeFieldValue()

```ts
removeFieldValue<TField>(
   field, 
   index, 
opts?): Promise<void>
```

Removes a value from an array field at the specified index.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **index**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FormApi.ts:1010](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L1010)

##### replaceFieldValue()

```ts
replaceFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

Replaces a value into an array field at the specified index.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **index**: `number`

• **value**: [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\> *extends* `any`[] ? `any`[] & [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FormApi.ts:984](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L984)

##### reset()

```ts
reset(): void
```

Resets the form state to the default values.

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:504](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L504)

##### resetFieldMeta()

```ts
resetFieldMeta<TField>(fieldMeta): Record<TField, FieldMeta>
```

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **fieldMeta**: `Record`\<`TField`, [`FieldMeta`](index.md#fieldmeta)\>

###### Returns

`Record`\<`TField`, [`FieldMeta`](index.md#fieldmeta)\>

###### Source

[packages/form-core/src/FormApi.ts:876](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L876)

##### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

Updates the metadata of the specified field.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<[`FieldMeta`](index.md#fieldmeta)\>

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:861](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L861)

##### setFieldValue()

```ts
setFieldValue<TField>(
   field, 
   updater, 
   opts?): void
```

Sets the value of the specified field and optionally updates the touched state.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<[`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>\>

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:900](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L900)

##### swapFieldValues()

```ts
swapFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

Swaps the values at the specified indices within an array field.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **index1**: `number`

• **index2**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:1049](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L1049)

##### update()

```ts
update(options?): void
```

Updates the form options and form state.

###### Parameters

• **options?**: [`FormOptions`](index.md#formoptionstformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:464](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L464)

##### validateAllFields()

```ts
validateAllFields(cause): Promise<ValidationError[]>
```

Validates all fields in the form using the correct handlers for a given validation type.

###### Parameters

• **cause**: `ValidationCause`

###### Returns

`Promise`\<[`ValidationError`](index.md#validationerror)[]\>

###### Source

[packages/form-core/src/FormApi.ts:519](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L519)

##### validateArrayFieldsStartingFrom()

```ts
validateArrayFieldsStartingFrom<TField>(
   field, 
   index, 
cause): Promise<ValidationError[]>
```

Validates the children of a specified array in the form starting from a given index until the end using the correct handlers for a given validation type.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **index**: `number`

• **cause**: `ValidationCause`

###### Returns

`Promise`\<[`ValidationError`](index.md#validationerror)[]\>

###### Source

[packages/form-core/src/FormApi.ts:546](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L546)

##### validateField()

```ts
validateField<TField>(field, cause): ValidationError[] | Promise<ValidationError[]>
```

Validates a specified field in the form using the correct handlers for a given validation type.

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **cause**: `ValidationCause`

###### Returns

[`ValidationError`](index.md#validationerror)[] \| `Promise`\<[`ValidationError`](index.md#validationerror)[]\>

###### Source

[packages/form-core/src/FormApi.ts:585](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L585)

## Interfaces

### FieldApiOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

An object type representing the required options for the FieldApi class.

#### Extends

- [`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Type parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](index.md#deepkeysttdepth)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\> = [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>

#### Properties

##### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`asyncAlways`](index.md#asyncalways-1)

###### Source

[packages/form-core/src/FieldApi.ts:283](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L283)

##### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`asyncDebounceMs`](index.md#asyncdebouncems-1)

###### Source

[packages/form-core/src/FieldApi.ts:279](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L279)

##### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`defaultMeta`](index.md#defaultmeta-1)

###### Source

[packages/form-core/src/FieldApi.ts:302](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L302)

##### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`defaultValue`](index.md#defaultvalue-1)

###### Source

[packages/form-core/src/FieldApi.ts:275](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L275)

##### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

###### Source

[packages/form-core/src/FieldApi.ts:325](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L325)

##### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`name`](index.md#name-2)

###### Source

[packages/form-core/src/FieldApi.ts:271](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L271)

##### preserveValue?

```ts
optional preserveValue: boolean;
```

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`preserveValue`](index.md#preservevalue-1)

###### Source

[packages/form-core/src/FieldApi.ts:284](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L284)

##### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`validatorAdapter`](index.md#validatoradapter-1)

###### Source

[packages/form-core/src/FieldApi.ts:288](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L288)

##### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of validators to pass to the field

###### Inherited from

[`FieldOptions`](index.md#fieldoptionstparentdatatnametfieldvalidatortformvalidatortdata).[`validators`](index.md#validators-1)

###### Source

[packages/form-core/src/FieldApi.ts:292](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L292)

***

### FieldOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

An object type representing the options for a field in a form.

#### Extended by

- [`FieldApiOptions`](index.md#fieldapioptionstparentdatatnametfieldvalidatortformvalidatortdata)

#### Type parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](index.md#deepkeysttdepth)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\> = [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>

#### Properties

##### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

###### Source

[packages/form-core/src/FieldApi.ts:283](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L283)

##### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

###### Source

[packages/form-core/src/FieldApi.ts:279](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L279)

##### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

###### Source

[packages/form-core/src/FieldApi.ts:302](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L302)

##### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

###### Source

[packages/form-core/src/FieldApi.ts:275](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L275)

##### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

###### Source

[packages/form-core/src/FieldApi.ts:271](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L271)

##### preserveValue?

```ts
optional preserveValue: boolean;
```

###### Source

[packages/form-core/src/FieldApi.ts:284](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L284)

##### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

###### Source

[packages/form-core/src/FieldApi.ts:288](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L288)

##### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

A list of validators to pass to the field

###### Source

[packages/form-core/src/FieldApi.ts:292](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L292)

***

### FieldValidators\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

#### Type parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](index.md#deepkeysttdepth)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\> = [`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TParentData`, `TName`\>

#### Properties

##### onBlur?

```ts
optional onBlur: FieldValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

An optional function, that when run when subscribing to blur event of input.
If `validatorAdapter` is passed, this may also accept a property from the respective adapter

###### Example

```ts
`z.string().min(1)` if `zodAdapter` is passed
```

###### Source

[packages/form-core/src/FieldApi.ts:195](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L195)

##### onBlurAsync?

```ts
optional onBlurAsync: FieldAsyncValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

An optional property similar to `onBlur` but async validation. If `validatorAdapter`
is passed, this may also accept a property from the respective adapter

###### Example

```ts
`z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })` if `zodAdapter` is passed
```

###### Source

[packages/form-core/src/FieldApi.ts:208](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L208)

##### onBlurAsyncDebounceMs?

```ts
optional onBlurAsyncDebounceMs: number;
```

An optional number to represent how long the `onBlurAsync` should wait before running

If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

###### Source

[packages/form-core/src/FieldApi.ts:221](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L221)

##### onBlurListenTo?

```ts
optional onBlurListenTo: unknown extends TParentData ? string : object extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never[];
```

An optional list of field names that should trigger this field's `onBlur` and `onBlurAsync` events when its value changes

###### Source

[packages/form-core/src/FieldApi.ts:225](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L225)

##### onChange?

```ts
optional onChange: FieldValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

An optional property that takes a `ValidateFn` which is a generic of `TData` and `TParentData`.
If `validatorAdapter` is passed, this may also accept a property from the respective adapter

###### Example

```ts
`z.string().min(1)` if `zodAdapter` is passed
```

###### Source

[packages/form-core/src/FieldApi.ts:159](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L159)

##### onChangeAsync?

```ts
optional onChangeAsync: FieldAsyncValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

An optional property similar to `onChange` but async validation. If `validatorAdapter`
is passed, this may also accept a property from the respective adapter

###### Example

```ts
`z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })` if `zodAdapter` is passed
```

###### Source

[packages/form-core/src/FieldApi.ts:172](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L172)

##### onChangeAsyncDebounceMs?

```ts
optional onChangeAsyncDebounceMs: number;
```

An optional number to represent how long the `onChangeAsync` should wait before running

If set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds

###### Source

[packages/form-core/src/FieldApi.ts:184](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L184)

##### onChangeListenTo?

```ts
optional onChangeListenTo: unknown extends TParentData ? string : object extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never[];
```

An optional list of field names that should trigger this field's `onChange` and `onChangeAsync` events when its value changes

###### Source

[packages/form-core/src/FieldApi.ts:188](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L188)

##### onMount?

```ts
optional onMount: FieldValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

An optional function that takes a param of `formApi` which is a generic type of `TData` and `TParentData`

###### Source

[packages/form-core/src/FieldApi.ts:146](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L146)

##### onSubmit?

```ts
optional onSubmit: FieldValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

An optional function, that when run when subscribing to submit event of input.
If `validatorAdapter` is passed, this may also accept a property from the respective adapter

###### Example

```ts
`z.string().min(1)` if `zodAdapter` is passed
```

###### Source

[packages/form-core/src/FieldApi.ts:232](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L232)

##### onSubmitAsync?

```ts
optional onSubmitAsync: FieldAsyncValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

An optional property similar to `onSubmit` but async validation. If `validatorAdapter`
is passed, this may also accept a property from the respective adapter

###### Example

```ts
`z.string().refine(async (val) => val.length > 3, { message: 'Testing 123' })` if `zodAdapter` is passed
```

###### Source

[packages/form-core/src/FieldApi.ts:245](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L245)

***

### FormOptions\<TFormData, TFormValidator\>

An object representing the options for a form.

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

#### Properties

##### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If true, always run async validation, even when sync validation has produced an error. Defaults to undefined.

###### Source

[packages/form-core/src/FormApi.ts:132](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L132)

##### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Optional time in milliseconds if you want to introduce a delay before firing off an async action.

###### Source

[packages/form-core/src/FormApi.ts:136](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L136)

##### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

The default state for the form.

###### Source

[packages/form-core/src/FormApi.ts:128](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L128)

##### defaultValues?

```ts
optional defaultValues: TFormData;
```

Set initial values for your form.

###### Source

[packages/form-core/src/FormApi.ts:124](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L124)

##### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

A function to be called when the form is submitted, what should happen once the user submits a valid form returns `any` or a promise `Promise<any>`

###### Parameters

• **props**

• **props.formApi**: [`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

###### Returns

`any`

###### Source

[packages/form-core/src/FormApi.ts:148](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L148)

##### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

Specify an action for scenarios where the user tries to submit an invalid form.

###### Parameters

• **props**

• **props.formApi**: [`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:155](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L155)

##### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:159](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L159)

##### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

A validator adapter to support usage of extra validation types (IE: Zod, Yup, or Valibot usage)

###### Source

[packages/form-core/src/FormApi.ts:140](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L140)

##### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

A list of validators to pass to the form

###### Source

[packages/form-core/src/FormApi.ts:144](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L144)

***

### FormValidators\<TFormData, TFormValidator\>

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

#### Properties

##### onBlur?

```ts
optional onBlur: FormValidateOrFn<TFormData, TFormValidator>;
```

Optional function that validates the form data when a field loses focus, returns a ValidationError

###### Source

[packages/form-core/src/FormApi.ts:88](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L88)

##### onBlurAsync?

```ts
optional onBlurAsync: FormAsyncValidateOrFn<TFormData, TFormValidator>;
```

Optional onBlur asynchronous validation method for when a field loses focus return a `ValidationError` or a promise of `Promise<ValidationError>`

###### Source

[packages/form-core/src/FormApi.ts:92](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L92)

##### onBlurAsyncDebounceMs?

```ts
optional onBlurAsyncDebounceMs: number;
```

The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.

###### Source

[packages/form-core/src/FormApi.ts:96](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L96)

##### onChange?

```ts
optional onChange: FormValidateOrFn<TFormData, TFormValidator>;
```

Optional function that checks the validity of your data whenever a value changes

###### Source

[packages/form-core/src/FormApi.ts:76](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L76)

##### onChangeAsync?

```ts
optional onChangeAsync: FormAsyncValidateOrFn<TFormData, TFormValidator>;
```

Optional onChange asynchronous counterpart to onChange. Useful for more complex validation logic that might involve server requests.

###### Source

[packages/form-core/src/FormApi.ts:80](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L80)

##### onChangeAsyncDebounceMs?

```ts
optional onChangeAsyncDebounceMs: number;
```

The default time in milliseconds that if set to a number larger than 0, will debounce the async validation event by this length of time in milliseconds.

###### Source

[packages/form-core/src/FormApi.ts:84](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L84)

##### onMount?

```ts
optional onMount: FormValidateOrFn<TFormData, TFormValidator>;
```

Optional function that fires as soon as the component mounts.

###### Source

[packages/form-core/src/FormApi.ts:72](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L72)

##### onSubmit?

```ts
optional onSubmit: FormValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:97](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L97)

##### onSubmitAsync?

```ts
optional onSubmitAsync: FormAsyncValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:98](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L98)

## Type Aliases

### DeepKeys\<T, TDepth\>

```ts
type DeepKeys<T, TDepth>: TDepth["length"] extends 5 ? never : unknown extends T ? PrefixFromDepth<string, TDepth> : object extends T ? PrefixFromDepth<string, TDepth> : T extends readonly any[] & IsTuple<T> ? PrefixTupleAccessor<T, AllowedIndexes<T>, TDepth> : T extends any[] ? PrefixArrayAccessor<T, [...TDepth, any]> : T extends Date ? never : T extends object ? PrefixObjectAccessor<T, TDepth> : T extends string | number | boolean | bigint ? "" : never;
```

The keys of an object or array, deeply nested.

#### Type parameters

• **T**

• **TDepth** *extends* `any`[] = []

#### Source

[packages/form-core/src/util-types.ts:85](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/util-types.ts#L85)

***

### DeepValue\<TValue, TAccessor, TNullable\>

```ts
type DeepValue<TValue, TAccessor, TNullable>: unknown extends TValue ? TValue : TValue extends ReadonlyArray<any> ? TAccessor extends `[${infer TBrackets}].${infer TAfter}` ? DeepValue<DeepValue<TValue, TBrackets>, TAfter> : TAccessor extends `[${infer TBrackets}]` ? DeepValue<TValue, TBrackets> : TAccessor extends keyof TValue ? TValue[TAccessor] : TValue[TAccessor & number] : TValue extends Record<string | number, any> ? TAccessor extends `${infer TBefore}[${infer TEverythingElse}` ? DeepValue<DeepValue<TValue, TBefore>, `[${TEverythingElse}`> : TAccessor extends `[${infer TBrackets}]` ? DeepValue<TValue, TBrackets> : TAccessor extends `${infer TBefore}.${infer TAfter}` ? DeepValue<DeepValue<TValue, TBefore>, TAfter> : TAccessor extends string ? TNullable extends true ? Nullable<TValue[TAccessor]> : TValue[TAccessor] : never : never;
```

Infer the type of a deeply nested property within an object or an array.

#### Type parameters

• **TValue**

• **TAccessor**

• **TNullable** *extends* `boolean` = `IsNullable`\<`TValue`\>

#### Source

[packages/form-core/src/util-types.ts:111](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/util-types.ts#L111)

***

### FieldInfo\<TFormData, TFormValidator\>

```ts
type FieldInfo<TFormData, TFormValidator>: object;
```

An object representing the field information for a specific field within the form.

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

#### Type declaration

##### instance

```ts
instance: FieldApi<TFormData, any, Validator<unknown, unknown> | undefined, TFormValidator> | null;
```

An instance of the FieldAPI.

##### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

A record of field validation internal handling.

#### Source

[packages/form-core/src/FormApi.ts:175](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L175)

***

### FieldMeta

```ts
type FieldMeta: object;
```

An object type representing the metadata of a field in a form.

#### Type declaration

##### errorMap

```ts
errorMap: ValidationErrorMap;
```

A map of errors related to the field value.

##### errors

```ts
errors: ValidationError[];
```

An array of errors related to the field value.

##### isDirty

```ts
isDirty: boolean;
```

A flag that is `true` if the field's value has been modified by the user. Opposite of `isPristine`.

##### isPristine

```ts
isPristine: boolean;
```

A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.

##### isTouched

```ts
isTouched: boolean;
```

A flag indicating whether the field has been touched.

##### isValidating

```ts
isValidating: boolean;
```

A flag indicating whether the field is currently being validated.

##### touchedErrors

```ts
touchedErrors: ValidationError[];
```

An array of errors related to the touched state of the field.

#### Source

[packages/form-core/src/FieldApi.ts:331](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L331)

***

### FieldState\<TData\>

```ts
type FieldState<TData>: object;
```

An object type representing the state of a field.

#### Type parameters

• **TData**

#### Type declaration

##### meta

```ts
meta: FieldMeta;
```

The current metadata of the field.

##### value

```ts
value: TData;
```

The current value of the field.

#### Source

[packages/form-core/src/FieldApi.ts:365](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FieldApi.ts#L365)

***

### FormState\<TFormData\>

```ts
type FormState<TFormData>: object;
```

An object representing the current state of the form.

#### Type parameters

• **TFormData**

#### Type declaration

##### canSubmit

```ts
canSubmit: boolean;
```

A boolean indicating if the form can be submitted based on its current state.

##### errorMap

```ts
errorMap: ValidationErrorMap;
```

The error map for the form itself.

##### errors

```ts
errors: ValidationError[];
```

The error array for the form itself.

##### fieldMeta

```ts
fieldMeta: Record<DeepKeys<TFormData>, FieldMeta>;
```

A record of field metadata for each field in the form.

##### isDirty

```ts
isDirty: boolean;
```

A boolean indicating if any of the form's fields' values have been modified by the user. `True` if the user have modified at least one of the fields. Opposite of `isPristine`.

##### isFieldsValid

```ts
isFieldsValid: boolean;
```

A boolean indicating if all the form fields are valid.

##### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

A boolean indicating if any of the form fields are currently validating.

##### isFormValid

```ts
isFormValid: boolean;
```

A boolean indicating if the form is valid.

##### isFormValidating

```ts
isFormValidating: boolean;
```

A boolean indicating if the form is currently validating.

##### isPristine

```ts
isPristine: boolean;
```

A boolean indicating if none of the form's fields' values have been modified by the user. `True` if the user have not modified any of the fields. Opposite of `isDirty`.

##### isSubmitted

```ts
isSubmitted: boolean;
```

A boolean indicating if the form has been submitted.

##### isSubmitting

```ts
isSubmitting: boolean;
```

A boolean indicating if the form is currently submitting.

##### isTouched

```ts
isTouched: boolean;
```

A boolean indicating if any of the form fields have been touched.

##### isValid

```ts
isValid: boolean;
```

A boolean indicating if the form and all its fields are valid.

##### isValidating

```ts
isValidating: boolean;
```

A boolean indicating if the form or any of its fields are currently validating.

##### submissionAttempts

```ts
submissionAttempts: number;
```

A counter for tracking the number of submission attempts.

##### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

An internal mechanism used for keeping track of validation logic in a form.

##### values

```ts
values: TFormData;
```

The current values of the form fields.

#### Source

[packages/form-core/src/FormApi.ts:197](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L197)

***

### Updater\<TInput, TOutput\>

```ts
type Updater<TInput, TOutput>: TOutput | UpdaterFn<TInput, TOutput>;
```

#### Type parameters

• **TInput**

• **TOutput** = `TInput`

#### Source

[packages/form-core/src/utils.ts:7](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/utils.ts#L7)

***

### UpdaterFn()\<TInput, TOutput\>

```ts
type UpdaterFn<TInput, TOutput>: (input) => TOutput;
```

#### Type parameters

• **TInput**

• **TOutput** = `TInput`

#### Parameters

• **input**: `TInput`

#### Returns

`TOutput`

#### Source

[packages/form-core/src/utils.ts:5](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/utils.ts#L5)

***

### ValidationError

```ts
type ValidationError: undefined | false | null | string;
```

#### Source

[packages/form-core/src/types.ts:1](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/types.ts#L1)

***

### ValidationMeta

```ts
type ValidationMeta: object;
```

An object representing the validation metadata for a field. Not intended for public usage.

#### Type declaration

##### lastAbortController

```ts
lastAbortController: AbortController;
```

An abort controller stored in memory to cancel previous async validation attempts.

#### Source

[packages/form-core/src/FormApi.ts:165](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/FormApi.ts#L165)

## Functions

### mergeForm()

```ts
function mergeForm<TFormData, TFormValidator>(baseForm, state): FormApi<TFormData, TFormValidator>
```

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `undefined` \| `Validator`\<`TFormData`, `unknown`\> = `undefined`

#### Parameters

• **baseForm**: [`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

• **state**: `Partial`\<[`FormState`](index.md#formstatetformdata)\<`TFormData`\>\>

#### Returns

[`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

#### Source

[packages/form-core/src/mergeForm.ts:36](https://github.com/TanStack/form/blob/f10203e216e9677be0f4fb54090fb71474ca76d0/packages/form-core/src/mergeForm.ts#L36)
