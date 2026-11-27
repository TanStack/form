---
id: FieldGroupApi
title: FieldGroupApi
---

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:82](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L82)

## Extends

- `FormApiFieldMethods`\<`TFieldData`\>.`FormApiArrayMethods`\<`TFieldData`\>.`SvelteFieldComponentsType`\<`TFieldComponents`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\<`any`\>\> = `Record`\<`never`, `never`\>

## Properties

### \[fieldComponentsSymbol\]?

```ts
readonly optional [fieldComponentsSymbol]?: TFieldComponents;
```

Defined in: [packages/svelte-form/src/fieldComponentsType.lib.ts:9](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/fieldComponentsType.lib.ts#L9)

#### Inherited from

```ts
SvelteFieldComponentsType.[fieldComponentsSymbol]
```

***

### ArrayField

```ts
ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:95](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L95)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:93](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L93)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:94](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L94)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts:96](https://github.com/TanStack/form/blob/main/packages/svelte-form/src/FieldGroup/FieldGroupApi.public.ts#L96)
