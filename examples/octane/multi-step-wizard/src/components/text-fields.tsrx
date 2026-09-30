import { useSelector } from '@tanstack/octane-form'
import { useFieldContext } from '../hooks/form-context'

export function TextField({ label }: { label: string }) @{
  const field = useFieldContext<string>()
  const errors = useSelector(field.store, (state) => state.meta.errors)

  <div>
    <label>
      <div>{label}</div>
      <input
        value={field.state.value}
        onInput={(e) => field.handleChange(e.currentTarget.value)}
        onBlur={field.handleBlur}
      />
    </label>
    @for (const error of errors; key error.message) {
      <div style={{ color: 'red' }}>{error.message}</div>
    }
  </div>
}
