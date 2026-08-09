import { createFormHook, getFormHookHelpers } from '../../src/index.js'
import TextFieldComponent from './TextField.svelte'
import Summary from './Summary.svelte'
import { appContext } from './app-context.js'

const { fieldComponent } = getFormHookHelpers()
const TextField = fieldComponent.strict(TextFieldComponent, 'field')

export const appForm = createFormHook({
  fieldComponents: { TextField },
  formComponents: { Summary },
})

appContext.useFormContext = appForm.useFormContext
