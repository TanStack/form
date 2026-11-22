import React from 'react'
import { expectTypeOf } from 'vitest'
import { createFormHook, getFormHookHelpers } from '../../../src'
import type { FieldWithValue } from '../../../src'

function Description(props: { label: string }) {
  return props.label
}

function OptionalText(props: {
  source?: FieldWithValue<string> | null
  label: string
}) {
  return props.label
}

function TextWithAnyProp(props: {
  field: FieldWithValue<string>
  extra: any
  label: string
}) {
  return props.label
}

function AnyField(props: { field: FieldWithValue<any>; label: string }) {
  return props.label
}

function AgreeingFields(props: {
  first: FieldWithValue<string>
  second?: FieldWithValue<string> | null
  label: string
}) {
  return props.label
}

function UnionValue(props: { field: FieldWithValue<string | number> }) {
  return String(props.field.value)
}

function NullableValue(props: {
  field: FieldWithValue<string | null | undefined>
}) {
  return props.field.value
}

const { fieldComponent } = getFormHookHelpers()
const { useAppForm } = createFormHook({
  fieldComponents: {
    StrictDescription: fieldComponent.strict()(Description),
    LooseDescription: fieldComponent.loose()(Description),
    StrictNumberDescription: fieldComponent.strict<number>()(Description),
    LooseNumberDescription: fieldComponent.loose<number>()(Description),
    StrictOptional: fieldComponent.strict()(OptionalText),
    LooseOptional: fieldComponent.loose()(OptionalText),
    StrictInjectedOptional: fieldComponent.strict()(OptionalText, 'source'),
    LooseInjectedOptional: fieldComponent.loose()(OptionalText, 'source'),
    StrictExplicitOptional: fieldComponent.strict<string>()(
      OptionalText,
      'source',
    ),
    LooseExplicitOptional: fieldComponent.loose<string>()(
      OptionalText,
      'source',
    ),
    StrictUnknown: fieldComponent.strict<unknown>()(OptionalText),
    LooseUnknown: fieldComponent.loose<unknown>()(OptionalText),
    StrictWithAny: fieldComponent.strict()(TextWithAnyProp),
    LooseWithAny: fieldComponent.loose()(TextWithAnyProp),
    StrictAny: fieldComponent.strict()(AnyField),
    LooseAny: fieldComponent.loose()(AnyField),
    StrictAnyField: fieldComponent.strict()(AnyField, 'field'),
    LooseAnyField: fieldComponent.loose()(AnyField, 'field'),
    StrictAgreeing: fieldComponent.strict()(AgreeingFields),
    LooseAgreeing: fieldComponent.loose()(AgreeingFields),
    StrictUnion: fieldComponent.strict()(UnionValue),
    LooseUnion: fieldComponent.loose()(UnionValue),
    StrictInjectedUnion: fieldComponent.strict()(UnionValue, 'field'),
    LooseInjectedUnion: fieldComponent.loose()(UnionValue, 'field'),
    StrictNullableValue: fieldComponent.strict()(NullableValue),
    LooseNullableValue: fieldComponent.loose()(NullableValue),
    StrictInjectedNullableValue: fieldComponent.strict()(
      NullableValue,
      'field',
    ),
  },
  formComponents: {},
})

function FieldComponentInference() {
  const form = useAppForm({
    defaultValues: {
      text: '',
      count: 0,
      mixed: '' as string | number,
      nullable: undefined as string | null | undefined,
      unknown: undefined as unknown,
    },
  })

  return (
    <>
      <form.Field name="text">
        {(field) => (
          <>
            <field.LooseDescription label="Description" />
            <field.StrictOptional source={field} label="Text" />
            <field.LooseOptional source={null} label="Text" />
            <field.StrictInjectedOptional label="Text" />
            <field.LooseInjectedOptional label="Text" />
            <field.StrictExplicitOptional label="Text" />
            <field.LooseExplicitOptional label="Text" />
            <field.LooseUnknown source={field} label="Text" />
            <field.StrictWithAny field={field} extra={0} label="Text" />
            <field.LooseWithAny field={field} extra={0} label="Text" />
            <field.StrictAny field={field} label="Text" />
            <field.LooseAny field={field} label="Text" />
            <field.StrictAnyField label="Text" />
            <field.LooseAnyField label="Text" />
            <field.StrictAgreeing first={field} second={field} label="Text" />
            <field.LooseAgreeing first={field} label="Text" />
            <field.LooseInjectedUnion />
            {/* @ts-expect-error strict unknown fallback excludes string fields */}
            <field.StrictDescription label="Description" />
            {/* @ts-expect-error explicit unknown overrides inferred string */}
            <field.StrictUnknown source={field} label="Text" />
            {/* @ts-expect-error strict union branding excludes a string field */}
            <field.StrictInjectedUnion />
            {/* @ts-expect-error value nullability is retained in the strict brand */}
            <field.StrictInjectedNullableValue />
            {/* @ts-expect-error optional field injection removes the selected prop */}
            <field.StrictInjectedOptional source={field} label="Text" />
            {/* @ts-expect-error unrelated required props remain required */}
            <field.LooseInjectedOptional />
          </>
        )}
      </form.Field>
      <form.Field name="count">
        {(field) => {
          expectTypeOf(field).not.toHaveProperty('StrictWithAny')
          expectTypeOf(field).not.toHaveProperty('LooseWithAny')
          expectTypeOf(field).not.toHaveProperty('StrictAgreeing')
          expectTypeOf(field).not.toHaveProperty('LooseAgreeing')

          return (
            <>
              <field.LooseDescription label="Description" />
              <field.StrictNumberDescription label="Count" />
              <field.LooseNumberDescription label="Count" />
              <field.LooseUnknown label="Count" />
              <field.StrictAnyField label="Count" />
              <field.LooseAnyField label="Count" />
              <field.LooseInjectedUnion />
              {/* @ts-expect-error strict unknown fallback excludes number fields */}
              <field.StrictDescription label="Count" />
              {/* @ts-expect-error optional field props still infer string */}
              <field.StrictOptional label="Count" />
              {/* @ts-expect-error nullable field props still infer string */}
              <field.LooseOptional label="Count" />
            </>
          )
        }}
      </form.Field>
      <form.Field name="mixed">
        {(field) => (
          <>
            <field.StrictUnion field={field} />
            <field.LooseUnion field={field} />
            <field.StrictInjectedUnion />
            <field.LooseInjectedUnion />
          </>
        )}
      </form.Field>
      <form.Field name="nullable">
        {(field) => (
          <>
            <field.StrictNullableValue field={field} />
            <field.LooseNullableValue field={field} />
            <field.StrictInjectedNullableValue />
          </>
        )}
      </form.Field>
      <form.Field name="unknown">
        {(field) => (
          <>
            <field.StrictDescription label="Unknown" />
            <field.StrictUnknown label="Unknown" />
            <field.StrictNumberDescription label="Unknown target" />
          </>
        )}
      </form.Field>
    </>
  )
}

void FieldComponentInference
