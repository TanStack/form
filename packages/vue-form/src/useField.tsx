import { FieldApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue'
import type {
  DeepKeys,
  DeepValue,
  Narrow,
  Validator,
} from '@tanstack/form-core'
import type { Ref, SetupContext, SlotsType } from 'vue'
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
    Field: FieldComponent<TParentData, TFormValidator>
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
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: Omit<
    UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>,
    'form'
  >,
) => {
  api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
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
}

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
  api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData>
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
  const fieldApi = (() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
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
      fieldApi.update({ ...opts, form: opts.form } as never)
    },
  )

  return { api: fieldApi, state: fieldState } as never
}

type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator>

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
  fieldOptions: Omit<
    FieldComponentProps<TParentData, TName, TFieldValidator, TFormValidator>,
    'form'
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

    return () =>
      context.slots.default!({
        field: fieldApi.api,
        state: fieldApi.state.value,
      })
  },
  { name: 'Field', inheritAttrs: false },
)
