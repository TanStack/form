import {
  InternalFormApi,
  InternalFormGroupApi,
} from '@tanstack/form-core/internals'
import { shallow } from '@tanstack/store'
import {
  createComponent,
  createMemo,
  createRenderEffect,
  createUniqueId,
  merge,
} from 'solid-js'
import { Subscribe } from './Subscribe.public'
import { createArrayField, createField } from './createField.lib'
import { useSelector } from './useSelector.public'
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

/**
 * Puts the form's components on `target` (the form itself, unless given).
 * They read `form` only while rendering, so `target` can hold them before
 * the form is built.
 */
export function attachSolidFormComponents(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, Component<any>> | null,
  target: object = form,
): InternalSolidFormApi {
  const solidFormApi = target as InternalSolidFormApi

  solidFormApi.Field = function TanStackFormField(
    props: SolidFormFieldProps<any, any, any, any, any, any, any, any>,
  ) {
    const fieldOptions = merge(props, { form })
    const fieldApi = createField(() => fieldOptions as never)
    if (fieldComponents !== null) Object.assign(fieldApi, fieldComponents)

    return props.children(fieldApi as never)
  } as never

  solidFormApi.ArrayField = function TanStackFormArrayField(
    props: SolidFormFieldProps<any, any, any, any, any, any, any, any>,
  ) {
    const fieldOptions = merge(props, { form })
    const fieldApi = createArrayField(() => fieldOptions as never)
    if (fieldComponents !== null) Object.assign(fieldApi, fieldComponents)

    return props.children(fieldApi as never)
  } as never

  solidFormApi.Subscribe = function TanStackFormSubscribe(
    props: SolidFormSubscribeProps<any, any, any>,
  ) {
    return createComponent(
      Subscribe as Component<any>,
      merge(props, {
        get source() {
          return form.atom
        },
      }),
    )
  }

  solidFormApi.FormGroup = function TanStackFormGroup(
    props: SolidFormGroupProps<any, any, any, any, any, any>,
  ) {
    // Spreading reads every prop, so the memo and the effect track them all.
    const groupOptions = () => ({ ...props, form }) as never
    // Built in a memo, so the group waits under `Loading` while a prop is
    // still loading, instead of throwing. Once built it is read directly.
    let built: ReturnType<typeof attachSolidFormGroupComponents> | undefined
    const instance = createMemo(
      () =>
        built ??
        (built = attachSolidFormGroupComponents(
          new InternalFormGroupApi(groupOptions()),
          solidFormApi,
        )),
    )
    const group = () => built ?? instance()

    createRenderEffect(
      () => [group(), groupOptions()] as const,
      ([current, next]) => current.update(next),
    )
    createRenderEffect(group, (current) => {
      current.mount()
      return () => current._cleanup()
    })

    const state = createMemo(() =>
      useSelector(group().atom, (value) => value, { compare: shallow }),
    )
    const groupAccessor = createMemo(
      () => {
        state()()
        return group()
      },
      { equals: false },
    )

    // Each renders the group's component once the group is built.
    const render =
      (key: 'Field' | 'ArrayField' | 'Subscribe') => (childProps: any) => () =>
        createComponent(group()[key], childProps)
    Object.assign(groupAccessor, {
      Field: render('Field'),
      ArrayField: render('ArrayField'),
      Subscribe: render('Subscribe'),
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
      group._getFormFieldOptions(props, merge) as any,
    )
  }

  resultGroup.ArrayField = function ArrayField(props) {
    return createComponent(
      form.ArrayField as Component<any>,
      group._getFormFieldOptions(props, merge) as any,
    )
  }

  resultGroup.Subscribe = function GroupSubscribe(props) {
    return createComponent(
      Subscribe as Component<any>,
      merge(props, { source: group.atom }),
    )
  }

  return resultGroup
}

export const initializeForm = {
  create: (options: FormOptions<any, any, any, unknown>) =>
    new InternalFormApi(options),
  attach: (form: AnyInternalFormApi, target: object) => {
    attachSolidFormComponents(form, null, target)
  },
}

export function createInternalForm(
  options: () => FormOptions<any, any, any, unknown>,
  initialize: {
    create: (options: FormOptions<any, any, any, unknown>) => AnyInternalFormApi
    attach: (form: AnyInternalFormApi, target: object) => void
  },
): InternalSolidFormApi {
  const solidFormId = createUniqueId()
  const resolveOptions = () => {
    const current = options()
    return current.formId === undefined
      ? { ...current, formId: solidFormId }
      : current
  }
  // Built in a memo, so the form waits under `Loading` while an option (such
  // as `defaultValues` from a query) is still loading, instead of throwing.
  // The returned form holds the components and forwards everything else to
  // the built instance. Once built it is read directly, so reads in a
  // component body stay plain.
  let built: AnyInternalFormApi | undefined
  const instance = createMemo(
    () => built ?? (built = initialize.create(resolveOptions())),
  )
  const current = () => built ?? instance()

  createRenderEffect(
    () => [current(), resolveOptions()] as const,
    ([form, next]) => form._update(next as never),
  )
  createRenderEffect(current, (form) => form.mount())

  const components: Record<PropertyKey, unknown> = {}
  const owner = (key: PropertyKey) =>
    key in components ? components : current()
  const form = new Proxy(components, {
    // Solid checks whether a computed value is a promise or an async iterable
    // with an untracked read, which gives no instance while it is pending.
    get: (_, key) => {
      const target = owner(key) as object | undefined
      return target && Reflect.get(target, key)
    },
    set: (_, key, value) => Reflect.set(owner(key), key, value),
    has: (_, key) => {
      const target = owner(key) as object | undefined
      return !!target && key in target
    },
    ownKeys: () => [
      ...new Set([
        ...Reflect.ownKeys(current()),
        ...Reflect.ownKeys(components),
      ]),
    ],
    getOwnPropertyDescriptor: (_, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(owner(key), key)
      if (descriptor) descriptor.configurable = true
      return descriptor
    },
    getPrototypeOf: () => Reflect.getPrototypeOf(current()),
  }) as unknown as InternalSolidFormApi
  initialize.attach(form, components)

  return form
}
