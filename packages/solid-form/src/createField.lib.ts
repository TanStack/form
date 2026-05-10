import { shallow, useSelector, useStore } from '@tanstack/solid-store'
import { createMemo, createRenderEffect } from 'solid-js'
import type {
  FieldApi,
  FieldApiOptions,
  FormValidator,
} from '@tanstack/form-core-v2'
import type {
  InternalBaseFieldMeta,
  InternalFormApi,
} from '@tanstack/form-core-v2/internals'
import type { Accessor } from 'solid-js'

export interface InternalFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends FieldApiOptions<TData, TFormValidators, TFieldValue> {
  form: InternalFormApi<TData, TFormValidators>
}

export function createField<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
>(
  options: Accessor<InternalFieldProps<TData, TFormValidators, TFieldValue>>,
): Accessor<FieldApi<TData, TFormValidators>> {
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

  const state = useStore(fieldApi().store, (value) => value, shallow)

  return createMemo(
    () => {
      state()
      return fieldApi()
    },
    undefined,
    { equals: false },
  )
}

export function createArrayField<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
>(
  options: Accessor<InternalFieldProps<TData, TFormValidators, TFieldValue>>,
): Accessor<FieldApi<TData, TFormValidators>> {
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
    fieldApi().store,
    (state) => state.value.length,
  )
  const arrayVersion = useSelector(
    fieldApi().store,
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
