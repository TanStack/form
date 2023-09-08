import {
  FieldApi,
  type FieldApiOptions,
  type FormApi,
} from '@tanstack/form-core'
import type {
  DeepKeys,
  DeepValue,
  FieldOptions,
  Narrow,
} from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue-demi'
import type { SlotsType, SetupContext, Ref } from 'vue-demi'
import { provideFormContext, useFormContext } from './formContext'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<TData, TFormData> {
    Field: FieldComponent<TFormData>
  }
}

export type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(
  opts?: { name: Narrow<TField> } & FieldOptions<
    DeepValue<TFormData, TField>,
    TFormData
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData>

export function useField<
  TData,
  TFormData,
  TName extends unknown extends TFormData
    ? string
    : DeepKeys<TFormData> = unknown extends TFormData
    ? string
    : DeepKeys<TFormData>,
>(
  opts: FieldOptions<TData, TFormData, TName>,
): {
  api: FieldApi<
    TData,
    TFormData,
    Omit<typeof opts, 'onMount'> & {
      form: FormApi<TFormData>
    }
  >
  state: Readonly<
    Ref<
      FieldApi<
        TData,
        TFormData,
        Omit<typeof opts, 'onMount'> & {
          form: FormApi<TFormData>
        }
      >['state']
    >
  >
} {
  // Get the form API either manually or from context
  const { formApi, parentFieldName } = useFormContext()

  const fieldApi = (() => {
    const api = new FieldApi({
      ...opts,
      form: formApi,
      name: opts.name,
    } as never)

    api.Field = Field as never

    return api
  })()

  const fieldState = useStore(fieldApi.store, (state) => state)

  let cleanup!: () => void
  onMounted(() => {
    cleanup = fieldApi.mount()
  })

  onUnmounted(() => {
    cleanup()
  })

  watch(
    () => opts,
    () => {
      // Keep options up to date as they are rendered
      fieldApi.update({ ...opts, form: formApi } as never)
    },
  )

  return { api: fieldApi, state: fieldState } as never
}

export type FieldValue<TFormData, TField> = TFormData extends any[]
  ? unknown extends TField
    ? TFormData[number]
    : DeepValue<TFormData[number], TField>
  : DeepValue<TFormData, TField>

interface FieldComponentProps<
  TFormData,
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
> extends Omit<FieldOptions<unknown, TFormData, TName>, 'name'> {
  name: TName
}

export type FieldComponent<TFormData> = <
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
>(
  fieldOptions: FieldComponentProps<TFormData, TName>,
  context: SetupContext<
    {},
    SlotsType<{
      default: {
        field: FieldApi<
          unknown,
          TFormData,
          FieldApiOptions<unknown, TFormData, TName>
        >
        state: FieldApi<
          unknown,
          TFormData,
          FieldApiOptions<unknown, TFormData, TName>
        >['state']
      }
    }>
  >,
) => any

export const Field = defineComponent(
  <TData, TFormData>(
    fieldOptions: FieldOptions<TData, TFormData>,
    context: SetupContext,
  ) => {
    const fieldApi = useField({ ...fieldOptions, ...context.attrs })

    provideFormContext({
      formApi: fieldApi.api.form,
      parentFieldName: fieldApi.api.name,
    } as never)

    return () =>
      context.slots.default!({
        field: fieldApi.api,
        state: fieldApi.state.value,
      })
  },
  { name: 'Field', inheritAttrs: false },
)
