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
  onValue?: (value: NoInfer<TValue>) => void
}) {
  return props.label
}

function DefaultSummary<TValue = string>(props: {
  source: FieldWithValue<TValue>
  label: string
  onValue: (value: NoInfer<TValue>) => void
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
const InferredText = fieldComponent.strict()(TextInput)
const LooseText = fieldComponent.loose()(TextInput)
const ExplicitInjectedText = fieldComponent.strict<string>()(TextInput, 'field')
const ExplicitLooseText = fieldComponent.loose<string>()(TextInput, 'field')
const InferredSummary = fieldComponent.loose()(Summary)
const StrictSummary = fieldComponent.strict()(Summary)
const InferredChoices = fieldComponent.loose()(Choices)
const StrictChoices = fieldComponent.strict()(Choices)
const InferredDefaultSummary = fieldComponent.loose()(DefaultSummary)
const StrictDefaultSummary = fieldComponent.strict()(DefaultSummary)

expectTypeOf<Parameters<typeof InjectedText>[0]>().toEqualTypeOf<{
  label: string
}>()
expectTypeOf<Parameters<typeof BrandedText>[0]>().toEqualTypeOf<{
  field: FieldWithValue<string>
  label: string
}>()
expectTypeOf(GenericChoices).toMatchTypeOf<typeof Choices>()

// @ts-expect-error the selected prop must accept a field API
fieldComponent.loose()(Summary, 'label')

const { useAppForm } = createFormHook({
  fieldComponents: {
    InjectedText,
    InjectedSummary,
    BrandedText,
    BrandedSummary,
    GenericChoices,
    InlineGenericChoices: fieldComponent.loose<string>()(Choices),
    ExactChoices,
    InferredText,
    LooseText,
    ExplicitInjectedText,
    ExplicitLooseText,
    InferredSummary,
    StrictSummary,
    InferredChoices,
    StrictChoices,
    InferredDefaultSummary,
    StrictDefaultSummary,
    InlineInferredChoices: fieldComponent.loose()(Choices),
  },
  formComponents: {},
})

function FieldComponentTypes() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      color: 'red' as 'red' | 'blue',
      count: 0,
      unknown: undefined as unknown,
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
            <field.InferredText field={field} label="Name" />
            <field.LooseText field={field} label="Name" />
            <field.ExplicitInjectedText label="Name" />
            <field.ExplicitLooseText label="Name" />
            <field.StrictChoices
              field={field}
              options={['red']}
              onSelect={(value) => {
                expectTypeOf(value).toEqualTypeOf<string>()
              }}
            />
            {/* @ts-expect-error inferred branding preserves the field prop */}
            <field.InferredText label="Name" />
            {/* @ts-expect-error explicit injection preserves other required props */}
            <field.ExplicitInjectedText />
            {/* @ts-expect-error explicit injection removes the selected prop */}
            <field.ExplicitLooseText field={field} label="Name" />
            {/* @ts-expect-error an unconstrained generic supplies an unknown strict brand */}
            <field.StrictSummary source={field} label="Summary" />
            {/* @ts-expect-error a generic default does not supply a string brand */}
            <field.StrictDefaultSummary
              source={field}
              label="Summary"
              onValue={() => {}}
            />
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
            <field.InferredChoices
              field={field}
              options={['red']}
              onSelect={(value) => {
                expectTypeOf(value).toEqualTypeOf<'red' | 'blue'>()
              }}
            />
            <field.InlineInferredChoices
              field={field}
              options={['blue']}
              onSelect={(value) => {
                expectTypeOf(value).toEqualTypeOf<'red' | 'blue'>()
              }}
            />
            <field.ExplicitLooseText label="Color" />
            <field.InferredChoices
              field={field}
              // @ts-expect-error inferred branding preserves generic relationships
              options={['green']}
              onSelect={() => {}}
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
        {(field) => {
          expectTypeOf(field).not.toHaveProperty('InferredText')
          expectTypeOf(field).not.toHaveProperty('LooseText')

          return (
            <>
              <field.InjectedSummary label="Summary" />
              <field.BrandedSummary source={field} label="Summary" />
              <field.InferredSummary
                source={field}
                label="Summary"
                onValue={(value) => {
                  expectTypeOf(value).toEqualTypeOf<number>()
                }}
              />
              <field.InferredDefaultSummary
                source={field}
                label="Summary"
                onValue={(value) => {
                  expectTypeOf(value).toEqualTypeOf<number>()
                }}
              />
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
          )
        }}
      </form.Field>
      <form.Field name="unknown">
        {(field) => (
          <>
            <field.StrictSummary source={field} label="Summary" />
            <field.StrictDefaultSummary
              source={field}
              label="Summary"
              onValue={(value) => {
                expectTypeOf(value).toEqualTypeOf<unknown>()
              }}
            />
            <field.ExplicitInjectedText label="Unknown target" />
          </>
        )}
      </form.Field>
    </>
  )
}

void FieldComponentTypes
