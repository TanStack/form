---
id: FieldApi
title: FieldApi
---

# Class: FieldApi\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

Defined in: [packages/form-core/src/FieldApi.ts:427](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L427)

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

## Constructors

### new FieldApi()

```ts
new FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>(opts): FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
```

Defined in: [packages/form-core/src/FieldApi.ts:477](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L477)

Initializes a new `FieldApi` instance.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

[`FieldApi`](fieldapi.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Properties

### form

```ts
form: FormApi<TParentData, TFormValidator>;
```

Defined in: [packages/form-core/src/FieldApi.ts:441](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L441)

A reference to the form API instance.

***

### name

```ts
name: unknown extends TParentData ? string : TParentData extends readonly any[] & IsTuple<TParentData> ? PrefixTupleAccessor<TParentData<TParentData>, AllowedIndexes<TParentData<TParentData>, never>, []> : TParentData extends any[] ? PrefixArrayAccessor<TParentData<TParentData>, [any]> : TParentData extends Date ? never : TParentData extends object ? PrefixObjectAccessor<TParentData<TParentData>, []> : TParentData extends string | number | bigint | boolean ? "" : never;
```

Defined in: [packages/form-core/src/FieldApi.ts:451](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L451)

The field name.

***

### options

```ts
options: FieldApiOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

Defined in: [packages/form-core/src/FieldApi.ts:455](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L455)

The field options.

***

### store

```ts
store: Derived<FieldState<TData>>;
```

Defined in: [packages/form-core/src/FieldApi.ts:465](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L465)

The field state store.

***

### timeoutIds

```ts
timeoutIds: Record<ValidationCause, null | Timeout>;
```

Defined in: [packages/form-core/src/FieldApi.ts:472](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L472)

## Accessors

### state

#### Get Signature

```ts
get state(): FieldState<TData>
```

Defined in: [packages/form-core/src/FieldApi.ts:469](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L469)

The current field state.

##### Returns

[`FieldState`](../type-aliases/fieldstate.md)\<`TData`\>

## Methods

### getInfo()

```ts
getInfo(): FieldInfo<TParentData, TFormValidator>
```

Defined in: [packages/form-core/src/FieldApi.ts:673](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L673)

Gets the field information object.

#### Returns

[`FieldInfo`](../type-aliases/fieldinfo.md)\<`TParentData`, `TFormValidator`\>

***

### getMeta()

```ts
getMeta(): FieldMeta
```

Defined in: [packages/form-core/src/FieldApi.ts:662](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L662)

#### Returns

[`FieldMeta`](../type-aliases/fieldmeta.md)

***

### ~~getValue()~~

```ts
getValue(): TData
```

Defined in: [packages/form-core/src/FieldApi.ts:644](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L644)

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

Defined in: [packages/form-core/src/FieldApi.ts:1025](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1025)

Handles the blur event.

#### Returns

`void`

***

### handleChange()

```ts
handleChange(updater): void
```

Defined in: [packages/form-core/src/FieldApi.ts:1018](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1018)

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

Defined in: [packages/form-core/src/FieldApi.ts:686](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L686)

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

Defined in: [packages/form-core/src/FieldApi.ts:567](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L567)

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

Defined in: [packages/form-core/src/FieldApi.ts:716](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L716)

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

Defined in: [packages/form-core/src/FieldApi.ts:678](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L678)

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

Defined in: [packages/form-core/src/FieldApi.ts:704](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L704)

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

Defined in: [packages/form-core/src/FieldApi.ts:695](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L695)

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

Defined in: [packages/form-core/src/FieldApi.ts:1045](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L1045)

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

Defined in: [packages/form-core/src/FieldApi.ts:667](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L667)

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

Defined in: [packages/form-core/src/FieldApi.ts:651](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L651)

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

Defined in: [packages/form-core/src/FieldApi.ts:710](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L710)

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

Defined in: [packages/form-core/src/FieldApi.ts:606](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L606)

Updates the field instance with new options.

#### Parameters

##### opts

[`FieldApiOptions`](../interfaces/fieldapioptions.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

`void`

***

### validate()

```ts
validate(cause): 
  | ValidationError[]
| Promise<ValidationError[]>
```

Defined in: [packages/form-core/src/FieldApi.ts:990](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldApi.ts#L990)

Validates the field value.

#### Parameters

##### cause

`ValidationCause`

#### Returns

  \| [`ValidationError`](../type-aliases/validationerror.md)[]
  \| `Promise`\<[`ValidationError`](../type-aliases/validationerror.md)[]\>
