<script lang="ts">
  export let style: "outlined" | "rounded" | "sharp" | "two-tone" | "" = ""
  $: cssVariables = Object.entries($$props)
    .filter(([key]) => key.startsWith("--"))
    .reduce((css, [key, value]) => `${css}${key}: ${value};`, "")
</script>

<span
  class={style ? `material-icons-${style}` : "material-icons"}
  style={cssVariables}
>
  <slot />
</span>

<style>
  span {
    color: var(--color);
    vertical-align: middle;
  }
</style>
