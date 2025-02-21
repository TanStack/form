---
id: FieldInfo
title: FieldInfo
---

# Type Alias: FieldInfo\<TFormData\>

```ts
type FieldInfo<TFormData> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:344](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L344)

An object representing the field information for a specific field within the form.

## Type Parameters

• **TFormData**

## Type declaration

### instance

```ts
instance: 
  | FieldApi<TFormData, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>
  | null;
```

An instance of the FieldAPI.

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

A record of field validation internal handling.
