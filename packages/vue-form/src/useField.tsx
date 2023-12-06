import { FieldApi, type Validator } from '@tanstack/form-core'
import type { DeepKeys, DeepValue, Narrow } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue'
import type { SlotsType, SetupContext, Ref } from 'vue'
import { provideFormContext, useFormContext } from './formContext'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends
      | Validator<DeepValue<TParentData, TName>, unknown>
      | undefined = undefined,
    TFormValidator extends
      | Validator<TParentData, unknown>
      | undefined = undefined,
    TData = DeepValue<TParentData, TName>,
  > {
    Field: FieldComponent<TData, TFormValidator>
  }
}

export type UseField<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    DeepValue<TParentData, TName>
  >,
) => FieldApi<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  DeepValue<TParentData, TName>
>

export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: UseFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
): {
  api: FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
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
        TFieldValidator,
        TFormValidator,
        TData
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
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
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
    UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
    'name' | 'index'
  >

export type FieldComponent<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  fieldOptions: FieldComponentProps<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator
  >,
  context: SetupContext<
    {},
    SlotsType<{
      default: {
        field: FieldApi<
          TParentData,
          TName,
          TFieldValidator,
          TFormValidator,
          TData
        >
        state: FieldApi<
          TParentData,
          TName,
          TFieldValidator,
          TFormValidator,
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
    TFieldValidator extends
      | Validator<DeepValue<TParentData, TName>, unknown>
      | undefined = undefined,
    TFormValidator extends
      | Validator<TParentData, unknown>
      | undefined = undefined,
  >(
    fieldOptions: UseFieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator
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
