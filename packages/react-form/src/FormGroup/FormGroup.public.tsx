import { useFormGroup } from './useFormGroup.lib'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type {
  DeepKeys,
  DeepValue,
  FormGroupValidators,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { CrossVersionReactNode } from '../reactTypes.public'
import type { ReactFormGroupProps } from '../ReactForm/Components.public'

export type {
  ReactFormGroupApi,
  ReactFormGroupSubscribeComponent,
  ReactFormGroupSubscribeProps,
} from '../ReactForm/Components.public'

export function FormGroup<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<
    TFormData,
    TGroupName,
    TGroupValue
  >,
>(
  props: ReactFormGroupProps<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue,
    TGroupValidators
  >,
): CrossVersionReactNode {
  const groupApi = useFormGroup<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue,
    TGroupValidators
  >({
    form: props.form as InternalReactFormApi,
    name: props.name,
    validators: props.validators,
    onGroupSubmit: props.onGroupSubmit,
    onGroupSubmitInvalid: props.onGroupSubmitInvalid,
  })

  return props.children(groupApi)
}
