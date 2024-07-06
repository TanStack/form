# Class: TanStackField\<TParentData, TName, TFieldValidator, TFormValidator, TData\>

## Type parameters

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

#### Source

[tanstack-field.directive.ts:61](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L61)

***

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

#### Implementation of

`FieldOptions.asyncAlways`

#### Source

[tanstack-field.directive.ts:50](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L50)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

#### Implementation of

`FieldOptions.asyncDebounceMs`

#### Source

[tanstack-field.directive.ts:49](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L49)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

#### Implementation of

`FieldOptions.defaultMeta`

#### Source

[tanstack-field.directive.ts:59](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L59)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

#### Implementation of

`FieldOptions.defaultValue`

#### Source

[tanstack-field.directive.ts:48](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L48)

***

### name

```ts
name: TName;
```

#### Implementation of

`FieldOptions.name`

#### Source

[tanstack-field.directive.ts:44](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L44)

***

### tanstackField

```ts
tanstackField: FormApi<TParentData, TFormValidator>;
```

#### Source

[tanstack-field.directive.ts:52](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L52)

***

### unmount()?

```ts
optional unmount: () => void;
```

#### Returns

`void`

#### Source

[tanstack-field.directive.ts:76](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L76)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

#### Implementation of

`FieldOptions.validatorAdapter`

#### Source

[tanstack-field.directive.ts:51](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L51)

***

### validators?

```ts
optional validators: NoInfer<FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>>;
```

#### Implementation of

`FieldOptions.validators`

#### Source

[tanstack-field.directive.ts:56](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L56)

## Methods

### ngOnChanges()

```ts
ngOnChanges(): void
```

#### Returns

`void`

#### Implementation of

`OnChanges.ngOnChanges`

#### Source

[tanstack-field.directive.ts:88](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L88)

***

### ngOnDestroy()

```ts
ngOnDestroy(): void
```

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

#### Source

[tanstack-field.directive.ts:84](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L84)

***

### ngOnInit()

```ts
ngOnInit(): void
```

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`

#### Source

[tanstack-field.directive.ts:78](https://github.com/TanStack/form/blob/ada0211684adc85c41587b076e1217390ff5344e/packages/angular-form/src/tanstack-field.directive.ts#L78)
