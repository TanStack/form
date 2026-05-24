import { useSelector } from '@tanstack/react-store'
import { useEffect, useMemo, useRef } from 'react'
import { createFormGroupApi } from '@tanstack/form-core-v2/form-group'
import type { InternalFormApi } from '@tanstack/form-core-v2/internals'
import type { InternalFormGroupApi } from '@tanstack/form-core-v2/form-group'
import type { ReactFormGroupProps } from '../ReactForm/Components.public'

interface InternalFormGroupProps
  extends Omit<ReactFormGroupProps<any, any, any, any, any, any>, 'children'> {
  form: InternalFormApi<any, any, any>
}

export function useFormGroup(
  options: InternalFormGroupProps,
): InternalFormGroupApi {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const resetVersion = useSelector(options.form._resetVersionAtom)

  const groupApi = useMemo(() => {
    void resetVersion
    return createFormGroupApi(options.form, {
      ...getCoreGroupOptions(optionsRef.current),
      name: options.name,
    })
  }, [options.name, options.form, resetVersion])

  useSelector(groupApi.store, (state) => state)

  useEffect(() => groupApi._update(getCoreGroupOptions(options)))

  useEffect(() => {
    const cleanup = groupApi._register()
    return cleanup
  })

  return groupApi
}

function getCoreGroupOptions(options: InternalFormGroupProps) {
  return {
    name: options.name,
    validators: options.validators,
    onGroupSubmit: options.onGroupSubmit,
    onGroupSubmitInvalid: options.onGroupSubmitInvalid,
  }
}
