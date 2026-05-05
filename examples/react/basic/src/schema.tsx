import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

export function SchemaExample() {
  const form = useForm({
    defaultValues: { name: '', email: '' },
    validators: [
      {
        validate: z.object({
          name: z.string().min(1, 'Name is required'),
          email: z.email('Email is required'),
        }),
        signals: [
          'blur',
          {
            signal: 'change',
            enabled: ({ fieldApi }) => Boolean(fieldApi?.meta.isInvalid),
          },
        ],
      },
    ],
  })

  return (
    <form>
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
                // TODO blur behaviour from core
                onBlur={() => form.validate('blur')}
                autoComplete="new-password"
              />
            </label>
            <br />
            <span>
              {field.meta.isInvalid && field.meta.isTouched
                ? field.meta.errors[0].message
                : '\u200b'}
            </span>
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
                // TODO blur behaviour from core
                onBlur={() => form.validate('blur')}
                autoComplete="new-password"
              />
            </label>
            <br />
            {field.meta.isInvalid && field.meta.isTouched
              ? field.meta.errors[0].message
              : '\u200b'}
          </div>
        )}
      </form.Field>
    </form>
  )
}
