import { FieldApi } from '@tanstack/form-core'
import type {
  DeepKeys,
  DeepValue,
  Narrow,
  ResolveData,
} from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue-demi'
import type { SlotsType, SetupContext, Ref } from 'vue-demi'
import { provideFormContext, useFormContext } from './formContext'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TData,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TResolvedData extends ResolveData<TData, TParentData, TName> = ResolveData<
      TData,
      TParentData,
      TName
    >,
  > {
    Field: FieldComponent<TResolvedData>
  }
}

export type UseField<TParentData> = <TName extends DeepKeys<TParentData>>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<
    DeepValue<TParentData, TName>,
    TParentData,
    TName
  >,
) => FieldApi<DeepValue<TParentData, TName>, TParentData, TName>

export function useField<
  TData,
  TParentData,
  TName extends DeepKeys<TParentData>,
>(
  opts: UseFieldOptions<TData, TParentData, TName>,
): {
  api: FieldApi<
    TData,
    TParentData,
    TName
    // Omit<typeof opts, 'onMount'> & {
    //   form: FormApi<TParentData>
    // }
  >
  state: Readonly<
    Ref<
      FieldApi<
        TData,
        TParentData,
        TName
        // Omit<typeof opts, 'onMount'> & {
        //   form: FormApi<TParentData>
        // }
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

export type FieldValue<TParentData, TName> = TParentData extends any[]
  ? unknown extends TName
    ? TParentData[number]
    : DeepValue<TParentData[number], TName>
  : DeepValue<TParentData, TName>

type FieldComponentProps<
  TData,
  TParentData,
  TName extends DeepKeys<TParentData>,
> = (TParentData extends any[]
  ? {
      name?: TName
      index: number
    }
  : {
      name: TName
      index?: never
    }) &
  Omit<UseFieldOptions<TData, TParentData, TName>, 'name' | 'index'>

export type FieldComponent<TParentData> = <
  TData,
  TName extends DeepKeys<TParentData>,
  TResolvedData extends ResolveData<TData, TParentData, TName> = ResolveData<
    TData,
    TParentData,
    TName
  >,
>(
  fieldOptions: FieldComponentProps<TData, TParentData, TName>,
  context: SetupContext<
    {},
    SlotsType<{
      default: {
        field: FieldApi<TData, TParentData, TName, TResolvedData>
        state: FieldApi<TData, TParentData, TName, TResolvedData>['state']
      }
    }>
  >,
) => any

export const Field = defineComponent(
  <TData, TParentData, TName extends DeepKeys<TParentData>>(
    fieldOptions: UseFieldOptions<TData, TParentData, TName>,
    context: SetupContext,
  ) => {
    const fieldApi = useField({ ...fieldOptions, ...context.attrs } as any)

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
