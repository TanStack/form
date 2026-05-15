import { shallow, useSelector } from '@tanstack/solid-store'
import { createMemo, createRenderEffect } from 'solid-js'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
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
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends FieldApiOptions<TFormData, TFormValidators, TFieldName, TFieldValue> {
  form: InternalFormApi<TFormData, TFormValidators>
}

export function createField<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
>(
  options: Accessor<
    InternalFieldProps<TFormData, TFormValidators, TFieldName, TFieldValue>
  >,
): Accessor<FieldApi<TFormData, TFormValidators, TFieldName, TFieldValue>> {
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

  const state = useSelector(fieldApi().store, (value) => value, {
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

export function createArrayField<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
>(
  options: Accessor<
    InternalFieldProps<TFormData, TFormValidators, TFieldName, TFieldValue>
  >,
): Accessor<FieldApi<TFormData, TFormValidators, TFieldName, TFieldValue>> {
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
