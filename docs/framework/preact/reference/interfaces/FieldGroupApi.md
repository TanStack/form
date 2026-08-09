---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:74](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L74)

## Extends

- `FormApiFieldMethods`\<`TFieldData`\>.`FormApiArrayMethods`\<`TFieldData`\>

## Type Parameters

### TFieldData

`TFieldData`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\> = `Record`\<`never`, `never`\>

## Properties

### ArrayField

```ts
ArrayField: FieldGroupArrayFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:82](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L82)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:80](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L80)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:81](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L81)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts:83](https://github.com/TanStack/form/blob/main/packages/preact-form/src/FieldGroup/FieldGroupApi.public.ts#L83)
