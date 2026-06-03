import type {
  FormOptions,
  FormValidatorData,
  FormValidators,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2'
import type { AnyReactFormComponentMap } from '../AppForm/componentMap.public'
import type { ReactFormApi } from './formApiTypes.public'

export type UseFormHook<TComponents extends AnyReactFormComponentMap> = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TComponents
>

export type UseSchemaFormHook<
  TComponents extends AnyReactFormComponentMap,
> = <const TFormValidators extends FormValidators<any>, TSubmitReturn>(
  options: FormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn
  >,
) => ReactFormApi<
  FormValidatorData<TFormValidators>,
  TFormValidators,
  TSubmitReturn,
  TComponents
>

export type UseNullableSchemaFormHook<
  TComponents extends AnyReactFormComponentMap,
> = <
  const TFormValidators extends FormValidators<any>,
  const TFormData extends NullableSchemaData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<
  InferUnion<TFormData, FormValidatorData<TFormValidators>>,
  TFormValidators,
  TSubmitReturn,
  TComponents
>
