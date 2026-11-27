import React from 'react'
import { expectTypeOf } from 'vitest'
import { formOptions, useForm } from '../../../src'
import type { ReactFormType, ValidationIssue } from '../../../src'

const sharedOptions = formOptions({
  defaultValues: { name: '' },
})

type SharedForm = ReactFormType<typeof sharedOptions>

function SharedErrors({ form }: { form: SharedForm }) {
  expectTypeOf(form.state.errors).toEqualTypeOf<Array<ValidationIssue>>()

  return (
    <form.Subscribe selector={(state) => state.errors}>
      {(errors) => {
        expectTypeOf(errors).toEqualTypeOf<Array<ValidationIssue>>()
        return <span>{errors[0]?.message}</span>
      }}
    </form.Subscribe>
  )
}

export function SharedSubmitErrors() {
  const form = useForm({
    ...sharedOptions,
    defaultValues: { name: 'Loaded name' },
    onSubmit: ({ createValidationError }) =>
      createValidationError({
        form: { message: '', code: 'query' as const },
        fields: { name: { message: '', code: 'name' as const } },
      }),
  })

  expectTypeOf(form).toExtend<SharedForm>()
  expectTypeOf(form.state.errors).toEqualTypeOf<
    Array<{ message: string; code: 'query' }>
  >()

  return <SharedErrors form={form} />
}
