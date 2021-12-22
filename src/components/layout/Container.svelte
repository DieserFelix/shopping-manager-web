<script lang="ts">
  import { useFocus } from "svelte-navigator"
  const registerFocus = useFocus()

  $: cssVariables = Object.entries($$props)
    .filter(([key]) => key.startsWith("--"))
    .reduce((css, [key, value]) => `${css}${key}: ${value};`, "")
</script>

<div class="container" style={cssVariables} use:registerFocus>
  <slot />
</div>

<style>
  div.container {
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    min-height: calc(100vh - 50px);
    display: flex;
    flex-direction: var(--flex-direction);
    justify-content: var(--justify-content);
    align-items: center;
    background: var(--bg-main);
  }

  div.container:focus {
    outline: none;
  }
</style>
