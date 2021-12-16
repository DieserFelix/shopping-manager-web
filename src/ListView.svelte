<script lang="ts">
  import { Button } from "./components/action"
  import { Card, CardTitle } from "./components/card"
  import { Icon, Tooltip } from "./components/content"
  import { Bar, Container } from "./components/layout"
  import {
    authToken,
    ButtonContexts,
    ButtonTypes,
    decodeToken,
    IconNames,
  } from "./lib"

  let token: string = ""
  authToken.subscribe((value) => {
    token = value
  })
  $: username = decodeToken(token).sub

  let showMenu: boolean = false
</script>

<svelte:head>
  <title>ListView</title>
</svelte:head>

<Bar title="Shopping Manager">
  <Tooltip
    visible={showMenu}
    onClickOutside={() => {
      showMenu = false
      console.log("outside?")
    }}
  >
    <Button
      type={ButtonTypes.BUTTON}
      context={ButtonContexts.NEUTRAL}
      action={() => (showMenu = !showMenu)}
    >
      <Icon>{IconNames.menu}</Icon>
    </Button>
    <Card --width="200px" --margin="0px" slot="content">Henlo {username}</Card>
  </Tooltip>
</Bar>
<Container>
  <Card --width="80%" --margin="15px">
    <CardTitle>Shopping Lists</CardTitle>
  </Card>
</Container>
