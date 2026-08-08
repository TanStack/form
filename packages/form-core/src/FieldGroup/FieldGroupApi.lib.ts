import { createAtom, shallow } from '@tanstack/store'
import { transformFieldOptionsFieldNames } from '../FieldApi/FieldApi.lib'
import { getBy } from '../utils.lib'
import type { AnyFieldApiOptions } from '../FieldApi/FieldApi.lib'
import type { AnyInternalFormApi } from '../FormApi/FormApi.lib'
import type { InternalFieldUpdateOptions } from '../types.lib'
import type { ReadonlyAtom } from '@tanstack/store'

export type InternalFieldGroupBindings = Record<string, string>

export interface InternalFieldGroupOptions {
  form: AnyInternalFormApi
  fieldNames: ReadonlyArray<string>
  getBindings: () => InternalFieldGroupBindings
}

interface ResolvedNameCacheEntry {
  binding: string
  name: string
}

function getRootSegmentEnd(name: string): number {
  const dotIndex = name.indexOf('.')
  const arrayIndex = name.indexOf('[')

  if (dotIndex === -1) return arrayIndex === -1 ? name.length : arrayIndex
  if (arrayIndex === -1) return dotIndex
  return Math.min(dotIndex, arrayIndex)
}

export class InternalFieldGroupApi {
  readonly atom: ReadonlyAtom<Record<string, unknown>>
  readonly form: AnyInternalFormApi
  readonly fieldNames: ReadonlyArray<string>
  private readonly getBindings: () => InternalFieldGroupBindings
  private readonly resolvedNameCache = new Map<string, ResolvedNameCacheEntry>()

  constructor(options: InternalFieldGroupOptions) {
    this.form = options.form
    this.fieldNames = options.fieldNames
    this.getBindings = options.getBindings
    this.atom = createAtom(
      () => {
        const nextValues: Record<string, unknown> = {}
        const formValues = this.form._atoms.values.get()

        for (const fieldName of this.fieldNames) {
          nextValues[fieldName] = getBy(
            formValues,
            this._resolveFieldName(fieldName),
          )
        }

        return nextValues
      },
      { compare: shallow },
    )
  }

  _resolveFieldName(fieldName: string): string {
    const rootEnd = getRootSegmentEnd(fieldName)
    const rootName = fieldName.slice(0, rootEnd)
    const binding = this.getBindings()[rootName]

    if (binding === undefined) {
      throw new Error(
        `TanStack Form: Missing field group binding for "${rootName}".`,
      )
    }

    const cached = this.resolvedNameCache.get(fieldName)
    if (cached?.binding === binding) return cached.name

    const resolvedName = `${binding}${fieldName.slice(rootEnd)}`
    this.resolvedNameCache.set(fieldName, { binding, name: resolvedName })
    return resolvedName
  }

  _getFormFieldOptions<TOptions extends AnyFieldApiOptions>(
    options: TOptions,
    mergeOptions: (props: TOptions, overrides: Partial<TOptions>) => TOptions,
  ): AnyFieldApiOptions {
    return transformFieldOptionsFieldNames(
      options,
      (fieldName) => this._resolveFieldName(fieldName),
      mergeOptions,
    )
  }

  getFieldValue = (fieldName: string) =>
    this.form.getFieldValue(this._resolveFieldName(fieldName))

  setFieldValue = (
    fieldName: string,
    value: unknown,
    options?: InternalFieldUpdateOptions,
  ) =>
    this.form.setFieldValue(this._resolveFieldName(fieldName), value, options)

  resetField = (fieldName: string) =>
    this.form.resetField(this._resolveFieldName(fieldName))

  swapFieldValues = (
    fieldName: string,
    indexA: number,
    indexB: number,
    options?: InternalFieldUpdateOptions,
  ) =>
    this.form.swapFieldValues(
      this._resolveFieldName(fieldName),
      indexA,
      indexB,
      options,
    )

  moveFieldValue = (
    fieldName: string,
    fromIndex: number,
    toIndex: number,
    options?: InternalFieldUpdateOptions,
  ) =>
    this.form.moveFieldValue(
      this._resolveFieldName(fieldName),
      fromIndex,
      toIndex,
      options,
    )

  pushFieldValue = (
    fieldName: string,
    value: unknown,
    options?: InternalFieldUpdateOptions,
  ) =>
    this.form.pushFieldValue(this._resolveFieldName(fieldName), value, options)

  insertFieldValue = (
    fieldName: string,
    index: number,
    value: unknown,
    options?: InternalFieldUpdateOptions,
  ) =>
    this.form.insertFieldValue(
      this._resolveFieldName(fieldName),
      index,
      value,
      options,
    )

  clearFieldValues = (
    fieldName: string,
    options?: InternalFieldUpdateOptions,
  ) => this.form.clearFieldValues(this._resolveFieldName(fieldName), options)

  removeFieldValue = (
    fieldName: string,
    index: number,
    options?: InternalFieldUpdateOptions,
  ) =>
    this.form.removeFieldValue(
      this._resolveFieldName(fieldName),
      index,
      options,
    )

  filterFieldValues = (
    fieldName: string,
    predicate: (...args: Array<any>) => boolean,
    options?: InternalFieldUpdateOptions & { thisArg?: any },
  ) =>
    this.form.filterFieldValues(
      this._resolveFieldName(fieldName),
      predicate,
      options,
    )
}

export const fieldGroupHelperRuntime = {
  strict: () => null,
  loose: () => null,
}

export function defineFieldGroupFieldsRuntime<TFields>(
  fields: TFields,
): TFields {
  return fields
}
