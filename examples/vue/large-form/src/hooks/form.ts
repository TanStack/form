import { createFormHook, getFormHookHelpers } from '@tanstack/vue-form'
import SubscribeButton from '../components/SubscribeButton.vue'
import TextField from '../components/TextField.vue'

const { fieldComponent } = getFormHookHelpers()

const AppTextField = fieldComponent.strict(TextField, 'field')

export const {
  appFormOptions,
  getAppFieldGroupHelpers,
  useAppForm,
  useFormContext,
} = createFormHook({
  fieldComponents: {
    TextField: AppTextField,
  },
  formComponents: {
    SubscribeButton,
  },
})
