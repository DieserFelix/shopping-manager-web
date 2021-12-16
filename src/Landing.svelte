<script lang="ts">
  import { useMutation } from "@sveltestack/svelte-query"
  import { navigate } from "svelte-navigator"
  import { Button } from "./components/action"
  import { Card, CardBody, CardTitle } from "./components/card"
  import { Form, Input } from "./components/form"
  import { Bar, Container } from "./components/layout"
  import {
    ApiError,
    authToken,
    ButtonContexts,
    ButtonTypes,
    Credentials,
    errorMessage,
    InputTypes,
    login,
    Routes,
    TokenResponse,
  } from "./lib"

  let username: string = ""
  let password: string = ""

  const mutation = useMutation<TokenResponse, ApiError, Credentials>(login, {
    onSuccess: (data) => {
      authToken.set(data.access_token)
      navigate(Routes.DASHBOARD)
    },
    onError: (error) => {
      errorMessage.set(error.message)
    },
  })

  const submitHandler = () => {
    $mutation.mutate({ username, password })
  }
</script>

<Bar title="Shopping Manager" />
<Container --justify-content="center">
  <Card --width="500px">
    <CardBody>
      <CardTitle>Login</CardTitle>
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
