# Class: FieldApi\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

A class representing the API for managing a form field.

Normally, you will not need to create a new `FieldApi` instance directly.
Instead, you will use a framework hook/function like `useField` or `createField`
to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling
the `new FieldApi` constructor.

## Type parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](deepvalue.md)\<`TParentData`, `TName`\>

## Constructors

### new FieldApi()

```ts
new FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
```

Initializes a new `FieldApi` instance.

#### Parameters

• **opts**: [`FieldApiOptions`](fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

[`FieldApi`](fieldapi.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Source

[packages/form-core/src/FieldApi.ts:431](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L431)

## Properties

### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

A reference to the form API instance.

#### Source

[packages/form-core/src/FieldApi.ts:394](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L394)

***

### name

```ts
name: unknown extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never;
```

The field name.

#### Source

[packages/form-core/src/FieldApi.ts:404](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L404)

***

### options

```ts
options: FieldApiOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

The field options.

#### Source

[packages/form-core/src/FieldApi.ts:408](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L408)

***

### state

```ts
state: FieldState<TData>;
```

The current field state.

#### Source

[packages/form-core/src/FieldApi.ts:422](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L422)

***

### store

```ts
store: Store<FieldState<TData>, (cb) => FieldState<TData>>;
```

The field state store.

#### Source

[packages/form-core/src/FieldApi.ts:418](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L418)

## Methods

### getInfo()

```ts
getInfo(): FieldInfo<TParentData, TFormValidator>
```

Gets the field information object.

#### Returns

[`FieldInfo`](fieldinfo.md)\<`TParentData`, `TFormValidator`\>

#### Source

[packages/form-core/src/FieldApi.ts:638](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L638)

***

### getMeta()

```ts
getMeta(): FieldMeta
```

Gets the current field metadata.

#### Returns

[`FieldMeta`](fieldmeta.md)

#### Source

[packages/form-core/src/FieldApi.ts:617](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L617)

***

### ~~getValue()~~

```ts
getValue(): TData
```

Gets the current field value.

#### Returns

`TData`

#### Deprecated

Use `field.state.value` instead.

#### Source

[packages/form-core/src/FieldApi.ts:594](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L594)

***

### handleBlur()

```ts
handleBlur(): void
```

Handles the blur event.

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:952](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L952)

***

### handleChange()

```ts
handleChange(updater): void
```

Handles the change event.

#### Parameters

• **updater**: [`Updater`](updater.md)\<`TData`\>

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:945](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L945)

***

### insertValue()

```ts
insertValue(
   index, 
   value, 
opts?): Promise<void>
```

Inserts a value at the specified index, shifting the subsequent values to the right.

#### Parameters

• **index**: `number`

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/form-core/src/FieldApi.ts:651](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L651)

***

### mount()

```ts
mount(): () => void
```

Mounts the field instance to the form.

#### Returns

`Function`

##### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:514](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L514)

***

### moveValue()

```ts
moveValue(
   aIndex, 
   bIndex, 
   opts?): void
```

Moves the value at the first specified index to the second specified index.

#### Parameters

• **aIndex**: `number`

• **bIndex**: `number`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:681](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L681)

***

### pushValue()

```ts
pushValue(value, opts?): void
```

Pushes a new value to the field.

#### Parameters

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:643](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L643)

***

### removeValue()

```ts
removeValue(index, opts?): Promise<void>
```

Removes a value at the specified index.

#### Parameters

• **index**: `number`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/form-core/src/FieldApi.ts:669](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L669)

***

### replaceValue()

```ts
replaceValue(
   index, 
   value, 
opts?): Promise<void>
```

Replaces a value at the specified index.

#### Parameters

• **index**: `number`

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Source

[packages/form-core/src/FieldApi.ts:660](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L660)

***

### setMeta()

```ts
setMeta(updater): void
```

Sets the field metadata.

#### Parameters

• **updater**: [`Updater`](updater.md)\<[`FieldMeta`](fieldmeta.md)\>

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:632](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L632)

***

### setValue()

```ts
setValue(updater, options?): void
```

Sets the field value and run the `change` validator.

#### Parameters

• **updater**: [`Updater`](updater.md)\<`TData`\>

• **options?**

• **options.notify?**: `boolean`

• **options.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:601](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L601)

***

### swapValues()

```ts
swapValues(
   aIndex, 
   bIndex, 
   opts?): void
```

Swaps the values at the specified indices.

#### Parameters

• **aIndex**: `number`

• **bIndex**: `number`

• **opts?**

• **opts.touch?**: `boolean`

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:675](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L675)

***

### update()

```ts
update(opts): void
```

Updates the field instance with new options.

#### Parameters

• **opts**: [`FieldApiOptions`](fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

`void`

#### Source

[packages/form-core/src/FieldApi.ts:561](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L561)

***

### validate()

```ts
validate(cause): ValidationError[] | Promise<ValidationError[]>
```

Validates the field value.

#### Parameters

• **cause**: `ValidationCause`

#### Returns

[`ValidationError`](validationerror.md)[] \| `Promise`\<[`ValidationError`](validationerror.md)[]\>

#### Source

[packages/form-core/src/FieldApi.ts:919](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/form-core/src/FieldApi.ts#L919)
