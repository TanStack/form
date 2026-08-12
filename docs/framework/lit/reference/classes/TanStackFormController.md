---
id: TanStackFormController
title: TanStackFormController
---

# Class: TanStackFormController\<TFormData, TFormValidators, TSubmitReturn\>

Defined in: [tanstack-form-controller.ts:177](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L177)

## Type Parameters

### TFormData

`TFormData`

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

### TSubmitReturn

`TSubmitReturn`

## Implements

- `ReactiveController`
- [`LitFieldMethods`](../interfaces/LitFieldMethods.md)\<`TFormData`, `never`, `TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>
- [`LitSubscribeMethod`](../interfaces/LitSubscribeMethod.md)\<`FormState`\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>\>

## Constructors

### Constructor

```ts
new TanStackFormController<TFormData, TFormValidators, TSubmitReturn>(host, options): TanStackFormController<TFormData, TFormValidators, TSubmitReturn>;
```

Defined in: [tanstack-form-controller.ts:204](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L204)

#### Parameters

##### host

`ReactiveControllerHost`

##### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

#### Returns

`TanStackFormController`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Accessors

### api

#### Get Signature

```ts
get api(): FormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>>;
```

Defined in: [tanstack-form-controller.ts:197](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L197)

##### Returns

`FormApi`\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>

## Methods

### arrayField()

```ts
arrayField<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:269](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L269)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `never`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>\>

#### Returns

`unknown`

#### Implementation of

[`LitFieldMethods`](../interfaces/LitFieldMethods.md).[`arrayField`](../interfaces/LitFieldMethods.md#arrayfield)

***

### field()

```ts
field<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:232](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L232)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `string`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>\>

#### Returns

`unknown`

#### Implementation of

[`LitFieldMethods`](../interfaces/LitFieldMethods.md).[`field`](../interfaces/LitFieldMethods.md#field)

***

### formGroup()

```ts
formGroup<TGroupName, TGroupValue, TGroupValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:319](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L319)

#### Type Parameters

##### TGroupName

`TGroupName` *extends* `string`

##### TGroupValue

`TGroupValue`

##### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

#### Parameters

##### options

`Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>, `"form"`\>

##### render

`RenderCallback`\<[`LitFormGroupApi`](../type-aliases/LitFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`TGroupValidators`\>, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>\>

#### Returns

`unknown`

***

### hostConnected()

```ts
hostConnected(): void;
```

Defined in: [tanstack-form-controller.ts:213](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L213)

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

Defined in: [tanstack-form-controller.ts:218](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L218)

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

***

### subscribe()

```ts
subscribe<TSelected>(
   selector, 
   render, 
   when?): unknown;
```

Defined in: [tanstack-form-controller.ts:306](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L306)

#### Type Parameters

##### TSelected

`TSelected`

#### Parameters

##### selector

(`state`) => `TSelected`

##### render

`RenderCallback`\<`NoInfer`\<`TSelected`\>\>

##### when?

(`selected`) => `boolean`

#### Returns

`unknown`

#### Implementation of

[`LitSubscribeMethod`](../interfaces/LitSubscribeMethod.md).[`subscribe`](../interfaces/LitSubscribeMethod.md#subscribe)

***

### update()

```ts
update(options): void;
```

Defined in: [tanstack-form-controller.ts:228](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L228)

Updates reactive form options without replacing the form instance.

#### Parameters

##### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

#### Returns

`void`
