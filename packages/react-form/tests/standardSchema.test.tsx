import { expect, it } from 'vitest'
import { render } from '@testing-library/react'
import * as v from 'valibot'
import * as z from 'zod'
import userEvent from '@testing-library/user-event'
import { useForm } from '../src/useForm'
import type { JSX } from 'react'

it('should canSubmit with valibot variant schema', async () => {
  const schema = v.variant('aOrB', [
    v.object({
      aOrB: v.literal('a'),
      a: v.pipe(v.string(), v.nonEmpty()),
      b: v.pipe(
        v.any(),
        v.transform(() => undefined),
      ),
    }),
    v.object({
      aOrB: v.literal('b'),
      b: v.pipe(v.string(), v.nonEmpty()),
      a: v.pipe(
        v.any(),
        v.transform(() => undefined),
      ),
    }),
  ])

  const Component = () => {
    const form = useForm({
      defaultValues: {
        aOrB: 'a',
        a: '', // invalid initial value
        b: '', // invalid initial value
      },
      validators: {
        onMount: schema,
        onChange: schema,
      },
    })

    return (
      <>
        <form.Field name="aOrB">
          {(field) => (
            <>
              <input
                title={`${field.name} value`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <input
                title={`${field.name} isValid`}
                value={field.state.meta.isValid ? 'true' : 'false'}
                readOnly
              />
            </>
          )}
        </form.Field>
        <form.Field name="a">
          {(field) => (
            <>
              <input
                title={`${field.name} value`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <input
                title={`${field.name} isValid`}
                value={field.state.meta.isValid ? 'true' : 'false'}
                readOnly
              />
            </>
          )}
        </form.Field>
        <form.Field name="b">
          {(field) => (
            <>
              <input
                title={`${field.name} value`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <input
                title={`${field.name} isValid`}
                value={field.state.meta.isValid ? 'true' : 'false'}
                readOnly
              />
            </>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.isValid, state.canSubmit] as const}
        >
          {([isValid, canSubmit]) => (
            <>
              <input
                title="form isValid"
                value={isValid ? 'true' : 'false'}
                readOnly
              />
              <input
                title="form canSubmit"
                value={canSubmit ? 'true' : 'false'}
              />
            </>
          )}
        </form.Subscribe>
      </>
    )
  }

  const { getByTitle, user } = setup(<Component />)

  function getInput(name: string) {
    return getByTitle(name) as HTMLInputElement
  }

  // check initial values
  expect.soft(getInput('form isValid').value).toBe('false')
  expect.soft(getInput('form canSubmit').value).toBe('false')

  // choose option "b" and make "b" valid
  await user.clear(getInput('aOrB value'))
  await user.type(getInput('aOrB value'), 'b')
  await user.type(getInput('b value'), 'foobar') // valid input for "b"

  // check that values are as expected on the Field-level
  expect.soft(getInput('aOrB value').value).toBe('b')
  expect.soft(getInput('aOrB isValid').value).toBe('true')
  expect.soft(getInput('a value').value).toBe('')
  expect
    .soft(getInput('a isValid').value, "expect field 'a' to be isValid")
    .toBe('true') // as we chose "b" option, the value of "a" can be "any"thing
  expect.soft(getInput('b value').value).toBe('foobar')
  expect.soft(getInput('b isValid').value).toBe('true') // "b" is valid now, as it's not empty anymore

  // check the state on the Form-level
  expect
    .soft(getInput('form isValid').value, 'expect form.isValid to be true')
    .toBe('true')
  expect
    .soft(getInput('form canSubmit').value, 'expect form.canSubmit to be true')
    .toBe('true')
})

it('should canSubmit with zod variant schema', async () => {
  const schema = z.discriminatedUnion('aOrB', [
    z.object({
      aOrB: z.literal('a'),
      a: z.string().min(1),
      b: z.any(),
    }),
    z.object({
      aOrB: z.literal('b'),
      b: z.string().min(1),
      a: z.any(),
    }),
  ])

  type Schema = z.input<typeof schema>

  const Component = () => {
    const form = useForm({
      defaultValues: {
        aOrB: 'a',
        a: '', // invalid initial value
        b: '', // invalid initial value
      } as Schema,
      validators: {
        onMount: schema,
        onChange: schema,
      },
    })

    return (
      <>
        <form.Field name="aOrB">
          {(field) => (
            <>
              <input
                title={`${field.name} value`}
                value={field.state.value}
                // @ts-expect-error - only "a" or "b" are valid values, not any string
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <input
                title={`${field.name} isValid`}
                value={field.state.meta.isValid ? 'true' : 'false'}
                readOnly
              />
            </>
          )}
        </form.Field>
        <form.Field name="a">
          {(field) => (
            <>
              <input
                title={`${field.name} value`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <input
                title={`${field.name} isValid`}
                value={field.state.meta.isValid ? 'true' : 'false'}
                readOnly
              />
            </>
          )}
        </form.Field>
        <form.Field name="b">
          {(field) => (
            <>
              <input
                title={`${field.name} value`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <input
                title={`${field.name} isValid`}
                value={field.state.meta.isValid ? 'true' : 'false'}
                readOnly
              />
            </>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.isValid, state.canSubmit] as const}
        >
          {([isValid, canSubmit]) => (
            <>
              <input
                title="form isValid"
                value={isValid ? 'true' : 'false'}
                readOnly
              />
              <input
                title="form canSubmit"
                value={canSubmit ? 'true' : 'false'}
              />
            </>
          )}
        </form.Subscribe>
      </>
    )
  }

  const { getByTitle, user } = setup(<Component />)

  function getInput(name: string) {
    return getByTitle(name) as HTMLInputElement
  }

  // check initial values
  expect.soft(getInput('form isValid').value).toBe('false')
  expect.soft(getInput('form canSubmit').value).toBe('false')

  // choose option "b" and make "b" valid
  await user.clear(getInput('aOrB value'))
  await user.type(getInput('aOrB value'), 'b')
  await user.type(getInput('b value'), 'foobar') // valid input for "b"

  // check that values are as expected on the Field-level
  expect.soft(getInput('aOrB value').value).toBe('b')
  expect.soft(getInput('aOrB isValid').value).toBe('true')
  expect.soft(getInput('a value').value).toBe('')
  expect
    .soft(getInput('a isValid').value, "expect field 'a' to be isValid")
    .toBe('true') // as we chose "b" option, the value of "a" can be "any"thing
  expect.soft(getInput('b value').value).toBe('foobar')
  expect.soft(getInput('b isValid').value).toBe('true') // "b" is valid now, as it's not empty anymore

  // check the state on the Form-level
  expect
    .soft(getInput('form isValid').value, 'expect form.isValid to be true')
    .toBe('true')
  expect
    .soft(getInput('form canSubmit').value, 'expect form.canSubmit to be true')
    .toBe('true')
})

function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  }
}
