---
id: FormGroupMeta
title: FormGroupMeta
---

# Interface: FormGroupMeta\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync\>

Defined in: [packages/form-core/src/FormGroupApi.ts:749](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L749)

The `meta` shape exposed on `FormGroupApi.state.meta`. Mirrors
`FieldApi.state.meta` (since `FormGroupMeta extends FieldLikeMeta`) but
additionally surfaces the group's submission lifecycle and aggregated
validity flags. All derivation lives on the parent `FormApi` (in
`formGroupMetaDerived`), keeping per-instance `FormGroupApi.store` as
minimal as `FieldApi.store`.

Aggregated booleans (`isTouched`, `isBlurred`, `isDirty`, `isPristine`,
`isDefaultValue`) are computed across the group's descendant fields
rather than the group's own field-meta entry.

## Extends

- [`FormGroupState`](FormGroupState.md)

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* [`DeepKeys`](../type-aliases/DeepKeys.md)\<`TParentData`\>

### TData

`TData` *extends* [`DeepValue`](../type-aliases/DeepValue.md)\<`TParentData`, `TName`\>

### TOnMount

`TOnMount` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FormGroupValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* 
  \| `undefined`
  \| `FormGroupAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TFormOnMount

`TFormOnMount` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChange

`TFormOnChange` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnChangeAsync

`TFormOnChangeAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnBlur

`TFormOnBlur` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnBlurAsync

`TFormOnBlurAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnSubmit

`TFormOnSubmit` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnSubmitAsync

`TFormOnSubmitAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TFormOnDynamic

`TFormOnDynamic` *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

### TFormOnDynamicAsync

`TFormOnDynamicAsync` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

## Properties

### canSubmit

```ts
canSubmit: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:827](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L827)

***

### errorMap

```ts
errorMap: ValidationErrorMap<UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>, UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>, UnwrapFieldAsyncValidateOrFn<TName, TOnChangeAsync, TFormOnChangeAsync>, UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>, UnwrapFieldAsyncValidateOrFn<TName, TOnBlurAsync, TFormOnBlurAsync>, UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>, UnwrapFieldAsyncValidateOrFn<TName, TOnSubmitAsync, TFormOnSubmitAsync>, UnwrapFieldValidateOrFn<TName, TOnDynamic, TFormOnDynamic>, UnwrapFieldAsyncValidateOrFn<TName, TOnDynamicAsync, TFormOnDynamicAsync>>;
```

Defined in: [packages/form-core/src/types.ts:536](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L536)

A map of errors related to the field value.

#### Inherited from

```ts
FieldLikeMeta.errorMap
```

***

### errors

```ts
errors: (
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnChangeAsync, TFormOnChangeAsync>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnBlurAsync, TFormOnBlurAsync>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnSubmitAsync, TFormOnSubmitAsync>>
  | UnwrapOneLevelOfArray<UnwrapFieldValidateOrFn<TName, TOnDynamic, TFormOnDynamic>>
  | UnwrapOneLevelOfArray<UnwrapFieldAsyncValidateOrFn<TName, TOnDynamicAsync, TFormOnDynamicAsync>>)[];
```

Defined in: [packages/form-core/src/types.ts:650](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L650)

An array of errors related to the field value.

#### Inherited from

```ts
FieldLikeMeta.errors
```

***

### isBlurred

```ts
isBlurred: boolean;
```

Defined in: [packages/form-core/src/types.ts:528](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L528)

A flag indicating whether the field has been blurred.

#### Inherited from

```ts
FieldLikeMeta.isBlurred
```

***

### isDefaultValue

```ts
isDefaultValue: boolean;
```

Defined in: [packages/form-core/src/types.ts:694](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L694)

A flag indicating whether the field's current value is the default value

#### Inherited from

```ts
FieldLikeMeta.isDefaultValue
```

***

### isDirty

```ts
isDirty: boolean;
```

Defined in: [packages/form-core/src/types.ts:532](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L532)

A flag that is `true` if the field's value has been modified by the user. Opposite of `isPristine`.

#### Inherited from

```ts
FieldLikeMeta.isDirty
```

***

### isFieldsValid

```ts
isFieldsValid: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:824](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L824)

***

### isFieldsValidating

```ts
isFieldsValidating: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:823](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L823)

***

### isGroupValid

```ts
isGroupValid: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:825](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L825)

***

### isPristine

```ts
isPristine: boolean;
```

Defined in: [packages/form-core/src/types.ts:686](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L686)

A flag that is `true` if the field's value has not been modified by the user. Opposite of `isDirty`.

#### Inherited from

```ts
FieldLikeMeta.isPristine
```

***

### isSubmitSuccessful

```ts
isSubmitSuccessful: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:688](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L688)

A boolean indicating if the last submission was successful.

#### Inherited from

[`FormGroupState`](FormGroupState.md).[`isSubmitSuccessful`](FormGroupState.md#issubmitsuccessful)

***

### isSubmitted

```ts
isSubmitted: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:676](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L676)

A boolean indicating if the `onSubmit` function has completed successfully.

Goes back to `false` at each new submission attempt.

Note: you can use isSubmitting to check if the form is currently submitting.

#### Inherited from

[`FormGroupState`](FormGroupState.md).[`isSubmitted`](FormGroupState.md#issubmitted)

***

### isSubmitting

```ts
isSubmitting: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:668](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L668)

A boolean indicating if the form is currently in the process of being submitted after `handleSubmit` is called.

Goes back to `false` when submission completes for one of the following reasons:
- the validation step returned errors.
- the `onSubmit` function has completed.

Note: if you're running async operations in your `onSubmit` function make sure to await them to ensure `isSubmitting` is set to `false` only when the async operation completes.

This is useful for displaying loading indicators or disabling form inputs during submission.

#### Inherited from

[`FormGroupState`](FormGroupState.md).[`isSubmitting`](FormGroupState.md#issubmitting)

***

### isTouched

```ts
isTouched: boolean;
```

Defined in: [packages/form-core/src/types.ts:524](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L524)

A flag indicating whether the field has been touched.

#### Inherited from

```ts
FieldLikeMeta.isTouched
```

***

### isValid

```ts
isValid: boolean;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:826](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L826)

A boolean indicating if the field is valid. Evaluates `true` if there are no field errors.

#### Overrides

```ts
FieldLikeMeta.isValid
```

***

### isValidating

```ts
isValidating: boolean;
```

Defined in: [packages/form-core/src/types.ts:555](https://github.com/TanStack/form/blob/main/packages/form-core/src/types.ts#L555)

A flag indicating whether the field is currently being validated.

#### Inherited from

[`FormGroupState`](FormGroupState.md).[`isValidating`](FormGroupState.md#isvalidating)

***

### submissionAttempts

```ts
submissionAttempts: number;
```

Defined in: [packages/form-core/src/FormGroupApi.ts:684](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormGroupApi.ts#L684)

A counter for tracking the number of submission attempts.

#### Inherited from

[`FormGroupState`](FormGroupState.md).[`submissionAttempts`](FormGroupState.md#submissionattempts)
