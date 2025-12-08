---
id: TanStackAppField
title: TanStackAppField
---

# Class: TanStackAppField\<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta\>

Defined in: [app-field.ts:20](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L20)

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

Defined in: [app-field.ts:79](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L79)

#### Returns

`TanStackAppField`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

#### Overrides

[`TanStackField`](TanStackField.md).[`constructor`](TanStackField.md#constructor)

## Properties

### \_api

```ts
_api: Signal<FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [tanstack-field.ts:150](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L150)

#### Inherited from

[`TanStackField`](TanStackField.md).[`_api`](TanStackField.md#_api)

***

### asyncAlways

```ts
asyncAlways: InputSignalWithTransform<boolean, unknown>;
```

Defined in: [tanstack-field.ts:75](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L75)

#### Inherited from

[`TanStackField`](TanStackField.md).[`asyncAlways`](TanStackField.md#asyncalways)

***

### asyncDebounceMs

```ts
asyncDebounceMs: InputSignalWithTransform<number, unknown>;
```

Defined in: [tanstack-field.ts:72](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L72)

#### Inherited from

[`TanStackField`](TanStackField.md).[`asyncDebounceMs`](TanStackField.md#asyncdebouncems)

***

### base

```ts
base: TanStackFieldInjectable<any>;
```

Defined in: [app-field.ts:77](https://github.com/TanStack/form/blob/main/packages/angular-form/src/app-field.ts#L77)

***

### cd

```ts
cd: ChangeDetectorRef;
```

Defined in: [tanstack-field.ts:237](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L237)

#### Inherited from

[`TanStackField`](TanStackField.md).[`cd`](TanStackField.md#cd)

***

### defaultMeta

```ts
defaultMeta: InputSignal<
  | Partial<FieldMeta<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync>>
| undefined>;
```

Defined in: [tanstack-field.ts:117](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L117)

#### Inherited from

[`TanStackField`](TanStackField.md).[`defaultMeta`](TanStackField.md#defaultmeta)

***

### defaultValue

```ts
defaultValue: InputSignal<NoInfer<TData> | undefined>;
```

Defined in: [tanstack-field.ts:71](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L71)

#### Inherited from

[`TanStackField`](TanStackField.md).[`defaultValue`](TanStackField.md#defaultvalue)

***

### disableErrorFlat

```ts
disableErrorFlat: InputSignal<boolean | undefined>;
```

Defined in: [tanstack-field.ts:148](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L148)

#### Inherited from

[`TanStackField`](TanStackField.md).[`disableErrorFlat`](TanStackField.md#disableerrorflat)

***

### injector

```ts
injector: Injector;
```

Defined in: [tanstack-field.ts:221](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L221)

#### Inherited from

[`TanStackField`](TanStackField.md).[`injector`](TanStackField.md#injector)

***

### listeners

```ts
listeners: InputSignal<
  | NoInfer<FieldListeners<TParentData, TName, TData>>
| undefined>;
```

Defined in: [tanstack-field.ts:116](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L116)

#### Inherited from

[`TanStackField`](TanStackField.md).[`listeners`](TanStackField.md#listeners)

***

### mode

```ts
mode: InputSignal<"value" | "array" | undefined>;
```

Defined in: [tanstack-field.ts:146](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L146)

#### Inherited from

[`TanStackField`](TanStackField.md).[`mode`](TanStackField.md#mode)

***

### name

```ts
name: InputSignal<TName>;
```

Defined in: [tanstack-field.ts:70](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L70)

#### Inherited from

[`TanStackField`](TanStackField.md).[`name`](TanStackField.md#name)

***

### options

```ts
options: Signal<FieldApiOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [tanstack-field.ts:182](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L182)

#### Inherited from

[`TanStackField`](TanStackField.md).[`options`](TanStackField.md#options)

***

### tanstackField

```ts
tanstackField: InputSignal<FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>>;
```

Defined in: [tanstack-field.ts:78](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L78)

#### Inherited from

[`TanStackField`](TanStackField.md).[`tanstackField`](TanStackField.md#tanstackfield)

***

### validators

```ts
validators: InputSignal<
  | NoInfer<FieldValidators<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>>
| undefined>;
```

Defined in: [tanstack-field.ts:96](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L96)

#### Inherited from

[`TanStackField`](TanStackField.md).[`validators`](TanStackField.md#validators)

## Accessors

### api

#### Get Signature

```ts
get api(): FieldApi<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [tanstack-field.ts:154](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L154)

##### Returns

`FieldApi`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

#### Inherited from

[`TanStackField`](TanStackField.md).[`api`](TanStackField.md#api)

## Methods

### ngOnInit()

```ts
ngOnInit(): void;
```

Defined in: [tanstack-field.ts:239](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.ts#L239)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Inherited from

[`TanStackField`](TanStackField.md).[`ngOnInit`](TanStackField.md#ngoninit)
