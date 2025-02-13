---
id: TanStackFormController
title: TanStackFormController
---

# Class: TanStackFormController\<TParentData, TFormValidator, TParentMetaExtension\>

Defined in: [tanstack-form-controller.ts:88](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L88)

## Type Parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

• **TParentMetaExtension** = `never`

## Implements

- `ReactiveController`

## Constructors

### new TanStackFormController()

```ts
new TanStackFormController<TParentData, TFormValidator, TParentMetaExtension>(host, config?): TanStackFormController<TParentData, TFormValidator, TParentMetaExtension>
```

Defined in: [tanstack-form-controller.ts:101](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L101)

#### Parameters

##### host

`ReactiveControllerHost`

##### config?

`FormOptions`\<`TParentData`, `TFormValidator`, `TParentMetaExtension`\>

#### Returns

[`TanStackFormController`](tanstackformcontroller.md)\<`TParentData`, `TFormValidator`, `TParentMetaExtension`\>

## Properties

### api

```ts
api: FormApi<TParentData, TFormValidator, TParentMetaExtension>;
```

Defined in: [tanstack-form-controller.ts:99](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L99)

## Methods

### field()

```ts
field<TName, TFieldValidator, TData>(fieldConfig, render): object
```

Defined in: [tanstack-form-controller.ts:122](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L122)

#### Type Parameters

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* 
  \| `undefined`
  \| `Validator`\<`DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>

#### Parameters

##### fieldConfig

`FieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

##### render

`renderCallback`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`, `TParentMetaExtension`\>

#### Returns

`object`

##### values

```ts
values: object;
```

###### values.form

```ts
form: FormApi<TParentData, TFormValidator, TParentMetaExtension>;
```

###### values.options

```ts
options: FieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

###### values.render

```ts
render: renderCallback<TParentData, TName, TFieldValidator, TFormValidator, TData, TParentMetaExtension>;
```

***

### hostConnected()

```ts
hostConnected(): void
```

Defined in: [tanstack-form-controller.ts:112](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L112)

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
hostDisconnected(): void
```

Defined in: [tanstack-form-controller.ts:118](https://github.com/TanStack/form/blob/main/packages/lit-form/src/tanstack-form-controller.ts#L118)

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
