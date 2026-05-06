---
id: FieldApi
title: FieldApi
---

# Class: FieldApi\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta\>

Defined in: [packages/form-core/src/FieldApi.ts:980](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L980)

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

Defined in: [packages/form-core/src/FieldApi.ts:1134](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1134)

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

Defined in: [packages/form-core/src/FieldApi.ts:1034](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1034)

A reference to the form API instance.

***

### name

```ts
name: TName;
```

Defined in: [packages/form-core/src/FieldApi.ts:1062](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1062)

The field name.

***

### options

```ts
options: FieldApiOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1066](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1066)

The field options.

***

### store

```ts
store: ReadonlyStore<FieldState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1094](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1094)

The field state store.

***

### timeoutIds

```ts
timeoutIds: object;
```

Defined in: [packages/form-core/src/FieldApi.ts:1125](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1125)

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
get state(): FieldState<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1122](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1122)

The current field state.

##### Returns

[`FieldState`](../type-aliases/FieldState.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`\>

## Methods

### clearValues()

```ts
clearValues(options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1636](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1636)

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

Defined in: [packages/form-core/src/FieldApi.ts:1522](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1522)

Gets the field information object.

#### Returns

[`FieldInfo`](../type-aliases/FieldInfo.md)\<`TParentData`\>

***

### getMeta()

```ts
getMeta(): FieldMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>;
```

Defined in: [packages/form-core/src/FieldApi.ts:1486](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1486)

#### Returns

[`FieldMeta`](../type-aliases/FieldMeta.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`\>

***

### ~~getValue()~~

```ts
getValue(): TData;
```

Defined in: [packages/form-core/src/FieldApi.ts:1463](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1463)

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

Defined in: [packages/form-core/src/FieldApi.ts:2035](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L2035)

Handles the blur event.

#### Returns

`void`

***

### handleChange()

```ts
handleChange(updater): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:2028](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L2028)

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

Defined in: [packages/form-core/src/FieldApi.ts:1545](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1545)

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

Defined in: [packages/form-core/src/FieldApi.ts:1281](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1281)

Mounts the field instance to the form.

#### Returns

A function to unmount the field instance.

```ts
(): void;
```

##### Returns

`void`

***

### moveValue()

```ts
moveValue(
   aIndex, 
   bIndex, 
   options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1620](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1620)

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

Defined in: [packages/form-core/src/FieldApi.ts:2078](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L2078)

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

Defined in: [packages/form-core/src/FieldApi.ts:2090](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L2090)

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

Defined in: [packages/form-core/src/FieldApi.ts:1527](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1527)

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

Defined in: [packages/form-core/src/FieldApi.ts:1585](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1585)

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

Defined in: [packages/form-core/src/FieldApi.ts:1565](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1565)

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

Defined in: [packages/form-core/src/FieldApi.ts:2051](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L2051)

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

Defined in: [packages/form-core/src/FieldApi.ts:1491](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1491)

Sets the field metadata.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<[`FieldMetaBase`](../type-aliases/FieldMetaBase.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`\>\>

#### Returns

`void`

***

### setValue()

```ts
setValue(updater, options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1470](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1470)

Sets the field value and run the `change` validator.

#### Parameters

##### updater

[`Updater`](../type-aliases/Updater.md)\<`TData`\>

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
   options?): void;
```

Defined in: [packages/form-core/src/FieldApi.ts:1600](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1600)

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

Defined in: [packages/form-core/src/FieldApi.ts:1412](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1412)

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

Defined in: [packages/form-core/src/FieldApi.ts:1995](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1995)

Validates the field value.

#### Parameters

##### cause

`ValidationCause`

##### opts?

###### skipFormValidation?

`boolean`

#### Returns

`unknown`[] \| `Promise`\<`unknown`[]\>
