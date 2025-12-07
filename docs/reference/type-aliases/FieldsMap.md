---
id: FieldsMap
title: FieldsMap
---

# Type Alias: FieldsMap\<TFormData, TFieldGroupData\>

```ts
type FieldsMap<TFormData, TFieldGroupData> = TFieldGroupData extends any[] ? never : string extends keyof TFieldGroupData ? never : { [K in keyof TFieldGroupData]: DeepKeysOfType<TFormData, TFieldGroupData[K]> };
```

Defined in: [packages/form-core/src/util-types.ts:186](https://github.com/TanStack/form/blob/main/packages/form-core/src/util-types.ts#L186)

Maps the deep keys of TFormData to the shallow keys of TFieldGroupData.
 Since using template strings as keys is impractical, it relies on shallow keys only.

## Type Parameters

### TFormData

`TFormData`

### TFieldGroupData

`TFieldGroupData`
