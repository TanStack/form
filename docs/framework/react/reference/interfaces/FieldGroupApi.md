---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:73](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L73)

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

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:81](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L81)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:79](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L79)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:80](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L80)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:82](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L82)
