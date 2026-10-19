import z from 'zod'
import { formOptions } from './FormApi/formOptions.public'

// TODO remove

const test = false as boolean

const schema = z.object({ name: z.string() }).transform((d) => d.name.length)

const opts = formOptions({
  defaultValues: { name: '' },
  validators: [
    {
      run: () => {},
    },
  ],
  onSubmit: ({ validatorOutputs }) => {
    const [schemaOutput] = validatorOutputs
  },
})
