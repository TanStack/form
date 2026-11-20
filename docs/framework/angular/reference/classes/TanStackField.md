---
id: TanStackField
title: TanStackField
---

Defined in: [tanstack-field.ts:242](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L242)

## Extends

- `TanStackFieldBase`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

## Extended by

- [`TanStackAppField`](TanStackAppField.md)

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
new TanStackField<TSource, TFieldName, TFieldValue, TFieldValidators>(): TanStackField<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [tanstack-field.ts:188](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L188)

#### Returns

`TanStackField`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

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

Defined in: [tanstack-field.ts:137](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L137)

#### Inherited from

```ts
TanStackFieldBase.errorBoundary
```

***

### errorVisibility

```ts
errorVisibility: InputSignal<ErrorVisibilityFn<AngularParentFormData<TSource>> | undefined>;
```

Defined in: [tanstack-field.ts:136](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L136)

#### Inherited from

```ts
TanStackFieldBase.errorVisibility
```

***

### isArrayField

```ts
protected readonly isArrayField: false = false;
```

Defined in: [tanstack-field.ts:258](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L258)

#### Overrides

```ts
TanStackFieldBase.isArrayField
```

***

### listeners

```ts
listeners: InputSignal<
  | NoInfer<FieldListeners<AngularFieldData<TSource>, TFieldName, TFieldValue, FallbackToValidationIssue<
  | ExtractValidatorFieldError<TFieldValidators, FieldValidators<any, any, any>>
  | ExtractFormFieldError<AngularSourceFormErrorTypes<TSource>>
  | unknown extends AngularSourceGroupFieldError<TSource> ? never : AngularSourceGroupFieldError<TSource>>, AngularParentFormData<TSource>, AngularSourceFormErrorTypes<TSource>>>
| undefined>;
```

Defined in: [tanstack-field.ts:119](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L119)

#### Inherited from

```ts
TanStackFieldBase.listeners
```

***

### name

```ts
name: InputSignal<TFieldName>;
```

Defined in: [tanstack-field.ts:117](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L117)

#### Inherited from

```ts
TanStackFieldBase.name
```

***

### tanstackField

```ts
tanstackField: InputSignal<TSource>;
```

Defined in: [tanstack-field.ts:257](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L257)

***

### validators

```ts
validators: InputSignal<NoInfer<TFieldValidators> | undefined>;
```

Defined in: [tanstack-field.ts:118](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L118)

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

Defined in: [tanstack-field.ts:177](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L177)

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

Defined in: [tanstack-field.ts:259](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L259)

#### Returns

`TSource`

#### Overrides

```ts
TanStackFieldBase.getSource
```
