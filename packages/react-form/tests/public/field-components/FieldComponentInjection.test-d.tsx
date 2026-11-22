import React from 'react'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { FieldWithValue } from '../../../src'

function DifferentFields(props: {
  text: FieldWithValue<string>
  count: FieldWithValue<number>
  label: string
}) {
  return props.label
}

function StringField(props: { field: FieldWithValue<string>; label: string }) {
  return props.label
}

function UnknownField(props: { field: FieldWithValue<unknown> }) {
  return String(props.field.value)
}

function SeparateFields(props: {
  field: FieldWithValue<string> | FieldWithValue<number>
}) {
  return String(props.field.value)
}

function NonFieldProps(props: { value: { value: string }; extra: any }) {
  return props.value.value
}

const { fieldComponent } = getFormHookHelpers()

// @ts-expect-error an explicit number field cannot be injected into a string prop
fieldComponent.strict<number>()(StringField, 'field')
// @ts-expect-error loose preparation also checks actual field API assignability
fieldComponent.loose<number>()(StringField, 'field')
// @ts-expect-error field API invariance rejects narrower string unions
fieldComponent.strict<'red' | 'blue'>()(StringField, 'field')
// @ts-expect-error loose preparation preserves field API invariance
fieldComponent.loose<'red' | 'blue'>()(StringField, 'field')
// @ts-expect-error a number field is not an unknown-valued field API
fieldComponent.strict<number>()(UnknownField, 'field')
// @ts-expect-error loose preparation does not bypass unknown field API invariance
fieldComponent.loose<number>()(UnknownField, 'field')
// @ts-expect-error explicit unknown cannot be injected into a string field prop
fieldComponent.strict<unknown>()(StringField, 'field')
// @ts-expect-error explicit unknown cannot be injected into a string field prop
fieldComponent.loose<unknown>()(StringField, 'field')
// @ts-expect-error a union-valued field does not satisfy separate field APIs
fieldComponent.strict()(SeparateFields, 'field')
// @ts-expect-error inferred loose preparation also checks full field assignability
fieldComponent.loose()(SeparateFields, 'field')
// @ts-expect-error an explicit union-valued field does not satisfy separate APIs
fieldComponent.strict<string | number>()(SeparateFields, 'field')
// @ts-expect-error an explicit loose union field does not satisfy separate APIs
fieldComponent.loose<string | number>()(SeparateFields, 'field')
// @ts-expect-error the selected prop must exist
fieldComponent.strict()(StringField, 'missing')
// @ts-expect-error the selected prop must exist
fieldComponent.loose()(StringField, 'missing')
// @ts-expect-error ordinary props are not fields
fieldComponent.strict<string>()(StringField, 'label')
// @ts-expect-error ordinary props are not fields
fieldComponent.loose<string>()(StringField, 'label')
// @ts-expect-error a value property alone does not identify a field API
fieldComponent.strict()(NonFieldProps, 'value')
// @ts-expect-error a value property alone does not identify a field API
fieldComponent.loose()(NonFieldProps, 'value')
// @ts-expect-error plain any provides no evidence of a field API
fieldComponent.strict()(NonFieldProps, 'extra')
// @ts-expect-error plain any provides no evidence of a field API
fieldComponent.loose()(NonFieldProps, 'extra')

const { useAppForm } = createFormHook({
  fieldComponents: {
    StrictText: fieldComponent.strict()(DifferentFields, 'text'),
    LooseText: fieldComponent.loose()(DifferentFields, 'text'),
    StrictCount: fieldComponent.strict()(DifferentFields, 'count'),
    LooseCount: fieldComponent.loose()(DifferentFields, 'count'),
    ExplicitStrict: fieldComponent.strict<string>()(DifferentFields),
    ExplicitLoose: fieldComponent.loose<string>()(DifferentFields),
    RebrandedStrict: fieldComponent.strict<number>()(StringField),
    RebrandedLoose: fieldComponent.loose<number>()(StringField),
    StrictSeparate: fieldComponent.strict<string>()(SeparateFields, 'field'),
    LooseSeparate: fieldComponent.loose<string>()(SeparateFields, 'field'),
    StrictNonField: fieldComponent.strict()(NonFieldProps),
    LooseNonField: fieldComponent.loose()(NonFieldProps),
  },
  formComponents: {},
})

function FieldComponentInjection() {
  const form = useAppForm({ defaultValues: { text: '', count: 0 } })

  return (
    <form.Field name="text">
      {(text) => (
        <form.Field name="count">
          {(count) => (
            <>
              <text.StrictText count={count} label="Text" />
              <text.LooseText count={count} label="Text" />
              <count.StrictCount text={text} label="Count" />
              <count.LooseCount text={text} label="Count" />
              <text.ExplicitStrict text={text} count={count} label="Text" />
              <text.ExplicitLoose text={text} count={count} label="Text" />
              <count.RebrandedStrict field={text} label="Text on count" />
              <count.RebrandedLoose field={text} label="Text on count" />
              <text.StrictSeparate />
              <text.LooseSeparate />
              <text.LooseNonField value={{ value: 'Text' }} extra={0} />
              {/* @ts-expect-error non-field props and plain any infer unknown */}
              <text.StrictNonField value={{ value: 'Text' }} extra={0} />
              {/* @ts-expect-error selected text prop determines the brand */}
              <count.StrictText count={count} label="Count" />
              {/* @ts-expect-error selected count prop determines the loose brand */}
              <text.LooseCount text={text} label="Text" />
              {/* @ts-expect-error other field props remain required */}
              <text.StrictText label="Text" />
              {/* @ts-expect-error the selected field prop is removed */}
              <count.LooseCount count={count} text={text} label="Count" />
              {/* @ts-expect-error explicit branding preserves required props */}
              <count.RebrandedStrict label="Count" />
              <count.RebrandedLoose
                // @ts-expect-error the preserved prop still requires a string field
                field={count}
                label="Count"
              />
            </>
          )}
        </form.Field>
      )}
    </form.Field>
  )
}

void FieldComponentInjection
