---
id: FieldGroupFieldComponent
title: FieldGroupFieldComponent
---

```ts
type FieldGroupFieldComponent<TFieldData, TFieldComponents> = <TFieldName>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:25](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L25)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
