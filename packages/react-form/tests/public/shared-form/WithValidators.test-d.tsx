import { formOptions } from '@tanstack/form-core'
import z from 'zod'
import { expectTypeOf } from 'vitest'
import React from 'react'
import { useForm } from '../../../src'
import type { ReactFormType, StandardSchemaV1Issue } from '../../../src'

const defaultValues = {
  name: '',
}
const schema = z.object({
  name: z.string(),
})

const opts = formOptions({
  defaultValues,
  validators: [
    {
      run: schema,
    },
  ],
})

type Form = ReactFormType<typeof opts>

const optsStrict = formOptions.strictSchema(schema, {
  defaultValues: { name: '' },
  validators: [
    {
      run: schema,
    },
  ],
})

const optsLoose = formOptions.strictSchema(schema, {
  defaultValues,
  validators: [
    {
      run: schema,
    },
  ],
})

function Child1(_props: { form: Form }) {
  return <></>
}

function Component() {
  const form = useForm({
    ...opts,
    onSubmit: (ctx) => {
      expectTypeOf(ctx.validatorOutputs).toEqualTypeOf<[{ name: string }]>()
    },
  })

  const formLoose = useForm({
    ...optsLoose,
    onSubmit: (ctx) => {
      expectTypeOf(ctx.validatorOutputs).toEqualTypeOf<[{ name: string }]>()
    },
  })

  const formStrict = useForm({
    ...optsStrict,
    onSubmit: (ctx) => {
      expectTypeOf(ctx.validatorOutputs).toEqualTypeOf<[{ name: string }]>()
    },
  })

  expectTypeOf(form.state.errors).toEqualTypeOf<StandardSchemaV1Issue[]>()
  expectTypeOf(formLoose.state.errors).toEqualTypeOf<StandardSchemaV1Issue[]>()
  expectTypeOf(formStrict.state.errors).toEqualTypeOf<StandardSchemaV1Issue[]>()

  return (
    <>
      <Child1 form={form} />
      <Child1 form={formLoose} />
      <Child1 form={formStrict} />
    </>
  )
}
