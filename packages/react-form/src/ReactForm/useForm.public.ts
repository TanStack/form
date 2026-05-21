import { initializeForm, useInternalForm } from './ReactFormApi.lib'
import type { FormOptions } from '@tanstack/form-core-v2'
import type {
  UseFormHook,
  UseNullableSchemaFormHook,
  UseSchemaFormHook,
} from './useFormTypes.public'

function useFormHook(options: FormOptions<any, any, any>) {
  const form = useInternalForm(options, initializeForm)
  return form
}

const useSchemaForm = useFormHook as unknown as UseSchemaFormHook<
  Record<never, never>,
  Record<never, never>
>

const useForm = useFormHook as never as UseFormHook<
  Record<never, never>,
  Record<never, never>
>

// TODO add unit tests, chances are the InferUnion type is incomplete
const useNullableSchemaForm = useFormHook as never as UseNullableSchemaFormHook<
  Record<never, never>,
  Record<never, never>
>

export { useForm, useSchemaForm, useNullableSchemaForm }
