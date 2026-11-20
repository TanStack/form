---
id: TanStackAppArrayField
title: TanStackAppArrayField
---

Defined in: [app-field.ts:37](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L37)

## Extends

- [`TanStackArrayField`](TanStackArrayField.md)\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

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
new TanStackAppArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>(): TanStackAppArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [app-field.ts:56](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L56)

#### Returns

`TanStackAppArrayField`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Overrides

[`TanStackArrayField`](TanStackArrayField.md).[`constructor`](TanStackArrayField.md#constructor)

## Properties

### errorBoundary

```ts
errorBoundary: InputSignal<boolean | undefined>;
```

Defined in: [tanstack-field.ts:137](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L137)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`errorBoundary`](TanStackArrayField.md#errorboundary)

***

### errorVisibility

```ts
errorVisibility: InputSignal<ErrorVisibilityFn<AngularParentFormData<TSource>> | undefined>;
```

Defined in: [tanstack-field.ts:136](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L136)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`errorVisibility`](TanStackArrayField.md#errorvisibility)

***

### isArrayField

```ts
protected readonly isArrayField: true = true;
```

Defined in: [tanstack-field.ts:285](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L285)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`isArrayField`](TanStackArrayField.md#isarrayfield)

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

[`TanStackArrayField`](TanStackArrayField.md).[`listeners`](TanStackArrayField.md#listeners)

***

### name

```ts
name: InputSignal<TFieldName>;
```

Defined in: [tanstack-field.ts:117](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L117)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`name`](TanStackArrayField.md#name)

***

### tanstackArrayField

```ts
tanstackArrayField: InputSignal<TSource>;
```

Defined in: [tanstack-field.ts:284](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L284)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`tanstackArrayField`](TanStackArrayField.md#tanstackarrayfield)

***

### validators

```ts
validators: InputSignal<NoInfer<TFieldValidators> | undefined>;
```

Defined in: [tanstack-field.ts:118](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L118)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`validators`](TanStackArrayField.md#validators)

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

[`TanStackArrayField`](TanStackArrayField.md).[`api`](TanStackArrayField.md#api)

## Methods

### getSource()

```ts
protected getSource(): TSource;
```

Defined in: [tanstack-field.ts:286](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L286)

#### Returns

`TSource`

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`getSource`](TanStackArrayField.md#getsource)
