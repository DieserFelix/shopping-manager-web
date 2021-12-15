<script lang="ts">
  import type { InputTypes } from "../../lib"

  export let label: string = ""
  export let id: string
  export let type: InputTypes
  export let value: string

  const handleChange = (e) => {
    value = e.target.value
  }
</script>

{#if label}
  <label for={id}>{label}</label>
{/if}
<input id={id} type={type} value={value} on:change={handleChange} />

<style>
  input {
    width: 100%;
    height: 30px;
    font-size: 1rem;
    background: var(--bg-input);
    border: 1px solid var(--border-main);
    border-radius: 5px;
  }

  input:focus {
    outline: none !important;
    border: 2px solid var(--border-secondary);
  }
</style>
