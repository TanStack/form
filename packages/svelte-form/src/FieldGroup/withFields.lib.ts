import { createAtom, shallow } from '@tanstack/svelte-store'
import {
  getBy,
  transformFieldOptionsFieldNames,
} from '@tanstack/form-core/internals'
import { withComponentProps } from '../utils.lib.js'
import type { Component } from 'svelte'
import type { AnyFieldGroupApi } from './FieldGroupApi.public'

type FieldBindings = Record<string, string>
type ResolvedNameCache = Map<string, { binding: string; name: string }>

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

function createFieldGroupApi(
  form: any,
  getBindings: () => FieldBindings,
  fieldNames: Array<string>,
): AnyFieldGroupApi {
  const cache: ResolvedNameCache = new Map()
  const resolveName = (name: string) =>
    resolveFieldName(getBindings(), cache, name)
  const atom = createAtom(
    () => {
      const values: Record<string, unknown> = {}
      const formValues = form._atoms.values.get()
      for (const fieldName of fieldNames) {
        values[fieldName] = getBy(formValues, resolveName(fieldName))
      }
      return values
    },
    { compare: shallow },
  )

  const resolveProps = (props: any) =>
    new Proxy(props, {
      get(target, property, receiver) {
        if (
          property === 'name' ||
          property === 'validators' ||
          property === 'listeners'
        ) {
          return Reflect.get(
            transformFieldOptionsFieldNames({ ...target }, resolveName),
            property,
          )
        }
        return Reflect.get(target, property, receiver)
      },
    })

  return {
    atom,
    Field: (internals: any, props: any) =>
      form.Field(internals, resolveProps(props)),
    ArrayField: (internals: any, props: any) =>
      form.ArrayField(internals, resolveProps(props)),
    Subscribe: (internals: any, props: any) => form.Subscribe(internals, props),
    getFieldValue: (name: string) => form.getFieldValue(resolveName(name)),
    setFieldValue: (name: string, value: unknown, options?: unknown) =>
      form.setFieldValue(resolveName(name), value, options),
    resetField: (name: string) => form.resetField(resolveName(name)),
    swapFieldValues: (
      name: string,
      indexA: number,
      indexB: number,
      options?: unknown,
    ) => form.swapFieldValues(resolveName(name), indexA, indexB, options),
    moveFieldValue: (
      name: string,
      fromIndex: number,
      toIndex: number,
      options?: unknown,
    ) => form.moveFieldValue(resolveName(name), fromIndex, toIndex, options),
    pushFieldValue: (name: string, value: unknown, options?: unknown) =>
      form.pushFieldValue(resolveName(name), value, options),
    insertFieldValue: (
      name: string,
      index: number,
      value: unknown,
      options?: unknown,
    ) => form.insertFieldValue(resolveName(name), index, value, options),
    clearFieldValues: (name: string, options?: unknown) =>
      form.clearFieldValues(resolveName(name), options),
    removeFieldValue: (name: string, index: number, options?: unknown) =>
      form.removeFieldValue(resolveName(name), index, options),
    filterFieldValues: (
      name: string,
      predicate: (...args: Array<any>) => boolean,
      options?: unknown,
    ) => form.filterFieldValues(resolveName(name), predicate, options),
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
  return ((internals: any, props: any) => {
    const form = props.form
    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }
    const api = createFieldGroupApi(
      form,
      () => props[fieldsPropName],
      fieldNames,
    )
    return Component(
      internals,
      withComponentProps(props, {
        form: undefined,
        [fieldsPropName]: api,
      }),
    )
  }) as Component<any>
}
