<script lang="ts">
  import { useMutation } from "@sveltestack/svelte-query"
  import { navigate } from "svelte-navigator"
  import { Button } from "./components/action"
  import { Card, CardBody, Title } from "./components/card"
  import { Form, Input } from "./components/form"
  import { Bar, Container } from "./components/layout"
  import { Alert } from "./components/network"
  import {
    ApiError,
    ButtonContexts,
    ButtonTypes,
    Credentials,
    InputTypes,
    login,
    Routes,
    TokenResponse,
  } from "./lib"

  let username: string = ""
  let password: string = ""
  let apiError: ApiError

  const mutation = useMutation<TokenResponse, ApiError, Credentials>(login, {
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.access_token)
      navigate(Routes.DASHBOARD)
    },
    onError: (error) => {
      apiError = error
    },
  })

  $: errorMessage = apiError ? apiError.message : ""

  const submitHandler = () => {
    $mutation.mutate({ username, password })
  }
</script>

<Bar title="Shopping Manager" />
<Container --justify-content="center">
  <Card --width="500px">
    <CardBody>
      <Title>Login</Title>
      <Form submitHandler={submitHandler}>
        <Alert
          errorMessage={errorMessage}
          dismiss={() => (apiError = undefined)}
        />
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
