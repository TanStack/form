import { createFormCreator } from '../../src/createFormCreator.svelte.js'
import TextField from './text-field.svelte'

export const { createAppForm } = createFormCreator({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
