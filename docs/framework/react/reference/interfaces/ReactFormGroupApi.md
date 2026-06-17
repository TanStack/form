---
id: ReactFormGroupApi
title: ReactFormGroupApi
---

# Interface: ReactFormGroupApi\<TFormData, TGroupName, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents\>

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:598](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L598)

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

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:622](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L622)

***

### Field

```ts
Field: ReactFormGroupFieldComponent<TFormData, TGroupValue, TGroupValidatorMetas, TFormValidatorMetas, TSubmitReturn, TFieldComponents>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:614](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L614)

***

### Subscribe

```ts
Subscribe: ReactFormGroupSubscribeComponent<TGroupValue, TGroupValidatorMetas>;
```

Defined in: [packages/react-form/src/ReactForm/Components.public.ts:630](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/ReactForm/Components.public.ts#L630)
