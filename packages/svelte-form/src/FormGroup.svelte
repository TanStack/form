<script module lang="ts">
  import { InternalFormGroupApi } from '@tanstack/form-core/internals'
  import { useSelector } from '@tanstack/svelte-store'
  import { withComponentProps } from './utils.lib.js'
  import type {
    FormErrorTypes,
    FormGroupApi,
    FormGroupOptions,
    FormGroupValidators,
    ToFormGroupErrorTypes,
  } from '@tanstack/form-core'
  import type { AnyInternalFormApi } from '@tanstack/form-core/internals'

  export function createFormGroup<
    TFormData,
    TGroupName,
    TGroupValue,
    const TGroupValidators extends FormGroupValidators<TGroupValue>,
    TFormErrorTypes extends FormErrorTypes,
  >(
    options: () => FormGroupOptions<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormErrorTypes
    >,
  ): FormGroupApi<
    TFormData,
    TGroupName,
    TGroupValue,
    ToFormGroupErrorTypes<TGroupValidators>,
    TFormErrorTypes
  > {
    const group = new InternalFormGroupApi(options() as never)

    $effect.pre(() => {
      group.update(options() as never)
    })
    $effect(() => {
      group.mount()
      return () => group._cleanup()
    })

    const state = useSelector(group.atom)

    return new Proxy({} as typeof group, {
      get(target, property) {
        if (Reflect.has(target, property)) return Reflect.get(target, property)
        if (property === 'state') return state.current
        if (property === 'value') return state.current.values
        const value = Reflect.get(group, property, group)
        return typeof value === 'function' ? value.bind(group) : value
      },
    }) as never
  }

  export function attachGroupComponents(
    group: any,
    form: AnyInternalFormApi & Record<string, any>,
  ) {
    group.Field = (internals: any, props: any) =>
      form.Field(
        internals,
        group._getFormFieldOptions(props, withComponentProps),
      )
    group.ArrayField = (internals: any, props: any) =>
      form.ArrayField(
        internals,
        group._getFormFieldOptions(props, withComponentProps),
      )
    group.Subscribe = (internals: any, props: any) =>
      form._Subscribe(
        internals,
        withComponentProps(props, { source: group.atom }),
      )
    return group
  }
</script>

<script lang="ts">
  import { untrack, type Snippet } from 'svelte'

  interface Props {
    form: AnyInternalFormApi & Record<string, any>
    children: Snippet<[any]>
    name: string
    validators?: any
    onSubmit?: any
    onSubmitInvalid?: any
  }

  let { children, form, ...groupOptions }: Props = $props()
  const initialForm = untrack(() => form)
  const groupApi = attachGroupComponents(
    createFormGroup(() => ({ ...groupOptions, form: initialForm }) as never),
    initialForm,
  )
</script>

{@render children(groupApi)}
