---
id: FieldInfo
title: FieldInfo
---

# Type Alias: FieldInfo\<TFormData\>

```ts
type FieldInfo<TFormData> = object;
```

Defined in: [packages/form-core/src/FormApi.ts:490](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L490)

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

Defined in: [packages/form-core/src/FormApi.ts:494](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L494)

An instance of the FieldAPI.

***

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

Defined in: [packages/form-core/src/FormApi.ts:522](https://github.com/TanStack/form/blob/main/packages/form-core/src/FormApi.ts#L522)

A record of field validation internal handling.
