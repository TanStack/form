import '@mantine/core/styles.css'

import { MantineProvider, TextInput, Checkbox } from '@mantine/core'
import { useForm } from '@tanstack/react-form'
import TextField from '@mui/material/TextField'
import { Checkbox as MuiCheckbox } from '@mui/material'

export default function MainComponent() {
  const { Provider, Field, Subscribe, handleSubmit, state, useStore } = useForm(
    {
      name: 'example-form',
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
    },
  )
  console.log({
    values: useStore((state) => state.values),
  })
  return (
    <MantineProvider>
      <Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void handleSubmit()
          }}
        >
          <Field
            name="firstName"
            children={({ state, handleChange, handleBlur }) => {
              return (
                <TextInput
                  defaultValue={state.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="Enter your name"
                />
              )
            }}
          />
          <Field
            name="lastName"
            children={({ state, handleChange, handleBlur }) => {
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
          />
          <Field
            name="isChecked"
            children={({ state, handleChange, handleBlur }) => {
              return (
                <Checkbox
                  onChange={(e) => handleChange(e.target.checked)}
                  onBlur={handleBlur}
                  checked={state.value}
                />
              )
            }}
          />
          <Field
            name="isMuiCheckBox"
            children={({ state, handleChange, handleBlur }) => {
              return (
                <MuiCheckbox
                  onChange={(e) => handleChange(e.target.checked)}
                  onBlur={handleBlur}
                  checked={state.value}
                />
              )
            }}
          />
          <Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </button>
            )}
          />
        </form>
      </Provider>
      <div>
        <pre>{JSON.stringify(state.values, null, 2)}</pre>
      </div>
    </MantineProvider>
  )
}
