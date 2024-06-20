# Type alias: FieldInfo\<TFormData, TFormValidator\>

```ts
type FieldInfo<TFormData, TFormValidator>: object;
```

An object representing the field information for a specific field within the form.

## Type parameters

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

## Source

[packages/form-core/src/FormApi.ts:175](https://github.com/TanStack/form/blob/5aaf73c63cd794485f5bed1e917a8daa05a297dc/packages/form-core/src/FormApi.ts#L175)
