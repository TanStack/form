import { formOptions } from '@tanstack/react-form'
import { appFormOptions } from './appForm/createFormHook'

export const sharedFormOptions = appFormOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    age: 0,
    fooOrBar: 'foo' as 'foo' | 'bar',
    address: {
      street: '',
      country: '',
    },
  },
})
