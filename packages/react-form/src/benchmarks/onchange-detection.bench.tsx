import { describe, bench } from 'vitest'

import { Field as HouseFormField, Form } from 'houseform'
import { z } from 'zod'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { Formik, Field as FormikField } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import type { FieldProps } from 'formik/dist/Field'
import { Controller, useForm as RHFUseForm } from 'react-hook-form'
import { useForm } from '../../src/useForm'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorMessage } from '@hookform/error-message'

const arr = Array.from({ length: 1000 }, (_, i) => i)

const TanStackFormOnChangeBenchmark = () => {
  let NEVER_TYPE: never
  const form = useForm()
  return (
    <form.Provider>
      <form {...form.getFormProps()}>
        {arr.map((num, i) => {
          return (
            <form.Field
              key={i}
              name={`num[${i}]` as never}
              onChange={(value) => NEVER_TYPE} //look at this
              // onChange={(value) =>
              //   !value
              //     ? 'A first name is required'
              //     : value.length < 3
              //     ? 'First name must be at least 3 characters'
              //     : undefined
              // }
              children={(field) => {
                return (
                  <div>
                    <input
                      name={field.name}
                      placeholder={`Number ${i}`}
                      data-testid={`value${i}`}
                      {...field.getInputProps()}
                    />
                    {/* How are validation errors handled? Didn't see any docs on that part */}
                  </div>
                )
              }}
            />
          )
        })}
      </form>
    </form.Provider>
  )
}

function HouseFormOnChangeBenchmark() {
  return (
    <Form>
      {() => (
        <>
          {arr.map((num, i) => {
            return (
              <HouseFormField
                key={i}
                name={`num[${i}]`}
                initialValue={num}
                onChangeValidate={z.number().min(3, 'Must be at least three')}
              >
                {({ value, setValue, onBlur, errors }) => {
                  return (
                    <div>
                      <input
                        data-testid={`value${i}`}
                        type="number"
                        value={value}
                        onBlur={onBlur}
                        onChange={(e) => setValue(e.target.valueAsNumber)}
                        placeholder={`Number ${i}`}
                      />
                      {errors.map((error) => (
                        <p key={error}>{error}</p>
                      ))}
                    </div>
                  )
                }}
              </HouseFormField>
            )
          })}
        </>
      )}
    </Form>
  )
}

function FormikOnChangeBenchmark() {
  return (
    <Formik
      validateOnChange={true}
      validateOnBlur={false}
      validateOnMount={false}
      initialValues={{
        num: arr,
      }}
      validationSchema={toFormikValidationSchema(
        z.object({
          num: z.array(z.number().min(3, 'Must be at least three')),
        }),
      )}
      onSubmit={() => {}}
    >
      {() => (
        <>
          {arr.map((num, i) => (
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

function ReactHookFormOnChangeBenchmark() {
  const {
    register,
    formState: { errors },
  } = RHFUseForm({
    defaultValues: {
      num: arr,
    },
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        num: z.array(z.number().min(3, 'Must be at least three')),
      }),
    ),
  })

  return (
    <>
      {arr.map((num, i) => {
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

function ReactHookFormHeadlessOnChangeBenchmark() {
  const { control, handleSubmit } = RHFUseForm({
    defaultValues: {
      num: arr,
    },
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        num: z.array(z.number().min(3, 'Must be at least three')),
      }),
    ),
  })

  return (
    <>
      {arr.map((num, i) => {
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

/**
 * @vitest-environment jsdom
 */
describe('Validates onChange on 1,000 form items', () => {
  bench(
    'TanStack Form',
    async () => {
      const { getByTestId, findAllByText, queryAllByText } = render(
        <TanStackFormOnChangeBenchmark />,
      )
      if (queryAllByText('Must be at least three').length) {
        throw 'Should not be present yet'
      }
      fireEvent.change(getByTestId('value1'), { target: { value: 0 } })
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
    'HouseForm',
    async () => {
      const { getByTestId, findAllByText, queryAllByText } = render(
        <HouseFormOnChangeBenchmark />,
      )
      if (queryAllByText('Must be at least three').length) {
        throw 'Should not be present yet'
      }
      fireEvent.change(getByTestId('value1'), { target: { value: 0 } })
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
        <FormikOnChangeBenchmark />,
      )
      if (queryAllByText('Must be at least three').length) {
        throw 'Should not be present yet'
      }
      fireEvent.change(getByTestId('value1'), { target: { value: 0 } })
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
        <ReactHookFormOnChangeBenchmark />,
      )
      if (queryAllByText('Must be at least three').length) {
        throw 'Should not be present yet'
      }
      fireEvent.change(getByTestId('value1'), { target: { value: 0 } })
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
        <ReactHookFormHeadlessOnChangeBenchmark />,
      )
      if (queryAllByText('Must be at least three').length) {
        throw 'Should not be present yet'
      }
      fireEvent.change(getByTestId('value1'), { target: { value: 0 } })
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
