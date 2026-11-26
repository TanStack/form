import { getFormHookHelpers } from '../../../src'
import { FormComponentStatus } from './FormComponentStatus'

const { formComponent } = getFormHookHelpers()

export default formComponent.create({
  component: FormComponentStatus,
  replaceProperty: 'owner',
})
