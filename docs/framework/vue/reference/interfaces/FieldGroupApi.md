---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts:133](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts#L133)

## Extends

- `FormApiFieldMethods`\<`TFieldData`\>.`FormApiArrayMethods`\<`TFieldData`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `Component`\> = `Record`\<`never`, `never`\>

## Properties

### ArrayField

```ts
ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts:143](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts#L143)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts:141](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts#L141)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts:142](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts#L142)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts:144](https://github.com/TanStack/form/blob/main/packages/vue-form/src/FieldGroup/FieldGroupApi.public.ts#L144)
