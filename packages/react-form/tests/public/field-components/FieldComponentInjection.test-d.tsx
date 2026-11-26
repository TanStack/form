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

fieldComponent.strict<number>()({
  component: StringField,
  // @ts-expect-error an explicit number field cannot be injected into a string prop
  replaceProperty: 'field',
})
fieldComponent.loose<number>()({
  component: StringField,
  // @ts-expect-error loose preparation also checks actual field API assignability
  replaceProperty: 'field',
})
fieldComponent.strict<'red' | 'blue'>()({
  component: StringField,
  // @ts-expect-error field API invariance rejects narrower string unions
  replaceProperty: 'field',
})
fieldComponent.loose<'red' | 'blue'>()({
  component: StringField,
  // @ts-expect-error loose preparation preserves field API invariance
  replaceProperty: 'field',
})
fieldComponent.strict<number>()({
  component: UnknownField,
  // @ts-expect-error a number field is not an unknown-valued field API
  replaceProperty: 'field',
})
fieldComponent.loose<number>()({
  component: UnknownField,
  // @ts-expect-error loose preparation does not bypass unknown field API invariance
  replaceProperty: 'field',
})
fieldComponent.strict<unknown>()({
  component: StringField,
  // @ts-expect-error explicit unknown cannot be injected into a string field prop
  replaceProperty: 'field',
})
fieldComponent.loose<unknown>()({
  component: StringField,
  // @ts-expect-error explicit unknown cannot be injected into a string field prop
  replaceProperty: 'field',
})
// @ts-expect-error a union-valued field does not satisfy separate field APIs
fieldComponent.strict()({ component: SeparateFields, replaceProperty: 'field' })
// @ts-expect-error inferred loose preparation also checks full field assignability
fieldComponent.loose()({ component: SeparateFields, replaceProperty: 'field' })
fieldComponent.strict<string | number>()({
  component: SeparateFields,
  // @ts-expect-error an explicit union-valued field does not satisfy separate APIs
  replaceProperty: 'field',
})
fieldComponent.loose<string | number>()({
  component: SeparateFields,
  // @ts-expect-error an explicit loose union field does not satisfy separate APIs
  replaceProperty: 'field',
})
// @ts-expect-error the selected prop must exist
fieldComponent.strict()({ component: StringField, replaceProperty: 'missing' })
// @ts-expect-error the selected prop must exist
fieldComponent.loose()({ component: StringField, replaceProperty: 'missing' })
fieldComponent.strict<string>()({
  component: StringField,
  // @ts-expect-error ordinary props are not fields
  replaceProperty: 'label',
})
fieldComponent.loose<string>()({
  component: StringField,
  // @ts-expect-error ordinary props are not fields
  replaceProperty: 'label',
})
// @ts-expect-error a value property alone does not identify a field API
fieldComponent.strict()({ component: NonFieldProps, replaceProperty: 'value' })
// @ts-expect-error a value property alone does not identify a field API
fieldComponent.loose()({ component: NonFieldProps, replaceProperty: 'value' })
// @ts-expect-error plain any provides no evidence of a field API
fieldComponent.strict()({ component: NonFieldProps, replaceProperty: 'extra' })
// @ts-expect-error plain any provides no evidence of a field API
fieldComponent.loose()({ component: NonFieldProps, replaceProperty: 'extra' })

const invalidFieldOptions = {
  component: StringField,
  replaceProperty: 'label' as const,
}
// @ts-expect-error an invalid replacement cannot fall through to component-only registration
fieldComponent.strict()(invalidFieldOptions)
// @ts-expect-error loose registration must reject the same invalid replacement
fieldComponent.loose()(invalidFieldOptions)

const textFieldOptions = {
  component: DifferentFields,
  replaceProperty: 'text' as const,
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    StrictText: fieldComponent.strict()(textFieldOptions),
    LooseText: fieldComponent.loose()(textFieldOptions),
    StrictCount: fieldComponent.strict()({
      replaceProperty: 'count',
      component: DifferentFields,
    }),
    LooseCount: fieldComponent.loose()({
      replaceProperty: 'count',
      component: DifferentFields,
    }),
    ExplicitStrict: fieldComponent.strict<string>()({
      component: DifferentFields,
    }),
    ExplicitLoose: fieldComponent.loose<string>()({
      component: DifferentFields,
    }),
    RebrandedStrict: fieldComponent.strict<number>()({
      component: StringField,
    }),
    RebrandedLoose: fieldComponent.loose<number>()({ component: StringField }),
    StrictSeparate: fieldComponent.strict<string>()({
      component: SeparateFields,
      replaceProperty: 'field',
    }),
    LooseSeparate: fieldComponent.loose<string>()({
      component: SeparateFields,
      replaceProperty: 'field',
    }),
    StrictNonField: fieldComponent.strict()({ component: NonFieldProps }),
    LooseNonField: fieldComponent.loose()({ component: NonFieldProps }),
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
