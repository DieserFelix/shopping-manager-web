<script lang="ts">
  import { Card, CardTitle } from "./components/card"
  import { Menu } from "./components/content"
  import { Bar, Container } from "./components/layout"
</script>

<svelte:head>
  <title>ListView</title>
</svelte:head>

<Bar title="Shopping Manager">
  <Menu />
</Bar>
<Container>
  <Card --width="80%" --margin="15px">
    <CardTitle>Shopping Lists</CardTitle>
  </Card>
</Container>
