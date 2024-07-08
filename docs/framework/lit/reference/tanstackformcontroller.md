# Class: TanStackFormController\<TParentData, TFormValidator\>

## Type parameters

• **TParentData**

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

## Implements

- `ReactiveController`

## Constructors

### new TanStackFormController()

```ts
new TanStackFormController<TParentData, TFormValidator>(host, config?): TanStackFormController<TParentData, TFormValidator>
```

#### Parameters

• **host**: `ReactiveControllerHost`

• **config?**: `FormOptions`\<`TParentData`, `TFormValidator`\>

#### Returns

[`TanStackFormController`](tanstackformcontroller.md)\<`TParentData`, `TFormValidator`\>

#### Source

[tanstack-form-controller.ts:93](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/lit-form/src/tanstack-form-controller.ts#L93)

## Properties

### api

```ts
api: FormApi<TParentData, TFormValidator>;
```

#### Source

[tanstack-form-controller.ts:91](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/lit-form/src/tanstack-form-controller.ts#L91)

## Methods

### field()

```ts
field<TName, TFieldValidator, TData>(fieldConfig, render): object
```

#### Type parameters

• **TName** *extends* `string` \| `number`

• **TFieldValidator** *extends* `undefined` \| `Validator`\<`DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>, `unknown`\> = `undefined`

• **TData** = `DeepValue`\<`TParentData`, `TName`, `IsNullable`\<`TParentData`\>\>

#### Parameters

• **fieldConfig**: `FieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

• **render**: `renderCallback`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

#### Returns

`object`

##### values

```ts
values: object;
```

##### values.form

```ts
form: FormApi<TParentData, TFormValidator>;
```

##### values.options

```ts
options: FieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

##### values.render

```ts
render: renderCallback<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

#### Source

[tanstack-form-controller.ts:112](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/lit-form/src/tanstack-form-controller.ts#L112)

***

### hostConnected()

```ts
hostConnected(): void
```

#### Returns

`void`

#### Implementation of

`ReactiveController.hostConnected`

#### Source

[tanstack-form-controller.ts:102](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/lit-form/src/tanstack-form-controller.ts#L102)

***

### hostDisconnected()

```ts
hostDisconnected(): void
```

#### Returns

`void`

#### Implementation of

`ReactiveController.hostDisconnected`

#### Source

[tanstack-form-controller.ts:108](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/lit-form/src/tanstack-form-controller.ts#L108)
