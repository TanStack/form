/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { bench, describe } from 'vitest'

import { z } from 'zod'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { Formik, Field as FormikField } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Controller, useForm as useReactHookForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@hookform/error-message'
import { useForm as useTanStackForm } from '../src'
import type { FieldProps } from 'formik/dist/Field'

const arr = Array.from({ length: 100 }, (_, i) => i)

const validator = z.object({
  num: z.array(z.number().min(3, 'Must be at least three')),
})

function TanStackFormOnBlurBenchmark() {
  const form = useTanStackForm({
    defaultValues: { num: arr },
    validators: {
      onBlur: validator,
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

function FormikOnBlurBenchmark() {
  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={true}
      validateOnMount={false}
      initialValues={{
        num: arr,
      }}
      validationSchema={toFormikValidationSchema(validator)}
      onSubmit={() => {}}
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

function ReactHookFormOnBlurBenchmark() {
  const {
    register,
    formState: { errors },
  } = useReactHookForm({
    defaultValues: {
      num: arr,
    },
    mode: 'onBlur',
    resolver: zodResolver(validator),
  })

  return (
    <>
      {arr.map((_num, i) => {
        return (
          <div key={i}>
            <input
              data-testid={`value${i}`}
              {...register(`num.${i}`, { valueAsNumber: true })}
              type="number"
              placeholder={`Number ${i}`}
            />
            <ErrorMessage errors={errors} name={`num.${i}`} />
          </div>
        )
      })}
    </>
  )
}

function ReactHookFormHeadlessOnBlurBenchmark() {
  const { control, handleSubmit } = useReactHookForm({
    defaultValues: {
      num: arr,
    },
    mode: 'onBlur',
    resolver: zodResolver(validator),
  })

  return (
    <>
      {arr.map((_num, i) => {
        return (
          <Controller
            key={i}
            control={control}
            render={({
              field: { value, onBlur, onChange },
              fieldState: { error },
            }) => {
              return (
                <div>
                  <input
                    data-testid={`value${i}`}
                    type="number"
                    value={value}
                    onBlur={onBlur}
                    onChange={(event) => onChange(event.target.valueAsNumber)}
                    placeholder={`Number ${i}`}
                  />
                  {error && <p>{error.message}</p>}
                </div>
              )
            }}
            name={`num.${i}`}
          />
        )
      })}
    </>
  )
}

describe('Validates onBlur on 1,000 form items', () => {
  bench(
    'TanStack Form',
    async () => {
      const { getByTestId, findAllByText, queryAllByText } = render(
        <TanStackFormOnBlurBenchmark />,
      )

      if (queryAllByText('Must be at least three')?.length) {
        throw 'Should not be present yet'
      }

      fireEvent.blur(getByTestId('value1'))

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
      const { getByTestId, findAllByText, queryAllByText } = render(
        <FormikOnBlurBenchmark />,
      )

      if (queryAllByText('Must be at least three')?.length) {
        throw 'Should not be present yet'
      }

      fireEvent.blur(getByTestId('value1'))

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
    'React Hook Form',
    async () => {
      const { getByTestId, findAllByText, queryAllByText } = render(
        <ReactHookFormOnBlurBenchmark />,
      )

      if (queryAllByText('Must be at least three')?.length) {
        throw 'Should not be present yet'
      }

      fireEvent.blur(getByTestId('value1'))

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
    'React Hook Form (Headless)',
    async () => {
      const { getByTestId, findAllByText, queryAllByText } = render(
        <ReactHookFormHeadlessOnBlurBenchmark />,
      )

      if (queryAllByText('Must be at least three')?.length) {
        throw 'Should not be present yet'
      }

      fireEvent.blur(getByTestId('value1'))

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
