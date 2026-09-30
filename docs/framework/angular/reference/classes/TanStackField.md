---
id: TanStackField
title: TanStackField
---

Defined in: [angular-form/src/tanstack-field.ts:37](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L37)

## Extended by

- [`TanStackAppField`](TanStackAppField.md)

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

Defined in: [angular-form/src/tanstack-field.ts:219](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L219)

#### Returns

`TanStackField`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Properties

### \_api

```ts
_api: Signal<FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [angular-form/src/tanstack-field.ts:146](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L146)

***

### asyncAlways

```ts
asyncAlways: InputSignalWithTransform<boolean, unknown>;
```

Defined in: [angular-form/src/tanstack-field.ts:71](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L71)

***

### asyncDebounceMs

```ts
asyncDebounceMs: InputSignalWithTransform<number, unknown>;
```

Defined in: [angular-form/src/tanstack-field.ts:68](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L68)

***

### cd

```ts
cd: ChangeDetectorRef;
```

Defined in: [angular-form/src/tanstack-field.ts:233](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L233)

***

### defaultMeta

```ts
defaultMeta: InputSignal<
  | Partial<FieldLikeMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:113](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L113)

***

### defaultValue

```ts
defaultValue: InputSignal<NoInfer<TData> | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:67](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L67)

***

### disableErrorFlat

```ts
disableErrorFlat: InputSignal<boolean | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:144](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L144)

***

### injector

```ts
injector: Injector;
```

Defined in: [angular-form/src/tanstack-field.ts:217](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L217)

***

### listeners

```ts
listeners: InputSignal<
  | NoInfer<FieldListeners<TParentData, TName, TData>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:112](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L112)

***

### mode

```ts
mode: InputSignal<"value" | "array" | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:142](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L142)

***

### name

```ts
name: InputSignal<TName>;
```

Defined in: [angular-form/src/tanstack-field.ts:66](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L66)

***

### options

```ts
options: Signal<FieldApiOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [angular-form/src/tanstack-field.ts:178](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L178)

***

### tanstackField

```ts
tanstackField: InputSignal<FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [angular-form/src/tanstack-field.ts:74](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L74)

***

### validators

```ts
validators: InputSignal<
  | NoInfer<FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:92](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L92)

## Accessors

### api

#### Get Signature

```ts
get api(): FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [angular-form/src/tanstack-field.ts:150](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L150)

##### Returns

`FieldApi`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Methods

### ngOnInit()

```ts
ngOnInit(): void;
```

Defined in: [angular-form/src/tanstack-field.ts:235](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L235)

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
