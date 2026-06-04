import { useSelector } from '@tanstack/react-store'
import React, { useEffect, useMemo, useRef } from 'react'
import { createFormGroupApi } from '@tanstack/form-core-v2/form-group'
import { Subscribe } from '../Subscribe.public'
import type {
  ReactFormGroupApi,
  ReactFormGroupArrayFieldComponent,
  ReactFormGroupArrayFieldProps,
  ReactFormGroupFieldComponent,
  ReactFormGroupFieldProps,
  ReactFormGroupProps,
  ReactFormGroupSubscribeComponent,
  ReactFormGroupSubscribeProps,
} from '../ReactForm/Components.public'
import type { InternalFormGroupApi } from '@tanstack/form-core-v2/form-group'
import type { AnyInternalFormApi } from '@tanstack/form-core-v2/internals'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldValidators,
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
  options: InternalFormGroupProps,
): ReactFormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators,
  TFormValidators,
  TSubmitReturn
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
        TGroupName,
        TGroupValue,
        TGroupValidators,
        TFormValidators,
        TSubmitReturn
      >(groupApi),
    [groupApi],
  )
}

function getCoreGroupOptions(options: InternalFormGroupProps) {
  return {
    name: options.name,
    validators: options.validators,
    listeners: options.listeners,
    onGroupSubmit: options.onGroupSubmit,
    onGroupSubmitInvalid: options.onGroupSubmitInvalid,
  }
}

function createReactFormGroupApi<
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
  group: InternalFormGroupApi,
): ReactFormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators,
  TFormValidators,
  TSubmitReturn
> {
  const result = Object.create(group) as ReactFormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >

  const TanStackFormGroupField = Object.assign(
    function TanStackFormGroupField<
      TFieldName extends DeepKeys<TGroupValue>,
      TFieldValue extends DeepValue<TGroupValue, TFieldName>,
      TFieldValidators extends FieldValidators<any, any, TFieldValue>,
    >(
      fieldProps: ReactFormGroupFieldProps<
        TGroupValue,
        TFieldName,
        TFieldValue,
        TFieldValidators,
        TFormValidators,
        TSubmitReturn,
        any
      >,
    ) {
      return React.createElement((group.form as any).Field, {
        ...fieldProps,
        name: group._fullFieldName(fieldProps.name as string),
      })
    },
    { displayName: 'TanStackForm.GroupField' },
  ) satisfies ReactFormGroupFieldComponent<
    TGroupValue,
    TFormValidators,
    TSubmitReturn,
    any
  >

  const TanStackFormGroupArrayField = Object.assign(
    function TanStackFormGroupArrayField<
      TFieldName extends DeepKeysWhereValueIncludes<TGroupValue, Array<any>>,
      TFieldValue extends DeepValue<TGroupValue, TFieldName>,
      TFieldValidators extends FieldValidators<any, any, TFieldValue>,
    >(
      fieldProps: ReactFormGroupArrayFieldProps<
        TGroupValue,
        TFieldName,
        TFieldValue,
        TFieldValidators,
        TFormValidators,
        TSubmitReturn,
        any
      >,
    ) {
      return React.createElement((group.form as any).ArrayField, {
        ...fieldProps,
        name: group._fullFieldName(fieldProps.name as string),
      })
    },
    { displayName: 'TanStackForm.GroupArrayField' },
  ) satisfies ReactFormGroupArrayFieldComponent<
    TGroupValue,
    TFormValidators,
    TSubmitReturn,
    any
  >

  const TanStackFormGroupSubscribe = Object.assign(
    function TanStackFormGroupSubscribe<TSelected>(
      subscribeProps: ReactFormGroupSubscribeProps<
        TFormData,
        TGroupName,
        TGroupValue,
        TFormValidators,
        TSubmitReturn,
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
    TGroupName,
    TGroupValue,
    TFormValidators,
    TSubmitReturn
  >
  result.Field = TanStackFormGroupField
  result.ArrayField = TanStackFormGroupArrayField
  result.Subscribe = TanStackFormGroupSubscribe

  return result
}
