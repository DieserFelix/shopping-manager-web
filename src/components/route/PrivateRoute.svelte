<script lang="ts">
  import { navigate } from "svelte-navigator"
  import { authToken } from "../../lib"

  let token: string = ""
  authToken.subscribe((value) => {
    token = value
  })

  $: if (!token) {
    navigate("/")
  }
</script>

{#if token}
  <slot />
{/if}
