import { createServerFn } from '@tanstack/start'
import { formOptions } from '@tanstack/react-form';
import { createServerValidate } from '@tanstack/react-form/start'


// import { formOptions, createServerValidate } from '@tanstack/react-form/start';

export const formOpts = formOptions({
  defaultValues: {
    firstName: '',
    age: 0,
  },
})

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.age < 12) {
      return 'Server validation: You must be at least 12 to sign up'
    }
  },
})

export const handleForm = createServerFn('POST', async (formData: FormData, ctx) => {
  return serverValidate(ctx, formData);
})
