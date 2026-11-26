---
id: FormContextData
title: FormContextData
---

Defined in: [packages/react-form/src/AppForm/helpers/formContext.public.ts:5](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formContext.public.ts#L5)

## Type Parameters

### TOptions

`TOptions` *extends* `AnyFormOptions` \| `FormOptionsApi`\<`unknown`\>

## Properties

### Provider

```ts
Provider: FunctionComponent<{
  children?: ReactNode;
  form: ReactFormType<TOptions>;
}>;
```

Defined in: [packages/react-form/src/AppForm/helpers/formContext.public.ts:8](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formContext.public.ts#L8)

***

### useFormContext

```ts
useFormContext: () => ReactFormType<TOptions>;
```

Defined in: [packages/react-form/src/AppForm/helpers/formContext.public.ts:12](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formContext.public.ts#L12)

#### Returns

[`ReactFormType`](../type-aliases/ReactFormType.md)\<`TOptions`\>
