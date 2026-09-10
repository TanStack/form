---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:112](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L112)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](../type-aliases/AnySolidFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: FormOptionsApi<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:115](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L115)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:116](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L116)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:117](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L117)

***

### useFormContext

```ts
useFormContext: () => SolidAppFormApi<any, any, TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:118](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L118)

#### Returns

[`SolidAppFormApi`](../type-aliases/SolidAppFormApi.md)\<`any`, `any`, `TComponents`\>
