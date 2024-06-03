# @tanstack/form-core

## Classes

### FieldApi\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

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

###### Parameters

• **opts**: `FieldApiOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

###### Returns

[`FieldApi`](index.md#fieldapitparentdatatnametfieldvalidatortformvalidatortdata)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

###### Source

[packages/form-core/src/FieldApi.ts:309](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L309)

#### Properties

##### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

###### Source

[packages/form-core/src/FieldApi.ts:281](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L281)

##### name

```ts
name: unknown extends TParentData ? string : object extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never;
```

###### Source

[packages/form-core/src/FieldApi.ts:288](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L288)

##### state

```ts
state: FieldState<TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:303](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L303)

#### Methods

##### handleBlur()

```ts
handleBlur(): void
```

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:799](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L799)

##### handleChange()

```ts
handleChange(updater): void
```

###### Parameters

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<`TData`\>

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:795](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L795)

##### insertValue()

```ts
insertValue(
   index, 
   value, 
opts?): Promise<void>
```

###### Parameters

• **index**: `number`

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FieldApi.ts:520](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L520)

##### mount()

```ts
mount(): () => void
```

###### Returns

`Function`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:394](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L394)

##### moveValue()

```ts
moveValue(
   aIndex, 
   bIndex, 
   opts?): void
```

###### Parameters

• **aIndex**: `number`

• **bIndex**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:538](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L538)

##### pushValue()

```ts
pushValue(value, opts?): void
```

###### Parameters

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:515](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L515)

##### removeValue()

```ts
removeValue(index, opts?): Promise<void>
```

###### Parameters

• **index**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FieldApi.ts:532](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L532)

##### replaceValue()

```ts
replaceValue(
   index, 
   value, 
opts?): Promise<void>
```

###### Parameters

• **index**: `number`

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FieldApi.ts:526](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L526)

##### setMeta()

```ts
setMeta(updater): void
```

###### Parameters

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<[`FieldMeta`](index.md#fieldmeta)\>

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:507](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L507)

##### setValue()

```ts
setValue(updater, options?): void
```

###### Parameters

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<`TData`\>

• **options?**

• **options.notify?**: `boolean`

• **options.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:478](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L478)

##### swapValues()

```ts
swapValues(
   aIndex, 
   bIndex, 
   opts?): void
```

###### Parameters

• **aIndex**: `number`

• **bIndex**: `number`

• **opts?**

• **opts.touch?**: `boolean`

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:535](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L535)

##### update()

```ts
update(opts): void
```

###### Parameters

• **opts**: `FieldApiOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

###### Returns

`void`

###### Source

[packages/form-core/src/FieldApi.ts:442](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L442)

***

### FormApi\<TFormData, TFormValidator\>

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

#### Constructors

##### new FormApi()

```ts
new FormApi<TFormData, TFormValidator>(opts?): FormApi<TFormData, TFormValidator>
```

###### Parameters

• **opts?**: [`FormOptions`](index.md#formoptionstformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Returns

[`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Source

[packages/form-core/src/FormApi.ts:215](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L215)

#### Properties

##### prevTransformArray

```ts
prevTransformArray: unknown[] = [];
```

###### Source

[packages/form-core/src/FormApi.ts:213](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L213)

##### state

```ts
state: FormState<TFormData>;
```

Do not use `state` directly, as it is not reactive.
Please use form.useStore() utility to subscribe to state

###### Source

[packages/form-core/src/FormApi.ts:205](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L205)

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

[packages/form-core/src/FormApi.ts:776](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L776)

##### getFieldInfo()

```ts
getFieldInfo<TField>(field): FieldInfo<TFormData, TFormValidator>
```

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

###### Returns

[`FieldInfo`](index.md#fieldinfotformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Source

[packages/form-core/src/FormApi.ts:699](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L699)

##### getFieldMeta()

```ts
getFieldMeta<TField>(field): undefined | FieldMeta
```

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

###### Returns

`undefined` \| [`FieldMeta`](index.md#fieldmeta)

###### Source

[packages/form-core/src/FormApi.ts:693](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L693)

##### getFieldValue()

```ts
getFieldValue<TField>(field): DeepValue<TFormData, TField, IsNullable<TFormData>>
```

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

###### Returns

[`DeepValue`](index.md#deepvaluetvaluetaccessortnullable)\<`TFormData`, `TField`, `IsNullable`\<`TFormData`\>\>

###### Source

[packages/form-core/src/FormApi.ts:689](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L689)

##### handleSubmit()

```ts
handleSubmit(): Promise<void>
```

Check to see that the form and all fields have been touched
If they have not, touch them all and run validation

###### Returns

`Promise`\<`void`\>

###### Source

[packages/form-core/src/FormApi.ts:632](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L632)

##### insertFieldValue()

```ts
insertFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

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

[packages/form-core/src/FormApi.ts:802](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L802)

##### mount()

```ts
mount(): void
```

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:313](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L313)

##### moveFieldValues()

```ts
moveFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

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

[packages/form-core/src/FormApi.ts:908](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L908)

##### pushFieldValue()

```ts
pushFieldValue<TField>(
   field, 
   value, 
   opts?): void
```

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

[packages/form-core/src/FormApi.ts:787](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L787)

##### removeFieldValue()

```ts
removeFieldValue<TField>(
   field, 
   index, 
opts?): Promise<void>
```

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

[packages/form-core/src/FormApi.ts:849](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L849)

##### replaceFieldValue()

```ts
replaceFieldValue<TField>(
   field, 
   index, 
   value, 
opts?): Promise<void>
```

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

[packages/form-core/src/FormApi.ts:826](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L826)

##### reset()

```ts
reset(): void
```

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:369](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L369)

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

[packages/form-core/src/FormApi.ts:730](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L730)

##### setFieldMeta()

```ts
setFieldMeta<TField>(field, updater): void
```

###### Type parameters

• **TField** *extends* `string` \| `number`

###### Parameters

• **field**: `TField`

• **updater**: [`Updater`](index.md#updatertinputtoutput)\<[`FieldMeta`](index.md#fieldmeta)\>

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:715](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L715)

##### setFieldValue()

```ts
setFieldValue<TField>(
   field, 
   updater, 
   opts?): void
```

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

[packages/form-core/src/FormApi.ts:751](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L751)

##### swapFieldValues()

```ts
swapFieldValues<TField>(
   field, 
   index1, 
   index2, 
   opts?): void
```

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

[packages/form-core/src/FormApi.ts:885](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L885)

##### update()

```ts
update(options?): void
```

###### Parameters

• **options?**: [`FormOptions`](index.md#formoptionstformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:332](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L332)

## Interfaces

### FieldOptions\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

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

###### Source

[packages/form-core/src/FieldApi.ts:212](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L212)

##### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

###### Source

[packages/form-core/src/FieldApi.ts:211](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L211)

##### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

###### Source

[packages/form-core/src/FieldApi.ts:222](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L222)

##### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:210](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L210)

##### name

```ts
name: TName;
```

###### Source

[packages/form-core/src/FieldApi.ts:209](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L209)

##### preserveValue?

```ts
optional preserveValue: boolean;
```

###### Source

[packages/form-core/src/FieldApi.ts:213](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L213)

##### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

###### Source

[packages/form-core/src/FieldApi.ts:214](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L214)

##### validators?

```ts
optional validators: FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:215](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L215)

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

###### Source

[packages/form-core/src/FieldApi.ts:166](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L166)

##### onBlurAsync?

```ts
optional onBlurAsync: FieldAsyncValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:173](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L173)

##### onBlurAsyncDebounceMs?

```ts
optional onBlurAsyncDebounceMs: number;
```

###### Source

[packages/form-core/src/FieldApi.ts:180](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L180)

##### onBlurListenTo?

```ts
optional onBlurListenTo: unknown extends TParentData ? string : object extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never[];
```

###### Source

[packages/form-core/src/FieldApi.ts:181](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L181)

##### onChange?

```ts
optional onChange: FieldValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:150](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L150)

##### onChangeAsync?

```ts
optional onChangeAsync: FieldAsyncValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:157](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L157)

##### onChangeAsyncDebounceMs?

```ts
optional onChangeAsyncDebounceMs: number;
```

###### Source

[packages/form-core/src/FieldApi.ts:164](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L164)

##### onChangeListenTo?

```ts
optional onChangeListenTo: unknown extends TParentData ? string : object extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never[];
```

###### Source

[packages/form-core/src/FieldApi.ts:165](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L165)

##### onMount?

```ts
optional onMount: FieldValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:143](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L143)

##### onSubmit?

```ts
optional onSubmit: FieldValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:182](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L182)

##### onSubmitAsync?

```ts
optional onSubmitAsync: FieldAsyncValidateOrFn<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### Source

[packages/form-core/src/FieldApi.ts:189](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L189)

***

### FormOptions\<TFormData, TFormValidator\>

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

#### Properties

##### asyncAlways?

```ts
optional asyncAlways: boolean;
```

###### Source

[packages/form-core/src/FormApi.ts:99](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L99)

##### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

###### Source

[packages/form-core/src/FormApi.ts:100](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L100)

##### defaultState?

```ts
optional defaultState: Partial<FormState<TFormData>>;
```

###### Source

[packages/form-core/src/FormApi.ts:98](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L98)

##### defaultValues?

```ts
optional defaultValues: TFormData;
```

###### Source

[packages/form-core/src/FormApi.ts:97](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L97)

##### onSubmit()?

```ts
optional onSubmit: (props) => any;
```

###### Parameters

• **props**

• **props.formApi**: [`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

###### Returns

`any`

###### Source

[packages/form-core/src/FormApi.ts:103](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L103)

##### onSubmitInvalid()?

```ts
optional onSubmitInvalid: (props) => void;
```

###### Parameters

• **props**

• **props.formApi**: [`FormApi`](index.md#formapitformdatatformvalidator)\<`TFormData`, `TFormValidator`\>

• **props.value**: `TFormData`

###### Returns

`void`

###### Source

[packages/form-core/src/FormApi.ts:107](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L107)

##### transform?

```ts
optional transform: FormTransform<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:111](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L111)

##### validatorAdapter?

```ts
optional validatorAdapter: TFormValidator;
```

###### Source

[packages/form-core/src/FormApi.ts:101](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L101)

##### validators?

```ts
optional validators: FormValidators<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:102](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L102)

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

###### Source

[packages/form-core/src/FormApi.ts:73](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L73)

##### onBlurAsync?

```ts
optional onBlurAsync: FormAsyncValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:74](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L74)

##### onBlurAsyncDebounceMs?

```ts
optional onBlurAsyncDebounceMs: number;
```

###### Source

[packages/form-core/src/FormApi.ts:75](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L75)

##### onChange?

```ts
optional onChange: FormValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:70](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L70)

##### onChangeAsync?

```ts
optional onChangeAsync: FormAsyncValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:71](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L71)

##### onChangeAsyncDebounceMs?

```ts
optional onChangeAsyncDebounceMs: number;
```

###### Source

[packages/form-core/src/FormApi.ts:72](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L72)

##### onMount?

```ts
optional onMount: FormValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:69](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L69)

##### onSubmit?

```ts
optional onSubmit: FormValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:76](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L76)

##### onSubmitAsync?

```ts
optional onSubmitAsync: FormAsyncValidateOrFn<TFormData, TFormValidator>;
```

###### Source

[packages/form-core/src/FormApi.ts:77](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L77)

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

[packages/form-core/src/util-types.ts:85](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/util-types.ts#L85)

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

[packages/form-core/src/util-types.ts:111](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/util-types.ts#L111)

***

### FieldInfo\<TFormData, TFormValidator\>

```ts
type FieldInfo<TFormData, TFormValidator>: object;
```

#### Type parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

#### Type declaration

##### instance

```ts
instance: FieldApi<TFormData, any, Validator<unknown, unknown> | undefined, TFormValidator> | null;
```

##### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

#### Source

[packages/form-core/src/FormApi.ts:121](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L121)

***

### FieldMeta

```ts
type FieldMeta: object;
```

#### Type declaration

##### errorMap

```ts
errorMap: ValidationErrorMap;
```

##### errors

```ts
errors: ValidationError[];
```

##### isDirty

```ts
isDirty: boolean;
```

##### isPristine

```ts
isPristine: boolean;
```

##### isTouched

```ts
isTouched: boolean;
```

##### isValidating

```ts
isValidating: boolean;
```

##### touchedErrors

```ts
touchedErrors: ValidationError[];
```

#### Source

[packages/form-core/src/FieldApi.ts:248](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L248)

***

### FieldState\<TData\>

```ts
type FieldState<TData>: object;
```

#### Type parameters

• **TData**

#### Type declaration

##### meta

```ts
meta: FieldMeta;
```

##### value

```ts
value: TData;
```

#### Source

[packages/form-core/src/FieldApi.ts:258](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FieldApi.ts#L258)

***

### FormState\<TFormData\>

```ts
type FormState<TFormData>: object;
```

#### Type parameters

• **TFormData**

#### Type declaration

##### canSubmit

```ts
canSubmit: boolean;
```

##### errorMap

```ts
errorMap: ValidationErrorMap;
```

##### errors

```ts
errors: ValidationError[];
```

##### fieldMeta

```ts
fieldMeta: Record<DeepKeys<TFormData>, FieldMeta>;
```

##### isDirty

```ts
isDirty: boolean;
```

##### isFieldsValid

```ts
isFieldsValid: boolean;
```

##### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

##### isFormValid

```ts
isFormValid: boolean;
```

##### isFormValidating

```ts
isFormValidating: boolean;
```

##### isPristine

```ts
isPristine: boolean;
```

##### isSubmitted

```ts
isSubmitted: boolean;
```

##### isSubmitting

```ts
isSubmitting: boolean;
```

##### isTouched

```ts
isTouched: boolean;
```

##### isValid

```ts
isValid: boolean;
```

##### isValidating

```ts
isValidating: boolean;
```

##### submissionAttempts

```ts
submissionAttempts: number;
```

##### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

##### values

```ts
values: TFormData;
```

#### Source

[packages/form-core/src/FormApi.ts:134](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/FormApi.ts#L134)

***

### Updater\<TInput, TOutput\>

```ts
type Updater<TInput, TOutput>: TOutput | UpdaterFn<TInput, TOutput>;
```

#### Type parameters

• **TInput**

• **TOutput** = `TInput`

#### Source

[packages/form-core/src/utils.ts:7](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/utils.ts#L7)

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

[packages/form-core/src/utils.ts:5](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/utils.ts#L5)

***

### ValidationError

```ts
type ValidationError: undefined | false | null | string;
```

#### Source

[packages/form-core/src/types.ts:1](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/types.ts#L1)

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

[packages/form-core/src/mergeForm.ts:36](https://github.com/TanStack/form/blob/4879e324ec0c87c978d4276d590c680f4c8470f1/packages/form-core/src/mergeForm.ts#L36)
