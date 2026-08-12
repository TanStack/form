---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:73](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L73)

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

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:83](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L83)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:81](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L81)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:82](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L82)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts:84](https://github.com/TanStack/form/blob/main/packages/solid-form/src/FieldGroup/FieldGroupApi.public.ts#L84)
