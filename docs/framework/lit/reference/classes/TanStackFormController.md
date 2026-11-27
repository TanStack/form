---
id: TanStackFormController
title: TanStackFormController
---

Defined in: [tanstack-form-controller.ts:197](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L197)

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

## Type Param

**TFormValidators**

Library-managed. Do not specify explicitly.

## Type Parameters

### TFormData

`TFormData`

Library-managed. Do not specify explicitly.

### TValidatorConfig

`TValidatorConfig` *extends* `unknown`[]

### TValidators

`TValidators`

### TSubmitReturn

`TSubmitReturn`

Library-managed. Do not specify explicitly.

### TFormError

`TFormError` *extends* `ScopedErrorTypes` = `GetFormErrorTypes`\<`TValidators`, `TSubmitReturn`\>

## Implements

- `ReactiveController`
- [`LitFieldMethods`](../interfaces/LitFieldMethods.md)\<`TFormData`, `never`, `TFormData`, `TFormError`\>
- [`LitSubscribeMethod`](../interfaces/LitSubscribeMethod.md)\<`FormState`\<`TFormData`, `TFormError`\>\>

## Constructors

### Constructor

```ts
new TanStackFormController<TFormData, TValidatorConfig, TValidators, TSubmitReturn, TFormError>(host, options): TanStackFormController<TFormData, TValidatorConfig, TValidators, TSubmitReturn, TFormError>;
```

Defined in: [tanstack-form-controller.ts:224](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L224)

#### Parameters

##### host

`ReactiveControllerHost`

The Lit host that owns the controller and form lifecycle.

##### options

`FormOptions`\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>

The initial form options. `defaultValues` drive form value
inference.

#### Returns

`TanStackFormController`\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `TFormError`\>

## Accessors

### api

#### Get Signature

```ts
get api(): FormApi<TFormData, TFormError>;
```

Defined in: [tanstack-form-controller.ts:215](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L215)

##### Returns

`FormApi`\<`TFormData`, `TFormError`\>

## Methods

### arrayField()

```ts
arrayField<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:303](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L303)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `never`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`\>\>

#### Returns

`unknown`

#### Implementation of

[`LitFieldMethods`](../interfaces/LitFieldMethods.md).[`arrayField`](../interfaces/LitFieldMethods.md#arrayfield)

***

### field()

```ts
field<TFieldName, TFieldValidators>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:266](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L266)

#### Type Parameters

##### TFieldName

`TFieldName` *extends* `string`

##### TFieldValidators

`TFieldValidators` *extends* `FieldValidators`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>\>

#### Parameters

##### options

`LitFieldOptions`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`\>

##### render

`RenderCallback`\<`LitFieldRenderApi`\<`TFormData`, `TFieldName`, `DeepValue`\<`TFormData`, `TFieldName`\>, `TFieldValidators`, `never`, `TFormData`, `TFormError`\>\>

#### Returns

`unknown`

#### Implementation of

[`LitFieldMethods`](../interfaces/LitFieldMethods.md).[`field`](../interfaces/LitFieldMethods.md#field)

***

### formGroup()

```ts
formGroup<TGroupName, TGroupValue, TGroupValidators, TGroupSubmitReturn>(options, render): unknown;
```

Defined in: [tanstack-form-controller.ts:348](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L348)

#### Type Parameters

##### TGroupName

`TGroupName` *extends* `string`

##### TGroupValue

`TGroupValue`

##### TGroupValidators

`TGroupValidators` *extends* `FormGroupValidators`\<`TGroupValue`\>

##### TGroupSubmitReturn

`TGroupSubmitReturn` = `void`

#### Parameters

##### options

`Omit`\<`FormGroupOptions`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidators`, `TFormError`, `TGroupSubmitReturn`\>, `"form"`\>

##### render

`RenderCallback`\<[`LitFormGroupApi`](../type-aliases/LitFormGroupApi.md)\<`TFormData`, `TGroupName`, `TGroupValue`, `ToFormGroupErrorTypes`\<`TGroupValidators`, `NoInfer`\<`TGroupSubmitReturn`\>\>, `TFormError`\>\>

#### Returns

`unknown`

***

### hostConnected()

```ts
hostConnected(): void;
```

Defined in: [tanstack-form-controller.ts:239](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L239)

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

Defined in: [tanstack-form-controller.ts:244](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L244)

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

Defined in: [tanstack-form-controller.ts:340](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L340)

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

Defined in: [tanstack-form-controller.ts:254](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L254)

Updates reactive form options without replacing the form instance.

#### Parameters

##### options

`FormOptions`\<`TFormData`, `TValidatorConfig`, `TValidators`, `TSubmitReturn`, `unknown`\>

#### Returns

`void`
