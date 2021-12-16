<script lang="ts">
  $: cssVariables = Object.entries($$props)
    .filter(([key]) => key.startsWith("--"))
    .reduce((css, [key, value]) => `${css}${key}: ${value};`, "")
</script>

<div class="card" style={cssVariables}>
  <slot />
</div>

<style>
  div.card {
    width: var(--width);
    margin: var(--margin);
    color: var(--color-card);
    background: var(--bg-card);
    border: 1px solid var(--border-main);
    border-radius: 8px;
  }
</style>
