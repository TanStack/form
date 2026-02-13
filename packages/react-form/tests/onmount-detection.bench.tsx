/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { bench, describe } from 'vitest'

import { z } from 'zod'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { Formik, Field as FormikField } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useForm as useTanStackForm } from '../src'
import type { FieldProps } from 'formik/dist/Field'

const arr = Array.from({ length: 100 }, (_, i) => i)

const validator = z.object({
  num: z.array(z.number().min(3, 'Must be at least three')),
})

function TanStackFormOnMountBenchmark() {
  const form = useTanStackForm({
    defaultValues: { num: arr },
    validators: {
      onMount: validator,
    },
  })

  return (
    <>
      {arr.map((_num, i) => {
        return (
          <form.Field key={i} name={`num[${i}]`}>
            {(field) => {
              return (
                <div>
                  <input
                    data-testid={`value${i}`}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                    placeholder={`Number ${i}`}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message}>{error?.message}</p>
                  ))}
                </div>
              )
            }}
          </form.Field>
        )
      })}
    </>
  )
}

function FormikOnMountBenchmark() {
  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={true}
      initialValues={{
        num: arr,
      }}
      validationSchema={toFormikValidationSchema(validator)}
      onSubmit={() => { }}
    >
      {() => (
        <>
          {arr.map((_num, i) => (
            <FormikField key={i} name={`num[${i}]`} data-testid={`value${i}`}>
              {(props: FieldProps) => (
                <div>
                  <input
                    data-testid={`value${i}`}
                    type="number"
                    name={props.field.name}
                    value={props.field.value}
                    onBlur={props.field.onBlur}
                    onChange={props.field.onChange}
                    placeholder={`Number ${i}`}
                  />
                  {props.meta.error}
                </div>
              )}
            </FormikField>
          ))}
        </>
      )}
    </Formik>
  )
}

describe('Validates onMount on 1,000 form items', () => {
  bench(
    'TanStack Form',
    async () => {
      const { findAllByText } = render(
        <TanStackFormOnMountBenchmark />,
      )

      await findAllByText('Must be at least three')
    },
    {
      setup(task) {
        task.opts.beforeEach = () => {
          cleanup()
        }
      },
    },
  )

  bench(
    'Formik',
    async () => {
      const { findAllByText } = render(
        <FormikOnMountBenchmark />,
      )

      await findAllByText('Must be at least three')
    },
    {
      setup(task) {
        task.opts.beforeEach = () => {
          cleanup()
        }
      },
    },
  )
})
