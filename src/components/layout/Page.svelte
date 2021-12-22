<script lang="ts">
  import { Bar, Container, Content } from "."
  import { Menu } from "../content"

  export let title: string
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Bar title="Shopping Manager">
  <Menu />
</Bar>
<Container --flex-direction="column">
  <Content>
    <slot />
  </Content>
</Container>
<div class="back">
  <slot name="back" />
</div>

<style>
  div.back {
    position: absolute;
    left: 15px;
    top: 55px;
    color: white;
  }
</style>
