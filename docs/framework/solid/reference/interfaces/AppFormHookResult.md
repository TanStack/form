---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:24](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L24)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](../type-aliases/AnySolidFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:27](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L27)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:28](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L28)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:29](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L29)

***

### useFormContext

```ts
useFormContext: () => SolidAppFormApi<any, any, TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:30](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L30)

#### Returns

[`SolidAppFormApi`](../type-aliases/SolidAppFormApi.md)\<`any`, `any`, `TComponents`\>
