import { useEffect, useMemo, useRef } from 'react'
import { useSelector } from '@tanstack/react-store'
import type { FunctionComponent } from 'react'
import type {
  AnyInternalFieldApi,
  FieldOptionsScope,
  InternalFormApi,
} from '@tanstack/form-core/internals'
import type { ReactFormFieldProps } from './Components.public'

interface InternalFieldProps extends ReactFormFieldProps<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> {
  form: InternalFormApi<any, any, any>
}

export function useField(
  options: InternalFieldProps,
  fieldComponents: Record<string, FunctionComponent<any>> | null,
  scope: FieldOptionsScope,
): AnyInternalFieldApi {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const resetVersion = useSelector(options.form._atoms.resetVersion)

  const fieldApi = useMemo(() => {
    void resetVersion
    const field = options.form._getOrCreateFieldApi(
      {
        ...optionsRef.current,
        name: options.name,
      },
      scope,
    )
    if (fieldComponents === null) return field
    Object.assign(field, fieldComponents)

    return field
  }, [options.name, options.form, resetVersion, fieldComponents, scope])

  useEffect(() => fieldApi._update(options, scope))

  useEffect(() => {
    const cleanup = fieldApi._register()
    return cleanup
  }, [fieldApi])

  return fieldApi
}
