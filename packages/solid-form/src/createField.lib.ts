import { shallow } from '@tanstack/store'
import {
  createMemo,
  createRenderEffect,
  createSignal,
  onCleanup,
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
  // Derived from the current field (re-selected when it changes); the
  // subscription below writes atom changes.
  const [selected, setSelected] = createSignal<TSelected>(
    () => selector(fieldApi()),
    // Field atoms notify from wherever their state changes, which can be
    // inside an owned scope such as an effect.
    { equals: compare, ownedWrite: true },
  )

  createRenderEffect(fieldApi, (field) => {
    const subscription = field.atom.subscribe(() => {
      setSelected(() => selector(field))
    })

    return () => subscription.unsubscribe()
  })

  return selected
}

function createInternalField(
  options: Accessor<InternalFieldProps>,
): Accessor<AnyInternalFieldApi> {
  const form = createMemo(() => options().form)
  const [resetVersion, setResetVersion] = createSignal(
    () => form()._atoms.resetVersion.get(),
    { ownedWrite: true },
  )
  createRenderEffect(form, (current) => {
    const subscription = current._atoms.resetVersion.subscribe((version) =>
      setResetVersion(version),
    )
    return () => subscription.unsubscribe()
  })

  // Options only seed a new field api; an existing one is returned as is (same
  // identity) and picks up option changes through `_update` below.
  const fieldApi = createMemo(() => {
    void resetVersion()
    return form()._getOrCreateFieldApi({ ...options() }, 'field')
  })

  createRenderEffect(
    // Spreading reads every option, so a change to any of them is tracked.
    () => [fieldApi(), { ...options() }] as const,
    ([field, next]) => {
      field._update(next, 'field')
    },
  )

  createRenderEffect(fieldApi, (field) => field._register())

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
    { equals: false },
  )
}
