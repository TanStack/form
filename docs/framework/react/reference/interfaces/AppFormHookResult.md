---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:27](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L27)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](../type-aliases/AnyReactFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:30](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L30)

***

### getAppFieldGroupHelpers()

```ts
getAppFieldGroupHelpers: () => FieldGroupHelpers<TComponents["fieldComponents"]>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:31](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L31)

#### Returns

[`FieldGroupHelpers`](FieldGroupHelpers.md)\<`TComponents`\[`"fieldComponents"`\]\>

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:34](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L34)

***

### useFormContext()

```ts
useFormContext: () => ReactAppFormApi<any, any, any, TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:35](https://github.com/TanStack/form-v2/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L35)

#### Returns

[`ReactAppFormApi`](../type-aliases/ReactAppFormApi.md)\<`any`, `any`, `any`, `TComponents`\>
