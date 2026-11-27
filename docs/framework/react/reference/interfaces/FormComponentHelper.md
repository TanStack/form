---
id: FormComponentHelper
title: FormComponentHelper
---

Defined in: [packages/react-form/src/AppForm/helpers/formComponent.public.ts:197](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formComponent.public.ts#L197)

Prepares reusable components to receive the form API from a registered form
component.

Obtain this helper from `getFormHookHelpers().formComponent`.

## Methods

### create()

```ts
create<TComponent, TPropKey>(options): FormComponentRegistration<TComponent, TPropKey>;
```

Defined in: [packages/react-form/src/AppForm/helpers/formComponent.public.ts:234](https://github.com/TanStack/form/blob/main/packages/react-form/src/AppForm/helpers/formComponent.public.ts#L234)

Injects the nearest registered form component's form API into the selected prop.

The prop must accept any form values and errors, such as `AnyReactFormApi`.
Register the result in `createFormHook`'s `formComponents`.
Callers supply only the remaining props.

#### Type Parameters

##### TComponent

`TComponent` *extends* `FunctionComponent`\<`any`\>

Library-managed. Do not specify explicitly.

##### TPropKey

`TPropKey` *extends* `string` = `FormPropKeys`\<`GetProps`\<`TComponent`\>\>

Library-managed. Do not specify explicitly.

#### Parameters

##### options

[`CreateFormComponentOptions`](CreateFormComponentOptions.md)\<`TComponent`, `TPropKey`\>

#### Returns

[`FormComponentRegistration`](FormComponentRegistration.md)\<`TComponent`, `TPropKey`\>

#### Remarks

**Important:** Render the result as a registered form component or inside one.
Rendering outside that context throws an error.

#### Example

```tsx
function ResetButtonComponent({ form }: { form: AnyReactFormApi }) {
  return <button type="button" onClick={() => form.reset()}>Reset</button>
}

const { formComponent } = getFormHookHelpers()

const ResetButton = formComponent.create({
  component: ResetButtonComponent,
  replaceProperty: 'form',
})

const { useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: {
    ResetButton
  },
})
```
