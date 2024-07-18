---
id: TanStackField
title: TanStackField
---

# Class: TanStackField\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

## Type Parameters

• **TParentData**

• **TName** *extends* `DeepKeys`\<`TParentData`\>

• **TFieldValidator** *extends* `Validator`\<`DeepValue`\<`TParentData`, `TName`\>, `unknown`\> \| `undefined` = `undefined`

• **TFormValidator** *extends* `Validator`\<`TParentData`, `unknown`\> \| `undefined` = `undefined`

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

[tanstack-field.directive.ts:61](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L61)

***

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

If `true`, always run async validation, even if there are errors emitted during synchronous validation.

#### Implementation of

`FieldOptions.asyncAlways`

#### Defined in

[tanstack-field.directive.ts:50](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L50)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

The default time to debounce async validation if there is not a more specific debounce time passed.

#### Implementation of

`FieldOptions.asyncDebounceMs`

#### Defined in

[tanstack-field.directive.ts:49](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L49)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

An optional object with default metadata for the field.

#### Implementation of

`FieldOptions.defaultMeta`

#### Defined in

[tanstack-field.directive.ts:59](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L59)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

An optional default value for the field.

#### Implementation of

`FieldOptions.defaultValue`

#### Defined in

[tanstack-field.directive.ts:48](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L48)

***

### name

```ts
name: TName;
```

The field name. The type will be `DeepKeys<TParentData>` to ensure your name is a deep key of the parent dataset.

#### Implementation of

`FieldOptions.name`

#### Defined in

[tanstack-field.directive.ts:44](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L44)

***

### tanstackField

```ts
tanstackField: FormApi<TParentData, TFormValidator>;
```

#### Defined in

[tanstack-field.directive.ts:52](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L52)

***

### unmount()?

```ts
optional unmount: () => void;
```

#### Returns

`void`

#### Defined in

[tanstack-field.directive.ts:76](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L76)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

A validator provided by an extension, like `yupValidator` from `@tanstack/yup-form-adapter`

#### Implementation of

`FieldOptions.validatorAdapter`

#### Defined in

[tanstack-field.directive.ts:51](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L51)

***

### validators?

```ts
optional validators: NoInfer<FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>>;
```

A list of validators to pass to the field

#### Implementation of

`FieldOptions.validators`

#### Defined in

[tanstack-field.directive.ts:56](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L56)

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

[tanstack-field.directive.ts:88](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L88)

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

[tanstack-field.directive.ts:84](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L84)

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

[tanstack-field.directive.ts:78](https://github.com/TanStack/form/blob/a7956e9367e8bea8c62bd25c618aa3ad9194b14d/packages/angular-form/src/tanstack-field.directive.ts#L78)
