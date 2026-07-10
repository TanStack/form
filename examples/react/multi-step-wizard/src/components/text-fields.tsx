import type { FieldWithValue } from '@tanstack/react-form'

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
          onChange={(e) => field.handleChange(e.target.value)}
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
