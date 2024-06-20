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

[`TanStackField`](Class.TanStackField.md)\<`TParentData`, `TName`, `TFieldValidator`, `TFormValidator`, `TData`\>

## Properties

### api

```ts
api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>;
```

#### Source

[tanstack-field.directive.ts:62](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L62)

***

### asyncAlways?

```ts
optional asyncAlways: boolean;
```

#### Implementation of

`FieldOptions.asyncAlways`

#### Source

[tanstack-field.directive.ts:50](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L50)

***

### asyncDebounceMs?

```ts
optional asyncDebounceMs: number;
```

#### Implementation of

`FieldOptions.asyncDebounceMs`

#### Source

[tanstack-field.directive.ts:49](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L49)

***

### defaultMeta?

```ts
optional defaultMeta: Partial<FieldMeta>;
```

#### Implementation of

`FieldOptions.defaultMeta`

#### Source

[tanstack-field.directive.ts:60](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L60)

***

### defaultValue?

```ts
optional defaultValue: NoInfer<TData>;
```

#### Implementation of

`FieldOptions.defaultValue`

#### Source

[tanstack-field.directive.ts:48](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L48)

***

### name

```ts
name: TName;
```

#### Implementation of

`FieldOptions.name`

#### Source

[tanstack-field.directive.ts:44](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L44)

***

### preserveValue?

```ts
optional preserveValue: boolean;
```

#### Implementation of

`FieldOptions.preserveValue`

#### Source

[tanstack-field.directive.ts:51](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L51)

***

### tanstackField

```ts
tanstackField: FormApi<TParentData, TFormValidator>;
```

#### Source

[tanstack-field.directive.ts:53](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L53)

***

### unmount()?

```ts
optional unmount: () => void;
```

#### Returns

`void`

#### Source

[tanstack-field.directive.ts:78](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L78)

***

### validatorAdapter?

```ts
optional validatorAdapter: TFieldValidator;
```

#### Implementation of

`FieldOptions.validatorAdapter`

#### Source

[tanstack-field.directive.ts:52](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L52)

***

### validators?

```ts
optional validators: NoInfer<FieldValidators<TParentData, TName, TFieldValidator, TFormValidator, TData>>;
```

#### Implementation of

`FieldOptions.validators`

#### Source

[tanstack-field.directive.ts:57](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L57)

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

[tanstack-field.directive.ts:90](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L90)

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

[tanstack-field.directive.ts:86](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L86)

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

[tanstack-field.directive.ts:80](https://github.com/TanStack/form/blob/5b8b6371e1e490da7dcf3c588d18227efdee3cd9/packages/angular-form/src/tanstack-field.directive.ts#L80)
