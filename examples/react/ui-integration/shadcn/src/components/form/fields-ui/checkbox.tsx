import { fieldComponent } from '../contexts'
import type { FieldWithValue } from '@tanstack/react-form'
import { Checkbox } from '@/components/ui/checkbox'

interface TanStackFormCheckboxProps {
  field: FieldWithValue<boolean>
}

function FormCheckbox({ field }: TanStackFormCheckboxProps) {
  return (
    <Checkbox
      id={field.name}
      checked={field.value}
      onCheckedChange={(checked) => field.handleChange(checked === true)}
      onBlur={field.handleBlur}
      aria-invalid={field.meta.isInvalid}
    />
  )
}

export default fieldComponent.strict(FormCheckbox, 'field')
