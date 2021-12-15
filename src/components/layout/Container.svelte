<script lang="ts">
</script>

<div class="container">
  <slot />
</div>

<style>
  div.container {
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: var(--bg-main);
  }
</style>
