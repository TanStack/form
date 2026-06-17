---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:164](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L164)

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

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:172](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L172)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:170](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L170)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:171](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L171)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:173](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L173)
