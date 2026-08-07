import { createAtom, shallow } from '@tanstack/vue-store'
import {
  getBy,
  transformFieldOptionsFieldNames,
} from '@tanstack/form-core/internals'
import { computed, defineComponent, h } from 'vue'
import type { Component } from 'vue'
import type { AnyFieldGroupApi } from './FieldGroupApi.public'

type FieldBindings = Record<string, string>
interface ResolvedNameCacheEntry {
  binding: string
  name: string
}
type ResolvedNameCache = Map<string, ResolvedNameCacheEntry>

function getRootSegmentEnd(name: string): number {
  const dotIndex = name.indexOf('.')
  const arrayIndex = name.indexOf('[')
  if (dotIndex === -1) return arrayIndex === -1 ? name.length : arrayIndex
  if (arrayIndex === -1) return dotIndex
  return Math.min(dotIndex, arrayIndex)
}

function resolveFieldName(
  bindings: FieldBindings,
  cache: ResolvedNameCache,
  fieldName: string,
): string {
  const rootEnd = getRootSegmentEnd(fieldName)
  const rootName = fieldName.slice(0, rootEnd)
  const binding = bindings[rootName]
  if (binding === undefined) {
    throw new Error(
      `TanStack Form: Missing field group binding for "${rootName}".`,
    )
  }
  const cached = cache.get(fieldName)
  if (cached?.binding === binding) return cached.name

  const name = `${binding}${fieldName.slice(rootEnd)}`
  cache.set(fieldName, { binding, name })
  return name
}

function createFieldGroupApi(
  form: any,
  getBindings: () => FieldBindings,
  fieldNames: Array<string>,
): AnyFieldGroupApi {
  const cache: ResolvedNameCache = new Map()
  const resolveName = (fieldName: string) =>
    resolveFieldName(getBindings(), cache, fieldName)
  const atom = createAtom(
    () => {
      const nextValues: Record<string, unknown> = {}
      const formValues = form._atoms.values.get()
      for (const fieldName of fieldNames) {
        nextValues[fieldName] = getBy(formValues, resolveName(fieldName))
      }
      return nextValues
    },
    { compare: shallow },
  )

  const forwardField = (component: Component, name: string) =>
    defineComponent(
      (_props, context) => {
        const resolved = computed(() =>
          transformFieldOptionsFieldNames(
            { ...context.attrs } as never,
            resolveName,
          ),
        )
        return () => h(component, resolved.value as never, context.slots)
      },
      { name, inheritAttrs: false },
    )

  const Field = forwardField(form.Field, 'TanStackForm.FieldGroup.Field')
  const ArrayField = forwardField(
    form.ArrayField,
    'TanStackForm.FieldGroup.ArrayField',
  )
  const Subscribe = defineComponent(
    (_props, context) => () =>
      h(form.Subscribe, { ...context.attrs } as never, context.slots),
    { name: 'TanStackForm.FieldGroup.Subscribe', inheritAttrs: false },
  )

  return {
    atom,
    Field,
    ArrayField,
    Subscribe,
    getFieldValue: (fieldName: string) =>
      form.getFieldValue(resolveName(fieldName)),
    setFieldValue: (fieldName: string, value: unknown, options?: unknown) =>
      form.setFieldValue(resolveName(fieldName), value, options),
    resetField: (fieldName: string) => form.resetField(resolveName(fieldName)),
    swapFieldValues: (
      fieldName: string,
      indexA: number,
      indexB: number,
      options?: unknown,
    ) => form.swapFieldValues(resolveName(fieldName), indexA, indexB, options),
    moveFieldValue: (
      fieldName: string,
      fromIndex: number,
      toIndex: number,
      options?: unknown,
    ) =>
      form.moveFieldValue(resolveName(fieldName), fromIndex, toIndex, options),
    pushFieldValue: (fieldName: string, value: unknown, options?: unknown) =>
      form.pushFieldValue(resolveName(fieldName), value, options),
    insertFieldValue: (
      fieldName: string,
      index: number,
      value: unknown,
      options?: unknown,
    ) => form.insertFieldValue(resolveName(fieldName), index, value, options),
    clearFieldValues: (fieldName: string, options?: unknown) =>
      form.clearFieldValues(resolveName(fieldName), options),
    removeFieldValue: (fieldName: string, index: number, options?: unknown) =>
      form.removeFieldValue(resolveName(fieldName), index, options),
    filterFieldValues: (
      fieldName: string,
      predicate: (...args: Array<any>) => boolean,
      options?: unknown,
    ) => form.filterFieldValues(resolveName(fieldName), predicate, options),
  } as never
}

export const helperRuntime = {
  strict: () => null,
  loose: () => null,
}

export function defineFieldsRuntime<TFields>(fields: TFields): TFields {
  return fields
}

export function withFieldsRuntime(
  fields: AnyFieldGroupApi,
  component: Component,
  fieldsPropName: string,
) {
  const fieldNames = Object.keys(fields as unknown as Record<string, unknown>)

  return defineComponent(
    (_props, context) => {
      const form = context.attrs.form as any
      if (!form) {
        throw new Error(
          'TanStack Form: Field groups must receive a `form` prop.',
        )
      }

      const fieldGroupApi = createFieldGroupApi(
        form,
        () => context.attrs[fieldsPropName] as FieldBindings,
        fieldNames,
      )

      return () => {
        const componentProps = { ...context.attrs }
        delete componentProps.form
        delete componentProps[fieldsPropName]
        componentProps[fieldsPropName] = fieldGroupApi
        return h(component, componentProps, context.slots)
      }
    },
    { name: 'TanStackForm.FieldGroup', inheritAttrs: false },
  )
}
