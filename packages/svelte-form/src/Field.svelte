<script module lang="ts">
  import { shallow, useSelector } from '@tanstack/svelte-store'
  import type {
    FieldApi,
    FieldApiOptions,
    FieldValidators,
    FormErrorTypes,
    ToFieldError,
  } from '@tanstack/form-core'
  import type {
    AnyInternalFieldApi,
    AnyInternalFormApi,
    InternalBaseFieldMeta,
  } from '@tanstack/form-core/internals'

  interface InternalFieldOptions
    extends FieldApiOptions<any, any, any, any, any, any, any> {
    form: AnyInternalFormApi
  }

  function useDynamicFieldSelector<TSelected>(
    getField: () => AnyInternalFieldApi,
    selector: (field: AnyInternalFieldApi) => TSelected,
  ) {
    let selected = $state.raw(selector(getField()))

    $effect(() => {
      const field = getField()
      const update = () => {
        const next = selector(field)
        if (!shallow(selected, next)) selected = next
      }
      update()
      const subscription = field.atom.subscribe(update)
      return () => subscription.unsubscribe()
    })

    return {
      get current() {
        return selected
      },
    }
  }

  export function createField<
    TFieldData,
    TFieldName,
    TFieldValue,
    const TFieldValidators extends FieldValidators<
      TFieldData,
      TFieldName,
      TFieldValue
    >,
    TGroupFieldError,
    TFormData,
    TFormErrorTypes extends FormErrorTypes,
  >(
    options: () =>
      & FieldApiOptions<
        TFieldData,
        TFieldName,
        TFieldValue,
        TFieldValidators,
        TGroupFieldError,
        TFormData,
        TFormErrorTypes
      >
      & { form: AnyInternalFormApi },
    array = false,
  ): FieldApi<
    TFieldName,
    TFieldValue,
    ToFieldError<TFieldValidators, TGroupFieldError, TFormErrorTypes>,
    TFormData,
    TFormErrorTypes
  > {
    const initialForm = options().form
    const resetVersion = useSelector(initialForm._atoms.resetVersion)
    const fieldApi = $derived.by(() => {
      resetVersion.current
      const current = options()
      return current.form._getOrCreateFieldApi({
        ...current,
        name: current.name,
      } as never)
    })

    $effect.pre(() => {
      fieldApi._update(options() as InternalFieldOptions)
    })

    $effect(() => fieldApi._register())

    const selected = useDynamicFieldSelector(
      () => fieldApi,
      (array
        ? (field) => ({
            length: field.value.length,
            version: (field.meta as InternalBaseFieldMeta)._arrayVersion,
          })
        : (field) => ({ value: field.value, meta: field.meta })) as (
        field: AnyInternalFieldApi,
      ) => any,
    )

    return new Proxy({} as AnyInternalFieldApi, {
      get(target, property) {
        if (Reflect.has(target, property)) return Reflect.get(target, property)
        const field = fieldApi
        const state = selected.current
        if (property === 'value') {
          return array ? field.value : (state as any).value
        }
        if (property === 'meta') {
          return array ? field.meta : (state as any).meta
        }
        if (property === 'errors') {
          return array ? field.errors : (state as any).meta.errors
        }
        const value = Reflect.get(field, property, field)
        return typeof value === 'function' ? value.bind(field) : value
      },
    }) as never
  }
</script>

<script lang="ts">
  import { setContext, untrack, type Snippet } from 'svelte'
  import { fieldContextKey } from './context-keys.js'

  interface Props extends InternalFieldOptions {
    array?: boolean
    children: Snippet<[any]>
    fieldComponents?: Record<string, any>
  }

  let {
    children,
    array = false,
    fieldComponents = {},
    ...fieldOptions
  }: Props = $props()

  const fieldApi = createField(
    () => fieldOptions,
    untrack(() => array),
  )
  Object.assign(fieldApi, untrack(() => fieldComponents))
  setContext(fieldContextKey, fieldApi)
</script>

{@render children(fieldApi)}
