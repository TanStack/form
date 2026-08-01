---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:159](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L159)

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

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:167](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L167)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:165](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L165)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:166](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L166)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:168](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L168)
