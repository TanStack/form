---
id: ReactFormGroupApi
title: ReactFormGroupApi
---

# Interface: ReactFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:396](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L396)

## Extends

- `FormGroupApi`\<`TFormData`, `TGroupName`, `TGroupValue`, `TGroupValidatorMetas`, `TFormValidatorMetas`, `TSubmitReturn`\>

## Type Parameters

### TFormData

`TFormData`

### TGroupName

`TGroupName`

### TGroupValue

`TGroupValue`

### TGroupValidatorMetas

`TGroupValidatorMetas` *extends* `FormGroupValidatorMetas`

### TFormValidatorMetas

`TFormValidatorMetas` *extends* `FormValidatorMetas`

### TSubmitReturn

`TSubmitReturn`

### TFieldComponents

`TFieldComponents` *extends* `Record`\<`string`, `FunctionComponent`\<`any`\>\>

## Properties

### ArrayField

```ts
ArrayField: ReactFormGroupArrayFieldComponent<TFormData, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:420](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L420)

***

### Field

```ts
Field: ReactFormGroupFieldComponent<TFormData, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:412](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L412)

***

### Subscribe

```ts
Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupValidatorMetas>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:428](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L428)
