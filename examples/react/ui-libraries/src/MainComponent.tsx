import '@mantine/core/styles.css'

import { Checkbox, MantineProvider, TextInput } from '@mantine/core'
import { useForm } from '@tanstack/react-form'
import TextField from '@mui/material/TextField'
import { Checkbox as MuiCheckbox } from '@mui/material'

export default function MainComponent() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      isChecked: false,
      isMuiCheckBox: false,
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value)
    },
  })

  return (
    <MantineProvider>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="firstName">
          {({ state, handleChange, handleBlur }) => {
            return (
              <TextInput
                defaultValue={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter your name"
              />
            )
          }}
        </form.Field>
        <form.Field name="lastName">
          {({ state, handleChange, handleBlur }) => {
            return (
              <TextField
                id="filled-basic"
                label="Filled"
                variant="filled"
                defaultValue={state.value}
                onChange={(e) => handleChange(e.target.value)}
                onBlur={handleBlur}
                placeholder="Enter your last name"
              />
            )
          }}
        </form.Field>
        <form.Field name="isChecked">
          {({ state, handleChange, handleBlur }) => {
            return (
              <Checkbox
                onChange={(e) => handleChange(e.target.checked)}
                onBlur={handleBlur}
                checked={state.value}
              />
            )
          }}
        </form.Field>
        <form.Field name="isMuiCheckBox">
          {({ state, handleChange, handleBlur }) => {
            return (
              <MuiCheckbox
                onChange={(e) => handleChange(e.target.checked)}
                onBlur={handleBlur}
                checked={state.value}
              />
            )
          }}
        </form.Field>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </MantineProvider>
  )
}
