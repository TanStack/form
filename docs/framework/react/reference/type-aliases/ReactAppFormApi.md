---
id: ReactAppFormApi
title: ReactAppFormApi
---

```ts
type ReactAppFormApi<TFormData, TFormError, TComponents> = ReactFormApi<TFormData, TFormError, TComponents> & object;
```

Defined in: [packages/react-form/src/AppForm/ReactAppFormApi.public.tsx:10](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/ReactAppFormApi.public.tsx#L10)

## Type Declaration

### AppForm

```ts
AppForm: AppFormComponent;
```

## Type Parameters

### TFormData

`TFormData`

### TFormError

`TFormError` *extends* `ScopedErrorTypes`

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](AnyReactFormComponentMap.md)
