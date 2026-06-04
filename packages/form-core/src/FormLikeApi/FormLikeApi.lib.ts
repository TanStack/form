import type { ReadonlyAtom } from '@tanstack/store'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  TryGetArrayElementType,
} from '../deep-keys.public'
import type { FieldUpdateOptions, Updater } from '../types.public'

export interface FormLikeState<TData> {
  values: TData
  isSubmitting: boolean
  isValid: boolean
  isInvalid: boolean
  errors: Array<any>
}

export interface FormLikeApi<TData> {
  store: ReadonlyAtom<FormLikeState<TData>>
  readonly state: FormLikeState<TData>
  handleSubmit: () => Promise<Array<any>>
  setFieldValue: <TFieldName extends DeepKeys<TData>>(
    fieldName: TFieldName,
    value: Updater<DeepValue<TData, TFieldName>>,
    options?: FieldUpdateOptions,
  ) => void
  getFieldValue: <TFieldName extends DeepKeys<TData>>(
    fieldName: TFieldName,
  ) => DeepValue<TData, TFieldName>
  swapFieldValues: <
    TFieldName extends DeepKeysWhereValueIncludes<TData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    indexA: number,
    indexB: number,
    options?: FieldUpdateOptions,
  ) => void
  pushFieldValue: <
    TFieldName extends DeepKeysWhereValueIncludes<TData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    value: TryGetArrayElementType<DeepValue<TData, TFieldName>>,
    options?: FieldUpdateOptions,
  ) => void
  insertFieldValue: <
    TFieldName extends DeepKeysWhereValueIncludes<TData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    index: number,
    value: TryGetArrayElementType<DeepValue<TData, TFieldName>>,
    options?: FieldUpdateOptions,
  ) => void
  clearFieldValues: <
    TFieldName extends DeepKeysWhereValueIncludes<TData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    options?: FieldUpdateOptions,
  ) => void
  removeFieldValue: <
    TFieldName extends DeepKeysWhereValueIncludes<TData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    index: number,
    options?: FieldUpdateOptions,
  ) => void
  filterFieldValues: <
    TFieldName extends DeepKeysWhereValueIncludes<TData, Array<any>>,
  >(
    arrayFieldName: TFieldName,
    predicate: (
      value: TryGetArrayElementType<DeepValue<TData, TFieldName>>,
      index: number,
      array: DeepValue<TData, TFieldName>,
    ) => boolean,
    options?: FieldUpdateOptions & { thisArg?: any },
  ) => void
  resetField: <TFieldName extends DeepKeys<TData>>(
    fieldName: TFieldName,
  ) => void
}
