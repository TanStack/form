<script lang="ts">
  import type { emergencyContactFields } from './emergency-contact.js'

  export interface Props {
    fields: typeof emergencyContactFields
  }

  const { fields }: Props = $props()
</script>

<fields.Field name="fullName">
  {#snippet children(field)}<field.TextField label="Full Name" />{/snippet}
</fields.Field>
<fields.Field name="phone">
  {#snippet children(field)}<field.TextField label="Phone" />{/snippet}
</fields.Field>
