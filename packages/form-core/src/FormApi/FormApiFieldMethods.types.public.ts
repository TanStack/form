import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { FieldUpdateOptions } from '../types.public'

export type SetFieldValueFn<in out TFormData> = <
  TDeepKeys extends DeepKeys<TFormData>,
>(
  DeepKeys: TDeepKeys,
  value: DeepValue<TFormData, TDeepKeys>,
  options?: FieldUpdateOptions,
) => void

export type GetFieldValueFn<in out TFormData> = <
  TDeepKeys extends DeepKeys<TFormData>,
>(
  DeepKeys: TDeepKeys,
) => DeepValue<TFormData, TDeepKeys>

export type ResetFieldFn<in out TFormData> = <TDeepKeys extends DeepKeys<TFormData>>(
  DeepKeys: TDeepKeys,
) => void

export interface FormApiFieldMethods<in out TFormData> {
  /**
   * TODO
   * @param DeepKeys
   * @param updater
   */
  setFieldValue: SetFieldValueFn<TFormData>

  /**
   * TODO
   * @param DeepKeys
   * @returns
   */
  getFieldValue: GetFieldValueFn<TFormData>

  resetField: ResetFieldFn<TFormData>
}
