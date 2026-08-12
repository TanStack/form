---
id: FieldWithValue
title: FieldWithValue
---

# Type Alias: FieldWithValue\<TFieldValue\>

```ts
type FieldWithValue<TFieldValue> = FieldApi<any, TFieldValue, any, any, any>;
```

Defined in: [types.public.ts:50](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/form-core/src/types.public.ts#L50)

A field API that preserves its value type while erasing its name, error, and
owning form types.

Use it for reusable value-specific UI or helpers that should accept the same
value type at any field path. Value reads and updates remain typed without
tying the reusable code to one path or form shape.

## Type Parameters

### TFieldValue

`TFieldValue`

## Example

```ts
function trimField(field: FieldWithValue<string>) {
  field.handleChange((value) => value.trim())
}
```
