import { extendForm } from '@tanstack/react-form'
import appForm from '../AppForm/AppForm'

//
// fields
//
import { CustomTextField } from './FieldComponents/CustomTextField'

const extendedAppForm = extendForm(appForm, {
  // field name must be unique
  fieldComponents: { CustomTextField },
})

export const { useAppForm } = extendedAppForm
export default extendedAppForm
