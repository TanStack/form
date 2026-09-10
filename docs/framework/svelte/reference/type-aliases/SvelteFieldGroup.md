---
id: SvelteFieldGroup
title: SvelteFieldGroup
---

# Type Alias: SvelteFieldGroup\<TFields, TFieldComponents\>

```ts
type SvelteFieldGroup<TFields, TFieldComponents> = FieldGroupApi<FieldGroupFieldData<TFields>, TFieldComponents> & object;
```

Defined in: [packages/svelte-form/src/FieldGroup/withFields.public.ts:29](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/withFields.public.ts#L29)

## Type Declaration

### \[fieldGroupFieldComponentsSymbol\]

```ts
readonly [fieldGroupFieldComponentsSymbol]: TFieldComponents;
```

### \[fieldGroupFieldsSymbol\]

```ts
readonly [fieldGroupFieldsSymbol]: TFields;
```

## Type Parameters

### TFields

`TFields` *extends* `FieldGroupFields`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\> = `Record`\<`never`, `never`\>
