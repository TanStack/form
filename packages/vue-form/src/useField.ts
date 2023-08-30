import {
  DeepKeys,
  DeepValue,
  FieldApi,
  FieldOptions,
  Narrow,
} from '@tanstack/form-core'
import { watchEffect } from 'vue-demi'
import { useFormContext } from './formContext'
import Field from './Field.vue'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<TData, TFormData> {
    Field: typeof Field
  }
}

export interface UseFieldOptions<TData, TFormData>
  extends FieldOptions<TData, TFormData> {
  mode?: 'value' | 'array'
}

export type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(
  opts?: { name: Narrow<TField> } & UseFieldOptions<
    DeepValue<TFormData, TField>,
    TFormData
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData>

export function useField<TData, TFormData>(
  opts: UseFieldOptions<TData, TFormData>,
): FieldApi<TData, TFormData> {
  // Get the form API either manually or from context
  const { formApi, parentFieldName } = useFormContext()

  const fieldApi = (() => {
    const name = (
      typeof opts.index === 'number'
        ? [parentFieldName, opts.index, opts.name]
        : [parentFieldName, opts.name]
    )
      .filter((d) => d !== undefined)
      .join('.')

    const api = new FieldApi({ ...opts, form: formApi, name: name as any })

    api.Field = Field as any

    return api
  })()

  // Keep options up to date as they are rendered
  fieldApi.update({ ...opts, form: formApi } as never)

  // useStore(
  //   fieldApi.store as any,
  //   opts.mode === 'array'
  //     ? (state: any) => {
  //         return [state.meta, Object.keys(state.value || []).length]
  //       }
  //     : undefined,
  // )

  watchEffect((onCleanup) => {
    const cleanup = fieldApi.mount()
    onCleanup(() => cleanup())
  })

  return fieldApi
}
