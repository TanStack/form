---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:24](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L24)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](../type-aliases/AnySolidFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:27](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L27)

***

### getAppFieldGroupHelpers()

```ts
getAppFieldGroupHelpers: () => FieldGroupHelpers<TComponents["fieldComponents"]>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:28](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L28)

#### Returns

[`FieldGroupHelpers`](FieldGroupHelpers.md)\<`TComponents`\[`"fieldComponents"`\]\>

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:31](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L31)

***

### useFormContext()

```ts
useFormContext: () => SolidAppFormApi<any, any, TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:32](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L32)

#### Returns

[`SolidAppFormApi`](../type-aliases/SolidAppFormApi.md)\<`any`, `any`, `TComponents`\>
