import z from 'zod'
import { expectTypeOf } from 'vitest'
import React from 'react'
import { createFormHook, formOptions, useForm } from '../../../src'
import type {
  ReactFormType,
  StandardSchemaV1Issue,
  ValidationIssue,
} from '../../../src'

const formOpts = formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      run: (ctx) => {
        return ctx.createOutput({ foo: 'Custom data' })
      },
    },
    {
      run: z
        .object({
          name: z.string(),
        })
        .transform((obj) => ({ bar: obj.name })),
    },
    {
      run: (ctx) => {
        const result = z
          .object({
            name: z.string(),
          })
          .transform((obj) => obj.name.length)
          .safeParse(ctx.value)

        if (!result.success) return ctx.parseIssues(result.error.issues)

        return ctx.createOutput(result.data)
      },
    },
  ],
})

type MyForm = ReactFormType<typeof formOpts>

function Child(_props: { form: MyForm }) {
  return <></>
}

function Component() {
  const form = useForm({
    ...formOpts,
    onSubmit: (ctx) => {
      expectTypeOf(ctx.value).toEqualTypeOf<{ name: string }>()
      expectTypeOf(ctx.validatorOutputs).toEqualTypeOf<
        [{ foo: string }, { bar: string }, number]
      >()

      return ctx.createValidationError({ message: '' })
    },
  })

  return <Child form={form} />
}

// App-Form

const SubmitButton = () => null

const { appFormOptions, useAppForm } = createFormHook({
  fieldComponents: {},
  formComponents: { SubmitButton },
})

const appFormOpts = appFormOptions({
  defaultValues: { name: '' },
  validators: [
    {
      run: ({ value, createOutput }) => {
        if (Math.random() < 0.5) return 'Error'
        return createOutput({ foo: value.name })
      },
    },
    {
      run: z.object({ name: z.string() }).transform(({ name }) => ({
        bar: name,
      })),
    },
  ],
})

type MyAppForm = ReactFormType<typeof appFormOpts>

function AppChild(_props: { form: MyAppForm }) {
  return <></>
}

function AppComponent() {
  const form = useAppForm({
    ...appFormOpts,
    onSubmit: ({ validatorOutputs }) => {
      expectTypeOf(validatorOutputs).toEqualTypeOf<
        [{ foo: string } | undefined, { bar: string }]
      >()
    },
  })

  expectTypeOf(form.state.errors).toEqualTypeOf<
    Array<StandardSchemaV1Issue | ValidationIssue>
  >()

  return (
    <form.AppForm>
      <form.SubmitButton />
      <AppChild form={form} />
    </form.AppForm>
  )
}
