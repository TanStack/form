---
id: TanStackField
title: TanStackField
---

# Class: TanStackField\<TSource, TFieldName, TFieldValue, TFieldValidators\>

Defined in: [tanstack-field.ts:255](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L255)

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

Defined in: [tanstack-field.ts:201](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L201)

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

Defined in: [tanstack-field.ts:152](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L152)

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

Defined in: [tanstack-field.ts:145](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L145)

#### Inherited from

```ts
TanStackFieldBase.errorVisibility
```

***

### isArrayField

```ts
protected readonly isArrayField: false = false;
```

Defined in: [tanstack-field.ts:271](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L271)

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

### tanstackField

```ts
tanstackField: InputSignal<TSource>;
```

Defined in: [tanstack-field.ts:270](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L270)

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

Defined in: [tanstack-field.ts:190](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L190)

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

Defined in: [tanstack-field.ts:272](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L272)

#### Returns

`TSource`

#### Overrides

```ts
TanStackFieldBase.getSource
```
