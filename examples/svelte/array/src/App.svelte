<script lang="ts">
  import ArrayForm from './ArrayForm.svelte'
  import './index.css'

  let itemAmount = $state(50)
  let requestedAmount = $state(50)
  let items = $derived(Array.from({ length: itemAmount }, () => ''))

  function updateItems() {
    if (!Number.isNaN(requestedAmount)) {
      itemAmount = Math.min(10_000, Math.max(0, requestedAmount))
    }
  }
</script>

<div>
  <h1>Arrays in Form Example</h1>
  <label for="itemsAmount">
    Enter the amount of items to render with the form.
    <br />
    Note that it will reset the state.
  </label>
  <br />
  <input
    id="itemsAmount"
    type="number"
    bind:value={requestedAmount}
    min="1"
    step="1"
    max="10000"
  />
  <button type="button" onclick={updateItems}>Update</button>
  <br />
  {#key itemAmount}
    <ArrayForm {items} />
  {/key}
</div>
