---
id: TanStackFormController
title: TanStackFormController
---

# Class: TanStackFormController\<TFormData, TFormValidators, TSubmitReturn\>

Defined in: [tanstack-form-controller.ts:209](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L209)

Owns a form for a Lit reactive-controller host and provides Lit-specific
field, form-group, and subscription render helpers.

`defaultValues` establish the initial state and inferred form value type.
The form mounts when its host connects and is cleaned up when the host
disconnects. Call `update(...)` to apply later options without replacing the
form instance, and access the framework-agnostic form API through `api`.

## Example

```ts
class ProfileForm extends LitElement {
  private form = new TanStackFormController(this, {
    defaultValues: { name: '' },
    onSubmit: ({ value }) => saveProfile(value),
  })

  render() {
    return html`<form
      @submit=${(event: SubmitEvent) => {
        event.preventDefault()
        void this.form.api.handleSubmit()
      }}
    ></form>`
  }
}
```

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TFormValidators

`TFormValidators` *extends* `FormValidators`\<`TFormData`\>

Library-managed. Do not specify explicitly.

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

## Implements

- `ReactiveController`
- [`LitFieldMethods`](../interfaces/LitFieldMethods.md)\<`TFormData`, `never`, `TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>
- [`LitSubscribeMethod`](../interfaces/LitSubscribeMethod.md)\<`FormState`\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>\>

## Constructors

### Constructor

```ts
new TanStackFormController<TFormData, TFormValidators, TSubmitReturn>(host, options): TanStackFormController<TFormData, TFormValidators, TSubmitReturn>;
```

Defined in: [tanstack-form-controller.ts:241](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L241)

#### Parameters

##### host

`ReactiveControllerHost`

The Lit host that owns the controller and form lifecycle.

##### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

The initial form options. `defaultValues` drive form value
inference.

#### Returns

`TanStackFormController`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

## Accessors

### api

#### Get Signature

```ts
get api(): FormApi<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>>;
```

Defined in: [tanstack-form-controller.ts:229](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L229)

##### Returns

`FormApi`\<`TFormData`, `ToFormErrorTypes`\<`TFormValidators`, `TSubmitReturn`\>\>

## Methods

### arrayField()

```ts
arrayField<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:306](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L306)

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

Defined in: [tanstack-form-controller.ts:269](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L269)

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

Defined in: [tanstack-form-controller.ts:356](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L356)

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

Defined in: [tanstack-form-controller.ts:250](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L250)

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

Defined in: [tanstack-form-controller.ts:255](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L255)

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

Defined in: [tanstack-form-controller.ts:343](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L343)

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

Defined in: [tanstack-form-controller.ts:265](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L265)

Updates reactive form options without replacing the form instance.

#### Parameters

##### options

`FormOptions`\<`TFormData`, `TFormValidators`, `TSubmitReturn`\>

#### Returns

`void`
