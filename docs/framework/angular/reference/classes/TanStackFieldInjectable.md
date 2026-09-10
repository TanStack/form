---
id: TanStackFieldInjectable
title: TanStackFieldInjectable
---

# Class: TanStackFieldInjectable\<TFieldValue, TFieldName, TFieldError, TFormData, TFormErrorTypes\>

Defined in: [injectable.ts:5](https://github.com/TanStack/form/blob/main/packages/angular-form/src/injectable.ts#L5)

## Type Parameters

### TFieldValue

`TFieldValue`

### TFieldName

`TFieldName` = `any`

### TFieldError

`TFieldError` = `any`

### TFormData

`TFormData` = `any`

### TFormErrorTypes

`TFormErrorTypes` *extends* `FormErrorTypes` = `any`

## Constructors

### Constructor

```ts
new TanStackFieldInjectable<TFieldValue, TFieldName, TFieldError, TFormData, TFormErrorTypes>(): TanStackFieldInjectable<TFieldValue, TFieldName, TFieldError, TFormData, TFormErrorTypes>;
```

#### Returns

`TanStackFieldInjectable`\<`TFieldValue`, `TFieldName`, `TFieldError`, `TFormData`, `TFormErrorTypes`\>

## Properties

### \_api

```ts
_api: WritableSignal<FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes>>;
```

Defined in: [injectable.ts:12](https://github.com/TanStack/form/blob/main/packages/angular-form/src/injectable.ts#L12)

## Accessors

### api

#### Get Signature

```ts
get api(): FieldApi<TFieldName, TFieldValue, TFieldError, TFormData, TFormErrorTypes>;
```

Defined in: [injectable.ts:16](https://github.com/TanStack/form/blob/main/packages/angular-form/src/injectable.ts#L16)

##### Returns

`FieldApi`\<`TFieldName`, `TFieldValue`, `TFieldError`, `TFormData`, `TFormErrorTypes`\>
