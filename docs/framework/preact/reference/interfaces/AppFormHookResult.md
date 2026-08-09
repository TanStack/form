---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:25](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L25)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyPreactFormComponentMap`](../type-aliases/AnyPreactFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:28](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L28)

***

### getAppFieldGroupHelpers

```ts
getAppFieldGroupHelpers: () => FieldGroupHelpers<TComponents["fieldComponents"]>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:29](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L29)

#### Returns

[`FieldGroupHelpers`](FieldGroupHelpers.md)\<`TComponents`\[`"fieldComponents"`\]\>

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:32](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L32)

***

### useFormContext

```ts
useFormContext: () => PreactAppFormApi<any, any, TComponents>;
```

Defined in: [packages/preact-form/src/AppForm/createFormHookTypes.public.ts:33](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/preact-form/src/AppForm/createFormHookTypes.public.ts#L33)

#### Returns

[`PreactAppFormApi`](../type-aliases/PreactAppFormApi.md)\<`any`, `any`, `TComponents`\>
