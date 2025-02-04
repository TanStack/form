---
id: FieldApi
title: FieldApi
---

# Class: FieldApi\<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension\>

Defined in: [packages/form-core/src/FieldApi.ts:475](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L475)

A class representing the API for managing a form field.

Normally, you will not need to create a new `FieldApi` instance directly.
Instead, you will use a framework hook/function like `useField` or `createField`
to create a new instance for you that uses your framework's reactivity model.
However, if you need to create a new instance manually, you can do so by calling
the `new FieldApi` constructor.

## Type Parameters

• **TParentData**

• **TName** *extends* [`DeepKeys`](../type-aliases/deepkeys.md)\<`TParentData`\>

• **TFieldValidator** *extends* 
  \| `Validator`\<[`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>, `unknown`\>
  \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TData** *extends* [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\> = [`DeepValue`](../type-aliases/deepvalue.md)\<`TParentData`, `TName`\>

• **TParentMetaExtension** *extends* `object` = `never`

## Constructors

### new FieldApi()

```ts
new FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>
```

Defined in: [packages/form-core/src/FieldApi.ts:528](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L528)

Initializes a new `FieldApi` instance.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

#### Returns

[`FieldApi`](fieldapi.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

## Properties

### form

```ts
form: FormApi<TParentData, TFormValidator, TParentMetaExtension>;
```

Defined in: [packages/form-core/src/FieldApi.ts:490](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L490)

A reference to the form API instance.

***

### name

```ts
name: unknown extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never;
```

Defined in: [packages/form-core/src/FieldApi.ts:501](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L501)

The field name.

***

### options

```ts
options: FieldApiOptions<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

Defined in: [packages/form-core/src/FieldApi.ts:505](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L505)

The field options.

***

### store

```ts
store: Derived<FieldState<TData>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:516](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L516)

The field state store.

***

### timeoutIds

```ts
timeoutIds: Record<ValidationCause, null | Timeout>;
```

Defined in: [packages/form-core/src/FieldApi.ts:523](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L523)

## Accessors

### state

#### Get Signature

```ts
get state(): FieldState<TData>
```

Defined in: [packages/form-core/src/FieldApi.ts:520](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L520)

The current field state.

##### Returns

[`FieldState`](../type-aliases/fieldstate.md)\<`TData`\>

## Methods

### getInfo()

```ts
getInfo(): FieldInfo<TParentData, TFormValidator>
```

Defined in: [packages/form-core/src/FieldApi.ts:728](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L728)

Gets the field information object.

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TParentData`, `TFormValidator`\>

***

### getMeta()

```ts
getMeta(): FieldMeta
```

Defined in: [packages/form-core/src/FieldApi.ts:717](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L717)

#### Returns

[`FieldMeta`](../type-aliases/fieldmeta.md)

***

### ~~getValue()~~

```ts
getValue(): TData
```

Defined in: [packages/form-core/src/FieldApi.ts:699](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L699)

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

Defined in: [packages/form-core/src/FieldApi.ts:1089](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1089)

Handles the blur event.

#### Returns

`void`

***

### handleChange()

```ts
handleChange(updater): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1082](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1082)

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

Defined in: [packages/form-core/src/FieldApi.ts:741](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L741)

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

Defined in: [packages/form-core/src/FieldApi.ts:621](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L621)

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

Defined in: [packages/form-core/src/FieldApi.ts:771](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L771)

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

Defined in: [packages/form-core/src/FieldApi.ts:733](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L733)

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

Defined in: [packages/form-core/src/FieldApi.ts:759](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L759)

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

Defined in: [packages/form-core/src/FieldApi.ts:750](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L750)

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

Defined in: [packages/form-core/src/FieldApi.ts:1109](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1109)

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

Defined in: [packages/form-core/src/FieldApi.ts:722](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L722)

Sets the field metadata.

#### Parameters

##### updater

[`Updater`](../type-aliases/updater.md)\<[`FieldMeta`](../type-aliases/fieldmeta.md)\>

#### Returns

`void`

***

### setValue()

```ts
setValue(updater, options?): void
```

Defined in: [packages/form-core/src/FieldApi.ts:706](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L706)

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

Defined in: [packages/form-core/src/FieldApi.ts:765](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L765)

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

Defined in: [packages/form-core/src/FieldApi.ts:660](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L660)

Updates the field instance with new options.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

#### Returns

`void`

***

### validate()

```ts
validate(cause): 
  | ValidationError[]
| Promise<ValidationError[]>
```

Defined in: [packages/form-core/src/FieldApi.ts:1054](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1054)

Validates the field value.

#### Parameters

##### cause

`ValidationCause`

#### Returns

  \| [`ValidationError`](../type-aliases/validationerror.md)[]
  \| `Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>
