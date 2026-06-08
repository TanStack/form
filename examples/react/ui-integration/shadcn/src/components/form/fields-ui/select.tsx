import { fieldBrand } from '../field-brand'
import type { FieldWithValue } from '@tanstack/react-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectOption<TValue extends string> {
  label: string
  value: TValue
}

interface TanStackFormSelectProps<TValue extends string> {
  field: FieldWithValue<TValue>
  options: ReadonlyArray<NoInfer<SelectOption<TValue>>>
  placeholder?: string
}

function FormSelect<TValue extends string>({
  field,
  options,
  placeholder,
}: TanStackFormSelectProps<TValue>) {
  return (
    <Select value={field.value} onValueChange={field.handleChange as never}>
      <SelectTrigger
        id={field.name}
        onBlur={field.handleBlur}
        aria-invalid={field.meta.isInvalid}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default fieldBrand.loose<string>()(FormSelect)

// formOptions
// formOptions.strictSchema
// formOptions.looseSchema

// fieldBrand.loose<string>()(Comp)
// fieldBrand.strict<string>()(Comp)
// fieldBrand.loose()(Comp, 'field')
// fieldBrand.strict()(Comp, 'field')

// fieldComponent.loose()(Comp, 'field')
// fieldComponent.strict()(Comp, 'field')
