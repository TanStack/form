<!-- TODO (43081j): figure out how to reference types in generics -->
<script lang="ts" generics="TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>
">
  import type { Snippet } from 'svelte';
  // TODO (43081j): somehow remove this circular reference
  import { createField } from './createField.svelte.js';
  import type { FieldOptions } from '@tanstack/form-core';

  type Props = {
    children: Snippet<[
      FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >
    ]>
  } & FieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >;

  let {
    children,
    ...fieldOptions
  }: Props = $props();

  const fieldApi = createField<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >(() => {
    return fieldOptions
  })
</script>

{@render children(fieldApi)}
