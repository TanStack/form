---
id: FieldInfo
title: FieldInfo
---

# Type Alias: FieldInfo\<TFormData\>

```ts
type FieldInfo<TFormData> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:514](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L514)

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

Defined in: [packages/form-core/src/FormApi.ts:518](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L518)

An instance of the FieldAPI.

***

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

Defined in: [packages/form-core/src/FormApi.ts:546](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L546)

A record of field validation internal handling.
