<script lang="ts">
  export let title: string
</script>

<div class="bar">
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
    color: rgb(255, 255, 255);
    font-size: 16pt;
    line-height: 50px;
  }
</style>
