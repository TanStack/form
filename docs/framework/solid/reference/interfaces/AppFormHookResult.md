---
id: AppFormHookResult
title: AppFormHookResult
---

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:118](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L118)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnySolidFormComponentMap`](../type-aliases/AnySolidFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: FormOptionsApi<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:121](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L121)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:122](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L122)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:123](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L123)

***

### useFormContext

```ts
useFormContext: () => SolidAppFormApi<any, any, TComponents>;
```

Defined in: [packages/solid-form/src/AppForm/createFormHookTypes.public.ts:124](https://github.com/TanStack/form/blob/main/packages/solid-form/src/AppForm/createFormHookTypes.public.ts#L124)

#### Returns

[`SolidAppFormApi`](../type-aliases/SolidAppFormApi.md)\<`any`, `any`, `TComponents`\>
