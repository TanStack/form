import React from 'react'
import { expectTypeOf } from 'vitest'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { FieldWithValue } from '../../../src'

function TextInput(props: { field: FieldWithValue<string>; label: string }) {
  return props.label
}

function Summary<TValue>(props: {
  source: FieldWithValue<TValue>
  label: string
}) {
  return props.label
}

function Choices<TValue extends string>(props: {
  field: FieldWithValue<TValue>
  options: ReadonlyArray<NoInfer<TValue>>
  onSelect: (value: NoInfer<TValue>) => void
}) {
  return props.field.value
}

const { fieldComponent } = getFormHookHelpers()
const InjectedText = fieldComponent.strict()(TextInput, 'field')
const InjectedSummary = fieldComponent.loose()(Summary, 'source')
const BrandedText = fieldComponent.strict<string>()(TextInput)
const BrandedSummary = fieldComponent.loose<unknown>()(Summary)
const GenericChoices = fieldComponent.loose<string>()(Choices)
const ExactChoices = fieldComponent.strict<'red' | 'blue'>()(Choices)

expectTypeOf<Parameters<typeof InjectedText>[0]>().toEqualTypeOf<{
  label: string
}>()
expectTypeOf<Parameters<typeof BrandedText>[0]>().toEqualTypeOf<{
  field: FieldWithValue<string>
  label: string
}>()
expectTypeOf(GenericChoices).toMatchTypeOf<typeof Choices>()

// @ts-expect-error injection requires the field prop name
fieldComponent.strict()(TextInput)
// @ts-expect-error the selected prop must accept a field API
fieldComponent.loose()(Summary, 'label')
// @ts-expect-error an explicit value type selects branding without injection
fieldComponent.strict<string>()(TextInput, 'field')

const { useAppForm } = createFormHook({
  fieldComponents: {
    InjectedText,
    InjectedSummary,
    BrandedText,
    BrandedSummary,
    GenericChoices,
    InlineGenericChoices: fieldComponent.loose<string>()(Choices),
    ExactChoices,
  },
  formComponents: {},
})

function FieldComponentTypes() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      color: 'red' as 'red' | 'blue',
      count: 0,
    },
  })

  return (
    <>
      <form.Field name="name">
        {(field) => (
          <>
            <field.InjectedText label="Name" />
            <field.InjectedSummary label="Summary" />
            <field.BrandedText field={field} label="Name" />
            <field.BrandedSummary source={field} label="Summary" />
            {/* @ts-expect-error other required props are preserved */}
            <field.InjectedText />
            {/* @ts-expect-error the injected prop is removed */}
            <field.InjectedText field={field} label="Name" />
            {/* @ts-expect-error branding preserves the required field prop */}
            <field.BrandedText label="Name" />
            {/* @ts-expect-error an exact union brand excludes broader string fields */}
            <field.ExactChoices
              field={field}
              options={[]}
              onSelect={() => {}}
            />
          </>
        )}
      </form.Field>
      <form.Field name="color">
        {(field) => (
          <>
            <field.GenericChoices
              field={field}
              options={['red', 'blue']}
              onSelect={(value) => {
                expectTypeOf(value).toEqualTypeOf<'red' | 'blue'>()
              }}
            />
            <field.ExactChoices
              field={field}
              options={['red']}
              onSelect={(value) => {
                expectTypeOf(value).toEqualTypeOf<'red' | 'blue'>()
              }}
            />
            <field.InlineGenericChoices
              field={field}
              options={['blue']}
              onSelect={(value) => {
                expectTypeOf(value).toEqualTypeOf<'red' | 'blue'>()
              }}
            />
            <field.GenericChoices
              field={field}
              // @ts-expect-error generic inference still constrains other props
              options={['green']}
              onSelect={() => {}}
            />
            {/* @ts-expect-error exact string injection excludes narrower unions */}
            <field.InjectedText label="Color" />
            {/* @ts-expect-error exact string branding excludes narrower unions */}
            <field.BrandedText field={field} label="Color" />
          </>
        )}
      </form.Field>
      <form.Field name="count">
        {(field) => (
          <>
            <field.InjectedSummary label="Summary" />
            <field.BrandedSummary source={field} label="Summary" />
            {/* @ts-expect-error string injection excludes number fields */}
            <field.InjectedText label="Count" />
            {/* @ts-expect-error string branding excludes number fields */}
            <field.BrandedText field={field} label="Count" />
            {/* @ts-expect-error loose string branding excludes number fields */}
            <field.GenericChoices
              field={field}
              options={[]}
              onSelect={() => {}}
            />
          </>
        )}
      </form.Field>
    </>
  )
}

void FieldComponentTypes
