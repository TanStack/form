import { useStore } from '@tanstack/preact-form'
import { useFieldContext } from '../hooks/form-context'

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()

  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <label>
        <div>{label}</div>
        <input
          value={field.state.value}
          onInput={(e) => field.handleChange(e.currentTarget.value)}
          onBlur={field.handleBlur}
        />
      </label>
      {errors.map((error: { message: string }) => (
        <div key={error.message} style={{ color: 'red' }}>
          {error.message}
        </div>
      ))}
    </div>
  )
}
