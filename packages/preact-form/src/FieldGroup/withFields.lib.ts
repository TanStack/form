import Preact from 'preact/compat'
import { createAtom, shallow } from '@tanstack/preact-store'
import {
  defineFieldGroupFieldsRuntime,
  fieldGroupHelperRuntime,
  getBy,
  transformFieldOptionsFieldNames,
} from '@tanstack/form-core/internals'
import type { FunctionComponent } from 'preact/compat'
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
  cache.set(fieldName, {
    binding,
    name: resolvedName,
  })

  return resolvedName
}

function resolveFieldProps<TProps extends { name: string }>(
  props: TProps,
  resolveName: (name: string) => string,
): TProps {
  return transformFieldOptionsFieldNames(
    props,
    resolveName,
    (base, overrides) => ({
      ...base,
      ...overrides,
    }),
  )
}

function createFieldGroupApi(
  form: any,
  bindingsRef: Preact.RefObject<FieldBindings>,
  fieldNames: Array<string>,
): AnyFieldGroupApi {
  const cache: ResolvedNameCache = new Map()
  const resolveName = (fieldName: string) =>
    resolveFieldName(bindingsRef.current!, cache, fieldName)
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

  const Field: FunctionComponent<any> = (props) => {
    const FormField = form.Field
    return Preact.createElement(
      FormField as FunctionComponent<any>,
      resolveFieldProps(props, resolveName),
    )
  }
  Field.displayName = 'TanStackForm.FieldGroup.Field'

  const ArrayField: FunctionComponent<any> = (props) => {
    const FormArrayField = form.ArrayField
    return Preact.createElement(
      FormArrayField as FunctionComponent<any>,
      resolveFieldProps(props, resolveName),
    )
  }
  ArrayField.displayName = 'TanStackForm.FieldGroup.ArrayField'

  const Subscribe: FunctionComponent<any> = (props) => {
    const FormSubscribe = form.Subscribe
    return Preact.createElement(FormSubscribe as FunctionComponent<any>, props)
  }
  Subscribe.displayName = 'TanStackForm.FieldGroup.Subscribe'

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

export function defineFieldGroupRuntime<
  TFields extends Record<string, unknown>,
>(defineFieldGroupFn: (helperRuntime: any) => TFields) {
  const fields = defineFieldGroupFieldsRuntime(
    defineFieldGroupFn(fieldGroupHelperRuntime),
  )

  return {
    fields,
    bindComponent: (
      Component: (props: any) => unknown,
      fieldsPropName: string,
    ) => withFieldsRuntime(fields, Component, fieldsPropName),
  }
}

function withFieldsRuntime(
  fields: Record<string, unknown>,
  Component: (props: any) => unknown,
  fieldsPropName: string,
) {
  const fieldNames = Object.keys(fields)

  const FieldGroupComponent = (props: any) => {
    const { form, ...restProps } = props
    const bindingsRef = Preact.useRef<FieldBindings>(props[fieldsPropName])

    if (!form) {
      throw new Error('TanStack Form: Field groups must receive a `form` prop.')
    }

    bindingsRef.current = props[fieldsPropName]

    const fieldGroupApi = Preact.useMemo(
      () => createFieldGroupApi(form as never, bindingsRef, fieldNames),
      [form],
    )

    return Component({
      ...restProps,
      [fieldsPropName]: fieldGroupApi,
    })
  }

  FieldGroupComponent.displayName = 'TanStackForm.FieldGroup'

  return FieldGroupComponent
}
