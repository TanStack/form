---
id: TanStackArrayField
title: TanStackArrayField
---

# Class: TanStackArrayField\<TSource, TFieldName, TFieldValue, TFieldValidators\>

Defined in: [angular-form/src/tanstack-field.ts:282](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L282)

## Extends

- `TanStackFieldBase`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

## Extended by

- [`TanStackAppArrayField`](TanStackAppArrayField.md)

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
new TanStackArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>(): TanStackArrayField<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [angular-form/src/tanstack-field.ts:201](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L201)

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

Defined in: [angular-form/src/tanstack-field.ts:152](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L152)

#### Inherited from

```ts
TanStackFieldBase.errorBoundary
```

***

### errorVisibility

```ts
errorVisibility: InputSignal<
  | ErrorVisibility<AngularParentFormData<TSource>, AngularSourceFormErrorTypes<TSource>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:145](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L145)

#### Inherited from

```ts
TanStackFieldBase.errorVisibility
```

***

### isArrayField

```ts
protected readonly isArrayField: true = true;
```

Defined in: [angular-form/src/tanstack-field.ts:298](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L298)

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

Defined in: [angular-form/src/tanstack-field.ts:128](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L128)

#### Inherited from

```ts
TanStackFieldBase.listeners
```

***

### name

```ts
name: InputSignal<TFieldName>;
```

Defined in: [angular-form/src/tanstack-field.ts:126](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L126)

#### Inherited from

```ts
TanStackFieldBase.name
```

***

### tanstackArrayField

```ts
tanstackArrayField: InputSignal<TSource>;
```

Defined in: [angular-form/src/tanstack-field.ts:297](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L297)

***

### validators

```ts
validators: InputSignal<NoInfer<TFieldValidators> | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:127](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L127)

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

Defined in: [angular-form/src/tanstack-field.ts:190](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L190)

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

Defined in: [angular-form/src/tanstack-field.ts:299](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L299)

#### Returns

`TSource`

#### Overrides

```ts
TanStackFieldBase.getSource
```
