import { useEffect, useMemo, useRef } from 'preact/compat'
import { useSelector } from '@tanstack/preact-store'
import type { FunctionComponent } from 'preact/compat'
import type {
  AnyInternalFieldApi,
  InternalFormApi,
} from '@tanstack/form-core/internals'
import type { PreactFormFieldProps } from './Components.public'

interface InternalFieldProps extends PreactFormFieldProps<
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
): AnyInternalFieldApi {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const resetVersion = useSelector(options.form._atoms.resetVersion)

  const fieldApi = useMemo(() => {
    void resetVersion
    const field = options.form._getOrCreateFieldApi({
      ...optionsRef.current,
      name: options.name,
    })
    if (fieldComponents === null) return field
    Object.assign(field, fieldComponents)

    return field
  }, [options.name, options.form, resetVersion, fieldComponents])

  useEffect(() => fieldApi._update(options))

  useEffect(() => {
    const cleanup = fieldApi._register()
    return cleanup
  }, [fieldApi])

  return fieldApi
}
