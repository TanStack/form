<svelte:options runes />

<script lang="ts">
  import { createFormHook } from '../../src/index.js'

  let formCalls = $state<Array<string>>([])
  let fieldCalls = $state<Array<string>>([])
  let invalidCalls = $state(0)
  const { useAppForm } = createFormHook({
    fieldComponents: {},
    formComponents: {},
    defaultFormOptions: {
      listenersMerge: 'append',
      listeners: [
        {
          triggers: ['change'],
          run: () => {
            formCalls = [...formCalls, 'default']
          },
        },
      ],
    },
    defaultFieldOptions: {
      listenersMerge: 'prepend',
      listeners: [
        {
          triggers: ['change'],
          run: ({ fieldApi }) => {
            fieldCalls = [
              ...fieldCalls,
              `default:${String(fieldApi.name)}`,
            ]
          },
        },
      ],
    },
    defaultFormGroupOptions: {
      onSubmitInvalid: () => {
        invalidCalls++
      },
    },
  })
  const form = useAppForm(() => ({
    defaultValues: {
      direct: '',
      directArray: ['one'],
      group: {
        field: '',
        array: ['one'],
      },
    },
    listeners: [
      {
        triggers: ['change'],
        run: () => {
          formCalls = [...formCalls, 'local']
        },
      },
    ],
  }))
</script>

<form.Field
  name="direct"
  listeners={[
    {
      triggers: ['change'],
      run: ({ fieldApi }) => {
        fieldCalls = [...fieldCalls, `local:${String(fieldApi.name)}`]
      },
    },
  ]}
>
  {#snippet children(field)}
    <button
      type="button"
      onclick={() => field.handleChange('changed')}
    >
      Change direct field
    </button>
  {/snippet}
</form.Field>

<form.ArrayField name="directArray">
  {#snippet children(field)}
    <button
      type="button"
      onclick={() => field.handleChange([...field.value, 'two'])}
    >
      Change direct array field
    </button>
  {/snippet}
</form.ArrayField>

<form.FormGroup
  name="group"
  validators={[
    {
      triggers: [],
      run: () => 'Invalid group',
    },
  ]}
>
  {#snippet children(group)}
    <group.Field name="field">
      {#snippet children(field)}
        <button
          type="button"
          onclick={() => field.handleChange('changed')}
        >
          Change grouped field
        </button>
      {/snippet}
    </group.Field>
    <group.ArrayField name="array">
      {#snippet children(field)}
        <button
          type="button"
          onclick={() => field.handleChange([...field.value, 'two'])}
        >
          Change grouped array field
        </button>
      {/snippet}
    </group.ArrayField>
    <button
      type="button"
      onclick={() => group.handleSubmit()}
    >
      Submit group
    </button>
  {/snippet}
</form.FormGroup>

<output data-testid="form-calls">{formCalls.join(',')}</output>
<output data-testid="field-calls">{fieldCalls.join(',')}</output>
<output data-testid="invalid-calls">{invalidCalls}</output>
