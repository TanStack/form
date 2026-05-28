import { useSelector } from '@tanstack/react-store'
import React, { useEffect, useMemo, useRef } from 'react'
import { createFormGroupApi } from '@tanstack/form-core-v2/form-group'
import { Subscribe } from '../Subscribe.public'
import type {
  ReactFormGroupApi,
  ReactFormGroupProps,
  ReactFormGroupSubscribeComponent,
  ReactFormGroupSubscribeProps,
} from '../ReactForm/Components.public'
import type { InternalFormGroupApi } from '@tanstack/form-core-v2/form-group'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type {
  DeepKeys,
  DeepValue,
  FormGroupValidators,
  FormValidators,
} from '@tanstack/form-core-v2'

type InternalFormGroupProps = Omit<
  ReactFormGroupProps<any, any, any, any, any, any>,
  'children'
> & {
  form: AnyInternalFormApi
}

export function useFormGroup<
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
  options: InternalFormGroupProps,
): ReactFormGroupApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TGroupName,
  TGroupValue,
  TGroupValidators
> {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const resetVersion = useSelector(options.form._atoms.resetVersion)

  const groupApi = useMemo(() => {
    void resetVersion
    return createFormGroupApi(options.form, {
      ...getCoreGroupOptions(optionsRef.current),
      name: options.name,
    })
  }, [options.name, options.form, resetVersion])

  useEffect(() => groupApi._update(getCoreGroupOptions(options)))

  useEffect(() => {
    const cleanup = groupApi._register()
    return cleanup
  }, [groupApi])

  return useMemo(
    () =>
      createReactFormGroupApi<
        TFormData,
        TFormValidators,
        TSubmitReturn,
        TGroupName,
        TGroupValue,
        TGroupValidators
      >(groupApi),
    [groupApi],
  )
}

function getCoreGroupOptions(options: InternalFormGroupProps) {
  return {
    name: options.name,
    validators: options.validators,
    onGroupSubmit: options.onGroupSubmit,
    onGroupSubmitInvalid: options.onGroupSubmitInvalid,
  }
}

function createReactFormGroupApi<
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
  group: InternalFormGroupApi,
): ReactFormGroupApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TGroupName,
  TGroupValue,
  TGroupValidators
> {
  const result = Object.create(group) as ReactFormGroupApi<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue,
    TGroupValidators
  >

  const TanStackFormGroupSubscribe = Object.assign(
    function TanStackFormGroupSubscribe<TSelected>(
      subscribeProps: ReactFormGroupSubscribeProps<
        TFormData,
        TFormValidators,
        TSubmitReturn,
        TGroupName,
        TGroupValue,
        TSelected
      >,
    ) {
      return React.createElement(Subscribe as React.ComponentType<any>, {
        source: group.store,
        ...subscribeProps,
      })
    },
    { displayName: 'TanStackForm.GroupSubscribe' },
  ) satisfies ReactFormGroupSubscribeComponent<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TGroupName,
    TGroupValue
  >
  result.Subscribe = TanStackFormGroupSubscribe

  return result
}
