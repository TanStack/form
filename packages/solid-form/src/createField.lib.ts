import { shallow, useSelector } from '@tanstack/solid-store'
import { createMemo, createRenderEffect } from 'solid-js'
import type { AnyFieldApi, FieldApiOptions } from '@tanstack/form-core-v2'
import type {
  AnyInternalFormApi,
  InternalBaseFieldMeta,
} from '@tanstack/form-core-v2/internals'
import type { Accessor } from 'solid-js'

export interface InternalFieldProps extends FieldApiOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
> {
  form: AnyInternalFormApi
}

export function createField(
  options: Accessor<InternalFieldProps>,
): Accessor<AnyFieldApi> {
  const fieldApi = createMemo(() => {
    const opts = options()

    return opts.form._getOrCreateFieldApi({
      ...opts,
      name: opts.name,
    })
  })

  createRenderEffect(() => {
    fieldApi()._update(options())
  })

  const state = useSelector(fieldApi().atom, (value) => value, {
    compare: shallow,
  })

  return createMemo(
    () => {
      state()
      return fieldApi()
    },
    undefined,
    { equals: false },
  )
}

export function createArrayField(
  options: Accessor<InternalFieldProps>,
): Accessor<AnyFieldApi> {
  const fieldApi = createMemo(() => {
    const opts = options()

    return opts.form._getOrCreateFieldApi({
      ...opts,
      name: opts.name,
    })
  })

  createRenderEffect(() => {
    fieldApi()._update(options())
  })

  const valueLength = useSelector(
    fieldApi().atom,
    (state) => state.value.length,
  )
  const arrayVersion = useSelector(
    fieldApi().atom,
    (state) => (state.meta as never as InternalBaseFieldMeta)._arrayVersion,
  )

  return createMemo(
    () => {
      valueLength()
      arrayVersion()
      return fieldApi()
    },
    undefined,
    { equals: false },
  )
}
