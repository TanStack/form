---
id: FieldInfo
title: FieldInfo
---

# Type Alias: FieldInfo\<TFormData\>

```ts
type FieldInfo<TFormData> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:544](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L544)

An object representing the field information for a specific field within the form.

## Type Parameters

### TFormData

`TFormData`

## Properties

### instance

```ts
instance: 
  | FieldApi<TFormData, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  | null;
```

Defined in: [packages/form-core/src/FormApi.ts:548](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L548)

An instance of the FieldAPI.

***

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

Defined in: [packages/form-core/src/FormApi.ts:576](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L576)

A record of field validation internal handling.
