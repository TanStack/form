import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

async function callEndpoint(value: any): any {}

type WrapInString<T extends number> = `NUM_${T}`
type ParseResult<T extends ReadonlyArray<number>> = T extends [
  infer TFirst,
  ...infer TRest,
]
  ? TFirst extends number
    ? TRest extends ReadonlyArray<number>
      ? [WrapInString<TFirst>, ...ParseResult<TRest>]
      : []
    : []
  : []

type T1 = ParseResult<[1, 2, 3]>

export function SchemaExample() {
  const form = useForm({
    defaultValues: { name: '', email: '' },
    validators: [
      {
        run: z
          .object({
            name: z.string().min(1, 'Name is required'),
            email: z.email('Email is required'),
          })
          .transform((d) => 0),
        triggers: [
          'blur',
          {
            trigger: 'change',
            when: ({ triggerFieldApi }) =>
              Boolean(triggerFieldApi?.meta.isInvalid),
          },
        ],
      },
      {
        run: z
          .object({
            name: z.string().min(1, 'Name is required'),
            email: z.email('Email is required'),
          })
          .transform((d) => ''),
        runOnSubmit: false,
      },
    ],
    onSubmit: async ({ value, createValidationError }) => {
      alert('Submitted!')
      const result = await callEndpoint(value)

      if (isErrorResult(result)) {
        return createValidationError('This is an error!')
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <h2>Schema example</h2>
      <form.Field name="name">
        {(field) => (
          <div style={{ paddingBottom: '5px' }}>
            <label>
              Name
              <br />
              <input
                value={field.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
              />
            </label>
            <br />
            {(field.meta.isBlurred || form.state.submissionAttempts > 0) && (
              <span>{field.errors[0]?.message}</span>
            )}
          </div>
        )}
      </form.Field>
      <hr />
      <form.Field name="email">
        {(field) => (
          <div style={{ paddingBottom: '5px' }}>
            <label>
              Email
              <br />
              <input
                value={field.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                autoComplete="new-password"
              />
            </label>
            <br />
            {(field.meta.isBlurred || form.state.submissionAttempts > 0) && (
              <span>{field.errors[0]?.message}</span>
            )}
          </div>
        )}
      </form.Field>
      <button type="submit">Submit</button>
    </form>
  )
}
