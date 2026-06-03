import type { ReactAppFormApi } from './ReactAppFormApi.public'
import type {
  FormOptions,
  FormValidatorData,
  FormValidators,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2'
import type { AnyReactFormComponentMap } from './componentMap.public'

export type UseAppFormHook<TComponents extends AnyReactFormComponentMap> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactAppFormApi<TFormData, TFormValidators, TSubmitReturn, TComponents>

export type UseSchemaAppFormHook<TComponents extends AnyReactFormComponentMap> =
  <const TFormValidators extends FormValidators<any>, TSubmitReturn>(
    options: FormOptions<
      FormValidatorData<TFormValidators>,
      TFormValidators,
      TSubmitReturn
    >,
  ) => ReactAppFormApi<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn,
    TComponents
  >

export type UseNullableSchemaAppFormHook<
  TComponents extends AnyReactFormComponentMap,
> = <
  const TFormValidators extends FormValidators<any>,
  const TFormData extends NullableSchemaData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactAppFormApi<
  InferUnion<TFormData, FormValidatorData<TFormValidators>>,
  TFormValidators,
  TSubmitReturn,
  TComponents
>
