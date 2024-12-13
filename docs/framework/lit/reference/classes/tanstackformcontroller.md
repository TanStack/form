---
id: TanStackFormController
title: TanStackFormController
---

# Class: TanStackFormController\<TParentData, TFormValidator\>

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `Validator`\<`TParentData`, `StandardSchemaV1`\<`TParentData`\>\>

## Implements

- `ReactiveController`

## Constructors

### new TanStackFormController()

```ts
new TanStackFormController<TParentData, TFormValidator>(host, config?): TanStackFormController<TParentData, TFormValidator>
```

#### Parameters

##### host

`ReactiveControllerHost`

##### config?

`FormOptions`\<`TParentData`, `TFormValidator`\>

#### Returns

[`TanStackFormController`](tanstackformcontroller.md)\<`TParentData`, `TFormValidator`\>

#### Defined in

[tanstack-form-controller.ts:105](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L105)

## Properties

### api

```ts
api: FormApi<TParentData, TFormValidator>;
```

#### Defined in

[tanstack-form-controller.ts:103](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L103)

## Methods

### field()

```ts
field<TName, TFieldValidator, TData>(fieldConfig, render): object
```

#### Type Parameters

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>, `unknown`\> = `Validator`\<`DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>, `StandardSchemaV1`\<`DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>\>\>

• **TData** = `DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>

#### Parameters

##### fieldConfig

`FieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

##### render

`renderCallback`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

`object`

##### values

```ts
values: object;
```

###### values.form

```ts
form: FormApi<TParentData, TFormValidator>;
```

###### values.options

```ts
options: FieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

###### values.render

```ts
render: renderCallback<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

#### Defined in

[tanstack-form-controller.ts:124](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L124)

***

### hostConnected()

```ts
hostConnected(): void
```

Called when the host is connected to the component tree. For custom
element hosts, this corresponds to the `connectedCallback()` lifecycle,
which is only called when the component is connected to the document.

#### Returns

`void`

#### Implementation of

`ReactiveController.hostConnected`

#### Defined in

[tanstack-form-controller.ts:114](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L114)

***

### hostDisconnected()

```ts
hostDisconnected(): void
```

Called when the host is disconnected from the component tree. For custom
element hosts, this corresponds to the `disconnectedCallback()` lifecycle,
which is called the host or an ancestor component is disconnected from the
document.

#### Returns

`void`

#### Implementation of

`ReactiveController.hostDisconnected`

#### Defined in

[tanstack-form-controller.ts:120](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L120)
