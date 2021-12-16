<script lang="ts">
  import { Alert } from "../network"

  export let submitHandler: () => void
</script>

<form on:submit|preventDefault={submitHandler}>
  <Alert />
  <slot />
</form>
