---
id: useField
title: useField
---

# Function: useField()

```ts
function useField<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta>(opts): object;
```

Defined in: [packages/vue-form/src/useField.tsx:189](https://github.com/TanStack/form/blob/main/packages/vue-form/src/useField.tsx#L189)

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* `string`

### TData

`TData`

### TOnMount

`TOnMount` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnChange

`TOnChange` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnChangeAsync

`TOnChangeAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnBlur

`TOnBlur` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnBlurAsync

`TOnBlurAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnSubmit

`TOnSubmit` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnDynamic

`TOnDynamic` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

### TFormOnMount

`TFormOnMount` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnChange

`TFormOnChange` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnChangeAsync

`TFormOnChangeAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnBlur

`TFormOnBlur` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnBlurAsync

`TFormOnBlurAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnSubmit

`TFormOnSubmit` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnSubmitAsync

`TFormOnSubmitAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnDynamic

`TFormOnDynamic` *extends* `FormValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnDynamicAsync

`TFormOnDynamicAsync` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TFormOnServer

`TFormOnServer` *extends* `FormAsyncValidateOrFn`\<`TParentData`\> \| `undefined`

### TParentSubmitMeta

`TParentSubmitMeta`

## Parameters

### opts

`UseFieldOptions`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TParentSubmitMeta`\>

## Returns

`object`

### api

```ts
readonly api: FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TParentSubmitMeta> = extendedFieldApi.value;
```

### state

```ts
readonly state: object = fieldState.value;
```

#### state.meta

```ts
meta: object;
```

#### state.meta.errorMap

```ts
errorMap: ValidationErrorMap<UnwrapFieldValidateOrFn<TName, TOnMount, TFormOnMount>, UnwrapFieldValidateOrFn<TName, TOnChange, TFormOnChange>, UnwrapFieldAsyncValidateOrFn<TName, TOnChangeAsync, TFormOnChangeAsync>, UnwrapFieldValidateOrFn<TName, TOnBlur, TFormOnBlur>, UnwrapFieldAsyncValidateOrFn<TName, TOnBlurAsync, TFormOnBlurAsync>, UnwrapFieldValidateOrFn<TName, TOnSubmit, TFormOnSubmit>, UnwrapFieldAsyncValidateOrFn<TName, TOnSubmitAsync, TFormOnSubmitAsync>, UnwrapFieldValidateOrFn<TName, TOnDynamic, TFormOnDynamic>, UnwrapFieldAsyncValidateOrFn<TName, TOnDynamicAsync, TFormOnDynamicAsync>>;
```

#### state.meta.errorSourceMap

```ts
errorSourceMap: ValidationErrorMapSource;
```

#### state.meta.isBlurred

```ts
isBlurred: boolean;
```

#### state.meta.isDirty

```ts
isDirty: boolean;
```

#### state.meta.isTouched

```ts
isTouched: boolean;
```

#### state.meta.isValidating

```ts
isValidating: boolean;
```

#### state.value

```ts
value: TData;
```
