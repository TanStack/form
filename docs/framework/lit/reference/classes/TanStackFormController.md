---
id: TanStackFormController
title: TanStackFormController
---

# Class: TanStackFormController\<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta\>

Defined in: [tanstack-form-controller.ts:222](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L222)

## Type Parameters

### TParentData

`TParentData`

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

- `ReactiveController`

## Constructors

### Constructor

```ts
new TanStackFormController<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>(host, config?): TanStackFormController<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [tanstack-form-controller.ts:255](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L255)

#### Parameters

##### host

`ReactiveControllerHost`

##### config?

`FormOptions`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

#### Returns

`TanStackFormController`\<`TParentData`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

## Properties

### api

```ts
api: FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

Defined in: [tanstack-form-controller.ts:240](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L240)

## Methods

### field()

```ts
field<TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>(fieldConfig, render): object;
```

Defined in: [tanstack-form-controller.ts:299](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L299)

#### Type Parameters

##### TName

`TName` *extends* `string`

##### TData

`TData`

##### TOnMount

`TOnMount` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnChange

`TOnChange` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnChangeAsync

`TOnChangeAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnBlur

`TOnBlur` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnBlurAsync

`TOnBlurAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnSubmit

`TOnSubmit` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnSubmitAsync

`TOnSubmitAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnDynamic

`TOnDynamic` *extends* `FieldValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

##### TOnDynamicAsync

`TOnDynamicAsync` *extends* `FieldAsyncValidateOrFn`\<`TParentData`, `TName`, `TData`\> \| `undefined`

#### Parameters

##### fieldConfig

`FieldOptions`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`\>

##### render

`renderCallback`\<`TParentData`, `TName`, `TData`, `TOnMount`, `TOnChange`, `TOnChangeAsync`, `TOnBlur`, `TOnBlurAsync`, `TOnSubmit`, `TOnSubmitAsync`, `TOnDynamic`, `TOnDynamicAsync`, `TFormOnMount`, `TFormOnChange`, `TFormOnChangeAsync`, `TFormOnBlur`, `TFormOnBlurAsync`, `TFormOnSubmit`, `TFormOnSubmitAsync`, `TFormOnDynamic`, `TFormOnDynamicAsync`, `TFormOnServer`, `TSubmitMeta`\>

#### Returns

`object`

##### values

```ts
values: object;
```

###### values.form

```ts
form: FormApi<TParentData, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

###### values.options

```ts
options: FieldOptions<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync>;
```

###### values.render

```ts
render: renderCallback<TParentData, TName, TData, TOnMount, TOnChange, TOnChangeAsync, TOnBlur, TOnBlurAsync, TOnSubmit, TOnSubmitAsync, TOnDynamic, TOnDynamicAsync, TFormOnMount, TFormOnChange, TFormOnChangeAsync, TFormOnBlur, TFormOnBlurAsync, TFormOnSubmit, TFormOnSubmitAsync, TFormOnDynamic, TFormOnDynamicAsync, TFormOnServer, TSubmitMeta>;
```

***

### hostConnected()

```ts
hostConnected(): void;
```

Defined in: [tanstack-form-controller.ts:289](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L289)

Called when the host is connected to the component tree. For custom
element hosts, this corresponds to the `connectedCallback()` lifecycle,
which is only called when the component is connected to the document.

#### Returns

`void`

#### Implementation of

```ts
ReactiveController.hostConnected
```

***

### hostDisconnected()

```ts
hostDisconnected(): void;
```

Defined in: [tanstack-form-controller.ts:295](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L295)

Called when the host is disconnected from the component tree. For custom
element hosts, this corresponds to the `disconnectedCallback()` lifecycle,
which is called the host or an ancestor component is disconnected from the
document.

#### Returns

`void`

#### Implementation of

```ts
ReactiveController.hostDisconnected
```
