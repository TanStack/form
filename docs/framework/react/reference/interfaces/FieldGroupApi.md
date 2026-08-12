---
id: FieldGroupApi
title: FieldGroupApi
---

# Interface: FieldGroupApi\<TFieldData, TFieldComponents\>

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:174](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L174)

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

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:182](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L182)

***

### atom

```ts
atom: ReadonlyAtom<TFieldData>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:180](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L180)

***

### Field

```ts
Field: FieldGroupFieldComponent<TFieldData, TFieldComponents>;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:181](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L181)

***

### Subscribe

```ts
Subscribe: FieldGroupSubscribeComponent;
```

Defined in: [packages/react-form/src/FieldGroup/FieldGroupApi.public.ts:183](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/FieldGroup/FieldGroupApi.public.ts#L183)
