---
id: FieldApi
title: FieldApi
---

Defined in: [packages/form-core/src/FieldApi.ts:494](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L494)

A class representing the API for managing a form field.

Normally, you will not need to create a new `FieldApi` instance directly.
Instead, you will use a framework hook/function like `useField` or `createField`
to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling
the `new FieldApi` constructor.

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* [`DeepKeys`](../type-aliases/DeepKeys.md)\<`TParentData`\>

### TData

`TData` *extends* [`DeepValue`](../type-aliases/DeepValue.md)\<`TParentData`, `TName`\>

### TOnMount

`TOnMount` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TFormOnMount

`TFormOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChange

`TFormOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChangeAsync

`TFormOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnBlur

`TFormOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnBlurAsync

`TFormOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnSubmit

`TFormOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnSubmitAsync

`TFormOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnDynamic

`TFormOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnDynamicAsync

`TFormOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnServer

`TFormOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TParentSubmitMeta

`TParentSubmitMeta`

## Constructors

### Constructor

```ts
new FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>(opts): FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>;
```

Defined in: [packages/form-core/src/FieldApi.ts:673](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L673)

Initializes a new `FieldApi` instance.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/FieldApiOptions.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

#### Returns

`FieldApi`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

## Properties

### form

```ts
form: FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>;
```

Defined in: [packages/form-core/src/FieldApi.ts:573](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L573)

A reference to the form API instance.

#### Implementation of

```ts
FieldLikeAPI.form
```

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/FieldApi.ts:601](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L601)

The field name.

#### Implementation of

```ts
FieldLikeAPI.name
```

***

### options

```ts
options: FieldApiOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>;
```

Defined in: [packages/form-core/src/FieldApi.ts:605](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L605)

The field options.

#### Implementation of

```ts
FieldLikeAPI.options
```

***

### store

```ts
store: ReadonlyStore<FieldLikeState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:633](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L633)

The field state store.

#### Implementation of

```ts
FieldLikeAPI.store
```

***

### timeoutIds

```ts
timeoutIds: object;
```

Defined in: [packages/form-core/src/FieldApi.ts:664](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L664)

#### formListeners

```ts
formListeners: Record<ListenerCause, ReturnType<typeof setTimeout> | null>;
```

#### listeners

```ts
listeners: Record<ListenerCause, ReturnType<typeof setTimeout> | null>;
```

#### validations

```ts
validations: Record<ValidationCause, ReturnType<typeof setTimeout> | null>;
```

## Accessors

### state

#### Get Signature

```ts
get state(): FieldLikeState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>;
```

Defined in: [packages/form-core/src/FieldApi.ts:661](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L661)

The current field state.

##### Returns

`FieldLikeState`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`\>

## Methods

### clearValues()

```ts
clearValues(options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1175](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1175)

Clear all values from the array.

#### Parameters

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### getInfo()

```ts
getInfo(): FieldInfo<TParentData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1061](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1061)

Gets the field information object.

#### Returns

`FieldInfo`\<`TParentData`\>

#### Implementation of

```ts
FieldLikeAPI.getInfo
```

***

### getMeta()

```ts
getMeta(): FieldLikeMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1025](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1025)

#### Returns

`FieldLikeMeta`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`\>

#### Implementation of

```ts
FieldLikeAPI.getMeta
```

***

### ~~getValue()~~

```ts
getValue(): TData;
```

Defined in: [packages/form-core/src/FieldApi.ts:1002](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1002)

Gets the current field value.

#### Returns

`TData`

#### Deprecated

Use `field.state.value` instead.

***

### handleBlur()

```ts
handleBlur(): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1700](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1700)

Handles the blur event.

#### Returns

`void`

***

### handleChange()

```ts
handleChange(updater): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1693](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1693)

Handles the change event.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`TData`\>

#### Returns

`void`

***

### insertValue()

```ts
insertValue(
   index, 
   value, 
   options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1084](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1084)

Inserts a value at the specified index, shifting the subsequent values to the right.

#### Parameters

##### index

`number`

##### value

`TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### mount()

```ts
mount(): () => void;
```

Defined in: [packages/form-core/src/FieldApi.ts:820](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L820)

Mounts the field instance to the form.

#### Returns

A function to unmount the field instance.

```ts
(): void;
```

##### Returns

`void`

#### Implementation of

```ts
FieldLikeAPI.mount
```

***

### moveValue()

```ts
moveValue(
   aIndex, 
   bIndex, 
   options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1159](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1159)

Moves the value at the first specified index to the second specified index.

#### Parameters

##### aIndex

`number`

##### bIndex

`number`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### parseValueWithSchema()

```ts
parseValueWithSchema(schema): 
  | StandardSchemaV1Issue[]
  | undefined;
```

Defined in: [packages/form-core/src/FieldApi.ts:1743](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1743)

Parses the field's value with the given schema and returns
issues (if any). This method does NOT set any internal errors.

#### Parameters

##### schema

[`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TData`, `unknown`\>

The standard schema to parse this field's value with.

#### Returns

  \| [`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)[]
  \| `undefined`

***

### parseValueWithSchemaAsync()

```ts
parseValueWithSchemaAsync(schema): Promise<
  | StandardSchemaV1Issue[]
| undefined>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1755](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1755)

Parses the field's value with the given schema and returns
issues (if any). This method does NOT set any internal errors.

#### Parameters

##### schema

[`StandardSchemaV1`](../type-aliases/StandardSchemaV1.md)\<`TData`, `unknown`\>

The standard schema to parse this field's value with.

#### Returns

`Promise`\<
  \| [`StandardSchemaV1Issue`](../interfaces/StandardSchemaV1Issue.md)[]
  \| `undefined`\>

***

### pushValue()

```ts
pushValue(value, options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1066](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1066)

Pushes a new value to the field.

#### Parameters

##### value

`TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### removeValue()

```ts
removeValue(index, options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1124](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1124)

Removes a value at the specified index.

#### Parameters

##### index

`number`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### replaceValue()

```ts
replaceValue(
   index, 
   value, 
   options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1104](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1104)

Replaces a value at the specified index.

#### Parameters

##### index

`number`

##### value

`TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### setErrorMap()

```ts
setErrorMap(errorMap): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1716](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1716)

Updates the field's errorMap

#### Parameters

##### errorMap

`ValidationErrorMap`\<[`UnwrapFieldValidateOrFn`](../type-aliases/UnwrapFieldValidateOrFn.md)\<`TName`, `TOnMount`, `TFormOnMount`\>, [`UnwrapFieldValidateOrFn`](../type-aliases/UnwrapFieldValidateOrFn.md)\<`TName`, `TOnChange`, `TFormOnChange`\>, [`UnwrapFieldAsyncValidateOrFn`](../type-aliases/UnwrapFieldAsyncValidateOrFn.md)\<`TName`, `TOnChangeAsync`, `TFormOnChangeAsync`\>, [`UnwrapFieldValidateOrFn`](../type-aliases/UnwrapFieldValidateOrFn.md)\<`TName`, `TOnBlur`, `TFormOnBlur`\>, [`UnwrapFieldAsyncValidateOrFn`](../type-aliases/UnwrapFieldAsyncValidateOrFn.md)\<`TName`, `TOnBlurAsync`, `TFormOnBlurAsync`\>, [`UnwrapFieldValidateOrFn`](../type-aliases/UnwrapFieldValidateOrFn.md)\<`TName`, `TOnSubmit`, `TFormOnSubmit`\>, [`UnwrapFieldAsyncValidateOrFn`](../type-aliases/UnwrapFieldAsyncValidateOrFn.md)\<`TName`, `TOnSubmitAsync`, `TFormOnSubmitAsync`\>, [`UnwrapFieldValidateOrFn`](../type-aliases/UnwrapFieldValidateOrFn.md)\<`TName`, `TOnDynamic`, `TFormOnDynamic`\>, [`UnwrapFieldAsyncValidateOrFn`](../type-aliases/UnwrapFieldAsyncValidateOrFn.md)\<`TName`, `TOnDynamicAsync`, `TFormOnDynamicAsync`\>\>

#### Returns

`void`

***

### setMeta()

```ts
setMeta(updater): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1030](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1030)

Sets the field metadata.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`FieldLikeMetaBase`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`\>\>

#### Returns

`void`

#### Implementation of

```ts
FieldLikeAPI.setMeta
```

***

### setValue()

```ts
setValue(updater, options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1009](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1009)

Sets the field value and run the `change` validator.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`TData`\>

##### options?

`UpdateMetaOptions`

#### Returns

`void`

#### Implementation of

```ts
FieldLikeAPI.setValue
```

***

### swapValues()

```ts
swapValues(
   aIndex, 
   bIndex, 
   options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1139](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1139)

Swaps the values at the specified indices.

#### Parameters

##### aIndex

`number`

##### bIndex

`number`

##### options?

`UpdateMetaOptions`

#### Returns

`void`

***

### update()

```ts
update(opts): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:951](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L951)

Updates the field instance with new options.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/FieldApiOptions.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

#### Returns

`void`

***

### validate()

```ts
validate(cause, opts?): unknown[] | Promise<unknown[]>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1576](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1576)

Validates the field value.

#### Parameters

##### cause

`ValidationCause`

##### opts?

###### skipFormValidation?

`boolean`

###### skipGroupValidation?

`boolean`

#### Returns

`unknown`[] \| `Promise`\<`unknown`[]\>

#### Implementation of

```ts
FieldLikeAPI.validate
```
