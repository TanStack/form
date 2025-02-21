---
id: TanStackField
title: TanStackField
---

# Class: TanStackField\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer, TSubmitMeta\>

Defined in: [tanstack-field.directive.ts:32](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L32)

## Type Parameters

• **TParentData**

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\>

• **TOnMount** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnChange** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnChangeAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnBlur** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnBlurAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnSubmit** *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TOnSubmitAsync** *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

• **TFormOnMount** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnChange** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnChangeAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

• **TFormOnBlur** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnBlurAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

• **TFormOnSubmit** *extends* `undefined` \| `FormValidateOrFn`\<`TParentData`\>

• **TFormOnSubmitAsync** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

• **TFormOnServer** *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

• **TSubmitMeta**

## Implements

- `OnInit`
- `OnChanges`
- `OnDestroy`
- `FieldOptions`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`\>

## Constructors

### new TanStackField()

```ts
new TanStackField<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer, TSubmitMeta>(): TanStackField<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer, TSubmitMeta>
```

#### Returns

[`TanStackField`](tanstackfield.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Properties

### api

```ts
api: FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [tanstack-field.directive.ts:133](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L133)

***

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

Defined in: [tanstack-field.directive.ts:82](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L82)

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Implementation of

```ts
FieldOptions.asyncAlways
```

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

Defined in: [tanstack-field.directive.ts:81](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L81)

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Implementation of

```ts
FieldOptions.asyncDebounceMs
```

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync>>;
```

Defined in: [tanstack-field.directive.ts:110](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L110)

An optional object with default metadata for the field.

#### Implementation of

```ts
FieldOptions.defaultMeta
```

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

Defined in: [tanstack-field.directive.ts:80](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L80)

An optional default value for the field.

#### Implementation of

```ts
FieldOptions.defaultValue
```

***

### disableErrorFlat?

```ts
optional disableErrorFlat: boolean;
```

Defined in: [tanstack-field.directive.ts:131](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L131)

Disable the `flat(1)` operation on `field.errors`. This is useful if you want to keep the error structure as is. Not suggested for most use-cases.

#### Implementation of

```ts
FieldOptions.disableErrorFlat
```

***

### listeners?

```ts
optional listeners: NoInfer<FieldListeners<TParentData, TName, TData>>;
```

Defined in: [tanstack-field.directive.ts:109](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L109)

A list of listeners which attach to the corresponding events

#### Implementation of

```ts
FieldOptions.listeners
```

***

### name

```ts
name: TName;
```

Defined in: [tanstack-field.directive.ts:76](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L76)

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Implementation of

```ts
FieldOptions.name
```

***

### tanstackField

```ts
tanstackField: FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [tanstack-field.directive.ts:83](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L83)

***

### unmount()?

```ts
optional unmount: () => void;
```

Defined in: [tanstack-field.directive.ts:189](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L189)

#### Returns

`void`

***

### validators?

```ts
optional validators: NoInfer<FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync>>;
```

Defined in: [tanstack-field.directive.ts:95](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L95)

A list of validators to pass to the field

#### Implementation of

```ts
FieldOptions.validators
```

## Methods

### ngOnChanges()

```ts
ngOnChanges(): void
```

Defined in: [tanstack-field.directive.ts:201](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L201)

A callback method that is invoked immediately after the
default change detector has checked data-bound properties
if at least one has changed, and before the view and content
children are checked.

#### Returns

`void`

#### Implementation of

```ts
OnChanges.ngOnChanges
```

***

### ngOnDestroy()

```ts
ngOnDestroy(): void
```

Defined in: [tanstack-field.directive.ts:197](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L197)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

```ts
OnDestroy.ngOnDestroy
```

***

### ngOnInit()

```ts
ngOnInit(): void
```

Defined in: [tanstack-field.directive.ts:191](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L191)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

```ts
OnInit.ngOnInit
```
