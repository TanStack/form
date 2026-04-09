import { useFieldContext } from '../AppForm'

export function TextField({ label }: { label: string }) {
  // The `Field` infers that it should have a `value` type of `string`
  const field = useFieldContext<string>()
  return (
    <label>
      <span>{label}</span>
      <input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={() => field.handleBlur()}
      />

      <>
        {field.state.meta.isTouched && !field.state.meta.isValid ? (
          <em>{field.state.meta.errors.join(',')}</em>
        ) : null}
        {field.state.meta.isValidating ? 'Validating...' : null}
      </>
    </label>
  )
}
