---
id: TanStackAppField
title: TanStackAppField
---

# Class: TanStackAppField\<TSource, TFieldName, TFieldValue, TFieldValidators\>

Defined in: [app-field.ts:12](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/app-field.ts#L12)

## Extends

- [`TanStackField`](TanStackField.md)\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

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
new TanStackAppField<TSource, TFieldName, TFieldValue, TFieldValidators>(): TanStackAppField<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [app-field.ts:26](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/app-field.ts#L26)

#### Returns

`TanStackAppField`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Overrides

[`TanStackField`](TanStackField.md).[`constructor`](TanStackField.md#constructor)

## Properties

### errorBoundary

```ts
errorBoundary: InputSignal<boolean | undefined>;
```

Defined in: [tanstack-field.ts:152](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L152)

#### Inherited from

[`TanStackField`](TanStackField.md).[`errorBoundary`](TanStackField.md#errorboundary)

***

### errorVisibility

```ts
errorVisibility: InputSignal<
  | ErrorVisibility<AngularParentFormData<TSource>, AngularSourceFormErrorTypes<TSource>>
| undefined>;
```

Defined in: [tanstack-field.ts:145](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L145)

#### Inherited from

[`TanStackField`](TanStackField.md).[`errorVisibility`](TanStackField.md#errorvisibility)

***

### isArrayField

```ts
protected readonly isArrayField: false = false;
```

Defined in: [tanstack-field.ts:271](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L271)

#### Inherited from

[`TanStackField`](TanStackField.md).[`isArrayField`](TanStackField.md#isarrayfield)

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

Defined in: [tanstack-field.ts:128](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L128)

#### Inherited from

[`TanStackField`](TanStackField.md).[`listeners`](TanStackField.md#listeners)

***

### name

```ts
name: InputSignal<TFieldName>;
```

Defined in: [tanstack-field.ts:126](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L126)

#### Inherited from

[`TanStackField`](TanStackField.md).[`name`](TanStackField.md#name)

***

### tanstackField

```ts
tanstackField: InputSignal<TSource>;
```

Defined in: [tanstack-field.ts:270](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L270)

#### Inherited from

[`TanStackField`](TanStackField.md).[`tanstackField`](TanStackField.md#tanstackfield)

***

### validators

```ts
validators: InputSignal<NoInfer<TFieldValidators> | undefined>;
```

Defined in: [tanstack-field.ts:127](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L127)

#### Inherited from

[`TanStackField`](TanStackField.md).[`validators`](TanStackField.md#validators)

## Accessors

### api

#### Get Signature

```ts
get api(): AngularSourceFieldApi<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [tanstack-field.ts:190](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L190)

##### Returns

`AngularSourceFieldApi`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Inherited from

[`TanStackField`](TanStackField.md).[`api`](TanStackField.md#api)

## Methods

### getSource()

```ts
protected getSource(): TSource;
```

Defined in: [tanstack-field.ts:272](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/angular-form/src/tanstack-field.ts#L272)

#### Returns

`TSource`

#### Inherited from

[`TanStackField`](TanStackField.md).[`getSource`](TanStackField.md#getsource)
