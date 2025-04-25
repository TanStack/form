import { createFormComposition } from '@tanstack/vue-form'
import SubscribeButton from '../components/SubscribeButton.vue'
import TextField from '../components/TextField.vue'
import { fieldProviderKey, formProviderKey } from './form-providers.ts'

export const { useAppForm } = createFormComposition({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldProviderKey,
  formProviderKey,
})
