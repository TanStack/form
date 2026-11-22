---
id: TanStackArrayField
title: TanStackArrayField
---

Defined in: [tanstack-field.ts:278](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L278)

## Extends

- `TanStackFieldBase`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

## Extended by

- [`TanStackAppArrayField`](TanStackAppArrayField.md)

## Type Parameters

### TSource

`TSource` *extends* [`AngularFieldSource`](../type-aliases/AngularFieldSource.md)

### TFieldName

`TFieldName` *extends* `DeepKeys`\<[`AngularFieldData`](../type-aliases/AngularFieldData.md)\<`TSource`\>\>

### TFieldValue

`TFieldValue` *extends* `DeepValue`\<[`AngularFieldData`](../type-aliases/AngularFieldData.md)\<`TSource`\>, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<[`AngularFieldData`](../type-aliases/AngularFieldData.md)\<`TSource`\>, `TFieldName`, `TFieldValue`\>

## Constructors

### Constructor

```ts
new TanStackArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>(): TanStackArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [tanstack-field.ts:197](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L197)

#### Returns

`TanStackArrayField`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Inherited from

```ts
TanStackFieldBase<
  TSource,
  TFieldName,
  TFieldValue,
  TFieldValidators
>.constructor
```

## Properties

### errorBoundary

```ts
errorBoundary: InputSignal<boolean | undefined>;
```

Defined in: [tanstack-field.ts:146](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L146)

#### Inherited from

```ts
TanStackFieldBase.errorBoundary
```

***

### errorVisibility

```ts
errorVisibility: InputSignal<ErrorVisibilityFn<AngularParentFormData<TSource>> | undefined>;
```

Defined in: [tanstack-field.ts:145](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L145)

#### Inherited from

```ts
TanStackFieldBase.errorVisibility
```

***

### isArrayField

```ts
protected readonly isArrayField: true = true;
```

Defined in: [tanstack-field.ts:294](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L294)

#### Overrides

```ts
TanStackFieldBase.isArrayField
```

***

### listeners

```ts
listeners: InputSignal<
  | NoInfer<FieldListeners<AngularFieldData<TSource>, TFieldName, TFieldValue, FallbackToValidationIssue<
  | ExtractValidatorSelfError<TFieldValidators, FieldValidators<any, any, any>>
  | ExtractSubfieldError<AngularSourceGroupErrorTypes<TSource>>
  | ExtractSubfieldError<AngularSourceFormErrorTypes<TSource>>>, AngularParentFormData<TSource>, AngularSourceFormErrorTypes<TSource>>>
| undefined>;
```

Defined in: [tanstack-field.ts:128](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L128)

#### Inherited from

```ts
TanStackFieldBase.listeners
```

***

### name

```ts
name: InputSignal<TFieldName>;
```

Defined in: [tanstack-field.ts:126](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L126)

#### Inherited from

```ts
TanStackFieldBase.name
```

***

### tanstackArrayField

```ts
tanstackArrayField: InputSignal<TSource>;
```

Defined in: [tanstack-field.ts:293](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L293)

***

### validators

```ts
validators: InputSignal<NoInfer<TFieldValidators> | undefined>;
```

Defined in: [tanstack-field.ts:127](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L127)

#### Inherited from

```ts
TanStackFieldBase.validators
```

## Accessors

### api

#### Get Signature

```ts
get api(): AngularSourceFieldApi<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [tanstack-field.ts:186](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L186)

##### Returns

`AngularSourceFieldApi`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Inherited from

```ts
TanStackFieldBase.api
```

## Methods

### getSource()

```ts
protected getSource(): TSource;
```

Defined in: [tanstack-field.ts:295](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L295)

#### Returns

`TSource`

#### Overrides

```ts
TanStackFieldBase.getSource
```
