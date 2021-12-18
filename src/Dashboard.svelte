<script lang="ts">
  import { Card, Title } from "./components/card"
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
    <Title>Shopping Lists</Title>
  </Card>
</Container>
