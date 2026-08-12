---
id: AppFormHookResult
title: AppFormHookResult
---

# Interface: AppFormHookResult\<TComponents\>

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:25](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L25)

## Type Parameters

### TComponents

`TComponents` *extends* [`AnyReactFormComponentMap`](../type-aliases/AnyReactFormComponentMap.md)

## Properties

### appFormOptions

```ts
appFormOptions: AppFormOptionsApi<TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:28](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L28)

***

### defineAppFieldGroup

```ts
defineAppFieldGroup: DefineFieldGroupFn<TComponents["fieldComponents"]>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:67](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L67)

Defines a field group whose fields expose the field components registered
with `createFormHook`.

#### Example

```tsx
const { defineAppFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})

const passwordFieldGroup = defineAppFieldGroup(({ strict }) => ({
  password: strict<string>(),
  confirmPassword: strict<string>(),
}))

interface PasswordFieldsProps {
  fields: typeof passwordFieldGroup.fields
}

function PasswordFields({ fields }: PasswordFieldsProps) {
  return (
    <>
      <fields.Field name="password">
        {(field) => <field.TextField label="Password" />}
      </fields.Field>
      <fields.Field name="confirmPassword">
        {(field) => (
          <field.TextField label="Confirm password" />
        )}
      </fields.Field>
    </>
  )
}
```

***

### useAppForm

```ts
useAppForm: UseAppFormHook<TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:68](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L68)

***

### useFormContext

```ts
useFormContext: () => ReactAppFormApi<any, any, TComponents>;
```

Defined in: [packages/react-form/src/AppForm/createFormHookTypes.public.ts:69](https://github.com/LeCarbonator/tanstack-form/blob/main/packages/react-form/src/AppForm/createFormHookTypes.public.ts#L69)

#### Returns

[`ReactAppFormApi`](../type-aliases/ReactAppFormApi.md)\<`any`, `any`, `TComponents`\>
