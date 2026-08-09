import { createFormHook, getFormHookHelpers } from '@tanstack/svelte-form'
import SubscribeButton from '../components/SubscribeButton.svelte'
import TextField from '../components/TextField.svelte'

const { fieldComponent } = getFormHookHelpers()
const AppTextField = fieldComponent.strict(TextField, 'field')

export const {
  appFormOptions,
  defineAppFieldGroup,
  useAppForm,
  useFormContext,
} = createFormHook({
  fieldComponents: { TextField: AppTextField },
  formComponents: { SubscribeButton },
})
