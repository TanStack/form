---
id: TanStackAppField
title: TanStackAppField
---

Defined in: [app-field.ts:12](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L12)

## Extends

- [`TanStackField`](TanStackField.md)\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

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
new TanStackAppField<TSource, TFieldName, TFieldValue, TFieldValidators>(): TanStackAppField<TSource, TFieldName, TFieldValue, TFieldValidators>;
```

Defined in: [app-field.ts:26](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L26)

#### Returns

`TanStackAppField`\<`TSource`, `TFieldName`, `TFieldValue`, `TFieldValidators`\>

#### Overrides

[`TanStackField`](TanStackField.md).[`constructor`](TanStackField.md#constructor)

## Properties

### errorBoundary

```ts
errorBoundary: InputSignal<boolean | undefined>;
```

Defined in: [tanstack-field.ts:146](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L146)

#### Inherited from

[`TanStackField`](TanStackField.md).[`errorBoundary`](TanStackField.md#errorboundary)

***

### errorVisibility

```ts
errorVisibility: InputSignal<ErrorVisibilityFn<AngularParentFormData<TSource>> | undefined>;
```

Defined in: [tanstack-field.ts:145](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L145)

#### Inherited from

[`TanStackField`](TanStackField.md).[`errorVisibility`](TanStackField.md#errorvisibility)

***

### isArrayField

```ts
protected readonly isArrayField: false = false;
```

Defined in: [tanstack-field.ts:267](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L267)

#### Inherited from

[`TanStackField`](TanStackField.md).[`isArrayField`](TanStackField.md#isarrayfield)

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

[`TanStackField`](TanStackField.md).[`listeners`](TanStackField.md#listeners)

***

### name

```ts
name: InputSignal<TFieldName>;
```

Defined in: [tanstack-field.ts:126](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L126)

#### Inherited from

[`TanStackField`](TanStackField.md).[`name`](TanStackField.md#name)

***

### tanstackField

```ts
tanstackField: InputSignal<TSource>;
```

Defined in: [tanstack-field.ts:266](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L266)

#### Inherited from

[`TanStackField`](TanStackField.md).[`tanstackField`](TanStackField.md#tanstackfield)

***

### validators

```ts
validators: InputSignal<NoInfer<TFieldValidators> | undefined>;
```

Defined in: [tanstack-field.ts:127](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L127)

#### Inherited from

[`TanStackField`](TanStackField.md).[`validators`](TanStackField.md#validators)

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

[`TanStackField`](TanStackField.md).[`api`](TanStackField.md#api)

## Methods

### getSource()

```ts
protected getSource(): TSource;
```

Defined in: [tanstack-field.ts:268](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L268)

#### Returns

`TSource`

#### Inherited from

[`TanStackField`](TanStackField.md).[`getSource`](TanStackField.md#getsource)
