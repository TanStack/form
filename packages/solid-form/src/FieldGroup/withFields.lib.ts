import { createAtom, shallow } from '@tanstack/solid-store'
import {
  getBy,
  transformFieldOptionsFieldNames,
} from '@tanstack/form-core/internals'
import { createComponent, mergeProps, splitProps } from 'solid-js'
import type { Component } from 'solid-js'
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

  const resolvedName = `${binding}${fieldName.slice(rootEnd)}`
  cache.set(fieldName, { binding, name: resolvedName })
  return resolvedName
}

function resolveFieldProps<TProps extends { name: string }>(
  props: TProps,
  resolveName: (name: string) => string,
): TProps {
  return transformFieldOptionsFieldNames(
    props,
    resolveName,
    (base, overrides) => mergeProps(base, overrides) as TProps,
  )
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

  const Field: Component<any> = (props) =>
    createComponent(
      form.Field as Component<any>,
      resolveFieldProps(props, resolveName),
    )
  const ArrayField: Component<any> = (props) =>
    createComponent(
      form.ArrayField as Component<any>,
      resolveFieldProps(props, resolveName),
    )
  const Subscribe: Component<any> = (props) =>
    createComponent(form.Subscribe as Component<any>, props)

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
  Component: Component<any>,
  fieldsPropName: string,
) {
  const fieldNames = Object.keys(fields as unknown as Record<string, unknown>)

  return function FieldGroupComponent(props: any) {
    const [localProps, restProps] = splitProps(props, ['form', fieldsPropName])
    const form = localProps.form
    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }

    const fieldGroupApi = createFieldGroupApi(
      form,
      () => localProps[fieldsPropName] as FieldBindings,
      fieldNames,
    )

    return createComponent(
      Component,
      mergeProps(restProps, { [fieldsPropName]: fieldGroupApi }),
    )
  }
}
