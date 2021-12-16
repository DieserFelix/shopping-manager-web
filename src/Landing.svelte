<script lang="ts">
  import { navigate } from "svelte-navigator"
  import { Button } from "./components/action"
  import { Card, CardBody, CardTitle } from "./components/card"
  import { Form, Input } from "./components/form"
  import { Bar, Container } from "./components/layout"
  import {
    authToken,
    ButtonContexts,
    ButtonTypes,
    InputTypes,
    login,
  } from "./lib"

  let username: string = ""
  let password: string = ""

  const submitHandler = () => {
    login(username, password)
  }

  let token: string = ""
  authToken.subscribe((value) => {
    token = value
  })
  $: if (token) {
    navigate("/dashboard")
  }
</script>

<Bar title="Shopping Manager" />
<Container --justify-content="center">
  <Card --width="500px">
    <CardTitle>Login</CardTitle>
    <CardBody>
      <Form submitHandler={submitHandler}>
        <Input
          id="username"
          label="User:"
          type={InputTypes.TEXT}
          bind:value={username}
        />
        <Input
          id="password"
          label="Password:"
          type={InputTypes.PASSWORD}
          bind:value={password}
        />
        <Button context={ButtonContexts.PRIMARY} type={ButtonTypes.SUBMIT}>
          Submit
        </Button>
      </Form>
    </CardBody>
  </Card>
</Container>
