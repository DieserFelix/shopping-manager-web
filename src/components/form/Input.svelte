<script lang="ts">
  import { onMount } from "svelte"
  import type { InputTypes } from "../../lib"

  export let label: string = ""
  export let id: string = undefined
  export let type: InputTypes
  export let value: string
  export let focus: boolean = false
  export let blurHandler: () => void = () => {}

  const inputHandler = (e) => {
    value = e.target.value
  }
  let inputElement: HTMLInputElement
  onMount(() => {
    inputElement.focus()
    inputElement.setSelectionRange(0, inputElement.value.length, "forward")
  })
</script>

{#if label}
  <label for={id}>{label}</label>
{/if}
<input
  bind:this={inputElement}
  id={id}
  type={type}
  value={value}
  on:input={inputHandler}
  on:focus={() => (focus = true)}
  on:blur={() => {
    setTimeout(() => {
      blurHandler()
      focus = false
    }, 300)
  }}
/>

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
