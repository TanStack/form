---
id: FieldApi
title: FieldApi
---

# Class: FieldApi\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta\>

Defined in: [packages/form-core/src/FieldApi.ts:520](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L520)

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

Defined in: [packages/form-core/src/FieldApi.ts:712](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L712)

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

Defined in: [packages/form-core/src/FieldApi.ts:612](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L612)

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

Defined in: [packages/form-core/src/FieldApi.ts:640](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L640)

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

Defined in: [packages/form-core/src/FieldApi.ts:644](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L644)

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

Defined in: [packages/form-core/src/FieldApi.ts:672](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L672)

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

Defined in: [packages/form-core/src/FieldApi.ts:703](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L703)

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

Defined in: [packages/form-core/src/FieldApi.ts:700](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L700)

The current field state.

##### Returns

`FieldLikeState`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`\>

## Methods

### clearValues()

```ts
clearValues(options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1214](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1214)

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

Defined in: [packages/form-core/src/FieldApi.ts:1100](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1100)

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

Defined in: [packages/form-core/src/FieldApi.ts:1064](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1064)

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

Defined in: [packages/form-core/src/FieldApi.ts:1041](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1041)

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

Defined in: [packages/form-core/src/FieldApi.ts:1701](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1701)

Handles the blur event.

#### Returns

`void`

***

### handleChange()

```ts
handleChange(updater): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1694](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1694)

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

Defined in: [packages/form-core/src/FieldApi.ts:1123](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1123)

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

Defined in: [packages/form-core/src/FieldApi.ts:859](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L859)

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

Defined in: [packages/form-core/src/FieldApi.ts:1198](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1198)

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

Defined in: [packages/form-core/src/FieldApi.ts:1744](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1744)

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

Defined in: [packages/form-core/src/FieldApi.ts:1756](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1756)

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

Defined in: [packages/form-core/src/FieldApi.ts:1105](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1105)

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

Defined in: [packages/form-core/src/FieldApi.ts:1163](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1163)

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

Defined in: [packages/form-core/src/FieldApi.ts:1143](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1143)

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

Defined in: [packages/form-core/src/FieldApi.ts:1717](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1717)

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

Defined in: [packages/form-core/src/FieldApi.ts:1069](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1069)

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

Defined in: [packages/form-core/src/FieldApi.ts:1048](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1048)

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

Defined in: [packages/form-core/src/FieldApi.ts:1178](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1178)

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

Defined in: [packages/form-core/src/FieldApi.ts:990](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L990)

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

Defined in: [packages/form-core/src/FieldApi.ts:1577](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1577)

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
