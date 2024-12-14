---
id: TanStackField
title: TanStackField
---

# Class: TanStackField\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

## Type Parameters

• **TParentData**

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> = `StandardSchemaValidator`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> = `StandardSchemaValidator`

• **TData** *extends* `DeepValue`\<`TParentData`, `TName`\> = `DeepValue`\<`TParentData`, `TName`\>

## Implements

- `OnInit`
- `OnChanges`
- `OnDestroy`
- `FieldOptions`\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Constructors

### new TanStackField()

```ts
new TanStackField<TParentData, TName, TFieldValidator, TFormValidator, TData>(): TanStackField<TParentData, TName, TFieldValidator, TFormValidator, TData>
```

#### Returns

[`TanStackField`](tanstackfield.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Properties

### api

```ts
api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

#### Defined in

[tanstack-field.directive.ts:65](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L65)

***

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Implementation of

`FieldOptions.asyncAlways`

#### Defined in

[tanstack-field.directive.ts:51](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L51)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Implementation of

`FieldOptions.asyncDebounceMs`

#### Defined in

[tanstack-field.directive.ts:50](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L50)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

#### Implementation of

`FieldOptions.defaultMeta`

#### Defined in

[tanstack-field.directive.ts:63](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L63)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Implementation of

`FieldOptions.defaultValue`

#### Defined in

[tanstack-field.directive.ts:49](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L49)

***

### listeners?

```ts
optional listeners: NoInfer<FieldListeners<TParentData, TName, TFieldValidator, TFormValidator, TData>>;
```

A list of listeners which attach to the corresponding events

#### Implementation of

`FieldOptions.listeners`

#### Defined in

[tanstack-field.directive.ts:60](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L60)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Implementation of

`FieldOptions.name`

#### Defined in

[tanstack-field.directive.ts:45](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L45)

***

### tanstackField

```ts
tanstackField: FormApi<TParentData, TFormValidator>;
```

#### Defined in

[tanstack-field.directive.ts:53](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L53)

***

### unmount()?

```ts
optional unmount: () => void;
```

#### Returns

`void`

#### Defined in

[tanstack-field.directive.ts:81](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L81)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Implementation of

`FieldOptions.validatorAdapter`

#### Defined in

[tanstack-field.directive.ts:52](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L52)

***

### validators?

```ts
optional validators: NoInfer<FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>>;
```

A list of validators to pass to the field

#### Implementation of

`FieldOptions.validators`

#### Defined in

[tanstack-field.directive.ts:57](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L57)

## Methods

### ngOnChanges()

```ts
ngOnChanges(): void
```

A callback method that is invoked immediately after the
default change detector has checked data-bound properties
if at least one has changed, and before the view and content
children are checked.

#### Returns

`void`

#### Implementation of

`OnChanges.ngOnChanges`

#### Defined in

[tanstack-field.directive.ts:93](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L93)

***

### ngOnDestroy()

```ts
ngOnDestroy(): void
```

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

#### Defined in

[tanstack-field.directive.ts:89](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L89)

***

### ngOnInit()

```ts
ngOnInit(): void
```

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`

#### Defined in

[tanstack-field.directive.ts:83](https://github.com/TanStack/form/blob/main/packages/angular-form/src/tanstack-field.directive.ts#L83)
