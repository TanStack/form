import { createFormRune } from '../../src/createFormRune.svelte.js'
import TextField from './text-field.svelte'

export const { createAppForm } = createFormRune({
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
