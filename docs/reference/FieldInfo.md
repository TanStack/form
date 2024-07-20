---
id: FieldInfo
title: FieldInfo
---

# Type Alias: FieldInfo\<TFormData, TFormValidator\>

```ts
type FieldInfo<TFormData, TFormValidator>: object;
```

An object representing the field information for a specific field within the form.

## Type Parameters

• **TFormData**

• **TFormValidator** *extends* `Validator`\<`TFormData`, `unknown`\> \| `undefined` = `undefined`

## Type declaration

### instance

```ts
instance: FieldApi<TFormData, any, Validator<unknown, unknown> | undefined, TFormValidator> | null;
```

An instance of the FieldAPI.

### validationMetaMap

```ts
validationMetaMap: Record<ValidationErrorMapKeys, ValidationMeta | undefined>;
```

A record of field validation internal handling.

## Defined in

[packages/form-core/src/FormApi.ts:176](https://github.com/TanStack/form/blob/a6313b7699753752ae30ff16c169e0b08c2369e8/packages/form-core/src/FormApi.ts#L176)
