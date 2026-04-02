import appForm from '../AppForm/AppForm'

//
// fields
//
import { CustomTextField } from './FieldComponents/CustomTextField'

const extendedAppForm = appForm.extendForm({
  // field name must be unique
  fieldComponents: { CustomTextField },
})

export const { useAppForm } = extendedAppForm
export default extendedAppForm
