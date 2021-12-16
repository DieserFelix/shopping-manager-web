<script lang="ts">
  export let title: string
</script>

<div class="bar">
  <div class="controls"><slot /></div>
  <div class="title">{title}</div>
</div>

<style>
  div.bar {
    width: 100%;
    height: 50px;
    position: relative;
    background: var(--bg-secondary);
  }

  div.title {
    position: absolute;
    right: 15px;
    color: white;
    font-size: 16pt;
    line-height: 50px;
  }

  div.controls {
    position: absolute;
    left: 15px;
    line-height: 50px;
    color: white;
  }
</style>
