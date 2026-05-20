import { useFormHook } from './ReactFormApi.lib'
import type {
  FormApi,
  FormOptions,
  FormValidators,
} from '@tanstack/form-core-v2'
import type {
  FormValidatorData,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2/internals'
import type { ReactTanStackFormComponents } from './Components.public'

export interface ReactFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>
  extends
    FormApi<TFormData, TFormValidators, TSubmitReturn>,
    ReactTanStackFormComponents<TFormData, TFormValidators, TSubmitReturn> {}

export type UseFormHook = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<TFormData, TFormValidators, TSubmitReturn>

export type UseSchemaFormHook = <
  const TFormValidators extends FormValidators<any>,
  TSubmitReturn,
>(
  options: FormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn
  >,
) => ReactFormApi<
  FormValidatorData<TFormValidators>,
  TFormValidators,
  TSubmitReturn
>

export type UseNullableSchemaFormHook = <
  const TFormValidators extends FormValidators<any>,
  const TFormData extends NullableSchemaData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<
  InferUnion<TFormData, FormValidatorData<TFormValidators>>,
  TFormValidators,
  TSubmitReturn
>

const useSchemaForm = useFormHook as unknown as UseSchemaFormHook

const useForm = useFormHook as UseFormHook

// TODO add unit tests, chances are the InferUnion type is incomplete
const useNullableSchemaForm = useFormHook as UseNullableSchemaFormHook

export { useForm, useSchemaForm, useNullableSchemaForm }
