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
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<
    TFormData,
    TGroupName,
    TGroupValue
  >,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  props: ReactFormGroupProps<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >,
): CrossVersionReactNode {
  const groupApi = useFormGroup<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >({
    form: props.form as InternalReactFormApi,
    name: props.name,
    validators: props.validators,
    onGroupSubmit: props.onGroupSubmit,
    onGroupSubmitInvalid: props.onGroupSubmitInvalid,
  })

  return props.children(groupApi)
}
