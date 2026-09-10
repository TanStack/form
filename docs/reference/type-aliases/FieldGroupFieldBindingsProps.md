---
id: FieldGroupFieldBindingsProps
title: FieldGroupFieldBindingsProps
---

# Type Alias: FieldGroupFieldBindingsProps\<TFields, TFormData, TFieldsPropName\>

```ts
type FieldGroupFieldBindingsProps<TFields, TFormData, TFieldsPropName> = unknown extends TFormData ? FieldGroupFieldsPropsDefinition<TFields, TFormData, TFieldsPropName> : FieldGroupIdentityBindings<TFields> extends FieldGroupFieldBindings<TFields, TFormData> ? Partial<FieldGroupFieldsPropsDefinition<TFields, TFormData, TFieldsPropName>> : FieldGroupFieldsPropsDefinition<TFields, TFormData, TFieldsPropName>;
```

Defined in: [FieldGroup/fieldGroupTypes.public.ts:216](https://github.com/TanStack/form/blob/main/packages/form-core/src/FieldGroup/fieldGroupTypes.public.ts#L216)

Builds the concrete-field bindings prop accepted by a bound field-group
component.

The prop is optional only when every virtual field name is already a
compatible path in the parent form. Omitting it then binds each virtual
field to the same-named path. Otherwise, callers must supply a complete
binding map.

## Type Parameters

### TFields

`TFields` *extends* [`FieldGroupFields`](FieldGroupFields.md)

The virtual field schema whose keys require bindings.

### TFormData

`TFormData`

The parent form data used to validate paths and
identity bindings.

### TFieldsPropName

`TFieldsPropName` *extends* `PropertyKey`

The component prop that carries the binding
map.
