import React from 'react'
import { expectTypeOf } from 'vitest'
import { formOptions, useForm } from '../../../src'
import type { ReactFormType, ValidationIssue } from '../../../src'

const formOpts = formOptions({
  defaultValues: { name: '' },
})

type MyForm = ReactFormType<typeof formOpts>

function Child({ form }: { form: MyForm }) {
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

function Component() {
  const form = useForm({
    ...formOpts,
    defaultValues: { name: 'Loaded name' },
    onSubmit: ({ createValidationError }) =>
      createValidationError({
        form: { message: '', code: 'query' as const },
        fields: { name: { message: '', code: 'name' as const } },
      }),
  })

  expectTypeOf(form.state.errors).toEqualTypeOf<
    Array<{ message: string; code: 'query' }>
  >()

  return <Child form={form} />
}
