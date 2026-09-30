---
id: TanStackAppField
title: TanStackAppField
---

Defined in: [angular-form/src/app-field.ts:20](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L20)

## Extends

- [`TanStackField`](TanStackField.md)\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

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

## Constructors

### Constructor

```ts
new TanStackAppField<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>(): TanStackAppField<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [angular-form/src/app-field.ts:75](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L75)

#### Returns

`TanStackAppField`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

#### Overrides

[`TanStackField`](TanStackField.md).[`constructor`](TanStackField.md#constructor)

## Properties

### \_api

```ts
_api: Signal<FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [angular-form/src/tanstack-field.ts:146](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L146)

#### Inherited from

[`TanStackField`](TanStackField.md).[`_api`](TanStackField.md#_api)

***

### asyncAlways

```ts
asyncAlways: InputSignalWithTransform<boolean, unknown>;
```

Defined in: [angular-form/src/tanstack-field.ts:71](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L71)

#### Inherited from

[`TanStackField`](TanStackField.md).[`asyncAlways`](TanStackField.md#asyncalways)

***

### asyncDebounceMs

```ts
asyncDebounceMs: InputSignalWithTransform<number, unknown>;
```

Defined in: [angular-form/src/tanstack-field.ts:68](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L68)

#### Inherited from

[`TanStackField`](TanStackField.md).[`asyncDebounceMs`](TanStackField.md#asyncdebouncems)

***

### base

```ts
base: TanStackFieldInjectable<any>;
```

Defined in: [angular-form/src/app-field.ts:73](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L73)

***

### cd

```ts
cd: ChangeDetectorRef;
```

Defined in: [angular-form/src/tanstack-field.ts:233](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L233)

#### Inherited from

[`TanStackField`](TanStackField.md).[`cd`](TanStackField.md#cd)

***

### defaultMeta

```ts
defaultMeta: InputSignal<
  | Partial<FieldLikeMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:113](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L113)

#### Inherited from

[`TanStackField`](TanStackField.md).[`defaultMeta`](TanStackField.md#defaultmeta)

***

### defaultValue

```ts
defaultValue: InputSignal<NoInfer<TData> | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:67](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L67)

#### Inherited from

[`TanStackField`](TanStackField.md).[`defaultValue`](TanStackField.md#defaultvalue)

***

### disableErrorFlat

```ts
disableErrorFlat: InputSignal<boolean | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:144](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L144)

#### Inherited from

[`TanStackField`](TanStackField.md).[`disableErrorFlat`](TanStackField.md#disableerrorflat)

***

### injector

```ts
injector: Injector;
```

Defined in: [angular-form/src/tanstack-field.ts:217](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L217)

#### Inherited from

[`TanStackField`](TanStackField.md).[`injector`](TanStackField.md#injector)

***

### listeners

```ts
listeners: InputSignal<
  | NoInfer<FieldListeners<TParentData, TName, TData>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:112](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L112)

#### Inherited from

[`TanStackField`](TanStackField.md).[`listeners`](TanStackField.md#listeners)

***

### mode

```ts
mode: InputSignal<"value" | "array" | undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:142](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L142)

#### Inherited from

[`TanStackField`](TanStackField.md).[`mode`](TanStackField.md#mode)

***

### name

```ts
name: InputSignal<TName>;
```

Defined in: [angular-form/src/tanstack-field.ts:66](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L66)

#### Inherited from

[`TanStackField`](TanStackField.md).[`name`](TanStackField.md#name)

***

### options

```ts
options: Signal<FieldApiOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [angular-form/src/tanstack-field.ts:178](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L178)

#### Inherited from

[`TanStackField`](TanStackField.md).[`options`](TanStackField.md#options)

***

### tanstackField

```ts
tanstackField: InputSignal<FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [angular-form/src/tanstack-field.ts:74](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L74)

#### Inherited from

[`TanStackField`](TanStackField.md).[`tanstackField`](TanStackField.md#tanstackfield)

***

### validators

```ts
validators: InputSignal<
  | NoInfer<FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>>
| undefined>;
```

Defined in: [angular-form/src/tanstack-field.ts:92](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L92)

#### Inherited from

[`TanStackField`](TanStackField.md).[`validators`](TanStackField.md#validators)

## Accessors

### api

#### Get Signature

```ts
get api(): FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [angular-form/src/tanstack-field.ts:150](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L150)

##### Returns

`FieldApi`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

#### Inherited from

[`TanStackField`](TanStackField.md).[`api`](TanStackField.md#api)

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

#### Inherited from

[`TanStackField`](TanStackField.md).[`ngOnInit`](TanStackField.md#ngoninit)
