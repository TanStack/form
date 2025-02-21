---
id: FieldApi
title: FieldApi
---

# Class: FieldApi\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer\>

Defined in: [packages/form-core/src/FieldApi.ts:832](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L832)

A class representing the API for managing a form field.

Normally, you will not need to create a new `FieldApi` instance directly.
Instead, you will use a framework hook/function like `useField` or `createField`
to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling
the `new FieldApi` constructor.

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

• **TOnMount** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnChange** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnChangeAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnBlur** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnBlurAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnSubmit** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnSubmitAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TFormOnMount** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnChange** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnChangeAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

• **TFormOnBlur** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnBlurAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

• **TFormOnSubmit** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnSubmitAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

• **TFormOnServer** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

## Constructors

### new FieldApi()

```ts
new FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer>(opts): FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer>
```

Defined in: [packages/form-core/src/FieldApi.ts:943](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L943)

Initializes a new `FieldApi` instance.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnServer`\>

#### Returns

[`FieldApi`](fieldapi.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnServer`\>

## Properties

### form

```ts
form: FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer>;
```

Defined in: [packages/form-core/src/FieldApi.ts:861](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L861)

A reference to the form API instance.

***

### name

```ts
name: unknown extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never;
```

Defined in: [packages/form-core/src/FieldApi.ts:884](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L884)

The field name.

***

### options

```ts
options: FieldApiOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer>;
```

Defined in: [packages/form-core/src/FieldApi.ts:888](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L888)

The field options.

***

### store

```ts
store: Derived<FieldState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:911](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L911)

The field state store.

***

### timeoutIds

```ts
timeoutIds: Record<ValidationCause, null | Timeout>;
```

Defined in: [packages/form-core/src/FieldApi.ts:938](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L938)

## Accessors

### state

#### Get Signature

```ts
get state(): FieldState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync>
```

Defined in: [packages/form-core/src/FieldApi.ts:935](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L935)

The current field state.

##### Returns

[`FieldState`](../type-aliases/fieldstate.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`\>

## Methods

### getInfo()

```ts
getInfo(): FieldInfo<TParentData>
```

Defined in: [packages/form-core/src/FieldApi.ts:1189](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1189)

Gets the field information object.

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TParentData`\>

***

### getMeta()

```ts
getMeta(): FieldMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync>
```

Defined in: [packages/form-core/src/FieldApi.ts:1157](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1157)

#### Returns

[`FieldMeta`](../type-aliases/fieldmeta.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`\>

***

### ~~getValue()~~

```ts
getValue(): TData
```

Defined in: [packages/form-core/src/FieldApi.ts:1139](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1139)

Gets the current field value.

#### Returns

`TData`

#### Deprecated

Use `field.state.value` instead.

***

### handleBlur()

```ts
handleBlur(): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1561](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1561)

Handles the blur event.

#### Returns

`void`

***

### handleChange()

```ts
handleChange(updater): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1554](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1554)

Handles the change event.

#### Parameters

##### updater

[`Updater`](../type-aliases/updater.md)\<`TData`\>

#### Returns

`void`

***

### insertValue()

```ts
insertValue(
   index, 
   value, 
opts?): Promise<void>
```

Defined in: [packages/form-core/src/FieldApi.ts:1202](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1202)

Inserts a value at the specified index, shifting the subsequent values to the right.

#### Parameters

##### index

`number`

##### value

`TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

##### opts?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

***

### mount()

```ts
mount(): () => void
```

Defined in: [packages/form-core/src/FieldApi.ts:1046](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1046)

Mounts the field instance to the form.

#### Returns

`Function`

##### Returns

`void`

***

### moveValue()

```ts
moveValue(
   aIndex, 
   bIndex, 
   opts?): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1232](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1232)

Moves the value at the first specified index to the second specified index.

#### Parameters

##### aIndex

`number`

##### bIndex

`number`

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

***

### pushValue()

```ts
pushValue(value, opts?): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1194](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1194)

Pushes a new value to the field.

#### Parameters

##### value

`TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

***

### removeValue()

```ts
removeValue(index, opts?): Promise<void>
```

Defined in: [packages/form-core/src/FieldApi.ts:1220](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1220)

Removes a value at the specified index.

#### Parameters

##### index

`number`

##### opts?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

***

### replaceValue()

```ts
replaceValue(
   index, 
   value, 
opts?): Promise<void>
```

Defined in: [packages/form-core/src/FieldApi.ts:1211](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1211)

Replaces a value at the specified index.

#### Parameters

##### index

`number`

##### value

`TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

##### opts?

`UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

***

### setErrorMap()

```ts
setErrorMap(errorMap): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1581](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1581)

Updates the field's errorMap

#### Parameters

##### errorMap

`ValidationErrorMap`

#### Returns

`void`

***

### setMeta()

```ts
setMeta(updater): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1162](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1162)

Sets the field metadata.

#### Parameters

##### updater

[`Updater`](../type-aliases/updater.md)\<[`FieldMeta`](../type-aliases/fieldmeta.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`\>\>

#### Returns

`void`

***

### setValue()

```ts
setValue(updater, options?): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1146](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1146)

Sets the field value and run the `change` validator.

#### Parameters

##### updater

[`Updater`](../type-aliases/updater.md)\<`TData`\>

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### swapValues()

```ts
swapValues(
   aIndex, 
   bIndex, 
   opts?): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1226](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1226)

Swaps the values at the specified indices.

#### Parameters

##### aIndex

`number`

##### bIndex

`number`

##### opts?

`UpdateMetaOptions`

#### Returns

`void`

***

### update()

```ts
update(opts): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1088](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1088)

Updates the field instance with new options.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnServer`\>

#### Returns

`void`

***

### validate()

```ts
validate(cause, opts?): unknown[] | Promise<unknown[]>
```

Defined in: [packages/form-core/src/FieldApi.ts:1521](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1521)

Validates the field value.

#### Parameters

##### cause

`ValidationCause`

##### opts?

###### skipFormValidation?

`boolean`

#### Returns

`unknown`[] \| `Promise`\<`unknown`[]\>
