---
id: FieldApi
title: FieldApi
---

# Class: FieldApi\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

A class representing the API for managing a form field.

Normally, you will not need to create a new `FieldApi` instance directly.
Instead, you will use a framework hook/function like `useField` or `createField`
to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling
the `new FieldApi` constructor.

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

## Constructors

### new FieldApi()

```ts
new FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
```

Initializes a new `FieldApi` instance.

#### Parameters

• **opts**: [`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

[`FieldApi`](fieldapi.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Defined in

[packages/form-core/src/FieldApi.ts:438](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L438)

## Properties

### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

A reference to the form API instance.

#### Defined in

[packages/form-core/src/FieldApi.ts:402](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L402)

***

### name

```ts
name: unknown extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never;
```

The field name.

#### Defined in

[packages/form-core/src/FieldApi.ts:412](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L412)

***

### options

```ts
options: FieldApiOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

The field options.

#### Defined in

[packages/form-core/src/FieldApi.ts:416](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L416)

***

### store

```ts
store: Derived<FieldState<TData>>;
```

The field state store.

#### Defined in

[packages/form-core/src/FieldApi.ts:426](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L426)

***

### timeoutIds

```ts
timeoutIds: Record<ValidationCause, null | Timeout>;
```

#### Defined in

[packages/form-core/src/FieldApi.ts:433](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L433)

## Accessors

### state

#### Get Signature

```ts
get state(): FieldState<TData>
```

The current field state.

##### Returns

[`FieldState`](../type-aliases/fieldstate.md)\<`TData`\>

#### Defined in

[packages/form-core/src/FieldApi.ts:430](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L430)

## Methods

### getInfo()

```ts
getInfo(): FieldInfo<TParentData, TFormValidator>
```

Gets the field information object.

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TParentData`, `TFormValidator`\>

#### Defined in

[packages/form-core/src/FieldApi.ts:622](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L622)

***

### getMeta()

```ts
getMeta(): FieldMeta
```

#### Returns

[`FieldMeta`](../type-aliases/fieldmeta.md)

#### Defined in

[packages/form-core/src/FieldApi.ts:611](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L611)

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

#### Defined in

[packages/form-core/src/FieldApi.ts:599](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L599)

***

### handleBlur()

```ts
handleBlur(): void
```

Handles the blur event.

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:974](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L974)

***

### handleChange()

```ts
handleChange(updater): void
```

Handles the change event.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<`TData`\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:967](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L967)

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

• **opts?**: `UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FieldApi.ts:635](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L635)

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

#### Defined in

[packages/form-core/src/FieldApi.ts:528](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L528)

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

• **opts?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:665](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L665)

***

### pushValue()

```ts
pushValue(value, opts?): void
```

Pushes a new value to the field.

#### Parameters

• **value**: `TData` *extends* `any`[] ? `TData`\<`TData`\>\[`number`\] : `never`

• **opts?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:627](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L627)

***

### removeValue()

```ts
removeValue(index, opts?): Promise<void>
```

Removes a value at the specified index.

#### Parameters

• **index**: `number`

• **opts?**: `UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FieldApi.ts:653](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L653)

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

• **opts?**: `UpdateMetaOptions`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/form-core/src/FieldApi.ts:644](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L644)

***

### setErrorMap()

```ts
setErrorMap(errorMap): void
```

Updates the field's errorMap

#### Parameters

• **errorMap**: `ValidationErrorMap`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:989](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L989)

***

### setMeta()

```ts
setMeta(updater): void
```

Sets the field metadata.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<[`FieldMeta`](../type-aliases/fieldmeta.md)\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:616](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L616)

***

### setValue()

```ts
setValue(updater, options?): void
```

Sets the field value and run the `change` validator.

#### Parameters

• **updater**: [`Updater`](../type-aliases/updater.md)\<`TData`\>

• **options?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:606](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L606)

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

• **opts?**: `UpdateMetaOptions`

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:659](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L659)

***

### update()

```ts
update(opts): void
```

Updates the field instance with new options.

#### Parameters

• **opts**: [`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

`void`

#### Defined in

[packages/form-core/src/FieldApi.ts:562](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L562)

***

### validate()

```ts
validate(cause): ValidationError[] | Promise<ValidationError[]>
```

Validates the field value.

#### Parameters

• **cause**: `ValidationCause`

#### Returns

[`ValidationError`](../type-aliases/validationerror.md)[] \| `Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>

#### Defined in

[packages/form-core/src/FieldApi.ts:939](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L939)
