<script lang="ts">
  import type { ButtonContexts, ButtonTypes } from "../../lib"

  export let context: ButtonContexts
  export let action: () => void = () => {}
  export let cxtAction: () => void = () => {}
  export let type: ButtonTypes
</script>

<button
  class={context}
  type={type}
  on:click={action}
  on:contextmenu={cxtAction}
>
  <slot />
</button>

<style>
  button {
    border-radius: 4px;
    border: 1px solid transparent;
    text-align: center;
    text-decoration: none;
    padding: 0.375rem 0.75rem;
    font-size: inherit;
    cursor: pointer;
  }

  button.primary {
    display: block;
    margin-top: 5px;
    width: 100%;
    color: var(--color-btn-primary);
    background: var(--bg-btn-primary);
    border-color: var(--border-btn-primary);
  }

  button.primary:hover {
    background: var(--bg-btn-primary-hover);
    border-color: var(--border-btn-primary-hover);
  }

  button.neutral {
    display: inline-block;
    text-align: left;
    padding: 0;
    background: none;
    color: inherit;
  }

  button.neutral:hover {
    text-decoration: underline;
  }

  button.anchor {
    display: block;
    padding: 0.5rem 1rem;
    width: 100%;
    font-weight: bold;
    background: none;
  }

  button.anchor:hover {
    background: var(--bg-btn-anchor-hover);
  }
</style>
