import { createFormCreator } from '@tanstack/svelte-form'
import TextField from '../components/text-field.svelte'
import SubscribeButton from '../components/subscribe-button.svelte'

export const { createAppForm } = createFormCreator({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubscribeButton,
  },
})
