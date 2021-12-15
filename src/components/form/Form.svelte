<script lang="ts">
  export let submitHandler: () => void
</script>

<form on:submit|preventDefault={submitHandler}>
  <slot />
</form>
