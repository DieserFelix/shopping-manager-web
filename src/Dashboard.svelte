<script lang="ts">
  import { navigate } from "svelte-navigator"
  import { Button } from "./components/action"
  import { Card, CardBody } from "./components/card"
  import { Menu } from "./components/content"
  import { Bar, Container } from "./components/layout"
  import { ButtonContexts, ButtonTypes, Routes } from "./lib"
</script>

<svelte:head>
  <title>Shopping Manager - Dashboard</title>
</svelte:head>

<Bar title="Shopping Manager">
  <Menu />
</Bar>
<Container --justify-content="center" --flex-direction="row">
  <Card --width="20%">
    <CardBody>
      <Button
        type={ButtonTypes.BUTTON}
        context={ButtonContexts.PRIMARY}
        action={() => navigate(Routes.LISTS)}
      >
        Shopping Lists
      </Button>
    </CardBody>
  </Card>
  <Card --width="20%">
    <CardBody>
      <Button
        type={ButtonTypes.BUTTON}
        context={ButtonContexts.PRIMARY}
        action={() => navigate(Routes.ARTICLES)}
      >
        Articles
      </Button>
    </CardBody>
  </Card>
</Container>
