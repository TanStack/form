<svelte:options runes />

<script lang="ts">
  import { createForm } from '../../src/index.js'
  import { NameFields } from './field-component.js'

  const form = createForm(() => ({
    defaultValues: {
      profile: { name: 'Initial' },
      items: ['a', 'b', 'c'],
    },
  }))
</script>

<NameFields
  form={form}
  fields={{ name: 'profile.name', items: 'items' }}
/>
