---
id: AppFormHookResult
title: AppFormHookResult
---

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:116](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L116)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyVueFormComponentMap`](../type-aliases/AnyVueFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: FormOptionsApi<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:117](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L117)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:118](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L118)

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:119](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L119)

***

### useFormContext

```ts
useFormContext: () => VueAppFormApi<any, any, TComponents>;
```

Defined in: [packages/vue-form/src/AppForm/createFormHookTypes.public.ts:120](https://github.com/TanStack/form/blob/main/packages/vue-form/src/AppForm/createFormHookTypes.public.ts#L120)

#### Returns

[`VueAppFormApi`](../type-aliases/VueAppFormApi.md)\<`any`, `any`, `TComponents`\>
