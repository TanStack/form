---
id: FieldGroupArrayFieldComponent
title: FieldGroupArrayFieldComponent
---

# Type Alias: FieldGroupArrayFieldComponent\<TFieldData, TFieldComponents\>

```ts
type FieldGroupArrayFieldComponent<TFieldData, TFieldComponents> = <TFieldName>(options) => SvelteComponent & Component<any> & WithoutFunction<Component>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:48](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L48)

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\>
