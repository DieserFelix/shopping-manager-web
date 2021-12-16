<script lang="ts">
  import { useMutation } from "@sveltestack/svelte-query"
  import { navigate } from "svelte-navigator"
  import { Icon, Tooltip } from "."
  import {
    ApiError,
    authFetch,
    authToken,
    ButtonContexts,
    ButtonTypes,
    decodeToken,
    errorMessage,
    FetchParams,
    getLogoutApiRoute,
    IconNames,
    Routes,
  } from "../../lib"
  import { Button } from "../action"
  import { Card, CardFooter } from "../card"
  import { ListGroup, ListGroupAction } from "../list"

  export let width: string = "250px"
  let menuShown: boolean = false

  let token: string = ""
  authToken.subscribe((value) => (token = value))
  $: username = decodeToken(token).sub

  const mutation = useMutation<void, ApiError, FetchParams>(
    (params) => authFetch<void>(params),
    {
      onSuccess: () => {
        authToken.set("")
      },
      onError: (error) => {
        errorMessage.set(error.message)
      },
    },
  )

  const logout = () => {
    $mutation.mutate({
      url: getLogoutApiRoute(),
      method: "POST",
      token: token,
    })
  }
</script>

<Tooltip
  visible={menuShown}
  onClickOutside={() => {
    menuShown = false
  }}
>
  <Button
    type={ButtonTypes.BUTTON}
    context={ButtonContexts.NEUTRAL}
    action={() => (menuShown = !menuShown)}
  >
    <Icon>{IconNames.menu}</Icon>
  </Button>
  <Card --width={width} slot="content">
    <ListGroup>
      <ListGroupAction action={() => navigate(Routes.LISTS)}>
        Shopping Lists
      </ListGroupAction>
      <ListGroupAction action={() => navigate(Routes.ARTICLES)}>
        Articles
      </ListGroupAction>
      <ListGroupAction action={() => navigate(Routes.STORES)}>
        Stores
      </ListGroupAction>
      <ListGroupAction action={() => navigate(Routes.CATEGORIES)}>
        Categories
      </ListGroupAction>
    </ListGroup>
    <CardFooter>
      <div class="username">
        {username}
      </div>
      <div class="logout">
        <Button
          type={ButtonTypes.BUTTON}
          context={ButtonContexts.NEUTRAL}
          action={() => logout()}
        >
          <Icon>{IconNames.logout}</Icon>
        </Button>
      </div>
    </CardFooter>
  </Card>
</Tooltip>

<style>
  .username {
    position: absolute;
    left: 5px;
    bottom: 5px;
  }

  .logout {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
</style>
