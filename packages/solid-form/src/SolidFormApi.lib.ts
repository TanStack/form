import {
  InternalFormApi,
  InternalFormGroupApi,
} from '@tanstack/form-core/internals'
import { shallow, useSelector } from '@tanstack/solid-store'
import {
  createComponent,
  createMemo,
  createRenderEffect,
  createUniqueId,
  mergeProps,
  onCleanup,
  untrack,
} from 'solid-js'
import { Subscribe } from './Subscribe.public'
import { createArrayField, createField } from './createField.lib'
import type {
  AnyInternalFormApi,
  InternalFormGroupApi as InternalFormGroupApiType,
} from '@tanstack/form-core/internals'
import type { FormOptions } from '@tanstack/form-core'
import type { Component } from 'solid-js'
import type {
  SolidFormFieldProps,
  SolidFormGroupProps,
  SolidFormSubscribeProps,
  SolidTanStackFormComponents,
} from './Components.public'

export interface InternalSolidFormApi
  extends AnyInternalFormApi, SolidTanStackFormComponents<any, any, any> {}

export function attachSolidFormComponents(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, Component<any>> | null,
): InternalSolidFormApi {
  const solidFormApi = form as InternalSolidFormApi

  solidFormApi.Field = function TanStackFormField(
    props: SolidFormFieldProps<any, any, any, any, any, any, any, any>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createField(() => fieldOptions as never)
    if (fieldComponents !== null) Object.assign(fieldApi, fieldComponents)

    return props.children(fieldApi as never)
  } as never

  solidFormApi.ArrayField = function TanStackFormArrayField(
    props: SolidFormFieldProps<any, any, any, any, any, any, any, any>,
  ) {
    const fieldOptions = mergeProps(props, { form })
    const fieldApi = createArrayField(() => fieldOptions as never)
    if (fieldComponents !== null) Object.assign(fieldApi, fieldComponents)

    return props.children(fieldApi as never)
  } as never

  solidFormApi.Subscribe = function TanStackFormSubscribe(
    props: SolidFormSubscribeProps<any, any, any>,
  ) {
    return createComponent(
      Subscribe as Component<any>,
      mergeProps(props, { source: solidFormApi.atom }),
    )
  }

  solidFormApi.FormGroup = function TanStackFormGroup(
    props: SolidFormGroupProps<any, any, any, any, any, any>,
  ) {
    const group = attachSolidFormGroupComponents(
      new InternalFormGroupApi({ ...props, form } as never),
      solidFormApi,
    )

    createRenderEffect(() => group.update({ ...props, form } as never))
    group.mount()
    onCleanup(() => group._cleanup())

    const state = useSelector(group.atom, (value) => value, {
      compare: shallow,
    })
    const groupAccessor = createMemo(
      () => {
        state()
        return group
      },
      undefined,
      { equals: false },
    )

    Object.assign(groupAccessor, {
      Field: group.Field,
      ArrayField: group.ArrayField,
      Subscribe: group.Subscribe,
    })

    return props.children(groupAccessor as never)
  }

  return solidFormApi
}

function attachSolidFormGroupComponents(
  group: InternalFormGroupApiType<any, any, any, any, any>,
  form: InternalSolidFormApi,
) {
  type GroupWithComponents = InternalFormGroupApiType<
    any,
    any,
    any,
    any,
    any
  > & {
    Field: Component<any>
    ArrayField: Component<any>
    Subscribe: Component<any>
  }

  const resultGroup = group as GroupWithComponents

  resultGroup.Field = function Field(props) {
    return createComponent(
      form.Field as Component<any>,
      group._getFormFieldOptions(props, mergeProps) as any,
    )
  }

  resultGroup.ArrayField = function ArrayField(props) {
    return createComponent(
      form.ArrayField as Component<any>,
      group._getFormFieldOptions(props, mergeProps) as any,
    )
  }

  resultGroup.Subscribe = function GroupSubscribe(props) {
    return createComponent(
      Subscribe as Component<any>,
      mergeProps(props, { source: group.atom }),
    )
  }

  return resultGroup
}

export function initializeForm(
  options: FormOptions<any, any, any, unknown>,
): InternalSolidFormApi {
  return attachSolidFormComponents(new InternalFormApi(options), null)
}

export function createInternalForm(
  options: () => FormOptions<any, any, any, unknown>,
  initializeFn: (
    options: FormOptions<any, any, any, unknown>,
  ) => InternalSolidFormApi,
) {
  const solidFormId = createUniqueId()
  const resolveOptions = () => {
    const current = options()
    return current.formId === undefined
      ? { ...current, formId: solidFormId }
      : current
  }
  const form = untrack(() => initializeFn(resolveOptions()))

  createRenderEffect(() => {
    form._update(resolveOptions() as never)
  })

  const unmount = form.mount()
  onCleanup(unmount)

  return form
}
