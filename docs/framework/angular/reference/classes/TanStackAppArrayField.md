---
id: TanStackAppArrayField
title: TanStackAppArrayField
---

# Class: TanStackAppArrayField\<TSource, TFieldName, TFieldValue, TFieldValidators\>

Defined in: [angular-form/src/app-field.ts:37](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L37)

## Extends

- [`TanStackArrayField`](TanStackArrayField.md)\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

## Type Parameters

### TSource

`TSource` *extends* `AngularFieldSource`

### TFieldName

`TFieldName` *extends* `DeepKeys`\<`AngularFieldData`\<`TSource`\>\>

### TFieldValue

`TFieldValue` *extends* `DeepValue`\<`AngularFieldData`\<`TSource`\>, `TFieldName`\>

### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`AngularFieldData`\<`TSource`\>, `TFieldName`, `TFieldValue`\>

## Constructors

### Constructor

```ts
new TanStackAppArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>(): TanStackAppArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [angular-form/src/app-field.ts:56](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L56)

#### Returns

`TanStackAppArrayField`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Overrides

[`TanStackArrayField`](TanStackArrayField.md).[`constructor`](TanStackArrayField.md#constructor)

## Properties

### errorBoundary

```ts
errorBoundary: InputSignal<boolean | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:152](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L152)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`errorBoundary`](TanStackArrayField.md#errorboundary)

***

### errorVisibility

```ts
errorVisibility: InputSignal<
  | ErrorVisibility<AngularParentFormData<TSource>, AngularSourceFormErrorTypes<TSource>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:145](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L145)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`errorVisibility`](TanStackArrayField.md#errorvisibility)

***

### isArrayField

```ts
protected readonly isArrayField: true = true;
```

Defined in: [angular-form/src/tanstack-field.ts:298](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L298)

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

Defined in: [angular-form/src/tanstack-field.ts:128](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L128)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`listeners`](TanStackArrayField.md#listeners)

***

### name

```ts
name: InputSignal<TFieldName>;
```

Defined in: [angular-form/src/tanstack-field.ts:126](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L126)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`name`](TanStackArrayField.md#name)

***

### tanstackArrayField

```ts
tanstackArrayField: InputSignal<TSource>;
```

Defined in: [angular-form/src/tanstack-field.ts:297](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L297)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`tanstackArrayField`](TanStackArrayField.md#tanstackarrayfield)

***

### validators

```ts
validators: InputSignal<NoInfer<TFieldValidators> | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:127](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L127)

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`validators`](TanStackArrayField.md#validators)

## Accessors

### api

#### Get Signature

```ts
get api(): AngularSourceFieldApi<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [angular-form/src/tanstack-field.ts:190](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L190)

##### Returns

`AngularSourceFieldApi`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`api`](TanStackArrayField.md#api)

## Methods

### getSource()

```ts
protected getSource(): TSource;
```

Defined in: [angular-form/src/tanstack-field.ts:299](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L299)

#### Returns

`TSource`

#### Inherited from

[`TanStackArrayField`](TanStackArrayField.md).[`getSource`](TanStackArrayField.md#getsource)
