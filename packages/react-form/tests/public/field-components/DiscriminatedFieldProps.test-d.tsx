import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { FieldWithValue } from '../../../src'

type InputProps =
  | { field: FieldWithValue<string>; variant: 'label'; label: string }
  | { field: FieldWithValue<string>; variant: 'icon'; icon: string }

function Input(props: InputProps) {
  return props.variant === 'label' ? props.label : props.icon
}

const { fieldComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {
    StrictInput: fieldComponent.strict()({
      component: Input,
      replaceProperty: 'field',
    }),
    LooseInput: fieldComponent.loose()({
      component: Input,
      replaceProperty: 'field',
    }),
  },
  formComponents: {},
})

function DiscriminatedFieldProps() {
  const form = useAppForm({ defaultValues: { name: '' } })

  return (
    <form.Field name="name">
      {(field) => (
        <>
          <field.StrictInput variant="label" label="Name" />
          <field.StrictInput variant="icon" icon="person" />
          <field.LooseInput variant="label" label="Name" />
          <field.LooseInput variant="icon" icon="person" />
          {/* @ts-expect-error the label variant requires its label */}
          <field.StrictInput variant="label" />
          {/* @ts-expect-error the icon variant requires its icon */}
          <field.StrictInput variant="icon" />
          {/* @ts-expect-error loose preparation preserves the required label */}
          <field.LooseInput variant="label" />
          {/* @ts-expect-error loose preparation preserves the required icon */}
          <field.LooseInput variant="icon" />
          {/* @ts-expect-error the label variant does not accept icon props */}
          <field.StrictInput variant="label" icon="person" />
          {/* @ts-expect-error the icon variant does not accept label props */}
          <field.LooseInput variant="icon" label="Name" />
          {/* @ts-expect-error the injected field prop is removed */}
          <field.StrictInput variant="label" label="Name" field={field} />
          {/* @ts-expect-error loose preparation also removes the injected prop */}
          <field.LooseInput variant="icon" icon="person" field={field} />
        </>
      )}
    </form.Field>
  )
}

void DiscriminatedFieldProps
