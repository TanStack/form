import TanStackFormField from '../fields-ui/field'
import TanStackFormLabel from '../fields-ui/label'
import TanStackFormTextInput from '../fields-ui/text-input'
import TanStackFormError from '../fields-ui/error'
import { fieldComponent } from '../field-brand'
import type { FieldWithValue } from '@tanstack/react-form'

interface TanStackFormTextFieldProps {
  label?: string
  placeholder?: string
  field: FieldWithValue<string>
}

function FormTextField(props: TanStackFormTextFieldProps) {
  return (
    <TanStackFormField>
      {props.label && <TanStackFormLabel>{props.label}</TanStackFormLabel>}
      <TanStackFormTextInput type="text" placeholder={props.placeholder} />
      <TanStackFormError />
    </TanStackFormField>
  )
}

export default fieldComponent.strict(FormTextField, 'field')
