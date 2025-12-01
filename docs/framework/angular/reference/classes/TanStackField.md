---
id: TanStackField
title: TanStackField
---

# Class: TanStackField\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta\>

Defined in: [tanstack-field.ts:37](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L37)

## Extended by

- [`TanStackAppField`](../TanStackAppField.md)

## Type Parameters

### TParentData

`TParentData`

### TName

`TName` *extends* `DeepKeys`\<`TParentData`\>

### TData

`TData` *extends* `DeepValue`\<`TParentData`, `TName`\>

### TOnMount

`TOnMount` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChange

`TOnChange` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnChangeAsync

`TOnChangeAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlur

`TOnBlur` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnBlurAsync

`TOnBlurAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmit

`TOnSubmit` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnSubmitAsync

`TOnSubmitAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamic

`TOnDynamic` *extends* `undefined` \| `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\>

### TOnDynamicAsync

`TOnDynamicAsync` *extends* `undefined` \| `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\>

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

### TFormOnServer

`TFormOnServer` *extends* `undefined` \| `FormAsyncValidateOrFn`\<`TParentData`\>

### TSubmitMeta

`TSubmitMeta`

## Implements

- `OnInit`

## Constructors

### Constructor

```ts
new TanStackField<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>(): TanStackField<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [tanstack-field.ts:224](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L224)

#### Returns

`TanStackField`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Properties

### \_api

```ts
_api: Signal<FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [tanstack-field.ts:151](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L151)

***

### asyncAlways

```ts
asyncAlways: InputSignalWithTransform<boolean, unknown>;
```

Defined in: [tanstack-field.ts:76](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L76)

***

### asyncDebounceMs

```ts
asyncDebounceMs: InputSignalWithTransform<number, unknown>;
```

Defined in: [tanstack-field.ts:73](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L73)

***

### cd

```ts
cd: ChangeDetectorRef;
```

Defined in: [tanstack-field.ts:238](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L238)

***

### defaultMeta

```ts
defaultMeta: InputSignal<
  | Partial<FieldMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>>
| undefined>;
```

Defined in: [tanstack-field.ts:118](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L118)

***

### defaultValue

```ts
defaultValue: InputSignal<NoInfer<TData> | undefined>;
```

Defined in: [tanstack-field.ts:72](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L72)

***

### disableErrorFlat

```ts
disableErrorFlat: InputSignal<boolean | undefined>;
```

Defined in: [tanstack-field.ts:149](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L149)

***

### injector

```ts
injector: Injector;
```

Defined in: [tanstack-field.ts:222](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L222)

***

### listeners

```ts
listeners: InputSignal<
  | NoInfer<FieldListeners<TParentData, TName, TData>>
| undefined>;
```

Defined in: [tanstack-field.ts:117](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L117)

***

### mode

```ts
mode: InputSignal<"value" | "array" | undefined>;
```

Defined in: [tanstack-field.ts:147](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L147)

***

### name

```ts
name: InputSignal<TName>;
```

Defined in: [tanstack-field.ts:71](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L71)

***

### options

```ts
options: Signal<FieldApiOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [tanstack-field.ts:183](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L183)

***

### tanstackField

```ts
tanstackField: InputSignal<FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [tanstack-field.ts:79](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L79)

***

### validators

```ts
validators: InputSignal<
  | NoInfer<FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>>
| undefined>;
```

Defined in: [tanstack-field.ts:97](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L97)

## Accessors

### api

#### Get Signature

```ts
get api(): FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [tanstack-field.ts:155](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L155)

##### Returns

`FieldApi`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Methods

### ngOnInit()

```ts
ngOnInit(): void;
```

Defined in: [tanstack-field.ts:240](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L240)

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
