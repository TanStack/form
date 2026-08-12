---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:82](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L82)

## Extends

- `FormApiFieldMethods`\<`TFieldData`\>.`FormApiArrayMethods`\<`TFieldData`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\> = `Record`\<`never`, `never`\>

## Properties

### ArrayField

```ts
ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:92](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L92)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:90](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L90)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:91](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L91)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:93](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L93)
