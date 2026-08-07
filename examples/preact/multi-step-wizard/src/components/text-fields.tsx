import type { FieldWithValue } from '@tanstack/preact-form'

export function TextField({
  field,
  label,
}: {
  field: FieldWithValue<string>
  label: string
}) {
  return (
    <div>
      <label>
        <div>{label}</div>
        <input
          value={field.value}
          onInput={(e) => field.handleChange(e.currentTarget.value)}
          onBlur={field.handleBlur}
        />
      </label>
      {field.errors.map((error) => (
        <div key={error.message} style={{ color: 'red' }}>
          {error.message}
        </div>
      ))}
    </div>
  )
}
