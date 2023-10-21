import { FieldApi } from '@tanstack/form-core'
import type { DeepKeys, DeepValue, Narrow } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue-demi'
import type { SlotsType, SetupContext, Ref } from 'vue-demi'
import { provideFormContext, useFormContext } from './formContext'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TParentData,
    TName extends DeepKeys<TParentData>,
    ValidatorType,
    FormValidator,
    TData = DeepValue<TParentData, TName>,
  > {
    Field: FieldComponent<TData, FormValidator>
  }
}

export type UseField<TParentData, FormValidator> = <
  TName extends DeepKeys<TParentData>,
  ValidatorType,
>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    DeepValue<TParentData, TName>
  >,
) => FieldApi<
  TParentData,
  TName,
  ValidatorType,
  FormValidator,
  DeepValue<TParentData, TName>
>

export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: UseFieldOptions<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
  >,
): {
  api: FieldApi<
    TParentData,
    TName,
    ValidatorType,
    FormValidator,
    TData
    // Omit<typeof opts, 'onMount'> & {
    //   form: FormApi<TParentData>
    // }
  >
  state: Readonly<
    Ref<
      FieldApi<
        TParentData,
        TName,
        ValidatorType,
        FormValidator,
        TData
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
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
> = (TParentData extends any[]
  ? {
      name?: TName
      index: number
    }
  : {
      name: TName
      index?: never
    }) &
  Omit<
    UseFieldOptions<TParentData, TName, ValidatorType, FormValidator>,
    'name' | 'index'
  >

export type FieldComponent<TParentData, FormValidator> = <
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  fieldOptions: FieldComponentProps<
    TParentData,
    TName,
    ValidatorType,
    FormValidator
  >,
  context: SetupContext<
    {},
    SlotsType<{
      default: {
        field: FieldApi<TParentData, TName, ValidatorType, FormValidator, TData>
        state: FieldApi<
          TParentData,
          TName,
          ValidatorType,
          FormValidator,
          TData
        >['state']
      }
    }>
  >,
) => any

export const Field = defineComponent(
  <
    TParentData,
    TName extends DeepKeys<TParentData>,
    ValidatorType,
    FormValidator,
  >(
    fieldOptions: UseFieldOptions<
      TParentData,
      TName,
      ValidatorType,
      FormValidator
    >,
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
