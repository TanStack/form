---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:23](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L23)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](../type-aliases/AnyVueFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:24](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L24)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:25](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L25)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:26](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L26)

***

### useFormContext

```ts
useFormContext: () => VueAppFormApi<any, any, TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:27](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L27)

#### Returns

[`VueAppFormApi`](../type-aliases/VueAppFormApi.md)\<`any`, `any`, `TComponents`\>
