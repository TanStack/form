import { shallow } from '@tanstack/solid-store'
import {
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
  untrack,
} from 'solid-js'
import type { AnyFieldApi, FieldApiOptions } from '@tanstack/form-core'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
  InternalBaseFieldMeta,
} from '@tanstack/form-core/internals'
import type { Accessor } from 'solid-js'

interface InternalFieldProps extends FieldApiOptions<
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

function createFieldSelector<TSelected>(
  fieldApi: Accessor<AnyInternalFieldApi>,
  selector: (field: AnyInternalFieldApi) => TSelected,
  compare: (previous: TSelected, next: TSelected) => boolean,
): Accessor<TSelected> {
  const [selected, setSelected] = createSignal<TSelected>(
    selector(fieldApi()),
    { equals: compare },
  )

  createRenderEffect(() => {
    const field = fieldApi()
    setSelected(() => selector(field))

    const subscription = field.atom.subscribe(() => {
      setSelected(() => selector(field))
    })

    onCleanup(() => subscription.unsubscribe())
  })

  return selected
}

function createInternalField(
  options: Accessor<InternalFieldProps>,
): Accessor<AnyInternalFieldApi> {
  const initialForm = untrack(options).form
  const [resetVersion, setResetVersion] = createSignal(
    initialForm._atoms.resetVersion.get(),
  )
  const resetSubscription = initialForm._atoms.resetVersion.subscribe(
    (version) => setResetVersion(version),
  )
  onCleanup(() => resetSubscription.unsubscribe())

  const fieldApi = createMemo(() => {
    const reactiveOptions = options()
    const form = reactiveOptions.form
    const name = reactiveOptions.name
    void resetVersion()

    return form._getOrCreateFieldApi({
      ...untrack(options),
      name,
    })
  })

  createRenderEffect(() => {
    fieldApi()._update(options())
  })

  createRenderEffect(() => {
    const cleanup = fieldApi()._register()
    onCleanup(cleanup)
  })

  return fieldApi
}

export function createField(
  options: Accessor<InternalFieldProps>,
): Accessor<AnyFieldApi> {
  const fieldApi = createInternalField(options)
  const state = createFieldSelector(
    fieldApi,
    (field) => ({
      value: field.value,
      meta: field.meta,
    }),
    shallow,
  )

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
  const fieldApi = createInternalField(options)
  const arrayState = createFieldSelector(
    fieldApi,
    (field) => ({
      length: field.value.length,
      version: (field.meta as InternalBaseFieldMeta)._arrayVersion,
    }),
    shallow,
  )

  return createMemo(
    () => {
      arrayState()
      return fieldApi()
    },
    undefined,
    { equals: false },
  )
}
